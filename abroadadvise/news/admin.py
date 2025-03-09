from django.contrib import admin
from .models import News, NewsComment, NewsCategory

@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'author', 'is_published')  # ✅ Fixed 'published_date' → 'date'
    search_fields = ('title', 'author')
    list_filter = ('date', 'category', 'is_published')  # ✅ Fixed 'published_date' → 'date'
    ordering = ('-date',)  # ✅ Fixed 'published_date' → 'date'
    readonly_fields = ('date',)  # ✅ Ensured 'date' is not editable

@admin.register(NewsCategory)
class NewsCategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    ordering = ('name',)

@admin.register(NewsComment)
class NewsCommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'post', 'created_at', 'is_approved')  # ✅ Fixed 'name' and 'email'
    search_fields = ('user__username', 'post__title')  # ✅ Search by username
    list_filter = ('is_approved', 'created_at')
    ordering = ('-created_at',)
    actions = ['approve_comments']

    def approve_comments(self, request, queryset):
        queryset.update(is_approved=True)
        self.message_user(request, "Selected comments have been approved.")
    approve_comments.short_description = "Approve selected comments"
