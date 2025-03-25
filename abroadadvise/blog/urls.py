from django.urls import path
from .views import (
    # Blog Post Views
    BlogPostListView, get_blog_post, create_blog_post, update_blog_post, delete_blog_post,

    # Blog Category Views
    BlogCategoryListView, create_blog_category, update_blog_category, delete_blog_category,

    # Blog Comment Views
    list_blog_comments, add_blog_comment
)

urlpatterns = [
    # ✅ Blog Post Endpoints
    
    path('categories/', BlogCategoryListView.as_view(), name='blog-categories'),  # List all categories
    path('categories/create/', create_blog_category, name='blog-category-create'),  # Create a new category
    path('categories/<slug:slug>/update/', update_blog_category, name='blog-category-update'),  # Update category
    path('categories/<slug:slug>/delete/', delete_blog_category, name='blog-category-delete'),  # Delete category
  # ✅ Blog Category Endpoints
    path('', BlogPostListView.as_view(), name='blog-list'),  # List all blog posts with filters & pagination
    path('create/', create_blog_post, name='blog-create'),  # Create a blog post (Admin only)
    path('<slug:slug>/', get_blog_post, name='blog-detail'),  # Get a single blog post
    path('<slug:slug>/update/', update_blog_post, name='blog-update'),  # Update a blog post (Admin only)
    path('<slug:slug>/delete/', delete_blog_post, name='blog-delete'),  # Delete a blog post (Admin only)

  
    # ✅ Blog Comment Endpoints
    path('<slug:blog_slug>/comments/', list_blog_comments, name='list_blog_comments'),  # List approved comments
    path('<slug:blog_slug>/add-comment/', add_blog_comment, name='add_blog_comment'),  # Add a new comment
]
