from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import College, CollegeGallery, CollegeBranch
from core.models import District
from destination.models import Destination
from university.models import University
from inquiry.models import Inquiry
from inquiry.serializers import InquirySerializer

User = get_user_model()


class DestinationSerializer(serializers.ModelSerializer):
    slug = serializers.ReadOnlyField()
    country_logo = serializers.SerializerMethodField()

    class Meta:
        model = Destination
        fields = ["id", "title", "slug", "country_logo"]

    def get_country_logo(self, obj):
        request = self.context.get("request")
        return request.build_absolute_uri(obj.country_logo.url) if request and obj.country_logo else None


class UniversitySerializer(serializers.ModelSerializer):
    logo = serializers.SerializerMethodField()
    slug = serializers.ReadOnlyField()

    class Meta:
        model = University
        fields = ["id", "name", "slug", "logo", "country"]

    def get_logo(self, obj):
        request = self.context.get("request")
        return request.build_absolute_uri(obj.logo.url) if request and obj.logo else None


class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = ["id", "name", "slug"]


class CollegeBranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollegeBranch
        fields = ["id", "branch_name", "location", "phone", "email"]


class CollegeGallerySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = CollegeGallery
        fields = ["id", "image", "uploaded_at"]

    def get_image(self, obj):
        request = self.context.get("request")
        return request.build_absolute_uri(obj.image.url) if request and obj.image else None


class CollegeSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source="user.email", read_only=True)
    slug = serializers.CharField(required=False, allow_blank=True)
    logo = serializers.SerializerMethodField()
    cover_photo = serializers.SerializerMethodField()
    brochure = serializers.SerializerMethodField()
    gallery_images = CollegeGallerySerializer(many=True, read_only=True)
    districts = DistrictSerializer(many=True, read_only=True)
    study_abroad_destinations = DestinationSerializer(many=True, read_only=True)
    affiliated_universities = UniversitySerializer(many=True, read_only=True)
    branches = CollegeBranchSerializer(many=True, required=False)
    inquiries = serializers.SerializerMethodField()

    class Meta:
        model = College
        fields = [
            "id", "user_email", "name", "slug", "brochure",
            "logo", "cover_photo", "districts", "verified", "address", "latitude",
            "longitude", "establishment_date", "website", "email", "phone", "moe_certified",
            "about", "priority", "google_map_url", "services", "has_branches", "branches",
            "gallery_images", "study_abroad_destinations", "affiliated_universities", "inquiries"
        ]

    def get_logo(self, obj):
        request = self.context.get("request")
        return request.build_absolute_uri(obj.logo.url) if request and obj.logo else None

    def get_cover_photo(self, obj):
        request = self.context.get("request")
        return request.build_absolute_uri(obj.cover_photo.url) if request and obj.cover_photo else None

    def get_brochure(self, obj):
        request = self.context.get("request")
        return request.build_absolute_uri(obj.brochure.url) if request and obj.brochure else None

    def get_inquiries(self, obj):
        inquiries = Inquiry.objects.filter(college=obj)
        return InquirySerializer(inquiries, many=True).data

    def create(self, validated_data):
        study_abroad_destinations = validated_data.pop("study_abroad_destinations", [])
        affiliated_universities = validated_data.pop("affiliated_universities", [])
        branches_data = validated_data.pop("branches", [])
        districts = validated_data.pop("districts", [])

        # ✅ Create college; user will be created in post_save signal
        college = College.objects.create(**validated_data)

        college.study_abroad_destinations.set(study_abroad_destinations)
        college.affiliated_universities.set(affiliated_universities)
        college.districts.set(districts)

        for branch in branches_data:
            CollegeBranch.objects.create(college=college, **branch)

        return college

    def update(self, instance, validated_data):
        study_abroad_destinations = validated_data.pop("study_abroad_destinations", None)
        affiliated_universities = validated_data.pop("affiliated_universities", None)
        districts = validated_data.pop("districts", None)
        branches_data = validated_data.pop("branches", [])

        validated_data.pop("user_email", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if study_abroad_destinations is not None:
            instance.study_abroad_destinations.set(study_abroad_destinations)
        if affiliated_universities is not None:
            instance.affiliated_universities.set(affiliated_universities)
        if districts is not None:
            instance.districts.set(districts)

        instance.branches.all().delete()
        for branch in branches_data:
            CollegeBranch.objects.create(college=instance, **branch)

        return instance
