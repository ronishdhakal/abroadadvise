from rest_framework import serializers
from .models import Exam
from consultancy.models import Consultancy

class ExamSerializer(serializers.ModelSerializer):
    slug = serializers.ReadOnlyField()
    icon = serializers.ImageField(required=False, allow_null=True)  # ✅ Ensure correct image handling
    preparation_classes = serializers.SerializerMethodField()
    similar_exams = serializers.SerializerMethodField()

    class Meta:
        model = Exam
        fields = '__all__'

    def update(self, instance, validated_data):
        """
        ✅ Custom update method to:
        - Correctly handle image updates
        - Prevent overwriting existing images with `None`
        - Update other fields normally
        """

        print("🔄 Updating Exam:", instance.name)  # Debugging log

        # ✅ Handle image updates correctly
        if "icon" in validated_data:
            icon = validated_data.pop("icon", None)
            if icon:
                instance.icon.delete(save=False)  # Delete old image
                instance.icon = icon
            # If no new image is uploaded, keep the existing one.

        # ✅ Update all other fields normally
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        print("✅ Exam updated successfully!")  # Debugging log
        return instance

    def get_icon(self, obj):
        """✅ Ensure the correct URL format for the exam icon."""
        request = self.context.get("request")
        if obj.icon:
            return request.build_absolute_uri(obj.icon.url) if request else obj.icon.url
        return None  # ✅ Prevents errors if no image

    def get_preparation_classes(self, obj):
        """✅ Retrieve preparation classes with name, slug, logo, and address."""
        request = self.context.get("request")  # ✅ Ensure proper image URL handling
        return [
            {
                "name": cons.name,
                "slug": cons.slug,
                "logo": request.build_absolute_uri(cons.logo.url) if cons.logo and request else (cons.logo.url if cons.logo else None),
                "address": cons.address if cons.address else "Location not available"
            }
            for cons in obj.preparation_classes.all()
        ]

    def get_similar_exams(self, obj):
        """✅ Retrieve similar exams with name, slug, and icon."""
        request = self.context.get("request")
        similar_exams = obj.similar_exams.all()

        if not similar_exams.exists():
            print("❌ No Similar Exams Found for:", obj.name)  # ✅ Debugging Log
            return []

        return [
            {
                "name": exam.name,
                "slug": exam.slug,
                "icon": request.build_absolute_uri(exam.icon.url) if exam.icon and request else (exam.icon.url if exam.icon else None),
            }
            for exam in similar_exams
        ]
