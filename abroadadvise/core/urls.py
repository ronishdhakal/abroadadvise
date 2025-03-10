from django.urls import path
from .views import (
    ReviewCreateAPIView, ReviewListAPIView, ReviewModerationAPIView, ReviewReplyAPIView,
    DistrictListAPIView, DisciplineListAPIView, SiteSettingAPIView, AdListAPIView,  GlobalSearchAPIView
)

urlpatterns = [
    path('districts/', DistrictListAPIView.as_view(), name='list-districts'),
    path('disciplines/', DisciplineListAPIView.as_view(), name='list-disciplines'),

    # User submits review
    path('', ReviewCreateAPIView.as_view(), name='submit-review'),

    # Public: View approved reviews
    path('list/', ReviewListAPIView.as_view(), name='list-reviews'),

    # Admin: Approve/Delete reviews
    path('moderate/<int:pk>/', ReviewModerationAPIView.as_view(), name='moderate-review'),

    # Universities/Consultancies Reply to Reviews
    path('reply/<int:pk>/', ReviewReplyAPIView.as_view(), name='reply-review'),

    # ✅ Fetch Site Settings (Logo & Hero Image)
    path('api/site-settings/', SiteSettingAPIView.as_view(), name='site-settings'),

    # ✅ Fetch Active Ads (Supports Placement Filtering)
    path('api/ads/', AdListAPIView.as_view(), name='ads-list'),
    
    # ✅ Global Search API (Now `/search/`, NOT `/api/search/`)
    path('search/', GlobalSearchAPIView.as_view(), name='global-search'),
]
