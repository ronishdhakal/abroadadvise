from django.contrib import admin
from .models import Consultancy, ConsultancyGallery, ConsultancyBranch

class ConsultancyBranchInline(admin.TabularInline):
    model = ConsultancyBranch
    extra = 1

class ConsultancyGalleryInline(admin.TabularInline):
    model = ConsultancyGallery
    extra = 1
    readonly_fields = ['image_preview'] # add image preview

    def image_preview(self, obj):
        from django.utils.html import format_html
        if obj.image:
            return format_html('<img src="{}" width="150" height="auto" />', obj.image.url)
        else:
            return '(No image)'

    image_preview.short_description = 'Image Preview'

class ConsultancyAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'phone', 'verified', 'moe_certified']  # Display the 'verified' field and moe_certified
    list_filter = ['verified', 'moe_certified']  # Add filters for verified and moe_certified
    search_fields = ['name', 'email', 'phone']
    inlines = [ConsultancyBranchInline, ConsultancyGalleryInline]

    fieldsets = [
        ("Basic Info", {"fields": ["name", "slug", "verified", "moe_certified"]}),
        ("Contact", {"fields": ["email", "phone", "website"]}),
        ("About", {"fields": ["about", "services"]}),
        (
            "Location",
            {"fields": ["districts", "address", "latitude", "longitude"]},
        ),
        ("Media", {"fields": ["logo", "cover_photo", "brochure"]}),
        ("Priority", {"fields": ["priority"]}),
         (
            "Other",
            {"fields": ["establishment_date", "google_map_url", "has_branches"]},
        ),
         (
            "Study",
            {"fields": ["study_abroad_destinations", "test_preparation", "partner_universities"]},
        ),
    ]

    prepopulated_fields = {"slug": ("name",)}
    filter_horizontal = ("districts", "study_abroad_destinations", "test_preparation", "partner_universities")

admin.site.register(Consultancy, ConsultancyAdmin)
# admin.site.register(ConsultancyGallery) # now gallery is inline
# admin.site.register(ConsultancyBranch) # now branch is inline
