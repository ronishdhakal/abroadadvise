from django.db import models
from django.utils.text import slugify
from django.db.models.signals import pre_save
from django.dispatch import receiver
from tinymce.models import HTMLField

class Scholarship(models.Model):
    LEVEL_CHOICES = [
        ('bachelors', "Bachelor's"),
        ('masters', "Master's"),
        ('phd', "PhD"),
        ('diploma', "Diploma"),
    ]

    title = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(unique=True, blank=True, null=True)
    by = models.CharField(max_length=255, help_text="Name of the university or institution offering the scholarship")
    destination = models.ForeignKey(
    'destination.Destination',
    on_delete=models.CASCADE,
    related_name='scholarship_items'  # ✅ Changed to avoid conflict
)

    featured_image = models.ImageField(upload_to='scholarship/images/', blank=True, null=True)
    detail = HTMLField(blank=True, null=True)
    published_date = models.DateField(blank=True, null=True)
    active_from = models.DateField(blank=True, null=True)
    active_to = models.DateField(blank=True, null=True)
    is_published = models.BooleanField(default=True)
    study_level = models.CharField(max_length=20, choices=LEVEL_CHOICES, blank=True, null=True)

    def __str__(self):
        return self.title

@receiver(pre_save, sender=Scholarship)
def create_slug(sender, instance, **kwargs):
    if not instance.slug:
        base_slug = slugify(instance.title)
        slug = base_slug
        counter = 1
        while Scholarship.objects.filter(slug=slug).exclude(id=instance.id).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        instance.slug = slug
