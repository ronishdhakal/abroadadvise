from django.db import models
from django.conf import settings
from django.utils.text import slugify
from django.db.models.signals import pre_save, post_delete
from django.dispatch import receiver
from tinymce.models import HTMLField
from django.contrib.auth import get_user_model

User = get_user_model()

class Consultancy(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(unique=True, blank=True, null=True)
    brochure = models.FileField(upload_to='brochure/', blank=True, null=True)
    logo = models.ImageField(upload_to='logo/', blank=True, null=True)
    cover_photo = models.ImageField(upload_to='cover/', blank=True, null=True)
    districts = models.ManyToManyField('core.District', blank=True)
    verified = models.BooleanField(default=False)
    address = models.TextField()
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    establishment_date = models.DateField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    email = models.EmailField(unique=True, blank=True, null=True)
    phone = models.CharField(max_length=20, unique=True, blank=True, null=True)
    moe_certified = models.BooleanField(default=False)
    about = HTMLField(blank=True, null=True)
    priority = models.PositiveIntegerField(null=True, blank=True, default=None, help_text="Lower the number, higher the priority")
    google_map_url = models.URLField(blank=True, null=True)
    services = HTMLField(blank=True, null=True)
    has_branches = models.BooleanField(default=False)

    # ManyToMany Relationships
    study_abroad_destinations = models.ManyToManyField('destination.Destination', related_name='consultancy_destinations', blank=True)
    test_preparation = models.ManyToManyField('exam.Exam', related_name='consultancies', blank=True)
    partner_universities = models.ManyToManyField('university.University', related_name='consultancies', blank=True)

    def __str__(self):
        return self.name

    def assign_user(self, email, phone, name, password):
        """
        ✅ Manually create and assign a user to this consultancy.
        Uses slugified consultancy name for username.
        """
        if not self.user:
            base_username = slugify(name) or f"consultancy_{self.id}"
            username = base_username
            counter = 1

            while User.objects.filter(username=username).exists():
                username = f"{base_username}-{counter}"
                counter += 1

            user, created = User.objects.get_or_create(username=username, email=email)
            if created:
                user.set_password(password)
                user.first_name = name
                user.role = "consultancy"
                user.save()

            self.user = user
            self.save(update_fields=["user"])


@receiver(pre_save, sender=Consultancy)
def create_slug(sender, instance, **kwargs):
    if not instance.slug:
        base_slug = slugify(instance.name)
        slug = base_slug
        counter = 1
        while Consultancy.objects.filter(slug=slug).exclude(id=instance.id).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        instance.slug = slug


@receiver(post_delete, sender=Consultancy)
def delete_user_on_consultancy_delete(sender, instance, **kwargs):
    if instance.user:
        instance.user.delete()


class ConsultancyBranch(models.Model):
    consultancy = models.ForeignKey(Consultancy, related_name='branches', on_delete=models.CASCADE)
    branch_name = models.CharField(max_length=255)
    location = models.TextField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)

    def __str__(self):
        return f"{self.consultancy.name} - {self.branch_name}"


class ConsultancyGallery(models.Model):
    consultancy = models.ForeignKey(Consultancy, related_name='gallery_images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='gallery/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.consultancy.name} - {self.image}"
