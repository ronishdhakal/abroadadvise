from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils.text import slugify
from django.db.models import Case, When, Value, BooleanField
from django.utils.timezone import now

from .models import Scholarship
from .serializers import ScholarshipSerializer
from destination.models import Destination
from core.pagination import StandardResultsSetPagination
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from core.filters import ScholarshipFilter  # ✅ Import your filter
from .pagination import ScholarshipPagination


# ✅ Public List View
class ScholarshipListView(ListAPIView):
    serializer_class = ScholarshipSerializer
    pagination_class = ScholarshipPagination
    filterset_class = ScholarshipFilter
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ["title", "by", "detail"]

    def get_queryset(self):
        today = now().date()
        return Scholarship.objects.filter(is_published=True)\
            .annotate(
                is_closed=Case(
                    When(active_to__lt=today, then=Value(True)),
                    default=Value(False),
                    output_field=BooleanField(),
                )
            )\
            .select_related("destination")\
            .order_by("is_closed", "active_to", "-published_date")



# ✅ Public Detail View
class ScholarshipDetailView(RetrieveAPIView):
    serializer_class = ScholarshipSerializer
    queryset = Scholarship.objects.select_related("destination")
    lookup_field = "slug"


# ✅ Admin Panel - Create Scholarship
@api_view(["POST"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def create_scholarship(request):
    data = request.data.copy()

    requested_slug = data.get("slug")
    base_slug = slugify(requested_slug) if requested_slug else slugify(data.get("title", ""))
    slug = base_slug
    counter = 1
    while Scholarship.objects.filter(slug=slug).exists():
        slug = f"{base_slug}-{counter}"
        counter += 1

    data["slug"] = slug

    serializer = ScholarshipSerializer(data=data)
    if serializer.is_valid():
        scholarship = serializer.save()

        # ✅ Handle File Uploads
        if "featured_image" in request.FILES:
            scholarship.featured_image = request.FILES["featured_image"]
            scholarship.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ Admin Panel - Update Scholarship
@api_view(["PUT", "PATCH"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def update_scholarship(request, slug):
    scholarship = get_object_or_404(Scholarship, slug=slug)
    data = request.data

    serializer = ScholarshipSerializer(scholarship, data=data, partial=True)
    if serializer.is_valid():
        scholarship = serializer.save()

        # ✅ Update featured image if provided
        if "featured_image" in request.FILES:
            scholarship.featured_image = request.FILES["featured_image"]
            scholarship.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ Admin Panel - Delete Scholarship
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_scholarship(request, slug):
    scholarship = get_object_or_404(Scholarship, slug=slug)

    # ✅ Delete image file if exists
    if scholarship.featured_image:
        scholarship.featured_image.delete(save=False)

    scholarship.delete()
    return Response({"message": "Scholarship deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
