from django.contrib import admin
from .models import Event, EventGallery, EventRegistration

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('name', 'date', 'event_type', 'registration_type', 'price', 'organizer')
    search_fields = ('name', 'location')
    list_filter = ('event_type', 'registration_type')
    filter_horizontal = ('targeted_destinations',)  # ✅ Allows selecting multiple destinations in admin panel

@admin.register(EventGallery)
class EventGalleryAdmin(admin.ModelAdmin):
    list_display = ['event', 'uploaded_at']


