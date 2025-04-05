from rest_framework import serializers
from .models import Event
from university.models import University
from consultancy.models import Consultancy
from destination.models import Destination


class EventSerializer(serializers.ModelSerializer):
    """
    Serializer for the Event model with related fields using SLUGS instead of IDs.
    """
    slug = serializers.ReadOnlyField()
    featured_image = serializers.SerializerMethodField()

    # ✅ Allow Saving Related ManyToMany Fields (Using Slugs)
    related_universities = serializers.SlugRelatedField(
        queryset=University.objects.all(),
        many=True,
        slug_field="slug",
        required=False
    )
    related_consultancies = serializers.SlugRelatedField(
        queryset=Consultancy.objects.all(),
        many=True,
        slug_field="slug",
        required=False
    )
    targeted_destinations = serializers.SlugRelatedField(
        queryset=Destination.objects.all(),
        many=True,
        slug_field="slug",
        required=False
    )

    # ✅ Organizer Handling (Using Slugs)
    organizer_slug = serializers.CharField(required=False, allow_null=True, write_only=True)
    organizer_type = serializers.ChoiceField(
        choices=["university", "consultancy"], required=False, write_only=True
    )
    organizer = serializers.SerializerMethodField()

    # ✅ New: registration_link field (will be handled automatically)
    registration_link = serializers.URLField(required=False, allow_null=True)

    class Meta:
        model = Event
        fields = '__all__'

    def get_featured_image(self, obj):
        """Returns full URL for the featured image."""
        request = self.context.get('request')
        return request.build_absolute_uri(obj.featured_image.url) if obj.featured_image else None

    def get_organizer(self, obj):
        """Returns organizer details dynamically based on type using SLUG instead of ID."""
        if obj.organizer:
            org_type = "university" if isinstance(obj.organizer, University) else "consultancy"
            return {
                "slug": obj.organizer.slug,
                "name": obj.organizer.name,
                "type": org_type
            }
        return None

    def to_representation(self, instance):
        """Customize the output format for related fields & organizer using SLUGS."""
        data = super().to_representation(instance)

        # ✅ Format related_universities
        data["related_universities"] = [
            {"slug": uni.slug, "name": uni.name}
            for uni in instance.related_universities.all()
        ]

        # ✅ Format related_consultancies
        data["related_consultancies"] = [
            {"slug": cons.slug, "name": cons.name}
            for cons in instance.related_consultancies.all()
        ]

        # ✅ Format targeted_destinations
        data["targeted_destinations"] = [
            {"slug": dest.slug, "title": dest.title}
            for dest in instance.targeted_destinations.all()
        ]

        return data

    def create(self, validated_data):
        """
        Custom create method to handle ManyToMany relationships & dynamic organizer selection.
        """
        related_universities = validated_data.pop("related_universities", [])
        related_consultancies = validated_data.pop("related_consultancies", [])
        targeted_destinations = validated_data.pop("targeted_destinations", [])

        # ✅ Auto-assign organizer if consultancy user is logged in
        request = self.context.get('request')
        if request and request.user.is_authenticated and hasattr(request.user, 'consultancy'):
            validated_data["organizer"] = request.user.consultancy
        else:
            # fallback to slug-based assignment for superadmin/university
            organizer_slug = validated_data.pop("organizer_slug", None)
            organizer_type = validated_data.pop("organizer_type", None)

            if organizer_slug and organizer_type == "university":
                try:
                    validated_data["organizer"] = University.objects.get(slug=organizer_slug)
                except University.DoesNotExist:
                    raise serializers.ValidationError({"organizer_slug": "University with that slug not found"})
            elif organizer_slug and organizer_type == "consultancy":
                try:
                    validated_data["organizer"] = Consultancy.objects.get(slug=organizer_slug)
                except Consultancy.DoesNotExist:
                    raise serializers.ValidationError({"organizer_slug": "Consultancy with that slug not found"})
            else:
                validated_data["organizer"] = None

        # ✅ Save Event
        event = Event.objects.create(**validated_data)

        # ✅ Assign ManyToMany Fields
        event.related_universities.set(related_universities)
        event.related_consultancies.set(related_consultancies)
        event.targeted_destinations.set(targeted_destinations)

        return event

    def update(self, instance, validated_data):
        """
        Custom update method to handle ManyToMany updates & dynamic organizer selection.
        """
        related_universities = validated_data.pop("related_universities", None)
        related_consultancies = validated_data.pop("related_consultancies", None)
        targeted_destinations = validated_data.pop("targeted_destinations", None)

        # ✅ Auto-assign organizer if consultancy user is logged in
        request = self.context.get('request')
        if request and request.user.is_authenticated and hasattr(request.user, 'consultancy'):
            instance.organizer = request.user.consultancy
        else:
            organizer_slug = validated_data.pop("organizer_slug", None)
            organizer_type = validated_data.pop("organizer_type", None)

            if organizer_slug and organizer_type == "university":
                try:
                    instance.organizer = University.objects.get(slug=organizer_slug)
                except University.DoesNotExist:
                    raise serializers.ValidationError({"organizer_slug": "University with that slug not found"})
            elif organizer_slug and organizer_type == "consultancy":
                try:
                    instance.organizer = Consultancy.objects.get(slug=organizer_slug)
                except Consultancy.DoesNotExist:
                    raise serializers.ValidationError({"organizer_slug": "Consultancy with that slug not found"})
            else:
                instance.organizer = None

        # ✅ Update Normal Fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        # ✅ Update ManyToMany Fields (Only if provided)
        if related_universities is not None:
            instance.related_universities.set(related_universities)
        if related_consultancies is not None:
            instance.related_consultancies.set(related_consultancies)
        if targeted_destinations is not None:
            instance.targeted_destinations.set(targeted_destinations)

        return instance
