from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from core.pagination import StandardResultsSetPagination  # Import pagination
from core.filters import ConsultancyFilter  # Import filtering
from authentication.permissions import IsAdminUser, IsConsultancyUser
from .models import Consultancy
from .serializers import ConsultancySerializer

# ✅ Publicly Accessible List of Consultancies with Pagination, Search, and Filtering
class ConsultancyListView(ListAPIView):
    queryset = Consultancy.objects.all()
    serializer_class = ConsultancySerializer
    permission_classes = [AllowAny]  # ✅ Public access allowed
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_class = ConsultancyFilter
    search_fields = ['name']

# ✅ Publicly Accessible Single Consultancy Detail View
class ConsultancyDetailView(RetrieveAPIView):
    queryset = Consultancy.objects.all()
    serializer_class = ConsultancySerializer
    permission_classes = [AllowAny]  # ✅ Public access allowed
    lookup_field = "slug"

# ✅ Create Consultancy (Admin Only)
@api_view(['POST'])
@permission_classes([IsAdminUser])  
@parser_classes([MultiPartParser, FormParser])  
def create_consultancy(request):
    serializer = ConsultancySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Update Consultancy (Admin & Consultancy User)
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAdminUser, IsConsultancyUser])  
@parser_classes([MultiPartParser, FormParser])  
def update_consultancy(request, slug):
    try:
        consultancy = Consultancy.objects.get(slug=slug)
        serializer = ConsultancySerializer(consultancy, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Consultancy.DoesNotExist:
        return Response({"error": "Consultancy not found"}, status=status.HTTP_404_NOT_FOUND)

# ✅ Delete Consultancy (Admin Only)
@api_view(['DELETE'])
@permission_classes([IsAdminUser])  
def delete_consultancy(request, slug):
    try:
        consultancy = Consultancy.objects.get(slug=slug)
        consultancy.delete()
        return Response({"message": "Consultancy deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except Consultancy.DoesNotExist:
        return Response({"error": "Consultancy not found"}, status=status.HTTP_404_NOT_FOUND)