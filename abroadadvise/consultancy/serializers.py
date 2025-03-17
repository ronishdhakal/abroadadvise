from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Consultancy, ConsultancyGallery, ConsultancyBranch
from core.models import District, VerifiedItem
from destination.models import Destination
from exam.models import Exam
from university.models import University
from inquiry.models import Inquiry  # Import Inquiry model
from inquiry.serializers import InquirySerializer  # Import the InquirySerializer

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
    is_verified = serializers.SerializerMethodField()
    inquiries = serializers.SerializerMethodField()

    #Remove this line as we want user creation automatic
    # user_email_input = serializers.EmailField(required=False, allow_blank=True, allow_null=True)
    # user_password = serializers.CharField(required=False, allow_blank=True, allow_null=True, write_only=True)


    class Meta:
        model = Consultancy
        fields = [
            "id", "user_email",  "name", "slug", "brochure",
            "logo", "cover_photo", "districts", "verified", "is_verified", "address", "latitude",
            "longitude", "establishment_date", "website", "email", "phone", "moe_certified",
            "about", "priority", "google_map_url", "services", "has_branches", "branches",
            "gallery_images", "study_abroad_destinations", "test_preparation", "partner_universities",'inquiries',
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

    def get_is_verified(self, obj):
        return obj.verified.verified if obj.verified else False
    
    def get_inquiries(self, obj):
        """
        Retrieve all inquiries related to the consultancy.
        This can be filtered based on the consultancy ID.
        """
        inquiries = Inquiry.objects.filter(consultancy=obj)
        return InquirySerializer(inquiries, many=True).data  # Serialize and return inquiries

    def create(self, validated_data):

        # ✅ Extract related fields
        study_abroad_destinations = validated_data.pop("study_abroad_destinations", [])
        test_preparation = validated_data.pop("test_preparation", [])
        partner_universities = validated_data.pop("partner_universities", [])
        branches_data = validated_data.pop("branches", [])
        districts = validated_data.pop("districts", [])

        # ✅ Create Consultancy
        consultancy = Consultancy.objects.create(**validated_data)

        # ✅ Create user automatically - similar to the University model
        if consultancy.email:  # Check if email exists
            username = consultancy.email.split('@')[0]
            user, user_created = User.objects.get_or_create(username=username, email=consultancy.email)

            # set role if user is created
            if user_created:
                user.role = "consultancy"
                user.save()
            consultancy.user = user
            consultancy.save(update_fields=["user"])

        # ✅ Assign many-to-many fields
        consultancy.study_abroad_destinations.set(study_abroad_destinations)
        consultancy.test_preparation.set(test_preparation)
        consultancy.partner_universities.set(partner_universities)
        consultancy.districts.set(districts)

        # ✅ Assign branches
        for branch in branches_data:
            ConsultancyBranch.objects.create(consultancy=consultancy, **branch)

        return consultancy

    def update(self, instance, validated_data):
        study_abroad_destinations = validated_data.pop("study_abroad_destinations", [])
        test_preparation = validated_data.pop("test_preparation", [])
        partner_universities = validated_data.pop("partner_universities", [])
        branches_data = validated_data.pop("branches", [])
        districts = validated_data.pop("districts", [])

        # ✅ Prevent modifying the user account directly, since user is created automatically
        validated_data.pop("user_email", None)
        #validated_data.pop("user_password", None) this was not here, so i have deleted it as well.

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        instance.study_abroad_destinations.set(study_abroad_destinations)
        instance.test_preparation.set(test_preparation)
        instance.partner_universities.set(partner_universities)
        instance.districts.set(districts)

        # ✅ Update branches
        instance.branches.all().delete()
        for branch in branches_data:
            ConsultancyBranch.objects.create(consultancy=instance, **branch)

        return instance
