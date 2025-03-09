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
from core.filters import BlogPostFilter  # ✅ Import the correct filter

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
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter]  # ✅ Ensure filters are enabled
    filterset_class = BlogPostFilter  # ✅ Apply BlogPostFilter
    search_fields = ['title', 'content']

    def get_queryset(self):
        """
        Fetch published blog posts and manually apply filtering by category if needed.
        """
        queryset = BlogPost.objects.filter(is_published=True).order_by('-published_date')

        # ✅ Manual filtering (Ensuring it works)
        category_slug = self.request.query_params.get('category', None)
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)  # ✅ Debugging filter

        return queryset

# ✅ Get Single Blog Post by Slug
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
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

# ✅ Create Blog Post (Admin Only)
@api_view(['POST'])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def create_blog_post(request):
    """
    Create a new blog post (Admin Only).
    """
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
    """
    Update an existing blog post (Admin Only).
    """
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
    """
    Delete a blog post (Admin Only).
    """
    try:
        post = BlogPost.objects.get(slug=slug)
        post.delete()
        return Response({"message": "Blog post deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except BlogPost.DoesNotExist:
        return Response({"error": "Blog post not found"}, status=status.HTTP_404_NOT_FOUND)

# ✅ List Approved Comments for a Blog
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
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
@permission_classes([permissions.AllowAny])  # ✅ No login required to comment
def add_blog_comment(request, blog_slug):
    """
    Add a new comment to a blog post.
    """
    try:
        blog = BlogPost.objects.get(slug=blog_slug, is_published=True)
        data = request.data.copy()
        data['post'] = blog.id  # ✅ Attach the blog post to the comment

        serializer = BlogCommentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Comment submitted for approval"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except BlogPost.DoesNotExist:
        return Response({"error": "Blog post not found"}, status=status.HTTP_404_NOT_FOUND)
