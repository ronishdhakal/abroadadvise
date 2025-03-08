from django.urls import path
from .views import (
    ReviewCreateAPIView, ReviewListAPIView, ReviewModerationAPIView, ReviewReplyAPIView,
    DistrictListAPIView, DisciplineListAPIView  # ✅ Added DisciplineListAPIView
)

urlpatterns = [
    path('districts/', DistrictListAPIView.as_view(), name='list-districts'),
    path('disciplines/', DisciplineListAPIView.as_view(), name='list-disciplines'),  # ✅ New API route

    # User submits review
    path('', ReviewCreateAPIView.as_view(), name='submit-review'),

    # Public: View approved reviews
    path('list/', ReviewListAPIView.as_view(), name='list-reviews'),

    # Admin: Approve/Delete reviews
    path('moderate/<int:pk>/', ReviewModerationAPIView.as_view(), name='moderate-review'),

    # ✅ New: Universities/Consultancies Reply to Reviews
    path('reply/<int:pk>/', ReviewReplyAPIView.as_view(), name='reply-review'),
]
