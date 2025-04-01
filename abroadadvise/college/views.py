from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from django.utils.text import slugify
from django.conf import settings
import os
import json

from core.pagination import StandardResultsSetPagination
from core.filters import CollegeFilter
from .models import College, CollegeBranch, CollegeGallery
from destination.models import Destination
from university.models import University
from core.models import District
from .serializers import CollegeSerializer
from inquiry.models import Inquiry
from inquiry.serializers import InquirySerializer
from .pagination import CollegePagination  # ✅ import your custom pagination

class CollegeListView(ListAPIView):
    serializer_class = CollegeSerializer
    pagination_class = StandardResultsSetPagination
    pagination_class = CollegePagination  # ✅ use custom pagination
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_class = CollegeFilter
    search_fields = ["name", "about"]

    def get_queryset(self):
        return College.objects.prefetch_related(
            "districts", "study_abroad_destinations", "affiliated_universities",
            "gallery_images", "branches"
        ).order_by("-priority", "-id").distinct()


class CollegeDetailView(RetrieveAPIView):
    queryset = College.objects.prefetch_related(
        "districts", "study_abroad_destinations", "affiliated_universities",
        "gallery_images", "branches"
    )
    serializer_class = CollegeSerializer
    lookup_field = "slug"


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def create_college(request):
    data = request.data

    try:
        branches_data = json.loads(data.get("branches", "[]"))
        study_abroad_destinations = json.loads(data.get("study_abroad_destinations", "[]"))
        affiliated_universities = json.loads(data.get("affiliated_universities", "[]"))
        districts = json.loads(data.get("districts", "[]"))
    except json.JSONDecodeError:
        return Response({"error": "Invalid JSON format in fields."}, status=status.HTTP_400_BAD_REQUEST)

    required_fields = ["name"]
    missing_fields = [field for field in required_fields if not data.get(field)]
    if missing_fields:
        return Response({"error": f"Missing required fields: {', '.join(missing_fields)}"}, status=status.HTTP_400_BAD_REQUEST)

    requested_slug = data.get("slug")
    base_slug = slugify(requested_slug) if requested_slug else slugify(data.get("name", ""))
    slug = base_slug
    counter = 1
    while College.objects.filter(slug=slug).exists():
        slug = f"{base_slug}-{counter}"
        counter += 1

    college_data = data.copy()
    college_data["slug"] = slug

    serializer = CollegeSerializer(data=college_data)
    if serializer.is_valid():
        college = serializer.save()
        college.study_abroad_destinations.set(Destination.objects.filter(id__in=study_abroad_destinations))
        college.affiliated_universities.set(University.objects.filter(id__in=affiliated_universities))
        college.districts.set(District.objects.filter(id__in=districts))

        if "logo" in request.FILES:
            college.logo = request.FILES["logo"]
        if "cover_photo" in request.FILES:
            college.cover_photo = request.FILES["cover_photo"]
        if "brochure" in request.FILES:
            college.brochure = request.FILES["brochure"]
        college.save()

        for branch in branches_data:
            CollegeBranch.objects.create(college=college, **branch)

        for file in request.FILES.getlist("gallery_images"):
            CollegeGallery.objects.create(college=college, image=file)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PUT", "PATCH"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def update_college(request, slug):
    college = get_object_or_404(College, slug=slug)
    data = request.data

    branches_data = json.loads(data.get("branches", "[]"))
    study_abroad_destinations = json.loads(data.get("study_abroad_destinations", "[]"))
    affiliated_universities = json.loads(data.get("affiliated_universities", "[]"))
    districts = json.loads(data.get("districts", "[]"))

    serializer = CollegeSerializer(college, data=data, partial=True)
    if serializer.is_valid():
        college = serializer.save()
        college.study_abroad_destinations.set(Destination.objects.filter(id__in=study_abroad_destinations))
        college.affiliated_universities.set(University.objects.filter(id__in=affiliated_universities))
        college.districts.set(District.objects.filter(id__in=districts))

        if "logo" in request.FILES:
            college.logo = request.FILES["logo"]
        if "cover_photo" in request.FILES:
            college.cover_photo = request.FILES["cover_photo"]
        if "brochure" in request.FILES:
            college.brochure = request.FILES["brochure"]
        college.save()

        college.branches.all().delete()
        for branch in branches_data:
            CollegeBranch.objects.create(college=college, **branch)

        for file in request.FILES.getlist("gallery_images"):
            CollegeGallery.objects.create(college=college, image=file)

        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_college(request, slug):
    college = get_object_or_404(College, slug=slug)
    college.study_abroad_destinations.clear()
    college.affiliated_universities.clear()
    college.districts.clear()

    college.branches.all().delete()

    for gallery_image in college.gallery_images.all():
        if gallery_image.image:
            image_path = os.path.join(settings.MEDIA_ROOT, str(gallery_image.image))
            if os.path.exists(image_path):
                os.remove(image_path)
        gallery_image.delete()

    def delete_file(file_field):
        if file_field:
            file_path = os.path.join(settings.MEDIA_ROOT, str(file_field))
            if os.path.exists(file_path):
                os.remove(file_path)

    delete_file(college.logo)
    delete_file(college.cover_photo)
    delete_file(college.brochure)

    college.delete()
    return Response({"message": "College deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard_college_view(request):
    user = request.user
    if not hasattr(user, "college") or not user.college:
        return Response({"error": "User is not linked to any college."}, status=status.HTTP_403_FORBIDDEN)

    college = user.college
    inquiries = Inquiry.objects.filter(college=college).order_by('-created_at')

    serializer = CollegeSerializer(college, context={"request": request})
    inquiry_serializer = InquirySerializer(inquiries, many=True)

    response_data = serializer.data
    response_data['inquiries'] = inquiry_serializer.data

    return Response(response_data, status=status.HTTP_200_OK)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def update_college_dashboard(request):
    user = request.user
    if not hasattr(user, "college") or not user.college:
        return Response({"error": "User is not linked to any college."}, status=status.HTTP_403_FORBIDDEN)

    college = user.college
    data = request.data

    try:
        study_abroad_destinations = json.loads(data.get("study_abroad_destinations", "[]"))
        affiliated_universities = json.loads(data.get("affiliated_universities", "[]"))
        branches_data = json.loads(data.get("branches", "[]"))
        districts = json.loads(data.get("districts", "[]"))
    except json.JSONDecodeError:
        return Response({"error": "Invalid JSON format in fields."}, status=status.HTTP_400_BAD_REQUEST)

    serializer = CollegeSerializer(college, data=data, partial=True)
    if serializer.is_valid():
        college = serializer.save()

        # Preserve related fields
        if study_abroad_destinations:
            college.study_abroad_destinations.set(Destination.objects.filter(id__in=study_abroad_destinations))

        if affiliated_universities:
            college.affiliated_universities.set(University.objects.filter(id__in=affiliated_universities))

        if districts:
            college.districts.set(District.objects.filter(id__in=districts))

        # Update file fields
        if "logo" in request.FILES:
            college.logo = request.FILES["logo"]
        if "cover_photo" in request.FILES:
            college.cover_photo = request.FILES["cover_photo"]
        if "brochure" in request.FILES:
            college.brochure = request.FILES["brochure"]

        college.save()

        # Update branches
        if branches_data:
            college.branches.all().delete()
            for branch in branches_data:
                CollegeBranch.objects.create(college=college, **branch)

        # Handle gallery
        existing_gallery = json.loads(data.get("existing_gallery_images", "[]"))
        deleted_gallery = json.loads(data.get("deleted_gallery_images", "[]"))

        if deleted_gallery:
            for image_id in deleted_gallery:
                image = CollegeGallery.objects.filter(id=image_id, college=college).first()
                if image:
                    if image.image:
                        image_path = os.path.join(settings.MEDIA_ROOT, str(image.image))
                        if os.path.exists(image_path):
                            os.remove(image_path)
                    image.delete()

        for file in request.FILES.getlist("gallery_images"):
            CollegeGallery.objects.create(college=college, image=file)

        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
