from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, parser_classes, permission_classes
from authentication.permissions import IsUniversityUser  # ✅ Correct import path
from rest_framework.permissions import IsAuthenticated
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
import json

from inquiry.models import Inquiry  # Import Inquiry model
from inquiry.serializers import InquirySerializer  # Import the InquirySerializer

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


# ✅ Helper Function: Extract and Validate Discipline IDs
def extract_disciplines(data):
    """Extracts, validates, and converts disciplines to a list of valid integer IDs."""
    disciplines = []
    if "disciplines" in data:
        try:
            disciplines_raw = data["disciplines"]

            # ✅ Parse JSON if it's a string
            if isinstance(disciplines_raw, str):
                disciplines_raw = json.loads(disciplines_raw)

            # ✅ Ensure all values are valid integers
            if isinstance(disciplines_raw, list):
                disciplines = [int(d) for d in disciplines_raw if isinstance(d, (int, str)) and str(d).isdigit()]
        except (json.JSONDecodeError, ValueError, TypeError):
            return None, Response({"error": "Invalid disciplines format. Must be an array of integers."}, status=status.HTTP_400_BAD_REQUEST)

    return disciplines, None


# ✅ Create University (Handles File Uploads & Disciplines)
@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def create_university(request):
    """ ✅ Creates a new university including file uploads and disciplines """
    data = request.data.copy()  # ✅ Make mutable copy of request data

    # ✅ Extract disciplines safely
    disciplines, error_response = extract_disciplines(data)
    if error_response:
        return error_response  # Return error if disciplines parsing fails

    serializer = UniversitySerializer(data=data)

    if serializer.is_valid():
        university = serializer.save()

        # ✅ Handle file uploads (Only save if provided)
        if "logo" in request.FILES:
            university.logo = request.FILES["logo"]
        if "cover_photo" in request.FILES:
            university.cover_photo = request.FILES["cover_photo"]
        if "brochure" in request.FILES:
            university.brochure = request.FILES["brochure"]

        # ✅ Set disciplines after saving (ManyToMany field handling)
        if disciplines:
            university.disciplines.set(disciplines)

        university.save()
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


# ✅ Update University (Handles File Uploads & Disciplines)
@api_view(['PUT', 'PATCH'])
@parser_classes([MultiPartParser, FormParser])
def update_university(request, slug):
    """ ✅ Updates an existing university including file uploads and disciplines """
    try:
        university = University.objects.prefetch_related("disciplines").get(slug=slug)
        data = request.data.copy()  # ✅ Make mutable copy of request data

        # ✅ Extract disciplines safely
        disciplines, error_response = extract_disciplines(data)
        if error_response:
            return error_response  # Return error if disciplines parsing fails

        serializer = UniversitySerializer(university, data=data, partial=True)

        if serializer.is_valid():
            updated_university = serializer.save()

            # ✅ Handle file updates (Only save if new file is provided)
            if "logo" in request.FILES:
                updated_university.logo = request.FILES["logo"]
            if "cover_photo" in request.FILES:
                updated_university.cover_photo = request.FILES["cover_photo"]
            if "brochure" in request.FILES:
                updated_university.brochure = request.FILES["brochure"]

            # ✅ Update disciplines if provided
            if disciplines:
                updated_university.disciplines.set(disciplines)

            updated_university.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except University.DoesNotExist:
        return Response({"error": "University not found"}, status=status.HTTP_404_NOT_FOUND)


# ✅ Delete University
@api_view(['DELETE'])
def delete_university(request, slug):
    """ ✅ Deletes an existing university including file cleanup """
    try:
        university = University.objects.get(slug=slug)

        # ✅ Delete associated files (if they exist)
        if university.logo:
            university.logo.delete(save=False)
        if university.cover_photo:
            university.cover_photo.delete(save=False)
        if university.brochure:
            university.brochure.delete(save=False)

        university.delete()
        return Response({"message": "University deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

    except University.DoesNotExist:
        return Response({"error": "University not found"}, status=status.HTTP_404_NOT_FOUND)
    
    
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def university_dashboard_view(request):
    """ ✅ Fetch the university profile linked to the logged-in user. """
    user = request.user

    # ✅ Corrected: Check if `user.university` exists, not `user.university_id`
    if not hasattr(user, "university") or not user.university:
        return Response({"error": "User is not linked to any university."}, status=403)

    university = user.university  # ✅ Corrected: Use `user.university` directly
    serializer = UniversitySerializer(university, context={"request": request})

    # ✅ Fetch inquiries related to the university
    inquiries = Inquiry.objects.filter(university=university).order_by("-created_at")
    inquiry_serializer = InquirySerializer(inquiries, many=True)

    response_data = serializer.data
    response_data["inquiries"] = inquiry_serializer.data  # Include inquiries in response

    return Response(response_data, status=200)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated, IsUniversityUser])
@parser_classes([MultiPartParser, FormParser])
def update_university_dashboard(request):
    """ ✅ Allows a logged-in university user to update their own profile."""
    user = request.user

    # Ensure user is linked to a university
    if not hasattr(user, "university") or not user.university:
        return Response({"error": "User is not linked to any university."}, status=status.HTTP_403_FORBIDDEN)

    university = user.university  # ✅ Get the university linked to the user
    data = request.data.copy()

    serializer = UniversitySerializer(university, data=data, partial=True)

    if serializer.is_valid():
        university = serializer.save()

        # ✅ Handle File Uploads (Update only if a new file is provided)
        if "logo" in request.FILES:
            university.logo = request.FILES["logo"]
        if "cover_photo" in request.FILES:
            university.cover_photo = request.FILES["cover_photo"]
        if "brochure" in request.FILES:
            university.brochure = request.FILES["brochure"]

        university.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
