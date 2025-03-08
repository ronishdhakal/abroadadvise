from rest_framework import serializers
from .models import BlogPost, BlogCategory, BlogComment

class BlogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogCategory
        fields = ['id', 'name', 'slug']

class BlogPostSerializer(serializers.ModelSerializer):
    category = BlogCategorySerializer(read_only=True)
    author_name = serializers.CharField(source='author.username', read_only=True)
    featured_image = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'author_name', 'category', 'featured_image', 
            'content', 'published_date', 'updated_at', 'is_published', 'priority'
        ]

    def get_featured_image(self, obj):
        request = self.context.get("request")
        return request.build_absolute_uri(obj.featured_image.url) if obj.featured_image else None

class BlogCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogComment
        fields = ['id', 'post', 'name', 'email', 'comment', 'created_at', 'is_approved']
