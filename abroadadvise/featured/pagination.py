# featured/pagination.py

from rest_framework.pagination import PageNumberPagination

class FeaturedPagination(PageNumberPagination):
    page_size = 12  # default items per page
    page_size_query_param = 'page_size'  # allow clients to change size
    max_page_size = 100
