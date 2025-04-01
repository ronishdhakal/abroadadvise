from django.contrib import admin
from .models import College, CollegeGallery, CollegeBranch

class CollegeBranchInline(admin.TabularInline):
    model = CollegeBranch
    extra = 1

class CollegeGalleryInline(admin.TabularInline):
    model = CollegeGallery
    extra = 1
    readonly_fields = ['image_preview']

    def image_preview(self, obj):
        from django.utils.html import format_html
        if obj.image:
            return format_html('<img src="{}" width="150" height="auto" />', obj.image.url)
        else:
            return '(No image)'

    image_preview.short_description = 'Image Preview'

class CollegeAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'phone', 'verified', 'moe_certified']
    list_filter = ['verified', 'moe_certified']
    search_fields = ['name', 'email', 'phone']
    inlines = [CollegeBranchInline, CollegeGalleryInline]

    fieldsets = [
        ("Basic Info", {"fields": ["name", "slug", "verified", "moe_certified"]}),
        ("Contact", {"fields": ["email", "phone", "website"]}),
        ("About", {"fields": ["about", "services"]}),
        ("Location", {"fields": ["districts", "address", "latitude", "longitude"]}),
        ("Media", {"fields": ["logo", "cover_photo", "brochure"]}),
        ("Priority", {"fields": ["priority"]}),
        ("Other", {"fields": ["establishment_date", "google_map_url", "has_branches"]}),
        ("Study", {"fields": ["study_abroad_destinations", "affiliated_universities"]}),
    ]

    prepopulated_fields = {"slug": ("name",)}
    filter_horizontal = ("districts", "study_abroad_destinations", "affiliated_universities")

admin.site.register(College, CollegeAdmin)
# admin.site.register(CollegeGallery)  # now inline
# admin.site.register(CollegeBranch)   # now inline
