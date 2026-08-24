# Architektur – KMI Orchestrator (MVP)

> Stand: 2026-08-24 · Version `v.0824.012`

## Stack

| Layer | Technik |
|-------|---------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind, Zustand |
| Backend | FastAPI, Pydantic, JSON-File-Persistenz (später SQLite/Postgres) |
| Design | Midnight Scout (Stitch Runde 2) |
| Deploy | Docker Compose → DockerHost274 (Pfad TBD) |

## Module

```
frontend/src/app/page.tsx          Draft Room (Hauptseite)
frontend/src/components/LogPanel.tsx  Persistentes Backend-Log
frontend/src/lib/store.ts          Zustand + localStorage Auto-Save
backend/app/main.py                /health, /api/players, /api/logs, /api/squads/{id}
backend/app/activity_log.py        SQLite-Activity-Log + historischer Backfill
```

## Regeln im Code

- Budget max **42,5 Mio.**
- Kader **3 TOR · 7 ABW · 7 MIT · 5 STU**
- Tabs mit eigenem Risiko-Profil + 5-Sterne
- Auto-Save: Zustand in `localStorage` (`kmi-orchestrator-squads`); API `PUT /api/squads` bereit

## Nächste Phasen

1. Kicker-CSV-Import
2. SofaScore-Cache (Bilder + KPIs) mit Quota-Schutz
3. PuLP/OR-Tools Solver statt Heuristik
4. LLM-Adjustments (OpenRouter)
5. Unterseiten Scouting / Transfermarkt nach Mockup
