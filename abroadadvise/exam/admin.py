from django.contrib import admin
from .models import Exam

@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'exam_fee')
    search_fields = ('name', 'type')
