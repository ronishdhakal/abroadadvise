from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from .serializers import UserSerializer
from .permissions import IsConsultancyUser, IsUniversityUser, IsStudentUser
from consultancy.models import Consultancy
from university.models import University

User = get_user_model()


# ✅ Register a New User (Ensures password is hashed before saving)
@api_view(['POST'])
@permission_classes([AllowAny])  # Public access allowed
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()

        # ✅ Ensure role is assigned (Default: "student")
        user.role = request.data.get("role", "student")  # Defaults to "student" if not provided
        user.set_password(serializer.validated_data['password'])  # ✅ Hash password before saving
        user.save()

        refresh = RefreshToken.for_user(user)
        return Response({
            "user": {
                "id": user.id,
                "email": user.email,
                "role": user.role,
            },
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        })
    
    return Response(serializer.errors, status=400)


# ✅ User Login with JWT Authentication (Ensures role-based authentication)
# ✅ User Login with JWT Authentication (Supports University & Consultancy Login)
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    try:
        print("🔍 Received Login Request:", request.data)  # 🔥 Debug log

        email = request.data.get("email")
        password = request.data.get("password")

        user = User.objects.get(email=email)

        if not check_password(password, user.password):
            print("❌ Invalid Password")  # 🔥 Debug
            return Response({"error": "Invalid credentials"}, status=400)

        refresh = RefreshToken.for_user(user)

        # Fetch consultancy or university ID
        consultancy = Consultancy.objects.filter(user=user).first()
        university = University.objects.filter(user=user).first()

        consultancy_id = consultancy.id if consultancy else None
        university_id = university.id if university else None

        return Response({
            "user": {
                "id": user.id,
                "email": user.email,
                "role": user.role,
            },
            "consultancy_id": consultancy_id,
            "university_id": university_id,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        })

    except User.DoesNotExist:
        print("❌ User Not Found")  # 🔥 Debug
        return Response({"error": "Invalid credentials"}, status=400)

    except Exception as e:
        print("🚨 Server Error:", str(e))  # 🔥 Debug
        return Response({"error": "Something went wrong"}, status=500)



# ✅ Protected View: Only Consultancy Users Can Access Their Own Consultancy
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsConsultancyUser])  # Restrict to consultancy users
def consultancy_only_view(request):
    """ ✅ Fetch the consultancy profile linked to the logged-in consultancy user. """
    user = request.user  # Get the logged-in user

    # Ensure user has a consultancy assigned
    consultancy = Consultancy.objects.filter(id=user.consultancy_id).first()

    if not consultancy:
        return Response({"error": "No consultancy is linked to this user."}, status=404)

    consultancy_data = {
        "id": consultancy.id,
        "name": consultancy.name,
        "email": consultancy.email,
        "phone": consultancy.phone,
        "address": consultancy.address,
        "logo": consultancy.logo.url if consultancy.logo else None,
    }

    return Response({"consultancy": consultancy_data})


# ✅ Protected View: Only University Users Can Access Their Own University
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsUniversityUser])  # Restrict to university users
def university_only_view(request):
    """ ✅ Fetch the university profile linked to the logged-in university user. """
    user = request.user  # Get the logged-in user

    # Ensure user has a university assigned
    university = University.objects.filter(id=user.university_id).first()

    if not university:
        return Response({"error": "No university is linked to this user."}, status=404)

    university_data = {
        "id": university.id,
        "name": university.name,
        "email": university.email,
        "phone": university.phone,
        "address": university.address,
        "logo": university.logo.url if university.logo else None,
    }

    return Response({"university": university_data})


# ✅ Protected View: Only Student Users Can Access
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsStudentUser])  # Only Student Users
def student_only_view(request):
    return Response({"message": "Hello, Student! You can submit inquiries."})
