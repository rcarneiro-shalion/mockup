#!/bin/bash
# Build a double-clickable macOS app icon for the Visionary Mockup Builder.
#
#   ▶ Double-click THIS file once. It creates "Massive Update.app" on your Desktop
#     with the Shalion icon. From then on, double-click that app (or drag it to the
#     Dock) to start the mockup — no Terminal needed to launch it.
#
# The app just runs ./start-app.command in this repo, so the repo can live anywhere
# (the path is captured at build time). Re-run this if you move the repo.

set -euo pipefail

# Repo root = the parent of this scripts/ folder (resolve symlinks + spaces safely).
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$SCRIPT_DIR/.." && pwd)"
LAUNCHER="$REPO/start-app.command"
APP="$HOME/Desktop/Massive Update.app"

echo "============================================"
echo "  Building the Massive Update app icon"
echo "============================================"
echo "Repo:     $REPO"
echo "Launcher: $LAUNCHER"
echo "Output:   $APP"
echo

if [ ! -f "$LAUNCHER" ]; then
  echo "❌ Can't find start-app.command next to this script. Keep make-mac-app.command"
  echo "   inside the repo's scripts/ folder."
  echo "Press any key to close…"; read -r -n1; exit 1
fi
chmod +x "$LAUNCHER" || true

# 1) Compile a tiny AppleScript app that opens the launcher (which opens the browser).
rm -rf "$APP"
TMP_SCPT="$(mktemp -t launch).applescript"
printf 'do shell script "open " & quoted form of "%s"\n' "$LAUNCHER" > "$TMP_SCPT"
osacompile -o "$APP" "$TMP_SCPT"
rm -f "$TMP_SCPT"
echo "✓ App bundle created."

# 2) Give it the Shalion favicon as its icon (best-effort; needs sips + iconutil).
ICON_SRC="$REPO/public/favicon.ico"
if command -v sips >/dev/null 2>&1 && command -v iconutil >/dev/null 2>&1 && [ -f "$ICON_SRC" ]; then
  ISET="$(mktemp -d)/icon.iconset"; mkdir -p "$ISET"
  # name=pixels pairs for the standard macOS iconset
  for pair in 16x16=16 16x16@2x=32 32x32=32 32x32@2x=64 128x128=128 128x128@2x=256 256x256=256 256x256@2x=512 512x512=512 512x512@2x=1024; do
    name="${pair%=*}"; px="${pair#*=}"
    sips -s format png -z "$px" "$px" "$ICON_SRC" --out "$ISET/icon_${name}.png" >/dev/null 2>&1 || true
  done
  if iconutil -c icns "$ISET" -o "$APP/Contents/Resources/applet.icns" >/dev/null 2>&1; then
    touch "$APP"                      # nudge Finder/Dock to pick up the new icon
    echo "✓ Icon applied (Shalion favicon)."
  else
    echo "⚠ Couldn't build the .icns — the app will use the generic icon (still works)."
  fi
  rm -rf "$(dirname "$ISET")"
else
  echo "⚠ sips/iconutil or public/favicon.ico unavailable — using the generic icon (still works)."
fi

echo
echo "✅ Done. On your Desktop: \"Massive Update.app\""
echo "   • Double-click it to start the mockup (opens a small Terminal window that"
echo "     keeps the server running — close that window to stop)."
echo "   • Drag it onto the Dock to pin it."
echo "   • First launch may warn it's from an unidentified developer →"
echo "     right-click the app ▸ Open ▸ Open (only needed once)."
echo
echo "If the icon still looks generic, give Finder a moment or log out/in once."
echo
echo "Press any key to close…"; read -r -n1
