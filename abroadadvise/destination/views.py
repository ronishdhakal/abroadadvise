from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from core.pagination import StandardResultsSetPagination
from core.filters import DestinationFilter
from authentication.permissions import IsAdminUser
from .models import Destination
from .serializers import StudyDestinationSerializer

# ✅ Publicly Accessible List of Destinations with Pagination & Filtering
class DestinationListView(ListAPIView):
    queryset = Destination.objects.all()
    serializer_class = StudyDestinationSerializer
    permission_classes = [AllowAny]  # ✅ Public access allowed
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_class = DestinationFilter
    search_fields = ['title']

    def get_serializer_context(self):
        """Ensure media URLs are correctly returned"""
        return {'request': self.request}  # ✅ Adds request context for full media URLs


# ✅ Publicly Accessible Single Destination View
@api_view(['GET'])
@permission_classes([AllowAny])  # ✅ Public access allowed
def get_destination(request, slug):
    try:
        destination = Destination.objects.get(slug=slug)
        serializer = StudyDestinationSerializer(destination, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Destination.DoesNotExist:
        return Response({"error": "Destination not found"}, status=status.HTTP_404_NOT_FOUND)


# ✅ Admin-Only: Create a New Destination
@api_view(['POST'])
@permission_classes([IsAdminUser])  
@parser_classes([MultiPartParser, FormParser])  
def create_destination(request):
    serializer = StudyDestinationSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ Admin-Only: Update an Existing Destination
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAdminUser])  
@parser_classes([MultiPartParser, FormParser])  
def update_destination(request, slug):
    try:
        destination = Destination.objects.get(slug=slug)
        serializer = StudyDestinationSerializer(destination, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Destination.DoesNotExist:
        return Response({"error": "Destination not found"}, status=status.HTTP_404_NOT_FOUND)


# ✅ Admin-Only: Delete a Destination
@api_view(['DELETE'])
@permission_classes([IsAdminUser])  
def delete_destination(request, slug):
    try:
        destination = Destination.objects.get(slug=slug)
        destination.delete()
        return Response({"message": "Destination deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except Destination.DoesNotExist:
        return Response({"error": "Destination not found"}, status=status.HTTP_404_NOT_FOUND)
