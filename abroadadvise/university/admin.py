from django.contrib import admin
from django.contrib.auth import get_user_model
from .models import University

User = get_user_model()

@admin.register(University)
class UniversityAdmin(admin.ModelAdmin):
    list_display = ('name', 'country', 'email', 'website', 'priority', 'user')
    search_fields = ('name', 'country', 'email')
    list_filter = ('priority',)

    fieldsets = (
        ('University Info', {
            'fields': ('name', 'slug', 'country', 'address', 'email', 'phone', 'type', 'website', 'verified', 'qs_world_ranking')
        }),
        ('Media', {
            'fields': ('logo', 'cover_photo', 'brochure')
        }),
        ('Priority & Settings', {
            'fields': ('priority', 'eligibility', 'facilities_features', 'scholarship', 'tuition_fees')
        }),
        ('Assign User Manually', {
            'fields': ('user',)
        }),
    )

    def save_model(self, request, obj, form, change):
        """
        Ensure a user is manually assigned before saving the university.
        Assigns the 'university' role to the user.
        """
        if not obj.user and obj.email:
            username = obj.email.split('@')[0]
            user, created = User.objects.get_or_create(username=username, email=obj.email)
            if created:
                user.set_password("defaultpassword123")  # Admin must manually reset the password
            
            # ✅ Assign the "university" role to the user
            if hasattr(user, 'role'):  
                user.role = "university"
                user.save()

            obj.user = user
        super().save_model(request, obj, form, change)
