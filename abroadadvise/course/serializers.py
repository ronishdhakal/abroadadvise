from rest_framework import serializers
from .models import Course
from core.models import Discipline  # ✅ Import Discipline
from university.models import University  # ✅ Import University
from destination.models import Destination  # ✅ Import Destination

class CourseSerializer(serializers.ModelSerializer):
    slug = serializers.ReadOnlyField()
    icon = serializers.ImageField(required=False)
    cover_image = serializers.ImageField(required=False)

    # --- Read-Only Fields for Display ---
    university_details = serializers.SerializerMethodField(read_only=True)
    disciplines_details = serializers.SerializerMethodField(read_only=True)
    destination_details = serializers.SerializerMethodField(read_only=True)

    # --- Writeable Fields for Saving ---
    university = serializers.PrimaryKeyRelatedField(
        queryset=University.objects.all(),
        allow_null=True,
        required=False,
        write_only=True
    )
    disciplines = serializers.PrimaryKeyRelatedField(
        queryset=Discipline.objects.all(),
        many=True,
        required=False,
        write_only=True
    )
    destination = serializers.PrimaryKeyRelatedField(
        queryset=Destination.objects.all(),
        allow_null=True,
        required=False,
        write_only=True
    )

    class Meta:
        model = Course
        fields = '__all__'
        # ✅ You could alternatively list them explicitly if needed:
        # fields = [
        #     'id', 'name', 'slug', 'abbreviation', 'university', 'destination',
        #     'duration', 'level', 'icon', 'cover_image', 'fee', 'disciplines',
        #     'priority', 'short_description', 'eligibility', 'course_structure',
        #     'job_prospects', 'scholarship', 'features', 'next_intake', 'entry_score',
        #     'university_details', 'disciplines_details', 'destination_details'
        # ]

    def get_university_details(self, obj):
        """ ✅ Return University name, slug, and country """
        if obj.university:
            return {
                "id": obj.university.id,
                "name": obj.university.name,
                "slug": obj.university.slug,
                "country": obj.university.country  # ✅ Include country
            }
        return None

    def get_destination_details(self, obj):
        """ ✅ Return Destination title and slug """
        if obj.destination:
            return {
                "id": obj.destination.id,
                "title": obj.destination.title,
                "slug": obj.destination.slug
            }
        return None

    def get_disciplines_details(self, obj):
        """ ✅ Return list of discipline objects with ID & name """
        return [{"id": d.id, "name": d.name} for d in obj.disciplines.all()] if obj.disciplines.exists() else []
