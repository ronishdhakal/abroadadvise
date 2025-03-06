from django.db import models
from django.utils.text import slugify
from django.db.models.signals import pre_save
from django.dispatch import receiver
from tinymce.models import HTMLField  # ✅ Import TinyMCE HTMLField

class Exam(models.Model):
    EXAM_TYPE_CHOICES = (
        ('physical', 'Physical'),
        ('online', 'Online'),
        ('hybrid', 'Hybrid'),
    )

    name = models.CharField(max_length=255, unique=True, default="Default Exam Name")
    slug = models.SlugField(unique=True, blank=True, null=True)
    icon = models.ImageField(upload_to='exams/icons/', blank=True, null=True)
    
    # ✅ Replaced TextFields with HTMLField (TinyMCE)
    short_description = HTMLField(blank=True, null=True)
    exam_fee = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    type = models.CharField(max_length=50, choices=EXAM_TYPE_CHOICES)

    # Use string references instead of direct imports
    preparation_classes = models.ManyToManyField('consultancy.Consultancy', related_name='exams_preparation', blank=True)

    exam_centers = HTMLField(blank=True, null=True)
    about = HTMLField(blank=True, null=True)

    similar_exams = models.ManyToManyField('self', blank=True)

    def __str__(self):
        return self.name

@receiver(pre_save, sender=Exam)
def create_slug(sender, instance, **kwargs):
    if not instance.slug:
        instance.slug = slugify(instance.name)
