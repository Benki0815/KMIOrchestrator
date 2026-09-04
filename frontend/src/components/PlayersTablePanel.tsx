"use client";

import { useMemo, useState } from "react";
import { Eye, EyeOff, Plus } from "lucide-react";
import { useActiveTab, useOrchestratorStore } from "@/lib/store";
import type { Position } from "@/lib/types";
import { Pill } from "@/components/ui/Pill";
import { RangeSlider } from "@/components/ui/RangeSlider";
import {
  buildListColumns,
  leagueLabel,
  rowDisabledReason,
  SortTh,
  type ColKey,
} from "@/components/playerColumns";
import { formatMio } from "@/lib/utils";
import { ClubCrestFilter } from "@/components/ui/ClubCrestFilter";
import { InjuryBadge } from "@/components/ui/InjuryBadge";
import { SquadVariantBadges } from "@/components/ui/SquadVariantBadges";

const POSITIONS: Array<"ALL" | Position> = ["ALL", "TOR", "ABW", "MIT", "STU"];

const LEAGUE_OPTIONS: Array<{ id: string; label: string }> = [
  { id: "ALL", label: "Alle Ligen" },
  { id: "BUNDESLIGA", label: "Bundesliga" },
  { id: "2. BUNDESLIGA", label: "2. Bundesliga" },
  { id: "UNKNOWN", label: "Unbekannt / Ausland" },
];

export function PlayersTablePanel() {
  const tab = useActiveTab();
  const players = useOrchestratorStore((s) => s.players);
  const playersLoaded = useOrchestratorStore((s) => s.playersLoaded);
  const addPlayerToSquad = useOrchestratorStore((s) => s.addPlayerToSquad);
  const openPlayerModal = useOrchestratorStore((s) => s.openPlayerModal);
  const togglePlayerHidden = useOrchestratorStore((s) => s.togglePlayerHidden);

  const [query, setQuery] = useState("");
  const [position, setPosition] = useState<"ALL" | Position>("ALL");
  const [club, setClub] = useState<string>("ALL");
  const [league, setLeague] = useState<string>("ALL");
  const [onlyValuePicks, setOnlyValuePicks] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  const [mvOverride, setMvOverride] = useState<[number, number] | null>(null);
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
        .filter((p) => p.active !== false && (showHidden ? true : !p.isHidden))
        .filter((p) => (position === "ALL" ? true : p.position === position))
        .filter((p) => (club === "ALL" ? true : p.club === club))
        .filter((p) => {
          if (league === "ALL") return true;
          if (league === "UNKNOWN") return !p.leagueTag;
          return p.leagueTag === league;
        })
        .filter((p) => (onlyValuePicks ? !!p.valuePick : true))
        .filter((p) => p.marketValue >= mvRange[0] - 0.001 && p.marketValue <= mvRange[1] + 0.001)
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
    [players, position, club, league, onlyValuePicks, mvRange, normalizedQuery, sortKey, sortDir, showHidden, columns]
  );

  return (
    <section className="glass-panel flex h-full min-h-0 w-full flex-col gap-3 rounded-xl p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-base font-bold uppercase tracking-wider text-on-surface">
          Players Table
        </h3>
        <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
          {visible.length} Treffer
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Name oder Verein suchen"
          className="min-w-[200px] flex-1 rounded-lg border border-outline-variant/30 bg-surface-container-low px-3 py-1.5 text-xs text-on-surface outline-none placeholder:text-on-surface-variant/60"
        />
        <div className="flex flex-wrap gap-1.5">
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
        </div>
        <select
          value={league}
          onChange={(e) => setLeague(e.target.value)}
          className="rounded-lg border border-outline-variant/30 bg-surface-container-low px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-on-surface outline-none"
        >
          {LEAGUE_OPTIONS.map((l) => (
            <option key={l.id} value={l.id}>
              {l.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setOnlyValuePicks((v) => !v)}
          className={`rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider ${
            onlyValuePicks
              ? "bg-emerald-500/20 text-emerald-300"
              : "bg-surface-container-high text-on-surface-variant"
          }`}
        >
          Value-Picks
        </button>
        <button
          type="button"
          onClick={() => setShowHidden((v) => !v)}
          title="Ausgeblendete Spieler (z.B. transferiert oder fehlerhaft) ein-/ausblenden"
          className={`rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider ${
            showHidden
              ? "bg-rose-500/20 text-rose-300"
              : "bg-surface-container-high text-on-surface-variant"
          }`}
        >
          Ausgeblendete {showHidden ? "verbergen" : "anzeigen"}
        </button>
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
          <table className="w-full min-w-[1200px] border-collapse text-left text-xs">
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
              </tr>
            </thead>
            <tbody>
              {visible.map((player) => {
                const disabledReason = rowDisabledReason(player, squadIds, counts, spent);
                return (
                  <tr
                    key={player.id}
                    className={`border-t border-outline-variant/10 hover:bg-surface-container-high/50 ${
                      player.isHidden ? "opacity-50" : ""
                    }`}
                  >
                    <td className="sticky left-0 z-10 bg-surface-container px-2 py-2">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openPlayerModal(player.id)}
                          className="min-w-0 flex-1 text-left"
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="rounded bg-surface-container-highest px-1 py-0.5 font-mono text-[9px] font-bold text-on-surface-variant">
                              {player.position}
                            </span>
                            <span className="truncate text-sm font-bold text-on-surface">
                              {player.name}
                            </span>
                            <InjuryBadge injury={player.injury} size={10} />
                            <SquadVariantBadges playerId={player.id} size={14} />
                            {player.valuePick && <span title="Value-Pick" className="text-emerald-300">◆</span>}
                          </div>
                          <div className="truncate text-[10px] text-on-surface-variant">{player.club}</div>
                        </button>
                        <div className="ml-1 flex shrink-0 items-center gap-1.5">
                          <button
                            type="button"
                            disabled={!!disabledReason}
                            onClick={() => addPlayerToSquad(player.id)}
                            title={disabledReason ?? "In Kader aufnehmen"}
                            className={`flex h-6 w-6 items-center justify-center rounded-md ${
                              disabledReason
                                ? "bg-surface-container text-on-surface-variant/60"
                                : "bg-primary-container/25 text-primary-fixed hover:bg-primary-container/40"
                            }`}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (player.isHidden || window.confirm(`"${player.name}" ausblenden (z.B. transferiert/fehlerhaft)?`)) {
                                togglePlayerHidden(player.id);
                              }
                            }}
                            title={player.isHidden ? "Spieler wieder einblenden" : "Spieler ausblenden (transferiert/fehlerhaft)"}
                            className="ml-1 flex h-6 w-6 items-center justify-center rounded-md border-l border-outline-variant/20 pl-1.5 text-on-surface-variant/50 hover:text-rose-300"
                          >
                            {player.isHidden ? (
                              <Eye className="h-3.5 w-3.5" />
                            ) : (
                              <EyeOff className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
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
