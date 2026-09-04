"""Plausibility audit: last-season points, xPoints, 2L, transfers."""
from __future__ import annotations

import json
import urllib.request
from collections import Counter
from pathlib import Path

API = "http://192.168.178.251:8050/api/players"
OFFICIAL = Path(r"C:\Dev\privateTemp\kicker-scout\data\kicker_official_players.json")
OUT = Path(__file__).resolve().parents[2] / "tmp_points_audit.json"

GOAL_PTS = {"TOR": 6, "ABW": 5, "MIT": 4, "STU": 3}
PROMOTED = {"SC Paderborn 07", "FC Schalke 04", "SV Elversberg"}
MANUAL_OVERRIDES = {"pl-k00097893": "Ramaj (BVB, Leihe Heidenheim)", "pl-k00054360": "Batz (Gladbach, von Mainz)"}


def valid_grade(raw) -> float | None:
    try:
        v = float(raw)
    except (TypeError, ValueError):
        return None
    if v < 1.0 or v > 6.0:
        return None
    return round(v, 2)


def recon(pos: str, b: dict, grade: float | None) -> int:
    g = grade if grade is not None else 3.5
    starts = int(b.get("starts") or 0)
    subs = int(b.get("subApps") or 0)
    rated = int(b.get("ratedGames") or 0)
    goals = int(b.get("goals") or 0)
    assists = int(b.get("assists") or 0)
    motm = int(b.get("motm") or 0)
    yr = int(b.get("yellowRed") or 0)
    red = int(b.get("redCards") or 0)
    cs = int(b.get("cleanSheets") or 0) if pos == "TOR" else 0
    notes = round((3.5 - g) * 4 * rated)
    return (
        starts * 4
        + subs * 2
        + goals * GOAL_PTS.get(pos, 4)
        + assists * 2
        + motm * 3
        + yr * -3
        + red * -6
        + cs * 2
        + notes
    )


def stale(stored: int, starts: int, reconstructed: int) -> bool:
    if stored <= 0:
        return False
    if starts >= 10 and stored < starts * 4 * 0.7:
        return True
    if starts <= 8 and stored > reconstructed + 40:
        return True
    return False


def bucket(p: dict, official: dict | None) -> str:
    club = p.get("club") or ""
    tag = p.get("leagueTag") or ""
    src = (official or {}).get("points_source")
    if p["id"] in MANUAL_OVERRIDES:
        return "manual_override"
    if club in PROMOTED or tag == "2. BUNDESLIGA" or src == "2L":
        return "promoted_2l"
    if src is None and (p.get("appearancesLastSeason") or 0) > 0:
        return "transfer_or_unmatched"
    if src == "BL":
        return "bundesliga"
    if not p.get("appearancesLastSeason") and not p.get("pointsLastSeason"):
        return "no_history"
    return "other"


