"use client";

import { useEffect, useMemo, useState } from "react";
import { Heart } from "lucide-react";
import { useActiveTab, useOrchestratorStore, useSquadMetrics } from "@/lib/store";
import type { Player } from "@/lib/types";
import { POSITION_LABELS } from "@/lib/types";
import { formatMio } from "@/lib/utils";
import { ClubCrestFilter } from "@/components/ui/ClubCrestFilter";
import { RangeSlider } from "@/components/ui/RangeSlider";
import { StarRating } from "@/components/ui/StarRating";
import { Pill } from "@/components/ui/Pill";
import { InjuryBadge } from "@/components/ui/InjuryBadge";
import {
  buildListColumns,
  leagueLabel,
  SortTh,
  type ColKey,
} from "@/components/playerColumns";

type ExtraSort = "fav" | "stars" | "liga";
type PickerSort = ColKey | ExtraSort;

function ExtraSortTh({
  label,
  title,
  sortKeyValue,
  activeKey,
  dir,
  onSort,
  align = "center",
}: {
  label: string;
  title?: string;
  sortKeyValue: ExtraSort;
  activeKey: PickerSort;
  dir: "asc" | "desc";
  onSort: (key: PickerSort) => void;
  align?: "left" | "center";
}) {
  return (
    <th className={`px-1.5 py-2 ${align === "left" ? "text-left" : "text-center"}`} title={title}>
      <button
        type="button"
        onClick={() => onSort(sortKeyValue)}
        className={`whitespace-nowrap font-mono text-[9px] font-bold uppercase tracking-wider hover:text-brand-pink ${
          activeKey === sortKeyValue ? "text-brand-pink" : "text-on-surface-variant"
        }`}
      >
        {label}
        {activeKey === sortKeyValue ? (dir === "desc" ? " ↓" : " ↑") : ""}
      </button>
    </th>
  );
}

function comparePlayers(
  a: Player,
  b: Player,
  sortKey: PickerSort,
  sortDir: "asc" | "desc",
  columns: ReturnType<typeof buildListColumns>
): number {
  const dir = sortDir === "desc" ? 1 : -1;
  if (sortKey === "fav") return ((b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0)) * dir;
  if (sortKey === "stars") return ((b.userRating ?? 0) - (a.userRating ?? 0)) * dir;
  if (sortKey === "liga") {
    const cmp = leagueLabel(a.leagueTag).localeCompare(leagueLabel(b.leagueTag), "de");
    return sortDir === "desc" ? -cmp : cmp;
  }
  const col = columns.find((c) => c.key === sortKey);
  const av = col ? col.sortValue(a) : 0;
  const bv = col ? col.sortValue(b) : 0;
  if (typeof av === "string" || typeof bv === "string") {
    const cmp = String(av).localeCompare(String(bv), "de");
    return sortDir === "desc" ? -cmp : cmp;
  }
  return (Number(bv) - Number(av)) * dir;
}

function PlayerNameCell({
  player,
  outgoing,
  selected,
}: {
  player: Player;
  outgoing?: boolean;
  selected?: boolean;
}) {
  return (
    <div className="min-w-0">
      {outgoing && (
        <div className="text-[10px] font-bold uppercase tracking-wider text-brand-pink">Das verlierst du</div>
      )}
      <div className="flex items-center gap-1.5">
        {selected && <span className="font-mono text-[10px] font-bold text-primary-fixed">✓</span>}
        <span className="rounded bg-surface-container-highest px-1 py-0.5 font-mono text-[9px] font-bold text-on-surface-variant">
          {player.position}
        </span>
        <span className={`truncate text-sm font-bold ${outgoing ? "text-brand-pink" : "text-on-surface"}`}>
          {player.shortName}
        </span>
        <InjuryBadge injury={player.injury} size={10} />
      </div>
      <div className="truncate text-[10px] text-on-surface-variant">{player.club}</div>
    </div>
  );
}

