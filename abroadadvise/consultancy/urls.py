from django.urls import path
from .views import (
    ConsultancyListView, ConsultancyDetailView, create_consultancy, update_consultancy, delete_consultancy,
    consultancy_dashboard_view, update_consultancy_dashboard  # ✅ Fixed import
)

urlpatterns = [
    # ✅ Dashboard Route (Must be placed before `<slug:slug>/` to avoid conflicts)
    path('dashboard/', consultancy_dashboard_view, name='consultancy-dashboard'),
    path("dashboard/update/", update_consultancy_dashboard, name="update_consultancy_dashboard"),


    # ✅ Other Consultancy Routes
    path('', ConsultancyListView.as_view(), name='list_consultancies'),
    path('create/', create_consultancy, name='create_consultancy'),
    path('<slug:slug>/', ConsultancyDetailView.as_view(), name='get_consultancy'),
    path('<slug:slug>/update/', update_consultancy, name='update_consultancy'),
    path('<slug:slug>/delete/', delete_consultancy, name='delete_consultancy'),
]
