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
@api_view(['POST'])
@permission_classes([AllowAny])  # Public access allowed
def login_view(request):
    email = request.data.get("email")
    password = request.data.get("password")

    try:
        user = User.objects.get(email=email)

        # ✅ Check if the password is correct
        if not check_password(password, user.password):
            return Response({"error": "Invalid credentials"}, status=400)

        # ✅ Ensure user role is set
        if user.role is None:
            return Response({"error": "User role not assigned"}, status=400)

    except User.DoesNotExist:
        return Response({"error": "Invalid credentials"}, status=400)

    refresh = RefreshToken.for_user(user)

    # ✅ Fetch consultancy details if user is associated with a consultancy
    consultancy_data = None
    if hasattr(user, 'consultancy_id') and user.consultancy_id:
        consultancy = Consultancy.objects.filter(id=user.consultancy_id).first()
        if consultancy:
            consultancy_data = {
                "id": consultancy.id,
                "name": consultancy.name,
                "email": consultancy.email,
                "phone": consultancy.phone,
                "address": consultancy.address,
                "logo": consultancy.logo.url if consultancy.logo else None,
            }

    # ✅ Fetch university details if user is associated with a university
    university_data = None
    if hasattr(user, 'university_id') and user.university_id:
        university = University.objects.filter(id=user.university_id).first()
        if university:
            university_data = {
                "id": university.id,
                "name": university.name,
                "email": university.email,
                "phone": university.phone,
                "address": university.address,
                "logo": university.logo.url if university.logo else None,
            }

    return Response({
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role,
        },
        "consultancy": consultancy_data,  # ✅ Returns consultancy info if applicable
        "university": university_data,  # ✅ Returns university info if applicable
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    })


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
