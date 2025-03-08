from rest_framework import serializers
from .models import University
from course.models import Course  # Import Course Model
from core.models import Discipline  # Import Discipline Model

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'name', 'abbreviation', 'duration', 'level', 'fee']

class UniversitySerializer(serializers.ModelSerializer):
    courses = CourseSerializer(many=True, read_only=True)  # Automatically fetch courses linked to the university
    disciplines = serializers.SerializerMethodField()  # ✅ Fetch linked disciplines
    slug = serializers.ReadOnlyField()
    brochure = serializers.FileField(required=False)
    logo = serializers.ImageField(required=False)
    cover_photo = serializers.ImageField(required=False)
    country = serializers.CharField(read_only=True)  # Explicitly include country

    class Meta:
        model = University
        fields = [
            'id', 'name', 'slug', 'brochure', 'logo', 'cover_photo', 'country', 'address', 'email', 'phone',
            'type', 'website', 'priority', 'eligibility', 'facilities_features', 'scholarship', 'tuition_fees',
            'consultancies_to_apply', 'about', 'faqs', 'courses', 'verified', 'disciplines',  # ✅ Added disciplines
        ]

    def get_disciplines(self, obj):
        """ ✅ Return a list of discipline names linked to this university """
        return [discipline.name for discipline in obj.disciplines.all()] if obj.disciplines.exists() else []
