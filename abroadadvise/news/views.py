from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from core.pagination import StandardResultsSetPagination
from core.filters import NewsFilter
from .models import News, NewsComment, NewsCategory
from .serializers import NewsSerializer, NewsCommentSerializer, NewsCategorySerializer
from .pagination import NewsPagination  # ✅ Use news-specific pagination class

# ✅ Public News List with Pagination, Search, and Filtering
class NewsListView(generics.ListAPIView):
    serializer_class = NewsSerializer
    permission_classes = [permissions.AllowAny]  # ✅ Public access
    pagination_class = NewsPagination  # ✅ Use custom pagination
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_class = NewsFilter
    search_fields = ['title', 'category__name']

    def get_queryset(self):
        return (
            News.objects.select_related("category")
            .only("id", "title", "slug", "category__name", "date", "featured_image")
            .order_by("-date", "-id")  # ✅ Ordered by latest news first
        )

# ✅ List News Categories (Public Access)
class NewsCategoryListView(generics.ListAPIView):
    queryset = NewsCategory.objects.all().order_by("name")
    serializer_class = NewsCategorySerializer
    permission_classes = [permissions.AllowAny]

# ✅ Get Related News by Category
@api_view(['GET'])
def related_news(request, slug):
    try:
        news = News.objects.select_related("category").get(slug=slug)
        related_news = News.objects.filter(category=news.category).exclude(slug=slug)[:5]
        serializer = NewsSerializer(related_news, many=True, context={'request': request})
        return Response({"results": serializer.data})
    except News.DoesNotExist:
        return Response({"error": "News not found"}, status=status.HTTP_404_NOT_FOUND)

# ✅ Create News (No Authentication Required)
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
@parser_classes([MultiPartParser, FormParser])  
def create_news(request):
    """
    Create a new news article (Public Access).
    """
    serializer = NewsSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Get Single News by Slug (Public Access)
@api_view(['GET'])
def get_news(request, slug):
    try:
        news = News.objects.select_related("category").get(slug=slug)
        serializer = NewsSerializer(news, context={'request': request})
        return Response(serializer.data)
    except News.DoesNotExist:
        return Response({"error": "News not found"}, status=status.HTTP_404_NOT_FOUND)

# ✅ Update News (No Authentication Required)
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated, IsAdminUser])
@parser_classes([MultiPartParser, FormParser])  
def update_news(request, slug):
    """
    Update an existing news article (Public Access).
    """
    try:
        news = News.objects.get(slug=slug)
        serializer = NewsSerializer(news, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except News.DoesNotExist:
        return Response({"error": "News not found"}, status=status.HTTP_404_NOT_FOUND)

# ✅ Delete News (No Authentication Required)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser])
def delete_news(request, slug):
    """
    Delete a news article (Public Access).
    """
    try:
        news = News.objects.get(slug=slug)
        news.delete()
        return Response({"message": "News deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except News.DoesNotExist:
        return Response({"error": "News not found"}, status=status.HTTP_404_NOT_FOUND)

# ✅ List Comments for a News Article (Public)
@api_view(['GET'])
def list_news_comments(request, news_slug):
    """
    Retrieve a list of approved comments for a specific news article.
    """
    try:
        news = News.objects.get(slug=news_slug)
        comments = NewsComment.objects.filter(post=news, is_approved=True).order_by('-created_at')
        serializer = NewsCommentSerializer(comments, many=True)
        return Response(serializer.data)
    except News.DoesNotExist:
        return Response({"error": "News not found"}, status=status.HTTP_404_NOT_FOUND)

# ✅ Add a Comment to a News Article (Public Access)
@api_view(['POST'])
def add_news_comment(request, news_slug):
    """
    Add a new comment to a news article (Public Access).
    """
    try:
        news = News.objects.get(slug=news_slug)
        data = request.data.copy()
        data['post'] = news.id  

        serializer = NewsCommentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Comment submitted for approval"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except News.DoesNotExist:
        return Response({"error": "News not found"}, status=status.HTTP_404_NOT_FOUND)

# ✅ Approve a News Comment (No Authentication Required)
@api_view(['PATCH'])
def approve_news_comment(request, comment_id):
    """
    Approve a pending news comment (Public Access).
    """
    try:
        comment = NewsComment.objects.get(id=comment_id, is_approved=False)
        comment.is_approved = True
        comment.save()
        return Response({"message": "Comment approved successfully"}, status=status.HTTP_200_OK)
    except NewsComment.DoesNotExist:
        return Response({"error": "Comment not found or already approved"}, status=status.HTTP_404_NOT_FOUND)

# ✅ Delete a News Comment (No Authentication Required)
@api_view(['DELETE'])
def delete_news_comment(request, comment_id):
    """
    Delete a news comment (Public Access).
    """
    try:
        comment = NewsComment.objects.get(id=comment_id)
        comment.delete()
        return Response({"message": "Comment deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except NewsComment.DoesNotExist:
        return Response({"error": "Comment not found"}, status=status.HTTP_404_NOT_FOUND)


# ✅ Create News Category (Admin Only)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_news_category(request):
    serializer = NewsCategorySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Update News Category (Admin Only)
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_news_category(request, slug):
    try:
        category = NewsCategory.objects.get(slug=slug)
        serializer = NewsCategorySerializer(category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except NewsCategory.DoesNotExist:
        return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)

# ✅ Delete News Category (Admin Only)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_news_category(request, slug):
    try:
        category = NewsCategory.objects.get(slug=slug)
        category.delete()
        return Response({"message": "Category deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except NewsCategory.DoesNotExist:
        return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)
