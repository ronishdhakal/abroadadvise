from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from core.pagination import StandardResultsSetPagination
from core.filters import NewsFilter
from authentication.permissions import IsAdminUser
from .models import News, NewsComment, NewsCategory
from .serializers import NewsSerializer, NewsCommentSerializer, NewsCategorySerializer

# ✅ List News with Pagination, Search, and Filtering (Public Access)
class NewsListView(generics.ListAPIView):
    queryset = News.objects.select_related("category").all().order_by("-date")
    serializer_class = NewsSerializer
    permission_classes = [permissions.AllowAny]  
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_class = NewsFilter
    search_fields = ['title', 'category__name']

# ✅ List News Categories (Public Access)
class NewsCategoryListView(generics.ListAPIView):
    queryset = NewsCategory.objects.all().order_by("name")
    serializer_class = NewsCategorySerializer
    permission_classes = [permissions.AllowAny]

# ✅ Get Related News by Category
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def related_news(request, slug):
    try:
        news = News.objects.select_related("category").get(slug=slug)
        related_news = News.objects.filter(category=news.category).exclude(slug=slug)[:5]
        serializer = NewsSerializer(related_news, many=True, context={'request': request})
        return Response({"results": serializer.data})
    except News.DoesNotExist:
        return Response({"error": "News not found"}, status=status.HTTP_404_NOT_FOUND)

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
@permission_classes([permissions.AllowAny])
def get_news(request, slug):
    try:
        news = News.objects.select_related("category").get(slug=slug)
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

# ✅ List Comments for a News Article (Public)
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def list_news_comments(request, news_slug):
    try:
        news = News.objects.get(slug=news_slug)
        comments = NewsComment.objects.filter(post=news, is_approved=True).order_by('-created_at')
        serializer = NewsCommentSerializer(comments, many=True)
        return Response(serializer.data)
    except News.DoesNotExist:
        return Response({"error": "News not found"}, status=status.HTTP_404_NOT_FOUND)

# ✅ Add a Comment to a News Article (No Login Required)
@api_view(['POST'])
@permission_classes([permissions.AllowAny])  # 🔥 Now ANYONE can comment without authentication
def add_news_comment(request, news_slug):
    """
    Add a new comment to a news article (Public Access).
    """
    try:
        news = News.objects.get(slug=news_slug)
        data = request.data.copy()
        data['post'] = news.id  # ✅ Link the comment to the news article

        serializer = NewsCommentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()  # ✅ Save comment without authentication
            return Response({"message": "Comment submitted for approval"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except News.DoesNotExist:
        return Response({"error": "News not found"}, status=status.HTTP_404_NOT_FOUND)

# ✅ Approve a News Comment (Admin Only)
@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def approve_news_comment(request, comment_id):
    try:
        comment = NewsComment.objects.get(id=comment_id, is_approved=False)
        comment.is_approved = True
        comment.save()
        return Response({"message": "Comment approved successfully"}, status=status.HTTP_200_OK)
    except NewsComment.DoesNotExist:
        return Response({"error": "Comment not found or already approved"}, status=status.HTTP_404_NOT_FOUND)

# ✅ Delete a News Comment (Admin Only)
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_news_comment(request, comment_id):
    try:
        comment = NewsComment.objects.get(id=comment_id)
        comment.delete()
        return Response({"message": "Comment deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except NewsComment.DoesNotExist:
        return Response({"error": "Comment not found"}, status=status.HTTP_404_NOT_FOUND)
