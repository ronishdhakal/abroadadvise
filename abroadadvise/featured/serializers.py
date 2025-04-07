from rest_framework import serializers
from .models import FeaturedPage

class FeaturedPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeaturedPage
        fields = '__all__'  # or explicitly include 'destination'
        read_only_fields = ['created_at', 'updated_at']
