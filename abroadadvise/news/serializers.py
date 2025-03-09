from rest_framework import serializers
from .models import News, NewsComment, NewsCategory
from django.contrib.auth.models import User  # ✅ Ensure User model is imported

class NewsCategorySerializer(serializers.ModelSerializer):
    """
    Serializer for News Categories.
    """
    slug = serializers.ReadOnlyField()

    class Meta:
        model = NewsCategory
        fields = ['id', 'name', 'slug']

class NewsCommentSerializer(serializers.ModelSerializer):
    """
    Serializer for News Comments.
    """
    user = serializers.ReadOnlyField(source='user.username')  # ✅ Show username instead of ID
    created_at = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)  # ✅ Show only date (No Time)
    
    class Meta:
        model = NewsComment
        fields = ['id', 'post', 'user', 'comment', 'created_at', 'is_approved']
        extra_kwargs = {'post': {'write_only': True}, 'is_approved': {'read_only': True}}

    def create(self, validated_data):
        """
        Ensure that the comment is linked to the correct user.
        """
        request = self.context.get('request')
        if request and hasattr(request, "user"):
            validated_data["user"] = request.user  # ✅ Assign logged-in user
        return super().create(validated_data)

class NewsSerializer(serializers.ModelSerializer):
    """
    Serializer for News Articles.
    """
    slug = serializers.ReadOnlyField()
    category = NewsCategorySerializer(read_only=True)  # ✅ Include category details in response
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=NewsCategory.objects.all(), source='category', write_only=True
    )
    featured_image_url = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()  # ✅ Include approved comments only in detail view
    comment_count = serializers.IntegerField(source="comments.count", read_only=True)  # ✅ Optimized count

    class Meta:
        model = News
        fields = [
            'id', 'title', 'slug', 'date', 'author', 'category', 'category_id',
            'featured_image', 'featured_image_url', 'detail', 'comments', 'comment_count'
        ]  # ✅ Ensure all necessary fields are included

    def get_featured_image_url(self, obj):
        """
        Returns the absolute URL for the featured image.
        """
        request = self.context.get('request')
        if obj.featured_image:
            return request.build_absolute_uri(obj.featured_image.url) if request else obj.featured_image.url
        return None

    def get_comments(self, obj):
        """
        Returns a list of approved comments only in the detail view.
        """
        request = self.context.get('request')
        if request and request.parser_context.get('kwargs', {}).get('slug'):  # ✅ Fetch comments in detail view only
            comments = obj.comments.filter(is_approved=True).order_by('-created_at')
            return NewsCommentSerializer(comments, many=True).data
        return []  # ✅ Return empty list in news list view

class NewsDetailSerializer(NewsSerializer):
    """
    Extends NewsSerializer to include comments for detail views.
    """
    comments = serializers.SerializerMethodField()

    class Meta(NewsSerializer.Meta):
        fields = NewsSerializer.Meta.fields + ['comments']

    def get_comments(self, obj):
        comments = obj.comments.filter(is_approved=True).order_by('-created_at')
        return NewsCommentSerializer(comments, many=True).data
