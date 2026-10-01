"""Local server: serves the site and proxies NVIDIA's API (which blocks browser calls).
Usage:  NVIDIA_API_KEY=nvapi-... python server.py   ->  http://localhost:8000
The key is read from the environment (or a git-ignored .env file). No dependencies."""
import http.server, json, os, urllib.request, urllib.error

def load_env():
    try:
        for line in open(".env"):
            if "=" in line and not line.startswith("#"):
                k, v = line.strip().split("=", 1); os.environ.setdefault(k, v)
    except FileNotFoundError:
        pass
load_env()
UPSTREAM = "https://integrate.api.nvidia.com/v1/chat/completions"

class H(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path != "/api/chat":
            self.send_error(404); return
        key = os.environ.get("NVIDIA_API_KEY") or self.headers.get("X-Api-Key", "")
        if not key:
            self.send_error(401, "No NVIDIA key"); return
        body = self.rfile.read(int(self.headers.get("Content-Length", 0)))
        req = urllib.request.Request(UPSTREAM, body, {"Content-Type": "application/json", "Authorization": "Bearer " + key})
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                data, code = r.read(), r.status
        except urllib.error.HTTPError as e:
            data, code = e.read(), e.code
        self.send_response(code); self.send_header("Content-Type", "application/json"); self.end_headers(); self.wfile.write(data)

if __name__ == "__main__":
    print("The Mentalist on http://localhost:8000")
    http.server.ThreadingHTTPServer(("", 8000), H).serve_forever()
