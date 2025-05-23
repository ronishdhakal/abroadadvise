from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, generics
from .models import Inquiry
from .serializers import InquirySerializer
from university.models import University
from consultancy.models import Consultancy
from college.models import College
from destination.models import Destination
from exam.models import Exam
from event.models import Event
from course.models import Course
from .pagination import InquiryPagination

from django.core.mail import send_mail
import logging

logger = logging.getLogger(__name__)


import threading
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Inquiry
from .serializers import InquirySerializer
from university.models import University
from consultancy.models import Consultancy
from college.models import College
from destination.models import Destination
from exam.models import Exam
from event.models import Event
from course.models import Course
from django.core.mail import send_mail
import logging

logger = logging.getLogger(__name__)


def send_inquiry_email(consultancy, inquiry):
    try:
        user = consultancy.user
        if user and user.email:
            parts = [
                f"Hi {consultancy.name},",
                "",
                "You have received a new inquiry on Abroad Advise.",
                "",
                f"🧑 Name: {inquiry.name}",
                f"📧 Email: {inquiry.email}",
                f"📱 Phone: {inquiry.phone or 'Not provided'}",
                f"📝 Message: {inquiry.message or 'No message provided'}",
                "",
            ]
            if inquiry.destination:
                parts.append(f"🌍 Destination: {inquiry.destination.title}")
            if inquiry.university:
                parts.append(f"🎓 University: {inquiry.university.name}")
            if inquiry.exam:
                parts.append(f"📝 Exam: {inquiry.exam.name}")
            if inquiry.course:
                parts.append(f"📚 Course: {inquiry.course.name}")
            if inquiry.event:
                parts.append(f"📅 Event: {inquiry.event.name}")

            parts.append("")
            parts.append("Please log in to your dashboard to view full details.")

            full_message = "\n".join(parts)

            send_mail(
                subject="🎓 New Inquiry Received on Abroad Advise",
                message=full_message,
                from_email="mailabroadadvise@gmail.com",
                recipient_list=[user.email],
                fail_silently=False,
            )
            logger.info(f"📧 Async email sent to: {consultancy.name} <{user.email}>")
    except Exception as e:
        logger.error(f"❌ Async email failed: {e}")


@api_view(['POST'])
@permission_classes([AllowAny])
def submit_inquiry(request):
    logger.info(f"📥 Received Inquiry Data: {request.data}")

    if "entity_type" not in request.data or "entity_id" not in request.data:
        return Response(
            {"error": "Missing entity_type or entity_id"},
            status=status.HTTP_400_BAD_REQUEST
        )

    serializer = InquirySerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    inquiry = Inquiry(**serializer.validated_data)

    entity_type = inquiry.entity_type
    entity_id = inquiry.entity_id

    if entity_type == "university":
        inquiry.university = University.objects.filter(id=entity_id).first()

    elif entity_type == "consultancy":
        inquiry.consultancy = Consultancy.objects.filter(id=entity_id).first()

    elif entity_type == "college":
        inquiry.college = College.objects.filter(id=entity_id).first()

    elif entity_type == "destination":
        inquiry.destination = Destination.objects.filter(id=entity_id).first()

    elif entity_type == "exam":
        inquiry.exam = Exam.objects.filter(id=entity_id).first()

    elif entity_type == "event":
        event = Event.objects.filter(id=entity_id).first()
        if event:
            inquiry.event = event

            # ✅ Assign event organizer as consultancy for dashboard view + send email
            if event.organizer and event.organizer.verified and event.organizer.user and event.organizer.user.email:
                inquiry.consultancy = event.organizer
                threading.Thread(target=send_inquiry_email, args=(event.organizer, inquiry)).start()
                logger.info(f"📧 Event inquiry assigned to and emailed to organizer: {event.organizer.name}")
            else:
                logger.warning("⚠️ Event organizer is missing or not verified")

    elif entity_type == "course":
        course = Course.objects.filter(id=entity_id).first()
        if course:
            inquiry.course = course
            college_id = request.data.get("college_id")
            if college_id:
                college = College.objects.filter(id=college_id).first()
                if college:
                    inquiry.college = college
                    logger.info(f"📌 Linked course inquiry to COLLEGE: {college.name}")
            else:
                inquiry.university = course.university
                logger.info(f"📌 Linked course inquiry to UNIVERSITY: {course.university.name}")

    # ✅ Optional: override with explicitly chosen consultancy (e.g. from modal)
    consultancy_id = request.data.get("consultancy_id")
    if consultancy_id:
        consultancy = Consultancy.objects.filter(id=consultancy_id).first()
        if consultancy:
            inquiry.consultancy = consultancy

    inquiry.save()
    logger.info(f"✅ Inquiry Submitted: {inquiry.name} - {inquiry.email} - {inquiry.entity_type}")

    # ✅ Trigger async email to consultancy (if present after save)
    consultancy = inquiry.consultancy
    if consultancy and consultancy.verified and consultancy.user and consultancy.user.email:
        threading.Thread(target=send_inquiry_email, args=(consultancy, inquiry)).start()
    elif consultancy and not consultancy.verified:
        logger.info(f"⛔ Consultancy not verified: {consultancy.name}")
    elif consultancy:
        logger.warning(f"⚠️ Consultancy has no user or email: {consultancy.name}")

    return Response({"message": "Inquiry submitted successfully"}, status=status.HTTP_201_CREATED)



# ✅ Superadmin + Role-Based Inquiry List
class AdminInquiryListView(generics.ListAPIView):
    serializer_class = InquirySerializer
    pagination_class = InquiryPagination
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Inquiry.objects.all().order_by("-created_at")

        if getattr(user, "is_superuser", False):
            logger.info("✅ Superadmin viewing ALL inquiries")
            return queryset

        if hasattr(user, "consultancy") and user.consultancy:
            return queryset.filter(consultancy=user.consultancy)

        if hasattr(user, "university") and user.university:
            return queryset.filter(university=user.university)

        if hasattr(user, "college") and user.college:
            return queryset.filter(college=user.college)

        return Inquiry.objects.none()


# ✅ Retrieve a single inquiry
class InquiryDetailView(generics.RetrieveAPIView):
    serializer_class = InquirySerializer
    queryset = Inquiry.objects.all()
