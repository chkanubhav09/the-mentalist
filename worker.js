// Optional free Cloudflare Worker proxy so the GitHub Pages site can reach NVIDIA's API.
// Deploy at dash.cloudflare.com > Workers > Create > paste this. Set ALLOWED_ORIGIN below to your Pages URL.
// The visitor's key is forwarded per request and is never stored.
const ALLOWED_ORIGIN = "https://chkanubhav09.github.io";
export default {
  async fetch(req) {
    const cors = { "Access-Control-Allow-Origin": ALLOWED_ORIGIN, "Access-Control-Allow-Headers": "content-type,x-api-key", "Access-Control-Allow-Methods": "POST,OPTIONS" };
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });
    if (req.method !== "POST") return new Response("POST only", { status: 405, headers: cors });
    const r = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + (req.headers.get("x-api-key") || "") },
      body: await req.text(),
    });
    return new Response(r.body, { status: r.status, headers: { ...cors, "Content-Type": "application/json" } });
  },
};
