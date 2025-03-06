from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import PermissionDenied
from django.views.decorators.http import require_http_methods
from .models import Consultancy
import json

@login_required
@csrf_exempt
def consultancy_dashboard(request):
    """
    Fetch consultancy details including profile, inquiries, and events.
    """
    if request.method == "GET":
        user = request.user
        consultancy = get_object_or_404(Consultancy, user=user)
        inquiries = consultancy.inquiry_set.all()
        events = consultancy.event_set.all()

        response_data = {
            "consultancy": {
                "name": consultancy.name,
                "slug": consultancy.slug,
                "logo": consultancy.logo.url if consultancy.logo else None,
                "cover_photo": consultancy.cover_photo.url if consultancy.cover_photo else None,
                "brochure": consultancy.brochure.url if consultancy.brochure else None,
                "address": consultancy.address,
                "latitude": consultancy.latitude,
                "longitude": consultancy.longitude,
                "establishment_date": consultancy.establishment_date,
                "website": consultancy.website,
                "branches": consultancy.branches,
                "email": consultancy.email,
                "phone": consultancy.phone,
                "moe_certified": consultancy.moe_certified,
                "about": consultancy.about,
                "study_abroad_destinations": list(consultancy.study_abroad_destinations.values("id", "title")),
                "test_preparation": list(consultancy.test_preparation.values("id", "name")),
                "partner_universities": list(consultancy.partner_universities.values("id", "name")),
            },
            "inquiries": [
                {
                    "id": inquiry.id,
                    "name": inquiry.name,
                    "email": inquiry.email,
                    "message": inquiry.message,
                    "date": inquiry.created_at,
                }
                for inquiry in inquiries
            ],
            "events": [
                {
                    "id": event.id,
                    "name": event.name,
                    "date": event.date,
                    "type": event.event_type,
                }
                for event in events
            ],
        }
        return JsonResponse(response_data)

    return JsonResponse({"error": "Invalid request method"}, status=400)

@login_required
@csrf_exempt
@require_http_methods(["PUT", "PATCH"])
def update_consultancy_profile(request):
    """
    Allow consultancies to update their profile details.
    """
    user = request.user
    consultancy = get_object_or_404(Consultancy, user=user)

    try:
        data = json.loads(request.body.decode("utf-8"))

        # Update fields based on provided data
        consultancy.name = data.get("name", consultancy.name)
        consultancy.slug = data.get("slug", consultancy.slug)
        consultancy.address = data.get("address", consultancy.address)
        consultancy.latitude = data.get("latitude", consultancy.latitude)
        consultancy.longitude = data.get("longitude", consultancy.longitude)
        consultancy.establishment_date = data.get("establishment_date", consultancy.establishment_date)
        consultancy.website = data.get("website", consultancy.website)
        consultancy.branches = data.get("branches", consultancy.branches)
        consultancy.email = data.get("email", consultancy.email)
        consultancy.phone = data.get("phone", consultancy.phone)
        consultancy.moe_certified = data.get("moe_certified", consultancy.moe_certified)
        consultancy.about = data.get("about", consultancy.about)

        # Handle Many-to-Many fields (destinations, test preparation, universities)
        if "study_abroad_destinations" in data:
            consultancy.study_abroad_destinations.set(data["study_abroad_destinations"])
        if "test_preparation" in data:
            consultancy.test_preparation.set(data["test_preparation"])
        if "partner_universities" in data:
            consultancy.partner_universities.set(data["partner_universities"])

        consultancy.save()

        return JsonResponse({"message": "Profile updated successfully"})

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON data"}, status=400)
    except PermissionDenied:
        return JsonResponse({"error": "You don't have permission to update this profile"}, status=403)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
