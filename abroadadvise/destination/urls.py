from django.urls import path
from .views import destination_dropdown_list, DestinationListView, create_destination, get_destination, update_destination, delete_destination

urlpatterns = [
    path("dropdown/", destination_dropdown_list, name="destination_dropdown_list"),
    path('', DestinationListView.as_view(), name='list_destinations'),
    path('create/', create_destination, name='create_destination'),
    path('<slug:slug>/', get_destination, name='get_destination'),
    path('<slug:slug>/update/', update_destination, name='update_destination'),
    path('<slug:slug>/delete/', delete_destination, name='delete_destination'),
]
