from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from django.contrib.auth import authenticate
from .serializers import UserSerializer
from .permissions import IsConsultancyUser, IsUniversityUser, IsStudentUser

User = get_user_model()

# ✅ Register a New User (Ensures password is hashed before saving)
@api_view(['POST'])
@permission_classes([AllowAny])  # Public access allowed
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
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

# ✅ User Login with JWT Authentication (Fixes email authentication issue)
@api_view(['POST'])
@permission_classes([AllowAny])  # Public access allowed
def login_view(request):
    email = request.data.get("email")
    password = request.data.get("password")

    try:
        user = User.objects.get(email=email)
        if not check_password(password, user.password):  # ✅ Ensures password check
            return Response({"error": "Invalid credentials"}, status=400)
    except User.DoesNotExist:
        return Response({"error": "Invalid credentials"}, status=400)

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

# ✅ Protected View: Only Consultancy Users Can Access
@api_view(['GET'])
@permission_classes([IsConsultancyUser])  # Only Consultancy Users
def consultancy_only_view(request):
    return Response({"message": "Hello, Consultancy! You can manage your profile."})

# ✅ Protected View: Only University Users Can Access
@api_view(['GET'])
@permission_classes([IsUniversityUser])  # Only University Users
def university_only_view(request):
    return Response({"message": "Hello, University! You can manage courses & scholarships."})

# ✅ Protected View: Only Student Users Can Access
@api_view(['GET'])
@permission_classes([IsStudentUser])  # Only Student Users
def student_only_view(request):
    return Response({"message": "Hello, Student! You can submit inquiries."})
