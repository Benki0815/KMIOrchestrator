# KMI Orchestrator – Projekt-Setup

## Struktur
- `/docs` — Projektdokumentation (Deutsch)
- `/.cursor/rules` — Cursor-Agent-Regeln
- `/.github` — lokale Extension-Hooks (bewusst nicht committen)

## Git
- Repository: https://github.com/Benki0815/KMIOrchestrator.git
- Workspace: `C:\Dev\KMI Orchestrator`

## NAS
- Geplantes Ziel: **DockerHost274** (Details in `cicd.md` ergänzen, sobald Deploy-Pfad und Service-User feststehen)

## Dokumentation
- [Konzept Kicker Managerspiel](konzept-kicker-managerspiel.md)
- [Draft Orchestrator UI](konzept-draft-orchestrator-ui.md)
- [Wireframe Kader-Orchestrator](wireframe-draft-orchestrator.md)
- [Stitch Handover](stitch-handover.md)
- [Spielregeln Kicker IA](spielregeln-kicker-ia.md)
- [CI/CD und Deployment](cicd.md)
- [SofaScore-Integration](integrations/sofascore-kmi.md)
- [OpenRouter-Integration](integrations/openrouter.md)

## Credentials
- `.env` (gitignored) — kopiert aus BallistiXG, OpenRouter-Key wird ersetzt
- Template: `.env.example`
- Details: `secrets/README.md`

## Status (Konzeptphase)

| Bereich | Stand |
|---------|-------|
| Architektur & Interview | ✅ `konzept-kicker-managerspiel.md` |
| Spielregeln | ✅ `spielregeln-kicker-ia.md` |
| Draft-UI & Wireframe | ✅ inkl. Auto-Save, Tabs, 5-Sterne |
| Stitch Runde 1 | ⏳ `stitch-handover.md` — 3 Desktop-Varianten |
| Implementierung | ❌ noch nicht gestartet |

## Offene Punkte

- OpenRouter: neuer API-Key + Modellwahl
- NAS: SSH-Alias (`dockerhost274-kmi`?) und Deploy-Pfad
- Kicker-CSV: Live-Spaltenmapping beim ersten Export
- Kicker↔SofaScore: Spieler-Mapping-Strategie
- Stitch Runde 2: Unterseiten nach Template-Freigabe
