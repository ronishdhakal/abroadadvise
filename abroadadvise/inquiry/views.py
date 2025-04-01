from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, generics
from .models import Inquiry
from .serializers import InquirySerializer
from university.models import University
from consultancy.models import Consultancy
from college.models import College  # ✅ NEW
from destination.models import Destination
from exam.models import Exam
from event.models import Event
from course.models import Course
import logging
from .pagination import InquiryPagination

logger = logging.getLogger(__name__)


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

    # Create object manually to assign custom foreign keys before saving
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
        inquiry.event = Event.objects.filter(id=entity_id).first()
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

    # Track consultancy if provided
    consultancy_id = request.data.get("consultancy_id")
    if consultancy_id:
        consultancy = Consultancy.objects.filter(id=consultancy_id).first()
        if consultancy:
            inquiry.consultancy = consultancy

    inquiry.save()
    logger.info(f"✅ Inquiry Submitted: {inquiry.name} - {inquiry.email} - {inquiry.entity_type}")

    return Response({"message": "Inquiry submitted successfully"}, status=status.HTTP_201_CREATED)




# ✅ Superadmin + Role-Based Inquiry List
class AdminInquiryListView(generics.ListAPIView):
    serializer_class = InquirySerializer
    pagination_class = InquiryPagination

    @permission_classes([IsAuthenticated])
    def get_queryset(self):
        user = self.request.user
        queryset = Inquiry.objects.all().order_by("-created_at")

        # ✅ Superadmin sees all
        if getattr(user, "is_superuser", False):
            logger.info("✅ Superadmin viewing ALL inquiries")
            return queryset

        # ✅ Filter for specific roles
        if hasattr(user, "consultancy") and user.consultancy:
            return queryset.filter(consultancy=user.consultancy)

        if hasattr(user, "university") and user.university:
            return queryset.filter(university=user.university)

        if hasattr(user, "college") and user.college:  # ✅ NEW
            return queryset.filter(college=user.college)

        return Inquiry.objects.none()


# ✅ Retrieve a single inquiry
class InquiryDetailView(generics.RetrieveAPIView):
    serializer_class = InquirySerializer
    queryset = Inquiry.objects.all()
