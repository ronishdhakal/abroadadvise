from django.urls import path
from .views import register, login_view, consultancy_only_view, university_only_view, student_only_view

urlpatterns = [
    path("register/", register, name="register"),
    path("login/", login_view, name="login"),
    path("consultancy/", consultancy_only_view, name="consultancy_view"),
    path("university/", university_only_view, name="university_view"),
    path("student/", student_only_view, name="student_view"),
]
