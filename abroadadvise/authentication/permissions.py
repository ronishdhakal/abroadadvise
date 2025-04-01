from rest_framework.permissions import BasePermission


class IsAdminUser(BasePermission):
    """Permission for Admin users"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'


class IsConsultancyUser(BasePermission):
    """Permission for Consultancy users"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'consultancy'


class IsUniversityUser(BasePermission):
    """Permission for University users to access only their assigned university"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'university'

    def has_object_permission(self, request, view, obj):
        # Ensure university user can only access their own university profile
        return request.user.university_id == obj.id


class IsCollegeUser(BasePermission):
    """Permission for College users to access only their assigned college"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'college'

    def has_object_permission(self, request, view, obj):
        # Ensure college user can only access their own college profile
        return request.user.college_id == obj.id


class IsStudentUser(BasePermission):
    """Permission for Student users"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'student'
