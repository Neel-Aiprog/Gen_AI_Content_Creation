from django.urls import path
from .views import generate_blog, fetch_images, regenerate_text, pexels_suggestions, generate_tweet, youtube_description, youtube_script, instagram_post, reddit_post

urlpatterns = [
    path("generate-blog/", generate_blog),
    path("unsplash/", fetch_images),   # cleaner route
    path("regenerate-text/", regenerate_text),
    path("generate-tweet/", generate_tweet),
    path("youtube-description/", youtube_description),
    path("youtube-script/", youtube_script),
    path("instagram-post/", instagram_post),
    path("reddit-post/", reddit_post),
    path("pexels-suggestions/", pexels_suggestions),

]
