from django.contrib.auth.backends import ModelBackend
from authentication.models import User

class EmailBackend(ModelBackend):
    """
    Custom authentication backend to allow login with email instead of username.
    """
    def authenticate(self, request, email=None, password=None, **kwargs):
        try:
            user = User.objects.get(email=email)  # Match email instead of username
            if user.check_password(password):  # Check password correctly
                return user
        except User.DoesNotExist:
            return None
