// Cloudflare Worker proxy for NVIDIA's hosted API. The key lives ONLY in the Worker secret NVIDIA_API_KEY.
// Visitors never see or send a key. Locked to the site's origin; best-effort per-IP rate limit.
const ALLOWED = ["https://chkanubhav09.github.io"];
const MODEL = "nvidia/nemotron-3-ultra-550b-a55b";
const LIMIT = 20, WINDOW_MS = 60_000; // requests per IP per minute (per isolate, best effort)
const hits = new Map();

export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin") || "";
    const ok = ALLOWED.includes(origin);
    const cors = {
      "Access-Control-Allow-Origin": ok ? origin : ALLOWED[0],
      "Access-Control-Allow-Headers": "content-type",
      "Access-Control-Allow-Methods": "POST,OPTIONS",
      "Vary": "Origin",
    };
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });
    if (req.method !== "POST") return new Response("POST only", { status: 405, headers: cors });
    if (!ok) return new Response(JSON.stringify({ error: { message: "Origin not allowed" } }), { status: 403, headers: cors });
    if (!env.NVIDIA_API_KEY) return new Response(JSON.stringify({ error: { message: "Server key not set" } }), { status: 500, headers: cors });

    const ip = req.headers.get("CF-Connecting-IP") || "?", now = Date.now();
    const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
    if (recent.length >= LIMIT) return new Response(JSON.stringify({ error: { message: "Slow down a little (rate limit)" } }), { status: 429, headers: cors });
    recent.push(now); hits.set(ip, recent);
    if (hits.size > 5000) hits.clear();

    let body;
    try { body = await req.json(); } catch { return new Response(JSON.stringify({ error: { message: "Bad JSON" } }), { status: 400, headers: cors }); }
    const messages = Array.isArray(body.messages) ? body.messages.slice(-30) : [];
    if (!messages.length || JSON.stringify(messages).length > 30000)
      return new Response(JSON.stringify({ error: { message: "Bad or too long messages" } }), { status: 400, headers: cors });

    const r = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + env.NVIDIA_API_KEY },
      body: JSON.stringify({ model: MODEL, messages, max_tokens: Math.min(+body.max_tokens || 600, 800), temperature: Math.min(+body.temperature || 0.8, 1.2) }),
    });
    return new Response(r.body, { status: r.status, headers: { ...cors, "Content-Type": "application/json" } });
  },
};
