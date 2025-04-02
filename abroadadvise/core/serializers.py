from rest_framework import serializers
from django.utils.timezone import now
from django.contrib.contenttypes.models import ContentType
from django.conf import settings
from .reviews import Review
from .models import District, Discipline, SiteSetting, Ad

# ✅ Serializer for Discipline Model
class DisciplineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discipline
        fields = ["id", "name"]

# ✅ Serializer for District Model
class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = ["id", "name"]

# ✅ Serializer for Site Setting (Logo API)
class SiteSettingSerializer(serializers.ModelSerializer):
    site_logo_url = serializers.SerializerMethodField()
    hero_image_url = serializers.SerializerMethodField()

    class Meta:
        model = SiteSetting
        fields = ['site_logo_url', 'hero_image_url']

    def get_site_logo_url(self, obj):
        request = self.context.get('request')
        if obj.site_logo:
            return request.build_absolute_uri(obj.site_logo.url) if request else obj.site_logo.url
        return None

    def get_hero_image_url(self, obj):
        request = self.context.get('request')
        if obj.hero_image:
            return request.build_absolute_uri(obj.hero_image.url) if request else obj.hero_image.url
        return None

class AdSerializer(serializers.ModelSerializer):
    desktop_image_url = serializers.SerializerMethodField()
    mobile_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Ad
        fields = [
            "id", "title", "placement", "redirect_url", "is_active",
            "desktop_image", "mobile_image",  # ✅ Include these for file upload
            "desktop_image_url", "mobile_image_url"  # ✅ For display
        ]
        read_only_fields = ["desktop_image_url", "mobile_image_url"]

    def get_desktop_image_url(self, obj):
        request = self.context.get('request')
        if obj.desktop_image:
            return request.build_absolute_uri(obj.desktop_image.url) if request else obj.desktop_image.url
        return None

    def get_mobile_image_url(self, obj):
        request = self.context.get('request')
        if obj.mobile_image:
            return request.build_absolute_uri(obj.mobile_image.url) if request else obj.mobile_image.url
        return None


# ✅ Review Serializer with Reply Fields
class ReviewSerializer(serializers.ModelSerializer):
    content_type = serializers.SlugRelatedField(
        queryset=ContentType.objects.all(), slug_field='model'
    )

    reply_text = serializers.CharField(required=False, allow_blank=True)
    replied_by = serializers.StringRelatedField(read_only=True)
    replied_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'user', 'content_type', 'object_id', 'rating', 'review_text', 'created_at', 'is_approved',
            'reply_text', 'replied_by', 'replied_at'
        ]
        read_only_fields = ['user', 'created_at', 'is_approved', 'replied_by', 'replied_at']

    def update(self, instance, validated_data):
        request = self.context.get('request')

        if 'reply_text' in validated_data and request.user.is_staff:
            instance.reply_text = validated_data['reply_text']
            instance.replied_by = request.user
            instance.replied_at = now()
            instance.save()

        return instance

class DistrictMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = ['id', 'name']