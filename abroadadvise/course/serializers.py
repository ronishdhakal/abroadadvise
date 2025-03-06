from rest_framework import serializers
from .models import Course

class CourseSerializer(serializers.ModelSerializer):
    slug = serializers.ReadOnlyField()
    icon = serializers.ImageField(required=False)
    cover_image = serializers.ImageField(required=False)
    university = serializers.SerializerMethodField()  # ✅ Ensure full university details

    class Meta:
        model = Course
        fields = '__all__'

    def get_university(self, obj):
        if obj.university:
            return {
                "name": obj.university.name,
                "slug": obj.university.slug
            }
        return None
