from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, generics
from django.core.mail import send_mail
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
    Tracks which consultancy page the inquiry was submitted from.
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

        # ✅ Track the correct entity and consultancy source
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
            inquiry.course = Course.objects.filter(id=entity_id).first()
        
        inquiry.save()

        # ✅ Track which consultancy page submitted the inquiry
        if "consultancy_id" in request.data:
            consultancy = Consultancy.objects.filter(id=request.data["consultancy_id"]).first()
            if consultancy:
                inquiry.consultancy = consultancy
                inquiry.save()

        logger.info(f"✅ Inquiry Submitted: {inquiry.name} - {inquiry.email} - {inquiry.entity_type} - Consultancy: {inquiry.consultancy}")

        # ✅ Notify Admins and Institution
        super_admins = User.objects.filter(is_superuser=True).values_list('email', flat=True)
        if super_admins:
            try:
                send_mail(
                    f"New Inquiry about {inquiry.entity_type.capitalize()} (ID: {inquiry.entity_id}) - From Consultancy: {inquiry.consultancy}",
                    f"Name: {inquiry.name}\nEmail: {inquiry.email}\nPhone: {inquiry.phone}\nMessage: {inquiry.message}",
                    'no-reply@abroadadvise.com',
                    list(super_admins),
                    fail_silently=False
                )
            except Exception as e:
                logger.error(f"Error sending email to super admins: {str(e)}")

        institution_email = get_institution_email(inquiry.entity_type, inquiry.entity_id)
        if institution_email:
            try:
                send_mail(
                    f"New Inquiry about {inquiry.entity_type.capitalize()} (ID: {inquiry.entity_id}) - From Consultancy: {inquiry.consultancy}",
                    f"Name: {inquiry.name}\nEmail: {inquiry.email}\nPhone: {inquiry.phone}\nMessage: {inquiry.message}",
                    'no-reply@abroadadvise.com',
                    [institution_email],
                    fail_silently=False
                )
            except Exception as e:
                logger.error(f"Error sending email to institution: {str(e)}")

        return Response({"message": "Inquiry submitted successfully"}, status=status.HTTP_201_CREATED)

    logger.warning(f"❌ Inquiry Submission Failed: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def get_institution_email(entity_type, entity_id):
    """
    Helper function to get the email address of the institution (University, Consultancy, etc.).
    If the entity does not have an email field, fetch it from the related consultancy/university.
    """
    if entity_type == "consultancy":
        consultancy = Consultancy.objects.filter(id=entity_id).first()
        return consultancy.email if consultancy and hasattr(consultancy, 'email') else None
    
    elif entity_type == "university":
        university = University.objects.filter(id=entity_id).first()
        return university.email if university and hasattr(university, 'email') else None

    elif entity_type == "destination":
        destination = Destination.objects.filter(id=entity_id).first()
        if destination and hasattr(destination, 'consultancies'):
            # Ensure that the 'consultancies' attribute exists
            consultancy = destination.consultancies.first()  # Assuming a reverse relationship
            return consultancy.email if consultancy else None
        return None

    elif entity_type == "exam":
        exam = Exam.objects.filter(id=entity_id).first()
        if exam and exam.consultancies.exists():  # Check if the exam has associated consultancies
            consultancy = exam.consultancies.first()  # Get the first consultancy
            return consultancy.email if consultancy else None
        return None

    elif entity_type == "event":
        event = Event.objects.filter(id=entity_id).first()
        if event and event.consultancy:  # If event is linked to a consultancy
            return event.consultancy.email if hasattr(event.consultancy, 'email') else None
        return None

    elif entity_type == "course":
        course = Course.objects.filter(id=entity_id).first()
        if course and course.university:  # If course is linked to a university
            return course.university.email if hasattr(course.university, 'email') else None
        return None

    return None




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
