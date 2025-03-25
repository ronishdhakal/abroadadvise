from django.urls import path
from .views import (
    # News Views
    NewsListView, create_news, get_news, update_news, delete_news, 

    # News Category Views
    NewsCategoryListView, create_news_category, update_news_category, delete_news_category,

    # Related News
    related_news,

    # Comments
    list_news_comments, add_news_comment
)

urlpatterns = [
    # ✅ News Category Endpoints
    path('categories/', NewsCategoryListView.as_view(), name='list_news_categories'),
    path('categories/create/', create_news_category, name='news-category-create'),
    path('categories/<slug:slug>/update/', update_news_category, name='news-category-update'),
    path('categories/<slug:slug>/delete/', delete_news_category, name='news-category-delete'),

    # ✅ News Post Endpoints
    path('', NewsListView.as_view(), name='list_news'),
    path('create/', create_news, name='create_news'),
    path('<slug:slug>/', get_news, name='get_news'),
    path('<slug:slug>/update/', update_news, name='update_news'),
    path('<slug:slug>/delete/', delete_news, name='delete_news'),

    # ✅ Related News
    path('related/<slug:slug>/', related_news, name='related_news'),

    # ✅ News Comment Endpoints
    path('<slug:news_slug>/comments/', list_news_comments, name='list_news_comments'),
    path('<slug:news_slug>/add-comment/', add_news_comment, name='add_news_comment'),
]
