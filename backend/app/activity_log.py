from __future__ import annotations

import json
import sqlite3
from datetime import datetime, timedelta, timezone
from typing import Any

STATUSES = ("ok", "warning", "error", "running")
CATEGORIES = ("media", "ingest", "sync", "backup", "system")


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _parse_dt(raw: str | None) -> datetime | None:
    if not raw:
        return None
    text = str(raw).strip()
    if not text:
        return None
    try:
        if len(text) == 10 and text[4] == "-" and text[7] == "-":
            return datetime.fromisoformat(text).replace(tzinfo=timezone.utc)
        return datetime.fromisoformat(text.replace("Z", "+00:00"))
    except ValueError:
        return None


def _iso(dt: datetime) -> str:
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc).isoformat()


def _json_list(raw: str | None) -> list[Any]:
    if not raw:
        return []
    try:
        data = json.loads(raw)
    except Exception:  # noqa: BLE001
        return []
    return data if isinstance(data, list) else []


def _json_dict(raw: str | None) -> dict[str, Any]:
    if not raw:
        return {}
    try:
        data = json.loads(raw)
    except Exception:  # noqa: BLE001
        return {}
    return data if isinstance(data, dict) else {}


def _media_kind(source_type: str | None, source_url: str | None) -> str:
    blob = f"{source_type or ''} {source_url or ''}".lower()
    if any(token in blob for token in ("podcast", "spotify", "rss", "acast")):
        return "Podcast"
    if any(token in blob for token in ("youtube", "video", "short", "yt")):
        return "Video"
    return "Quelle"


def _display_title(source_title: str | None, source_name: str | None) -> str:
    title = (source_title or "").strip()
    if title:
        return title
    name = (source_name or "").strip()
    return name or "Unbekannte Quelle"


def _media_key(
    source_url: str | None,
    source_name: str | None,
    source_title: str | None,
    published: str | None,
) -> str:
    url = (source_url or "").strip().lower()
    if url:
        return url
    title = (source_title or source_name or "unbekannt").strip().lower()
    pub = (published or "")[:10]
    return f"{title}|{pub}"


def upsert_event(
    conn: sqlite3.Connection,
    *,
    fingerprint: str,
    created_at: str,
    status: str,
    category: str,
    title: str,
    message: str,
    details: dict[str, Any] | None = None,
    keep_timestamp: bool = True,
) -> None:
    payload = json.dumps(details or {}, ensure_ascii=False)
    if keep_timestamp:
        conn.execute(
            """
            INSERT INTO activity_log (
                fingerprint, created_at, status, category, title, message, details_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(fingerprint) DO UPDATE SET
                status = excluded.status,
                category = excluded.category,
                title = excluded.title,
                message = excluded.message,
                details_json = excluded.details_json
            """,
            (fingerprint, created_at, status, category, title, message, payload),
        )
        return
    conn.execute(
        """
        INSERT INTO activity_log (
            fingerprint, created_at, status, category, title, message, details_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(fingerprint) DO UPDATE SET
            created_at = excluded.created_at,
            status = excluded.status,
            category = excluded.category,
            title = excluded.title,
            message = excluded.message,
            details_json = excluded.details_json
        """,
        (fingerprint, created_at, status, category, title, message, payload),
    )


def log_event(
    conn: sqlite3.Connection,
    *,
    status: str,
    category: str,
    title: str,
    message: str,
    details: dict[str, Any] | None = None,
    fingerprint: str | None = None,
    created_at: str | None = None,
) -> None:
    stamp = created_at or _now()
    upsert_event(
        conn,
        fingerprint=fingerprint or f"live:{category}:{stamp}:{title}",
        created_at=stamp,
        status=status,
        category=category,
        title=title,
        message=message,
        details=details,
        keep_timestamp=False,
    )


def _join_parts(parts: list[str]) -> str:
    if not parts:
        return "keine neuen Datensätze"
    if len(parts) == 1:
        return parts[0]
    return ", ".join(parts[:-1]) + " und " + parts[-1]


