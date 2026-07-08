# CI/CD und Deployment-Regeln (Projekt: KMI Orchestrator)

## Zweck
Diese Datei beschreibt projektspezifische Regeln für Build, Deploy, Versionierung, Restart und Zielumgebungen.

## Grundregeln
- Nur deployen, wenn die aktuelle Änderung dies wirklich erfordert.
- Nur neu bauen, wenn ein Rebuild technisch notwendig ist.
- Nur neu starten, wenn Hot-Reload, Reload oder ein reiner Datei-Sync nicht ausreicht.
- Änderungen mit möglichem Betriebsrisiko zuerst knapp benennen.

## Git
- Remote: https://github.com/Benki0815/KMIOrchestrator.git
- Commits klar und kurz auf Englisch formulieren.
- Push nur bei vorhandenem Remote und wenn der Projektablauf dies vorsieht.

## Env-Variablen (lokal, nicht committen)

| Variable | Zweck |
|----------|-------|
| `SOFASCORE_RAPIDAPI_KEY` | SofaScore via RapidAPI (shared BallistiXG) |
| `OPENROUTER_API_KEY` | LLM (neuer Key ausstehend) |
| `SOFASCORE_QUOTA_PROTECT` | Quota-Schutz-Schwelle (default 500) |

Siehe `.env.example` und `docs/integrations/`.

## Versionierung
- Schema (wenn Frontend vorhanden): `v.<MM><DD>.<NNN>` — Tageszähler startet täglich bei 001.

## NAS / SSH
- Standard-Ziel für neue Projekte: **DockerHost274** (nicht Benki-NAS3).
- SSH Host Alias: `dockerhost274` *(projektspezifischer Service-User/Alias noch festzulegen, z. B. `dockerhost274-kmi`)*
- Zielpfad: *(noch festzulegen, z. B. `/data/docker/kmi-orchestrator`)*
- Container-Namen: *(noch festzulegen)*
- Restart nur bei Änderungen an Build-Artefakten, Runtime-Konfiguration oder Container-abhängigen Assets

## Validierung nach Deployment
- Prüfen, ob Container laufen.
- Prüfen, ob Logs offensichtliche Fehler zeigen.
- Prüfen, ob die erwartete Änderung auf der Zielumgebung sichtbar ist.

## Platzhalter für Projektregeln
Ergänze hier bei Bedarf:
- Versionsschema
- Branch-Strategie
- Build-Befehle
- Test-Befehle
- Deploy-Befehle
- Container-/Compose-Befehle
- Abnahme-Checkliste
