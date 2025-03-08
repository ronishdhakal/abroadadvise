from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, generics
from django.contrib.auth import get_user_model
from .models import Inquiry
from .serializers import InquirySerializer
from university.models import University
from consultancy.models import Consultancy
from destination.models import Destination
from exam.models import Exam
from event.models import Event
from course.models import Course
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def submit_inquiry(request):
    """
    API for submitting inquiries. Allows unauthenticated users to submit inquiries.
    Ensures university and consultancy are tracked correctly.
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

        # ✅ Fix: Track consultancy for course inquiries if it exists
        if "consultancy_id" in request.data:
            consultancy = Consultancy.objects.filter(id=request.data["consultancy_id"]).first()
            if consultancy:
                inquiry.consultancy = consultancy  # ✅ Now stored correctly

        inquiry.save()
        logger.info(f"✅ Inquiry Submitted: {inquiry.name} - {inquiry.email} - {inquiry.entity_type} - University: {inquiry.university} - Consultancy: {inquiry.consultancy}")

        return Response({"message": "Inquiry submitted successfully"}, status=status.HTTP_201_CREATED)

    logger.warning(f"❌ Inquiry Submission Failed: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ List all inquiries for universities (Authenticated University Users Only)
class UniversityInquiryListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InquirySerializer

    def get_queryset(self):
        """
        Fetch inquiries related to the authenticated university.
        """
        user = self.request.user
        if hasattr(user, 'university'):
            return Inquiry.objects.filter(university=user.university)
        return Inquiry.objects.none()


# ✅ List all inquiries for consultancies (Authenticated Consultancy Users Only)
class ConsultancyInquiryListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InquirySerializer

    def get_queryset(self):
        """
        Fetch inquiries related to the authenticated consultancy.
        """
        user = self.request.user
        if hasattr(user, 'consultancy'):
            return Inquiry.objects.filter(consultancy=user.consultancy)
        return Inquiry.objects.none()
