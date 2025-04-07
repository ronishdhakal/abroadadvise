from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_featured_page, name='featured-create'),
    path('<slug:slug>/update/', views.update_featured_page, name='featured-update'),
    path('<slug:slug>/delete/', views.delete_featured_page, name='featured-delete'),
    path('', views.FeaturedPageListView.as_view(), name='featured-list'),
    path('<slug:slug>/', views.get_featured_page, name='featured-detail'),
]

