# Activity-Log

> Stand: 2026-08-24 · Version `v.0824.012`

Persistentes Ereignisprotokoll aller relevanten Backend-Vorgänge. Anzeige im Portal unter **Log**.

## Speicherung

Tabelle `activity_log` in der SQLite-DB (`fingerprint` eindeutig). Einträge überleben Restarts.

Felder: Zeitstempel, Status (`ok` / `warning` / `error` / `running`), Kategorie, Titel, Nachricht, Details.

## Quellen

| Kategorie | Wann |
|-----------|------|
| `media` | Video/Podcast geladen bzw. transkribiert (aus Mention-/Team-Quellen rekonstruiert) |
| `ingest` | Spieler-, Team- oder Scout-DB-Import; „Daten in DB eingetragen“ je Quelle |
| `sync` | SofaScore-Abgleich |
| `backup` | Datenbank-Backup |

Historische Einträge werden beim Backend-Start aus Mentions, Team-Quellen und `system_metrics` nachgezogen. Neue Ingests schreiben zusätzlich Live-Events und aktualisieren die Quellen-Zeilen.

## API

`GET /api/logs?limit=400` — neueste zuerst.

## UI

Nav-Punkt **Log**. Filter nach Kategorie/Fehler, Suche, Auto-Refresh 15s.
