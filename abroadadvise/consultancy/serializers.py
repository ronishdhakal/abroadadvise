from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Consultancy, ConsultancyGallery, ConsultancyBranch
from core.models import District
from destination.models import Destination
from exam.models import Exam
from university.models import University
from inquiry.models import Inquiry
from inquiry.serializers import InquirySerializer
from django.utils.text import slugify

User = get_user_model()

# ✅ Destination Serializer
class DestinationSerializer(serializers.ModelSerializer):
    slug = serializers.ReadOnlyField()
    country_logo = serializers.SerializerMethodField()

    class Meta:
        model = Destination
        fields = ["id", "title", "slug", "country_logo"]

    def get_country_logo(self, obj):
        request = self.context.get("request")
        return request.build_absolute_uri(obj.country_logo.url) if request and obj.country_logo else None

# ✅ Exam Serializer
class ExamSerializer(serializers.ModelSerializer):
    slug = serializers.ReadOnlyField()

    class Meta:
        model = Exam
        fields = ["id", "name", "slug", "icon"]

# ✅ University Serializer
class UniversitySerializer(serializers.ModelSerializer):
    logo = serializers.SerializerMethodField()
    country = serializers.CharField()
    slug = serializers.ReadOnlyField()

    class Meta:
        model = University
        fields = ["id", "name", "slug", "logo", "country"]

    def get_logo(self, obj):
        request = self.context.get("request")
        return request.build_absolute_uri(obj.logo.url) if request and obj.logo else None

# ✅ Consultancy Gallery Serializer
class ConsultancyGallerySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ConsultancyGallery
        fields = ["id", "image", "uploaded_at"]

    def get_image(self, obj):
        request = self.context.get("request")
        return request.build_absolute_uri(obj.image.url) if request and obj.image else None

# ✅ District Serializer
class DistrictSerializer(serializers.ModelSerializer):
    slug = serializers.ReadOnlyField()

    class Meta:
        model = District
        fields = ["id", "name", "slug"]

# ✅ Consultancy Branch Serializer
class ConsultancyBranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsultancyBranch
        fields = ["id", "branch_name", "location", "phone", "email"]

# ✅ Consultancy Serializer
class ConsultancySerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source="user.email", read_only=True)
    slug = serializers.CharField(required=False, allow_blank=True)
    logo = serializers.SerializerMethodField()
    cover_photo = serializers.SerializerMethodField()
    brochure = serializers.SerializerMethodField()
    gallery_images = ConsultancyGallerySerializer(many=True, read_only=True)
    districts = DistrictSerializer(many=True, read_only=True)
    study_abroad_destinations = DestinationSerializer(many=True, read_only=True)
    test_preparation = ExamSerializer(many=True, read_only=True)
    partner_universities = UniversitySerializer(many=True, read_only=True)
    branches = ConsultancyBranchSerializer(many=True, required=False)
    inquiries = serializers.SerializerMethodField()

    class Meta:
        model = Consultancy
        fields = [
            "id", "user_email",  "name", "slug", "brochure",
            "logo", "cover_photo", "districts", "verified", "address", "latitude",
            "longitude", "establishment_date", "website", "email", "phone", "moe_certified",
            "about", "priority", "google_map_url", "services", "has_branches", "branches",
            "gallery_images", "study_abroad_destinations", "test_preparation", "partner_universities", 'inquiries',
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
        inquiries = Inquiry.objects.filter(consultancy=obj)
        return InquirySerializer(inquiries, many=True).data

    def create(self, validated_data):
        study_abroad_destinations = validated_data.pop("study_abroad_destinations", [])
        test_preparation = validated_data.pop("test_preparation", [])
        partner_universities = validated_data.pop("partner_universities", [])
        branches_data = validated_data.pop("branches", [])
        districts = validated_data.pop("districts", [])

        consultancy = Consultancy.objects.create(**validated_data)

        # ✅ Create user using consultancy name as username
        if consultancy.email:  # Required for login
            base_username = slugify(consultancy.name) or "consultancy"
            username = base_username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username}-{counter}"
                counter += 1

            user, user_created = User.objects.get_or_create(username=username, email=consultancy.email)

            if user_created:
                user.first_name = consultancy.name
                user.role = "consultancy"
                user.set_password("abroadconsultancy123")  # Optional: Set a default password
                user.save()

            consultancy.user = user
            consultancy.save(update_fields=["user"])

        consultancy.study_abroad_destinations.set(study_abroad_destinations)
        consultancy.test_preparation.set(test_preparation)
        consultancy.partner_universities.set(partner_universities)
        consultancy.districts.set(districts)

        for branch in branches_data:
            ConsultancyBranch.objects.create(consultancy=consultancy, **branch)

        return consultancy

    def update(self, instance, validated_data):
        study_abroad_destinations = validated_data.pop("study_abroad_destinations", [])
        test_preparation = validated_data.pop("test_preparation", [])
        partner_universities = validated_data.pop("partner_universities", [])
        branches_data = validated_data.pop("branches", [])
        districts = validated_data.pop("districts", [])

        validated_data.pop("user_email", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        instance.study_abroad_destinations.set(study_abroad_destinations)
        instance.test_preparation.set(test_preparation)
        instance.partner_universities.set(partner_universities)
        instance.districts.set(districts)

        instance.branches.all().delete()
        for branch in branches_data:
            ConsultancyBranch.objects.create(consultancy=instance, **branch)

        return instance

# ✅ Minimal Serializer
class ConsultancyMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consultancy
        fields = ['id', 'name']
