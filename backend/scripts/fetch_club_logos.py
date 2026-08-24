"""Holt Vereinswappen (PNG) via SofaScore RapidAPI (dieselbe Quelle wie BallistiXG,
siehe BallistiXG/backend/app/services/sofascore_client.py::fetch_team_logo) und
speichert sie unter frontend/public/club-logos/{clubCode}.png ab.

Einmaliger Lauf: Wappen aendern sich praktisch nie, danach reicht ein Re-Lauf nur bei
neuen Vereinen (Auf-/Abstieg) oder Rebranding.
"""
from __future__ import annotations

import base64
import os
import sys
import time
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parent.parent.parent
OUT_DIR = ROOT / "frontend" / "public" / "club-logos"

BASE_URL = "https://sofascore-sport-api.p.rapidapi.com"
HOST = "sofascore-sport-api.p.rapidapi.com"
# SofaScore-Tournament 35 ("Bundesliga") liefert bereits die vollstaendige aktuelle 1.-Liga-Tabelle
# (inkl. frisch aufgestiegener Vereine wie Schalke/Elversberg/Paderborn 26/27) - Tournament-ID 51
# ("2. Bundesliga") existiert auf diesem RapidAPI-Mirror nicht (404), daher nicht mehr genutzt.
BUNDESLIGA_TOURNAMENT_ID = 35

# Muss zu TEAM_CODE_MAP in backend/app/main.py passen (dieselben Codes wie player.clubCode).
# Mehrere Normalform-Varianten pro Verein, da SofaScore-Namen leicht von unserer Kicker-CSV-
# Schreibweise abweichen (z.B. Apostroph bei "M'gladbach", "SV 07" statt "SV").
TEAM_CODE_MAP = {
    "bayern munchen": "FCB",
    "fc bayern munchen": "FCB",
    "borussia dortmund": "BVB",
    "bayer 04 leverkusen": "B04",
    "rb leipzig": "RBL",
    "eintracht frankfurt": "SGE",
    "sc freiburg": "SCF",
    "vfb stuttgart": "VFB",
    "tsg hoffenheim": "TSG",
    "tsg 1899 hoffenheim": "TSG",
    "werder bremen": "SVW",
    "sv werder bremen": "SVW",
    "1 fc koln": "KOE",
    "1 fsv mainz 05": "M05",
    "1 fc union berlin": "FCU",
    "fc augsburg": "FCA",
    "fc st pauli": "STP",
    "fc schalke 04": "S04",
    "hamburger sv": "HSV",
    "hannover 96": "H96",
    "sc paderborn 07": "SCP",
    "sv elversberg": "SVE",
    "sv 07 elversberg": "SVE",
    "bor monchengladbach": "BMG",
    "borussia monchengladbach": "BMG",
    "borussia m'gladbach": "BMG",
    "1 fc kaiserslautern": "FCK",
}


def _normalize(text: str) -> str:
    lowered = (
        text.lower()
        .replace("ü", "u").replace("ö", "o").replace("ä", "a").replace("ß", "ss")
        .replace(".", "").replace("-", " ")
    )
    return " ".join(lowered.split())


def _match_club_code(team_name: str) -> str | None:
    norm = _normalize(team_name)
    if norm in TEAM_CODE_MAP:
        return TEAM_CODE_MAP[norm]
    # Toleranter Teilstring-Abgleich (SofaScore-Namen weichen manchmal leicht ab,
    # z.B. "FC Bayern Munchen" statt "Bayern Munchen").
    for key, code in TEAM_CODE_MAP.items():
        if key in norm or norm in key:
            return code
    return None


def _api_get(api_key: str, endpoint: str) -> dict:
    resp = requests.get(
        f"{BASE_URL}/{endpoint.lstrip('/')}",
        timeout=20,
        headers={"X-RapidAPI-Key": api_key, "X-RapidAPI-Host": HOST},
    )
    resp.raise_for_status()
    return resp.json()


def _fetch_logo_bytes(api_key: str, team_id: int) -> bytes | None:
    url = f"{BASE_URL}/api/team/{team_id}/logo"
    resp = requests.get(url, timeout=20, headers={"X-RapidAPI-Key": api_key, "X-RapidAPI-Host": HOST})
    if resp.status_code != 200:
        return None
    try:
        return base64.b64decode(resp.content)
    except Exception:  # noqa: BLE001
        return None


def _teams_for_tournament(api_key: str, tournament_id: int) -> list[dict]:
    seasons = _api_get(api_key, f"api/unique-tournament/{tournament_id}/seasons")
    season_list = seasons.get("seasons") if isinstance(seasons, dict) else seasons
    if not season_list:
        return []
    season_id = season_list[0].get("id")
    standings = _api_get(
        api_key, f"api/unique-tournament/{tournament_id}/season/{season_id}/standings/total"
    )
    rows = (standings.get("standings") or [{}])[0].get("rows") or []
    teams = []
    for row in rows:
        team = row.get("team")
        if isinstance(team, dict) and isinstance(team.get("id"), int):
            teams.append(team)
    return teams


def main() -> int:
    api_key = os.environ.get("SOFASCORE_RAPIDAPI_KEY")
    if not api_key:
        env_path = ROOT / ".env"
        if env_path.exists():
            for line in env_path.read_text(encoding="utf-8").splitlines():
                if line.startswith("SOFASCORE_RAPIDAPI_KEY="):
                    api_key = line.split("=", 1)[1].strip()
                    break
    if not api_key:
        print("ERROR: SOFASCORE_RAPIDAPI_KEY nicht gesetzt (env oder .env).", file=sys.stderr)
        return 1

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    all_teams: dict[int, dict] = {}
    try:
        for team in _teams_for_tournament(api_key, BUNDESLIGA_TOURNAMENT_ID):
            all_teams[team["id"]] = team
    except requests.exceptions.RequestException as exc:
        print(f"WARNUNG: Team-Liste fuer Tournament {BUNDESLIGA_TOURNAMENT_ID} fehlgeschlagen: {exc}")

    print(f"{len(all_teams)} Vereine aus SofaScore-Tabellen gefunden.")

    saved = 0
    skipped = 0
    failed = 0
    unmatched: list[str] = []

    for team in all_teams.values():
        name = str(team.get("name") or "")
        code = _match_club_code(name)
        if not code:
            unmatched.append(name)
            continue
        out_path = OUT_DIR / f"{code}.png"
        logo_bytes = _fetch_logo_bytes(api_key, team["id"])
        if not logo_bytes:
            print(f"  [FAIL] {name} ({code}) - kein Logo von SofaScore erhalten")
            failed += 1
            continue
        out_path.write_bytes(logo_bytes)
        print(f"  [OK] {name} -> {code}.png ({len(logo_bytes)} bytes)")
        saved += 1
        time.sleep(0.2)

    print("\n" + "=" * 40)
    print(f"Gespeichert: {saved}  Fehlgeschlagen: {failed}  Unmatched: {len(unmatched)}")
    if unmatched:
        print("Unmatched Vereinsnamen (kein clubCode gefunden):", unmatched)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
