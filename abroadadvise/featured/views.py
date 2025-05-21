from rest_framework import generics, permissions, status, filters
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.conf import settings

from .models import FeaturedPage
from .serializers import FeaturedPageSerializer
from .pagination import FeaturedPagination  # or your custom one
import os

# ✅ List all featured pages (Public, with optional search)
class FeaturedPageListView(generics.ListAPIView):
    queryset = FeaturedPage.objects.filter(is_active=True).order_by("priority")
    serializer_class = FeaturedPageSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'slug']
    pagination_class = FeaturedPagination  # ✅ handles ?page=1&page_size=12

# ✅ Get a single featured page by slug (Public)
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_featured_page(request, slug):
    try:
        page = FeaturedPage.objects.get(slug=slug, is_active=True)
        serializer = FeaturedPageSerializer(page, context={'request': request})
        return Response(serializer.data)
    except FeaturedPage.DoesNotExist:
        return Response({"error": "Featured page not found"}, status=status.HTTP_404_NOT_FOUND)


# ✅ Create a new featured page (Admin only)
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated, permissions.IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def create_featured_page(request):
    serializer = FeaturedPageSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# ✅ Update an existing featured page by slug (Admin only)
@api_view(['PUT', 'PATCH'])
@permission_classes([permissions.IsAuthenticated, permissions.IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def update_featured_page(request, slug):
    try:
        page = FeaturedPage.objects.get(slug=slug)
        serializer = FeaturedPageSerializer(page, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except FeaturedPage.DoesNotExist:
        return Response({"error": "Featured page not found"}, status=status.HTTP_404_NOT_FOUND)


# ✅ Delete a featured page by slug (Admin only)
@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated, permissions.IsAdminUser])
def delete_featured_page(request, slug):
    try:
        page = FeaturedPage.objects.get(slug=slug)
        page.delete()
        return Response({"message": "Featured page deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except FeaturedPage.DoesNotExist:
        return Response({"error": "Featured page not found"}, status=status.HTTP_404_NOT_FOUND)
