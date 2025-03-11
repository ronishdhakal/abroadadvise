from django.urls import path
from .views import (
    UniversityListView,
    create_university,
    get_university,
    update_university,
    delete_university,
)

urlpatterns = [
    path('', UniversityListView.as_view(), name='list_universities'),
    path('create/', create_university, name='create_university'),  # ✅ FIXED Create University Route
    path('<slug:slug>/', get_university, name='get_university'),
    path('<slug:slug>/update/', update_university, name='update_university'),
    path('<slug:slug>/delete/', delete_university, name='delete_university'),
]
