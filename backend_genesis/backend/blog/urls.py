from django.urls import path
from .views import generate_blog, fetch_images, regenerate_text,pexels_suggestions

urlpatterns = [
    path("generate-blog/", generate_blog),
    path("unsplash/", fetch_images),   # cleaner route
    path("regenerate-text/", regenerate_text),
    path("pexels-suggestions/", pexels_suggestions),

]
