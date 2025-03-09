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

from django.db import models

class SiteSetting(models.Model):
    site_logo = models.ImageField(upload_to='site_settings/', blank=True, null=True)
    hero_image = models.ImageField(upload_to='site_settings/', blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "Global Site Settings"

    class Meta:
        verbose_name = "Site Setting"
        verbose_name_plural = "Site Settings"
