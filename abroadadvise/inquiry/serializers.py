from rest_framework import serializers
from .models import Inquiry

class InquirySerializer(serializers.ModelSerializer):
    """
    Serializer for Inquiry Model
    Supports read + write of foreign keys and returns display names.
    """
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)

    # Read-only display fields
    consultancy_name = serializers.CharField(source="consultancy.name", read_only=True)
    university_name = serializers.CharField(source="university.name", read_only=True)
    college_name = serializers.CharField(source="college.name", read_only=True)
    destination_name = serializers.CharField(source="destination.title", read_only=True)
    exam_name = serializers.CharField(source="exam.name", read_only=True)
    event_name = serializers.CharField(source="event.name", read_only=True)
    course_name = serializers.CharField(source="course.name", read_only=True)

    consultancy_id = serializers.IntegerField(source="consultancy.id", read_only=True)
    college_id = serializers.IntegerField(source="college.id", read_only=True)

    class Meta:
        model = Inquiry
        fields = [
            "id",
            "name",
            "email",
            "phone",
            "message",
            "entity_type",
            "entity_id",
            "university",
            "college",
            "consultancy",
            "course",
            "destination",
            "exam",
            "event",
            # Read-only helper fields
            "consultancy_name",
            "university_name",
            "college_name",
            "destination_name",
            "exam_name",
            "event_name",
            "course_name",
            "consultancy_id",
            "college_id",
            "created_at",
        ]
