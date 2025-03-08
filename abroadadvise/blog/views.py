from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import F
from core.pagination import StandardResultsSetPagination
from authentication.permissions import IsAdminUser
from .models import BlogPost, BlogCategory, BlogComment
from .serializers import BlogPostSerializer, BlogCategorySerializer, BlogCommentSerializer

# ✅ List Blog Posts with Pagination, Search, and Filtering
class BlogPostListView(generics.ListAPIView):
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['category__slug', 'is_published']
    search_fields = ['title', 'content']

    def get_queryset(self):
        return BlogPost.objects.filter(is_published=True).order_by(F('priority').asc(nulls_last=True), '-published_date')

# ✅ Get Single Blog Post by Slug
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_blog_post(request, slug):
    try:
        post = BlogPost.objects.get(slug=slug, is_published=True)
        serializer = BlogPostSerializer(post, context={'request': request})
        return Response(serializer.data)
    except BlogPost.DoesNotExist:
        return Response({"error": "Blog post not found"}, status=status.HTTP_404_NOT_FOUND)

# ✅ Create Blog Post (Admin Only)
@api_view(['POST'])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def create_blog_post(request):
    serializer = BlogPostSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save(author=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Update Blog Post (Admin Only)
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def update_blog_post(request, slug):
    try:
        post = BlogPost.objects.get(slug=slug)
        serializer = BlogPostSerializer(post, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except BlogPost.DoesNotExist:
        return Response({"error": "Blog post not found"}, status=status.HTTP_404_NOT_FOUND)

# ✅ Delete Blog Post (Admin Only)
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_blog_post(request, slug):
    try:
        post = BlogPost.objects.get(slug=slug)
        post.delete()
        return Response({"message": "Blog post deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except BlogPost.DoesNotExist:
        return Response({"error": "Blog post not found"}, status=status.HTTP_404_NOT_FOUND)
