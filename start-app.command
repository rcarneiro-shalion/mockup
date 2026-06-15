#!/bin/bash
# Double-click launcher for the Visionary Mockup Builder (Ecometry console mockup).
# Starts the local dev server (which includes the live-data proxy) and opens the
# app in your browser. Keep this window open while you use the app — closing it
# stops the server.

cd "$(cd "$(dirname "$0")" && pwd)" || exit 1

clear
echo "============================================"
echo "  Visionary Mockup Builder — Ecometry"
echo "============================================"
echo

if ! command -v node >/dev/null 2>&1; then
  echo "❌ Node.js is not installed."
  echo "   Install it from https://nodejs.org (LTS), then double-click this again."
  echo
  echo "Press any key to close…"; read -r -n1; exit 1
fi
echo "✓ Node $(node -v)"

if [ ! -d node_modules ]; then
  echo "📦 First run — installing dependencies (a few minutes)…"
  npm install || { echo "❌ npm install failed."; echo "Press any key…"; read -r -n1; exit 1; }
fi

LOG="$(mktemp -t mockup-dev)"
echo "🚀 Starting the app…  (closing this window stops it)"
npm run dev >"$LOG" 2>&1 &
SERVER_PID=$!
trap 'echo; echo "Stopping…"; kill $SERVER_PID 2>/dev/null; rm -f "$LOG"; exit 0' INT TERM

# Wait for Vite to print its Local URL, then open the browser.
URL=""
for _ in $(seq 1 80); do
  if ! kill -0 $SERVER_PID 2>/dev/null; then
    echo "❌ The server stopped. Last output:"; tail -n 20 "$LOG"; echo
    echo "Press any key…"; read -r -n1; exit 1
  fi
  URL="$(grep -oE 'http://localhost:[0-9]+' "$LOG" | head -1)"
  [ -n "$URL" ] && break
  sleep 0.5
done
[ -z "$URL" ] && URL="http://localhost:8080"

echo "🌐 Opening $URL"
open "$URL"
echo
echo "App is running. Paste your tokens via the 🔑 in the top bar for live data."
echo "Leave this window open. Press Ctrl-C (or close it) to stop."
echo
# Stream server logs and keep the process alive.
tail -f "$LOG"
