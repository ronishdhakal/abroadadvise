from django.urls import path
from .views import (
    UniversityListView, get_university, create_university, update_university, delete_university,
    university_dashboard_view, update_university_dashboard  # ✅ Import dashboard views
)

urlpatterns = [
    # ✅ Dashboard Routes for University Users
    path('dashboard/', university_dashboard_view, name='university-dashboard'),
    path('dashboard/update/', update_university_dashboard, name='update_university_dashboard'),

    # ✅ Public University Routes
    path('', UniversityListView.as_view(), name='list_universities'),
    path('create/', create_university, name='create_university'),
    path('<slug:slug>/', get_university, name='get_university'),
    path('<slug:slug>/update/', update_university, name='update_university'),
    path('<slug:slug>/delete/', delete_university, name='delete_university'),
]
