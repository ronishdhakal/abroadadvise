from rest_framework import serializers
from .models import University
from consultancy.models import Consultancy  # ✅ Import Consultancy Model
from course.models import Course  # ✅ Import Course Model
from core.models import Discipline # ✅ Import Discipline Model

# ✅ Course Serializer
class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ["id", "name", "abbreviation", "duration", "level", "fee"]

# ✅ Consultancy Serializer for Applied Consultancies
class ConsultancyBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consultancy
        fields = ["id", "name", "slug"]

# ✅ Discipline Serializer
class DisciplineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discipline
        fields = ["id", "name"]

# ✅ University Serializer (Updated with Verification, File Handling, and Disciplines)
class UniversitySerializer(serializers.ModelSerializer):
    slug = serializers.ReadOnlyField()  # ✅ Prevent modification of slug
    logo = serializers.SerializerMethodField()
    cover_photo = serializers.SerializerMethodField()
    brochure = serializers.SerializerMethodField()
    courses = CourseSerializer(many=True, read_only=True)  # ✅ Automatically fetch linked courses
    is_verified = serializers.SerializerMethodField()  # ✅ Boolean verification check
    disciplines = DisciplineSerializer(many=True, read_only=True) # ✅ Add disciplines field
    qs_world_ranking = serializers.CharField(required=False, allow_blank=True, allow_null=True) # ✅ Add qs_world_ranking field

    class Meta:
        model = University
        fields = [
            "id", "name", "slug", "brochure", "logo", "cover_photo", "country", "address", "email", "phone",
            "type", "website", "priority", "eligibility", "facilities_features", "scholarship", "tuition_fees",
            "about", "faqs", "courses", "is_verified", "disciplines", "qs_world_ranking" # ✅ Add disciplines and qs_world_ranking here
        ]

    def get_logo(self, obj):
        """ ✅ Ensures full URL for logo image """
        request = self.context.get("request")
        if obj.logo:
            return request.build_absolute_uri(obj.logo.url) if request else obj.logo.url
        return None

    def get_cover_photo(self, obj):
        """ ✅ Ensures full URL for cover photo """
        request = self.context.get("request")
        if obj.cover_photo:
            return request.build_absolute_uri(obj.cover_photo.url) if request else obj.cover_photo.url
        return None

    def get_brochure(self, obj):
        """ ✅ Ensures full URL for brochure file """
        request = self.context.get("request")
        if obj.brochure:
            return request.build_absolute_uri(obj.brochure.url) if request else obj.brochure.url
        return None

    def get_is_verified(self, obj):
        """ ✅ Check if the university is verified (Fix for Verification Tick) """
        return obj.verified.verified if obj.verified else False

    def create(self, validated_data):
        """ ✅ Custom Create Method for Handling File Fields """
        university = University.objects.create(**validated_data)

        # ✅ Handle file uploads
        request = self.context.get("request")
        if request and request.FILES:
            if 'logo' in request.FILES:
                university.logo = request.FILES['logo']
            if 'cover_photo' in request.FILES:
                university.cover_photo = request.FILES['cover_photo']
            if 'brochure' in request.FILES:
                university.brochure = request.FILES['brochure']

        university.save()
        return university

    def update(self, instance, validated_data):
        """ ✅ Custom Update Method for Handling File Fields """
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # ✅ Handle file updates
        request = self.context.get("request")
        if request and request.FILES:
            if 'logo' in request.FILES:
                instance.logo = request.FILES['logo']
            if 'cover_photo' in request.FILES:
                instance.cover_photo = request.FILES['cover_photo']
            if 'brochure' in request.FILES:
                instance.brochure = request.FILES['brochure']

        instance.save()
        return instance
