from __future__ import annotations

import csv
import io
import json
import math
import os
import sqlite3
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, model_validator

from .activity_log import list_events, log_event, safe_refresh_activity_log
from .database import DB_PATH, backup_db, get_connection, init_db
from .sofascore_sync import sync_sofascore_ratings

APP_VERSION = "v.0904.001"

Position = Literal["TOR", "ABW", "MIT", "STU"]
RiskProfile = Literal["floor", "balanced", "aggressive", "ueberperformer"]
PortalMode = Literal["dashboard", "bewerten", "tauschen", "praesentieren", "players", "teams", "logs"]

# Aktuelle 1. Bundesliga 2026/27 (18 Clubs). Aufsteiger: S04, SVE, SCP.
# Wird genutzt, damit Ingest `active=false` von kicker-scout (frueher: nur
# points_source=BL im Pool) die Aufsteiger-Kader nicht wieder ausblendet.
CURRENT_BUNDESLIGA_CODES = {
    "FCB",
    "BVB",
    "B04",
    "RBL",
    "SGE",
    "SCF",
    "VFB",
    "TSG",
    "SVW",
    "KOE",
    "M05",
    "FCU",
    "FCA",
    "HSV",
    "BMG",
    "S04",
    "SCP",
    "SVE",
}

TEAM_CODE_MAP = {
    "Bayern Munchen": "FCB",
    "Borussia Dortmund": "BVB",
    "Bayer 04 Leverkusen": "B04",
    "RB Leipzig": "RBL",
    "Eintracht Frankfurt": "SGE",
    "SC Freiburg": "SCF",
    "VfB Stuttgart": "VFB",
    "TSG Hoffenheim": "TSG",
    "Werder Bremen": "SVW",
    "1. FC Koln": "KOE",
    "1. FSV Mainz 05": "M05",
    "1. FC Union Berlin": "FCU",
    "FC Augsburg": "FCA",
    "FC St. Pauli": "STP",
    "FC Schalke 04": "S04",
    "Hamburger SV": "HSV",
    "Hannover 96": "H96",
    "SC Paderborn 07": "SCP",
    "SV Elversberg": "SVE",
    "Bor. Monchengladbach": "BMG",
    "1. FC Kaiserslautern": "FCK",
}

POSITION_MAP = {"TOR": "TOR", "ABW": "ABW", "MF": "MIT", "MIT": "MIT", "ANG": "STU", "STU": "STU"}

# Realismus-Guard fuer Vorsaison-Rohdaten (goals/assists/appearancesLastSeason), siehe
# IngestPlayerIn.clamp_last_season_stats.
_INGEST_GOAL_CAP = {"TOR": 3, "ABW": 15, "MIT": 22, "STU": 35}
_INGEST_ASSIST_CAP = {"TOR": 4, "ABW": 14, "MIT": 24, "STU": 18}

# Die Kicker-CSV nutzt "999" (Mio.) als Platzhalter fuer "noch kein Marktwert vergeben"
# (meist Nachwuchs-/Kaderspieler). Echte Kicker-Managerspiel-Preise gehen bis knapp 10 Mio
# (Top-Spieler) - 999 wuerde Preisfilter/Budget/Punkte-pro-Mio massiv verzerren (Datencheck
# 23.08.2026). Defense-in-depth zusaetzlich zum Clamp in kicker-scout/push_to_kmi.py.
_MARKET_VALUE_SENTINEL_THRESHOLD = 50.0
_MARKET_VALUE_FALLBACK = 0.5

# Offizielle Kicker-Managerspiel-CSV der laufenden BL-Saison. Ingest upsertet nur;
# ohne diesen Overlay bleiben Abgaenge (nicht mehr in der CSV) ewig active.
_KICKER_BL_CSV_URL = "https://www.kicker-libero.de/api/sportsdata/v1/players-details/se-k00012026.csv"
_OFFICIAL_SQUAD_MIN_SIZE = 400

