from rest_framework.pagination import PageNumberPagination

class UniversityPagination(PageNumberPagination):
    page_size = 12  # Default number of universities per page
    page_size_query_param = "page_size"
    max_page_size = 50  # Maximum limit per request
