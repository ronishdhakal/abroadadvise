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
        print(f"🟢 Fetching consultancy for user: {user.email} (ID: {user.id})")  # ✅ Debugging log

        if user.is_superuser:
            # ✅ Superusers get all consultancies
            consultancies = Consultancy.objects.all()
            consultancies_data = [{"id": c.id, "name": c.name} for c in consultancies]
            return JsonResponse({"consultancies": consultancies_data}, status=200)

        try:
            # ✅ Fetch consultancy linked to this user
            consultancy = Consultancy.objects.get(user=user)
            print(f"✅ Consultancy Found: {consultancy.name} (ID: {consultancy.id})")  # ✅ Debugging log
            return JsonResponse({"message": "Consultancy found", "consultancy": consultancy.name}, status=200)

        except Consultancy.DoesNotExist:
            print("❌ No Consultancy Found for this user!")  # ✅ Debugging log
            return JsonResponse({"error": "No consultancy is linked to this user."}, status=404)

    return JsonResponse({"error": "Invalid request method"}, status=400)



@login_required
@csrf_exempt
@require_http_methods(["PUT", "PATCH"])
def update_consultancy_profile(request):
    """
    Allow consultancies to update their profile details.
    """
    user = request.user
    print(f"🔹 Updating profile for user: {user.email} (ID: {user.id})")  # ✅ Debugging log

    try:
        consultancy = Consultancy.objects.get(user=user)
        print(f"✅ Consultancy Found: {consultancy.name}")  # ✅ Debugging log
    except Consultancy.DoesNotExist:
        print("❌ No Consultancy Found for this user!")  # ✅ Debugging log
        return JsonResponse({"error": "No Consultancy matches the given user."}, status=404)

    try:
        data = json.loads(request.body.decode("utf-8"))

        # ✅ Update fields based on provided data
        consultancy.name = data.get("name", consultancy.name)
        consultancy.slug = data.get("slug", consultancy.slug)
        consultancy.address = data.get("address", consultancy.address)
        consultancy.latitude = data.get("latitude", consultancy.latitude)
        consultancy.longitude = data.get("longitude", consultancy.longitude)
        consultancy.establishment_date = data.get("establishment_date", consultancy.establishment_date)
        consultancy.website = data.get("website", consultancy.website)
        consultancy.email = data.get("email", consultancy.email)
        consultancy.phone = data.get("phone", consultancy.phone)
        consultancy.moe_certified = data.get("moe_certified", consultancy.moe_certified)
        consultancy.about = data.get("about", consultancy.about)

        # ✅ Handle Many-to-Many fields (destinations, test preparation, universities)
        if "study_abroad_destinations" in data:
            consultancy.study_abroad_destinations.set(data["study_abroad_destinations"])
        if "test_preparation" in data:
            consultancy.test_preparation.set(data["test_preparation"])
        if "partner_universities" in data:
            consultancy.partner_universities.set(data["partner_universities"])

        consultancy.save()
        print("✅ Consultancy Profile Updated Successfully!")  # ✅ Debugging log

        return JsonResponse({"message": "Profile updated successfully"})

    except json.JSONDecodeError:
        print("❌ JSON Decode Error!")  # ✅ Debugging log
        return JsonResponse({"error": "Invalid JSON data"}, status=400)
    except PermissionDenied:
        print("❌ Permission Denied!")  # ✅ Debugging log
        return JsonResponse({"error": "You don't have permission to update this profile"}, status=403)
    except Exception as e:
        print(f"❌ Unexpected Error: {e}")  # ✅ Debugging log
        return JsonResponse({"error": str(e)}, status=500)