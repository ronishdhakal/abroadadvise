from django.contrib import admin
from django.contrib.auth import get_user_model
from .models import University

User = get_user_model()

@admin.register(University)
class UniversityAdmin(admin.ModelAdmin):
    list_display = ('name', 'country', 'email', 'website', 'priority', 'user')
    search_fields = ('name', 'country', 'email')
    list_filter = ('priority', 'type', 'verified')

    fieldsets = (
        ('University Info', {
            'fields': (
                'name', 'slug', 'country', 'address', 'map_coordinate', 'email', 'phone', 'type',
                'website', 'verified', 'qs_world_ranking'
            )
        }),
        ('Media Files', {
            'fields': ('logo', 'cover_photo', 'brochure')
        }),
        ('Admission & Financials', {
            'fields': ('eligibility', 'facilities_features', 'scholarship', 'tuition_fees')
        }),
        ('Additional Info', {
            'fields': ('about', 'faqs')
        }),
        ('Relations', {
            'fields': ('disciplines', 'consultancies_to_apply')
        }),
        ('Priority & Access', {
            'fields': ('priority', 'user')
        }),
    )

    filter_horizontal = ('disciplines', 'consultancies_to_apply')  # Better UI for many-to-many fields

    def save_model(self, request, obj, form, change):
        """
        Ensure a user is manually assigned before saving the university.
        Assigns the 'university' role to the user if created.
        """
        if not obj.user and obj.email:
            username = obj.email.split('@')[0]
            user, created = User.objects.get_or_create(username=username, email=obj.email)
            if created:
                user.set_password("defaultpassword123")  # Admin must manually reset the password
            if hasattr(user, 'role'):
                user.role = "university"
                user.save()
            obj.user = user
        super().save_model(request, obj, form, change)
