from django.db import models

class District(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

# ✅ New Verified Model (for courses, consultancy, university, events)
class VerifiedItem(models.Model):
    VERIFIED_CHOICES = [
        (True, "Yes"),
        (False, "No"),
    ]

    verified = models.BooleanField(default=False, choices=VERIFIED_CHOICES)

    def __str__(self):
        return "Verified" if self.verified else "Not Verified"

# ✅ New Discipline Model (e.g., IT, Management, Engineering)
class Discipline(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name

# SiteSettings for global settings
class SiteSetting(models.Model):
    site_logo = models.ImageField(upload_to='site_settings/', blank=True, null=True)
    hero_image = models.ImageField(upload_to='site_settings/', blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "Global Site Settings"

    class Meta:
        verbose_name = "Site Setting"
        verbose_name_plural = "Site Settings"

# Ad model for advertisement system
class Ad(models.Model):
    PLACEMENT_CHOICES = [
        ('roadblock_ad', 'Roadblock Ad All Pages'),
        ('exclusive_below_navbar', 'Exclusive Ad Below Navbar'),
        ('exclusive_above_footer', 'Exclusive Ad Above Footer'),
        ('below_navbar_blog_news', 'Below Navbar Blog and News'),
        ('above_headline_blog_news', 'Above Headline Blog and News'),
        ('below_headline_blog_news', 'Below Headline Blog and News'),
        ('below_featured_image_blog_news', 'Below Featured Image Blog and News'),
        ('above_footer_blog_news', 'Above Footer Blog and News'),
    ]

    title = models.CharField(max_length=255, help_text="Ad title for internal reference")
    placement = models.CharField(max_length=50, choices=PLACEMENT_CHOICES, unique=True, help_text="Where the ad will appear")
    desktop_image = models.ImageField(upload_to='ads/desktop/', blank=True, null=True, help_text="Image for desktop view")
    mobile_image = models.ImageField(upload_to='ads/mobile/', blank=True, null=True, help_text="Image for mobile view")
    redirect_url = models.URLField(blank=True, null=True, help_text="URL to redirect when the ad is clicked")
    is_active = models.BooleanField(default=True, help_text="Control whether the ad is active or not")
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.get_placement_display()}"

    class Meta:
        verbose_name = "Advertisement"
        verbose_name_plural = "Advertisements"
