from django.urls import path
from .views import (
    ReviewCreateAPIView, ReviewListAPIView, ReviewModerationAPIView, ReviewReplyAPIView,
    DistrictListAPIView, DistrictCreateAPIView, DistrictUpdateAPIView, DistrictDeleteAPIView,
    DisciplineListAPIView, DisciplineCreateAPIView, DisciplineUpdateAPIView, DisciplineDeleteAPIView,
    SiteSettingAPIView, AdListAPIView, GlobalSearchAPIView,
    AdAdminListAPIView,       # ✅ For admin paginated ad listing
    AdCreateAPIView,          # ✅ Admin create
    AdUpdateAPIView,          # ✅ Admin update
    AdDeleteAPIView,          # ✅ Admin delete


)

urlpatterns = [
    path('districts/', DistrictListAPIView.as_view(), name='list-districts'),
    path('disciplines/', DisciplineListAPIView.as_view(), name='list-disciplines'),
    # District CRUD
    path('districts/create/', DistrictCreateAPIView.as_view(), name='create-district'),
    path('districts/<int:pk>/update/', DistrictUpdateAPIView.as_view(), name='update-district'),
    path('districts/<int:pk>/delete/', DistrictDeleteAPIView.as_view(), name='delete-district'),

# Discipline CRUD
    path('disciplines/create/', DisciplineCreateAPIView.as_view(), name='create-discipline'),
    path('disciplines/<int:pk>/update/', DisciplineUpdateAPIView.as_view(), name='update-discipline'),
    path('disciplines/<int:pk>/delete/', DisciplineDeleteAPIView.as_view(), name='delete-discipline'),

# ✅ For admin dashboard management (ads)
    path('ads/admin/', AdAdminListAPIView.as_view(), name='admin-list-ads'),
    path('ads/create/', AdCreateAPIView.as_view(), name='create-ad'),
    path('ads/<int:pk>/update/', AdUpdateAPIView.as_view(), name='update-ad'),
    path('ads/<int:pk>/delete/', AdDeleteAPIView.as_view(), name='delete-ad'),



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
