from django.urls import path
from .views import generate_blog, fetch_images

urlpatterns = [
    path("generate-blog/", generate_blog),
    path("unsplash/", fetch_images),   # cleaner route
]
