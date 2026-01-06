import json
import os, requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from backend.chains.pipeline import (
    chain1,
    chain2,
    extract_after_marker,
    extract_result_marker,
)
def fetch_images(request):
    query = request.GET.get("q")
    url = f"https://api.pexels.com/v1/search?query={query}&per_page=3"

    headers = {
        "Authorization": os.getenv("PEXELS_API_KEY")
    }

    r = requests.get(url, headers=headers)
    return JsonResponse(r.json(), safe=False)

@csrf_exempt
def generate_blog(request):
    if request.method == "OPTIONS":
        return JsonResponse({"status": "ok"})
    """Generate SEO plan and blog article from topic + tone.

    Expected JSON body:
    {
      "topic": "some topic",
      "tone": "scientific" | "professional" | "casual" | "storytelling"
    }
    """
    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed"}, status=405)

    try:
        payload = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"detail": "Invalid JSON body"}, status=400)

    topic = (payload.get("topic") or "").strip()
    tone = (payload.get("tone") or "scientific").strip() or "scientific"

    if not topic:
        return JsonResponse({"detail": "'topic' is required"}, status=400)

    try:
        # Chain 1: topic + tone -> structured SEO plan
        raw_plan = chain1.invoke({"text": topic, "tone": tone})
        plan_text = extract_after_marker(raw_plan)

        # Chain 2: plan + topic -> unified blog article (kept on-topic)
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
