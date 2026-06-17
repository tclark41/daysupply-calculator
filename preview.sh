#!/usr/bin/env bash
#
# preview.sh — serve the calculator locally so you can check edits before
# publishing. Opens a local web server (the PWA/service worker needs http,
# not file://, to behave like the live site).
#
#   ./preview.sh         then open the printed URL; Ctrl-C to stop.
#
set -euo pipefail
cd "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

PORT="${1:-8000}"
echo "Serving the calculator at:  http://127.0.0.1:${PORT}/"
echo "Open that in a browser to test your edits.  Press Ctrl-C to stop."
exec python3 -m http.server "$PORT" --bind 127.0.0.1
