from django.db.models import F
from django.utils.timezone import now
from rest_framework import generics, status
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from core.pagination import StandardResultsSetPagination
from core.filters import EventFilter
from .models import Event
from university.models import University
from consultancy.models import Consultancy
from destination.models import Destination
from .serializers import EventSerializer


# ✅ List Events with Pagination, Search, and Filtering (Public Access)
class EventListView(generics.ListAPIView):
    serializer_class = EventSerializer
    permission_classes = []  # ✅ Publicly accessible
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_class = EventFilter
    search_fields = ['name', 'event_type', 'registration_type', 'location']

    def get_queryset(self):
        return Event.objects.all().order_by(F('priority').asc(nulls_last=True), '-date', '-id')


# ✅ List Active (Future) Events
@api_view(['GET'])
@permission_classes([])  # ✅ Public access
def active_events(request):
    today = now().date()
    events = Event.objects.filter(date__gte=today).order_by(F('priority').asc(nulls_last=True), 'date')
    serializer = EventSerializer(events, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


# ✅ List All Events (No Pagination) - For Dropdowns
@api_view(['GET'])
@permission_classes([])  # ✅ Public access
def all_events(request):
    events = Event.objects.all().order_by('-date')
    serializer = EventSerializer(events, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


# ✅ Create Event (Using Slugs Instead of IDs)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
@permission_classes([])  # ✅ Public access
def create_event(request):
    data = request.data.copy()

    # ✅ Extract ManyToMany Fields (Expecting slugs)
    related_universities_slugs = data.pop("related_universities", [])
    related_consultancies_slugs = data.pop("related_consultancies", [])
    targeted_destinations_slugs = data.pop("targeted_destinations", [])

    # ✅ Handle Organizer Using Slug
    organizer_slug = data.pop("organizer_slug", None)
    organizer_type = data.pop("organizer_type", None)

    serializer = EventSerializer(data=data, context={'request': request})
    if serializer.is_valid():
        event = serializer.save()

        # ✅ Save ManyToMany Relationships Using Slugs
        event.related_universities.set(University.objects.filter(slug__in=related_universities_slugs))
        event.related_consultancies.set(Consultancy.objects.filter(slug__in=related_consultancies_slugs))
        event.targeted_destinations.set(Destination.objects.filter(slug__in=targeted_destinations_slugs))

        # ✅ Assign Organizer
        if organizer_slug and organizer_type == "university":
            event.organizer = University.objects.filter(slug=organizer_slug).first()
        elif organizer_slug and organizer_type == "consultancy":
            event.organizer = Consultancy.objects.filter(slug=organizer_slug).first()
        event.save()

        return Response(EventSerializer(event, context={'request': request}).data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ Get Single Event by Slug (Public Access)
@api_view(['GET'])
@permission_classes([])  # ✅ Public access
def get_event(request, slug):
    try:
        event = Event.objects.prefetch_related("related_universities", "related_consultancies", "targeted_destinations").get(slug__iexact=slug)
        serializer = EventSerializer(event, context={'request': request})
        return Response(serializer.data)
    except Event.DoesNotExist:
        return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)


# ✅ Update Event (Using Slugs Instead of IDs)
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def update_event(request, slug):
    try:
        event = Event.objects.get(slug=slug)
        data = request.data.copy()

        # ✅ Extract ManyToMany Fields (Expecting slugs)
        related_universities_slugs = data.pop("related_universities", [])
        related_consultancies_slugs = data.pop("related_consultancies", [])
        targeted_destinations_slugs = data.pop("targeted_destinations", [])

        # ✅ Handle Organizer Using Slug
        organizer_slug = data.pop("organizer_slug", None)
        organizer_type = data.pop("organizer_type", None)

        serializer = EventSerializer(event, data=data, partial=True, context={'request': request})

        if serializer.is_valid():
            event = serializer.save()

            # ✅ Save ManyToMany Relationships Using Slugs
            if related_universities_slugs:
                event.related_universities.set(University.objects.filter(slug__in=related_universities_slugs))
            if related_consultancies_slugs:
                event.related_consultancies.set(Consultancy.objects.filter(slug__in=related_consultancies_slugs))
            if targeted_destinations_slugs:
                event.targeted_destinations.set(Destination.objects.filter(slug__in=targeted_destinations_slugs))

            # ✅ Assign Organizer
            if organizer_slug and organizer_type == "university":
                event.organizer = University.objects.filter(slug=organizer_slug).first()
            elif organizer_slug and organizer_type == "consultancy":
                event.organizer = Consultancy.objects.filter(slug=organizer_slug).first()
            event.save()

            return Response(EventSerializer(event, context={'request': request}).data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Event.DoesNotExist:
        return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)


# ✅ Delete Event (Now Publicly Accessible)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@permission_classes([])  # ✅ Public access
def delete_event(request, slug):
    try:
        event = Event.objects.get(slug=slug)
        event.delete()
        return Response({"message": "Event deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

    except Event.DoesNotExist:
        return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)
