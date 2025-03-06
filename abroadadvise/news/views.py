from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from core.pagination import StandardResultsSetPagination
from core.filters import NewsFilter
from authentication.permissions import IsAdminUser
from .models import News
from .serializers import NewsSerializer

# ✅ List News with Pagination, Search, and Filtering (Public Access)
class NewsListView(generics.ListAPIView):
    queryset = News.objects.all()
    serializer_class = NewsSerializer
    permission_classes = [permissions.AllowAny]  # Publicly accessible
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_class = NewsFilter
    search_fields = ['title']

# ✅ Create News (Admin Only)
@api_view(['POST'])
@permission_classes([IsAdminUser])  
@parser_classes([MultiPartParser, FormParser])  
def create_news(request):
    serializer = NewsSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Get Single News by Slug (Public Access)
@api_view(['GET'])
@permission_classes([permissions.AllowAny])  # Publicly accessible
def get_news(request, slug):
    try:
        news = News.objects.get(slug=slug)
        serializer = NewsSerializer(news, context={'request': request})
        return Response(serializer.data)
    except News.DoesNotExist:
        return Response({"error": "News not found"}, status=status.HTTP_404_NOT_FOUND)

# ✅ Update News (Admin Only)
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAdminUser])  
@parser_classes([MultiPartParser, FormParser])  
def update_news(request, slug):
    try:
        news = News.objects.get(slug=slug)
        serializer = NewsSerializer(news, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except News.DoesNotExist:
        return Response({"error": "News not found"}, status=status.HTTP_404_NOT_FOUND)

# ✅ Delete News (Admin Only)
@api_view(['DELETE'])
@permission_classes([IsAdminUser])  
def delete_news(request, slug):
    try:
        news = News.objects.get(slug=slug)
        news.delete()
        return Response({"message": "News deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except News.DoesNotExist:
        return Response({"error": "News not found"}, status=status.HTTP_404_NOT_FOUND)