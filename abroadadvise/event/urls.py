from django.urls import path
from .views import (
    EventListView, create_event, get_event, update_event, delete_event, register_for_event
)

urlpatterns = [
    path('', EventListView.as_view(), name='list_events'),
    path('create/', create_event, name='create_event'),
    path('<slug:slug>/', get_event, name='get_event'),
    path('<slug:slug>/update/', update_event, name='update_event'),
    path('<slug:slug>/delete/', delete_event, name='delete_event'),
    path('register/', register_for_event, name='register_for_event'),  # ✅ New event registration endpoint
]
