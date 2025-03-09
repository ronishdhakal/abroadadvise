from rest_framework import serializers
from .models import BlogPost, BlogCategory, BlogComment

class BlogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogCategory
        fields = ['id', 'name', 'slug']

class BlogPostSerializer(serializers.ModelSerializer):
    category = BlogCategorySerializer(read_only=True)  # ✅ Nested category details
    author_name = serializers.CharField(source='author.username', read_only=True)
    featured_image_url = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'author_name', 'category', 'featured_image_url', 
            'content', 'published_date', 'updated_at', 'is_published', 'priority'
        ]

    def get_featured_image_url(self, obj):
        """ Ensure absolute image URL is returned """
        request = self.context.get("request")
        if obj.featured_image:
            return request.build_absolute_uri(obj.featured_image.url) if request else obj.featured_image.url
        return None  # ✅ Ensures null-safe response

class BlogCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogComment
        fields = ['id', 'post', 'name', 'email', 'comment', 'created_at', 'is_approved']
