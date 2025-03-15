from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, generics
from .models import Inquiry
from .serializers import InquirySerializer
from university.models import University
from consultancy.models import Consultancy
from destination.models import Destination
from exam.models import Exam
from event.models import Event
from course.models import Course
import logging
from .pagination import InquiryPagination

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])  # ✅ No authentication required
def submit_inquiry(request):
    """
    API for submitting inquiries. Allows anyone to submit.
    """
    logger.info(f"📥 Received Inquiry Data: {request.data}")

    if "entity_type" not in request.data or "entity_id" not in request.data:
        return Response(
            {"error": "Missing entity_type or entity_id"},
            status=status.HTTP_400_BAD_REQUEST
        )

    serializer = InquirySerializer(data=request.data)
    if serializer.is_valid():
        inquiry = serializer.save()

        entity_type = inquiry.entity_type
        entity_id = inquiry.entity_id

        # ✅ Track the correct entity
        if entity_type == "university":
            inquiry.university = University.objects.filter(id=entity_id).first()
        elif entity_type == "consultancy":
            inquiry.consultancy = Consultancy.objects.filter(id=entity_id).first()
        elif entity_type == "destination":
            inquiry.destination = Destination.objects.filter(id=entity_id).first()
        elif entity_type == "exam":
            inquiry.exam = Exam.objects.filter(id=entity_id).first()
        elif entity_type == "event":
            inquiry.event = Event.objects.filter(id=entity_id).first()
        elif entity_type == "course":
            course = Course.objects.filter(id=entity_id).first()
            if course:
                inquiry.course = course
                inquiry.university = course.university  # ✅ Automatically link course to university

        # ✅ Fix: Track consultancy for course inquiries if provided
        if "consultancy_id" in request.data:
            consultancy = Consultancy.objects.filter(id=request.data["consultancy_id"]).first()
            if consultancy:
                inquiry.consultancy = consultancy  

        inquiry.save()
        logger.info(f"✅ Inquiry Submitted: {inquiry.name} - {inquiry.email} - {inquiry.entity_type}")

        return Response({"message": "Inquiry submitted successfully"}, status=status.HTTP_201_CREATED)

    logger.warning(f"❌ Inquiry Submission Failed: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ Superadmin Inquiry List (Filter by Consultancy or University)
class AdminInquiryListView(generics.ListAPIView):
    serializer_class = InquirySerializer
    pagination_class = InquiryPagination  # ✅ Enable pagination
    permission_classes = [IsAuthenticated]  # ✅ Only authenticated users

    def get_queryset(self):
        user = self.request.user  # ✅ Get logged-in user
        queryset = Inquiry.objects.all().order_by("-created_at")  # Show latest first

        # ✅ If the user is a consultancy, filter by consultancy ID
        if hasattr(user, "consultancy") and user.consultancy:
            queryset = queryset.filter(consultancy=user.consultancy)

        # ✅ If the user is a university, filter by university ID
        if hasattr(user, "university") and user.university:
            queryset = queryset.filter(university=user.university)

        return queryset


# ✅ Retrieve a single inquiry (No authentication required)
class InquiryDetailView(generics.RetrieveAPIView):
    serializer_class = InquirySerializer
    queryset = Inquiry.objects.all()
