from rest_framework import serializers
from .models import BlogPost, BlogCategory, BlogComment
from django.utils.text import slugify


class BlogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogCategory
        fields = ['id', 'name', 'slug']
        read_only_fields = ['slug']

    def create(self, validated_data):
        validated_data['slug'] = slugify(validated_data['name'])
        return super().create(validated_data)

class BlogPostSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=BlogCategory.objects.all(),
        required=False,
        allow_null=True  # ✅ Optional category
    )
    author_name = serializers.CharField(source='author.username', read_only=True)
    featured_image_url = serializers.SerializerMethodField()
    featured_image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'author_name', 'category',
            'featured_image', 'featured_image_url', 'content',
            'published_date', 'updated_at', 'is_published', 'priority'
        ]
        read_only_fields = ['slug', 'published_date', 'updated_at', 'author_name']

    def get_featured_image_url(self, obj):
        """ ✅ Return full URL for image if available """
        request = self.context.get("request")
        if obj.featured_image:
            return request.build_absolute_uri(obj.featured_image.url) if request else obj.featured_image.url
        return None

    def update(self, instance, validated_data):
        """ ✅ Delete old image if replaced """
        if 'featured_image' in validated_data:
            if instance.featured_image:
                instance.featured_image.delete(save=False)
        return super().update(instance, validated_data)


class BlogCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogComment
        fields = [
            'id', 'post', 'name', 'email',
            'comment', 'created_at', 'is_approved'
        ]
        read_only_fields = ['created_at', 'is_approved']
