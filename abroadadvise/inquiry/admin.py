from django.contrib import admin
from .models import Inquiry
from university.models import University
from consultancy.models import Consultancy
from destination.models import Destination
from exam.models import Exam
from event.models import Event
from course.models import Course

class InquiryAdmin(admin.ModelAdmin):
    list_display = (
        "name", "email", "entity_type", "entity_id", "consultancy", "university",
        "destination", "exam", "event", "course", "created_at"
    )
    list_filter = ("entity_type", "created_at")
    search_fields = ("name", "email", "message")

    readonly_fields = ("created_at",)

    def get_fields(self, request, obj=None):
        fields = ["entity_type", "entity_id", "name", "email", "phone", "message", "created_at"]

        if obj:
            if obj.entity_type == "university":
                fields.append("university")
                fields.append("consultancy")
            elif obj.entity_type == "consultancy":
                fields.append("consultancy")
            elif obj.entity_type == "destination":
                fields.append("destination")
                fields.append("consultancy")  
            elif obj.entity_type == "exam":
                fields.append("exam")
                fields.append("consultancy")
            elif obj.entity_type == "event":
                fields.append("event")
                fields.append("consultancy")
            elif obj.entity_type == "course":
                fields.append("course")
                fields.append("consultancy")

        return fields

    def get_consultancy(self, obj):
        """
        Get the consultancy related to the inquiry depending on entity type
        """
        if obj.entity_type == "consultancy":
            return obj.consultancy
        elif obj.entity_type == "destination":
            return obj.destination.consultancy if obj.destination else None
        elif obj.entity_type == "exam":
            return obj.exam.consultancy if obj.exam else None
        elif obj.entity_type == "event":
            return obj.event.consultancy if obj.event else None
        elif obj.entity_type == "course":
            return obj.course.university.consultancy if obj.course and obj.course.university else None
        return None

    def consultancy(self, obj):
        consultancy = self.get_consultancy(obj)
        return consultancy.name if consultancy else "Not Applicable"
    consultancy.short_description = "Consultancy"

    # For the related entity types (university, destination, etc.)
    def university(self, obj):
        return obj.university.name if obj.university else "Not Applicable"

    def destination(self, obj):
        return obj.destination.name if obj.destination else "Not Applicable"

    def exam(self, obj):
        return obj.exam.name if obj.exam else "Not Applicable"

    def event(self, obj):
        return obj.event.name if obj.event else "Not Applicable"

    def course(self, obj):
        return obj.course.name if obj.course else "Not Applicable"

admin.site.register(Inquiry, InquiryAdmin)