app = FastAPI(title="KMI Orchestrator API", version=APP_VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PlayerProjection(BaseModel):
    starts: int = 0
    subApps: int = 0
    ratedGames: int = 0
    goals: int = 0
    assists: int = 0
    motm: int = 0
    yellowRed: int = 0
    redCards: int = 0
    cleanSheets: int = 0
    avgGrade: float = 3.5

    @model_validator(mode="after")
    def normalize_consistency(self) -> "PlayerProjection":
        self.starts = int(_clamp(float(self.starts), 0, 34))
        self.subApps = min(self.subApps, 34 - self.starts)
        self.subApps = int(_clamp(float(self.subApps), 0, 34 - self.starts))
        appearances = self.starts + self.subApps
        self.ratedGames = int(_clamp(float(self.ratedGames), 0, appearances))
        self.goals = int(_clamp(float(self.goals), 0, 35))
        self.assists = int(_clamp(float(self.assists), 0, 24))
        self.motm = int(_clamp(float(self.motm), 0, 12))
        self.yellowRed = int(_clamp(float(self.yellowRed), 0, 4))
        self.redCards = int(_clamp(float(self.redCards), 0, 3))
        self.cleanSheets = int(_clamp(float(self.cleanSheets), 0, min(20, self.starts)))
        self.avgGrade = round(_clamp(float(self.avgGrade), 1.0, 6.0), 2)
        return self


class PlayerInjury(BaseModel):
    type: str | None = None
    expectedReturn: str | None = None
    note: str | None = None
    source: str | None = None
    published: str | None = None


class PlayerOut(BaseModel):
    id: str
    name: str
    shortName: str
    club: str
    clubCode: str
    position: Position
    marketValue: float
    xPoints: float
    pointsPerMio: float
    stabIndex: float
    ueberperformerScore: float
    form: list[float]
    pointsLastSeason: int | None = None
    averageGrade: float | None = None
    goalsLastSeason: int | None = None
    assistsLastSeason: int | None = None
    appearancesLastSeason: int | None = None
    agentScore: float | None = None
    agentLabel: str | None = None
    plaierScore: float | None = None
    valuePick: bool = False
    userRating: int | None = None
    isFavorite: bool = False
    isHidden: bool = False
    active: bool = True
    sofascoreSeasonRating: float | None = None
    mentionsCount: int = 0
    mentions: list[dict[str, Any]] = Field(default_factory=list)
    baselineProjection: PlayerProjection
    leagueTag: str | None = None
    injury: PlayerInjury | None = None
    # Datum (YYYY-MM-DD) der juengsten Erwaehnung/Mention dieses Spielers, None falls keine.
    lastMentionDate: str | None = None


class TeamInjuryOut(BaseModel):
    player: str
    art: str | None = None
    dauer: str | None = None
    hinweis: str | None = None


class TeamOut(BaseModel):
    team: str
    clubCode: str
    kernaussage: str | None = None
    kernaussageSource: str | None = None
    kernaussagePublished: str | None = None
    tabellenplatzMin: int | None = None
    tabellenplatzMax: int | None = None
    zugaenge: list[str] = Field(default_factory=list)
    abgaenge: list[str] = Field(default_factory=list)
    valueSpieler: list[str] = Field(default_factory=list)
    talente: list[str] = Field(default_factory=list)
    verletzungen: list[TeamInjuryOut] = Field(default_factory=list)
    sources: list[dict[str, Any]] = Field(default_factory=list)
    updatedAt: str | None = None


class TeamInjuryIn(BaseModel):
    player: str
    art: str | None = None
    dauer: str | None = None
    hinweis: str | None = None


class TeamIngestIn(BaseModel):
    """Eine Team-Einschaetzung aus EINER Quelle (Video/Podcast-Folge), siehe
    kicker-scout/extraction/TEAMS_SCHEMA.md. Mehrere Eintraege desselben Teams werden beim
    Ingest zusammengefuehrt (Union der Listen, juengste Quelle gewinnt bei Kernaussage/Tabelle)."""

    team: str
    clubCode: str | None = None
    sourceType: str | None = None
    sourceName: str | None = None
    sourceTitle: str | None = None
    sourceUrl: str | None = None
    published: str | None = None
    kernaussage: str | None = None
    tabellenplatzMin: int | None = None
    tabellenplatzMax: int | None = None
    zugaenge: list[str] = Field(default_factory=list)
    abgaenge: list[str] = Field(default_factory=list)
    valueSpieler: list[str] = Field(default_factory=list)
    talente: list[str] = Field(default_factory=list)
    verletzungen: list[TeamInjuryIn] = Field(default_factory=list)


class TeamIngestPayload(BaseModel):
    entries: list[TeamIngestIn]
    replace: bool = False


class PlayerPatchIn(BaseModel):
    isFavorite: bool | None = None
    userRating: int | None = None
    # Ausblenden-Funktion (User-Wunsch 24.08.2026: fehlerhafte/transferierte Spieler wie
    # z.B. Sancho aus allen Listen entfernen koennen, ohne sie aus der DB zu loeschen).
    isHidden: bool | None = None

    @model_validator(mode="after")
    def clamp_rating(self):
        if self.userRating is not None:
            self.userRating = int(_clamp(float(self.userRating), 0, 5)) or None
        return self


class SquadTabIn(BaseModel):
    id: str
    label: str
    riskProfileId: RiskProfile
    starRating: int = Field(ge=0, le=5)
    formation: str
    starters: list[str | None]
    bench: list[str | None]
    excludedPlayerIds: list[str] = Field(default_factory=list)
    projections: dict[str, PlayerProjection] = Field(default_factory=dict)
    swapOutIds: list[str] = Field(default_factory=list)
    swapInByOut: dict[str, str | None] = Field(default_factory=dict)
    reviewedPlayerIds: list[str] = Field(default_factory=list)
    goldenSchnittTarget: float = 200
    swapVariants: dict[str, dict[str, str | None]] = Field(default_factory=dict)


class SquadStateIn(BaseModel):
    tabs: list[SquadTabIn]
    activeTabId: str
    budgetMax: float = 42.5
    updatedAt: str | None = None
    portalMode: PortalMode = "bewerten"


class IngestPlayerIn(BaseModel):
    id: str
    name: str
    shortName: str | None = None
    club: str
    clubCode: str | None = None
    position: str
    marketValue: float | None = None
    xPoints: float | None = None
    pointsPerMio: float | None = None
    stabIndex: float | None = None
    ueberperformerScore: float | None = None
    form: list[float] = Field(default_factory=list)
    pointsLastSeason: int | None = None
    averageGrade: float | None = None
    goalsLastSeason: int | None = None
    assistsLastSeason: int | None = None
    appearancesLastSeason: int | None = None
    agentScore: float | None = None
    agentLabel: str | None = None
    plaierScore: float | None = None
    valuePick: bool = False
    userRating: int | None = None
    isFavorite: bool = False
    isHidden: bool = False
    active: bool = True
    mentions: list[dict[str, Any]] = Field(default_factory=list)
    mentionsTotal: int | None = None
    baselineProjection: PlayerProjection | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)

    @model_validator(mode="after")
    def clamp_last_season_stats(self) -> "IngestPlayerIn":
        """Realismus-Guard: eine Bundesliga-Saison hat max. 34 Spieltage. Verhindert
        Ausreisser wie "68 Tore"/"60 Spiele" durch fehlerhafte/gemischte Upstream-Quellen
        (z.B. wettbewerbsuebergreifende Saison-Aggregate statt Liga-only-Werten), egal ob
        der clientseitige Cap bereits gegriffen hat oder nicht."""
        cap_key = POSITION_MAP.get((self.position or "").strip().upper()) or "MIT"
        if self.appearancesLastSeason is not None:
            self.appearancesLastSeason = int(_clamp(float(self.appearancesLastSeason), 0, 34))
        if self.goalsLastSeason is not None:
            self.goalsLastSeason = int(_clamp(float(self.goalsLastSeason), 0, _INGEST_GOAL_CAP.get(cap_key, 30)))
        if self.assistsLastSeason is not None:
            self.assistsLastSeason = int(_clamp(float(self.assistsLastSeason), 0, _INGEST_ASSIST_CAP.get(cap_key, 25)))
        if self.marketValue is not None and self.marketValue >= _MARKET_VALUE_SENTINEL_THRESHOLD:
            self.marketValue = _MARKET_VALUE_FALLBACK
        return self


class IngestPayload(BaseModel):
    source: str = "external"
    replace: bool = False
    players: list[IngestPlayerIn]


class SofaSyncRequest(BaseModel):
    seasonId: int | None = None
    maxPlayers: int | None = None
    onlyMissing: bool = True
    dryRun: bool = False


def _default_squad_state() -> dict[str, Any]:
    return {
        "tabs": [],
        "activeTabId": "",
        "budgetMax": 42.5,
        "updatedAt": None,
        "portalMode": "bewerten",
    }


def _normalize_team(team: str | None) -> str:
    if not team:
        return "Unknown"
    return (
        team.replace("ü", "u")
        .replace("ö", "o")
        .replace("ä", "a")
        .replace("ß", "ss")
        .strip()
    )


def _club_code(team: str | None) -> str:
    if not team:
        return "UNK"
    normalized = _normalize_team(team)
    if normalized in TEAM_CODE_MAP:
        return TEAM_CODE_MAP[normalized]
    letters = [part[0] for part in normalized.split() if part and part[0].isalnum()]
    if not letters:
        return "UNK"
    return "".join(letters[:3]).upper()


def _is_current_bundesliga_club(club: str | None, club_code: str | None = None) -> bool:
    code = (club_code or _club_code(club) or "").upper()
    return code in CURRENT_BUNDESLIGA_CODES


def _csv_market_value(raw: str | None) -> float:
    try:
        value = float(raw or 0) / 1_000_000
    except (TypeError, ValueError):
        return _MARKET_VALUE_FALLBACK
    if value >= _MARKET_VALUE_SENTINEL_THRESHOLD:
        return _MARKET_VALUE_FALLBACK
    return round(max(value, 0.0), 3)


def _fetch_official_bl_squad() -> dict[str, dict[str, Any]] | None:
    """Aktueller BL-Kader aus der öffentlichen Kicker-CSV. None = Fetch unbrauchbar."""
    try:
        with urllib.request.urlopen(_KICKER_BL_CSV_URL, timeout=20) as resp:
            text = resp.read().decode("utf-8-sig")
    except Exception:  # noqa: BLE001
        return None
    squad: dict[str, dict[str, Any]] = {}
    for row in csv.DictReader(io.StringIO(text), delimiter=";"):
        pid = (row.get("ID") or "").strip()
        if not pid:
            continue
        squad[pid] = {
            "name": (row.get("Angezeigter Name") or "").strip(),
            "club": (row.get("Verein") or "").strip(),
            "price": _csv_market_value(row.get("Marktwert")),
        }
    if len(squad) < _OFFICIAL_SQUAD_MIN_SIZE:
        return None
    return squad


