# Architektur – KMI Orchestrator (MVP)

> Stand: 2026-09-04 · Version `v.0904.001`

## Stack

| Layer | Technik |
|-------|---------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind, Zustand |
| Backend | FastAPI, Pydantic, SQLite (`backend/data/`) |
| Design | Midnight Scout (Stitch Runde 2) |
| Deploy | Docker Compose → DockerHost274 `/data/docker/kmi-orchestrator/` |

## Module

```
frontend/src/app/page.tsx                    Draft Room (Hauptseite)
frontend/src/components/PitchView.tsx        Startelf + Varianten-Badges
frontend/src/components/BankPanel.tsx        Bank
frontend/src/components/PlayerPoolPanel.tsx  Spielerpool
frontend/src/lib/scoring.ts                  Pkt 25/26, xPunkte, Stale-2L, Anzeige-Fallback
frontend/src/lib/squadVariants.ts            Variantenbuchstaben A/B/C …
backend/app/main.py                          /health, /api/players, /api/logs, /api/squads/{id}
backend/app/activity_log.py                  SQLite-Activity-Log + historischer Backfill
```

## Regeln im Code

- Budget max **42,5 Mio.**
- Kader **3 TOR · 7 ABW · 7 MIT · 5 STU**
- Tabs mit eigenem Risiko-Profil + 5-Sterne
- Auto-Save: Zustand in `localStorage` (`kmi-orchestrator-squads`); API `PUT /api/squads` bereit
- Offizielle Kaderquelle: Kicker-CSV `se-k00012026` als Overlay nach jedem Ingest (`POST /api/admin/ingest/refresh-squad`)
- Spieler, die in mehreren Varianten stehen, tragen A/B/C-Badges auf Chip, Bank und in Listen

## Punkte (Kurz)

Siehe [`kader-ingest.md`](kader-ingest.md). Rohwert **Pkt 25/26** bleibt CSV (0 bei Transfers ohne Kicker-Jahr). UI zeigt xPunkte, sonst 25/26 (Toggle kreuzt die Lücken). 2L-Archivpunkte nur ersetzen, wenn sie selbst als All-Subs unmöglich sind. BL-CSV nie anfassen.

## Nächste Phasen

1. SofaScore-Cache (Bilder + KPIs) mit Quota-Schutz – Mapping über Team-Rosters ist dokumentiert
2. PuLP/OR-Tools Solver statt Heuristik
3. LLM-Adjustments (OpenRouter, Key ausstehend)
4. Unterseiten Scouting / Transfermarkt nach Mockup
