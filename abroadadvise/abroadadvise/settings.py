from pathlib import Path
from datetime import timedelta

import os

# ✅ Base Directory
BASE_DIR = Path(__file__).resolve().parent.parent

# ✅ Security Warning: Keep the secret key safe in production
SECRET_KEY = 'django-insecure-r51rcl7)3*++$0napu*gx#fl-kn(pqb1yfh+_9*^xx94gqx$qt'

# ✅ Debug Mode (Turn OFF in production)
DEBUG = True  # Set to False in production

# ✅ Allowed Hosts
ALLOWED_HOSTS = ["127.0.0.1", "localhost"]

# ✅ Installed Apps
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party apps
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'django_filters',
    'tinymce',
    'rest_framework_simplejwt.token_blacklist',  # ✅ Add this

    # Custom apps
    'authentication',
    'consultancy',
    'university',
    'course',
    'destination',
    'exam',
    'event',
    'news',
    'core',
    'inquiry',
    'blog',
    'college',
    'scholarship',
    'featured'

]

from datetime import timedelta

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=500),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "SIGNING_KEY": SECRET_KEY,
    "AUTH_HEADER_TYPES": ("Bearer",),
}


# ✅ Middleware
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # CORS Middleware at the top
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',  # CSRF middleware remains
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
 
]

# ✅ Root URL Configuration
ROOT_URLCONF = 'abroadadvise.urls'

# ✅ Templates
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                
            ],
        },
    },
]

# ✅ WSGI Application
WSGI_APPLICATION = 'abroadadvise.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'abroadadvise_db',
        'USER': 'postgres',
        'PASSWORD': 'Abroad@@##77',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}


# ✅ Password Validators
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ✅ Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ✅ Static & Media Files
STATIC_URL = '/static/'
STATICFILES_DIRS = [os.path.join(BASE_DIR, "static")]
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# ✅ Default Primary Key Field Type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ✅ Django REST Framework Settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',  # ✅ Allow unauthenticated users to submit inquiries
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',  # ✅ Only return JSON responses
    ] if not DEBUG else [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',  # ✅ Keep browsable API in dev mode only
    ],
}

# ✅ Custom Authentication Backend (Enables Email Login)
AUTHENTICATION_BACKENDS = [
    'authentication.backends.EmailBackend',  # Custom email login
    'django.contrib.auth.backends.ModelBackend',  # Default username login (fallback)
]

# ✅ Custom User Model
AUTH_USER_MODEL = 'authentication.User'

# ✅ Fix URL Issues
APPEND_SLASH = False  # Fix issues with missing slashes in URLs

# ✅ Email Configuration (Update in production)
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# ✅ CORS Configuration (Ensures API Works with Frontend)
CORS_ALLOW_ALL_ORIGINS = True  # Disable allowing all origins (security best practice)
CORS_ALLOW_CREDENTIALS = True  # ✅ Allow sending authentication credentials

# ✅ CSRF Configuration for API (Ensure frontend can submit forms)
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# ✅ Fix Template Issues
if 'django_filters' in INSTALLED_APPS:
    TEMPLATES[0]['OPTIONS']['context_processors'].append('django.template.context_processors.request')

# ✅ Ensure `django-filter` is Installed
try:
    import django_filters
except ImportError:
    raise ImportError("django-filter is not installed. Install it with `pip install django-filter`.")
