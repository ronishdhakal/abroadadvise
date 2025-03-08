from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils.text import slugify

from core.pagination import StandardResultsSetPagination
from core.filters import ConsultancyFilter
from authentication.permissions import IsAdminUser, IsConsultancyUser
from .models import Consultancy
from .serializers import ConsultancySerializer

# ✅ Publicly Accessible List of Consultancies with Pagination, Search, and Filtering
class ConsultancyListView(ListAPIView):
    serializer_class = ConsultancySerializer
    permission_classes = [AllowAny]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_class = ConsultancyFilter
    search_fields = ["name", "services"]

    def get_queryset(self):
        queryset = Consultancy.objects.select_related("user", "verified").prefetch_related(
            "districts", "study_abroad_destinations", "test_preparation", "partner_universities"
        ).order_by("priority", "-id")  # ✅ Order by priority first, then by creation order

        # ✅ Ensure filtering for districts (ManyToManyField)
        district_ids = self.request.GET.getlist("districts")
        if district_ids:
            queryset = queryset.filter(districts__id__in=district_ids)

        # ✅ Filter consultancies by university slug if provided in request
        university_slug = self.request.GET.get("university")
        if university_slug:
            queryset = queryset.filter(partner_universities__slug=university_slug)

        return queryset.distinct()  # Avoid duplicate results

# ✅ Publicly Accessible Single Consultancy Detail View
class ConsultancyDetailView(RetrieveAPIView):
    queryset = Consultancy.objects.select_related("user", "verified").prefetch_related(
        "districts", "study_abroad_destinations", "test_preparation", "gallery_images", "branches", "partner_universities"
    )
    serializer_class = ConsultancySerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"

# ✅ Create Consultancy (Admin Only)
@api_view(["POST"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def create_consultancy(request):
    serializer = ConsultancySerializer(data=request.data)
    if serializer.is_valid():
        consultancy = serializer.save()

        # ✅ Ensure slug is created properly and is unique
        if not consultancy.slug:
            consultancy.slug = slugify(consultancy.name)
        while Consultancy.objects.filter(slug=consultancy.slug).exists():
            consultancy.slug = f"{consultancy.slug}-{consultancy.id}"
        
        consultancy.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Update Consultancy (Admin & Consultancy User)
@api_view(["PUT", "PATCH"])
@permission_classes([IsAdminUser | IsConsultancyUser])  
@parser_classes([MultiPartParser, FormParser])
def update_consultancy(request, slug):
    consultancy = get_object_or_404(Consultancy, slug=slug)
    serializer = ConsultancySerializer(consultancy, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Delete Consultancy (Admin Only)
@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def delete_consultancy(request, slug):
    consultancy = get_object_or_404(Consultancy, slug=slug)
    consultancy.delete()
    return Response({"message": "Consultancy deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
