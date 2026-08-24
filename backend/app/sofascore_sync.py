from __future__ import annotations

import json
import sqlite3
import time
import urllib.parse
from datetime import datetime, timedelta, timezone
from difflib import SequenceMatcher
from typing import Any

import requests

BASE_URL = "https://sofascore-sport-api.p.rapidapi.com"
HOST = "sofascore-sport-api.p.rapidapi.com"
DEFAULT_TOURNAMENT_ID = 35
DEFAULT_TARGET_SEASON = "2025/2026"


def _normalize(text: str | None) -> str:
    if not text:
        return ""
    lowered = (
        text.lower()
        .replace("ü", "u")
        .replace("ö", "o")
        .replace("ä", "a")
        .replace("ß", "ss")
    )
    return "".join(ch for ch in lowered if ch.isalnum() or ch.isspace()).strip()


def _json_or_none(raw: str | None) -> Any:
    if not raw:
        return None
    try:
        return json.loads(raw)
    except Exception:  # noqa: BLE001
        return None


def _cache_get(conn: sqlite3.Connection, cache_key: str) -> Any | None:
    row = conn.execute(
        "SELECT response_json, expires_at FROM sofascore_cache WHERE cache_key = ?",
        (cache_key,),
    ).fetchone()
    if not row:
        return None
    expires_at = row["expires_at"]
    if expires_at:
        try:
            if datetime.now(timezone.utc) > datetime.fromisoformat(expires_at):
                return None
        except ValueError:
            pass
    return _json_or_none(row["response_json"])


def _cache_put(conn: sqlite3.Connection, cache_key: str, endpoint: str, payload: Any, ttl_days: int = 180) -> None:
    now = datetime.now(timezone.utc)
    expires_at = (now + timedelta(days=ttl_days)).isoformat()
    conn.execute(
        """
        INSERT INTO sofascore_cache (cache_key, endpoint, response_json, fetched_at, expires_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(cache_key) DO UPDATE SET
            endpoint = excluded.endpoint,
            response_json = excluded.response_json,
            fetched_at = excluded.fetched_at,
            expires_at = excluded.expires_at
        """,
        (cache_key, endpoint, json.dumps(payload, ensure_ascii=False), now.isoformat(), expires_at),
    )


def _api_get(api_key: str, endpoint: str, params: dict[str, Any] | None = None) -> Any:
    url = f"{BASE_URL.rstrip('/')}/{endpoint.lstrip('/')}"
    response = requests.get(
        url,
        params=params,
        timeout=20,
        headers={
            "X-RapidAPI-Key": api_key,
            "X-RapidAPI-Host": HOST,
        },
    )
    response.raise_for_status()
    return response.json()


def _extract_player_candidates(payload: Any) -> list[dict[str, Any]]:
    if isinstance(payload, list):
        return [x for x in payload if isinstance(x, dict)]
    if isinstance(payload, dict):
        if isinstance(payload.get("data"), list):
            return [x for x in payload["data"] if isinstance(x, dict)]
        if isinstance(payload.get("results"), list):
            return [x for x in payload["results"] if isinstance(x, dict)]
    return []


def _extract_team_name(candidate: dict[str, Any]) -> str:
    team = candidate.get("team")
    if isinstance(team, dict):
        return str(team.get("name") or "")
    return str(candidate.get("teamName") or "")


def _extract_candidate_player_id(candidate: dict[str, Any]) -> int | None:
    if isinstance(candidate.get("id"), int):
        return candidate["id"]
    player = candidate.get("player")
    if isinstance(player, dict) and isinstance(player.get("id"), int):
        return player["id"]
    entity = candidate.get("entity")
    if isinstance(entity, dict) and isinstance(entity.get("id"), int):
        return entity["id"]
    return None


