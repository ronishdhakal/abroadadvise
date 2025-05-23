from django.db import models
from django.utils.text import slugify
from django.db.models.signals import pre_save
from django.dispatch import receiver
from tinymce.models import HTMLField

class Destination(models.Model):
    title = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(unique=True, blank=True, null=True)
    country_logo = models.ImageField(upload_to='logos/', blank=True, null=True)
    cover_page = models.ImageField(upload_to='cover_pages/', blank=True, null=True)

    why_choose = HTMLField(blank=True, null=True)
    scholarships = HTMLField(blank=True, null=True)
    requirements = HTMLField(blank=True, null=True)
    documents_required = HTMLField(blank=True, null=True)
    more_information = HTMLField(blank=True, null=True)
    faqs = HTMLField(blank=True, null=True)

    # ✅ New Fields
    ept_requirement = models.CharField(max_length=255, blank=True, null=True)
    gpa_requirement = models.CharField(max_length=255, blank=True, null=True)

    # Keeping relationships optional
    courses_to_study = models.ManyToManyField(
        'course.Course', related_name='destinations', blank=True
    )
    universities = models.ManyToManyField(
        'university.University', related_name='destinations', blank=True
    )
    consultancies = models.ManyToManyField(
        'consultancy.Consultancy', related_name='destination_consultancies', blank=True
    )

    def __str__(self):
        return self.title

@receiver(pre_save, sender=Destination)
def create_slug(sender, instance, **kwargs):
    if not instance.slug:
        base_slug = slugify(instance.title)
        slug = base_slug
        counter = 1

        while Destination.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1

        instance.slug = slug
