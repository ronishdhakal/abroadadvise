# news/pagination.py

from rest_framework.pagination import PageNumberPagination

class NewsPagination(PageNumberPagination):
    page_size = 10  # ✅ Default: 10 items per page
    page_size_query_param = "page_size"  # ✅ Allow client to override
    max_page_size = 50  # ✅ Max limit for safety
