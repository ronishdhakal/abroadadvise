from django.db import models
from university.models import University
from consultancy.models import Consultancy
from destination.models import Destination
from exam.models import Exam
from event.models import Event
from course.models import Course

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
        # Ensure only the correct foreign key field is populated based on the entity_type
        if self.entity_type == "university" and not self.university:
            raise ValidationError("University field must be filled for a university inquiry.")
        if self.entity_type == "consultancy" and not self.consultancy:
            raise ValidationError("Consultancy field must be filled for a consultancy inquiry.")
        if self.entity_type == "destination" and not self.destination:
            raise ValidationError("Destination field must be filled for a destination inquiry.")
        if self.entity_type == "exam" and not self.exam:
            raise ValidationError("Exam field must be filled for an exam inquiry.")
        if self.entity_type == "event" and not self.event:
            raise ValidationError("Event field must be filled for an event inquiry.")
        if self.entity_type == "course" and not self.course:
            raise ValidationError("Course field must be filled for a course inquiry.")
        
        # Ensure that only one of the ForeignKey fields is populated based on entity_type
        if self.entity_type == "university":
            if self.consultancy or self.destination or self.exam or self.event or self.course:
                raise ValidationError("Only the University ForeignKey field should be filled for this inquiry.")
        elif self.entity_type == "consultancy":
            if self.university or self.destination or self.exam or self.event or self.course:
                raise ValidationError("Only the Consultancy ForeignKey field should be filled for this inquiry.")
        elif self.entity_type == "destination":
            if self.university or self.consultancy or self.exam or self.event or self.course:
                raise ValidationError("Only the Destination ForeignKey field should be filled for this inquiry.")
        elif self.entity_type == "exam":
            if self.university or self.consultancy or self.destination or self.event or self.course:
                raise ValidationError("Only the Exam ForeignKey field should be filled for this inquiry.")
        elif self.entity_type == "event":
            if self.university or self.consultancy or self.destination or self.exam or self.course:
                raise ValidationError("Only the Event ForeignKey field should be filled for this inquiry.")
        elif self.entity_type == "course":
            if self.university or self.consultancy or self.destination or self.exam or self.event:
                raise ValidationError("Only the Course ForeignKey field should be filled for this inquiry.")

