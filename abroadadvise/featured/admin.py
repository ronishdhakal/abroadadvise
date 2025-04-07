from django.contrib import admin
from .models import FeaturedPage

@admin.register(FeaturedPage)
class FeaturedPageAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'api_route', 'priority', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('title', 'slug', 'api_route', 'meta_title', 'meta_author')
    ordering = ('priority', 'title')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('title', 'slug', 'description_top', 'description_bottom', 'api_route', 'priority', 'is_active')
        }),
        ('SEO & Meta Info', {
            'fields': ('meta_title', 'meta_description', 'meta_author')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
