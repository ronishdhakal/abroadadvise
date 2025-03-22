from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.conf import settings
from .pagination import BlogPagination  # ✅ Use custom pagination
import os

from core.pagination import StandardResultsSetPagination
from .models import BlogPost, BlogCategory, BlogComment
from .serializers import BlogPostSerializer, BlogCategorySerializer, BlogCommentSerializer
from core.filters import BlogPostFilter  # ✅ Ensure filter is correctly applied

# ✅ List Blog Categories (Public Access)
class BlogCategoryListView(generics.ListAPIView):
    """
    Retrieve a list of all blog categories.
    """
    queryset = BlogCategory.objects.all().order_by("name")
    serializer_class = BlogCategorySerializer
    permission_classes = [permissions.AllowAny]

# ✅ List Blog Posts with Filtering & Pagination
class BlogPostListView(generics.ListAPIView):
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = BlogPagination  # ✅ Custom pagination with 10/page
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_class = BlogPostFilter
    search_fields = ['title', 'content']

    def get_queryset(self):
        """
        Fetch published blog posts and allow filtering by category.
        """
        queryset = BlogPost.objects.filter(is_published=True).order_by('-published_date')
        category_slug = self.request.query_params.get('category', None)
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        return queryset


# ✅ Get Single Blog Post by Slug (Public Access)
@api_view(['GET'])
def get_blog_post(request, slug):
    """
    Retrieve a single blog post by its slug.
    """
    try:
        post = BlogPost.objects.get(slug=slug, is_published=True)
        serializer = BlogPostSerializer(post, context={'request': request})
        return Response(serializer.data)
    except BlogPost.DoesNotExist:
        return Response({"error": "Blog post not found"}, status=status.HTTP_404_NOT_FOUND)

# ✅ Create Blog Post (No Authentication Required)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def create_blog_post(request):
    """
    Create a new blog post (No authentication required).
    Handles image upload properly.
    """
    serializer = BlogPostSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Update Blog Post (No Authentication Required)
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def update_blog_post(request, slug):
    """
    Update an existing blog post (No authentication required).
    Ensures image replacement works properly.
    """
    try:
        post = BlogPost.objects.get(slug=slug)
        old_image_path = post.featured_image.path if post.featured_image else None

        serializer = BlogPostSerializer(post, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            updated_post = serializer.save()

            # ✅ Delete old image if a new image was uploaded
            if 'featured_image' in request.FILES and old_image_path:
                if os.path.exists(old_image_path):
                    os.remove(old_image_path)

            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except BlogPost.DoesNotExist:
        return Response({"error": "Blog post not found"}, status=status.HTTP_404_NOT_FOUND)

# ✅ Delete Blog Post (No Authentication Required)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_blog_post(request, slug):
    """
    Delete a blog post (No authentication required).
    Removes the associated image as well.
    """
    try:
        post = BlogPost.objects.get(slug=slug)
        image_path = post.featured_image.path if post.featured_image else None

        post.delete()

        # ✅ Delete the image file if it exists
        if image_path and os.path.exists(image_path):
            os.remove(image_path)

        return Response({"message": "Blog post deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

    except BlogPost.DoesNotExist:
        return Response({"error": "Blog post not found"}, status=status.HTTP_404_NOT_FOUND)

# ✅ List Approved Comments for a Blog Post
@api_view(['GET'])
def list_blog_comments(request, blog_slug):
    """
    Retrieve a list of approved comments for a specific blog post.
    """
    try:
        blog = BlogPost.objects.get(slug=blog_slug, is_published=True)
        comments = BlogComment.objects.filter(post=blog, is_approved=True).order_by('-created_at')
        serializer = BlogCommentSerializer(comments, many=True)
        return Response(serializer.data)
    except BlogPost.DoesNotExist:
        return Response({"error": "Blog post not found"}, status=status.HTTP_404_NOT_FOUND)

# ✅ Add a Comment to a Blog Post (Public Access)
@api_view(['POST'])
def add_blog_comment(request, blog_slug):
    """
    Add a new comment to a blog post.
    """
    try:
        blog = BlogPost.objects.get(slug=blog_slug, is_published=True)
        data = request.data.copy()
        data['post'] = blog.id

        serializer = BlogCommentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Comment submitted for approval"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except BlogPost.DoesNotExist:
        return Response({"error": "Blog post not found"}, status=status.HTTP_404_NOT_FOUND)