def _apply_official_squad_overlay(conn: sqlite3.Connection) -> dict[str, Any]:
    """CSV ist Kader-Quelle: Club/Preis refreshen, alle nicht mehr gelisteten Spieler deaktivieren.

    Scout-Seed/Push upserten nur und lassen Abgaenge (Palhinha, Wasinski, Ghosts wie Goretzka)
    sonst ewig active, solange der alte Verein noch BL ist.
    """
    squad = _fetch_official_bl_squad()
    if not squad:
        return {"ok": False, "reason": "csv_unavailable_or_too_small"}
    now = datetime.now(timezone.utc).isoformat()
    refreshed = 0
    deactivated: list[str] = []
    rows = conn.execute("SELECT player_id, name, active FROM players").fetchall()
    for row in rows:
        pid = row["player_id"]
        info = squad.get(pid)
        if info:
            club = info["club"] or None
            conn.execute(
                """UPDATE players
                   SET club = ?, club_code = ?, market_value = ?, active = 1, updated_at = ?
                   WHERE player_id = ?""",
                (club, _club_code(club), info["price"], now, pid),
            )
            refreshed += 1
            continue
        if row["active"]:
            conn.execute(
                "UPDATE players SET active = 0, updated_at = ? WHERE player_id = ?",
                (now, pid),
            )
            deactivated.append(row["name"])
    return {
        "ok": True,
        "official": len(squad),
        "refreshed": refreshed,
        "deactivated": len(deactivated),
        "deactivatedSample": deactivated[:25],
    }


def _normalize_position(position: str | None) -> Position:
    if not position:
        return "MIT"
    pos = POSITION_MAP.get(position.strip().upper())
    if not pos:
        return "MIT"
    return pos  # type: ignore[return-value]


def _short_name(name: str) -> str:
    parts = [x for x in name.strip().split(" ") if x]
    if not parts:
        return name
    return parts[-1]


def _clamp(value: float, low: float, high: float) -> float:
    return max(low, min(high, value))


def _derive_x_points(points_last_season: int | None, agent_score: float | None, plaier_score: float | None) -> float:
    """@deprecated Legacy-Fallback (kopiert schlicht pointsLastSeason). NICHT mehr fuer echte
    xPunkte-Berechnung nutzen - siehe _projection_points, das dieselbe Kicker-Punkte-Formel
    wie das Frontend (lib/scoring.ts) verwendet. Bleibt nur als Notnagel, falls irgendwo noch
    kein baselineProjection ermittelt werden konnte."""
    if points_last_season and points_last_season > 0:
        return float(points_last_season)
    if plaier_score and plaier_score > 0:
        return round(_clamp(plaier_score / 24.0, 80, 290), 1)
    if agent_score is not None:
        return round(_clamp(140 + agent_score * 85, 70, 280), 1)
    return 120.0


# Muss exakt der Formel in frontend/src/lib/scoring.ts (pointsBreakdown/projectionPoints)
# entsprechen, sonst zeigen Spieler-Details-Modal/Spielfeld/Bank (frontend-berechnet) und
# Spielerdatenbank-Liste/xPunkte-Spalte (backend-berechnet, hier) unterschiedliche Werte fuer
# denselben Spieler an (Bug vom 23.08.2026: 216 im Modal vs. 290 in der Liste).
_PROJECTION_GOAL_POINTS: dict[str, int] = {"TOR": 6, "ABW": 5, "MIT": 4, "STU": 3}


def _projection_points(position: str, projection: dict[str, Any]) -> float:
    proj = PlayerProjection(**{k: v for k, v in projection.items() if v is not None})
    grade_points_per_game = (3.5 - proj.avgGrade) * 4
    note_points = round(grade_points_per_game * proj.ratedGames)
    starts_pts = proj.starts * 4
    sub_pts = proj.subApps * 2
    goal_pts = proj.goals * _PROJECTION_GOAL_POINTS.get(position, 4)
    assist_pts = proj.assists * 2
    motm_pts = proj.motm * 3
    card_pts = proj.yellowRed * -3 + proj.redCards * -6
    clean_sheet_pts = proj.cleanSheets * 2 if position == "TOR" else 0
    total = starts_pts + sub_pts + goal_pts + assist_pts + motm_pts + card_pts + clean_sheet_pts + note_points
    return float(total)


def _valid_kicker_grade(raw: Any) -> float | None:
    """Kicker-Noten sind 1.00–6.00. 0.0 in der CSV heisst 'keine Benotung'."""
    if raw is None:
        return None
    try:
        value = float(raw)
    except (TypeError, ValueError):
        return None
    if value < 1.0 or value > 6.0:
        return None
    return round(value, 2)


def _is_neutral_grade(value: float | None) -> bool:
    return value is None or abs(value - 3.5) < 0.001


def _csv_points_are_stale(
    stored: int | None,
    starts: int,
    reconstructed: float,
    points_source: str | None = None,
    goals: int = 0,
    assists: int = 0,
    position: str = "MIT",
) -> bool:
    """2L-Archiv-CSV hat oft 2024/25-Punkte, Stats kommen aus 2025/26 (Curda 62 vs 32 Starts).

    BL-CSV nie ueberschreiben: Bankspieler liegen unter dem Startelf-Boden, weil viele
    Einsaetze Einwechslungen sind (Hoeler 86 bei 33 Apps ist plausibel, nicht stale).
    CSV 0 = keine Kicker-Saison (Transfer/Ausland), nicht rekonstruieren.
    2L nur ersetzen, wenn selbst All-Subs-Minimum (2 Pkt/Einsatz + Tore + Vorlagen)
    unmoeglich ist.
    """
    if stored is None or stored <= 0:
        return False
    src = (points_source or "").strip().upper()
    if src == "BL":
        return False
    starts = max(0, int(starts or 0))
    goal_pts = _PROJECTION_GOAL_POINTS.get(position, 4)
    all_subs_floor = starts * 2 + int(goals or 0) * goal_pts + int(assists or 0) * 2
    if src == "2L" and starts >= 10 and stored < all_subs_floor - 15:
        return True
    if src == "2L" and starts <= 8 and stored > reconstructed + 40:
        return True
    return False


def _effective_last_season_points(
    stored: int | None,
    position: str,
    baseline: dict[str, Any],
    points_source: str | None = None,
    goals: int = 0,
    assists: int = 0,
) -> tuple[int, bool]:
    """Liefert (Punkte, stale). BL-CSV und CSV=0 bleiben stehen. 2L-Stale wird rekonstruiert."""
    recon = _projection_points(position, {**baseline, "avgGrade": 3.5})
    starts = int(baseline.get("starts") or 0)
    if _csv_points_are_stale(stored, starts, recon, points_source, goals, assists, position):
        return int(round(recon)), True
    if stored is None:
        return 0, False
    return int(stored), False


def _overlay_grade_on_baseline(
    baseline: dict[str, Any], average_grade: float | None
) -> dict[str, Any]:
    """Stale baselines often keep avgGrade=3.5 because CSV 0.0 was treated as a
    real note. Overlay the official kicker grade when the stored value is still
    the 3.5-neutral default. Manual overrides (Ramaj 3.26 etc.) stay untouched."""
    if average_grade is None or not isinstance(baseline, dict):
        return baseline if isinstance(baseline, dict) else {}
    stored = _valid_kicker_grade(baseline.get("avgGrade"))
    if stored is not None and not _is_neutral_grade(stored):
        return baseline
    return {**baseline, "avgGrade": average_grade}


def _derive_stab_index(average_grade: float | None) -> float:
    grade = _valid_kicker_grade(average_grade)
    if grade is None:
        return 3.5
    return round(_clamp((6.2 - grade) * 1.4, 1.5, 5.8), 2)


