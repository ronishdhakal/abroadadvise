from django.contrib import admin
from .models import Scholarship

@admin.register(Scholarship)
class ScholarshipAdmin(admin.ModelAdmin):
    list_display = ("title", "by", "destination", "published_date", "is_published", "study_level")
    list_filter = ("destination", "is_published", "study_level")
    search_fields = ("title", "by", "detail")
    prepopulated_fields = {"slug": ("title",)}
    ordering = ("-published_date",)
