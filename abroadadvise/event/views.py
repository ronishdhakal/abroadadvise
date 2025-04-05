from django.db.models import F
from django.utils.timezone import now
from rest_framework import generics, status
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
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
import json
from django.core.exceptions import ValidationError
from .pagination import EventPagination
from django.db.models.functions import Coalesce
from django.db.models import Value, IntegerField


class EventListView(generics.ListAPIView):
    serializer_class = EventSerializer
    pagination_class = EventPagination
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_class = EventFilter
    search_fields = ['name', 'event_type', 'registration_type', 'location']

    def get_queryset(self):
        return Event.objects.annotate(
            priority_order=Coalesce('priority', Value(9999, output_field=IntegerField()))
        ).order_by(
            'priority_order',
            '-date',
            '-id'
        )


@api_view(['GET'])
@permission_classes([])  # Public access
def active_events(request):
    today = now().date()
    events = Event.objects.filter(date__gte=today).order_by(F('priority').asc(nulls_last=True), 'date')
    serializer = EventSerializer(events, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([])  # Public access
def all_events(request):
    events = Event.objects.all().order_by('-date')
    serializer = EventSerializer(events, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def create_event(request):
    data = request.data

    try:
        related_universities_slugs = json.loads(data.pop("related_universities", "[]")[0])
        related_consultancies_slugs = json.loads(data.pop("related_consultancies", "[]")[0])
        targeted_destinations_slugs = json.loads(data.pop("targeted_destinations", "[]")[0])
    except (json.JSONDecodeError, IndexError) as e:
        return Response({"error": "Invalid JSON format for ManyToMany fields", "details": str(e)},
                        status=status.HTTP_400_BAD_REQUEST)

    # Fallback only if user is NOT a consultancy
    is_consultancy_user = hasattr(request.user, 'consultancy')
    if not is_consultancy_user:
        organizer_slug = data.pop("organizer_slug", [None])[0]
        organizer_type = data.pop("organizer_type", [None])[0]
    else:
        organizer_slug = None
        organizer_type = None

    serializer = EventSerializer(data=data, context={'request': request})
    if serializer.is_valid():
        event = serializer.save()

        try:
            event.related_universities.set(University.objects.filter(slug__in=related_universities_slugs))
            event.related_consultancies.set(Consultancy.objects.filter(slug__in=related_consultancies_slugs))
            event.targeted_destinations.set(Destination.objects.filter(slug__in=targeted_destinations_slugs))
        except Exception as e:
            return Response({"error": "Invalid slug in ManyToMany fields", "details": str(e)},
                            status=status.HTTP_400_BAD_REQUEST)

        # Only assign organizer if not already set (superadmin/university case)
        if organizer_slug and organizer_type == "university":
            try:
                event.organizer = University.objects.get(slug=organizer_slug)
            except University.DoesNotExist:
                return Response({"error": "University with that slug not found"}, status=status.HTTP_400_BAD_REQUEST)
        elif organizer_slug and organizer_type == "consultancy":
            try:
                event.organizer = Consultancy.objects.get(slug=organizer_slug)
            except Consultancy.DoesNotExist:
                return Response({"error": "Consultancy with that slug not found"}, status=status.HTTP_400_BAD_REQUEST)

        event.save()
        return Response(EventSerializer(event, context={'request': request}).data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([])  # Public access
def get_event(request, slug):
    try:
        event = Event.objects.prefetch_related(
            "related_universities", "related_consultancies", "targeted_destinations"
        ).get(slug__iexact=slug)
        serializer = EventSerializer(event, context={'request': request})
        return Response(serializer.data)
    except Event.DoesNotExist:
        return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated, IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def update_event(request, slug):
    try:
        event = Event.objects.get(slug=slug)

        # Restrict consultancy users from updating other consultancies' events
        if hasattr(request.user, 'consultancy'):
            if event.organizer != request.user.consultancy:
                return Response({"error": "You do not have permission to update this event."},
                                status=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()

        try:
            related_universities_slugs = json.loads(data.pop("related_universities", "[]")[0])
            related_consultancies_slugs = json.loads(data.pop("related_consultancies", "[]")[0])
            targeted_destinations_slugs = json.loads(data.pop("targeted_destinations", "[]")[0])
        except (json.JSONDecodeError, IndexError) as e:
            return Response({"error": "Invalid JSON format for ManyToMany fields", "details": str(e)},
                            status=status.HTTP_400_BAD_REQUEST)

        organizer_slug = data.pop("organizer_slug", [None])[0]
        organizer_type = data.pop("organizer_type", [None])[0]

        serializer = EventSerializer(event, data=data, partial=True, context={'request': request})
        if serializer.is_valid():
            event = serializer.save()

            try:
                if related_universities_slugs:
                    event.related_universities.set(University.objects.filter(slug__in=related_universities_slugs))
                if related_consultancies_slugs:
                    event.related_consultancies.set(Consultancy.objects.filter(slug__in=related_consultancies_slugs))
                if targeted_destinations_slugs:
                    event.targeted_destinations.set(Destination.objects.filter(slug__in=targeted_destinations_slugs))
            except Exception as e:
                return Response({"error": "Invalid slug in ManyToMany fields", "details": str(e)},
                                status=status.HTTP_400_BAD_REQUEST)

            # Only allow changing organizer if user is NOT a consultancy
            if not hasattr(request.user, 'consultancy'):
                if organizer_slug and organizer_type == "university":
                    try:
                        event.organizer = University.objects.get(slug=organizer_slug)
                    except University.DoesNotExist:
                        return Response({"error": "University with that slug not found"},
                                        status=status.HTTP_400_BAD_REQUEST)
                elif organizer_slug and organizer_type == "consultancy":
                    try:
                        event.organizer = Consultancy.objects.get(slug=organizer_slug)
                    except Consultancy.DoesNotExist:
                        return Response({"error": "Consultancy with that slug not found"},
                                        status=status.HTTP_400_BAD_REQUEST)
                else:
                    event.organizer = None

            event.save()
            return Response(EventSerializer(event, context={'request': request}).data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Event.DoesNotExist:
        return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser])
def delete_event(request, slug):
    try:
        event = Event.objects.get(slug=slug)

        # Restrict consultancy users from deleting others' events
        if hasattr(request.user, 'consultancy'):
            if event.organizer != request.user.consultancy:
                return Response({"error": "You do not have permission to delete this event."},
                                status=status.HTTP_403_FORBIDDEN)

        event.delete()
        return Response({"message": "Event deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

    except Event.DoesNotExist:
        return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)
