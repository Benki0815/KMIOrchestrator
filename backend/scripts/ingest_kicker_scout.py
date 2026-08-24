from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from app.database import backup_db, init_db  # noqa: E402
from app.main import ingest_from_scout_db  # noqa: E402


def main() -> int:
    parser = argparse.ArgumentParser(description="Import local kicker-scout SQLite players into KMI SQLite.")
    parser.add_argument(
        "--path",
        default=r"C:\Dev\privateTemp\kicker-scout\data\kicker_scout.db",
        help="Absolute path to kicker_scout.db",
    )
    args = parser.parse_args()
    source = Path(args.path)
    init_db()
    backup = backup_db()
    result = ingest_from_scout_db(source)
    print(json.dumps({"backup": str(backup) if backup else None, **result}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
