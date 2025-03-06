from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from core.pagination import StandardResultsSetPagination
from core.filters import ExamFilter
from authentication.permissions import IsAdminUser
from .models import Exam
from .serializers import ExamSerializer

# ✅ List Exams with Pagination, Search, and Filtering (Public Access)
class ExamListView(generics.ListAPIView):
    queryset = Exam.objects.all().order_by("name")  # ✅ Ordered alphabetically
    serializer_class = ExamSerializer
    permission_classes = [permissions.AllowAny]  # ✅ Public access
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_class = ExamFilter
    search_fields = ['name']

# ✅ List All Exams (Public Access) - No Pagination (For Dropdowns)
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def all_exams(request):
    """
    Fetch all exams without pagination for frontend dropdowns.
    """
    exams = Exam.objects.all().order_by("name")  # ✅ Ordered alphabetically
    serializer = ExamSerializer(exams, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# ✅ Create Exam (Admin Only)
@api_view(['POST'])
@permission_classes([IsAdminUser])  
@parser_classes([MultiPartParser, FormParser])  
def create_exam(request):
    serializer = ExamSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Get Single Exam by Slug (Public Access)
@api_view(['GET'])
@permission_classes([permissions.AllowAny])  # ✅ Public access
def get_exam(request, slug):
    try:
        exam = Exam.objects.get(slug=slug)
        serializer = ExamSerializer(exam, context={'request': request})
        return Response(serializer.data)
    except Exam.DoesNotExist:
        return Response({"error": "Exam not found"}, status=status.HTTP_404_NOT_FOUND)

# ✅ Update Exam (Admin Only)
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAdminUser])  
@parser_classes([MultiPartParser, FormParser])  
def update_exam(request, slug):
    try:
        exam = Exam.objects.get(slug=slug)
        serializer = ExamSerializer(exam, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exam.DoesNotExist:
        return Response({"error": "Exam not found"}, status=status.HTTP_404_NOT_FOUND)

# ✅ Delete Exam (Admin Only)
@api_view(['DELETE'])
@permission_classes([IsAdminUser])  
def delete_exam(request, slug):
    try:
        exam = Exam.objects.get(slug=slug)
        exam.delete()
        return Response({"message": "Exam deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except Exam.DoesNotExist:
        return Response({"error": "Exam not found"}, status=status.HTTP_404_NOT_FOUND)
