from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.generics import ListAPIView
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import F  # ✅ Import F for sorting null values properly
from core.pagination import StandardResultsSetPagination  # ✅ Import pagination
from core.filters import CourseFilter  # ✅ Import filtering
from .models import Course
from .serializers import CourseSerializer
from .pagination import CoursePagination  # ✅ Use custom course pagination

# ✅ List Courses with Pagination, Search & Filtering
class CourseListView(ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]
    pagination_class = CoursePagination  # ✅ Updated pagination class
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

        # ✅ Order courses by priority and then by latest added
        return queryset.order_by(F("priority").asc(nulls_last=True), "-id")


# ✅ Create Course (Now Publicly Accessible)
@api_view(["POST"])
@permission_classes([IsAuthenticated, IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def create_course(request):
    print("Create course request received")  # Debugging log
    serializer = CourseSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        print("Course created successfully")  # Debugging log
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    print("Serializer errors:", serializer.errors)  # Debugging log
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ Get Single Course (Publicly Accessible)
@api_view(["GET"])
def get_course(request, slug):
    try:
        course = Course.objects.select_related("university", "destination").get(slug=slug)
        serializer = CourseSerializer(course)
        return Response(serializer.data)
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)


# ✅ Update Course (Now Publicly Accessible)
@api_view(["PUT", "PATCH"])
@permission_classes([IsAuthenticated, IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def update_course(request, slug):
    print(f"Updating course with slug: {slug}")  # Debugging log
    try:
        course = Course.objects.select_related("university", "destination").get(slug=slug)
        print("Course found:", course.name)  # Debugging log

        serializer = CourseSerializer(course, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            print("Course updated successfully")  # Debugging log
            return Response(serializer.data)

        print("Serializer errors:", serializer.errors)  # Debugging log
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Course.DoesNotExist:
        print("Course not found!")  # Debugging log
        return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        print("Unexpected error:", str(e))  # Debugging log
        return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ✅ Delete Course (Now Publicly Accessible)
@api_view(["DELETE"])
@permission_classes([IsAuthenticated, IsAdminUser])
def delete_course(request, slug):
    print(f"Deleting course with slug: {slug}")  # Debugging log
    try:
        course = Course.objects.get(slug=slug)
        course.delete()
        print("Course deleted successfully")  # Debugging log
        return Response({"message": "Course deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except Course.DoesNotExist:
        print("Course not found!")  # Debugging log
        return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)
