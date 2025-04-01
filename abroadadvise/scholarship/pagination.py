from rest_framework.pagination import PageNumberPagination

class ScholarshipPagination(PageNumberPagination):
    page_size = 10  # Default number of items per page
    page_size_query_param = "page_size"
    max_page_size = 100
