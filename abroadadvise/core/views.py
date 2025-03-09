from django.utils.timezone import now
from django.contrib.contenttypes.models import ContentType
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from .reviews import Review
from .models import District, Discipline, Ad, SiteSetting
from .serializers import ReviewSerializer, DistrictSerializer, DisciplineSerializer, SiteSettingSerializer, AdSerializer
from .filters import ReviewFilter
from django_filters.rest_framework import DjangoFilterBackend

# ✅ API for Fetching All Districts
class DistrictListAPIView(generics.ListAPIView):
    queryset = District.objects.all().order_by("name")
    serializer_class = DistrictSerializer
    permission_classes = [permissions.AllowAny]
    renderer_classes = [JSONRenderer]

# ✅ API for Fetching All Disciplines
class DisciplineListAPIView(generics.ListAPIView):
    queryset = Discipline.objects.all().order_by("name")
    serializer_class = DisciplineSerializer
    permission_classes = [permissions.AllowAny]
    renderer_classes = [JSONRenderer]

# ✅ API for Users to Submit Reviews
class ReviewCreateAPIView(generics.CreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]
    renderer_classes = [JSONRenderer]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# ✅ API for Viewing Approved Reviews
class ReviewListAPIView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Review.objects.filter(is_approved=True)
    filter_backends = [DjangoFilterBackend]
    filterset_class = ReviewFilter
    renderer_classes = [JSONRenderer]

# ✅ API for Admin to Approve/Delete Reviews
class ReviewModerationAPIView(generics.UpdateAPIView, generics.DestroyAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAdminUser]
    renderer_classes = [JSONRenderer]

    def get_queryset(self):
        return Review.objects.all()

    def patch(self, request, *args, **kwargs):
        review = self.get_object()
        review.is_approved = True
        review.save()
        return Response({"message": "Review approved!"})

# ✅ API for Universities/Consultancies to Reply to Reviews
class ReviewReplyAPIView(generics.UpdateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]
    queryset = Review.objects.all()
    renderer_classes = [JSONRenderer]

    def patch(self, request, *args, **kwargs):
        review = self.get_object()
        if not request.user.is_staff:
            return Response({"error": "Only administrators, universities, and consultancies can reply to reviews."}, status=403)

        review.reply_text = request.data.get("reply_text", "").strip()
        review.replied_by = request.user
        review.replied_at = now()
        review.save()
        return Response({"message": "Reply added successfully!"})

# ✅ API to Fetch Site Settings (Logo & Hero Image)
class SiteSettingAPIView(APIView):
    permission_classes = [permissions.AllowAny]
    renderer_classes = [JSONRenderer]

    def get(self, request, *args, **kwargs):
        site_setting = SiteSetting.objects.first()
        if not site_setting:
            return Response({"error": "No site settings found."}, status=404)

        serializer = SiteSettingSerializer(site_setting, context={"request": request})
        return Response(serializer.data)

# ✅ API to Fetch Active Ads Based on Placement
class AdListAPIView(generics.ListAPIView):
    serializer_class = AdSerializer
    permission_classes = [permissions.AllowAny]
    renderer_classes = [JSONRenderer]

    def get_queryset(self):
        placement = self.request.query_params.get('placement', None)
        queryset = Ad.objects.filter(is_active=True)

        if placement:
            queryset = queryset.filter(placement=placement)

        return queryset
