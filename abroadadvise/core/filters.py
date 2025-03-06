import django_filters  # ✅ Fix NameError
from django_filters import rest_framework as filters
from consultancy.models import Consultancy
from university.models import University
from course.models import Course
from destination.models import Destination
from exam.models import Exam
from event.models import Event
from news.models import News
from django.apps import apps  # ✅ Import get_model() to avoid circular imports

class ConsultancyFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(lookup_expr='icontains')
    district = django_filters.CharFilter(lookup_expr='icontains')
    moe_certified = django_filters.BooleanFilter()
    
    # ✅ Fix filtering by destination (ManyToManyField)
    destination = django_filters.CharFilter(method='filter_by_destination')

    def filter_by_destination(self, queryset, name, value):
        return queryset.filter(study_abroad_destinations__title__icontains=value)

    # ✅ Fix filtering by exam (ManyToManyField)
    exam = django_filters.CharFilter(method='filter_by_exam')

    def filter_by_exam(self, queryset, name, value):
        return queryset.filter(test_preparation__name__icontains=value)

    class Meta:
        model = Consultancy
        fields = ['name', 'district', 'moe_certified', 'destination', 'exam']

class UniversityFilter(filters.FilterSet):
    name = filters.CharFilter(lookup_expr='icontains')
    country = filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = University
        fields = ['name', 'country']

class CourseFilter(filters.FilterSet):
    name = filters.CharFilter(lookup_expr='icontains')
    country = filters.CharFilter(lookup_expr='icontains')
    university = filters.CharFilter(field_name='university__name', lookup_expr='icontains')
    duration = filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Course
        fields = ['name', 'country', 'university', 'duration']

class DestinationFilter(filters.FilterSet):
    title = filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Destination
        fields = ['title']

class ExamFilter(filters.FilterSet):
    name = filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Exam
        fields = ['name']

class EventFilter(filters.FilterSet):
    name = filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Event
        fields = ['name']

class NewsFilter(filters.FilterSet):
    title = filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = News
        fields = ['title']

# ✅ New: Filter for Reviews
class ReviewFilter(filters.FilterSet):
    rating = filters.NumberFilter()
    content_type = filters.CharFilter(field_name="content_type__model", lookup_expr="icontains")
    is_approved = filters.BooleanFilter()

    class Meta:
        model = apps.get_model('core', 'Review')  # ✅ Avoid direct import to fix circular import issue
        fields = ['rating', 'content_type', 'is_approved']