def _extract_candidate_name(candidate: dict[str, Any]) -> str:
    if isinstance(candidate.get("name"), str):
        return candidate["name"]
    player = candidate.get("player")
    if isinstance(player, dict) and isinstance(player.get("name"), str):
        return player["name"]
    entity = candidate.get("entity")
    if isinstance(entity, dict) and isinstance(entity.get("name"), str):
        return entity["name"]
    return ""


def _resolve_from_tournament_pool(
    row: sqlite3.Row, tournament_pool: list[dict[str, Any]], used_ids: set[int]
) -> tuple[int | None, float]:
    if not tournament_pool:
        return None, 0.0
    row_name = _normalize(row["name"])
    row_club = _normalize(row["club"])
    scored: list[tuple[float, dict[str, Any]]] = []
    for item in tournament_pool:
        cand_name = _normalize(str(item.get("name") or ""))
        cand_club = _normalize(str(item.get("team") or ""))
        if not cand_name:
            continue
        name_score = SequenceMatcher(None, row_name, cand_name).ratio()
        club_score = SequenceMatcher(None, row_club, cand_club).ratio()
        score = (name_score * 0.7) + (club_score * 0.3)
        scored.append((score, item))
    scored.sort(key=lambda x: x[0], reverse=True)
    for score, item in scored:
        if score < 0.55:
            break
        player_id = item.get("id")
        if not isinstance(player_id, int):
            continue
        if player_id in used_ids:
            continue
        return player_id, score
    return None, scored[0][0] if scored else 0.0


def _score_candidate(player_name: str, club_name: str, candidate: dict[str, Any]) -> float:
    cand_name = _extract_candidate_name(candidate)
    cand_team = _extract_team_name(candidate)
    name_score = SequenceMatcher(None, _normalize(player_name), _normalize(cand_name)).ratio()
    team_score = SequenceMatcher(None, _normalize(club_name), _normalize(cand_team)).ratio()
    return (name_score * 0.7) + (team_score * 0.3)


def _extract_rating_payload(payload: Any) -> tuple[float | None, dict[str, Any]]:
    if not isinstance(payload, dict):
        return None, {}
    candidates: list[dict[str, Any]] = [payload]
    if isinstance(payload.get("statistics"), dict):
        candidates.append(payload["statistics"])
    if isinstance(payload.get("data"), dict):
        candidates.append(payload["data"])
    for data in candidates:
        for key in ("averageRating", "rating"):
            value = data.get(key)
            if isinstance(value, (int, float)):
                extra = {
                    "goals": data.get("goals"),
                    "assists": data.get("assists"),
                    "expectedGoals": data.get("expectedGoals"),
                    "expectedAssists": data.get("expectedAssists"),
                }
                return float(value), extra
    return None, {}


def _extract_rating_from_last_year_summary(payload: Any) -> tuple[float | None, dict[str, Any]]:
    if not isinstance(payload, dict):
        return None, {}
    summary = payload.get("summary")
    if not isinstance(summary, list):
        return None, {}
    bundesliga_values: list[float] = []
    all_values: list[float] = []
    for item in summary:
        if not isinstance(item, dict):
            continue
        if item.get("type") != "event":
            continue
        value_raw = item.get("value")
        try:
            value = float(value_raw)
        except (TypeError, ValueError):
            continue
        all_values.append(value)
        if item.get("uniqueTournamentId") == DEFAULT_TOURNAMENT_ID:
            bundesliga_values.append(value)
    source_values = bundesliga_values or all_values
    if not source_values:
        return None, {"samples": 0}
    avg = round(sum(source_values) / len(source_values), 3)
    return avg, {
        "samples": len(source_values),
        "bundesligaSamples": len(bundesliga_values),
        "allSamples": len(all_values),
        "method": "last_year_summary",
    }


def _extract_standing_rows(payload: Any) -> list[dict[str, Any]]:
    if not isinstance(payload, dict):
        return []
    standings = payload.get("standings")
    if not isinstance(standings, list) or not standings:
        return []
    first = standings[0]
    if not isinstance(first, dict):
        return []
    rows = first.get("rows")
    if not isinstance(rows, list):
        return []
    return [row for row in rows if isinstance(row, dict)]


