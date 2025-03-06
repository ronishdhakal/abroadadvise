from rest_framework import serializers
from .models import Exam
from consultancy.models import Consultancy  # Import Consultancy for related field

class ExamSerializer(serializers.ModelSerializer):
    slug = serializers.ReadOnlyField()
    icon = serializers.ImageField(required=False)
    
    # ✅ Serialize related preparation classes
    preparation_classes = serializers.SerializerMethodField()
    
    # ✅ Serialize related similar exams
    similar_exams = serializers.SerializerMethodField()

    class Meta:
        model = Exam
        fields = '__all__'

    def get_preparation_classes(self, obj):
        """Retrieve preparation classes with name & slug."""
        return [{"name": cons.name, "slug": cons.slug} for cons in obj.preparation_classes.all()]

    def get_similar_exams(self, obj):
        """Retrieve similar exams with name & slug."""
        return [{"name": exam.name, "slug": exam.slug} for exam in obj.similar_exams.all()]