def _derive_ueberperformer(
    agent_score: float | None,
    market_value: float | None,
    x_points: float | None,
    mention_count: int = 0,
) -> float:
    """Deal-Score 0-99: Scouts × billig × wie oft die Scouts ihn wirklich pushen.

    Skala (absichtlich streng): 50 = kein Signal, ~80 = sehr interessant,
    Anfang 90 = Mega-Deal (billig + Scouts flippen + mehrere Quellen),
    99 nur alle paar Jahre (Megatalent zum Schleuderpreis, breiter Hype).
    Ein einzelnes positives Mention reicht nicht fuer 90 — sonst waeren
    Dutzende No-Names bei agent_score=1.0 schon „Megadeals“.
    """
    n = max(0, int(mention_count))
    score = float(agent_score or 0.0)
    if n == 0 or score <= 0:
        if score < 0:
            return round(_clamp(50.0 + score * 28.0, 8.0, 50.0), 1)
        return 50.0

    scout = score**1.15
    price = float(market_value or 0.0)
    if price <= 0 or price >= 50:
        cheap = 0.20
    else:
        cheap = _clamp(math.exp(-0.52 * max(0.0, price - 0.5)), 0.0, 1.0)

    ppm = (float(x_points or 0.0) / price) if price > 0.2 else 0.0
    ppm = min(ppm, 72.0)
    eff = _clamp((ppm - 18.0) / 54.0, 0.0, 1.0)
    conv = 1.0 - math.exp(-n / 5.0)
    inner = 0.50 + 0.50 * max(eff, conv * 0.25)
    deal = (scout**0.40) * (cheap**0.34) * (conv**0.18) * (inner**0.08)
    raw = 50.0 + 49.5 * (deal**1.32)
    ceiling = min(99.0, 70.0 + 32.0 * (1.0 - math.exp(-(n - 1) / 4.8)))
    return round(_clamp(min(raw, ceiling), 8.0, 99.0), 1)


def _derive_form(x_points: float, agent_score: float | None) -> list[float]:
    avg = x_points / 17.0
    bias = (agent_score or 0.0) * 3.0
    raw = [
        avg - 2 + bias,
        avg - 1 + bias,
        avg + bias,
        avg + 1 + bias,
        avg + 2 + bias,
    ]
    return [round(_clamp(v, 0, 35), 1) for v in raw]


def _default_projection_for_player(player: dict[str, Any]) -> dict[str, Any]:
    starts = int(_clamp(float(player.get("appearancesLastSeason") or 0), 0, 34))
    goals = int(player.get("goalsLastSeason") or 0)
    assists = int(player.get("assistsLastSeason") or 0)
    grade = _valid_kicker_grade(player.get("averageGrade"))
    avg_grade = grade if grade is not None else 3.5
    clean_sheets = int(_clamp(float(player.get("metadata", {}).get("cleanSheetsLastSeason", 0)), 0, 20))
    return {
        "starts": starts,
        "subApps": 0,
        "ratedGames": starts,
        "goals": goals,
        "assists": assists,
        "motm": 0,
        "yellowRed": 0,
        "redCards": 0,
        "cleanSheets": clean_sheets if player.get("position") == "TOR" else 0,
        "avgGrade": round(_clamp(avg_grade, 1.0, 6.0), 2),
    }


def _load_seed_players() -> list[dict[str, Any]]:
    seed = Path(__file__).resolve().parent / "seed_players.json"
    if not seed.exists():
        return []
    return json.loads(seed.read_text(encoding="utf-8"))


def _upsert_player(conn: sqlite3.Connection, player: dict[str, Any]) -> None:
    now = datetime.now(timezone.utc).isoformat()
    form = player.get("form") or _derive_form(float(player["xPoints"]), player.get("agentScore"))
    baseline = player.get("baselineProjection") or _default_projection_for_player(player)
    mentions = player.get("mentions") or []

    conn.execute(
        """
        INSERT INTO players (
            player_id, name, short_name, club, club_code, position, market_value,
            x_points, points_per_mio, stab_index, ueberperformer_score, form_json,
            points_last_season, average_grade, goals_last_season, assists_last_season,
            appearances_last_season, agent_score, agent_label, plaier_score, value_pick,
            user_rating, is_favorite, is_hidden, active, sofascore_player_id, sofascore_season_rating,
            baseline_json, mentions_count, mentions_json, metadata_json, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(player_id) DO UPDATE SET
            name = excluded.name,
            short_name = excluded.short_name,
            club = excluded.club,
            club_code = excluded.club_code,
            position = excluded.position,
            market_value = excluded.market_value,
            x_points = excluded.x_points,
            points_per_mio = excluded.points_per_mio,
            stab_index = excluded.stab_index,
            ueberperformer_score = excluded.ueberperformer_score,
            form_json = excluded.form_json,
            points_last_season = excluded.points_last_season,
            average_grade = excluded.average_grade,
            goals_last_season = excluded.goals_last_season,
            assists_last_season = excluded.assists_last_season,
            appearances_last_season = excluded.appearances_last_season,
            agent_score = excluded.agent_score,
            agent_label = excluded.agent_label,
            plaier_score = excluded.plaier_score,
            value_pick = excluded.value_pick,
            -- user_rating/is_favorite/is_hidden werden ab jetzt ausschliesslich im Orchestrator
            -- selbst gesetzt (PATCH /api/players/{id}); ein Re-Ingest aus kicker-scout.db darf
            -- lokal vergebene Sterne/Favoriten/Ausblendungen nicht mehr ueberschreiben
            -- (Datencheck 24.08.2026, User-Wunsch: Ausblenden-Funktion muss re-ingest-fest sein).
            active = excluded.active,
            baseline_json = excluded.baseline_json,
            mentions_count = excluded.mentions_count,
            mentions_json = excluded.mentions_json,
            metadata_json = excluded.metadata_json,
            updated_at = excluded.updated_at
        """,
        (
            player["id"],
            player["name"],
            player["shortName"],
            player["club"],
            player["clubCode"],
            player["position"],
            float(player.get("marketValue") or 0.0),
            float(player["xPoints"]),
            float(player["pointsPerMio"]),
            float(player["stabIndex"]),
            float(player["ueberperformerScore"]),
            json.dumps(form, ensure_ascii=False),
            player.get("pointsLastSeason"),
            player.get("averageGrade"),
            player.get("goalsLastSeason"),
            player.get("assistsLastSeason"),
            player.get("appearancesLastSeason"),
            player.get("agentScore"),
            player.get("agentLabel"),
            player.get("plaierScore"),
            int(bool(player.get("valuePick"))),
            player.get("userRating"),
            int(bool(player.get("isFavorite"))),
            int(bool(player.get("isHidden"))),
            int(bool(player.get("active", True))),
            player.get("sofascorePlayerId"),
            player.get("sofascoreSeasonRating"),
            json.dumps(baseline, ensure_ascii=False),
            int(player.get("mentionsTotal") if player.get("mentionsTotal") is not None else len(mentions)),
            json.dumps(mentions, ensure_ascii=False),
            json.dumps(player.get("metadata", {}), ensure_ascii=False),
            now,
            now,
        ),
    )


def _ensure_points_per_mio(player: dict[str, Any]) -> float:
    price = float(player.get("marketValue") or 0.0)
    if price <= 0:
        return 0.0
    return round(float(player["xPoints"]) / price, 2)


def _seed_from_builtin_if_empty() -> None:
    with get_connection() as conn:
        row = conn.execute("SELECT COUNT(*) AS c FROM players").fetchone()
        if row and row["c"] > 0:
            return
        for seed in _load_seed_players():
            payload = {
                "id": seed["id"],
                "name": seed["name"],
                "shortName": seed.get("shortName") or _short_name(seed["name"]),
                "club": seed["club"],
                "clubCode": seed.get("clubCode") or _club_code(seed["club"]),
                "position": _normalize_position(seed.get("position")),
                "marketValue": float(seed.get("marketValue") or 0.0),
                "xPoints": float(seed.get("xPoints") or 0.0),
                "pointsPerMio": float(seed.get("pointsPerMio") or 0.0),
                "stabIndex": float(seed.get("stabIndex") or 3.5),
                "ueberperformerScore": float(seed.get("ueberperformerScore") or 0.0),
                "form": seed.get("form") or [10, 10, 10, 10, 10],
                "metadata": {"source": "seed_players"},
            }
            payload["pointsPerMio"] = _ensure_points_per_mio(payload)
            _upsert_player(conn, payload)
        conn.commit()


