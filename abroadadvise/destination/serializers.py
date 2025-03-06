from rest_framework import serializers
from .models import Destination

class StudyDestinationSerializer(serializers.ModelSerializer):
    slug = serializers.ReadOnlyField()

    country_logo = serializers.SerializerMethodField()
    cover_page = serializers.SerializerMethodField()
    
    # Fix ManyToMany Fields to Return Data
    courses_to_study = serializers.SerializerMethodField()
    universities = serializers.SerializerMethodField()
    consultancies = serializers.SerializerMethodField()

    class Meta:
        model = Destination
        fields = '__all__'

    def get_country_logo(self, obj):
        request = self.context.get('request')
        if obj.country_logo:
            return request.build_absolute_uri(obj.country_logo.url) if request else obj.country_logo.url
        return None

    def get_cover_page(self, obj):
        request = self.context.get('request')
        if obj.cover_page:
            return request.build_absolute_uri(obj.cover_page.url) if request else obj.cover_page.url
        return None

    def get_courses_to_study(self, obj):
        return [{"id": c.id, "name": c.name} for c in obj.courses_to_study.all()]

    def get_universities(self, obj):
        return [{"id": u.id, "name": u.name} for u in obj.universities.all()]

    def get_consultancies(self, obj):
        return [{"id": c.id, "name": c.name} for c in obj.consultancies.all()]

