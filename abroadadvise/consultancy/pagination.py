from rest_framework.pagination import PageNumberPagination

class ConsultancyPagination(PageNumberPagination):
    page_size = 12  # ✅ Default page size
    page_size_query_param = "page_size"
    max_page_size = 50  # ✅ Max limit
