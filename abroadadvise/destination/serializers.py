from rest_framework import serializers
from .models import Destination

class StudyDestinationSerializer(serializers.ModelSerializer):
    slug = serializers.ReadOnlyField()
    country_logo = serializers.ImageField(required=False, allow_null=True)
    cover_page = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Destination
        fields = "__all__"

    def update(self, instance, validated_data):
        """
        ✅ Fixes the issue where images get incorrectly set to None.
        ✅ Ensures images only update if a new file is provided.
        """

        print("🔄 Updating Destination:", instance.title)  # Debugging log

        # ✅ Handle image updates correctly
        if "country_logo" in validated_data:
            country_logo = validated_data.pop("country_logo", None)
            if country_logo:
                instance.country_logo.delete(save=False)  # Delete old image
                instance.country_logo = country_logo  # Assign new image
            # If no new image is uploaded, keep the existing one.

        if "cover_page" in validated_data:
            cover_page = validated_data.pop("cover_page", None)
            if cover_page:
                instance.cover_page.delete(save=False)  # Delete old image
                instance.cover_page = cover_page  # Assign new image
            # If no new image is uploaded, keep the existing one.

        # ✅ Update all other fields normally
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        print("✅ Destination updated successfully!")  # Debugging log
        return instance

class DestinationMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = ['id', 'title']
