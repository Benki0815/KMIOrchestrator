# KMI Orchestrator – Projekt-Setup

## Struktur
- `/docs` — Projektdokumentation (Deutsch)
- `/.cursor/rules` — Cursor-Agent-Regeln
- `/.github` — lokale Extension-Hooks (bewusst nicht committen)

## Git
- Repository: https://github.com/Benki0815/KMIOrchestrator.git
- Workspace: `C:\Dev\KMI Orchestrator`

## Deploy-Ziel
- **DockerHost274** — Service-User `kmi-svc`, Pfad `/data/docker/kmi-orchestrator/`
- Details: [`cicd.md`](cicd.md)
- URLs: LAN `http://192.168.178.251:3050/` · Tailscale `http://100.84.97.16:3050/`

## Dokumentation
- [Konzept Kicker Managerspiel](konzept-kicker-managerspiel.md)
- [Architektur MVP](architektur-mvp.md)
- [Draft Orchestrator UI](konzept-draft-orchestrator-ui.md)
- [Wireframe Kader-Orchestrator](wireframe-draft-orchestrator.md)
- [Stitch Handover](stitch-handover.md)
- [Spielregeln Kicker IA](spielregeln-kicker-ia.md)
- [CI/CD und Deployment](cicd.md)
- [Dockerhost274 Einmal-Setup](setup-dockerhost274.md)
- [SofaScore-Integration](integrations/sofascore-kmi.md)
- [Kader-Ingest / Spielerpool](kader-ingest.md)
- [Tauschen](tauschen.md)
- [Scout-Quellen](scout-quellen.md)
- [OpenRouter-Integration](integrations/openrouter.md)

## Credentials
- `.env` (gitignored) — kopiert aus BallistiXG, OpenRouter-Key wird ersetzt
- Template: `.env.example`
- Details: `secrets/README.md`

## Status

| Bereich | Stand |
|---------|-------|
| Architektur & Interview | ✅ |
| Spielregeln | ✅ |
| Draft-UI Wireframe + Stitch | ✅ Midnight Scout gewählt |
| **Frontend Draft Room** | ✅ Pitch, Bank, Pool, Varianten-Tabs, Tauschen, Auto-Save |
| **Backend API** | ✅ FastAPI + SQLite; Ingest, CSV-Overlay, Activity-Log |
| Punkte / Prognose | ✅ Pkt 25/26, xPunkte, 2L-Stale-Regel, Deal-Score |
| Solver / SofaScore live / LLM | ❌ Phase 2 |
| DockerHost-Deploy | ✅ `kmi-frontend` / `kmi-backend` auf :3050 / :8050 |
| Homepage-Kachel | ✅ `kmi-orchestrator` (LAN/Tailscale Auto-Switch) |

**Urlaubsfreeze 2026-09-04:** Stand `v.0904.001` ist committed und auf `origin/main`. Stitch-Zip bleibt lokal (gitignored).

## Lokal starten

```bash
# Frontend
cd frontend && npm run dev
# → http://localhost:3000

# Backend
cd backend && pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
# → http://localhost:8000/health
```

Version: `v.0904.001` (`frontend/src/lib/version.ts`, `frontend/package.json`, `backend/app/main.py`)
