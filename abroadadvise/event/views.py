from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from core.pagination import StandardResultsSetPagination
from core.filters import EventFilter
from authentication.permissions import IsAdminUser
from .models import Event, EventGallery, EventRegistration
from .serializers import EventSerializer, EventGallerySerializer, EventRegistrationSerializer

# ✅ List Events with Pagination, Search, and Filtering (Public Access)
class EventListView(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.AllowAny]  # Publicly accessible
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_class = EventFilter
    search_fields = ['name']

# ✅ Create Event (Admin Only)
@api_view(['POST'])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def create_event(request):
    serializer = EventSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Get Single Event by Slug (Public Access)
@api_view(['GET'])
@permission_classes([permissions.AllowAny])  # Publicly accessible
def get_event(request, slug):
    try:
        event = Event.objects.get(slug=slug)
        serializer = EventSerializer(event, context={'request': request})
        return Response(serializer.data)
    except Event.DoesNotExist:
        return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

# ✅ Update Event (Admin Only)
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def update_event(request, slug):
    try:
        event = Event.objects.get(slug=slug)
        serializer = EventSerializer(event, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Event.DoesNotExist:
        return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

# ✅ Delete Event (Admin Only)
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_event(request, slug):
    try:
        event = Event.objects.get(slug=slug)
        event.delete()
        return Response({"message": "Event deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except Event.DoesNotExist:
        return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

# ✅ Register for an Event (Free/Paid)
@api_view(['POST'])
@permission_classes([permissions.AllowAny])  # Publicly accessible
def register_for_event(request):
    serializer = EventRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        event = serializer.validated_data["event"]

        # ✅ Automatically mark free events as "Paid"
        if event.registration_type == "free":
            serializer.save(payment_status="paid")
        else:
            serializer.save(payment_status="pending")  # Paid event requires manual processing

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)