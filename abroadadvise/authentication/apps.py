from django.apps import AppConfig
from django.contrib.auth import get_user_model
from django.db.utils import OperationalError
from django.core.exceptions import ImproperlyConfigured
import logging


class AuthenticationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'authentication'

    