_LEAGUE_TAG_LABELS: dict[str, str] = {
    "BL": "BUNDESLIGA",
    "2L": "2. BUNDESLIGA",
}


def _row_to_player(row: sqlite3.Row) -> dict[str, Any]:
    form = json.loads(row["form_json"] or "[]")
    baseline = json.loads(row["baseline_json"] or "{}")
    mentions = json.loads(row["mentions_json"] or "[]")
    try:
        metadata = json.loads(row["metadata_json"] or "{}")
    except Exception:  # noqa: BLE001
        metadata = {}
    points_source = metadata.get("pointsSource") if isinstance(metadata, dict) else None
    league_tag = _LEAGUE_TAG_LABELS.get(points_source) if points_source else None
    # Aufsteiger ohne gematchte 2L-Punkte haben pointsSource=None - das ist nicht "Ausland".
    if not league_tag and _is_current_bundesliga_club(row["club"], row["club_code"]):
        league_tag = "BUNDESLIGA"
    last_mention_date = _latest_mention_date(mentions)
    average_grade = _valid_kicker_grade(row["average_grade"])
    if not isinstance(baseline, dict):
        baseline = {}
    # Neutral rekonstruieren, bevor eine Archiv-Note aus der falschen Saison draufkommt.
    baseline_for_stale = {**baseline, "avgGrade": 3.5}
    points_last, stale_csv = _effective_last_season_points(
        row["points_last_season"],
        row["position"],
        baseline_for_stale,
        points_source,
        int(row["goals_last_season"] or 0),
        int(row["assists_last_season"] or 0),
    )
    if stale_csv:
        average_grade = None
        baseline = {**baseline, "avgGrade": 3.5}
    else:
        baseline = _overlay_grade_on_baseline(baseline, average_grade)
    x_points = _projection_points(row["position"], baseline)
    price = float(row["market_value"] or 0.0)
    points_per_mio = round(x_points / price, 2) if price > 0 else 0.0
    return {
        "id": row["player_id"],
        "name": row["name"],
        "shortName": row["short_name"],
        "club": row["club"],
        "clubCode": row["club_code"],
        "position": row["position"],
        "marketValue": row["market_value"],
        "xPoints": x_points,
        "pointsPerMio": points_per_mio,
        "stabIndex": row["stab_index"],
        "ueberperformerScore": _derive_ueberperformer(
            row["agent_score"],
            row["market_value"],
            x_points,
            row["mentions_count"] or len(mentions),
        ),
        "form": form if isinstance(form, list) else [],
        "pointsLastSeason": points_last,
        "averageGrade": average_grade,
        "goalsLastSeason": row["goals_last_season"],
        "assistsLastSeason": row["assists_last_season"],
        "appearancesLastSeason": row["appearances_last_season"],
        "agentScore": row["agent_score"],
        "agentLabel": row["agent_label"],
        # PlAIer-Score aus dem "MAIK mit AI"-Podcast - lag bisher nur in der DB, wurde aber
        # nie ans Frontend durchgereicht (Datencheck 24.08.2026, User-Feedback "MAIK Punkte
        # fehlen"). Siehe kicker-scout/app/scoring.py fuer die Herkunft.
        "plaierScore": row["plaier_score"],
        "valuePick": bool(row["value_pick"]),
        "userRating": row["user_rating"],
        "isFavorite": bool(row["is_favorite"]),
        "isHidden": bool(row["is_hidden"]),
        "active": bool(row["active"]),
        "sofascoreSeasonRating": row["sofascore_season_rating"],
        "mentionsCount": row["mentions_count"] or 0,
        "mentions": mentions if isinstance(mentions, list) else [],
        "baselineProjection": baseline,
        "leagueTag": league_tag,
        "injury": _safe_json(row["injury_json"] if "injury_json" in row.keys() else None),
        "lastMentionDate": last_mention_date,
    }


def _latest_mention_date(mentions: Any) -> str | None:
    """Juengstes 'published'-Datum ueber alle Erwaehnungen eines Spielers (Sortierung im
    Dashboard, User-Wunsch 24.08.2026: sortierbare 'Update'-Spalte je Spieler)."""
    if not isinstance(mentions, list):
        return None
    dates = [m.get("published") for m in mentions if isinstance(m, dict) and m.get("published")]
    return max(dates) if dates else None


def _safe_json(raw: str | None) -> Any:
    if not raw:
        return None
    try:
        return json.loads(raw)
    except Exception:  # noqa: BLE001
        return None


def _save_squad(user_id: str, payload: dict[str, Any]) -> str:
    updated_at = datetime.now(timezone.utc).isoformat()
    with get_connection() as conn:
        conn.execute(
            """
            INSERT INTO squads (user_id, payload_json, updated_at)
            VALUES (?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET
                payload_json = excluded.payload_json,
                updated_at = excluded.updated_at
            """,
            (user_id, json.dumps(payload, ensure_ascii=False), updated_at),
        )
        conn.commit()
    return updated_at


def _load_squad(user_id: str) -> dict[str, Any]:
    with get_connection() as conn:
        row = conn.execute("SELECT payload_json FROM squads WHERE user_id = ?", (user_id,)).fetchone()
    if not row:
        return _default_squad_state()
    try:
        return json.loads(row["payload_json"])
    except Exception:  # noqa: BLE001
        return _default_squad_state()


def _convert_scout_row(row: sqlite3.Row, mentions: list[dict[str, Any]]) -> dict[str, Any]:
    position = _normalize_position(row["position"])
    market_value = float(row["kicker_price"] or 0.0)
    if market_value >= _MARKET_VALUE_SENTINEL_THRESHOLD:
        market_value = _MARKET_VALUE_FALLBACK
    points_last = row["points_last_season"] if row["points_last_season"] is not None else 0
    payload = {
        "id": row["kicker_player_id"] or f"manual-{row['id']}",
        "name": row["name"],
        "shortName": _short_name(row["name"]),
        "club": row["team"] or "Unknown",
        "clubCode": _club_code(row["team"]),
        "position": position,
        "marketValue": market_value,
        "pointsPerMio": 0,
        "stabIndex": _derive_stab_index(row["average_grade"]),
        "ueberperformerScore": 0.0,
        "pointsLastSeason": points_last,
        "averageGrade": _valid_kicker_grade(row["average_grade"]),
        "goalsLastSeason": row["goals_last_season"] or 0,
        "assistsLastSeason": row["assists_last_season"] or 0,
        "appearancesLastSeason": row["appearances_last_season"] or 0,
        "agentScore": row["agent_score"],
        "agentLabel": row["agent_label"],
        "plaierScore": row["plaier_score"],
        "valuePick": bool(row["value_pick"]),
        "userRating": row["user_rating"],
        "isFavorite": bool(row["is_favorite"]),
        "isHidden": bool(row["is_hidden"]),
        # Aufsteiger-Kader (2L/None-Punkte) gehoeren in den Managerspiel-Pool.
        "active": True
        if _is_current_bundesliga_club(row["team"], _club_code(row["team"]))
        else bool(row["active"]),
        "mentions": mentions,
        "metadata": {
            "source": "kicker_scout_db",
            "sourcePlayerId": row["id"],
            "pointsSource": row["points_source"],
            "priceSource": row["price_source"],
        },
    }
    baseline = _default_projection_for_player(payload)
    points_last, stale_csv = _effective_last_season_points(
        points_last,
        position,
        {**baseline, "avgGrade": 3.5},
        (row["points_source"] or "").strip().upper() or None,
        int(row["goals_last_season"] or 0),
        int(row["assists_last_season"] or 0),
    )
    if stale_csv:
        payload["averageGrade"] = None
        payload["pointsLastSeason"] = points_last
        baseline = {**baseline, "avgGrade": 3.5}
    payload["baselineProjection"] = baseline
    x_points = _projection_points(position, baseline)
    payload["xPoints"] = x_points
    payload["form"] = _derive_form(x_points, row["agent_score"])
    payload["pointsPerMio"] = _ensure_points_per_mio(payload)
    payload["ueberperformerScore"] = _derive_ueberperformer(
        row["agent_score"], market_value, x_points, len(mentions)
    )
    return payload


