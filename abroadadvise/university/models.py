from django.db import models
from django.conf import settings
from django.utils.text import slugify
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from tinymce.models import HTMLField
from core.models import VerifiedItem, Discipline  # ✅ Import Discipline
from django.contrib.auth import get_user_model

User = get_user_model()  # ✅ Get the user model dynamically

class University(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True
    )

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

    priority = models.PositiveIntegerField(null=True, blank=True, default=None, help_text="Lower the number, higher the priority")

    eligibility = HTMLField(blank=True, null=True)
    facilities_features = HTMLField(blank=True, null=True)
    scholarship = HTMLField(blank=True, null=True)
    tuition_fees = models.CharField(max_length=100, blank=True, null=True)
    
    # ✅ New field for QS World University Rankings
    qs_world_ranking = models.CharField(max_length=100, blank=True, null=True)

    consultancies_to_apply = models.ManyToManyField('consultancy.Consultancy', blank=True, related_name='universities')

    about = HTMLField(blank=True, null=True)
    faqs = HTMLField(blank=True, null=True)

    # ✅ Many-to-Many relationship with Discipline
    disciplines = models.ManyToManyField(Discipline, related_name="universities", blank=True)

    def __str__(self):
        """ ✅ Return University name along with its linked disciplines """
        discipline_names = ', '.join(discipline.name for discipline in self.disciplines.all())
        return f"{self.name} ({discipline_names})" if discipline_names else self.name

    def assign_user(self, email, phone, name, password):
        """
        ✅ Manually create and assign a user to this university.
        """
        if not self.user:
            username = email.split('@')[0] if email else f"university_{self.id}"
            user, created = User.objects.get_or_create(username=username, email=email)
            if created:
                user.set_password(password)
                user.first_name = name
                user.role = "university"  # ✅ Explicitly set role to "university"
                user.save()
            self.user = user
            self.save(update_fields=["user"])

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

# ✅ Automatically Create a User for Each University
@receiver(post_save, sender=University)
def create_university_user(sender, instance, created, **kwargs):
    if created and not instance.user:
        User = get_user_model()

        # ✅ Ensure email exists before creating a user
        if instance.email:
            user, user_created = User.objects.get_or_create(username=instance.email.split('@')[0], email=instance.email)
        else:
            # ✅ If no email, create a generic user but ensure uniqueness
            username = f"university_{instance.id}"
            user, user_created = User.objects.get_or_create(username=username)

        # ✅ Set role explicitly to "university"
        if user_created:
            user.role = "university"
            user.save()

        instance.user = user
        instance.save(update_fields=["user"])
