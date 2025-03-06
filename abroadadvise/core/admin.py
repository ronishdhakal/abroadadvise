from django.contrib import admin
from .reviews import Review
from .models import District, VerifiedItem  # ✅ Imported VerifiedItem

admin.site.register(District)
admin.site.register(VerifiedItem)  # ✅ Registered VerifiedItem

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
