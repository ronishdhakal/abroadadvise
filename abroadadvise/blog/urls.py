from django.urls import path
from .views import (
    BlogPostListView, get_blog_post, create_blog_post, update_blog_post, delete_blog_post,
    BlogCategoryListView, list_blog_comments, add_blog_comment
)

urlpatterns = [
    # ✅ Blog Post Endpoints
    path('', BlogPostListView.as_view(), name='blog-list'),  # List all blogs with filters
    path('categories/', BlogCategoryListView.as_view(), name='blog-categories'),  # List blog categories
    path('create/', create_blog_post, name='blog-create'),  # Create a blog post (Admin only)
    path('<slug:slug>/', get_blog_post, name='blog-detail'),  # Get single blog post
    path('<slug:slug>/update/', update_blog_post, name='blog-update'),  # Update a blog post (Admin only)
    path('<slug:slug>/delete/', delete_blog_post, name='blog-delete'),  # Delete a blog post (Admin only)

    # ✅ Blog Comments Endpoints
    path('<slug:blog_slug>/comments/', list_blog_comments, name='list_blog_comments'),  # List all approved comments
    path('<slug:blog_slug>/add-comment/', add_blog_comment, name='add_blog_comment'),  # Add a new comment
]
