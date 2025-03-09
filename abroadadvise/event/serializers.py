from rest_framework import serializers
from .models import Event, EventGallery
from university.models import University
from consultancy.models import Consultancy
from destination.models import Destination

class EventGallerySerializer(serializers.ModelSerializer):
    """
    Serializer for Event Gallery images.
    """
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = EventGallery
        fields = ['id', 'image_url', 'uploaded_at']

    def get_image_url(self, obj):
        """
        Returns the absolute URL for the event gallery image.
        """
        request = self.context.get('request')
        return request.build_absolute_uri(obj.image.url) if obj.image else None


class EventSerializer(serializers.ModelSerializer):
    """
    Serializer for the Event model with related fields.
    """
    slug = serializers.ReadOnlyField()
    featured_image = serializers.SerializerMethodField()
    gallery_images = EventGallerySerializer(many=True, read_only=True)
    related_universities = serializers.SerializerMethodField()
    related_consultancies = serializers.SerializerMethodField()
    targeted_destinations = serializers.SerializerMethodField()
    organizer = serializers.SerializerMethodField()  # ✅ Ensuring organizer details are returned

    class Meta:
        model = Event
        fields = '__all__'

    def get_featured_image(self, obj):
        """
        Returns the absolute URL for the event's featured image.
        """
        request = self.context.get('request')
        return request.build_absolute_uri(obj.featured_image.url) if obj.featured_image else None

    def get_related_universities(self, obj):
        """
        Returns a list of related universities.
        """
        return [
            {"name": uni.name, "slug": uni.slug}
            for uni in obj.related_universities.all()
        ]

    def get_related_consultancies(self, obj):
        """
        Returns a list of related consultancies.
        """
        return [
            {"name": cons.name, "slug": cons.slug}
            for cons in obj.related_consultancies.all()
        ]

    def get_targeted_destinations(self, obj):
        """
        ✅ Fix: Now correctly includes targeted destinations.
        """
        return [
            {
                "title": dest.title,
                "slug": dest.slug
            }
            for dest in obj.targeted_destinations.all()
        ]

    def get_organizer(self, obj):
        """
        Returns details about the organizer (Consultancy or University).
        """
        if obj.organizer:
            return {"name": obj.organizer.name, "slug": obj.organizer.slug}
        return None
