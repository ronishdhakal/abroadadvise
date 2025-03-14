from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import register, login_view, student_only_view

app_name = "authentication"  # ✅ Namespace added to avoid conflicts

urlpatterns = [
    path("register/", register, name="register"),
    path("login/", login_view, name="login"),  # ✅ Matches frontend API call
    
    # ✅ JWT Authentication Endpoints
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),  # Login (obtain token)
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),  # Refresh token
]