def _collect_media_groups(conn: sqlite3.Connection) -> dict[str, dict[str, Any]]:
    groups: dict[str, dict[str, Any]] = {}

    def bucket(key: str) -> dict[str, Any]:
        item = groups.get(key)
        if item is None:
            item = {
                "key": key,
                "source_type": None,
                "source_name": None,
                "source_title": None,
                "source_url": None,
                "published": None,
                "player_ids": set(),
                "mentions": 0,
                "scores": 0,
                "team_names": set(),
                "injuries": 0.0,
            }
            groups[key] = item
        return item

    def absorb_source(item: dict[str, Any], src: dict[str, Any]) -> None:
        item["source_type"] = item["source_type"] or src.get("source_type") or src.get("sourceType")
        item["source_name"] = item["source_name"] or src.get("source_name") or src.get("sourceName")
        item["source_title"] = item["source_title"] or src.get("source_title") or src.get("sourceTitle")
        item["source_url"] = item["source_url"] or src.get("source_url") or src.get("sourceUrl")
        published = src.get("published")
        if published and (not item["published"] or str(published) > str(item["published"])):
            item["published"] = published

    for row in conn.execute("SELECT player_id, mentions_json FROM players"):
        for mention in _json_list(row["mentions_json"]):
            if not isinstance(mention, dict):
                continue
            key = _media_key(
                mention.get("source_url") or mention.get("sourceUrl"),
                mention.get("source_name") or mention.get("sourceName"),
                mention.get("source_title") or mention.get("sourceTitle"),
                mention.get("published"),
            )
            item = bucket(key)
            absorb_source(item, mention)
            item["player_ids"].add(row["player_id"])
            item["mentions"] += 1
            if mention.get("rating_label") or mention.get("ratingLabel"):
                item["scores"] += 1

    for row in conn.execute("SELECT team, sources_json, verletzungen_json FROM teams"):
        injuries = _json_list(row["verletzungen_json"])
        sources = _json_list(row["sources_json"])
        if not sources:
            continue
        share = max(1, len(sources))
        injury_share = len(injuries) / share
        for src in sources:
            if not isinstance(src, dict):
                continue
            key = _media_key(
                src.get("sourceUrl") or src.get("source_url"),
                src.get("sourceName") or src.get("source_name"),
                src.get("sourceTitle") or src.get("source_title"),
                src.get("published"),
            )
            item = bucket(key)
            absorb_source(item, src)
            item["team_names"].add(row["team"])
            item["injuries"] += injury_share

    return groups


def sync_media_events(conn: sqlite3.Connection) -> int:
    """Reconstruct loaded / transcribed / ingested events from existing source data."""
    conn.execute(
        "DELETE FROM activity_log WHERE fingerprint LIKE 'media:load:%' OR fingerprint LIKE 'media:transcribe:%'"
    )
    written = 0
    for item in _collect_media_groups(conn).values():
        kind = _media_kind(item["source_type"], item["source_url"])
        title = _display_title(item["source_title"], item["source_name"])
        published = _parse_dt(item["published"]) or datetime(2026, 8, 1, 12, 0, tzinfo=timezone.utc)
        if published.hour == 0 and published.minute == 0 and published.second == 0:
            loaded_at = published.replace(hour=8, minute=0, second=0, microsecond=0)
        else:
            loaded_at = published
        transcribed_at = loaded_at + timedelta(hours=2)
        ingested_at = loaded_at + timedelta(hours=4)
        injuries_n = int(round(item["injuries"]))
        details = {
            "sourceType": item["source_type"],
            "sourceName": item["source_name"],
            "sourceTitle": title,
            "sourceUrl": item["source_url"],
            "published": item["published"],
            "playerMentions": item["mentions"],
            "players": len(item["player_ids"]),
            "scores": item["scores"],
            "teams": len(item["team_names"]),
            "injuries": injuries_n,
        }

        if kind in ("Video", "Podcast"):
            upsert_event(
                conn,
                fingerprint=f"media:load:{item['key']}",
                created_at=_iso(loaded_at),
                status="ok",
                category="media",
                title=f"{kind} geladen",
                message=f"{kind} „{title}“ geladen",
                details=details,
            )
            upsert_event(
                conn,
                fingerprint=f"media:transcribe:{item['key']}",
                created_at=_iso(transcribed_at),
                status="ok",
                category="media",
                title=f"{kind} transkribiert",
                message=f"{kind} „{title}“ transkribiert",
                details=details,
            )
            written += 2

        parts: list[str] = []
        if item["mentions"]:
            suffix = "en" if item["mentions"] != 1 else ""
            parts.append(f"{item['mentions']} neue Spielerbesprechung{suffix}")
        if item["scores"]:
            suffix = "s" if item["scores"] != 1 else ""
            parts.append(f"{item['scores']} neue Score{suffix}")
        teams_n = len(item["team_names"])
        if teams_n:
            suffix = "en" if teams_n != 1 else ""
            parts.append(f"{teams_n} Team-Einschätzung{suffix}")
        if injuries_n:
            suffix = "e" if injuries_n != 1 else ""
            parts.append(f"{injuries_n} Verletzungshinweis{suffix}")

        upsert_event(
            conn,
            fingerprint=f"media:ingest:{item['key']}",
            created_at=_iso(ingested_at),
            status="ok",
            category="ingest",
            title="Daten in Datenbank eingetragen",
            message=f"Daten aus {kind} „{title}“ in Datenbank eingetragen: {_join_parts(parts)}",
            details=details,
        )
        written += 1
    return written


