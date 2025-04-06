from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils.text import slugify
from django.contrib.auth import get_user_model
from .pagination import ConsultancyPagination  # Use your custom pagination class
import json
import os
from django.conf import settings

from core.pagination import StandardResultsSetPagination
from core.filters import ConsultancyFilter
from .models import Consultancy, ConsultancyGallery, ConsultancyBranch
from destination.models import Destination
from exam.models import Exam
from university.models import University
from core.models import District
from .serializers import ConsultancySerializer, ConsultancyBranchSerializer
from .serializers import ConsultancyMinimalSerializer
from inquiry.models import Inquiry  # Import Inquiry model
from inquiry.serializers import InquirySerializer  # Import the InquirySerializer

User = get_user_model()

class ConsultancyListView(ListAPIView):
    serializer_class = ConsultancySerializer
    pagination_class = ConsultancyPagination
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_class = ConsultancyFilter
    search_fields = ["name", "services"]

    def get_queryset(self):
        return Consultancy.objects.prefetch_related(
            "districts",
            "study_abroad_destinations",
            "test_preparation",
            "partner_universities",
            "gallery_images",
            "branches",
        ).order_by("priority", "-id").distinct()

# ✅ Publicly Accessible Single Consultancy Detail View
class ConsultancyDetailView(RetrieveAPIView):
    queryset = Consultancy.objects.prefetch_related(
        "districts", "study_abroad_destinations", "test_preparation",
        "gallery_images", "branches", "partner_universities"
    )
    serializer_class = ConsultancySerializer
    lookup_field = "slug"

# ✅ Dashboard - Get Consultancies
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard_consultancy_list(request):
    consultancies = Consultancy.objects.all()
    serializer = ConsultancySerializer(consultancies, many=True, context={"request": request})
    return Response(serializer.data)

