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
    const topic = body.topic;

    /* 1️⃣ Generate instagram post from Django */
    const insta_postRes = await fetch("http://localhost:8000/api/instagram-post/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const insta_postData = await insta_postRes.json();

    /* 2️⃣ Fetch UNSPLASH images from Django */
    const imgRes = await fetch(
      `http://localhost:8000/api/unsplash/?q=${encodeURIComponent(topic)}`
    );

    const imgData = await imgRes.json();

    /* 3️⃣ Combine instagram post + images */
    return new Response(
      JSON.stringify({
        ...insta_postData,
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


