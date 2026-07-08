# SofaScore-Integration (KMI Orchestrator)

> Shared credentials with **BallistiXG** via `SOFASCORE_RAPIDAPI_KEY`  
> Full API reference: [`sofascore-sport-api.md`](./sofascore-sport-api.md) (copied from BallistiXG)  
> RapidAPI: [apisummit / Sofascore Sport API](https://rapidapi.com/apisummit/api/sofascore-sport-api)

---

## 1. Verbindung

| Setting | Value |
|---------|-------|
| Host | `sofascore-sport-api.p.rapidapi.com` |
| Base URL | `https://sofascore-sport-api.p.rapidapi.com` |
| Auth | `X-RapidAPI-Key` + `X-RapidAPI-Host` |
| Env | `SOFASCORE_RAPIDAPI_KEY` in `.env` |
| Bundesliga `uniqueTournament.id` | **35** |

Referenz-Implementierung: `BallistiXG/backend/app/services/sofascore_client.py`

---

## 2. Primäre Endpunkte für KMI

### Spieler-Bilder (Cache-Pflicht)

```
GET /api/player/{playerId}/image
```

- Response: Bilddaten (in BallistiXG bei Team-Logos base64-decoded)
- **Nur laden wenn:** `player_image` in DB fehlt oder `cache_expires_at` abgelaufen
- Lokal speichern unter `static/players/{sofascore_id}.png`

### Spieler-Stammdaten & KPIs

| Endpunkt | Zweck | Cache-TTL (Vorschlag) |
|----------|-------|----------------------|
| `GET /api/player/{id}` | Name, Position, Team, marketValue | 7 Tage |
| `GET /api/player/{id}/attribute-overviews` | Skill-Attribute (Attacking, Defending, …) | 7 Tage |
| `GET /api/player/{id}/events/last/0` | Form: Ratings, Goals, Assists, xG pro Spiel | 24 h (Matchday) |
| `GET /api/player/{id}/statistics/seasons` | Verfügbare Saisons | 7 Tage |
| `GET /api/player/{id}/unique-tournament/35/season/{seasonId}/statistics/overall` | **Saison-KPIs BL** | 24 h |
| `GET /api/event/{eventId}/player/{playerId}/statistics` | Einzelspiel-Stats | permanent nach Spielende |
| `GET /api/search/players/{name}` | Kicker→SofaScore Mapping | 30 Tage |

### Liga / Spielplan (on demand)

| Endpunkt | Zweck |
|----------|-------|
| `GET /api/unique-tournament/35/seasons` | Aktuelle Season-ID |
| `GET /api/unique-tournament/35/season/{sid}/events/next/{page}` | Kommende Spiele |
| `GET /api/unique-tournament/35/season/{sid}/events/last/{page}` | Vergangene Spiele |
| `GET /api/team/{teamId}/players` | Kaderliste pro Verein |

---

## 3. Quota-Schutz (MUST FOLLOW)

Übernommen aus BallistiXG-Pattern, angepasst für on-demand-Nutzung.

### 3.1 Prinzipien

1. **Kein Blind-Fetch** – API nur wenn UI/Job es braucht und Cache stale ist
2. **DB-First** – immer Cache prüfen vor HTTP-Request
3. **Quota-Ticker** – jeder Call zählt (auch Fehler), Header `x-ratelimit-*` auswerten
4. **Protect-Threshold** – bei `remaining < SOFASCORE_QUOTA_PROTECT` (default 500): nur kritische Requests
5. **Hard-Stop** – bei `remaining < SOFASCORE_MIN_REMAINING_BEFORE_FETCH` (default 10): keine neuen Calls

### 3.2 Persistenz

```sql
-- system_metrics.key = 'sofascore_quota'
{ "used": N, "limit": N, "remaining": N, "reset_in_seconds": N, "reset_at_utc": "..." }
```

### 3.3 Cache-Tabellen (Vorschlag)

```
sofascore_player_cache
  player_id, endpoint, response_json, fetched_at, expires_at

sofascore_player_image
  player_id, file_path, fetched_at

player_kicker_mapping
  kicker_name, kicker_club, sofascore_player_id, confidence, mapped_at
```

### 3.4 Fetch-Entscheidungslogik

```
function getPlayerSeasonKPIs(playerId):
    cached = db.find(playerId, endpoint="season_stats")
    if cached and not expired(cached):
        return cached.data

    if quota.remaining < MIN_REMAINING:
        return cached.stale_or_null  # stale-while-quota-low

    response = sofascore.fetch(...)
    db.upsert(cache)
    return response
```

### 3.5 Rate-Limiting

- `time.sleep(0.3)` zwischen Batch-Calls (BallistiXG-Standard)
- Kein Bulk-Import aller 500+ Spieler beim Start
- Lazy-Load: Bild + KPIs erst bei Spieler-Detail-Ansicht oder Draft-Shortlist

---

## 4. Kicker ↔ SofaScore Mapping

Kicker-CSV liefert Name + Verein, SofaScore braucht numerische `player.id`.

**Strategie:**
1. `GET /api/search/players/{name}` → Kandidaten
2. Match auf `team.name` / Vereins-Kürzel (FCB, BVB, …)
3. Ergebnis in `player_kicker_mapping` cachen
4. Manuelles Override in UI bei Fehlmatch

---

## 5. Verwendung im KMI-Stack

| Use Case | Datenquelle | API? |
|----------|-------------|------|
| Draft-Baseline | Kicker-CSV + eigene XLSX | Nein |
| Spieler-Bild | SofaScore image | Ja, gecacht |
| Saison-KPIs (Rating, xG) | SofaScore season stats | Ja, gecacht |
| Verletzungen/News | LLM-Recherche | OpenRouter |
| Spieltags-Prognose | XLSX SP01-34 + LLM-Adjust | Teilweise |

---

## 6. Env-Variablen

Siehe `/.env.example` und `/secrets/README.md`.

```env
SOFASCORE_RAPIDAPI_KEY=...
SOFASCORE_QUOTA_PROTECT=500
SOFASCORE_MIN_REMAINING_BEFORE_FETCH=10
```

**Niemals** Keys in Docs oder Commits.