def ingest_from_scout_db(path: Path) -> dict[str, Any]:
    if not path.exists():
        raise FileNotFoundError(f"Scout DB not found: {path}")
    imported = 0
    with sqlite3.connect(path) as src:
        src.row_factory = sqlite3.Row
        rows = src.execute(
            """
            SELECT
                id, kicker_player_id, name, team, position, kicker_price,
                points_last_season, points_source, average_grade, price_source,
                goals_last_season, assists_last_season, appearances_last_season,
                agent_score, agent_label, plaier_score, value_pick,
                user_rating, is_favorite, is_hidden, active
            FROM players
            """
        ).fetchall()
        with get_connection() as conn:
            for row in rows:
                # Frueher LIMIT 5 - hat sowohl den Feed als auch die "Besprechungen"-KPI
                # (mentions_count = len(mentions)) fuer vielbesprochene Spieler gedeckelt
                # (Datencheck 24.08.2026). Jetzt alle Mentions + Quell-Typ/Gewichtung fuer
                # die "Erkenntnisse & Feed"-Ansicht im Dashboard.
                mention_rows = src.execute(
                    """
                    SELECT source_type, source_name, source_title, sentiment, rating_label,
                           quote, source_url, published, weight
                    FROM mentions
                    WHERE player_id = ?
                    ORDER BY published DESC
                    """,
                    (row["id"],),
                ).fetchall()
                mentions = [dict(m) for m in mention_rows]
                payload = _convert_scout_row(row, mentions)
                payload["mentionsTotal"] = len(mentions)
                _upsert_player(conn, payload)
                imported += 1
            overlay = _apply_official_squad_overlay(conn)
            conn.execute("INSERT OR REPLACE INTO system_metrics (key, value_json, updated_at) VALUES (?, ?, ?)", (
                "last_ingest",
                json.dumps(
                    {
                        "source": "kicker_scout_db",
                        "path": str(path),
                        "players": imported,
                        "squadOverlay": overlay,
                        "at": datetime.now(timezone.utc).isoformat(),
                    },
                    ensure_ascii=False,
                ),
                datetime.now(timezone.utc).isoformat(),
            ))
            conn.commit()
    return {"imported": imported, "source": str(path), "squadOverlay": overlay}


def _convert_ingest_player(player: IngestPlayerIn) -> dict[str, Any]:
    position = _normalize_position(player.position)
    payload = {
        "id": player.id,
        "name": player.name,
        "shortName": player.shortName or _short_name(player.name),
        "club": player.club,
        "clubCode": player.clubCode or _club_code(player.club),
        "position": position,
        "marketValue": float(player.marketValue or 0.0),
        "pointsPerMio": player.pointsPerMio or 0,
        "stabIndex": player.stabIndex if player.stabIndex is not None else _derive_stab_index(player.averageGrade),
        "ueberperformerScore": 0.0,
        "pointsLastSeason": player.pointsLastSeason,
        "averageGrade": _valid_kicker_grade(player.averageGrade),
        "goalsLastSeason": player.goalsLastSeason,
        "assistsLastSeason": player.assistsLastSeason,
        "appearancesLastSeason": player.appearancesLastSeason,
        "agentScore": player.agentScore,
        "agentLabel": player.agentLabel,
        "plaierScore": player.plaierScore,
        "valuePick": player.valuePick,
        "userRating": player.userRating,
        "isFavorite": player.isFavorite,
        "isHidden": player.isHidden,
        "active": True if _is_current_bundesliga_club(player.club, player.clubCode) else player.active,
        "mentions": player.mentions,
        "mentionsTotal": player.mentionsTotal,
        "metadata": player.metadata,
    }
    baseline = (
        player.baselineProjection.model_dump()
        if player.baselineProjection
        else _default_projection_for_player(payload)
    )
    points_last, stale_csv = _effective_last_season_points(
        payload.get("pointsLastSeason"),
        position,
        {**baseline, "avgGrade": 3.5},
        (player.metadata or {}).get("pointsSource") if isinstance(player.metadata, dict) else None,
        int(player.goalsLastSeason or 0),
        int(player.assistsLastSeason or 0),
    )
    if stale_csv:
        payload["averageGrade"] = None
        payload["pointsLastSeason"] = points_last
        baseline = {**baseline, "avgGrade": 3.5}
    else:
        baseline = _overlay_grade_on_baseline(baseline, payload.get("averageGrade"))
    payload["baselineProjection"] = baseline
    # xPunkte werden aus derselben Prognose (baselineProjection) berechnet wie im Frontend
    # (Spieler-Details-Modal, Spielfeld, Bank) - player.xPoints ist nur ein expliziter
    # Client-Override (z.B. Seed-Daten), sonst wuerden Liste und Detail-Ansicht auseinanderlaufen.
    x_points = float(player.xPoints) if player.xPoints is not None else _projection_points(position, baseline)
    payload["xPoints"] = x_points
    payload["form"] = player.form or _derive_form(x_points, player.agentScore)
    payload["pointsPerMio"] = _ensure_points_per_mio(payload) if not payload["pointsPerMio"] else payload["pointsPerMio"]
    mention_n = player.mentionsTotal if player.mentionsTotal is not None else len(player.mentions)
    payload["ueberperformerScore"] = _derive_ueberperformer(
        player.agentScore, payload["marketValue"], x_points, mention_n
    )
    return payload


def _merge_unique(items: list[str]) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []
    for item in items:
        if not item or not item.strip():
            continue
        key = item.strip().lower()
        if key in seen:
            continue
        seen.add(key)
        result.append(item.strip())
    return result


def _merge_injuries(entries: list[tuple[str | None, TeamInjuryIn]]) -> list[dict[str, Any]]:
    """Dedupe Verletzungen je Spieler (case-insensitive); bei Konflikt gewinnt die juengste
    Quelle bzw. bei Gleichstand der vollstaendigere Eintrag (mehr ausgefuellte Felder)."""
    best: dict[str, tuple[str, dict[str, Any]]] = {}
    for published, inj in entries:
        name = (inj.player or "").strip()
        if not name:
            continue
        key = name.lower()
        candidate = {"player": name, "art": inj.art, "dauer": inj.dauer, "hinweis": inj.hinweis}
        pub = published or ""
        existing = best.get(key)
        if existing is None:
            best[key] = (pub, candidate)
            continue
        existing_pub, existing_val = existing
        candidate_score = sum(1 for v in candidate.values() if v)
        existing_score = sum(1 for v in existing_val.values() if v)
        if pub > existing_pub or (pub == existing_pub and candidate_score > existing_score):
            best[key] = (pub, candidate)
    return [v for _, v in best.values()]


