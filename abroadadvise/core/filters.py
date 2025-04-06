import django_filters
from django_filters import rest_framework as filters
from consultancy.models import Consultancy
from university.models import University
from course.models import Course
from destination.models import Destination
from exam.models import Exam
from event.models import Event
from news.models import News
from blog.models import BlogPost
from django.apps import apps
from core.models import District, Discipline
from college.models import College
from scholarship.models import Scholarship

class ConsultancyFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(lookup_expr="icontains")
    moe_certified = django_filters.BooleanFilter()

    districts = django_filters.ModelMultipleChoiceFilter(
        field_name="districts__id",
        queryset=District.objects.all(),
        to_field_name="id",
    )

    destination = django_filters.CharFilter(
        field_name="study_abroad_destinations__slug",
        lookup_expr="iexact",
    )

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

    disciplines = django_filters.ModelMultipleChoiceFilter(
        field_name="disciplines__id",
        queryset=Discipline.objects.all(),
        to_field_name="id",
    )

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
    type = django_filters.ChoiceFilter(choices=Exam.EXAM_TYPE_CHOICES)

    class Meta:
        model = Exam
        fields = ["name", "type"]

class EventFilter(filters.FilterSet):
    name = filters.CharFilter(lookup_expr="icontains")
    event_type = filters.ChoiceFilter(choices=Event.EVENT_TYPE_CHOICES)
    registration_type = filters.ChoiceFilter(choices=Event.REGISTRATION_TYPE_CHOICES)

    destination = filters.CharFilter(method="filter_by_destination")

    def filter_by_destination(self, queryset, name, value):
        return queryset.filter(targeted_destinations__slug__iexact=value).distinct()

    class Meta:
        model = Event
        fields = ["name", "event_type", "registration_type", "destination"]

class NewsFilter(filters.FilterSet):
    title = filters.CharFilter(field_name="title", lookup_expr="icontains")
    category = filters.CharFilter(field_name="category__slug", lookup_expr="iexact")

    class Meta:
        model = News
        fields = ["title", "category"]

class ReviewFilter(filters.FilterSet):
    rating = filters.NumberFilter()
    content_type = filters.CharFilter(field_name="content_type__model", lookup_expr="icontains")
    is_approved = filters.BooleanFilter()

    class Meta:
        model = apps.get_model("core", "Review")
        fields = ["rating", "content_type", "is_approved"]

class BlogPostFilter(filters.FilterSet):
    title = filters.CharFilter(field_name="title", lookup_expr="icontains")
    category = filters.CharFilter(field_name="category__slug", lookup_expr="iexact")

    class Meta:
        model = BlogPost
        fields = ["title", "category"]

class CollegeFilter(filters.FilterSet):
    name = django_filters.CharFilter(field_name="name", lookup_expr="icontains")

    destination = django_filters.CharFilter(
        field_name="study_abroad_destinations__slug",
        lookup_expr="iexact"
    )
    university = django_filters.CharFilter(
        field_name="affiliated_universities__slug",
        lookup_expr="iexact"
    )

    class Meta:
        model = College
        fields = ["name", "destination", "university"]

class ScholarshipFilter(filters.FilterSet):
    destination = filters.CharFilter(field_name="destination__slug", lookup_expr="iexact")
    study_level = filters.CharFilter(field_name="study_level", lookup_expr="iexact")

    class Meta:
        model = Scholarship
        fields = ["destination", "study_level"]