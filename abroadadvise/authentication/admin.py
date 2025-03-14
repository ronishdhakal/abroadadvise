from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

User = get_user_model()

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """ ✅ Extends Django's built-in UserAdmin to include the role field """

    fieldsets = UserAdmin.fieldsets + (
        ("Custom Fields", {"fields": ("role",)}),  # ✅ Add the role field
    )
    
    list_display = ["username", "email", "role", "is_active", "is_staff"]  # ✅ Show role in the user list
    search_fields = ["username", "email", "role"]  # ✅ Enable search by role

