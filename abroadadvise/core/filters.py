import django_filters
from django_filters import rest_framework as filters
from consultancy.models import Consultancy
from university.models import University
from course.models import Course
from destination.models import Destination
from exam.models import Exam
from event.models import Event
from news.models import News
from django.apps import apps  # ✅ Avoid circular imports
from core.models import District


class ConsultancyFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(lookup_expr="icontains")
    moe_certified = django_filters.BooleanFilter()

    # ✅ Fix district filtering (ManyToManyField)
    districts = django_filters.ModelMultipleChoiceFilter(
        field_name="districts__id",
        queryset=District.objects.all(),  # ✅ Fixed: Using District Model
        to_field_name="id",
    )

    # ✅ Fix filtering by destination (Now uses slug instead of ID)
    destination = django_filters.ModelMultipleChoiceFilter(
        field_name="study_abroad_destinations__slug",  # ✅ Now filters by slug
        queryset=Destination.objects.all(),
        to_field_name="slug",
    )

    # ✅ Fix filtering by exam (Now uses slug instead of ID)
    exam = django_filters.ModelMultipleChoiceFilter(
        field_name="test_preparation__slug",  # ✅ Now filters by slug
        queryset=Exam.objects.all(),
        to_field_name="slug",
    )

    class Meta:
        model = Consultancy
        fields = ["name", "districts", "moe_certified", "destination", "exam"]  # ✅ Fixed Indentation


class UniversityFilter(filters.FilterSet):
    name = filters.CharFilter(lookup_expr="icontains")
    country = filters.CharFilter(lookup_expr="icontains")

    class Meta:
        model = University
        fields = ["name", "country"]


class CourseFilter(filters.FilterSet):
    name = filters.CharFilter(lookup_expr="icontains")
    university = filters.CharFilter(field_name="university__slug", lookup_expr="iexact")  # ✅ Use slug instead of name

    class Meta:
        model = Course
        fields = ["name", "university", "duration"]



class DestinationFilter(filters.FilterSet):
    title = filters.CharFilter(lookup_expr="icontains")

    class Meta:
        model = Destination
        fields = ["title"]


class ExamFilter(filters.FilterSet):
    name = filters.CharFilter(lookup_expr="icontains")

    class Meta:
        model = Exam
        fields = ["name"]


class EventFilter(filters.FilterSet):
    name = filters.CharFilter(lookup_expr="icontains")

    class Meta:
        model = Event
        fields = ["name"]


class NewsFilter(filters.FilterSet):
    title = filters.CharFilter(lookup_expr="icontains")

    class Meta:
        model = News
        fields = ["title"]


# ✅ New: Filter for Reviews
class ReviewFilter(filters.FilterSet):
    rating = filters.NumberFilter()
    content_type = filters.CharFilter(field_name="content_type__model", lookup_expr="icontains")
    is_approved = filters.BooleanFilter()

    class Meta:
        model = apps.get_model("core", "Review")  # ✅ Avoid direct import to fix circular import issue
        fields = ["rating", "content_type", "is_approved"]
