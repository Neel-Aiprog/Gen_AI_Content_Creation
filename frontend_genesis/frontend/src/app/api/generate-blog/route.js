export async function POST(request) {
  try {
    const body = await request.json();

    // Forward the request to the existing Django backend,
    // which already calls the LangChain pipeline in pipeline.py
    const backendResponse = await fetch("http://localhost:8000/api/generate-blog/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json().catch(() => null);

    return new Response(JSON.stringify(data ?? { detail: "Invalid JSON from backend" }), {
      status: backendResponse.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in Next.js API route /api/generate-blog:", error);
    return new Response(
      JSON.stringify({ detail: "Error while calling backend API", error: String(error) }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
