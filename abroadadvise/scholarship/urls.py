from django.urls import path
from .views import (
    ScholarshipListView,
    ScholarshipDetailView,
    create_scholarship,
    update_scholarship,
    delete_scholarship,
)

urlpatterns = [
    # ✅ Admin panel routes
    path("create/", create_scholarship, name="create_scholarship"),
    path("<slug:slug>/update/", update_scholarship, name="update_scholarship"),
    path("<slug:slug>/delete/", delete_scholarship, name="delete_scholarship"),

    # ✅ Public routes
    path("", ScholarshipListView.as_view(), name="list_scholarships"),
    path("<slug:slug>/", ScholarshipDetailView.as_view(), name="get_scholarship"),
]
