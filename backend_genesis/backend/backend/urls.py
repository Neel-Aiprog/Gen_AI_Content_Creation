from django.contrib import admin
from django.urls import include, path
from django.http import JsonResponse

def root(request):
    return JsonResponse({"status": "Backend is running"})

urlpatterns = [
    path("", root),
    path("admin/", admin.site.urls),
    path("api/", include("blog.urls")),
]
