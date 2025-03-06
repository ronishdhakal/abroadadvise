from django.contrib import admin
from .models import Consultancy, ConsultancyGallery, ConsultancyBranch

class ConsultancyGalleryInline(admin.TabularInline):
    model = ConsultancyGallery
    extra = 1

class ConsultancyBranchInline(admin.TabularInline):
    model = ConsultancyBranch
    extra = 1

@admin.register(Consultancy)
class ConsultancyAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'website', 'priority', 'verified', 'has_branches')
    search_fields = ('name', 'email', 'phone')
    list_filter = ('verified', 'has_branches', 'priority')
    inlines = [ConsultancyGalleryInline, ConsultancyBranchInline]

admin.site.register(ConsultancyGallery)
admin.site.register(ConsultancyBranch)