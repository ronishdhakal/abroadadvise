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
from core.models import District, Discipline  # ✅ Import Discipline


class ConsultancyFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(lookup_expr="icontains")
    moe_certified = django_filters.BooleanFilter()

    # ✅ Fix district filtering (ManyToManyField)
    districts = django_filters.ModelMultipleChoiceFilter(
        field_name="districts__id",
        queryset=District.objects.all(),
        to_field_name="id",
    )

    # ✅ Fix filtering by destination (Now uses slug instead of ID)
    destination = django_filters.ModelMultipleChoiceFilter(
        field_name="study_abroad_destinations__slug",
        queryset=Destination.objects.all(),
        to_field_name="slug",
    )

    # ✅ Fix filtering by exam (Now uses slug instead of ID)
    exam = django_filters.ModelMultipleChoiceFilter(
        field_name="test_preparation__slug",
        queryset=Exam.objects.all(),
        to_field_name="slug",
    )

    class Meta:
        model = Consultancy
        fields = ["name", "districts", "moe_certified", "destination", "exam"]


class UniversityFilter(filters.FilterSet):
    name = filters.CharFilter(lookup_expr="icontains")
    country = filters.CharFilter(lookup_expr="icontains")

    # ✅ New Filter: Filter Universities by Discipline (using slug)
    disciplines = django_filters.ModelMultipleChoiceFilter(
        field_name="disciplines__id",
        queryset=Discipline.objects.all(),
        to_field_name="id",
    )

    class Meta:
        model = University
        fields = ["name", "country", "disciplines"]


class CourseFilter(filters.FilterSet):
    name = filters.CharFilter(lookup_expr="icontains")
    university = filters.CharFilter(field_name="university__slug", lookup_expr="iexact")

    # ✅ Now filtering by discipline `id`
    disciplines = django_filters.ModelMultipleChoiceFilter(
        field_name="disciplines__id",
        queryset=Discipline.objects.all(),
        to_field_name="id",
    )

    # ✅ New: Filter courses by University Country
    country = filters.CharFilter(field_name="university__country", lookup_expr="iexact")

    class Meta:
        model = Course
        fields = ["name", "university", "duration", "disciplines", "country"]


class DestinationFilter(filters.FilterSet):
    title = filters.CharFilter(lookup_expr="icontains")

    class Meta:
        model = Destination
        fields = ["title"]


class ExamFilter(filters.FilterSet):
    name = filters.CharFilter(lookup_expr="icontains")

    # ✅ Added: Filter by Exam Type (english_proficiency or standardized_test)
    type = django_filters.ChoiceFilter(choices=Exam.EXAM_TYPE_CHOICES)

    class Meta:
        model = Exam
        fields = ["name", "type"]  # ✅ Now supports filtering by exam type


class EventFilter(filters.FilterSet):
    """
    Filters events by name, event type, registration type, and destination.
    """
    name = filters.CharFilter(lookup_expr="icontains")
    event_type = filters.ChoiceFilter(choices=Event.EVENT_TYPE_CHOICES)
    registration_type = filters.ChoiceFilter(choices=Event.REGISTRATION_TYPE_CHOICES)

    # ✅ Fix: Filter by destination (which represents the country)
    destination = filters.CharFilter(method="filter_by_destination")

    def filter_by_destination(self, queryset, name, value):
        """
        Filters events by the destination title or slug.
        """
        return queryset.filter(targeted_destinations__slug__iexact=value).distinct()

    class Meta:
        model = Event
        fields = ["name", "event_type", "registration_type", "destination"]


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
