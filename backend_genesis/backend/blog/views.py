import json
import os, requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from backend.chains.pipeline import (
    chain1,
    chain2,
    regen_chain1,
    tweet_chain,
    description_chain,
    script_chain,
    insta_post_chain,
    reddit_post_chain,
    extract_after_marker,
    extract_result_marker,
)


# 🔥 UNSPLASH IMAGE FETCHER
def fetch_images(request):
    query = request.GET.get("q")

    url = "https://api.unsplash.com/search/photos"

    headers = {
        "Authorization": f"Client-ID {os.getenv('UNSPLASH_ACCESS_KEY')}"
    }

    params = {
        "query": query,
        "per_page": 6,
        "orientation": "landscape"
    }

    r = requests.get(url, headers=headers, params=params, timeout=20)
    return JsonResponse(r.json(), safe=False)


@csrf_exempt
def generate_blog(request):
    if request.method == "OPTIONS":
        return JsonResponse({"status": "ok"})

    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed"}, status=405)

    try:
        payload = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"detail": "Invalid JSON body"}, status=400)

    topic = (payload.get("topic1") or "").strip()
    tone = (payload.get("tone") or "scientific").strip() or "scientific"

    if not topic:
        return JsonResponse({"detail": "'topic1' is required"}, status=400)

    try:
        # Chain 1 → SEO plan
        raw_plan = chain1.invoke({"text": topic, "tone": tone})
        plan_text = extract_after_marker(raw_plan)

        # Chain 2 → Final blog
        raw_blog = chain2.invoke({"plan": plan_text, "topic": topic})
        blog_text = extract_result_marker(raw_blog)

    except Exception as exc:
        return JsonResponse(
            {
                "detail": "Error while generating content",
                "error": str(exc),
            },
            status=500,
        )

    return JsonResponse(
        {
            "topic": topic,
            "tone": tone,
            "plan": plan_text,
            "blog": blog_text,
        }
    )

@csrf_exempt
def regenerate_text(request):
    if request.method == "OPTIONS":
        return JsonResponse({"status": "ok"})

    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed"}, status=405)

    try:
        payload = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"detail": "Invalid JSON body"}, status=400)

    topic = (payload.get("topic2") or "").strip()
    tone = (payload.get("tone") or "scientific").strip() or "scientific"

    if not topic:
        return JsonResponse({"detail": "'text' is required"}, status=400)

    try:
        raw_regen = regen_chain1.invoke({"text": topic, "tone": tone})
        regen_text = extract_after_marker(raw_regen)

    except Exception as exc:
        return JsonResponse(
            {
                "detail": "Error while generating content",
                "error": str(exc),
            },
            status=500,
        )

    return JsonResponse(
        {
            "text": topic,
            "tone": tone,
            "regened": regen_text,
        }
    )

@csrf_exempt
def generate_tweet(request):
    if request.method == "OPTIONS":
        return JsonResponse({"status": "ok"})

    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed"}, status=405)

    try:
        payload = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"detail": "Invalid JSON body"}, status=400)

    topic = (payload.get("topic1") or "").strip()
    tone = (payload.get("tone") or "casual").strip() or "casual"

    if not topic:
        return JsonResponse({"detail": "'text' is required"}, status=400)

    try:
        raw_tweet = tweet_chain.invoke({"text": topic, "tone": tone})
        tweet_text = extract_after_marker(raw_tweet)

    except Exception as exc:
        return JsonResponse(
            {
                "detail": "Error while generating content",
                "error": str(exc),
            },
            status=500,
        )

    return JsonResponse(
        {
            "text": topic,
            "tone": tone,
            "tweet": tweet_text,
        }
    )

@csrf_exempt
def youtube_description(request):
    if request.method == "OPTIONS":
        return JsonResponse({"status": "ok"})

    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed"}, status=405)

    try:
        payload = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"detail": "Invalid JSON body"}, status=400)

    topic = (payload.get("topic1") or "").strip()
    tone = (payload.get("tone") or "casual").strip() or "casual"

    if not topic:
        return JsonResponse({"detail": "'text' is required"}, status=400)

    try:
        raw_description = description_chain.invoke({"text": topic, "tone": tone})
        description_text = extract_after_marker(raw_description)

    except Exception as exc:
        return JsonResponse(
            {
                "detail": "Error while generating content",
                "error": str(exc),
            },
            status=500,
        )

    return JsonResponse(
        {
            "text": topic,
            "tone": tone,
            "description": description_text,
        }
    )

@csrf_exempt
def youtube_script(request):
    if request.method == "OPTIONS":
        return JsonResponse({"status": "ok"})

    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed"}, status=405)

    try:
        payload = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"detail": "Invalid JSON body"}, status=400)

    topic = (payload.get("topic1") or "").strip()
    tone = (payload.get("tone") or "casual").strip() or "casual"

    if not topic:
        return JsonResponse({"detail": "'text' is required"}, status=400)

    try:
        raw_script = script_chain.invoke({"text": topic, "tone": tone})
        script_text = extract_after_marker(raw_script)

    except Exception as exc:
        return JsonResponse(
            {
                "detail": "Error while generating content",
                "error": str(exc),
            },
            status=500,
        )

    return JsonResponse(
        {
            "text": topic,
            "tone": tone,
            "script": script_text,
        }
    )

@csrf_exempt
def instagram_post(request):
    if request.method == "OPTIONS":
        return JsonResponse({"status": "ok"})

    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed"}, status=405)

    try:
        payload = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"detail": "Invalid JSON body"}, status=400)

    topic = (payload.get("topic1") or "").strip()
    tone ="casual"

    if not topic:
        return JsonResponse({"detail": "'text' is required"}, status=400)

    try:
        raw_insta_post = insta_post_chain.invoke({"text": topic, "tone": tone})
        insta_post_text = extract_after_marker(raw_insta_post)

    except Exception as exc:
        return JsonResponse(
            {
                "detail": "Error while generating content",
                "error": str(exc),
            },
            status=500,
        )

    return JsonResponse(
        {
            "text": topic,
            "tone": tone,
            "insta_post": insta_post_text,
        }
    )

@csrf_exempt
def reddit_post(request):
    if request.method == "OPTIONS":
        return JsonResponse({"status": "ok"})

    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed"}, status=405)

    try:
        payload = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"detail": "Invalid JSON body"}, status=400)

    topic = (payload.get("topic1") or "").strip()
    tone = (payload.get("tone") or "casual").strip() or "casual"

    if not topic:
        return JsonResponse({"detail": "'text' is required"}, status=400)

    try:
        raw_reddit_post = reddit_post_chain.invoke({"text": topic, "tone": tone})
        reddit_post_text = extract_after_marker(raw_reddit_post)

    except Exception as exc:
        return JsonResponse(
            {
                "detail": "Error while generating content",
                "error": str(exc),
            },
            status=500,
        )

    return JsonResponse(
        {
            "text": topic,
            "tone": tone,
            "reddit_post": reddit_post_text,
        }
    )


@csrf_exempt
def pexels_suggestions(request):
    q = request.GET.get("q")

    url = "https://api.pexels.com/v1/search"
    headers = { "Authorization": os.getenv("PEXELS_API_KEY") }

    params = {
        "query": q,
        "per_page": 12
        # ❌ remove orientation filter
    }

    r = requests.get(url, headers=headers, params=params, timeout=20)
    return JsonResponse(r.json(), safe=False)

