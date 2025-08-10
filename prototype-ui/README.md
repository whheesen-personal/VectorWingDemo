# Flight Training Scheduler — Prototype UI (Static)

A zero-build, static prototype showcasing a polished scheduling timeline, mission details dialog, and authorization status. Uses React + MUI + vis-timeline via CDN so it can be opened locally or hosted on any static host.

## Run locally
- Open `index.html` in a browser, or serve the folder with any static server.

## Deploy to GitHub Pages (no build)
- Option A (root Pages):
  - Commit this folder in the repo, then in GitHub → Settings → Pages, set Source to `Deploy from a branch`, pick `main` and `/root` (or `/docs` if you move it there).
- Option B (gh-pages branch):
  - Copy contents of `prototype-ui/` to a `gh-pages` branch root and enable Pages from that branch.

## What’s included
- `index.html`: loads React 18, MUI, vis-timeline from CDN; mounts the app.
- `styles.css`: dark themed styles and timeline item status styles.
- `app.js`: demo groups/items, timeline with drag/resize, conflict highlighting, mission dialog and authorize/cancel actions.

## Notes
- This is a mock only: no backend, all changes are in-memory.
- Replace vis-timeline with the selected commercial scheduler in the full build.
- Works on modern Chromium/Edge/Firefox.
