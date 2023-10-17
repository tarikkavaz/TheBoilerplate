import os
from pathlib import Path
from django.utils.translation import gettext_lazy as _

import os

# Environment variables
CLIENT_BASE_URL = os.environ.get('CLIENT_BASE_URL', '0.0.0.0')
API_PORT = os.environ.get('API_PORT', '8000')
CLIENT_PORT = os.environ.get('CLIENT_PORT', '3000')

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent

# Security
SECRET_KEY = 'django-insecure-et^72^ib$yz@ggxs#e!enovydb$(^xw(%&@a^8#l--_=l5lfat'
DEBUG = True
ALLOWED_HOSTS = [
    'frontend', 
    'backend', 
    '0.0.0.0', 
    '0.0.0.0:8000', 
    CLIENT_BASE_URL, 
    f"{CLIENT_BASE_URL}:{API_PORT}",
    f"{CLIENT_BASE_URL}:{CLIENT_PORT}",
]
SECURE_CROSS_ORIGIN_OPENER_POLICY = None

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'content',
    'ckeditor',
    'ckeditor_uploader',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.common.CommonMiddleware',
]

ROOT_URLCONF = 'config.urls'
WSGI_APPLICATION = 'config.wsgi.application'

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Internationalization
LANGUAGE_CODE = 'en-us'
LANGUAGES = [('en', _('English')), ('tr', _('Turkish'))]
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Templates
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

# Static and media files
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static_root')
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media/')

# REST FRAMEWORK and CORS
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = [
    f"http://0.0.0.0:{API_PORT}",
    f"http://0.0.0.0:{CLIENT_PORT}",
    f"http://{CLIENT_BASE_URL}:{API_PORT}",
    f"http://{CLIENT_BASE_URL}:{CLIENT_PORT}",
    f"https://{CLIENT_BASE_URL}:{API_PORT}",
    f"https://{CLIENT_BASE_URL}:{CLIENT_PORT}",
]
APPEND_SLASH = True

# CKEDITOR
CKEDITOR_UPLOAD_PATH = 'uploads/ckeditor/'
CKEDITOR_CONFIGS = {
    'default': {
        'toolbar': 'Full',
        'toolbar_Full': [
            ['Styles', 'Format', 'Bold', 'Italic', 'Underline', 'Undo', 'Redo'],
            ['BulletedList', 'NumberedList'],
            ['Link', 'Unlink', 'Anchor'],
            ['Image', 'Table', 'HorizontalRule'],
            ['Smiley', 'SpecialChar'], 
            ['Source'],
        ]
    },
}

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
