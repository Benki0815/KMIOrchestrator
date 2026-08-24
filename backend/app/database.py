from __future__ import annotations

import os
import shutil
import sqlite3
from contextlib import contextmanager
from datetime import datetime
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "data"
BACKUP_DIR = DATA_DIR / "backups"
MAX_BACKUPS = 20


def _resolve_db_path() -> Path:
    raw = os.getenv("KMI_DB_PATH")
    if not raw:
        return DATA_DIR / "kmi_portal.db"
    if raw.startswith("sqlite:///"):
        raw = raw.replace("sqlite:///", "", 1)
    return Path(raw).expanduser()


DB_PATH = _resolve_db_path()

SCHEMA = """
CREATE TABLE IF NOT EXISTS players (
    player_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    club TEXT NOT NULL,
    club_code TEXT NOT NULL,
    position TEXT NOT NULL,
    market_value REAL NOT NULL DEFAULT 0,
    x_points REAL NOT NULL DEFAULT 0,
    points_per_mio REAL NOT NULL DEFAULT 0,
    stab_index REAL NOT NULL DEFAULT 0,
    ueberperformer_score REAL NOT NULL DEFAULT 0,
    form_json TEXT NOT NULL DEFAULT '[]',
    points_last_season INTEGER,
    average_grade REAL,
    goals_last_season INTEGER,
    assists_last_season INTEGER,
    appearances_last_season INTEGER,
    agent_score REAL,
    agent_label TEXT,
    plaier_score REAL,
    value_pick INTEGER NOT NULL DEFAULT 0,
    user_rating INTEGER,
    is_favorite INTEGER NOT NULL DEFAULT 0,
    is_hidden INTEGER NOT NULL DEFAULT 0,
    active INTEGER NOT NULL DEFAULT 1,
    sofascore_player_id INTEGER,
    sofascore_season_rating REAL,
    baseline_json TEXT NOT NULL DEFAULT '{}',
    mentions_count INTEGER NOT NULL DEFAULT 0,
    mentions_json TEXT NOT NULL DEFAULT '[]',
    metadata_json TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_players_position ON players(position);
CREATE INDEX IF NOT EXISTS idx_players_active ON players(active, is_hidden);
CREATE INDEX IF NOT EXISTS idx_players_club ON players(club);

CREATE TABLE IF NOT EXISTS squads (
    user_id TEXT PRIMARY KEY,
    payload_json TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS player_kicker_mapping (
    kicker_player_id TEXT PRIMARY KEY,
    player_name TEXT NOT NULL,
    club TEXT,
    sofascore_player_id INTEGER NOT NULL,
    confidence REAL NOT NULL DEFAULT 0,
    source TEXT NOT NULL DEFAULT 'search',
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sofascore_cache (
    cache_key TEXT PRIMARY KEY,
    endpoint TEXT NOT NULL,
    response_json TEXT NOT NULL,
    fetched_at TEXT NOT NULL DEFAULT (datetime('now')),
    expires_at TEXT
);

CREATE TABLE IF NOT EXISTS system_metrics (
    key TEXT PRIMARY KEY,
    value_json TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS activity_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fingerprint TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL,
    status TEXT NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    details_json TEXT NOT NULL DEFAULT '{}'
);
CREATE INDEX IF NOT EXISTS idx_activity_log_created ON activity_log(created_at DESC);

CREATE TABLE IF NOT EXISTS teams (
    team TEXT PRIMARY KEY,
    club_code TEXT,
    kernaussage TEXT,
    kernaussage_source TEXT,
    kernaussage_published TEXT,
    tabellenplatz_min INTEGER,
    tabellenplatz_max INTEGER,
    zugaenge_json TEXT NOT NULL DEFAULT '[]',
    abgaenge_json TEXT NOT NULL DEFAULT '[]',
    value_spieler_json TEXT NOT NULL DEFAULT '[]',
    talente_json TEXT NOT NULL DEFAULT '[]',
    verletzungen_json TEXT NOT NULL DEFAULT '[]',
    sources_json TEXT NOT NULL DEFAULT '[]',
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
"""


def init_db() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with get_connection() as conn:
        conn.executescript(SCHEMA)
        _migrate(conn)
        conn.commit()


def _migrate(conn: sqlite3.Connection) -> None:
    cols = {
        row["name"]
        for row in conn.execute("PRAGMA table_info(players)").fetchall()
    }
    if "metadata_json" not in cols:
        conn.execute("ALTER TABLE players ADD COLUMN metadata_json TEXT NOT NULL DEFAULT '{}'")
    if "baseline_json" not in cols:
        conn.execute("ALTER TABLE players ADD COLUMN baseline_json TEXT NOT NULL DEFAULT '{}'")
    if "sofascore_player_id" not in cols:
        conn.execute("ALTER TABLE players ADD COLUMN sofascore_player_id INTEGER")
    if "sofascore_season_rating" not in cols:
        conn.execute("ALTER TABLE players ADD COLUMN sofascore_season_rating REAL")
    if "injury_json" not in cols:
        conn.execute("ALTER TABLE players ADD COLUMN injury_json TEXT")


@contextmanager
def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    try:
        yield conn
    finally:
        conn.close()


def backup_db() -> Path | None:
    if not DB_PATH.exists():
        return None
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    stamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    target = BACKUP_DIR / f"kmi_portal_{stamp}.db"
    shutil.copy2(DB_PATH, target)

    backups = sorted(BACKUP_DIR.glob("kmi_portal_*.db"), key=lambda p: p.stat().st_mtime, reverse=True)
    for extra in backups[MAX_BACKUPS:]:
        extra.unlink(missing_ok=True)
    return target
