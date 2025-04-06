from django.utils.timezone import now
from rest_framework.decorators import api_view, permission_classes
from django.contrib.contenttypes.models import ContentType
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny  # ✅ Import AllowAny
from rest_framework.views import APIView
from django.db.models import Q
from .reviews import Review
from .models import District, Discipline, Ad, SiteSetting
from .serializers import ReviewSerializer, DistrictSerializer, DisciplineSerializer, SiteSettingSerializer, AdSerializer
from .filters import ReviewFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.conf import settings
from .pagination import StandardResultsSetPagination
from core.serializers import DistrictMinimalSerializer


# ✅ Import Consultancy, University, and Course models
from consultancy.models import Consultancy
from university.models import University
from college.models import College
from course.models import Course
from destination.models import Destination
from exam.models import Exam

# For Search Algorith

from core.utils.levenshtein import levenshtein_distance




# ✅ API for Fetching All Districts (paginated)
class DistrictListAPIView(generics.ListAPIView):
    queryset = District.objects.all().order_by("name")
    serializer_class = DistrictSerializer
    permission_classes = [permissions.AllowAny]
    renderer_classes = [JSONRenderer]
    pagination_class = StandardResultsSetPagination  # ✅ ADD THIS
    
    def get_queryset(self):
        queryset = District.objects.all().order_by("name")
        search_query = self.request.GET.get("search")

        if search_query:
            queryset = queryset.filter(name__icontains=search_query)

        return queryset


class DisciplineListAPIView(generics.ListAPIView):
    serializer_class = DisciplineSerializer
    permission_classes = [permissions.AllowAny]
    renderer_classes = [JSONRenderer]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = Discipline.objects.all().order_by("name")
        search_query = self.request.GET.get("search")

        if search_query:
            queryset = queryset.filter(name__icontains=search_query)

        return queryset



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






# GlobalSearchAPI

class GlobalSearchAPIView(APIView):
    permission_classes = [AllowAny]
    renderer_classes = [JSONRenderer]

    def get(self, request):
        query = request.GET.get("query", "").strip()
        if not query:
            return Response({"results": []})

        def get_full_url(image_path):
            if image_path:
                return request.build_absolute_uri(settings.MEDIA_URL + image_path)
            return None

        def search_all(q):
            consultancies = Consultancy.objects.filter(
                Q(name__icontains=q) | Q(about__icontains=q)
            ).values("id", "name", "slug", "logo", "address")
            for item in consultancies:
                item["logo"] = get_full_url(item["logo"])

            universities = University.objects.filter(
                Q(name__icontains=q) | Q(about__icontains=q)
            ).values("id", "name", "slug", "logo", "country")
            for item in universities:
                item["logo"] = get_full_url(item["logo"])

            colleges = College.objects.filter(
                Q(name__icontains=q) | Q(about__icontains=q)
            ).values("id", "name", "slug", "logo", "address")
            for item in colleges:
                item["logo"] = get_full_url(item["logo"])

            courses = Course.objects.filter(
                Q(name__icontains=q) | Q(short_description__icontains=q)
            ).select_related("university").values(
                "id", "name", "slug", "cover_image", "university__name"
            )
            for item in courses:
                item["cover_image"] = get_full_url(item["cover_image"])
                item["university"] = {"name": item.pop("university__name", None)}

            destinations = Destination.objects.filter(
                Q(title__icontains=q) | Q(why_choose__icontains=q)
            ).values("id", "title", "slug", "country_logo")
            for item in destinations:
                item["country_logo"] = get_full_url(item["country_logo"])

            exams = Exam.objects.filter(
                Q(name__icontains=q) | Q(short_description__icontains=q)
            ).values("id", "name", "slug", "icon", "type")
            for item in exams:
                item["icon"] = get_full_url(item["icon"])

            return {
                "consultancies": list(consultancies),
                "universities": list(universities),
                "colleges": list(colleges),
                "courses": list(courses),
                "destinations": list(destinations),
                "exams": list(exams),
            }

        # ✅ Initial Search
        results = search_all(query)

        # ✅ Calculate most relevant section based on minimum distance
        top_result = None
        lowest_distance = float("inf")

        section_terms = {
            "consultancies": Consultancy.objects.values_list("name", flat=True),
            "universities": University.objects.values_list("name", flat=True),
            "colleges": College.objects.values_list("name", flat=True),
            "courses": Course.objects.values_list("name", flat=True),
            "destinations": Destination.objects.values_list("title", flat=True),
            "exams": Exam.objects.values_list("name", flat=True),
        }

        for section, terms in section_terms.items():
            for word in terms:
                dist = levenshtein_distance(query.lower(), word.lower())
                if dist < lowest_distance:
                    lowest_distance = dist
                    top_result = section

        # ✅ Suggest closest match if no results
        if all(len(v) == 0 for v in results.values()):
            dictionary = []
            for terms in section_terms.values():
                dictionary.extend(terms)

            best_match = None
            lowest_distance = float("inf")

            for word in dictionary:
                distance = levenshtein_distance(query.lower(), word.lower())
                if distance < lowest_distance:
                    lowest_distance = distance
                    best_match = word

            if best_match and lowest_distance <= 2:
                corrected_results = search_all(best_match)

                # Recalculate top result from suggestion
                corrected_top_result = None
                min_dist = float("inf")
                for section, terms in section_terms.items():
                    for word in terms:
                        d = levenshtein_distance(best_match.lower(), word.lower())
                        if d < min_dist:
                            min_dist = d
                            corrected_top_result = section

                return Response({
                    "results": corrected_results,
                    "suggestion": best_match,
                    "top_result": corrected_top_result
                })

        # ✅ Default return with real results and best-matching section
        return Response({
            "results": results,
            "top_result": top_result
        })



