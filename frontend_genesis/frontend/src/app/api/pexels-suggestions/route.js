export async function GET(request) {
  const q = new URL(request.url).searchParams.get("q");

  const res = await fetch(
    `http://localhost:8000/api/pexels-suggestions/?q=${encodeURIComponent(q)}`
  );

  return new Response(await res.text(), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
