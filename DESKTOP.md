# Desktop app (macOS & Windows)

The mockup ships as an installable desktop app via **Electron**. The desktop
build emits Nitro's standalone Node server (`NITRO_PRESET=node-server`) and runs
it inside Electron, so the app behaves exactly like the deployed web version
(SSR, routing, server functions). Data still lives in `localStorage`, persisted
in Electron's per-app user-data directory across launches.

## Getting the installers (no build machine needed)

1. Go to **GitHub → Actions → "Desktop installers" → Run workflow**, or push a
   tag like `v1.0.0`.
2. The workflow builds on native runners:
   - **macOS** → `Shalion Mockup-<version>-universal.dmg` (Intel + Apple Silicon)
   - **Windows** → `Shalion Mockup Setup <version>.exe` (NSIS installer)
3. Download them from the run's **Artifacts**, or — when triggered by a tag —
   from the auto-created **GitHub Release**.

## First run (unsigned build)

The installers are **not code-signed** (internal tool), so the OS warns on first
launch:

- **macOS:** right-click the app → **Open**, then confirm. (Or System Settings →
  Privacy & Security → "Open anyway".)
- **Windows:** SmartScreen → **More info** → **Run anyway**.

## Building locally

macOS (produces a universal `.dmg` in `dist-desktop/`):

```bash
npm install
npm run desktop          # = NITRO_PRESET=node-server vite build && electron-builder
```

Faster unpacked build for testing (no installer, just the `.app`):

```bash
npm run desktop:dir
```

Windows installer must be built on Windows (or via the CI workflow):

```powershell
$env:NITRO_PRESET="node-server"; npm run build
npx electron-builder --win
```

## Layout

- `electron/main.cjs` — spawns the bundled Nitro server on a free loopback port,
  waits for it, then loads it in a window.
- `electron/preload.cjs` — isolated, exposes nothing.
- `electron-builder.yml` — packaging config (targets, icon, unsigned).
- `.github/workflows/desktop.yml` — CI that builds both installers.
- `build/icon.png` — app icon (electron-builder derives `.icns`/`.ico`).
