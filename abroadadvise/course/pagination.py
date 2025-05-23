from rest_framework.pagination import PageNumberPagination

class CoursePagination(PageNumberPagination):
    page_size = 12  # Default courses per page
    page_size_query_param = "page_size"
    max_page_size = 50
