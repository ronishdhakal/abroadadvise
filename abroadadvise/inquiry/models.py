from django.db import models
from university.models import University
from consultancy.models import Consultancy
from destination.models import Destination
from exam.models import Exam
from event.models import Event
from course.models import Course
from django.core.exceptions import ValidationError


class Inquiry(models.Model):
    ENTITY_CHOICES = [
        ("university", "University"),
        ("consultancy", "Consultancy"),
        ("destination", "Destination"),
        ("exam", "Exam"),
        ("event", "Event"),
        ("course", "Course"),
    ]

    entity_type = models.CharField(max_length=20, choices=ENTITY_CHOICES)
    entity_id = models.IntegerField()

    # Foreign keys for different entities
    university = models.ForeignKey(University, on_delete=models.SET_NULL, null=True, blank=True)
    consultancy = models.ForeignKey(Consultancy, on_delete=models.SET_NULL, null=True, blank=True)
    destination = models.ForeignKey(Destination, on_delete=models.SET_NULL, null=True, blank=True)
    exam = models.ForeignKey(Exam, on_delete=models.SET_NULL, null=True, blank=True)
    event = models.ForeignKey(Event, on_delete=models.SET_NULL, null=True, blank=True)
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True)

    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Inquiry from {self.name} about {self.entity_type.capitalize()} ID {self.entity_id}"

    def clean(self):
        """
        ✅ Fix: Allow both university and consultancy if the inquiry originates from a university page.
        """
        if self.entity_type == "university" and not self.university:
            raise ValidationError("University field must be filled for a university inquiry.")
        if self.entity_type == "consultancy" and not self.consultancy:
            raise ValidationError("Consultancy field must be filled for a consultancy inquiry.")
        if self.entity_type == "course" and not self.course:
            raise ValidationError("Course field must be filled for a course inquiry.")

        # ✅ Allow university tracking for consultancy applications
        if self.entity_type == "consultancy" and self.university and not self.consultancy:
            raise ValidationError("Consultancy field must be filled for a consultancy inquiry.")

        if self.entity_type == "course" and self.university and not self.course:
            raise ValidationError("Course field must be filled for a course inquiry.")
