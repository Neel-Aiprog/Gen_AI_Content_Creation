import { BACKEND_URL } from '@/lib/config';

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const topic = body.topic1;

    /* 1️⃣ Generate reddit post from Django */
    const reddit_postRes = await fetch(`${BACKEND_URL}/api/reddit-post/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const reddit_postData = await reddit_postRes.json();

    /* 2️⃣ Fetch UNSPLASH images from Django */
    const imgRes = await fetch(
      `${BACKEND_URL}/api/unsplash/?q=${encodeURIComponent(topic)}`
    );

    const imgData = await imgRes.json();

    /* 3️⃣ Combine reddit post + images */
    return new Response(
      JSON.stringify({
        ...reddit_postData,
        images: imgData.results || []
      }),
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500 }
    );
  }
}


