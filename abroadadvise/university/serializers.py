from rest_framework import serializers
from .models import University
from consultancy.models import Consultancy  # Import Consultancy Model
from course.models import Course  # Import Course Model
from core.models import Discipline  # Import Discipline Model

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

# ✅ University Serializer (Fully Fixed)
class UniversitySerializer(serializers.ModelSerializer):
    slug = serializers.ReadOnlyField()  # ✅ Prevent modification of slug
    logo = serializers.SerializerMethodField()
    cover_photo = serializers.SerializerMethodField()
    brochure = serializers.SerializerMethodField()
    courses = CourseSerializer(many=True, read_only=True)  # ✅ Automatically fetch linked courses
    disciplines = serializers.SerializerMethodField()  # ✅ Fetch linked disciplines
    consultancies_to_apply = ConsultancyBasicSerializer(many=True, read_only=True)  # ✅ Show linked consultancies
    is_verified = serializers.SerializerMethodField()  # ✅ Boolean verification check

    class Meta:
        model = University
        fields = [
            "id", "name", "slug", "brochure", "logo", "cover_photo", "country", "address", "email", "phone",
            "type", "website", "priority", "eligibility", "facilities_features", "scholarship", "tuition_fees",
            "consultancies_to_apply", "about", "faqs", "courses", "verified", "is_verified", "disciplines",
        ]

    def get_logo(self, obj):
        """ ✅ Fix: Ensures full URL for logo image """
        request = self.context.get("request")
        if obj.logo:
            return request.build_absolute_uri(obj.logo.url) if request else obj.logo.url
        return None

    def get_cover_photo(self, obj):
        """ ✅ Fix: Ensures full URL for cover photo """
        request = self.context.get("request")
        if obj.cover_photo:
            return request.build_absolute_uri(obj.cover_photo.url) if request else obj.cover_photo.url
        return None

    def get_brochure(self, obj):
        """ ✅ Fix: Ensures full URL for brochure file """
        request = self.context.get("request")
        if obj.brochure:
            return request.build_absolute_uri(obj.brochure.url) if request else obj.brochure.url
        return None

    def get_disciplines(self, obj):
        """ ✅ Fetch discipline names dynamically """
        return [discipline.name for discipline in obj.disciplines.all()] if obj.disciplines.exists() else []

    def get_is_verified(self, obj):
        """ ✅ Check if the university is verified """
        return obj.verified.verified if obj.verified else False

    def create(self, validated_data):
        """ ✅ Custom Create Method for Handling ManyToMany and File Fields """
        consultancies_to_apply = validated_data.pop("consultancies_to_apply", [])
        disciplines = validated_data.pop("disciplines", [])

        university = University.objects.create(**validated_data)
        university.consultancies_to_apply.set(consultancies_to_apply)
        university.disciplines.set(disciplines)

        return university

    def update(self, instance, validated_data):
        """ ✅ Custom Update Method for Handling ManyToMany and File Fields """
        consultancies_to_apply = validated_data.pop("consultancies_to_apply", [])
        disciplines = validated_data.pop("disciplines", [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        instance.consultancies_to_apply.set(consultancies_to_apply)
        instance.disciplines.set(disciplines)

        return instance
