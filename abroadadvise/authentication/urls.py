from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import register, login_view, consultancy_only_view, university_only_view, student_only_view

app_name = "authentication"  # ✅ Namespace added to avoid conflicts

urlpatterns = [
    path("register/", register, name="register"),
    path("login/", login_view, name="login"),  # ✅ Ensure this matches frontend API call
    path("consultancy/", consultancy_only_view, name="consultancy_view"),
    path("university/", university_only_view, name="university_view"),
    path("student/", student_only_view, name="student_view"),
    
    # ✅ JWT Authentication Endpoints
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),  # Login (obtain token)
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),  # Refresh token
]
