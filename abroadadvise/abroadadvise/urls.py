from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.urlpatterns import format_suffix_patterns  # Optional for API flexibility

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("authentication.urls")),  
    # Main Apps
    path('consultancy/', include('consultancy.urls')),
    path('university/', include('university.urls')),
    path('destination/', include('destination.urls')),
    path('course/', include('course.urls')),
    path('event/', include('event.urls')),
    path('news/', include('news.urls')),
    path('exam/', include('exam.urls')),
    path('inquiry/', include('inquiry.urls')),

    # ✅ Fix Reviews Path (Remove extra "reviews/")
    path('reviews/', include('core.urls')),  # Ensure it's correct
    
    # for Text Editor
    path('tinymce/', include('tinymce.urls')),
]

# ✅ Support API format suffixes (optional)
urlpatterns = format_suffix_patterns(urlpatterns)

# ✅ Serve media files in development & production
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    from django.views.static import serve
    from django.urls import re_path
    
    urlpatterns += [
        re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
    ]
