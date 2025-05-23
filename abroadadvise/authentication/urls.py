from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    register, login_view, student_only_view,
    get_all_users, create_user_by_admin, update_user, delete_user,
    request_password_reset, verify_reset_code, set_new_password,  # ✅ New views
)

app_name = "authentication"

urlpatterns = [
    # ✅ Registration & Login
    path("register/", register, name="register"),
    path("login/", login_view, name="login"),

    # ✅ JWT Token Endpoints
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # ✅ User Management (Superadmin only)
    path("users/", get_all_users, name="list-users"),  # GET
    path("users/create/", create_user_by_admin, name="create-user"),  # POST
    path("users/<int:user_id>/", update_user, name="update-user"),  # PUT
    path("users/<int:user_id>/delete/", delete_user, name="delete-user"),  # DELETE

    # ✅ Forgot Password Endpoints
    path("password-reset/request/", request_password_reset, name="password-reset-request"),
    path("password-reset/verify/", verify_reset_code, name="password-reset-verify"),
    path("password-reset/set/", set_new_password, name="password-reset-set"),
]