def _extract_team_players(payload: Any) -> list[dict[str, Any]]:
    if not isinstance(payload, dict):
        return []
    players = payload.get("players")
    if not isinstance(players, list):
        return []
    out: list[dict[str, Any]] = []
    for item in players:
        if not isinstance(item, dict):
            continue
        player = item.get("player")
        if not isinstance(player, dict):
            continue
        if not isinstance(player.get("id"), int):
            continue
        team = player.get("team")
        out.append(
            {
                "id": player["id"],
                "name": player.get("name"),
                "team": team.get("name") if isinstance(team, dict) else None,
            }
        )
    return out


def _build_tournament_player_pool(
    conn: sqlite3.Connection, api_key: str, season_id: int
) -> list[dict[str, Any]]:
    cache_key = f"sofa:pool:{season_id}"
    cached = _cache_get(conn, cache_key)
    if isinstance(cached, list) and cached:
        return [x for x in cached if isinstance(x, dict)]

    standings_endpoint = (
        f"api/unique-tournament/{DEFAULT_TOURNAMENT_ID}/season/{season_id}/standings/total"
    )
    standings_payload = _api_get(api_key, standings_endpoint)
    _cache_put(conn, f"sofa:standings:{season_id}", standings_endpoint, standings_payload, ttl_days=30)
    rows = _extract_standing_rows(standings_payload)

    pool: dict[int, dict[str, Any]] = {}
    for row in rows:
        team = row.get("team")
        if not isinstance(team, dict):
            continue
        team_id = team.get("id")
        if not isinstance(team_id, int):
            continue
        endpoint = f"api/team/{team_id}/players"
        team_cache_key = f"sofa:team-players:{team_id}"
        team_payload = _cache_get(conn, team_cache_key)
        if not team_payload:
            try:
                team_payload = _api_get(api_key, endpoint)
            except requests.exceptions.RequestException:
                continue
            _cache_put(conn, team_cache_key, endpoint, team_payload, ttl_days=30)
            time.sleep(0.25)
        for candidate in _extract_team_players(team_payload):
            cid = candidate.get("id")
            if isinstance(cid, int):
                pool[cid] = candidate

    out = list(pool.values())
    _cache_put(conn, cache_key, standings_endpoint, out, ttl_days=30)
    return out


def _resolve_season_id(conn: sqlite3.Connection, api_key: str, season_id: int | None) -> int:
    if season_id:
        return season_id
    cached = _cache_get(conn, "sofa:seasons:35")
    if not cached:
        payload = _api_get(api_key, f"api/unique-tournament/{DEFAULT_TOURNAMENT_ID}/seasons")
        _cache_put(conn, "sofa:seasons:35", f"api/unique-tournament/{DEFAULT_TOURNAMENT_ID}/seasons", payload, ttl_days=7)
        cached = payload
    seasons = []
    if isinstance(cached, dict):
        if isinstance(cached.get("seasons"), list):
            seasons = [x for x in cached["seasons"] if isinstance(x, dict)]
        elif isinstance(cached.get("data"), list):
            seasons = [x for x in cached["data"] if isinstance(x, dict)]
    elif isinstance(cached, list):
        seasons = [x for x in cached if isinstance(x, dict)]
    if not seasons:
        raise RuntimeError("No SofaScore seasons found for Bundesliga")

    season_target = _normalize(DEFAULT_TARGET_SEASON)
    for season in seasons:
        name = _normalize(str(season.get("name") or season.get("year") or ""))
        if season_target and season_target in name and isinstance(season.get("id"), int):
            return season["id"]
    for season in sorted(seasons, key=lambda x: x.get("id", 0), reverse=True):
        if isinstance(season.get("id"), int):
            return season["id"]
    raise RuntimeError("Could not resolve SofaScore season id")


