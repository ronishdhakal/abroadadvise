import os
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.generics import ListAPIView
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from core.pagination import StandardResultsSetPagination
from core.filters import DestinationFilter
from .models import Destination
from .serializers import StudyDestinationSerializer
from django.conf import settings

# Publicly Accessible List of Destinations with Pagination & Filtering
class DestinationListView(ListAPIView):
    queryset = Destination.objects.all()
    serializer_class = StudyDestinationSerializer
    permission_classes = [AllowAny]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_class = DestinationFilter
    search_fields = ['title']

    def get_serializer_context(self):
        """Ensure media URLs are correctly returned"""
        return {'request': self.request}


# Publicly Accessible Single Destination View
@api_view(['GET'])
@permission_classes([AllowAny])
def get_destination(request, slug):
    try:
        destination = Destination.objects.get(slug=slug)
        serializer = StudyDestinationSerializer(destination, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Destination.DoesNotExist:
        return Response({"error": "Destination not found"}, status=status.HTTP_404_NOT_FOUND)


# Publicly Accessible: Create a New Destination (Handles Image Uploads)
@api_view(['POST'])
@permission_classes([AllowAny])
@parser_classes([MultiPartParser, FormParser])
def create_destination(request):
    """Create a new destination and properly handle file uploads"""
    serializer = StudyDestinationSerializer(data=request.data, context={'request': request})
    
    if serializer.is_valid():
        destination = serializer.save()

        # Handle file uploads explicitly
        if "country_logo" in request.FILES:
            destination.country_logo = request.FILES["country_logo"]
        if "cover_page" in request.FILES:
            destination.cover_page = request.FILES["cover_page"]

        destination.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Publicly Accessible: Update an Existing Destination (Handles Image Uploads)
@api_view(['PUT', 'PATCH'])
@permission_classes([AllowAny])
@parser_classes([MultiPartParser, FormParser])
def update_destination(request, slug):
    """ ✅ Updates destination data and handles image updates properly """
    try:
        destination = Destination.objects.get(slug=slug)

        # Make a copy of the incoming data, as the original data may not have image fields
        updated_data = request.data.copy()

        # Handle the country_logo and cover_page fields properly
        if 'country_logo' not in updated_data and not request.FILES.get('country_logo'):
            updated_data['country_logo'] = destination.country_logo

        if 'cover_page' not in updated_data and not request.FILES.get('cover_page'):
            updated_data['cover_page'] = destination.cover_page

        serializer = StudyDestinationSerializer(destination, data=updated_data, partial=True, context={'request': request})

        if serializer.is_valid():
            destination = serializer.save()

            # Handle image updates (Only update if a new file is provided)
            if "country_logo" in request.FILES:
                if destination.country_logo:
                    destination.country_logo.delete()  # Delete old image if exists
                destination.country_logo = request.FILES["country_logo"]

            if "cover_page" in request.FILES:
                if destination.cover_page:
                    destination.cover_page.delete()  # Delete old image if exists
                destination.cover_page = request.FILES["cover_page"]

            destination.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Destination.DoesNotExist:
        return Response({"error": "Destination not found"}, status=status.HTTP_404_NOT_FOUND)


# Publicly Accessible: Delete a Destination
@api_view(['DELETE'])
def delete_destination(request, slug):
    """Deletes a destination and removes associated image files"""
    try:
        destination = Destination.objects.get(slug=slug)
        
        # Delete images from storage if they exist
        def delete_file(file_field):
            if file_field:
                file_path = os.path.join(settings.MEDIA_ROOT, str(file_field))
                if os.path.exists(file_path):
                    os.remove(file_path)

        delete_file(destination.country_logo)
        delete_file(destination.cover_page)

        destination.delete()
        return Response({"message": "Destination deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    
    except Destination.DoesNotExist:
        return Response({"error": "Destination not found"}, status=status.HTTP_404_NOT_FOUND)
