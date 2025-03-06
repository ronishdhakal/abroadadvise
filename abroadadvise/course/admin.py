from django.contrib import admin
from .models import Course

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'university', 'level', 'duration')
    search_fields = ('name', 'university__name')
