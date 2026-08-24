from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from app.database import get_connection, init_db  # noqa: E402
from app.sofascore_sync import sync_sofascore_ratings  # noqa: E402


def main() -> int:
    parser = argparse.ArgumentParser(description="One-time SofaScore season rating sync for KMI players.")
    parser.add_argument("--season-id", type=int, default=None, help="SofaScore season id (optional)")
    parser.add_argument("--max-players", type=int, default=None, help="Limit for dry-runs or partial sync")
    parser.add_argument("--dry-run", action="store_true", help="No DB writes")
    parser.add_argument("--all", action="store_true", help="Process all players, not only missing ratings")
    args = parser.parse_args()

    api_key = os.getenv("SOFASCORE_RAPIDAPI_KEY", "").strip()
    if not api_key:
        raise SystemExit("SOFASCORE_RAPIDAPI_KEY is missing")

    init_db()
    with get_connection() as conn:
        result = sync_sofascore_ratings(
            conn=conn,
            api_key=api_key,
            season_id=args.season_id,
            max_players=args.max_players,
            only_missing=not args.all,
            dry_run=args.dry_run,
        )
        if not args.dry_run:
            conn.commit()
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
