from rest_framework import serializers
from .models import Consultancy, ConsultancyGallery
from destination.models import Destination
from exam.models import Exam
from university.models import University

class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = ["id", "title", "country_logo"]

class ExamSerializer(serializers.ModelSerializer):
    icon = serializers.SerializerMethodField()

    class Meta:
        model = Exam
        fields = ["id", "name", "icon"]

    def get_icon(self, obj):
        request = self.context.get("request")
        return request.build_absolute_uri(obj.icon.url) if obj.icon else None

class UniversitySerializer(serializers.ModelSerializer):
    logo = serializers.SerializerMethodField()

    class Meta:
        model = University
        fields = ["id", "name", "logo"]

    def get_logo(self, obj):
        request = self.context.get("request")
        return request.build_absolute_uri(obj.logo.url) if obj.logo else None

class ConsultancyGallerySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ConsultancyGallery
        fields = ["id", "image"]

    def get_image(self, obj):
        request = self.context.get("request")
        return request.build_absolute_uri(obj.image.url) if obj.image else None

class ConsultancySerializer(serializers.ModelSerializer):
    logo = serializers.SerializerMethodField()
    cover_photo = serializers.SerializerMethodField()
    brochure = serializers.SerializerMethodField()
    study_abroad_destinations = DestinationSerializer(many=True)
    test_preparation = ExamSerializer(many=True)
    partner_universities = UniversitySerializer(many=True)
    gallery_images = ConsultancyGallerySerializer(many=True, read_only=True)

    class Meta:
        model = Consultancy
        fields = "__all__"

    def get_logo(self, obj):
        request = self.context.get("request")
        return request.build_absolute_uri(obj.logo.url) if obj.logo else None

    def get_cover_photo(self, obj):
        request = self.context.get("request")
        return request.build_absolute_uri(obj.cover_photo.url) if obj.cover_photo else None

    def get_brochure(self, obj):
        request = self.context.get("request")
        return request.build_absolute_uri(obj.brochure.url) if obj.brochure else None