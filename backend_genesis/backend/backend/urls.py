from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),

    # Main AI API (blog + images)
    path("api/", include("blog.urls")),
]
