from rest_framework.pagination import PageNumberPagination

class InquiryPagination(PageNumberPagination):
    page_size = 10  # ✅ Set page size to 10
    page_size_query_param = "page_size"
    max_page_size = 50  # ✅ Limit maximum records per page
