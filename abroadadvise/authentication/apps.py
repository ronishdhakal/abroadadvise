from django.apps import AppConfig
from django.contrib.auth import get_user_model
from django.db.utils import OperationalError
from django.core.exceptions import ImproperlyConfigured
import logging


class AuthenticationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'authentication'

    def ready(self):
        try:
            User = get_user_model()

            if not User.objects.filter(is_superuser=True).exists():
                User.objects.create_superuser(
                    username="test",
                    email="test@gmail.com",
                    password="test"
                )
                logging.info("✅ Default superuser created: admin / admin123")

        except (OperationalError, ImproperlyConfigured):
            # Happens if DB is not ready during migrations — skip safely
            logging.warning("⚠️ Skipping default superuser creation (DB not ready)")
