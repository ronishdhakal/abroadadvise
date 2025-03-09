from django.db import models
from django.apps import apps
from django.conf import settings
from django.utils.text import slugify
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from tinymce.models import HTMLField

User = settings.AUTH_USER_MODEL

# Define Consultancy Model (without direct imports)
class Consultancy(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(unique=True, blank=True, null=True)
    brochure = models.FileField(upload_to='brochure/', blank=True, null=True)
    logo = models.ImageField(upload_to='logo/', blank=True, null=True)
    cover_photo = models.ImageField(upload_to='cover/', blank=True, null=True)
    districts = models.ManyToManyField('core.District', blank=True)

    verified = models.ForeignKey('core.VerifiedItem', on_delete=models.SET_NULL, null=True, blank=True)

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

    # Restored ManyToMany Relationships
    study_abroad_destinations = models.ManyToManyField('destination.Destination', related_name='consultancy_destinations', blank=True)
    test_preparation = models.ManyToManyField('exam.Exam', related_name='consultancies', blank=True)
    partner_universities = models.ManyToManyField('university.University', related_name='consultancies', blank=True)

    def __str__(self):
        return self.name

    def get_district(self):
        # Lazy load the District model using apps.get_model
        District = apps.get_model('core', 'District')
        return self.districts.all()

    def get_verified_item(self):
        # Lazy load the VerifiedItem model using apps.get_model
        VerifiedItem = apps.get_model('core', 'VerifiedItem')
        return self.verified

class ConsultancyBranch(models.Model):
    consultancy = models.ForeignKey(Consultancy, related_name='branches', on_delete=models.CASCADE)
    branch_name = models.CharField(max_length=255)
    location = models.TextField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)

    def __str__(self):
        return f"{self.consultancy.name} - {self.branch_name}"

# Signal to create a slug before saving the Consultancy
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

# Signal to create a user when a Consultancy is created if it doesn't exist
@receiver(post_save, sender=Consultancy)
def create_consultancy_user(sender, instance, created, **kwargs):
    if created and not instance.user:
        username = instance.email.split('@')[0] if instance.email else f"consultancy_{instance.id}"
        user, created = User.objects.get_or_create(username=username, email=instance.email or "")
        instance.user = user
        instance.save()

class ConsultancyGallery(models.Model):
    consultancy = models.ForeignKey(Consultancy, related_name='gallery_images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='gallery/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.consultancy.name} - {self.image}"