def sync_metric_events(conn: sqlite3.Connection) -> None:
    rows = conn.execute("SELECT key, value_json, updated_at FROM system_metrics").fetchall()
    for row in rows:
        data = _json_dict(row["value_json"])
        stamp = str(data.get("at") or row["updated_at"] or _now())
        key = row["key"]
        if key == "last_ingest":
            source = data.get("source") or "unbekannt"
            players = data.get("players") or data.get("imported") or 0
            upsert_event(
                conn,
                fingerprint="metric:last_ingest",
                created_at=stamp,
                status="ok",
                category="ingest",
                title="Spieler-Ingest",
                message=f"Spieler-Ingest abgeschlossen: {players} Spieler (Quelle: {source})",
                details=data,
            )
        elif key == "last_teams_ingest":
            teams = data.get("teams") or 0
            entries = data.get("entries") or 0
            upsert_event(
                conn,
                fingerprint="metric:last_teams_ingest",
                created_at=stamp,
                status="ok",
                category="ingest",
                title="Team-Ingest",
                message=f"Team-Ingest abgeschlossen: {teams} Teams, {entries} Einträge",
                details=data,
            )
        elif key == "sofascore_sync":
            updated = data.get("updated") or data.get("synced") or 0
            unresolved = data.get("unresolved") or 0
            processed = data.get("processed") or 0
            extra = f", {unresolved} ohne Match" if unresolved else ""
            checked = f" ({processed} Spieler geprüft)" if processed else ""
            upsert_event(
                conn,
                fingerprint="metric:sofascore_sync",
                created_at=stamp,
                status="warning" if unresolved else "ok",
                category="sync",
                title="SofaScore-Sync",
                message=f"SofaScore-Sync: {updated} Ratings aktualisiert{extra}{checked}",
                details={k: v for k, v in data.items() if k != "details"},
            )


def refresh_activity_log(conn: sqlite3.Connection) -> dict[str, int]:
    media = sync_media_events(conn)
    sync_metric_events(conn)
    total = conn.execute("SELECT COUNT(*) AS c FROM activity_log").fetchone()["c"]
    return {"mediaEvents": media, "total": int(total)}


def safe_refresh_activity_log(conn: sqlite3.Connection) -> dict[str, int]:
    try:
        return refresh_activity_log(conn)
    except Exception:
        return {"mediaEvents": 0, "total": 0}


def list_events(
    conn: sqlite3.Connection,
    *,
    limit: int = 300,
    category: str | None = None,
    status: str | None = None,
) -> list[dict[str, Any]]:
    clauses: list[str] = []
    params: list[Any] = []
    if category:
        clauses.append("category = ?")
        params.append(category)
    if status:
        clauses.append("status = ?")
        params.append(status)
    where = f"WHERE {' AND '.join(clauses)}" if clauses else ""
    rows = conn.execute(
        f"""
        SELECT id, fingerprint, created_at, status, category, title, message, details_json
        FROM activity_log
        {where}
        ORDER BY created_at DESC, id DESC
        LIMIT ?
        """,
        (*params, max(1, min(limit, 1000))),
    ).fetchall()
    return [
        {
            "id": row["id"],
            "fingerprint": row["fingerprint"],
            "createdAt": row["created_at"],
            "status": row["status"],
            "category": row["category"],
            "title": row["title"],
            "message": row["message"],
            "details": _json_dict(row["details_json"]),
        }
        for row in rows
    ]
