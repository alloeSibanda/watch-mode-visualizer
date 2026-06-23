# watch-mode-visualizer

> Interactive web app for the watch modding community — mix and match cases, dials, chapter rings, and hands in real time, with an AI-assisted pipeline that turns a messy smartphone photo of a real part into a clean, transparent layer ready to drop on the canvas.

**Status:** 🚧 In active development. Architecture and CI/CD pipeline below reflect the current build plan; see [Roadmap](#roadmap) for what's live vs. planned.

---

## What it does

Watch modding (building custom watches from interchangeable parts) is a visual, trial-and-error hobby — people currently do this by eyeballing part photos in image editors or forum threads. This app gives them a real canvas: drag a case, a dial, and a hand set together, see them stack and scale correctly based on real part dimensions (a 30.5mm dial vs a 28.5mm dial renders proportionally differently inside the same case), and iterate in seconds instead of minutes.

The differentiator is the upload pipeline: instead of only offering a fixed library of pre-cut part images, a user can photograph their own component at an angle, on a messy background — the backend straightens the perspective and removes the background automatically, turning it into a usable layer.

## Why this project

Watch modding is a personal hobby of mine — I own a fair collection of custom-built watches and have spent a lot of time mixing and matching parts by hand, so this project scratches my own itch as much as anyone else's.

Professionally, I work in DevOps, and built this to pair infrastructure/CI-CD work with applied AI — specifically computer vision (OpenCV) and a lightweight segmentation model (MobileSAM) running behind a real deployment pipeline, not just a notebook demo. The repo is structured to show both halves: a production-shaped AWS pipeline, and a working ML inference path with real tradeoffs (model size vs. accuracy, sync vs. async processing, GPU cost).

## Architecture

| Layer | Technology | Role |
|---|---|---|
| Frontend | React (Vite) | UI shell — sidebar, part library, controls |
| Canvas | Fabric.js / HTML5 Canvas | Layered, draggable, rotatable, Z-indexed part rendering |
| Auth | Auth0 *(TBD vs. Cognito)* | User accounts, saved builds |
| Static hosting | Amazon S3 | Serves compiled React build |
| Backend API | Python (FastAPI) | Upload handling, orchestrates CV/ML inference |
| Computer vision | OpenCV | Perspective correction (flattens angled photos) |
| Segmentation | MobileSAM | Background removal / part isolation |
| Compute | Amazon EC2 | Hosts FastAPI + CV/ML inference process |
| Data | PostgreSQL (Supabase) | Part metadata, dimensions, user builds |

### System overview

```
[React + Fabric.js] ──HTTP──► [FastAPI on EC2] ──► [OpenCV: perspective warp]
        ▲                                                    │
        │                                          [MobileSAM: background removal]
        │                                                    │
        └─────────────── transparent PNG layer ◄─────────────┘

[React] ◄──direct read──► [Supabase Postgres]   (part library, saved builds)
```

### CI/CD pipeline

```
Local (VS Code) ──git push──► GitHub ──► GitHub Actions (OIDC, no static AWS keys)
                                              │
                          ┌───────────────────┴───────────────────┐
                          ▼                                       ▼
                  Frontend job                            Backend job
                  • Build React (Vite)                    • Deploy to EC2
                  • Sync to S3                             • Restart FastAPI process
```

Authentication to AWS uses OIDC federation rather than long-lived access keys stored in GitHub secrets — this is the part I'd point to as the actual DevOps content here, distinct from the ML/CV side.

## Tech decisions worth calling out

- **MobileSAM over full SAM** — smaller memory footprint, runs acceptably on a modest EC2 instance instead of requiring a dedicated GPU box, while still handling single-object segmentation well.
- **EC2, not Lambda, for inference** — OpenCV + MobileSAM benefit from a warm, persistent process; cold-starting a several-hundred-MB model on every request would kill latency and cost.
- **Supabase Postgres from day one** (not SQLite) — avoids a migration once multiple users are saving builds concurrently.
- **Manual-assist CV pipeline before full automation** — perspective correction via auto-detected edges and prompt-free segmentation are both real failure-prone problems on reflective metal parts; the first working version uses lightweight user input (tap 4 corners, tap a center point) to make the underlying CV/ML reliable before investing in full automation.

## Roadmap

- [ ] Canvas core — drag, rotate, scale, Z-index stacking
- [ ] Part library + dimension-aware scaling
- [ ] Auth + save/load builds
- [ ] AI upload pipeline (v1: manual-assist perspective + segmentation)
- [ ] AI upload pipeline (v2: automated detection)
- [ ] CI/CD pipeline (GitHub Actions → S3 + EC2 via OIDC)
- [ ] Affiliate links / monetization layer

## Local development

*(to be filled in once the frontend scaffold exists)*

## License

*(choose one — MIT is the common default for portfolio projects)*
