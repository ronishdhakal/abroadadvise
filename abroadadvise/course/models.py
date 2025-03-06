from django.db import models
from django.utils.text import slugify
from django.db.models.signals import pre_save
from django.dispatch import receiver
from tinymce.models import HTMLField  # TinyMCE HTML Editor

class Course(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True, null=True)
    abbreviation = models.CharField(max_length=50, blank=True, null=True)

    university = models.ForeignKey('university.University', on_delete=models.CASCADE, related_name='university_courses')

    duration = models.CharField(max_length=50, blank=True, null=True)
    level = models.CharField(max_length=100, blank=True, null=True)
    icon = models.ImageField(upload_to='icons/', blank=True, null=True)
    cover_image = models.ImageField(upload_to='cover_images/', blank=True, null=True)
    fee = models.CharField(max_length=100, blank=True, null=True)

    short_description = HTMLField(blank=True, null=True)
    eligibility = HTMLField(blank=True, null=True)
    course_structure = HTMLField(blank=True, null=True)
    job_prospects = HTMLField(blank=True, null=True)
    scholarship = HTMLField(blank=True, null=True)
    features = HTMLField(blank=True, null=True)

    def __str__(self):
        return self.name

@receiver(pre_save, sender=Course)
def create_slug(sender, instance, **kwargs):
    if not instance.slug:
        instance.slug = slugify(instance.name)
