from django.contrib import admin
from .models import Inquiry

@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'entity_type', 'entity_id', 'created_at')
    search_fields = ('name', 'email', 'entity_type')
    list_filter = ('entity_type',)
