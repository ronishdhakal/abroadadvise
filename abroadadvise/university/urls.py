from django.urls import path
from .views import (
    UniversityListView, get_university, create_university,
    update_university, delete_university
)

urlpatterns = [
    path('', UniversityListView.as_view(), name='university-list'),  # ✅ Public List
    path('<slug:slug>/', get_university, name='university-detail'),  # ✅ Public Detail
    path('create/', create_university, name='university-create'),  # 🔐 Admin Only
    path('<slug:slug>/update/', update_university, name='university-update'),  # 🔐 Admin Only
    path('<slug:slug>/delete/', delete_university, name='university-delete'),  # 🔐 Admin Only
]
