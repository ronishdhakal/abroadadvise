from django.urls import path
from .views import (
    CollegeListView, CollegeDetailView,
    create_college, update_college, delete_college,
    dashboard_college_view, update_college_dashboard
)

urlpatterns = [
    # ✅ Dashboard Routes (must be defined before slug routes)
    path('dashboard/', dashboard_college_view, name='college-dashboard'),
    path('dashboard/update/', update_college_dashboard, name='update_college_dashboard'),

    # ✅ Public & Admin Routes
    path('', CollegeListView.as_view(), name='list_colleges'),
    path('create/', create_college, name='create_college'),
    path('<slug:slug>/', CollegeDetailView.as_view(), name='get_college'),
    path('<slug:slug>/update/', update_college, name='update_college'),
    path('<slug:slug>/delete/', delete_college, name='delete_college'),
]
