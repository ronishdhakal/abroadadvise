from django.urls import path
from .views import BlogPostListView, get_blog_post, create_blog_post, update_blog_post, delete_blog_post

urlpatterns = [
    path('', BlogPostListView.as_view(), name='blog-list'),
    path('blog/<slug:slug>/', get_blog_post, name='blog-detail'),
    path('blog/create/', create_blog_post, name='blog-create'),
    path('blog/update/<slug:slug>/', update_blog_post, name='blog-update'),
    path('blog/delete/<slug:slug>/', delete_blog_post, name='blog-delete'),
]
