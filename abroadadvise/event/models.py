from django.db import models
from django.utils.text import slugify
from django.db.models.signals import pre_save
from django.dispatch import receiver
from university.models import University
from consultancy.models import Consultancy
from destination.models import Destination  # ✅ Import Destination model
from tinymce.models import HTMLField  # ✅ Import TinyMCE HTMLField

class Event(models.Model):
    EVENT_TYPE_CHOICES = (
        ('physical', 'Physical'),
        ('online', 'Online'),
        ('hybrid', 'Hybrid'),
    )

    REGISTRATION_TYPE_CHOICES = (
        ('free', 'Free'),
        ('paid', 'Paid'),
    )

    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(unique=True, blank=True, null=True)
    featured_image = models.ImageField(upload_to='events/featured/', blank=True, null=True)
    date = models.DateField()
    duration = models.CharField(max_length=50, blank=True, null=True)
    time = models.TimeField()
    event_type = models.CharField(max_length=20, choices=EVENT_TYPE_CHOICES)
    organizer = models.ForeignKey(Consultancy, on_delete=models.SET_NULL, null=True, blank=True)
    targeted_destinations = models.ManyToManyField(Destination, blank=True, related_name='events')  # ✅ Allow multiple destinations
    location = models.CharField(max_length=255, blank=True, null=True)
    description = HTMLField(blank=True, null=True)  # ✅ TinyMCE applied here
    registration_type = models.CharField(max_length=10, choices=REGISTRATION_TYPE_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    related_universities = models.ManyToManyField(University, blank=True, related_name='events')
    related_consultancies = models.ManyToManyField(Consultancy, blank=True, related_name='events')

    def __str__(self):
        return self.name

@receiver(pre_save, sender=Event)
def create_slug(sender, instance, **kwargs):
    if not instance.slug:
        instance.slug = slugify(instance.name)

class EventGallery(models.Model):
    event = models.ForeignKey(Event, related_name='gallery_images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='events/gallery/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.event.name} - Image"

# ✅ Event Registration Model
class EventRegistration(models.Model):
    PAYMENT_STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('paid', 'Paid'),
    )

    event = models.ForeignKey(Event, related_name="registrations", on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    registered_at = models.DateTimeField(auto_now_add=True)
    payment_status = models.CharField(max_length=10, choices=PAYMENT_STATUS_CHOICES, default='pending')
    
    def __str__(self):
        return f"{self.name} - {self.event.name}"
