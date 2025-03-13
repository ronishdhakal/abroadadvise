from django.urls import path
from .views import submit_inquiry, AdminInquiryListView, InquiryDetailView

urlpatterns = [
    path('submit/', submit_inquiry, name='submit-inquiry'),
    path('admin/all/', AdminInquiryListView.as_view(), name='admin-inquiries'),  # ✅ Fetch all inquiries
    path('admin/<int:pk>/', InquiryDetailView.as_view(), name='inquiry-detail'),  # ✅ Fetch single inquiry
]
