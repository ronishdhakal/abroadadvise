from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

# ✅ Custom User model
class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('consultancy', 'Consultancy'),
        ('university', 'University'),
        ('college', 'College'),  # ✅ College role added
        ('student', 'Student'),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')

    def __str__(self):
        return self.username


# ✅ Password Reset Code model
class PasswordResetCode(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    def is_expired(self):
        return self.created_at < timezone.now() - timezone.timedelta(minutes=10)

    def __str__(self):
        return f"{self.user.email} - {self.code}"
