from django.db import models
from university.models import University
from consultancy.models import Consultancy
from destination.models import Destination
from exam.models import Exam
from event.models import Event
from course.models import Course
from college.models import College
from django.core.exceptions import ValidationError


class Inquiry(models.Model):
    ENTITY_CHOICES = [
        ("university", "University"),
        ("consultancy", "Consultancy"),
        ("college", "College"),
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
    college = models.ForeignKey(College, on_delete=models.SET_NULL, null=True, blank=True)
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
        Validate that required foreign keys are set based on entity_type.
        """
        if self.entity_type == "university" and not self.university:
            raise ValidationError("University field must be filled for a university inquiry.")

        if self.entity_type == "consultancy" and not self.consultancy:
            raise ValidationError("Consultancy field must be filled for a consultancy inquiry.")

        if self.entity_type == "college" and not self.college:
            raise ValidationError("College field must be filled for a college inquiry.")

        if self.entity_type == "destination" and not self.destination:
            raise ValidationError("Destination field must be filled for a destination inquiry.")

        if self.entity_type == "exam" and not self.exam:
            raise ValidationError("Exam field must be filled for an exam inquiry.")

        if self.entity_type == "event" and not self.event:
            raise ValidationError("Event field must be filled for an event inquiry.")

        if self.entity_type == "course":
            if not self.course:
                raise ValidationError("Course field must be filled for a course inquiry.")

            # Ensure either college or university is attached to the course inquiry
            if not self.college and not self.university:
                raise ValidationError("Course inquiries must be linked to a university or college.")