def _apply_injuries_to_players(
    conn: sqlite3.Connection,
    team: str,
    verletzungen: list[dict[str, Any]],
    source: str | None,
    published: str | None,
) -> None:
    rows = conn.execute("SELECT player_id, name FROM players WHERE club = ?", (team,)).fetchall()
    matched_ids: set[str] = set()
    for inj in verletzungen:
        target = (inj.get("player") or "").strip().lower()
        if not target:
            continue
        best_row = None
        for row in rows:
            name = (row["name"] or "").strip().lower()
            if name == target or target in name or name in target:
                best_row = row
                break
        if not best_row:
            last = target.split()[-1] if target.split() else ""
            if last and len(last) >= 4:
                last_hits = [
                    row
                    for row in rows
                    if ((row["name"] or "").strip().lower().split() or [""])[-1] == last
                ]
                if len(last_hits) == 1:
                    best_row = last_hits[0]
        if not best_row:
            continue
        matched_ids.add(best_row["player_id"])
        conn.execute(
            "UPDATE players SET injury_json = ? WHERE player_id = ?",
            (
                json.dumps(
                    {
                        "type": inj.get("art"),
                        "expectedReturn": inj.get("dauer"),
                        "note": inj.get("hinweis"),
                        "source": source,
                        "published": published,
                    },
                    ensure_ascii=False,
                ),
                best_row["player_id"],
            ),
        )
    # Nicht mehr gelistete Verletzungen (z.B. auskuriert) fuer diesen Verein wieder loeschen.
    for row in rows:
        if row["player_id"] not in matched_ids:
            conn.execute(
                "UPDATE players SET injury_json = NULL WHERE player_id = ? AND injury_json IS NOT NULL",
                (row["player_id"],),
            )


def _upsert_team(conn: sqlite3.Connection, team: str, entries: list[TeamIngestIn]) -> None:
    entries_sorted = sorted(entries, key=lambda e: e.published or "")
    club_code = next((e.clubCode for e in reversed(entries_sorted) if e.clubCode), None) or _club_code(team)

    kernaussage_candidates = [e for e in entries_sorted if e.kernaussage]
    kernaussage_pick = kernaussage_candidates[-1] if kernaussage_candidates else None
    tabelle_candidates = [e for e in entries_sorted if e.tabellenplatzMin is not None or e.tabellenplatzMax is not None]
    tabelle_pick = tabelle_candidates[-1] if tabelle_candidates else None

    zugaenge = _merge_unique([z for e in entries for z in e.zugaenge])
    abgaenge = _merge_unique([a for e in entries for a in e.abgaenge])
    value_spieler = _merge_unique([v for e in entries for v in e.valueSpieler])
    talente = _merge_unique([t for e in entries for t in e.talente])
    verletzungen = _merge_injuries([(e.published, inj) for e in entries for inj in e.verletzungen])

    sources: list[dict[str, Any]] = []
    seen_src: set[tuple[Any, ...]] = set()
    for e in sorted(entries, key=lambda e: e.published or "", reverse=True):
        src_key = (e.sourceName, e.sourceTitle, e.published)
        if src_key in seen_src:
            continue
        seen_src.add(src_key)
        sources.append(
            {
                "sourceType": e.sourceType,
                "sourceName": e.sourceName,
                "sourceTitle": e.sourceTitle,
                "sourceUrl": e.sourceUrl,
                "published": e.published,
            }
        )

    now = datetime.now(timezone.utc).isoformat()
    conn.execute(
        """
        INSERT INTO teams (
            team, club_code, kernaussage, kernaussage_source, kernaussage_published,
            tabellenplatz_min, tabellenplatz_max, zugaenge_json, abgaenge_json,
            value_spieler_json, talente_json, verletzungen_json, sources_json, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(team) DO UPDATE SET
            club_code = excluded.club_code,
            kernaussage = excluded.kernaussage,
            kernaussage_source = excluded.kernaussage_source,
            kernaussage_published = excluded.kernaussage_published,
            tabellenplatz_min = excluded.tabellenplatz_min,
            tabellenplatz_max = excluded.tabellenplatz_max,
            zugaenge_json = excluded.zugaenge_json,
            abgaenge_json = excluded.abgaenge_json,
            value_spieler_json = excluded.value_spieler_json,
            talente_json = excluded.talente_json,
            verletzungen_json = excluded.verletzungen_json,
            sources_json = excluded.sources_json,
            updated_at = excluded.updated_at
        """,
        (
            team,
            club_code,
            kernaussage_pick.kernaussage if kernaussage_pick else None,
            kernaussage_pick.sourceName if kernaussage_pick else None,
            kernaussage_pick.published if kernaussage_pick else None,
            tabelle_pick.tabellenplatzMin if tabelle_pick else None,
            tabelle_pick.tabellenplatzMax if tabelle_pick else None,
            json.dumps(zugaenge, ensure_ascii=False),
            json.dumps(abgaenge, ensure_ascii=False),
            json.dumps(value_spieler, ensure_ascii=False),
            json.dumps(talente, ensure_ascii=False),
            json.dumps(verletzungen, ensure_ascii=False),
            json.dumps(sources, ensure_ascii=False),
            now,
        ),
    )
    latest_source = entries_sorted[-1].sourceName if entries_sorted else None
    latest_published = entries_sorted[-1].published if entries_sorted else None
    _apply_injuries_to_players(conn, team, verletzungen, latest_source, latest_published)


def _row_to_team(row: sqlite3.Row) -> dict[str, Any]:
    return {
        "team": row["team"],
        "clubCode": row["club_code"] or _club_code(row["team"]),
        "kernaussage": row["kernaussage"],
        "kernaussageSource": row["kernaussage_source"],
        "kernaussagePublished": row["kernaussage_published"],
        "tabellenplatzMin": row["tabellenplatz_min"],
        "tabellenplatzMax": row["tabellenplatz_max"],
        "zugaenge": json.loads(row["zugaenge_json"] or "[]"),
        "abgaenge": json.loads(row["abgaenge_json"] or "[]"),
        "valueSpieler": json.loads(row["value_spieler_json"] or "[]"),
        "talente": json.loads(row["talente_json"] or "[]"),
        "verletzungen": json.loads(row["verletzungen_json"] or "[]"),
        "sources": json.loads(row["sources_json"] or "[]"),
        "updatedAt": row["updated_at"],
    }


@app.on_event("startup")
def _startup() -> None:
    init_db()
    _seed_from_builtin_if_empty()
    with get_connection() as conn:
        try:
            safe_refresh_activity_log(conn)
            conn.commit()
        except Exception:
            # Backfill darf den API-Start nicht verhindern.
            conn.rollback()


@app.get("/health")
def health():
    return {"status": "ok", "version": APP_VERSION, "dbPath": str(DB_PATH)}


@app.get("/api/logs")
def list_logs(limit: int = 400, category: str | None = None, status: str | None = None):
    with get_connection() as conn:
        items = list_events(conn, limit=limit, category=category, status=status)
        total = conn.execute("SELECT COUNT(*) AS c FROM activity_log").fetchone()["c"]
    return {"items": items, "total": total}


@app.get("/api/meta")
def meta():
    with get_connection() as conn:
        count = conn.execute("SELECT COUNT(*) AS c FROM players").fetchone()["c"]
        ingest = conn.execute("SELECT value_json FROM system_metrics WHERE key = 'last_ingest'").fetchone()
        sofa = conn.execute("SELECT value_json FROM system_metrics WHERE key = 'sofascore_sync'").fetchone()
    return {
        "version": APP_VERSION,
        "players": count,
        "lastIngest": json.loads(ingest["value_json"]) if ingest else None,
        "lastSofascoreSync": json.loads(sofa["value_json"]) if sofa else None,
    }


@app.get("/api/players", response_model=list[PlayerOut])
def list_players(includeHidden: bool = False, includeInactive: bool = False):
    where: list[str] = []
    if not includeHidden:
        where.append("is_hidden = 0")
    if not includeInactive:
        where.append("active = 1")
    where_sql = f"WHERE {' AND '.join(where)}" if where else ""
    with get_connection() as conn:
        rows = conn.execute(
            f"""
            SELECT *
            FROM players
            {where_sql}
            ORDER BY x_points DESC, market_value DESC, name ASC
            """
        ).fetchall()
    return [_row_to_player(row) for row in rows]


