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
import logging

# ✅ Set up logging for debugging issues
logger = logging.getLogger(__name__)

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])  # ✅ Allow unauthenticated users to submit inquiries
def submit_inquiry(request):
    """
    API for submitting inquiries. Allows unauthenticated users to submit inquiries.
    """
    serializer = InquirySerializer(data=request.data)
    if serializer.is_valid():
        inquiry = serializer.save()

        # ✅ Link inquiries to respective institutions
        if inquiry.entity_type == "university":
            university = University.objects.filter(id=inquiry.entity_id).first()
            if university:
                inquiry.university = university
                inquiry.save()
        elif inquiry.entity_type == "consultancy":
            consultancy = Consultancy.objects.filter(id=inquiry.entity_id).first()
            if consultancy:
                inquiry.consultancy = consultancy
                inquiry.save()

        # ✅ Log inquiry submission
        logger.info(f"New Inquiry Submitted: {inquiry.name} - {inquiry.email} - {inquiry.entity_type}")

        # ✅ Notify Super Admins via Email
        super_admins = User.objects.filter(is_superuser=True).values_list('email', flat=True)
        if super_admins:
            try:
                send_mail(
                    f"New Inquiry about {inquiry.entity_type.capitalize()} (ID: {inquiry.entity_id})",
                    f"Name: {inquiry.name}\nEmail: {inquiry.email}\nPhone: {inquiry.phone}\nMessage: {inquiry.message}",
                    'no-reply@abroadadvise.com',
                    list(super_admins),
                    fail_silently=False
                )
            except Exception as e:
                logger.error(f"Error sending email to super admins: {str(e)}")

        # ✅ Notify Institution (University or Consultancy)
        institution_email = get_institution_email(inquiry.entity_type, inquiry.entity_id)
        if institution_email:
            try:
                send_mail(
                    f"New Inquiry about {inquiry.entity_type.capitalize()} (ID: {inquiry.entity_id})",
                    f"Name: {inquiry.name}\nEmail: {inquiry.email}\nPhone: {inquiry.phone}\nMessage: {inquiry.message}",
                    'no-reply@abroadadvise.com',
                    [institution_email],
                    fail_silently=False
                )
            except Exception as e:
                logger.error(f"Error sending email to institution: {str(e)}")

        return Response({"message": "Inquiry submitted successfully"}, status=status.HTTP_201_CREATED)
    
    logger.warning(f"Inquiry Submission Failed: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def get_institution_email(entity_type, entity_id):
    """
    Helper function to get the email address of the institution (University or Consultancy).
    """
    if entity_type == "consultancy":
        consultancy = Consultancy.objects.filter(id=entity_id).first()
        return consultancy.email if consultancy else None
    elif entity_type == "university":
        university = University.objects.filter(id=entity_id).first()
        return university.email if university else None
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