def _resolve_sofascore_player_id(
    conn: sqlite3.Connection,
    api_key: str,
    row: sqlite3.Row,
    tournament_pool: list[dict[str, Any]],
    used_ids: set[int],
) -> tuple[int | None, float]:
    if row["sofascore_player_id"]:
        return int(row["sofascore_player_id"]), 1.0

    mapped = conn.execute(
        "SELECT sofascore_player_id, confidence FROM player_kicker_mapping WHERE kicker_player_id = ?",
        (row["player_id"],),
    ).fetchone()
    if mapped and int(mapped["sofascore_player_id"]) not in used_ids:
        return int(mapped["sofascore_player_id"]), float(mapped["confidence"] or 0.0)

    tournament_id, tournament_conf = _resolve_from_tournament_pool(row, tournament_pool, used_ids)
    if tournament_id:
        conn.execute(
            """
            INSERT INTO player_kicker_mapping (kicker_player_id, player_name, club, sofascore_player_id, confidence, source, updated_at)
            VALUES (?, ?, ?, ?, ?, 'tournament_pool', ?)
            ON CONFLICT(kicker_player_id) DO UPDATE SET
                player_name = excluded.player_name,
                club = excluded.club,
                sofascore_player_id = excluded.sofascore_player_id,
                confidence = excluded.confidence,
                source = excluded.source,
                updated_at = excluded.updated_at
            """,
            (
                row["player_id"],
                row["name"],
                row["club"],
                tournament_id,
                tournament_conf,
                datetime.now(timezone.utc).isoformat(),
            ),
        )
        return tournament_id, tournament_conf

    query = urllib.parse.quote(row["name"])
    cache_key = f"sofa:search:{query}"
    payload = _cache_get(conn, cache_key)
    if not payload:
        try:
            payload = _api_get(api_key, f"api/search/players/{query}")
        except requests.exceptions.RequestException:
            return None, 0.0
        _cache_put(conn, cache_key, f"api/search/players/{query}", payload, ttl_days=120)
        time.sleep(0.35)
    candidates = _extract_player_candidates(payload)
    if not candidates:
        return None, 0.0

    ranked = sorted(
        candidates,
        key=lambda cand: _score_candidate(row["name"], row["club"], cand),
        reverse=True,
    )
    best = None
    confidence = 0.0
    player_id = None
    for cand in ranked:
        cand_score = _score_candidate(row["name"], row["club"], cand)
        cand_id = _extract_candidate_player_id(cand)
        if not cand_id or cand_id in used_ids:
            continue
        best, confidence, player_id = cand, cand_score, cand_id
        break
    if not best or not player_id or confidence < 0.45:
        return None, confidence

    conn.execute(
        """
        INSERT INTO player_kicker_mapping (kicker_player_id, player_name, club, sofascore_player_id, confidence, source, updated_at)
        VALUES (?, ?, ?, ?, ?, 'search', ?)
        ON CONFLICT(kicker_player_id) DO UPDATE SET
            player_name = excluded.player_name,
            club = excluded.club,
            sofascore_player_id = excluded.sofascore_player_id,
            confidence = excluded.confidence,
            source = excluded.source,
            updated_at = excluded.updated_at
        """,
        (
            row["player_id"],
            row["name"],
            row["club"],
            player_id,
            confidence,
            datetime.now(timezone.utc).isoformat(),
        ),
    )
    return player_id, confidence


