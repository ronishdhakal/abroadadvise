from rest_framework import serializers
from .models import Course
from core.models import Discipline  # ✅ Import Discipline
from university.models import University  # ✅ Import University
from destination.models import Destination  # ✅ Import Destination

class CourseSerializer(serializers.ModelSerializer):
    slug = serializers.ReadOnlyField()
    icon = serializers.ImageField(required=False)
    cover_image = serializers.ImageField(required=False)

    university = serializers.SerializerMethodField()  # ✅ Fetch university details
    disciplines = serializers.SerializerMethodField()  # ✅ Fetch linked disciplines
    destination = serializers.SerializerMethodField()  # ✅ Fetch destination details

    class Meta:
        model = Course
        fields = '__all__'

    def get_university(self, obj):
        """ ✅ Return University name, slug, and country """
        if obj.university:
            return {
                "id": obj.university.id,
                "name": obj.university.name,
                "slug": obj.university.slug,
                "country": obj.university.country  # ✅ Include country
            }
        return None

    def get_destination(self, obj):
        """ ✅ Return Destination title and slug """
        if obj.destination:
            return {
                "id": obj.destination.id,
                "title": obj.destination.title,
                "slug": obj.destination.slug
            }
        return None

    def get_disciplines(self, obj):
        """ ✅ Return list of discipline objects with ID & name """
        return [{"id": d.id, "name": d.name} for d in obj.disciplines.all()] if obj.disciplines.exists() else []