def main() -> None:
    players = json.load(urllib.request.urlopen(API, timeout=30))
    official_all = {}
    if OFFICIAL.exists():
        official_all = json.loads(OFFICIAL.read_text(encoding="utf-8")).get("players", {})

    rows = []
    flags: list[dict] = []
    counts = Counter()
    flag_counts = Counter()

    for p in players:
        off = official_all.get(p["id"])
        base = p.get("baselineProjection") or {}
        starts = int(base.get("starts") or p.get("appearancesLastSeason") or 0)
        pos = p.get("position") or "MIT"
        grade = valid_grade(p.get("averageGrade"))
        recon_grade = recon(pos, base, grade)
        recon_neutral = recon(pos, {**base, "avgGrade": 3.5}, 3.5)
        shown = int(p.get("pointsLastSeason") or 0)
        xp = round(float(p.get("xPoints") or 0))
        csv_raw = int(off["points"]) if off and off.get("points") is not None else None
        is_stale = stale(csv_raw or shown, starts, recon_neutral)
        cat = bucket(p, off)
        counts[cat] += 1

        issue = None
        detail = None
        output_floor = starts * 4 + int(p.get("goalsLastSeason") or 0) * GOAL_PTS.get(pos, 4) + int(p.get("assistsLastSeason") or 0) * 2
        floor = starts * 4
        csv_looks_low = csv_raw is not None and starts >= 10 and csv_raw < output_floor - 20
        if starts >= 10 and shown > 0 and shown < floor * 0.7:
            issue = "shown_below_startelf_floor"
            detail = f"shown {shown} < 70% of {floor} startelf"
        elif csv_looks_low and shown == csv_raw:
            issue = "csv_below_output_floor"
            detail = f"CSV {csv_raw} < output-floor {output_floor} (starts+goals+assists)"
        elif shown == 0 and starts >= 10:
            issue = "zero_points_with_many_apps"
            detail = f"{starts} starts, 0 Punkte"
        elif starts <= 8 and shown >= 80 and recon_neutral < shown - 40:
            issue = "high_points_few_apps"
            detail = f"{starts} starts, shown {shown}, recon {recon_neutral}"
        elif abs(xp - shown) >= 25 and shown > 0:
            issue = "xpkt_vs_pkt_gap"
            detail = f"Pkt {shown} vs xPkt {xp} (Δ{xp - shown})"
        elif csv_raw is not None and shown != csv_raw and abs(shown - csv_raw) >= 5:
            if is_stale:
                issue = "stale_corrected"
                detail = f"CSV {csv_raw} -> API {shown} (recon {recon_neutral})"
            else:
                issue = "api_vs_csv_mismatch"
                detail = f"API {shown} vs CSV {csv_raw}"
        elif grade is None and starts >= 15 and cat == "bundesliga" and shown > 0:
            issue = "missing_bl_grade"
            detail = f"{starts} BL-Starts ohne Note"
        elif (p.get("goalsLastSeason") or 0) > starts + int(base.get("subApps") or 0) + 2:
            issue = "goals_gt_apps"
            detail = f"{p.get('goalsLastSeason')} Tore bei {starts} Einsätzen"

        if issue:
            flag_counts[issue] += 1
            flags.append(
                {
                    "name": p["name"],
                    "club": p["club"],
                    "pos": pos,
                    "cat": cat,
                    "issue": issue,
                    "detail": detail,
                    "shown": shown,
                    "csv": csv_raw,
                    "xp": xp,
                    "recon": recon_grade,
                    "reconNeutral": recon_neutral,
                    "starts": starts,
                    "goals": p.get("goalsLastSeason") or 0,
                    "assists": p.get("assistsLastSeason") or 0,
                    "grade": grade,
                    "tag": p.get("leagueTag"),
                    "mw": p.get("marketValue"),
                }
            )

        rows.append(
            {
                "id": p["id"],
                "name": p["name"],
                "club": p["club"],
                "pos": pos,
                "cat": cat,
                "shown": shown,
                "csv": csv_raw,
                "xp": xp,
                "recon": recon_grade,
                "reconNeutral": recon_neutral,
                "stale": is_stale,
                "starts": starts,
                "goals": p.get("goalsLastSeason") or 0,
                "assists": p.get("assistsLastSeason") or 0,
                "grade": grade,
                "tag": p.get("leagueTag"),
                "mw": p.get("marketValue"),
                "override": MANUAL_OVERRIDES.get(p["id"]),
            }
        )

    # summaries
    promoted = [r for r in rows if r["cat"] == "promoted_2l"]
    transfers = [r for r in rows if r["cat"] == "transfer_or_unmatched"]
    overrides = [r for r in rows if r["cat"] == "manual_override"]
    bl = [r for r in rows if r["cat"] == "bundesliga"]

    def gap_stats(group):
        gaps = [r["shown"] - r["reconNeutral"] for r in group if r["shown"] > 0]
        if not gaps:
            return {"n": 0}
        return {
            "n": len(group),
            "withPoints": len(gaps),
            "medianGap": sorted(gaps)[len(gaps) // 2],
            "meanAbs": round(sum(abs(g) for g in gaps) / len(gaps), 1),
        }

    payload = {
        "total": len(rows),
        "counts": dict(counts),
        "flagCounts": dict(flag_counts),
        "gaps": {
            "bundesliga": gap_stats(bl),
            "promoted_2l": gap_stats(promoted),
            "transfer_or_unmatched": gap_stats(transfers),
        },
        "promotedAll": sorted(promoted, key=lambda r: -(r["starts"] or 0)),
        "transferAll": sorted(transfers, key=lambda r: -(r["starts"] or 0)),
        "overrides": overrides,
        "flags": sorted(flags, key=lambda f: (f["issue"], -f["starts"])),
        "topPkt": sorted(rows, key=lambda r: -r["shown"])[:12],
        "zeroWithApps": [r for r in rows if r["shown"] == 0 and r["starts"] >= 10][:20],
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"total": payload["total"], "counts": payload["counts"], "flagCounts": payload["flagCounts"], "gaps": payload["gaps"], "out": str(OUT)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