def sync_sofascore_ratings(
    conn: sqlite3.Connection,
    api_key: str,
    season_id: int | None,
    max_players: int | None = None,
    only_missing: bool = True,
    dry_run: bool = False,
) -> dict[str, Any]:
    sid = _resolve_season_id(conn, api_key, season_id)
    tournament_pool = _build_tournament_player_pool(conn, api_key, sid)
    where = "WHERE active = 1"
    if only_missing:
        where += " AND (sofascore_season_rating IS NULL OR sofascore_season_rating = 0)"
    rows = conn.execute(
        f"""
        SELECT player_id, name, club, sofascore_player_id, sofascore_season_rating
        FROM players
        {where}
        ORDER BY name ASC
        """
    ).fetchall()
    if max_players is not None and max_players > 0:
        rows = rows[:max_players]

    used_ids: set[int] = {
        int(r["sofascore_player_id"])
        for r in conn.execute(
            "SELECT DISTINCT sofascore_player_id FROM players WHERE sofascore_player_id IS NOT NULL"
        ).fetchall()
    }

    synced = 0
    unresolved = 0
    updated = 0
    details: list[dict[str, Any]] = []

    for row in rows:
        sofa_player_id, confidence = _resolve_sofascore_player_id(
            conn, api_key, row, tournament_pool, used_ids
        )
        if sofa_player_id:
            used_ids.add(sofa_player_id)
        if not sofa_player_id:
            unresolved += 1
            details.append({"playerId": row["player_id"], "name": row["name"], "status": "unresolved"})
            continue
        cache_key = f"sofa:last-year-summary:{sofa_player_id}"
        payload = _cache_get(conn, cache_key)
        if payload is None:
            endpoint = f"api/player/{sofa_player_id}/last-year-summary"
            try:
                payload = _api_get(api_key, endpoint)
            except requests.exceptions.RequestException as exc:
                details.append(
                    {
                        "playerId": row["player_id"],
                        "name": row["name"],
                        "status": "http_error",
                        "error": str(exc),
                    }
                )
                unresolved += 1
                continue
            _cache_put(conn, cache_key, endpoint, payload, ttl_days=120)
            time.sleep(0.35)

        rating, extra = _extract_rating_from_last_year_summary(payload)
        if rating is None:
            rating, extra = _extract_rating_payload(payload)
        synced += 1
        if rating is None:
            unresolved += 1
            details.append(
                {
                    "playerId": row["player_id"],
                    "name": row["name"],
                    "status": "no_rating",
                    "sofaPlayerId": sofa_player_id,
                }
            )
            continue

        if not dry_run:
            metadata_raw = conn.execute(
                "SELECT metadata_json FROM players WHERE player_id = ?",
                (row["player_id"],),
            ).fetchone()
            metadata = _json_or_none(metadata_raw["metadata_json"]) if metadata_raw else {}
            if not isinstance(metadata, dict):
                metadata = {}
            metadata["sofascore"] = {
                "seasonId": sid,
                "confidence": confidence,
                "updatedAt": datetime.now(timezone.utc).isoformat(),
                "extra": extra,
            }
            conn.execute(
                """
                UPDATE players
                SET sofascore_player_id = ?, sofascore_season_rating = ?, metadata_json = ?, updated_at = ?
                WHERE player_id = ?
                """,
                (
                    sofa_player_id,
                    rating,
                    json.dumps(metadata, ensure_ascii=False),
                    datetime.now(timezone.utc).isoformat(),
                    row["player_id"],
                ),
            )
        updated += 1
        details.append(
            {
                "playerId": row["player_id"],
                "name": row["name"],
                "status": "updated" if not dry_run else "dry_run",
                "sofaPlayerId": sofa_player_id,
                "rating": rating,
            }
        )

    result = {
        "seasonId": sid,
        "processed": len(rows),
        "synced": synced,
        "updated": updated,
        "unresolved": unresolved,
        "dryRun": dry_run,
        "details": details,
    }
    if not dry_run:
        conn.execute(
            "INSERT OR REPLACE INTO system_metrics (key, value_json, updated_at) VALUES (?, ?, ?)",
            (
                "sofascore_sync",
                json.dumps(result, ensure_ascii=False),
                datetime.now(timezone.utc).isoformat(),
            ),
        )
    return result
