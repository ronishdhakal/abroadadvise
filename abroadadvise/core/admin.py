from django.utils.safestring import mark_safe
from django.contrib import admin
from .reviews import Review
from .models import District, VerifiedItem, Discipline  # ✅ Imported Discipline
from .models import SiteSetting #For Logos Hero Image

from .models import Ad #For Ad

admin.site.register(District)
admin.site.register(VerifiedItem)  # ✅ Registered VerifiedItem
admin.site.register(Discipline)  # ✅ Registered Discipline


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['user', 'content_type', 'object_id', 'rating', 'is_approved', 'created_at']
    list_filter = ['is_approved', 'content_type', 'rating']
    search_fields = ['user__username', 'review_text']
    actions = ['approve_reviews']

    def approve_reviews(self, request, queryset):
        queryset.update(is_approved=True)
        self.message_user(request, "Selected reviews have been approved.")
    approve_reviews.short_description = "Approve selected reviews"
    
@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    def site_logo_preview(self, obj):
        if obj.site_logo:
            return mark_safe(f'<img src="{obj.site_logo.url}" width="100" height="auto" style="border-radius:5px;"/>')
        return "No Logo Uploaded"
    
    def hero_image_preview(self, obj):
        if obj.hero_image:
            return mark_safe(f'<img src="{obj.hero_image.url}" width="150" height="auto" style="border-radius:5px;"/>')
        return "No Hero Image Uploaded"

    site_logo_preview.short_description = "Current Logo"
    hero_image_preview.short_description = "Current Hero Image"

    list_display = ['site_logo_preview', 'hero_image_preview', 'updated_at']
    readonly_fields = ['site_logo_preview', 'hero_image_preview']

    def has_add_permission(self, request):
        # Prevent creating multiple settings, allow only one entry
        return not SiteSetting.objects.exists()
    

# Ad System@admin.register(Ad)
@admin.register(Ad)
class AdAdmin(admin.ModelAdmin):
    def desktop_preview(self, obj):
        if obj.desktop_image:
            return mark_safe(f'<img src="{obj.desktop_image.url}" width="150" height="auto" style="border-radius:5px;"/>')
        return "No Image"

    def mobile_preview(self, obj):
        if obj.mobile_image:
            return mark_safe(f'<img src="{obj.mobile_image.url}" width="100" height="auto" style="border-radius:5px;"/>')
        return "No Image"

    desktop_preview.short_description = "Desktop Ad Preview"
    mobile_preview.short_description = "Mobile Ad Preview"

    list_display = ['title', 'placement', 'desktop_preview', 'mobile_preview', 'is_active', 'updated_at']
    list_filter = ['placement', 'is_active']
    search_fields = ['title', 'placement']
    readonly_fields = ['desktop_preview', 'mobile_preview']

    def has_add_permission(self, request):
        """Allow adding new ads."""
        return True  # Allow adding new ads

    def get_queryset(self, request):
        """Ensure only one ad per placement is shown."""
        return super().get_queryset(request).order_by('placement')