@app.patch("/api/players/{player_id}", response_model=PlayerOut)
def patch_player(player_id: str, payload: PlayerPatchIn):
    fields = payload.model_dump(exclude_unset=True)
    if not fields:
        with get_connection() as conn:
            row = conn.execute("SELECT * FROM players WHERE player_id = ?", (player_id,)).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Player not found")
        return _row_to_player(row)

    column_map = {"isFavorite": "is_favorite", "userRating": "user_rating", "isHidden": "is_hidden"}
    set_clauses = []
    values: list[Any] = []
    for key, value in fields.items():
        column = column_map[key]
        set_clauses.append(f"{column} = ?")
        values.append(int(value) if isinstance(value, bool) else value)
    set_clauses.append("updated_at = ?")
    values.append(datetime.now(timezone.utc).isoformat())
    values.append(player_id)

    with get_connection() as conn:
        cur = conn.execute(
            f"UPDATE players SET {', '.join(set_clauses)} WHERE player_id = ?",
            values,
        )
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Player not found")
        conn.commit()
        row = conn.execute("SELECT * FROM players WHERE player_id = ?", (player_id,)).fetchone()
    return _row_to_player(row)


@app.get("/api/squads/{user_id}")
def get_squads(user_id: str = "default"):
    return _load_squad(user_id)


@app.put("/api/squads/{user_id}")
def put_squads(payload: SquadStateIn, user_id: str = "default"):
    body = payload.model_dump()
    body["updatedAt"] = datetime.now(timezone.utc).isoformat()
    updated_at = _save_squad(user_id, body)
    return {"ok": True, "updatedAt": updated_at, "version": APP_VERSION}


@app.post("/api/admin/backup")
def create_backup():
    backup = backup_db()
    if not backup:
        raise HTTPException(status_code=404, detail="No DB to backup yet")
    with get_connection() as conn:
        log_event(
            conn,
            status="ok",
            category="backup",
            title="Datenbank-Backup",
            message=f"Datenbank-Backup angelegt: {backup.name}",
            details={"backup": str(backup)},
        )
        conn.commit()
    return {"ok": True, "backup": str(backup)}


@app.post("/api/admin/ingest/scout-db")
def ingest_scout_db(path: str | None = None):
    db_path = Path(path) if path else Path(os.getenv("KICKER_SCOUT_DB_PATH", ""))
    if not str(db_path):
        raise HTTPException(status_code=400, detail="No path provided and KICKER_SCOUT_DB_PATH is empty")
    try:
        result = ingest_from_scout_db(db_path)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    with get_connection() as conn:
        log_event(
            conn,
            status="ok",
            category="ingest",
            title="Scout-DB-Ingest",
            message=f"Scout-DB importiert: {result.get('imported', 0)} Spieler",
            details=result,
        )
        safe_refresh_activity_log(conn)
        conn.commit()
    return {"ok": True, **result}


@app.post("/api/admin/ingest/refresh-squad")
def refresh_official_squad():
    """Deaktiviert Abgaenge und refresht Club/Preis direkt aus der aktuellen Kicker-CSV."""
    with get_connection() as conn:
        overlay = _apply_official_squad_overlay(conn)
        if overlay.get("ok"):
            overlay_msg = (
                f"CSV-Overlay: {overlay.get('refreshed', 0)} aktualisiert, "
                f"{overlay.get('deactivated', 0)} deaktiviert"
            )
        else:
            overlay_msg = f"CSV-Overlay übersprungen ({overlay.get('reason')})"
        log_event(
            conn,
            status="ok" if overlay.get("ok") else "warn",
            category="ingest",
            title="Kader-Overlay",
            message=overlay_msg,
            details=overlay,
        )
        safe_refresh_activity_log(conn)
        conn.commit()
    return {"ok": bool(overlay.get("ok")), **overlay}


@app.post("/api/admin/ingest/payload")
def ingest_payload(payload: IngestPayload):
    if payload.replace:
        with get_connection() as conn:
            conn.execute("DELETE FROM players")
            conn.commit()
    imported = 0
    with get_connection() as conn:
        for player in payload.players:
            _upsert_player(conn, _convert_ingest_player(player))
            imported += 1
        overlay = _apply_official_squad_overlay(conn)
        conn.execute(
            "INSERT OR REPLACE INTO system_metrics (key, value_json, updated_at) VALUES (?, ?, ?)",
            (
                "last_ingest",
                json.dumps(
                    {
                        "source": payload.source,
                        "players": imported,
                        "replace": payload.replace,
                        "squadOverlay": overlay,
                        "at": datetime.now(timezone.utc).isoformat(),
                    },
                    ensure_ascii=False,
                ),
                datetime.now(timezone.utc).isoformat(),
            ),
        )
        log_event(
            conn,
            status="ok",
            category="ingest",
            title="Spieler-Ingest",
            message=f"Spielerdaten übernommen: {imported} Spieler (Quelle: {payload.source})",
            details={
                "source": payload.source,
                "imported": imported,
                "replace": payload.replace,
                "squadOverlay": overlay,
            },
        )
        safe_refresh_activity_log(conn)
        conn.commit()
    return {"ok": True, "imported": imported, "squadOverlay": overlay}


@app.get("/api/teams", response_model=list[TeamOut])
def list_teams():
    with get_connection() as conn:
        rows = conn.execute("SELECT * FROM teams ORDER BY team ASC").fetchall()
    return [_row_to_team(row) for row in rows]


@app.post("/api/admin/ingest/teams")
def ingest_teams(payload: TeamIngestPayload):
    grouped: dict[str, list[TeamIngestIn]] = {}
    for entry in payload.entries:
        grouped.setdefault(entry.team, []).append(entry)
    with get_connection() as conn:
        if payload.replace:
            conn.execute("DELETE FROM teams")
        for team, entries in grouped.items():
            _upsert_team(conn, team, entries)
        conn.execute(
            "INSERT OR REPLACE INTO system_metrics (key, value_json, updated_at) VALUES (?, ?, ?)",
            (
                "last_teams_ingest",
                json.dumps(
                    {"teams": len(grouped), "entries": len(payload.entries), "at": datetime.now(timezone.utc).isoformat()},
                    ensure_ascii=False,
                ),
                datetime.now(timezone.utc).isoformat(),
            ),
        )
        log_event(
            conn,
            status="ok",
            category="ingest",
            title="Team-Ingest",
            message=f"Team-Daten übernommen: {len(grouped)} Teams, {len(payload.entries)} Einträge",
            details={"teams": len(grouped), "entries": len(payload.entries), "replace": payload.replace},
        )
        safe_refresh_activity_log(conn)
        conn.commit()
    return {"ok": True, "teams": len(grouped), "entries": len(payload.entries)}


@app.post("/api/admin/sofascore/sync")
def run_sofascore_sync(request: SofaSyncRequest):
    api_key = os.getenv("SOFASCORE_RAPIDAPI_KEY", "").strip()
    if not api_key:
        raise HTTPException(status_code=400, detail="SOFASCORE_RAPIDAPI_KEY is not configured")
    with get_connection() as conn:
        result = sync_sofascore_ratings(
            conn=conn,
            api_key=api_key,
            season_id=request.seasonId,
            max_players=request.maxPlayers,
            only_missing=request.onlyMissing,
            dry_run=request.dryRun,
        )
        if not request.dryRun:
            unresolved = result.get("unresolved") or 0
            log_event(
                conn,
                status="warning" if unresolved else "ok",
                category="sync",
                title="SofaScore-Sync",
                message=(
                    f"SofaScore-Sync: {result.get('updated', 0)} Ratings aktualisiert"
                    + (f", {unresolved} ohne Match" if unresolved else "")
                ),
                details={k: v for k, v in result.items() if k != "details"},
            )
        conn.commit()
    return {"ok": True, **result}
