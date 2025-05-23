from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from .serializers import UserSerializer
from .permissions import IsConsultancyUser, IsUniversityUser, IsStudentUser
from .permissions import IsAdminUser  # Make sure this exists or define it
from consultancy.models import Consultancy
from rest_framework import status
from .pagination import UserPagination
from django.db.models import Q
from university.models import University
from college.models import College  # ✅ NEW IMPORT
from .models import PasswordResetCode
from django.utils import timezone
from django.utils.html import strip_tags
import uuid
from django.core.mail import send_mail
from django.conf import settings

from .serializers import (
    UserListSerializer,
    UserCreateSerializer,
    UserUpdateSerializer,
)

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


# ✅ User Login with JWT Authentication (Supports University, Consultancy, College Login)
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

        # Fetch consultancy, university, or college ID
        consultancy = Consultancy.objects.filter(user=user).first()
        university = University.objects.filter(user=user).first()
        college = College.objects.filter(user=user).first()

        consultancy_id = consultancy.id if consultancy else None
        university_id = university.id if university else None
        college_id = college.id if college else None

        return Response({
            "user": {
                "id": user.id,
                "email": user.email,
                "role": user.role,
            },
            "consultancy_id": consultancy_id,
            "university_id": university_id,
            "college_id": college_id,
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
    user = request.user  # Get the logged-in user
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
    user = request.user
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


# For Users in Admin
# ✅ For Users in Admin
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def get_all_users(request):
    search = request.GET.get('search', '')

    users = User.objects.filter(
        Q(username__icontains=search) |
        Q(email__icontains=search) |
        Q(first_name__icontains=search) |  # ✅ Added
        Q(last_name__icontains=search) |   # ✅ Added
        Q(role__icontains=search)
    ).order_by('-date_joined')

    paginator = UserPagination()
    result_page = paginator.paginate_queryset(users, request)
    serializer = UserListSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)



# ✅ CREATE a user (only for superadmin)
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def create_user_by_admin(request):
    serializer = UserCreateSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        user.set_password(serializer.validated_data['password'])  # Hash password
        user.save()
        return Response(UserListSerializer(user).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ UPDATE a user (only for superadmin)
@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsAdminUser])
def update_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    serializer = UserUpdateSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        updated_user = serializer.save()

        if 'password' in request.data and request.data['password']:
            updated_user.set_password(request.data['password'])
            updated_user.save()

        return Response(UserListSerializer(updated_user).data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ DELETE a user (only for superadmin)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser])
def delete_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        user.delete()
        return Response({"message": "User deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
    
    
    # For Password Rest
    # ✅ 1. Request password reset (send code)

@api_view(['POST'])
@permission_classes([AllowAny])
def request_password_reset(request):
    """
    🔐 Handle password reset request:
    - Validate email
    - Generate a reset code
    - Store it in the database
    - Send reset code via email
    """
    email = request.data.get('email')

    # ✅ Validate email input
    if not email:
        return Response({'error': 'Email is required.'}, status=400)

    # ✅ Check if user exists
    user = User.objects.filter(email=email).first()
    if not user:
        return Response({'error': 'No account found with this email.'}, status=404)

    # ✅ Generate and store a unique reset code (short UUID)
    reset_code = str(uuid.uuid4()).split('-')[0]
    PasswordResetCode.objects.create(user=user, code=reset_code)

    # ✅ Compose email content
    subject = "🔐 Reset Your Password - Abroad Advise"
    message = f"""
    Hi {user.username},

    We received a request to reset the password for your Abroad Advise account.

    Please use the code below to proceed:

    ┌────────────────────┐
    │   RESET CODE: {reset_code}   │
    └────────────────────┘

    If you did not request a password reset, please ignore this message.

    Best regards,  
    Abroad Advise Team
    """
    plain_message = strip_tags(message)

    # ✅ Send the email
    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user.email],
            fail_silently=False,
        )
    except Exception as e:
        return Response({'error': f'Failed to send email. {str(e)}'}, status=500)

    # ✅ Success response
    return Response({'message': 'A reset code has been sent to your email.'}, status=200)



# ✅ 2. Verify reset code
@api_view(['POST'])
@permission_classes([AllowAny])
def verify_reset_code(request):
    email = request.data.get('email')
    code = request.data.get('code')

    user = User.objects.filter(email=email).first()
    if not user:
        return Response({'error': 'User not found'}, status=404)

    reset = PasswordResetCode.objects.filter(user=user, code=code, is_used=False).first()
    if reset and not reset.is_expired():
        return Response({'message': 'Valid code'})
    return Response({'error': 'Invalid or expired code'}, status=400)


# ✅ 3. Set new password
@api_view(['POST'])
@permission_classes([AllowAny])
def set_new_password(request):
    email = request.data.get('email')
    code = request.data.get('code')
    new_password = request.data.get('new_password')

    user = User.objects.filter(email=email).first()
    reset = PasswordResetCode.objects.filter(user=user, code=code, is_used=False).first()

    if not user or not reset or reset.is_expired():
        return Response({'error': 'Invalid or expired reset request'}, status=400)

    user.set_password(new_password)
    user.save()

    reset.is_used = True
    reset.save()

    return Response({'message': 'Password has been reset successfully'})
