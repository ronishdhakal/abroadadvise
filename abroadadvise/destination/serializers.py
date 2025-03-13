from rest_framework import serializers
from .models import Destination
from course.models import Course
from university.models import University
from consultancy.models import Consultancy

class StudyDestinationSerializer(serializers.ModelSerializer):
    slug = serializers.ReadOnlyField()

    # Ensure images are correctly uploaded & returned as URLs
    country_logo = serializers.ImageField(required=False, allow_null=True)
    cover_page = serializers.ImageField(required=False, allow_null=True)

    university_count = serializers.SerializerMethodField()
    course_count = serializers.SerializerMethodField()
    consultancy_count = serializers.SerializerMethodField()

    class Meta:
        model = Destination
        fields = [
            "id", "title", "slug", "country_logo", "cover_page",
            "university_count", "course_count", "consultancy_count",
            "why_choose", "requirements", "documents_required",
            "scholarships", "more_information", "faqs"
        ]

    def get_university_count(self, obj):
        return obj.universities.count()

    def get_course_count(self, obj):
        return obj.courses_to_study.count()

    def get_consultancy_count(self, obj):
        return obj.consultancies.count()

    # Ensure images return full URLs
    def get_country_logo(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.country_logo.url) if obj.country_logo and request else None

    def get_cover_page(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.cover_page.url) if obj.cover_page and request else None

    # Handle updating images properly
    def update(self, instance, validated_data):
        # Handle country_logo update (Keep existing if not provided)
        country_logo = validated_data.pop("country_logo", None)
        if country_logo:
            if instance.country_logo:  # Delete old image
                instance.country_logo.delete()
            instance.country_logo = country_logo

        # Handle cover_page update (Keep existing if not provided)
        cover_page = validated_data.pop("cover_page", None)
        if cover_page:
            if instance.cover_page:  # Delete old image
                instance.cover_page.delete()
            instance.cover_page = cover_page

        # Update the rest of the fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance