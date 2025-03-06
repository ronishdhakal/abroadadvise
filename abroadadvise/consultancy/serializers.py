from rest_framework import serializers
from .models import Consultancy, ConsultancyGallery, ConsultancyBranch
from core.models import District, VerifiedItem
from destination.models import Destination
from exam.models import Exam
from university.models import University

class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = ["id", "name"]

class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = ["id", "name"]

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
        fields = ["id", "image", "uploaded_at"]

    def get_image(self, obj):
        request = self.context.get("request")
        return request.build_absolute_uri(obj.image.url) if obj.image else None

class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = ["id", "name"]

class ConsultancyBranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsultancyBranch
        fields = ["id", "branch_name", "location", "phone", "email"]

class ConsultancySerializer(serializers.ModelSerializer):
    logo = serializers.SerializerMethodField()
    cover_photo = serializers.SerializerMethodField()
    brochure = serializers.SerializerMethodField()

    districts = DistrictSerializer(many=True, read_only=True)
    gallery_images = ConsultancyGallerySerializer(many=True, read_only=True)
    study_abroad_destinations = DestinationSerializer(many=True, read_only=True)
    test_preparation = ExamSerializer(many=True, read_only=True)
    partner_universities = UniversitySerializer(many=True, read_only=True)
    branches = ConsultancyBranchSerializer(many=True, read_only=True)

    class Meta:
        model = Consultancy
        fields = [
            "id", "user", "name", "slug", "brochure", "logo", "cover_photo", "districts",
            "verified", "address", "latitude", "longitude", "establishment_date", "website",
            "email", "phone", "moe_certified", "about", "priority", "google_map_url", "services",
            "has_branches", "branches", "gallery_images", "study_abroad_destinations",
            "test_preparation", "partner_universities"
        ]

    def get_logo(self, obj):
        request = self.context.get("request")
        return request.build_absolute_uri(obj.logo.url) if obj.logo else None

    def get_cover_photo(self, obj):
        request = self.context.get("request")
        return request.build_absolute_uri(obj.cover_photo.url) if obj.cover_photo else None

    def get_brochure(self, obj):
        request = self.context.get("request")
        return request.build_absolute_uri(obj.brochure.url) if obj.brochure else None
