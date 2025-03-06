from django.urls import path
from .views import submit_inquiry, UniversityInquiryListView, ConsultancyInquiryListView

urlpatterns = [
    path('submit/', submit_inquiry, name='submit-inquiry'),
    path('university/inquiries/', UniversityInquiryListView.as_view(), name='university-inquiries'),
    path('consultancy/inquiries/', ConsultancyInquiryListView.as_view(), name='consultancy-inquiries'),
]
