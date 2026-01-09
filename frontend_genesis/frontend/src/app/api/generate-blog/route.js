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

    /* 1️⃣ Generate blog from Django */
    const blogRes = await fetch("http://localhost:8000/api/generate-blog/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const blogData = await blogRes.json();

    /* 2️⃣ Fetch UNSPLASH images from Django */
    const imgRes = await fetch(
      `http://localhost:8000/api/unsplash/?q=${encodeURIComponent(topic)}`
    );

    const imgData = await imgRes.json();

    /* 3️⃣ Combine blog + images */
    return new Response(
      JSON.stringify({
        ...blogData,
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


