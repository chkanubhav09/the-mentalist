// One-line switch: "nvidia" or "gemini".
window.MENTALIST_CONFIG = {
  provider: "nvidia",
  nvidia: { model: "nvidia/nemotron-3-ultra-550b-a55b", url: "https://integrate.api.nvidia.com/v1/chat/completions" },
  gemini: { model: "gemini-2.0-flash" },
  // NVIDIA's API does not allow direct browser calls (no CORS), so it goes through a proxy.
  // Hosted Cloudflare Worker holds the NVIDIA key as a secret. "" = same origin (python server.py).
  proxyUrl: "https://the-mentalist-proxy.chkanubhav09.workers.dev/"
};
// API keys are NEVER stored in this repo. You paste yours in the page; it stays in your browser (localStorage).
