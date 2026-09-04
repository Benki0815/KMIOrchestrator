"""Sanity-check for the tightened 2L stale heuristic."""
from __future__ import annotations

GOAL = {"TOR": 6, "ABW": 5, "MIT": 4, "STU": 3}


def stale(stored, starts, recon, src, goals, assists, pos):
    if stored is None or stored <= 0:
        return False
    src = (src or "").strip().upper()
    if src == "BL":
        return False
    starts = max(0, int(starts or 0))
    floor = starts * 2 + int(goals or 0) * GOAL.get(pos, 4) + int(assists or 0) * 2
    if src == "2L" and starts >= 10 and stored < floor - 15:
        return True
    if src == "2L" and starts <= 8 and stored > recon + 40:
        return True
    return False


def effective(stored, src, starts, goals, assists, pos, recon):
    if stale(stored, starts, recon, src, goals, assists, pos):
        return recon, True
    if stored is None:
        return 0, False
    return int(stored), False


def main() -> int:
    # Curda 2L archive vs 25/26 stats
    pts, is_stale = effective(62, "2L", 32, 7, 8, "MIT", 172)
    assert is_stale and pts == 172, (pts, is_stale)

    # Hoeler BL super-sub: official 86 must stay
    pts, is_stale = effective(86, "BL", 33, 3, 3, "STU", 147)
    assert not is_stale and pts == 86, (pts, is_stale)

    # Transfer CSV 0 → keep 0
    pts, is_stale = effective(0, None, 34, 15, 3, "STU", 187)
    assert not is_stale and pts == 0, (pts, is_stale)

    # Petkov 2L 165 vs all-subs floor 134 → keep 165
    pts, is_stale = effective(165, "2L", 34, 13, 7, "MIT", 202)
    assert not is_stale and pts == 165, (pts, is_stale)

    # Ramaj BL 161 with override 2 starts → keep 161
    pts, is_stale = effective(161, "BL", 2, 0, 0, "TOR", 12)
    assert not is_stale and pts == 161, (pts, is_stale)

    print("ok")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
