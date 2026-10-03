# THE MENTALIST

An unofficial, just-for-fun chatbot that talks like a charming, observant consultant in the style of Patrick Jane from *The Mentalist*. Dark, red-smiley noir theme drawn in plain CSS. Not affiliated with the show, its makers or any network. "Readings" are guesses from what you type, not psychic powers.

## Use it
**Locally (works with NVIDIA, no setup beyond Python):**
```
NVIDIA_API_KEY=nvapi-xxxx python server.py
# open http://localhost:8000
```
Or skip the env var and paste your key in the page's Settings.

**On GitHub Pages:** Gemini works directly in the browser. NVIDIA's API blocks browser calls (no CORS headers; checked), so for NVIDIA deploy the free Cloudflare Worker in `worker.js` and paste its URL in Settings.

## Switching AI provider
Edit one line in `config.js`: `provider: "nvidia"` or `"gemini"`. Default is NVIDIA `nvidia/nemotron-3-ultra-550b-a55b` (free hosted API, rate-limited; get a key at https://build.nvidia.com/nvidia/nemotron-3-ultra-550b-a55b). Gemini key: https://aistudio.google.com/apikey

## Keys
No key is ever committed. Keys live in the env var, a git-ignored `.env`, or your browser's localStorage.

## Status

Tested on 3 Oct 2026 against the live site (https://chkanubhav09.github.io/the-mentalist/) and its Cloudflare Worker proxy. NVIDIA's free hosted endpoint is rate-limited and often returns "Service temporarily overloaded" (503) or drops the connection, and a reply takes roughly 6 to 20 seconds. The page now retries automatically (up to 4 attempts with a short backoff) and shows a "retrying" note while it does. If NVIDIA still fails and a Gemini key is saved in Settings, it falls back to Gemini; otherwise it shows a plain error and you can resend. In a live test after this change, 6 of 6 messages that ran to completion got an in-character reply (2 more test runs were cut off by my test tool, not by the site). The Gemini option (bring your own key, used directly or as the fallback) has not been tested.
