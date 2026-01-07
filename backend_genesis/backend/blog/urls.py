from django.urls import path
from .views import generate_blog, fetch_images, regenerate_text

urlpatterns = [
    path("generate-blog/", generate_blog),
    path("unsplash/", fetch_images),   # cleaner route
    path("regenerate-text/", regenerate_text),
]
