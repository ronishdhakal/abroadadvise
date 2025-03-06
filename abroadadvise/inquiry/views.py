from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, generics
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from .models import Inquiry
from .serializers import InquirySerializer
from university.models import University
from consultancy.models import Consultancy

User = get_user_model()

@api_view(['POST'])
def submit_inquiry(request):
    serializer = InquirySerializer(data=request.data)
    if serializer.is_valid():
        inquiry = serializer.save()

        # Link inquiries to respective institutions
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

        # Notify Super Admin
        super_admins = User.objects.filter(is_superuser=True).values_list('email', flat=True)
        if super_admins:
            send_mail(
                f"New Inquiry about {inquiry.entity_type.capitalize()} (ID: {inquiry.entity_id})",
                f"Name: {inquiry.name}\nEmail: {inquiry.email}\nPhone: {inquiry.phone}\nMessage: {inquiry.message}",
                'no-reply@abroadadvise.com',
                list(super_admins)
            )

        # Notify Institution
        institution_email = get_institution_email(inquiry.entity_type, inquiry.entity_id)
        if institution_email:
            send_mail(
                f"New Inquiry about {inquiry.entity_type.capitalize()} (ID: {inquiry.entity_id})",
                f"Name: {inquiry.name}\nEmail: {inquiry.email}\nPhone: {inquiry.phone}\nMessage: {inquiry.message}",
                'no-reply@abroadadvise.com',
                [institution_email]
            )

        return Response({"message": "Inquiry submitted successfully"}, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def get_institution_email(entity_type, entity_id):
    if entity_type == "consultancy":
        consultancy = Consultancy.objects.filter(id=entity_id).first()
        return consultancy.email if consultancy else None
    elif entity_type == "university":
        university = University.objects.filter(id=entity_id).first()
        return university.email if university else None
    return None

class UniversityInquiryListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InquirySerializer

    def get_queryset(self):
        user = self.request.user
        return Inquiry.objects.filter(university=user.university) if user.role == 'university' else Inquiry.objects.none()

class ConsultancyInquiryListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InquirySerializer

    def get_queryset(self):
        user = self.request.user
        return Inquiry.objects.filter(consultancy=user.consultancy) if user.role == 'consultancy' else Inquiry.objects.none()
