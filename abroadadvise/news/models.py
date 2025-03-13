from django.db import models
from django.utils.text import slugify
from django.contrib.auth import get_user_model
from django.db.models.signals import pre_save
from django.dispatch import receiver
from tinymce.models import HTMLField  # ✅ Import TinyMCE HTMLField

User = get_user_model()

class NewsCategory(models.Model):
    """
    News Category Model - Allows categorizing news articles.
    """
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(unique=True, blank=True, null=True)

    def __str__(self):
        return self.name

@receiver(pre_save, sender=NewsCategory)
def create_news_category_slug(sender, instance, **kwargs):
    if not instance.slug:
        instance.slug = slugify(instance.name)

class News(models.Model):
    """
    News Model - Stores news articles with priority, rich text, and category.
    """
    title = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(unique=True, blank=True, null=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='news_articles', null=True, blank=True)  # ✅ Tracks who posted
    category = models.ForeignKey(NewsCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name="news")
    featured_image = models.ImageField(upload_to='news/featured/', blank=True, null=True)
    detail = HTMLField()  # ✅ Supports rich text
    date = models.DateTimeField(auto_now_add=True)  # ✅ Renamed for clarity
    updated_at = models.DateTimeField(auto_now=True)
    is_published = models.BooleanField(default=True)
    priority = models.PositiveIntegerField(null=True, blank=True, default=None, help_text="Lower the number, higher the priority")

    def __str__(self):
        return self.title

@receiver(pre_save, sender=News)
def create_news_slug(sender, instance, **kwargs):
    if not instance.slug:
        base_slug = slugify(instance.title)
        slug = base_slug
        counter = 1
        while News.objects.filter(slug=slug).exclude(id=instance.id).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        instance.slug = slug

class NewsComment(models.Model):
    """
    News Comment Model - Allows users to comment on news articles.
    """
    post = models.ForeignKey(News, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='news_comments')
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(default=False)  # ✅ Needs approval

    def __str__(self):
        return f"Comment by {self.user.username} on {self.post.title}"