export function AlternativePickerModal() {
  const picker = useOrchestratorStore((s) => s.alternativePicker);
  const close = useOrchestratorStore((s) => s.closeAlternativePicker);
  const setVariantSwapIn = useOrchestratorStore((s) => s.setVariantSwapIn);
  const openPlayerModal = useOrchestratorStore((s) => s.openPlayerModal);
  const togglePlayerFavorite = useOrchestratorStore((s) => s.togglePlayerFavorite);
  const setPlayerRating = useOrchestratorStore((s) => s.setPlayerRating);
  const players = useOrchestratorStore((s) => s.players);
  const tab = useActiveTab();
  const metrics = useSquadMetrics();
  const [search, setSearch] = useState("");
  const [club, setClub] = useState("ALL");
  const [sortKey, setSortKey] = useState<PickerSort>("xpkt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mvOverride, setMvOverride] = useState<[number, number] | null>(null);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [minStars, setMinStars] = useState(0);

  const outPlayer = picker ? players.find((p) => p.id === picker.swapOutId) ?? null : null;
  const columns = useMemo(() => buildListColumns(tab), [tab]);

  useEffect(() => {
    if (!picker) return;
    setSelectedId(tab.swapVariants[picker.variant]?.[picker.swapOutId] ?? null);
    setSearch("");
    setClub("ALL");
    setMvOverride(null);
    setOnlyFavorites(false);
    setMinStars(0);
    setSortKey("xpkt");
    setSortDir("desc");
  }, [picker, tab.swapVariants]);

  const selectedPlayer = selectedId ? players.find((p) => p.id === selectedId) ?? null : null;

  const squadIds = useMemo(
    () => new Set([...tab.starters, ...tab.bench].filter((id): id is string => !!id)),
    [tab.starters, tab.bench]
  );

  const availableBudget = useMemo(() => {
    if (!picker) return metrics.remaining;
    const freed = tab.swapOutIds.reduce((sum, id) => {
      const p = players.find((x) => x.id === id);
      return sum + (p?.marketValue ?? 0);
    }, 0);
    const variantPicks = tab.swapVariants[picker.variant] ?? {};
    const spentElsewhere = Object.entries(variantPicks).reduce((sum, [outId, inId]) => {
      if (outId === picker.swapOutId || !inId) return sum;
      const p = players.find((x) => x.id === inId);
      return sum + (p?.marketValue ?? 0);
    }, 0);
    return metrics.remaining + freed - spentElsewhere;
  }, [picker, metrics.remaining, tab.swapOutIds, tab.swapVariants, players]);

  const positionPool = useMemo(
    () =>
      outPlayer
        ? players.filter(
            (p) =>
              p.position === outPlayer.position &&
              p.id !== outPlayer.id &&
              p.isHidden !== true &&
              p.active !== false
          )
        : [],
    [outPlayer, players]
  );

  const mvBounds = useMemo<[number, number]>(() => {
    const values = positionPool.map((p) => p.marketValue).filter((v) => v < 50);
    if (values.length === 0) return [0, 20];
    const lo = Math.max(0, Math.floor(Math.min(...values) * 2) / 2);
    const hi = Math.max(lo + 0.5, Math.ceil(Math.max(...values) * 2) / 2);
    return [lo, hi];
  }, [positionPool]);
  const mvRange = mvOverride ?? mvBounds;

  const candidates = useMemo(() => {
    if (!outPlayer) return [];
    const q = search.trim().toLowerCase();
    return positionPool
      .filter((p) => {
        if (squadIds.has(p.id) && !tab.swapOutIds.includes(p.id)) return false;
        if (club !== "ALL" && p.club !== club) return false;
        if (p.marketValue < mvRange[0] - 0.001 || p.marketValue > mvRange[1] + 0.001) return false;
        if (onlyFavorites && !p.isFavorite) return false;
        if (minStars > 0 && (p.userRating ?? 0) < minStars) return false;
        if (
          q &&
          !(
            p.name.toLowerCase().includes(q) ||
            p.club.toLowerCase().includes(q) ||
            p.shortName.toLowerCase().includes(q)
          )
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => comparePlayers(a, b, sortKey, sortDir, columns));
  }, [
    outPlayer,
    positionPool,
    search,
    club,
    mvRange,
    squadIds,
    tab.swapOutIds,
    sortKey,
    sortDir,
    columns,
    onlyFavorites,
    minStars,
  ]);

  if (!picker || !outPlayer) return null;

  const onSort = (key: PickerSort) => {
    if (sortKey === key) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const colSpan = columns.length + 4;
  const kpiActiveKey: ColKey = columns.some((c) => c.key === sortKey) ? (sortKey as ColKey) : "name";

  return (
    <div className="fixed inset-0 z-[95] overflow-y-auto bg-background/85 backdrop-blur-sm">
      <div className="mx-auto my-6 w-[min(1440px,96vw)] rounded-2xl border border-outline-variant/30 bg-surface-container p-5">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h3 className="font-display text-lg font-black uppercase tracking-wide text-on-surface">
            Alternative wählen · Variante {picker.variant}
          </h3>
          <span className="rounded-full border border-brand-pink/40 bg-brand-pink/10 px-3 py-1 font-mono text-[11px] font-bold text-brand-pink">
            {POSITION_LABELS[outPlayer.position].toUpperCase()}
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name oder Verein suchen"
            className="min-w-[200px] flex-1 rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-3 py-2 text-sm text-on-surface outline-none focus:border-brand-pink"
          />
          <span className="font-mono text-[11px] text-on-surface-variant">
            {candidates.length} Spieler · Spalten antippen zum Sortieren
          </span>
          <span className="rounded-lg border border-outline-variant/30 bg-surface-container-low px-3 py-1.5 font-mono text-xs font-bold text-brand-amber">
            Verfügbar {formatMio(availableBudget)}
          </span>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-3">
          <ClubCrestFilter players={positionPool} value={club} onChange={setClub} size={20} />
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
          <button
            type="button"
            onClick={() => setOnlyFavorites((v) => !v)}
            title="Nur Favoriten"
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider ${
              onlyFavorites ? "bg-brand-pink/20 text-brand-pink" : "bg-surface-container-high text-on-surface-variant"
            }`}
          >
            <Heart
              className="h-3 w-3"
              fill={onlyFavorites ? "#e8143c" : "none"}
              color={onlyFavorites ? "#e8143c" : "currentColor"}
            />
            Fav
          </button>
          <div
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${
              minStars > 0 ? "bg-amber-500/15" : "bg-surface-container-high"
            }`}
            title="Mindest-Sterne (gleiche Zahl nochmal = Filter aus)"
          >
            <StarRating value={minStars || null} size={11} onChange={setMinStars} />
          </div>
        </div>

        <div className="max-h-[65vh] overflow-auto rounded-lg border border-outline-variant/20">
          <table className="w-full min-w-[1380px] border-collapse text-left text-xs">
            <thead className="sticky top-0 z-10 bg-surface-container-high">
              <tr>
                <th className="sticky left-0 z-20 bg-surface-container-high px-2 py-2 font-mono text-[10px] uppercase text-on-surface-variant">
                  Spieler
                </th>
                <ExtraSortTh
                  label="Liga"
                  sortKeyValue="liga"
                  activeKey={sortKey}
                  dir={sortDir}
                  onSort={onSort}
                  align="left"
                />
                <ExtraSortTh
                  label="Fav"
                  title="Favorit"
                  sortKeyValue="fav"
                  activeKey={sortKey}
                  dir={sortDir}
                  onSort={onSort}
                />
                <ExtraSortTh
                  label="Sterne"
                  title="Deine Bewertung"
                  sortKeyValue="stars"
                  activeKey={sortKey}
                  dir={sortDir}
                  onSort={onSort}
                />
                {columns.map((c) => (
                  <SortTh
                    key={c.key}
                    label={c.label}
                    title={c.title}
                    sortKeyValue={c.key}
                    activeKey={kpiActiveKey}
                    dir={sortDir}
                    onSort={onSort}
                  />
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-brand-pink/30 bg-brand-pink/10">
                <td className="sticky left-0 z-10 bg-brand-pink/10 px-2 py-2">
                  <PlayerNameCell player={outPlayer} outgoing />
                </td>
                <td className="px-1.5 py-2">
                  <Pill tone={outPlayer.leagueTag === "2. BUNDESLIGA" ? "amber" : outPlayer.leagueTag ? "blue" : "red"}>
                    {leagueLabel(outPlayer.leagueTag)}
                  </Pill>
                </td>
                <td className="px-1.5 py-2 text-center">
                  <Heart
                    className="mx-auto h-4 w-4"
                    fill={outPlayer.isFavorite ? "#e8143c" : "none"}
                    color={outPlayer.isFavorite ? "#e8143c" : "#8a9099"}
                  />
                </td>
                <td className="px-1.5 py-2">
                  <StarRating value={outPlayer.userRating} size={12} />
                </td>
                {columns.map((c) => (
                  <td key={c.key} className="px-1.5 py-2 text-right">
                    {c.render(outPlayer)}
                  </td>
                ))}
              </tr>
              {candidates.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => {
                    setSelectedId(p.id);
                    openPlayerModal(p.id);
                  }}
                  className={`cursor-pointer border-t border-outline-variant/10 hover:bg-surface-container-high/60 ${
                    selectedId === p.id ? "bg-primary-container/15" : ""
                  }`}
                >
                  <td className="sticky left-0 z-10 bg-surface-container px-2 py-2">
                    <PlayerNameCell player={p} selected={selectedId === p.id} />
                  </td>
                  <td className="px-1.5 py-2">
                    <Pill tone={p.leagueTag === "2. BUNDESLIGA" ? "amber" : p.leagueTag ? "blue" : "red"}>
                      {leagueLabel(p.leagueTag)}
                    </Pill>
                  </td>
                  <td className="px-1.5 py-2 text-center">
                    <button
                      type="button"
                      title={p.isFavorite ? "Favorit entfernen" : "Als Favorit markieren"}
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlayerFavorite(p.id);
                      }}
                    >
                      <Heart
                        className="h-4 w-4"
                        fill={p.isFavorite ? "#e8143c" : "none"}
                        color={p.isFavorite ? "#e8143c" : "#8a9099"}
                      />
                    </button>
                  </td>
                  <td className="px-1.5 py-2" onClick={(e) => e.stopPropagation()}>
                    <StarRating value={p.userRating} size={12} onChange={(v) => setPlayerRating(p.id, v)} />
                  </td>
                  {columns.map((c) => (
                    <td key={c.key} className="px-1.5 py-2 text-right">
                      {c.render(p)}
                    </td>
                  ))}
                </tr>
              ))}
              {candidates.length === 0 && (
                <tr>
                  <td colSpan={colSpan} className="px-2 py-6 text-center text-on-surface-variant">
                    Keine passenden Spieler gefunden.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1 font-mono text-xs text-on-surface-variant">
            {selectedPlayer ? (
              <span>
                Auswahl: <span className="font-bold text-on-surface">{selectedPlayer.shortName}</span>{" "}
                <span className="text-on-surface-variant">({selectedPlayer.club})</span>
              </span>
            ) : (
              "Kein Spieler ausgewählt — Zeile öffnet die Details. Unten in die Variante übernehmen oder Fenster schließen."
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={close}
              className="rounded-lg border border-outline-variant/30 px-4 py-2 text-sm text-on-surface-variant hover:text-on-surface"
            >
              Fenster schließen
            </button>
            <button
              type="button"
              disabled={!selectedId}
              onClick={() => {
                if (!selectedId) return;
                setVariantSwapIn(picker.variant, picker.swapOutId, selectedId);
                close();
              }}
              className={`rounded-lg px-5 py-2 text-sm font-bold shadow-[0_0_14px_rgba(232,20,60,0.4)] ${
                selectedId
                  ? "bg-brand-pink text-white hover:bg-brand-pink-dim"
                  : "cursor-not-allowed bg-surface-container-high text-on-surface-variant/60 shadow-none"
              }`}
            >
              Auswahl in Variante übernehmen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
