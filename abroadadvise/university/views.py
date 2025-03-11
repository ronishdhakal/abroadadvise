from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.generics import ListAPIView
from rest_framework.filters import SearchFilter
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.renderers import JSONRenderer
from core.pagination import StandardResultsSetPagination
from core.filters import UniversityFilter
from .models import University
from .serializers import UniversitySerializer

# ✅ Public University List with Pagination, Search, and Filtering
class UniversityListView(ListAPIView):
    serializer_class = UniversitySerializer
    permission_classes = [AllowAny]  # 🔓 Public Access (No authentication required)
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_class = UniversityFilter
    search_fields = ['name', 'country']
    renderer_classes = [JSONRenderer]

    def get_queryset(self):
        return University.objects.prefetch_related("disciplines").order_by("priority", "-id")

# ✅ Create University (Authentication Removed)
@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])  
def create_university(request):
    """ ✅ Creates a new university """
    serializer = UniversitySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Get Single University (Public)
@api_view(['GET'])
def get_university(request, slug):
    """ ✅ Fetches details of a single university by slug """
    try:
        university = University.objects.prefetch_related("disciplines").get(slug=slug)
        serializer = UniversitySerializer(university)
        return Response(serializer.data)
    except University.DoesNotExist:
        return Response({"error": "University not found"}, status=status.HTTP_404_NOT_FOUND)

# ✅ Update University (Authentication Removed)
@api_view(['PUT', 'PATCH'])
@parser_classes([MultiPartParser, FormParser])  
def update_university(request, slug):
    """ ✅ Updates an existing university """
    try:
        university = University.objects.prefetch_related("disciplines").get(slug=slug)
        serializer = UniversitySerializer(university, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except University.DoesNotExist:
        return Response({"error": "University not found"}, status=status.HTTP_404_NOT_FOUND)

# ✅ Delete University (Authentication Removed)
@api_view(['DELETE'])
def delete_university(request, slug):
    """ ✅ Deletes an existing university """
    try:
        university = University.objects.get(slug=slug)
        university.delete()
        return Response({"message": "University deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except University.DoesNotExist:
        return Response({"error": "University not found"}, status=status.HTTP_404_NOT_FOUND)
