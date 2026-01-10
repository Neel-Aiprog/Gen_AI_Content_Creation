const BACKEND_URL = process.env.BACKEND_URL || 'https://gen-ai-content-creation.onrender.com';

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
    const topic = body.topic2;

    /* 1️⃣ Regenerate text from Django */
    const regenRes = await fetch(`${BACKEND_URL}/api/regenerate-text/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const regenData = await regenRes.json();

    return new Response(
      JSON.stringify(regenData),
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
