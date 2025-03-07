from django.db import models
from django.utils.text import slugify
from django.db.models.signals import pre_save
from django.dispatch import receiver
from tinymce.models import HTMLField
from core.models import VerifiedItem

class University(models.Model):
    UNIVERSITY_TYPE_CHOICES = (
        ('private', 'Private'),
        ('community', 'Community'),
    )

    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(unique=True, blank=True, null=True)
    brochure = models.FileField(upload_to='brochure/', blank=True, null=True)
    country = models.CharField(max_length=255)
    address = models.TextField()
    map_coordinate = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    type = models.CharField(max_length=20, choices=UNIVERSITY_TYPE_CHOICES)
    website = models.URLField(blank=True, null=True)
    logo = models.ImageField(upload_to='logo/', blank=True, null=True)
    cover_photo = models.ImageField(upload_to='cover/', blank=True, null=True)

    verified = models.ForeignKey(VerifiedItem, on_delete=models.SET_NULL, null=True, blank=True)

    priority = models.PositiveIntegerField(default=999, help_text="1 has the highest priority.")

    eligibility = HTMLField(blank=True, null=True)
    facilities_features = HTMLField(blank=True, null=True)
    scholarship = HTMLField(blank=True, null=True)
    tuition_fees = models.CharField(max_length=100, blank=True, null=True)

    consultancies_to_apply = models.ManyToManyField('consultancy.Consultancy', blank=True, related_name='universities')

    about = HTMLField(blank=True, null=True)
    faqs = HTMLField(blank=True, null=True)

    def __str__(self):
        return self.name

@receiver(pre_save, sender=University)
def create_slug(sender, instance, **kwargs):
    if not instance.slug:
        base_slug = slugify(instance.name)
        slug = base_slug
        counter = 1
        while University.objects.filter(slug=slug).exclude(id=instance.id).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        instance.slug = slug
