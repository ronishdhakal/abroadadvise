from rest_framework import serializers
from .models import Inquiry

class InquirySerializer(serializers.ModelSerializer):
    """
    Serializer for Inquiry Model
    Includes formatted created_at and related entity names.
    """
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    consultancy_name = serializers.CharField(source="consultancy.name", read_only=True)
    university_name = serializers.CharField(source="university.name", read_only=True)
    destination_name = serializers.CharField(source="destination.title", read_only=True)
    exam_name = serializers.CharField(source="exam.name", read_only=True)
    event_name = serializers.CharField(source="event.name", read_only=True)
    course_name = serializers.CharField(source="course.name", read_only=True)

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
            "consultancy_name",
            "university_name",
            "destination_name",
            "exam_name",
            "event_name",
            "course_name",
            "created_at",
        ]
