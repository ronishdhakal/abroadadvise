import os
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.conf import settings
from core.pagination import StandardResultsSetPagination
from core.filters import ExamFilter
from .models import Exam
from .serializers import ExamSerializer

# ✅ List Exams with Pagination, Search, and Filtering (Public Access)
class ExamListView(generics.ListAPIView):
    queryset = Exam.objects.all().order_by("name")  # ✅ Ordered alphabetically
    serializer_class = ExamSerializer
    permission_classes = [AllowAny]  # ✅ Public access
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_class = ExamFilter
    search_fields = ['name']

# ✅ Fetch All Exams (Public Access) - No Pagination (For Dropdowns)
@api_view(['GET'])
@permission_classes([AllowAny])
def all_exams(request):
    """Fetch all exams without pagination for frontend dropdowns."""
    exams = Exam.objects.all().order_by("name")  # ✅ Ordered alphabetically
    serializer = ExamSerializer(exams, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# ✅ Create Exam (Public Access)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])  
def create_exam(request):
    """ ✅ Create an exam with image uploads correctly handled. """
    print("📤 Creating Exam:", request.data)  # Debugging log

    serializer = ExamSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        exam = serializer.save()

        # ✅ Handle file uploads explicitly
        if "icon" in request.FILES:
            exam.icon = request.FILES["icon"]

        exam.save()
        print("✅ Exam created successfully!")  # Debugging log
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    print("❌ Exam creation failed:", serializer.errors)  # Debugging log
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Get Single Exam by Slug (Public Access)
@api_view(['GET'])
@permission_classes([AllowAny])
def get_exam(request, slug):
    try:
        # ✅ Convert slug to lowercase to ensure case-insensitive lookup
        exam = Exam.objects.get(slug__iexact=slug.lower())
        serializer = ExamSerializer(exam, context={'request': request})
        return Response(serializer.data)
    except Exam.DoesNotExist:
        return Response({"error": "Exam not found"}, status=status.HTTP_404_NOT_FOUND)

# ✅ Update Exam (Public Access)
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
@permission_classes([AllowAny])  # ✅ Removed authentication, now public
@parser_classes([MultiPartParser, FormParser])  
def update_exam(request, slug):
    """ ✅ Updates an exam and correctly handles image uploads. """
    try:
        exam = Exam.objects.get(slug=slug)
        print("🔄 Updating Exam:", exam.name)  # Debugging log

        # ✅ Prevent overwriting images with None
        updated_data = request.data.copy()

        if "icon" not in request.FILES:
            updated_data.pop("icon", None)

        serializer = ExamSerializer(exam, data=updated_data, partial=True, context={'request': request})

        if serializer.is_valid():
            exam = serializer.save()

            # ✅ Handle image updates (Only update if a new file is provided)
            if "icon" in request.FILES:
                if exam.icon:
                    exam.icon.delete(save=False)  # Delete old image
                exam.icon = request.FILES["icon"]

            exam.save()
            print("✅ Exam updated successfully!")  # Debugging log
            return Response(serializer.data, status=status.HTTP_200_OK)

        print("❌ Exam update failed:", serializer.errors)  # Debugging log
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exam.DoesNotExist:
        return Response({"error": "Exam not found"}, status=status.HTTP_404_NOT_FOUND)

# ✅ Delete Exam (Public Access)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_exam(request, slug):
    """Deletes an exam and removes associated files."""
    try:
        exam = Exam.objects.get(slug=slug)
        print("🗑️ Deleting Exam:", exam.name)  # Debugging log

        # ✅ Delete icon file if exists
        if exam.icon:
            file_path = os.path.join(settings.MEDIA_ROOT, str(exam.icon))
            if os.path.exists(file_path):
                os.remove(file_path)

        exam.delete()
        print("✅ Exam deleted successfully!")  # Debugging log
        return Response({"message": "Exam deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

    except Exam.DoesNotExist:
        return Response({"error": "Exam not found"}, status=status.HTTP_404_NOT_FOUND)
