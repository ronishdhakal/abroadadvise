from django.db import models
from django.utils.text import slugify

class FeaturedPage(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, help_text="Used in the URL, e.g., /featured/<slug>")

    # ✅ New fields for headings
    main_title = models.CharField(max_length=255, blank=True, null=True, help_text="Displayed as <h1> on the page")
    sub_title = models.CharField(max_length=255, blank=True, null=True, help_text="Displayed as <h2> below top description")

    # ✅ Destination for display
    destination = models.CharField(max_length=100, blank=True, null=True, help_text="e.g., Canada, USA, UK")

    # ✅ Page content
    description_top = models.TextField(blank=True, null=True)
    description_bottom = models.TextField(blank=True, null=True)
    api_route = models.CharField(
        max_length=500,
        help_text="Relative API path. E.g., /consultancy/?destination=canada"
    )
    priority = models.PositiveIntegerField(default=999, help_text="Lower = higher priority")
    is_active = models.BooleanField(default=True)

    # ✅ SEO metadata
    meta_title = models.CharField(max_length=255, blank=True, null=True)
    meta_description = models.TextField(blank=True, null=True)
    meta_author = models.CharField(max_length=255, blank=True, null=True)

    # ✅ Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
