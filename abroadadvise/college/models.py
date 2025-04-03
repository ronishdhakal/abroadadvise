from django.db import models
from django.conf import settings
from django.utils.text import slugify
from django.db.models.signals import pre_save, post_delete, post_save
from django.dispatch import receiver
from tinymce.models import HTMLField
from django.contrib.auth import get_user_model

User = get_user_model()

class College(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(unique=True, blank=True, null=True)
    brochure = models.FileField(upload_to='college/brochure/', blank=True, null=True)
    logo = models.ImageField(upload_to='college/logo/', blank=True, null=True)
    cover_photo = models.ImageField(upload_to='college/cover/', blank=True, null=True)
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
    study_abroad_destinations = models.ManyToManyField('destination.Destination', related_name='college_destinations', blank=True)
    affiliated_universities = models.ManyToManyField('university.University', related_name='colleges', blank=True)

    def __str__(self):
        return self.name

    def assign_user(self, email, phone, password):
        """
        ✅ Create and assign a user using college name as username and full name.
        """
        if not self.user:
            base_username = slugify(self.name) or f"college_{self.id}"
            username = base_username
            counter = 1

            # Ensure username uniqueness
            while User.objects.filter(username=username).exists():
                username = f"{base_username}-{counter}"
                counter += 1

            # Avoid get_or_create to ensure full control over username assignment
            user = User(
                username=username,
                email=email,
                first_name=self.name,
                role="college"
            )
            user.set_password(password)
            user.save()

            self.user = user
            self.save(update_fields=["user"])


@receiver(pre_save, sender=College)
def create_college_slug(sender, instance, **kwargs):
    if not instance.slug:
        base_slug = slugify(instance.name)
        slug = base_slug
        counter = 1
        while College.objects.filter(slug=slug).exclude(id=instance.id).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        instance.slug = slug


@receiver(post_delete, sender=College)
def delete_user_on_college_delete(sender, instance, **kwargs):
    if instance.user:
        instance.user.delete()


@receiver(post_save, sender=College)
def create_college_user(sender, instance, created, **kwargs):
    if created and not instance.user and instance.email and instance.phone:
        instance.assign_user(
            email=instance.email,
            phone=instance.phone,
            password="college123"  # 🔐 You may replace with a secure random password generator
        )


class CollegeBranch(models.Model):
    college = models.ForeignKey(College, related_name='branches', on_delete=models.CASCADE)
    branch_name = models.CharField(max_length=255)
    location = models.TextField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)

    def __str__(self):
        return f"{self.college.name} - {self.branch_name}"


class CollegeGallery(models.Model):
    college = models.ForeignKey(College, related_name='gallery_images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='college/gallery/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.college.name} - {self.image}"
