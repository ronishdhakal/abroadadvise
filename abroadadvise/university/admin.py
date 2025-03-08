from django.contrib import admin
from .models import University

@admin.register(University)
class UniversityAdmin(admin.ModelAdmin):
    list_display = ('name', 'country', 'email', 'website', 'priority')
    search_fields = ('name', 'country')