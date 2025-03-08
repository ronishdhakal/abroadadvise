from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.generics import ListAPIView
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import F  # ✅ Import F for sorting null values properly
from core.pagination import StandardResultsSetPagination  # ✅ Import pagination
from core.filters import CourseFilter  # ✅ Import filtering
from authentication.permissions import IsAdminUser
from .models import Course
from .serializers import CourseSerializer

# ✅ List Courses with Pagination, Search & Filtering
class CourseListView(ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_class = CourseFilter
    search_fields = ["name", "university__name", "destination__title"]

    def get_queryset(self):
        queryset = Course.objects.select_related("university", "destination").prefetch_related("disciplines")

        # ✅ Filter by university slug
        university_slug = self.request.GET.get("university")
        if university_slug:
            queryset = queryset.filter(university__slug=university_slug)

        # ✅ Filter by destination slug
        destination_slug = self.request.GET.get("destination")
        if destination_slug:
            queryset = queryset.filter(destination__slug=destination_slug)

        # ✅ Order courses by priority (NULL values will be last) and then by latest created courses
        return queryset.order_by(F("priority").asc(nulls_last=True), "-id")


# ✅ Create Course (Admin Only)
@api_view(["POST"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def create_course(request):
    serializer = CourseSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ Get Single Course (Publicly Accessible)
@api_view(["GET"])
@permission_classes([AllowAny])  
def get_course(request, slug):
    try:
        course = Course.objects.select_related("university", "destination").get(slug=slug)
        serializer = CourseSerializer(course)
        return Response(serializer.data)
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)


# ✅ Update Course (Admin Only)
@api_view(["PUT", "PATCH"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def update_course(request, slug):
    try:
        course = Course.objects.select_related("university", "destination").get(slug=slug)
        serializer = CourseSerializer(course, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)


# ✅ Delete Course (Admin Only)
@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def delete_course(request, slug):
    try:
        course = Course.objects.get(slug=slug)
        course.delete()
        return Response({"message": "Course deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)
