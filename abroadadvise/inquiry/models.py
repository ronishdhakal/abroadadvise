from django.db import models
from university.models import University  # Import University model
from consultancy.models import Consultancy  # Import Consultancy model

class Inquiry(models.Model):
    ENTITY_CHOICES = [
        ('consultancy', 'Consultancy'),
        ('university', 'University'),
        ('course', 'Course'),
        ('exam', 'Exam'),
        ('destination', 'Destination'),
        ('event', 'Event'),
    ]
    
    entity_type = models.CharField(max_length=20, choices=ENTITY_CHOICES)
    entity_id = models.PositiveIntegerField()  # Stores the ID of Consultancy, University, etc.
    
    # ✅ Only University & Consultancy inquiries will be linked to specific institutions
    university = models.ForeignKey(University, on_delete=models.CASCADE, related_name="inquiries", null=True, blank=True)
    consultancy = models.ForeignKey(Consultancy, on_delete=models.CASCADE, related_name="inquiries", null=True, blank=True)

    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Inquiry from {self.name} about {self.entity_type} ID {self.entity_id}"
