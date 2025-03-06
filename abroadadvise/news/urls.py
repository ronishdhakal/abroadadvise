from django.urls import path
from .views import NewsListView, create_news, get_news, update_news, delete_news

urlpatterns = [
    path('', NewsListView.as_view(), name='list_news'),
    path('create/', create_news, name='create_news'),
    path('<slug:slug>/', get_news, name='get_news'),
    path('<slug:slug>/update/', update_news, name='update_news'),
    path('<slug:slug>/delete/', delete_news, name='delete_news'),
]
