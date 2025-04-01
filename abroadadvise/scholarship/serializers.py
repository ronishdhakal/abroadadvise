from rest_framework import serializers
from .models import Scholarship
from destination.models import Destination


# ✅ Reuse DestinationSerializer for nested data
class DestinationSerializer(serializers.ModelSerializer):
    country_logo = serializers.SerializerMethodField()

    class Meta:
        model = Destination
        fields = ["id", "title", "slug", "country_logo"]

    def get_country_logo(self, obj):
        request = self.context.get("request")
        return request.build_absolute_uri(obj.country_logo.url) if request and obj.country_logo else None


# ✅ Scholarship Serializer
class ScholarshipSerializer(serializers.ModelSerializer):
    slug = serializers.CharField(required=False, allow_blank=True)
    featured_image = serializers.SerializerMethodField()
    destination = DestinationSerializer(read_only=True)
    destination_id = serializers.PrimaryKeyRelatedField(
        queryset=Destination.objects.all(), source="destination", write_only=True
    )

    class Meta:
        model = Scholarship
        fields = [
            "id",
            "title",
            "slug",
            "by",
            "destination",
            "destination_id",
            "featured_image",
            "detail",
            "published_date",
            "active_from",
            "active_to",
            "is_published",
            "study_level",
        ]

    def get_featured_image(self, obj):
        request = self.context.get("request")
        return request.build_absolute_uri(obj.featured_image.url) if request and obj.featured_image else None
