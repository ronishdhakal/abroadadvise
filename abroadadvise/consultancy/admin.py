from django.contrib import admin
from django.contrib.auth import get_user_model
from .models import Consultancy, ConsultancyGallery, ConsultancyBranch

User = get_user_model()

class ConsultancyGalleryInline(admin.TabularInline):
    model = ConsultancyGallery
    extra = 1

class ConsultancyBranchInline(admin.TabularInline):
    model = ConsultancyBranch
    extra = 1

@admin.register(Consultancy)
class ConsultancyAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'website', 'priority', 'verified', 'has_branches', 'user')
    search_fields = ('name', 'email', 'phone')
    list_filter = ('verified', 'has_branches', 'priority')
    inlines = [ConsultancyGalleryInline, ConsultancyBranchInline]

    fieldsets = (
        ('Consultancy Info', {
            'fields': ('name', 'slug', 'address', 'latitude', 'longitude', 'establishment_date', 
                       'website', 'email', 'phone', 'moe_certified', 'about', 'services', 'verified')
        }),
        ('Media', {
            'fields': ('logo', 'cover_photo', 'brochure')
        }),
        ('Priority & Settings', {
            'fields': ('priority', 'google_map_url', 'has_branches', 'study_abroad_destinations', 
                       'test_preparation', 'partner_universities')
        }),
        ('Assign User Manually', {
            'fields': ('user',)
        }),
    )

    def save_model(self, request, obj, form, change):
        """
        Ensure a user is manually assigned before saving the consultancy.
        Assigns the 'consultancy' role to the user.
        """
        if not obj.user and obj.email:
            username = obj.email.split('@')[0]
            user, created = User.objects.get_or_create(username=username, email=obj.email)
            if created:
                user.set_password("defaultpassword123")  # Admin must manually set the password later
            
            # ✅ Assign the "consultancy" role to the user (Modify if using a different role system)
            if hasattr(user, 'role'):  
                user.role = "consultancy"  # Ensure the user role is set
                user.save()

            obj.user = user
        super().save_model(request, obj, form, change)

admin.site.register(ConsultancyGallery)
admin.site.register(ConsultancyBranch)
