from django.urls import path
from .views import (
    EventListView, create_event, get_event, update_event, delete_event, all_events, active_events
)

urlpatterns = [
    path('', EventListView.as_view(), name='list_events'),
    path('all/', all_events, name='all_events'),  # ✅ List all events (no pagination)
    path('active/', active_events, name='active_events'),  # ✅ List only future active events
    path('create/', create_event, name='create_event'),
    path('<slug:slug>/', get_event, name='get_event'),
    path('<slug:slug>/update/', update_event, name='update_event'),
    path('<slug:slug>/delete/', delete_event, name='delete_event'),
]
