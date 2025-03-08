from rest_framework import serializers
from .models import Course
from core.models import Discipline  # ✅ Import Discipline

class CourseSerializer(serializers.ModelSerializer):
    slug = serializers.ReadOnlyField()
    icon = serializers.ImageField(required=False)
    cover_image = serializers.ImageField(required=False)
    university = serializers.SerializerMethodField()  # ✅ Fetch university details
    disciplines = serializers.SerializerMethodField()  # ✅ Fetch linked disciplines

    class Meta:
        model = Course
        fields = '__all__'

    def get_university(self, obj):
        """ ✅ Return University name and slug """
        if obj.university:
            return {
                "name": obj.university.name,
                "slug": obj.university.slug
            }
        return None

    def get_disciplines(self, obj):
        """ ✅ Return a list of discipline names linked to this course """
        return [discipline.name for discipline in obj.disciplines.all()] if obj.disciplines.exists() else []
