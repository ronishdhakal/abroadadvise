from rest_framework import generics, permissions
from rest_framework.renderers import JSONRenderer  # ✅ Ensure API returns JSON
from django.utils.timezone import now
from django.contrib.contenttypes.models import ContentType
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .reviews import Review
from .serializers import ReviewSerializer
from .filters import ReviewFilter  # ✅ Import the Review filter
from django_filters.rest_framework import DjangoFilterBackend
from .models import District
from .serializers import DistrictSerializer

# ✅ API for Fetching All Districts
class DistrictListAPIView(generics.ListAPIView):
    queryset = District.objects.all().order_by("name")  # Sort alphabetically
    serializer_class = DistrictSerializer
    permission_classes = [permissions.AllowAny]  # Public access
    renderer_classes = [JSONRenderer]  # Ensure JSON response


# ✅ API for Users to Submit Reviews
class ReviewCreateAPIView(generics.CreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]  # Only logged-in users can submit reviews
    renderer_classes = [JSONRenderer]  # ✅ Ensure JSON response

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  # Assign user automatically

# ✅ API for Viewing Approved Reviews
class ReviewListAPIView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]  # Public access
    queryset = Review.objects.filter(is_approved=True)  # Show only approved reviews

    # ✅ Enable filtering using ReviewFilter
    filter_backends = [DjangoFilterBackend]
    filterset_class = ReviewFilter
    renderer_classes = [JSONRenderer]  # ✅ Force API to return JSON instead of a template

# ✅ API for Admin to Approve/Delete Reviews
class ReviewModerationAPIView(generics.UpdateAPIView, generics.DestroyAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAdminUser]  # Only admins can moderate
    renderer_classes = [JSONRenderer]  # ✅ Ensure JSON response

    def get_queryset(self):
        return Review.objects.all()  # Admin can see all reviews

    def patch(self, request, *args, **kwargs):
        review = self.get_object()
        review.is_approved = True  # Approve review
        review.save()
        return Response({"message": "Review approved!"})

# ✅ API for Universities/Consultancies to Reply to Reviews
class ReviewReplyAPIView(generics.UpdateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]  # Only authenticated users
    queryset = Review.objects.all()
    renderer_classes = [JSONRenderer]  # ✅ Ensure JSON response

    def patch(self, request, *args, **kwargs):
        review = self.get_object()

        # ✅ Only allow admins, universities, and consultancies to reply
        if not request.user.is_staff:
            return Response({"error": "Only administrators, universities, and consultancies can reply to reviews."}, status=403)

        # ✅ Update review with reply
        review.reply_text = request.data.get("reply_text", "").strip()
        review.replied_by = request.user
        review.replied_at = now()
        review.save()

        return Response({"message": "Reply added successfully!"})
