from rest_framework.pagination import PageNumberPagination

class EventPagination(PageNumberPagination):
    page_size = 10  # ✅ Default items per page
    page_size_query_param = "page_size"  # Optional override via query param
    max_page_size = 50  # ✅ Safety limit
