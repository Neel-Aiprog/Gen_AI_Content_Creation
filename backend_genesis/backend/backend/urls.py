from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),

    # AI Blog Generator
    path("api/", include("blog.urls")),

    # Pexels, tools, helpers
    path("utils-api/", include("blog.urls")),
]
