from django.urls import path
from .views import (
    NewsListView, create_news, get_news, update_news, delete_news, 
    NewsCategoryListView, related_news, list_news_comments, add_news_comment
)

urlpatterns = [
    path('', NewsListView.as_view(), name='list_news'),
    path('categories/', NewsCategoryListView.as_view(), name='list_news_categories'),
    path('create/', create_news, name='create_news'),
    path('<slug:slug>/', get_news, name='get_news'),
    path('<slug:slug>/update/', update_news, name='update_news'),
    path('<slug:slug>/delete/', delete_news, name='delete_news'),

    # ✅ Add related news API endpoint
    path('related/<slug:slug>/', related_news, name='related_news'),

    # ✅ Add Comments Endpoints
    path('<slug:news_slug>/comments/', list_news_comments, name='list_news_comments'),
    path('<slug:news_slug>/add-comment/', add_news_comment, name='add_news_comment'),
]
