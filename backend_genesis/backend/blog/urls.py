from django.urls import path

from . import views

urlpatterns = [
    path("generate-blog/", views.generate_blog, name="generate-blog"),
    path("pexels/", views.fetch_images,name="fetch_images"),
]