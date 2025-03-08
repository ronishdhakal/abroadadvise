from django.db import models
from django.utils.text import slugify
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from tinymce.models import HTMLField  # TinyMCE HTML Editor
from core.models import Discipline  # ✅ Importing Discipline model
from destination.models import Destination  # ✅ Importing Destination model
from university.models import University  # ✅ Importing University model

class Course(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True, null=True)
    abbreviation = models.CharField(max_length=50, blank=True, null=True)

    university = models.ForeignKey(University, on_delete=models.CASCADE, related_name='university_courses')
    destination = models.ForeignKey(Destination, on_delete=models.SET_NULL, null=True, blank=True, related_name='courses')

    duration = models.CharField(max_length=50, blank=True, null=True)
    level = models.CharField(max_length=100, blank=True, null=True)
    icon = models.ImageField(upload_to='icons/', blank=True, null=True)
    cover_image = models.ImageField(upload_to='cover_images/', blank=True, null=True)
    fee = models.CharField(max_length=100, blank=True, null=True)

    # ✅ Many-to-Many relationship with Discipline
    disciplines = models.ManyToManyField(Discipline, related_name="courses", blank=True)

    priority = models.PositiveIntegerField(null=True, blank=True, default=None, help_text="Lower the number, higher the priority")

    short_description = HTMLField(blank=True, null=True)
    eligibility = HTMLField(blank=True, null=True)
    course_structure = HTMLField(blank=True, null=True)
    job_prospects = HTMLField(blank=True, null=True)
    scholarship = HTMLField(blank=True, null=True)
    features = HTMLField(blank=True, null=True)

    def __str__(self):
        """ ✅ Return Course name along with its linked disciplines """
        discipline_names = ', '.join(discipline.name for discipline in self.disciplines.all())
        return f"{self.name} ({discipline_names})" if discipline_names else self.name

@receiver(pre_save, sender=Course)
def create_slug(sender, instance, **kwargs):
    """ ✅ Ensure unique slug before saving """
    if not instance.slug:
        base_slug = slugify(instance.name)
        slug = base_slug
        counter = 1
        while Course.objects.filter(slug=slug).exclude(id=instance.id).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        instance.slug = slug

@receiver(post_save, sender=Course)
def assign_destination(sender, instance, **kwargs):
    """ ✅ Automatically assign the destination based on the university's country """
    if instance.university and instance.university.country:
        destination = Destination.objects.filter(title=instance.university.country).first()
        if destination and instance.destination != destination:
            instance.destination = destination
            instance.save(update_fields=["destination"])
