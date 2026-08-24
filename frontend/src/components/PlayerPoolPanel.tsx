"use client";

import { useMemo, useState } from "react";
import { Heart, Plus, Search } from "lucide-react";
import { useActiveTab, useOrchestratorStore } from "@/lib/store";
import type { Position } from "@/lib/types";
import { Pill } from "@/components/ui/Pill";
import { RangeSlider } from "@/components/ui/RangeSlider";
import { StarRating } from "@/components/ui/StarRating";
import {
  buildListColumns,
  leagueLabel,
  rowDisabledReason,
  SortTh,
  type ColKey,
} from "@/components/playerColumns";
import { formatMio } from "@/lib/utils";
import { clearDrag, writeDragPool } from "@/lib/dnd";
import { ClubCrestFilter } from "@/components/ui/ClubCrestFilter";
import { InjuryBadge } from "@/components/ui/InjuryBadge";

const POSITIONS: Array<"ALL" | Position> = ["ALL", "TOR", "ABW", "MIT", "STU"];

export function PlayerPoolPanel() {
  const tab = useActiveTab();
  const players = useOrchestratorStore((s) => s.players);
  const playersLoaded = useOrchestratorStore((s) => s.playersLoaded);
  const addPlayerToSquad = useOrchestratorStore((s) => s.addPlayerToSquad);
  const openPlayerModal = useOrchestratorStore((s) => s.openPlayerModal);
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState<"ALL" | Position>("ALL");
  const [club, setClub] = useState<string>("ALL");
  const [mvOverride, setMvOverride] = useState<[number, number] | null>(null);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [minStars, setMinStars] = useState(0);
  const [sortKey, setSortKey] = useState<ColKey>("pkt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const mvBounds = useMemo<[number, number]>(() => {
    // Werte >= 50 Mio sind der Kicker-CSV-Platzhalter "999" fuer "noch kein Marktwert
    // vergeben" (siehe kicker-scout/scripts/push_to_kmi.py), kein echter Preis - sonst
    // wuerde der Schieberegler bis 999 statt realistisch bis ~10 Mio gehen.
    const values = players.map((p) => p.marketValue).filter((v) => v < 50);
    if (values.length === 0) return [0, 20];
    const lo = Math.max(0, Math.floor(Math.min(...values) * 2) / 2);
    const hi = Math.max(lo + 0.5, Math.ceil(Math.max(...values) * 2) / 2);
    return [lo, hi];
  }, [players]);
  const mvRange = mvOverride ?? mvBounds;

  const onSort = (key: ColKey) => {
    if (sortKey === key) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const activePlayers = useMemo(
    () => players.filter((p) => p.active !== false && !p.isHidden),
    [players]
  );

  const squadIds = useMemo(
    () => new Set([...tab.starters, ...tab.bench].filter((id): id is string => !!id)),
    [tab.bench, tab.starters]
  );

  const counts = useMemo(() => {
    const result: Record<Position, number> = { TOR: 0, ABW: 0, MIT: 0, STU: 0 };
    Array.from(squadIds).forEach((id) => {
      const p = players.find((entry) => entry.id === id);
      if (p) result[p.position] += 1;
    });
    return result;
  }, [players, squadIds]);

  const spent = useMemo(
    () =>
      Array.from(squadIds)
        .map((id) => players.find((p) => p.id === id)?.marketValue ?? 0)
        .reduce((a, b) => a + b, 0),
    [players, squadIds]
  );

  const columns = useMemo(() => buildListColumns(tab), [tab]);

  const normalizedQuery = query.trim().toLowerCase();
  const visible = useMemo(
    () =>
      players
        .filter((p) => p.active !== false && !p.isHidden)
        .filter((p) => (position === "ALL" ? true : p.position === position))
        .filter((p) => (club === "ALL" ? true : p.club === club))
        .filter((p) => p.marketValue >= mvRange[0] - 0.001 && p.marketValue <= mvRange[1] + 0.001)
        .filter((p) => (onlyFavorites ? !!p.isFavorite : true))
        .filter((p) => (minStars > 0 ? (p.userRating ?? 0) >= minStars : true))
        .filter((p) => {
          if (!normalizedQuery) return true;
          return (
            p.name.toLowerCase().includes(normalizedQuery) ||
            p.shortName.toLowerCase().includes(normalizedQuery) ||
            p.club.toLowerCase().includes(normalizedQuery)
          );
        })
        .sort((a, b) => {
          if (sortKey === "name" || sortKey === "position" || sortKey === "club") {
            const av = sortKey === "name" ? a.name : sortKey === "club" ? a.club : a.position;
            const bv = sortKey === "name" ? b.name : sortKey === "club" ? b.club : b.position;
            return sortDir === "desc" ? bv.localeCompare(av) : av.localeCompare(bv);
          }
          const col = columns.find((c) => c.key === sortKey);
          const av = col ? col.sortValue(a) : 0;
          const bv = col ? col.sortValue(b) : 0;
          if (typeof av === "string" || typeof bv === "string") {
            return sortDir === "desc" ? String(bv).localeCompare(String(av)) : String(av).localeCompare(String(bv));
          }
          return sortDir === "desc" ? bv - av : av - bv;
        }),
    [normalizedQuery, players, position, club, mvRange, onlyFavorites, minStars, sortKey, sortDir, columns]
  );

  return (
    <section className="glass-panel flex h-full min-h-0 w-full flex-col gap-2.5 rounded-xl p-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-on-surface">
          Spielerdatenbank
        </h3>
        <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
          {visible.length} Treffer
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex min-w-[140px] flex-1 items-center gap-2 rounded-lg border border-outline-variant/30 bg-surface-container px-2 py-1">
          <Search className="h-3.5 w-3.5 shrink-0 text-on-surface-variant" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name oder Verein"
            className="w-full bg-transparent text-xs text-on-surface outline-none placeholder:text-on-surface-variant/70"
          />
        </div>
        <RangeSlider
          label="MW"
          min={mvBounds[0]}
          max={mvBounds[1]}
          step={0.1}
          value={mvRange}
          onChange={(next) =>
            setMvOverride(next[0] <= mvBounds[0] + 0.05 && next[1] >= mvBounds[1] - 0.05 ? null : next)
          }
          format={(v) => formatMio(v)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {POSITIONS.map((pos) => (
          <button
            key={pos}
            type="button"
            onClick={() => setPosition(pos)}
            className={`rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider ${
              position === pos
                ? "bg-brand-pink text-white"
                : "bg-surface-container-high text-on-surface-variant"
            }`}
          >
            {pos === "ALL" ? "Alle" : pos}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setOnlyFavorites((v) => !v)}
          title="Nur Favoriten aus dem Dashboard"
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider ${
            onlyFavorites
              ? "bg-brand-pink/20 text-brand-pink"
              : "bg-surface-container-high text-on-surface-variant"
          }`}
        >
          <Heart className="h-3 w-3" fill={onlyFavorites ? "#e8143c" : "none"} color={onlyFavorites ? "#e8143c" : "currentColor"} />
          Fav
        </button>
        <div
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${
            minStars > 0 ? "bg-amber-500/15" : "bg-surface-container-high"
          }`}
          title="Mindest-Sterne aus dem Dashboard (nochmal klicken = Filter aus)"
        >
          <StarRating value={minStars || null} size={11} onChange={setMinStars} />
        </div>
      </div>

      <ClubCrestFilter players={activePlayers} value={club} onChange={setClub} size={20} />

      <div className="min-h-0 flex-1 overflow-auto">
        {!playersLoaded && (
          <div className="rounded-lg border border-dashed border-outline-variant/30 p-3 text-xs text-on-surface-variant">
            Spieler werden geladen…
          </div>
        )}

        {playersLoaded && visible.length === 0 && (
          <div className="rounded-lg border border-dashed border-outline-variant/30 p-3 text-xs text-on-surface-variant">
            Keine Spieler für den Filter gefunden.
          </div>
        )}

        {playersLoaded && visible.length > 0 && (
          <table className="w-full min-w-[1180px] border-collapse text-left text-xs">
            <thead className="sticky top-0 z-10 bg-surface-container-high">
              <tr>
                <th className="sticky left-0 z-20 bg-surface-container-high px-2 py-2 font-mono text-[9px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Spieler
                </th>
                <th className="px-1.5 py-2 text-left font-mono text-[9px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Liga
                </th>
                {columns.map((c) => (
                  <SortTh
                    key={c.key}
                    label={c.label}
                    title={c.title}
                    sortKeyValue={c.key}
                    activeKey={sortKey}
                    dir={sortDir}
                    onSort={onSort}
                  />
                ))}
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {visible.map((player) => {
                const disabledReason = rowDisabledReason(player, squadIds, counts, spent);
                const inSquad = squadIds.has(player.id);
                return (
                  <tr
                    key={player.id}
                    draggable={!inSquad}
                    onDragStart={(event) => {
                      if (inSquad) {
                        event.preventDefault();
                        return;
                      }
                      writeDragPool(event, player.id, player.position);
                    }}
                    onDragEnd={() => clearDrag()}
                    title={inSquad ? "Schon im Kader" : "Ziehen, um in Startelf/Bank einzusetzen"}
                    className={`border-t border-outline-variant/10 hover:bg-surface-container-high/50 ${
                      inSquad ? "" : "cursor-grab active:cursor-grabbing"
                    }`}
                  >
                    <td className="sticky left-0 z-10 bg-surface-container px-2 py-2">
                      <div className="flex items-center gap-1.5">
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => openPlayerModal(player.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") openPlayerModal(player.id);
                          }}
                          className="min-w-0 flex-1 cursor-grab text-left active:cursor-grabbing"
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="rounded bg-surface-container-highest px-1 py-0.5 font-mono text-[9px] font-bold text-on-surface-variant">
                              {player.position}
                            </span>
                            <span className="truncate text-sm font-bold text-on-surface">
                              {player.name}
                            </span>
                            <InjuryBadge injury={player.injury} size={10} />
                          </div>
                          <div className="truncate text-[10px] text-on-surface-variant">
                            {player.club}
                          </div>
                        </div>
                        {player.isFavorite && (
                          <Heart
                            className="h-3.5 w-3.5 shrink-0"
                            fill="#e8143c"
                            color="#e8143c"
                            aria-label="Favorit"
                          />
                        )}
                        {(player.userRating ?? 0) > 0 && (
                          <StarRating value={player.userRating} size={10} />
                        )}
                      </div>
                    </td>
                    <td className="px-1.5 py-2">
                      <Pill tone={player.leagueTag === "2. BUNDESLIGA" ? "amber" : player.leagueTag ? "blue" : "red"}>
                        {leagueLabel(player.leagueTag)}
                      </Pill>
                    </td>
                    {columns.map((c) => (
                      <td key={c.key} className="px-1.5 py-2 text-right">
                        {c.render(player)}
                      </td>
                    ))}
                    <td className="px-1.5 py-2">
                      <button
                        type="button"
                        disabled={!!disabledReason}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={() => addPlayerToSquad(player.id)}
                        title={disabledReason ?? "In Kader"}
                        className={`flex h-6 w-6 items-center justify-center rounded-md ${
                          disabledReason
                            ? "bg-surface-container text-on-surface-variant/60"
                            : "bg-primary-container/25 text-primary-fixed hover:bg-primary-container/40"
                        }`}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
