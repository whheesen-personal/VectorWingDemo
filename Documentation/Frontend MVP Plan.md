## Frontend MVP plan (8 hours, minimal setup, good-looking)

### Goal
Deliver a polished, clickable scheduling mock that demonstrates key UX: resource timeline, drag-and-drop, conflicts, mission details, and an authorization flow indicator. Zero backend. Hostable on GitHub Pages or any static host.

### Approach
- Use a static, zero-build stack to eliminate setup and CI friction:
  - React 18 (UMD), MUI (UMD), and vis-timeline (UMD) via CDN in a single-page app.
  - Custom CSS for branding; MUI components for consistent, professional look.
  - All assets under `prototype-ui/` so it can be opened locally or published to GitHub Pages.

### Scope (what we’ll show)
- Top app bar, sidebar filters (Aircraft/Instructor toggles, date range), main timeline.
- Resource timeline (aircraft tails) with missions (color-coded by status: Planned, Authorized, Canceled).
- Drag-and-drop on timeline; visual conflict cue when overlapping same resource.
- Click mission → details dialog (crew, times, notes) + “Authorize Mission” button.
- Authorization sets status to Authorized and updates timeline badge/icon.
- Toolbar actions: Day/Week toggle, quick “Publish Day” and “Export PDF” (non-functional stubs with toasts for demo).

### Hosting options
- GitHub Pages: push `prototype-ui/` to `gh-pages` branch (or configure Pages to serve `/prototype-ui`).
- Vercel/Netlify: drag-and-drop folder or link repo; no build required.

### Time-boxed breakdown (8 hours)
- 1.0h: Project skeleton, CDN wiring, layout (AppBar, Sidebar, Main).
- 2.0h: Timeline integration (vis-timeline), resource groups, items, styling.
- 1.5h: Interactions (drag, resize, click), conflict cues, status colors.
- 1.0h: Mission dialog + Authorize flow (UI state + timeline update).
- 1.0h: Polish (icons, badges, day/week switch, toasts, responsive tweaks).
- 1.0h: QA pass on Chrome/Edge, mobile responsiveness, small fixes.
- 0.5h: README + deployment notes (GH Pages / Vercel).

### Deliverables
- `prototype-ui/index.html`, `prototype-ui/styles.css`, `prototype-ui/app.js`
- `prototype-ui/README.md` with one‑page deploy instructions
- Looks modern (MUI), performs smoothly (only demo data), zero backend.

### Future extension (post‑demo)
- Replace vis-timeline with the selected commercial component (Syncfusion) in a full React build.
- Wire to NestJS APIs, auth with Keycloak/WebAuthn, real data.