# ✅ Create District
class DistrictCreateAPIView(generics.CreateAPIView):
    queryset = District.objects.all()
    serializer_class = DistrictSerializer
    permission_classes = [IsAdminUser]
    renderer_classes = [JSONRenderer]

# ✅ Update District
class DistrictUpdateAPIView(generics.UpdateAPIView):
    queryset = District.objects.all()
    serializer_class = DistrictSerializer
    permission_classes = [IsAdminUser]
    renderer_classes = [JSONRenderer]

# ✅ Delete District
class DistrictDeleteAPIView(generics.DestroyAPIView):
    queryset = District.objects.all()
    serializer_class = DistrictSerializer
    permission_classes = [IsAdminUser]
    renderer_classes = [JSONRenderer]

# ✅ Create Discipline
class DisciplineCreateAPIView(generics.CreateAPIView):
    queryset = Discipline.objects.all()
    serializer_class = DisciplineSerializer
    permission_classes = [IsAdminUser]
    renderer_classes = [JSONRenderer]

# ✅ Update Discipline
class DisciplineUpdateAPIView(generics.UpdateAPIView):
    queryset = Discipline.objects.all()
    serializer_class = DisciplineSerializer
    permission_classes = [IsAdminUser]
    renderer_classes = [JSONRenderer]

# ✅ Delete Discipline
class DisciplineDeleteAPIView(generics.DestroyAPIView):
    queryset = Discipline.objects.all()
    serializer_class = DisciplineSerializer
    permission_classes = [IsAdminUser]
    renderer_classes = [JSONRenderer]

# ✅ Admin API: Paginated, Searchable Ad List
class AdAdminListAPIView(generics.ListAPIView):
    serializer_class = AdSerializer
    permission_classes = [IsAdminUser]
    renderer_classes = [JSONRenderer]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = Ad.objects.all().order_by("-updated_at")
        search_query = self.request.GET.get("search")
        if search_query:
            queryset = queryset.filter(title__icontains=search_query)
        return queryset


# ✅ Admin API: Create Advertisement
class AdCreateAPIView(generics.CreateAPIView):
    queryset = Ad.objects.all()
    serializer_class = AdSerializer
    permission_classes = [IsAdminUser]
    renderer_classes = [JSONRenderer]


# ✅ Admin API: Update Advertisement
class AdUpdateAPIView(generics.UpdateAPIView):
    queryset = Ad.objects.all()
    serializer_class = AdSerializer
    permission_classes = [IsAdminUser]
    renderer_classes = [JSONRenderer]


# ✅ Admin API: Delete Advertisement
class AdDeleteAPIView(generics.DestroyAPIView):
    queryset = Ad.objects.all()
    serializer_class = AdSerializer
    permission_classes = [IsAdminUser]
    renderer_classes = [JSONRenderer]


# For Minimal Fetch
@api_view(['GET'])
@permission_classes([AllowAny])
def district_dropdown_list(request):
    """Returns minimal list of districts for dropdowns (id + name)."""
    search = request.GET.get('search', '')
    districts = District.objects.filter(name__icontains=search).order_by('name')
    serializer = DistrictMinimalSerializer(districts, many=True)
    return Response(serializer.data)