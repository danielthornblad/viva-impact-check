export async function onRequestPost(context) {
  const { request } = context;

  let payload = {};
  try {
    payload = await request.json();
  } catch (error) {
    // Ignore JSON parse errors and fall back to an empty payload.
  }

  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  if (!email) {
    return new Response(
      JSON.stringify({ error: "Missing required field: email" }),
      {
        status: 400,
        headers: {
          "content-type": "application/json",
          "cache-control": "no-store",
        },
      },
    );
  }

  return new Response(
    JSON.stringify({
      message: "Login endpoint placeholder",
      email,
    }),
    {
      status: 200,
      headers: {
        "content-type": "application/json",
        "cache-control": "no-store",
      },
    },
  );
}
