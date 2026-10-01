// One-line switch: "nvidia" or "gemini".
window.MENTALIST_CONFIG = {
  provider: "nvidia",
  nvidia: { model: "nvidia/nemotron-3-ultra-550b-a55b", url: "https://integrate.api.nvidia.com/v1/chat/completions" },
  gemini: { model: "gemini-2.0-flash" },
  // NVIDIA's API does not allow direct browser calls (no CORS), so it goes through a proxy.
  // "" = same origin (run `python server.py`). Or paste your Cloudflare Worker URL (see worker.js).
  proxyUrl: ""
};
// API keys are NEVER stored in this repo. You paste yours in the page; it stays in your browser (localStorage).
