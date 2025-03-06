from django.urls import path
from .views import (
    ConsultancyListView, ConsultancyDetailView,  # Replaced get_consultancy
    create_consultancy, update_consultancy, delete_consultancy
)
from .dashboard_views import consultancy_dashboard, update_consultancy_profile  # Import dashboard views

urlpatterns = [
    path('', ConsultancyListView.as_view(), name='list_consultancies'),
    path('create/', create_consultancy, name='create_consultancy'),
    path('<slug:slug>/', ConsultancyDetailView.as_view(), name='get_consultancy'),  # Fixed this import
    path('<slug:slug>/update/', update_consultancy, name='update_consultancy'),
    path('<slug:slug>/delete/', delete_consultancy, name='delete_consultancy'),

    # Dashboard Routes
    path('dashboard/', consultancy_dashboard, name='consultancy-dashboard'),
    path('dashboard/update/', update_consultancy_profile, name='consultancy-update-profile'),
]
