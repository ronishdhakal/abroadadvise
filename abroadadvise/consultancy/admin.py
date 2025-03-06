from django.contrib import admin
from .models import Consultancy

@admin.register(Consultancy)
class ConsultancyAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'website')
    search_fields = ('name', 'email')