from rest_framework import serializers
from django.utils.timezone import now
from django.contrib.contenttypes.models import ContentType
from .reviews import Review
from .models import District, Discipline  # ✅ Import Discipline Model


# ✅ New Serializer: DisciplineSerializer (for API response)
class DisciplineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discipline
        fields = ["id", "name"]


# ✅ District Serializer (Already Present)
class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = ["id", "name"]


# ✅ New Mixin Serializer for Verified Items
class VerifiedItemSerializerMixin(serializers.Serializer):
    verified = serializers.BooleanField(read_only=True)


# ✅ Review Serializer (Already Present)
class ReviewSerializer(serializers.ModelSerializer):
    content_type = serializers.SlugRelatedField(
        queryset=ContentType.objects.all(), slug_field='model'
    )  # Allows selecting 'consultancy' or 'university'

    # ✅ New Reply Fields
    reply_text = serializers.CharField(required=False, allow_blank=True)
    replied_by = serializers.StringRelatedField(read_only=True)  # Show username of the responder
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

        # ✅ Only universities/consultancies/admins can reply
        if 'reply_text' in validated_data and request.user.is_staff:
            instance.reply_text = validated_data['reply_text']
            instance.replied_by = request.user
            instance.replied_at = now()
            instance.save()

        return instance