from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from django.utils.text import slugify
from consultancy.models import Consultancy, ConsultancyBranch, ConsultancyGallery
from consultancy.serializers import ConsultancySerializer
from destination.models import Destination
from exam.models import Exam
from university.models import University
from core.models import District
import json


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def create_consultancy(request):
    """ ✅ Creates a new consultancy with optional manual slug. """
    data = request.data  # ⚠️ Immutable — do NOT modify directly

    try:
        branches_data = json.loads(data.get("branches", "[]"))
        study_abroad_destinations = json.loads(data.get("study_abroad_destinations", "[]"))
        test_preparation = json.loads(data.get("test_preparation", "[]"))
        partner_universities = json.loads(data.get("partner_universities", "[]"))
        districts = json.loads(data.get("districts", "[]"))
    except json.JSONDecodeError:
        return Response({"error": "Invalid JSON format in fields."}, status=status.HTTP_400_BAD_REQUEST)

    # ✅ Required Fields Check
    required_fields = ["name"]
    missing_fields = [field for field in required_fields if not data.get(field)]
    if missing_fields:
        return Response({"error": f"Missing required fields: {', '.join(missing_fields)}"}, status=status.HTTP_400_BAD_REQUEST)

    # ✅ Generate unique slug (manual or auto)
    requested_slug = data.get("slug")
    base_slug = slugify(requested_slug) if requested_slug else slugify(data.get("name", ""))
    slug = base_slug
    counter = 1
    while Consultancy.objects.filter(slug=slug).exists():
        slug = f"{base_slug}-{counter}"
        counter += 1

    # ✅ Create mutable dict for serializer
    consultancy_data = data.copy()
    consultancy_data["slug"] = slug

    serializer = ConsultancySerializer(data=consultancy_data)
    if serializer.is_valid():
        consultancy = serializer.save()

        # ✅ Assign ManyToMany Fields
        consultancy.study_abroad_destinations.set(Destination.objects.filter(id__in=study_abroad_destinations))
        consultancy.test_preparation.set(Exam.objects.filter(id__in=test_preparation))
        consultancy.partner_universities.set(University.objects.filter(id__in=partner_universities))
        consultancy.districts.set(District.objects.filter(id__in=districts))

        # ✅ Handle File Uploads
        if "logo" in request.FILES:
            consultancy.logo = request.FILES["logo"]
        if "cover_photo" in request.FILES:
            consultancy.cover_photo = request.FILES["cover_photo"]
        if "brochure" in request.FILES:
            consultancy.brochure = request.FILES["brochure"]
        consultancy.save()

        # ✅ Save Branches
        for branch in branches_data:
            ConsultancyBranch.objects.create(consultancy=consultancy, **branch)

        # ✅ Save Gallery Images
        for file in request.FILES.getlist("gallery_images"):
            ConsultancyGallery.objects.create(consultancy=consultancy, image=file)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    print("❌ Validation Errors:", serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ Update Consultancy
@api_view(["PUT", "PATCH"])
@permission_classes([IsAuthenticated, IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def update_consultancy(request, slug):
    """ ✅ Fully updates a consultancy, ensuring pre-filled data updates correctly. """

    consultancy = get_object_or_404(Consultancy, slug=slug)
    data = request.data


    # ✅ Convert JSON string to lists
    branches_data = json.loads(data.get("branches", "[]"))
    study_abroad_destinations = json.loads(data.get("study_abroad_destinations", "[]"))
    test_preparation = json.loads(data.get("test_preparation", "[]"))
    partner_universities = json.loads(data.get("partner_universities", "[]"))
    districts = json.loads(data.get("districts", "[]"))

    serializer = ConsultancySerializer(consultancy, data=data, partial=True)

    if serializer.is_valid():
        consultancy = serializer.save()

        # ✅ Assign ManyToMany Fields
        consultancy.study_abroad_destinations.set(Destination.objects.filter(id__in=study_abroad_destinations))
        consultancy.test_preparation.set(Exam.objects.filter(id__in=test_preparation))
        consultancy.partner_universities.set(University.objects.filter(id__in=partner_universities))
        consultancy.districts.set(District.objects.filter(id__in=districts))

        # ✅ Handle File Uploads (Only update if a new file is provided)
        if "logo" in request.FILES:
            consultancy.logo = request.FILES["logo"]
        if "cover_photo" in request.FILES:
            consultancy.cover_photo = request.FILES["cover_photo"]
        if "brochure" in request.FILES:
            consultancy.brochure = request.FILES["brochure"]

        consultancy.save()

        # ✅ Update Branches (Delete old and add new)
        consultancy.branches.all().delete()
        for branch in branches_data:
            ConsultancyBranch.objects.create(consultancy=consultancy, **branch)

        # ✅ Save New Gallery Images (Keep old ones, add new ones)
        for file in request.FILES.getlist("gallery_images"):
            ConsultancyGallery.objects.create(consultancy=consultancy, image=file)

        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Delete Consultancy (Handles Deleting Files & Related Data)
@api_view(["DELETE"])
@permission_classes([IsAuthenticated, IsAdminUser])
def delete_consultancy(request, slug):
    """ ✅ Deletes a consultancy and ensures all related data and files are removed safely. """

    consultancy = get_object_or_404(Consultancy, slug=slug)

    # ✅ Delete related ManyToMany relationships
    consultancy.study_abroad_destinations.clear()
    consultancy.test_preparation.clear()
    consultancy.partner_universities.clear()
    consultancy.districts.clear()

    # ✅ Delete Branches
    consultancy.branches.all().delete()

    # ✅ Delete Gallery Images & Remove Files from System
    for gallery_image in consultancy.gallery_images.all():
        if gallery_image.image:
            image_path = os.path.join(settings.MEDIA_ROOT, str(gallery_image.image))
            if os.path.exists(image_path):
                os.remove(image_path)
        gallery_image.delete()

    # ✅ Delete Consultancy Logo, Cover Photo, and Brochure Files
    def delete_file(file_field):
        if file_field:
            file_path = os.path.join(settings.MEDIA_ROOT, str(file_field))
            if os.path.exists(file_path):
                os.remove(file_path)

    delete_file(consultancy.logo)
    delete_file(consultancy.cover_photo)
    delete_file(consultancy.brochure)

    # ✅ Delete the consultancy itself
    consultancy.delete()

    return Response({"message": "Consultancy deleted successfully"}, status=status.HTTP_204_NO_CONTENT)



# ✅ Dashboard - Fetch Logged-in User's Consultancy Profile
@api_view(["GET"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def consultancy_dashboard_view(request):
    """ ✅ Fetch the consultancy profile linked to the logged-in user and related inquiries. """
    user = request.user

    # Check if user is authenticated
    if not user.is_authenticated:
        return Response({"error": "User authentication required."}, status=status.HTTP_401_UNAUTHORIZED)

    # Fetch the consultancy linked to the user
    consultancy = Consultancy.objects.filter(id=user.consultancy.id).first()
    if not consultancy:
        return Response({"error": "No consultancy is linked to this user."}, status=status.HTTP_404_NOT_FOUND)

    # Fetch inquiries related to the consultancy
    inquiries = Inquiry.objects.filter(consultancy=consultancy).order_by('-created_at')  # Fetch inquiries for the consultancy

    # Serialize consultancy data
    serializer = ConsultancySerializer(consultancy, context={"request": request})

    # Serialize inquiries data
    inquiry_serializer = InquirySerializer(inquiries, many=True)

    # Return consultancy data and related inquiries without modifying the existing return structure
    response_data = serializer.data  # Original response structure
    response_data['inquiries'] = inquiry_serializer.data  # Add inquiries to the response

    return Response(response_data, status=status.HTTP_200_OK)


# ✅ New Update API for Consultancy Users
@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def update_consultancy_dashboard(request):
    """ ✅ Allows a logged-in consultancy user to update their own profile without wiping unmodified fields. """
    user = request.user

    if not hasattr(user, "consultancy") or not user.consultancy:
        return Response({"error": "User is not linked to any consultancy."}, status=status.HTTP_403_FORBIDDEN)

    consultancy = user.consultancy
    data = request.data

    # ✅ Parse optional JSON fields only if present
    branches_data = json.loads(data.get("branches", "[]")) if "branches" in data else None
    study_abroad_destinations = json.loads(data.get("study_abroad_destinations", "[]")) if "study_abroad_destinations" in data else None
    test_preparation = json.loads(data.get("test_preparation", "[]")) if "test_preparation" in data else None
    partner_universities = json.loads(data.get("partner_universities", "[]")) if "partner_universities" in data else None
    districts = json.loads(data.get("districts", "[]")) if "districts" in data else None

    serializer = ConsultancySerializer(consultancy, data=data, partial=True)

    if serializer.is_valid():
        consultancy = serializer.save()

        # ✅ Conditional many-to-many updates (only if sent)
        if study_abroad_destinations is not None:
            consultancy.study_abroad_destinations.set(Destination.objects.filter(id__in=study_abroad_destinations))

        if test_preparation is not None:
            consultancy.test_preparation.set(Exam.objects.filter(id__in=test_preparation))

        if partner_universities is not None:
            consultancy.partner_universities.set(University.objects.filter(id__in=partner_universities))

        if districts is not None:
            consultancy.districts.set(District.objects.filter(id__in=districts))

        # ✅ Conditional branches update
        if branches_data is not None:
            consultancy.branches.all().delete()
            for branch in branches_data:
                ConsultancyBranch.objects.create(consultancy=consultancy, **branch)

        # ✅ File fields (optional)
        if "logo" in request.FILES:
            consultancy.logo = request.FILES["logo"]
        if "cover_photo" in request.FILES:
            consultancy.cover_photo = request.FILES["cover_photo"]
        if "brochure" in request.FILES:
            consultancy.brochure = request.FILES["brochure"]

        consultancy.save()

        # ✅ Gallery Uploads (optional append)
        for file in request.FILES.getlist("gallery_images"):
            ConsultancyGallery.objects.create(consultancy=consultancy, image=file)

        # ✅ Gallery Deletion (optional)
        if "deleted_gallery_images" in data:
            deleted_ids = json.loads(data.get("deleted_gallery_images", "[]"))
            for image_id in deleted_ids:
                image = ConsultancyGallery.objects.filter(id=image_id, consultancy=consultancy).first()
                if image and image.image:
                    image.image.delete(save=False)  # remove file from storage
                if image:
                    image.delete()

        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




@api_view(['GET'])
@permission_classes([AllowAny])
def consultancy_dropdown_list(request):
    """Returns minimal list of consultancies for dropdowns (id + name only)."""
    search = request.GET.get('search', '')
    consultancies = Consultancy.objects.filter(name__icontains=search).order_by('name')
    serializer = ConsultancyMinimalSerializer(consultancies, many=True)
    return Response(serializer.data)