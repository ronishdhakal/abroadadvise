from django.contrib import admin  # ✅ Import admin
from .models import Destination  # ✅ Import the Destination model

@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ('title',)  # ✅ Ensure 'title' exists in your model
