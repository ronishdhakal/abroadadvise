from rest_framework import serializers
from .models import University
from consultancy.models import Consultancy
from course.models import Course
from core.models import Discipline

# ✅ Course Serializer
class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ["id", "name", "abbreviation", "duration", "level", "fee"]

# ✅ Consultancy Serializer
class ConsultancyBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consultancy
        fields = ["id", "name", "slug"]

# ✅ Discipline Serializer
class DisciplineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discipline
        fields = ["id", "name"]

# ✅ University Serializer
class UniversitySerializer(serializers.ModelSerializer):
    slug = serializers.ReadOnlyField()
    logo = serializers.SerializerMethodField()
    cover_photo = serializers.SerializerMethodField()
    brochure = serializers.SerializerMethodField()
    courses = CourseSerializer(many=True, read_only=True)
    is_verified = serializers.SerializerMethodField()
    disciplines = DisciplineSerializer(many=True, read_only=True)
    qs_world_ranking = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    discipline_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )

    class Meta:
        model = University
        fields = [
            "id", "name", "slug", "brochure", "logo", "cover_photo", "country", "address", "email", "phone",
            "type", "website", "priority", "eligibility", "facilities_features", "scholarship", "tuition_fees",
            "about", "faqs", "courses", "is_verified", "disciplines", "qs_world_ranking", "discipline_ids"
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

    def create(self, validated_data):
        discipline_ids = validated_data.pop("discipline_ids", [])
        request = self.context.get("request")

        university = University.objects.create(**validated_data)

        # ✅ Handle file uploads
        if request and request.FILES:
            if 'logo' in request.FILES:
                university.logo = request.FILES['logo']
            if 'cover_photo' in request.FILES:
                university.cover_photo = request.FILES['cover_photo']
            if 'brochure' in request.FILES:
                university.brochure = request.FILES['brochure']
            university.save()

        # ✅ Assign disciplines if provided
        if discipline_ids:
            university.disciplines.set(discipline_ids)

        return university

    def update(self, instance, validated_data):
        discipline_ids = validated_data.pop("discipline_ids", [])
        request = self.context.get("request")

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if request and request.FILES:
            if 'logo' in request.FILES:
                instance.logo = request.FILES['logo']
            if 'cover_photo' in request.FILES:
                instance.cover_photo = request.FILES['cover_photo']
            if 'brochure' in request.FILES:
                instance.brochure = request.FILES['brochure']

        instance.save()

        # ✅ Re-assign disciplines
        if discipline_ids:
            instance.disciplines.set(discipline_ids)

        return instance

class UniversityMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = University
        fields = ['id', 'name']
