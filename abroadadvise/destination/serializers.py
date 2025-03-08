from rest_framework import serializers
from .models import Destination
from course.models import Course
from university.models import University
from consultancy.models import Consultancy

class StudyDestinationSerializer(serializers.ModelSerializer):
    slug = serializers.ReadOnlyField()

    country_logo = serializers.SerializerMethodField()
    cover_page = serializers.SerializerMethodField()

    # ✅ Fixed ManyToMany Fields
    university_count = serializers.SerializerMethodField()
    course_count = serializers.SerializerMethodField()
    consultancy_count = serializers.SerializerMethodField()

    class Meta:
        model = Destination
        fields = [
            "id", "title", "slug", "country_logo", "cover_page", 
            "university_count", "course_count", "consultancy_count",
            "why_choose", "requirements", "documents_required", 
            "scholarships", "more_information", "faqs", "other_destinations"
        ]

    def get_country_logo(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.country_logo.url) if obj.country_logo else None

    def get_cover_page(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.cover_page.url) if obj.cover_page else None

    def get_university_count(self, obj):
        return University.objects.filter(country=obj.title).count()

    def get_course_count(self, obj):
        universities_in_destination = University.objects.filter(country=obj.title)
        return Course.objects.filter(university__in=universities_in_destination).count()

    def get_consultancy_count(self, obj):
        return Consultancy.objects.filter(study_abroad_destinations=obj).count()
