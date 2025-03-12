from rest_framework import serializers
from .models import University
from core.models import Discipline  # ✅ Import Discipline Model

# ✅ University Serializer (Enhanced Discipline Handling & File Support)
class UniversitySerializer(serializers.ModelSerializer):
    slug = serializers.ReadOnlyField()  # ✅ Prevent modification of slug
    logo = serializers.SerializerMethodField()
    cover_photo = serializers.SerializerMethodField()
    brochure = serializers.SerializerMethodField()
    disciplines = serializers.PrimaryKeyRelatedField(
        queryset=Discipline.objects.all(), many=True, required=False
    )  # ✅ Directly reference Discipline IDs
    is_verified = serializers.SerializerMethodField()  # ✅ Boolean verification check

    class Meta:
        model = University
        fields = [
            "id", "name", "slug", "brochure", "logo", "cover_photo", "country", "address", "email", "phone",
            "type", "website", "priority", "eligibility", "facilities_features", "scholarship", "tuition_fees",
            "about", "faqs", "verified", "is_verified", "disciplines",
        ]

    def get_logo(self, obj):
        """ ✅ Ensures full URL for logo image """
        request = self.context.get("request")
        return request.build_absolute_uri(obj.logo.url) if obj.logo and request else None

    def get_cover_photo(self, obj):
        """ ✅ Ensures full URL for cover photo """
        request = self.context.get("request")
        return request.build_absolute_uri(obj.cover_photo.url) if obj.cover_photo and request else None

    def get_brochure(self, obj):
        """ ✅ Ensures full URL for brochure file """
        request = self.context.get("request")
        return request.build_absolute_uri(obj.brochure.url) if obj.brochure and request else None

    def get_is_verified(self, obj):
        """ ✅ Check if the university is verified """
        return obj.verified.verified if obj.verified else False

    def validate_disciplines(self, value):
        """ ✅ Ensure disciplines contain valid Discipline instances """
        if not all(isinstance(d, int) for d in value):
            raise serializers.ValidationError("Disciplines must be a list of integer IDs.")
        return value

    def create(self, validated_data):
        """ ✅ Custom Create Method for Handling ManyToMany and File Fields """
        disciplines = validated_data.pop("disciplines", [])

        # ✅ Ensure disciplines contain valid discipline instances
        discipline_instances = Discipline.objects.filter(id__in=disciplines)

        university = University.objects.create(**validated_data)

        # ✅ Handle file uploads (Preserve existing files if not updated)
        request = self.context.get("request")
        if request and request.FILES:
            if "logo" in request.FILES:
                university.logo = request.FILES["logo"]
            if "cover_photo" in request.FILES:
                university.cover_photo = request.FILES["cover_photo"]
            if "brochure" in request.FILES:
                university.brochure = request.FILES["brochure"]

        # ✅ Set disciplines safely
        university.disciplines.set(discipline_instances)
        university.save()

        return university

    def update(self, instance, validated_data):
        """ ✅ Custom Update Method for Handling ManyToMany and File Fields """
        disciplines = validated_data.pop("disciplines", [])

        # ✅ Ensure disciplines contain valid discipline instances
        discipline_instances = Discipline.objects.filter(id__in=disciplines)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # ✅ Handle file updates (Preserve existing files if not updated)
        request = self.context.get("request")
        if request and request.FILES:
            if "logo" in request.FILES:
                instance.logo = request.FILES["logo"]
            if "cover_photo" in request.FILES:
                instance.cover_photo = request.FILES["cover_photo"]
            if "brochure" in request.FILES:
                instance.brochure = request.FILES["brochure"]

        instance.save()
        instance.disciplines.set(discipline_instances)  # ✅ Now properly saves disciplines

        return instance
