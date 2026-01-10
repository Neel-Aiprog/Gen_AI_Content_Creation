const BACKEND_URL = process.env.BACKEND_URL || 'https://gen-ai-content-creation.onrender.com';

export async function GET(request) {
  const q = new URL(request.url).searchParams.get("q");

  const res = await fetch(
    `${BACKEND_URL}/api/pexels-suggestions/?q=${encodeURIComponent(q)}`
  );

  return new Response(await res.text(), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
