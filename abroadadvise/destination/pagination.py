from rest_framework.pagination import PageNumberPagination

class DestinationPagination(PageNumberPagination):
    page_size = 10  # Default destinations per page
    page_size_query_param = "page_size"
    max_page_size = 50
