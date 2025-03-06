from django.db import models
from django.utils.text import slugify
from django.db.models.signals import pre_save
from django.dispatch import receiver
from tinymce.models import HTMLField  # ✅ Import TinyMCE HTMLField

class News(models.Model):
    title = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(unique=True, blank=True, null=True)
    date = models.DateField(auto_now_add=True)
    author = models.CharField(max_length=255)
    featured_image = models.ImageField(upload_to='news/', blank=True, null=True)
    
    # ✅ Replaced TextField with HTMLField (TinyMCE)
    detail = HTMLField()

    def __str__(self):
        return self.title

@receiver(pre_save, sender=News)
def create_slug(sender, instance, **kwargs):
    if not instance.slug:
        instance.slug = slugify(instance.title)
