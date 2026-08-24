"use client";

import { Fragment, useCallback, useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Eye, EyeOff, Heart, Newspaper, Plus } from "lucide-react";
import { useActiveTab, useOrchestratorStore } from "@/lib/store";
import type { Player, Position } from "@/lib/types";
import { Pill, type PillTone } from "@/components/ui/Pill";
import { StarRating } from "@/components/ui/StarRating";
import { ClubCrestFilter } from "@/components/ui/ClubCrestFilter";
import { InjuryBadge } from "@/components/ui/InjuryBadge";
import { sentimentTone } from "@/lib/playerStats";
import {
  buildListColumns,
  leagueLabel,
  rowDisabledReason,
  SortTh,
  type ColKey,
} from "@/components/playerColumns";

const POSITIONS: Array<"ALL" | Position> = ["ALL", "TOR", "ABW", "MIT", "STU"];

type KpiFilterId = "all" | "mentioned" | "valuePick" | "favorite" | "rated";

const SENTIMENTS: Array<{ id: string; label: string }> = [
  { id: "ALL", label: "Alle" },
  { id: "positive", label: "Positiv" },
  { id: "watch", label: "Beobachten" },
  { id: "neutral", label: "Neutral" },
  { id: "negative", label: "Negativ" },
];

const SENTIMENT_WEIGHT: Record<string, number> = {
  positive: 1,
  watch: 0.25,
  neutral: 0,
  negative: -1,
};

interface Mention {
  source_type?: string | null;
  source_name?: string | null;
  source_title?: string | null;
  sentiment?: string | null;
  rating_label?: string | null;
  quote?: string | null;
  source_url?: string | null;
  published?: string | null;
  weight?: number | null;
}

interface MentionRow extends Mention {
  player: Player;
  index: number;
}

function ageLabel(published?: string | null): string {
  if (!published) return "";
  const d = new Date(published);
  if (Number.isNaN(d.getTime())) return published;
  const days = Math.floor((Date.now() - d.getTime()) / 86_400_000);
  if (days <= 0) return "heute";
  if (days === 1) return "gestern";
  if (days < 30) return `vor ${days} Tagen`;
  const months = Math.floor(days / 30);
  return `vor ${months} Monat${months > 1 ? "en" : ""}`;
}

/** MAIK/MU/Ligainsider gelten laut Nutzer als verlaesslicher als Magisches Zweieck
 * (siehe kicker-scout/app/scoring.py SOURCE_WEIGHTS) - farblich unterscheidbar machen. */
function sourceTone(source?: string | null): PillTone {
  if (source === "MAIK mit AI") return "cyan";
  if (source === "ManagerUnited11" || source === "ManagerUnited11_Shorts") return "blue";
  if (source === "Ligainsider" || source === "Ligainsider_Shorts") return "amber";
  if (source === "Magisches_zweieck") return "gray";
  return "neutral";
}

function pointsContribution(m: Mention): number {
  const sentimentValue = SENTIMENT_WEIGHT[m.sentiment ?? ""] ?? 0;
  return Math.round(sentimentValue * (m.weight ?? 1) * 100) / 100;
}

function StatCard({
  label,
  value,
  tone,
  active,
  onClick,
}: {
  label: string;
  value: number | string;
  tone?: "green";
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={!onClick}
      onClick={onClick}
      className={`glass-panel rounded-xl p-3 text-center transition-colors ${
        onClick ? "cursor-pointer hover:border-brand-pink/50" : "cursor-default"
      } ${active ? "border-brand-pink shadow-[0_0_14px_rgba(232,20,60,0.35)]" : ""}`}
    >
      <div
        className={`font-mono text-[9px] font-bold uppercase tracking-wider ${
          active ? "text-brand-pink" : "text-on-surface-variant"
        }`}
      >
        {label}
      </div>
      <div
        className={`mt-1 font-mono text-2xl font-black ${
          tone === "green" ? "text-emerald-300" : "text-on-surface"
        }`}
      >
        {value}
      </div>
    </button>
  );
}

function MentionCard({ m, showPlayer, onOpenPlayer }: { m: MentionRow; showPlayer?: boolean; onOpenPlayer?: () => void }) {
  const { tone, label } = sentimentTone(m.sentiment);
  const contribution = pointsContribution(m);
  return (
    <div className="rounded-lg border border-outline-variant/15 bg-surface-container-low p-2.5">
      <div className="mb-1 flex flex-wrap items-center gap-2">
        {showPlayer && (
          <button
            type="button"
            onClick={onOpenPlayer}
            className="text-xs font-bold text-on-surface hover:text-brand-pink"
          >
            {m.player.name}
          </button>
        )}
        {showPlayer && <span className="text-[10px] text-on-surface-variant">{m.player.club}</span>}
        <Pill tone={sourceTone(m.source_name)} title="Quelle">
          {m.source_name ?? "?"}
        </Pill>
        <Pill tone={tone}>{m.rating_label || label}</Pill>
        <span
          className={`font-mono text-[10px] font-bold ${
            contribution > 0 ? "text-emerald-300" : contribution < 0 ? "text-rose-300" : "text-on-surface-variant"
          }`}
          title="Punkte-Beitrag = Sentiment × Quellgewicht (siehe scoring.py)"
        >
          {contribution > 0 ? "+" : ""}
          {contribution} Pkt
        </span>
        {m.published && (
          <span className="text-[10px] text-on-surface-variant" title={m.published}>
            {ageLabel(m.published)}
          </span>
        )}
      </div>
      {m.quote && <p className="text-xs italic text-on-surface-variant">„{m.quote}“</p>}
      <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-on-surface-variant/80">
        {m.source_url ? (
          <a
            href={m.source_url}
            target="_blank"
            rel="noreferrer"
            className="text-sky-300 hover:underline"
          >
            {m.source_title || "Quelle öffnen"}
          </a>
        ) : (
          m.source_title
        )}
        {m.source_type && <span className="rounded bg-surface-container-high px-1.5 py-0.5">{m.source_type}</span>}
        {typeof m.weight === "number" && <span title="Quellgewicht">Gewicht {m.weight}</span>}
      </div>
    </div>
  );
}

export function DashboardPanel() {
  const tab = useActiveTab();
  const players = useOrchestratorStore((s) => s.players);
  const playersLoaded = useOrchestratorStore((s) => s.playersLoaded);
  const openPlayerModal = useOrchestratorStore((s) => s.openPlayerModal);
  const togglePlayerFavorite = useOrchestratorStore((s) => s.togglePlayerFavorite);
  const setPlayerRating = useOrchestratorStore((s) => s.setPlayerRating);
  const togglePlayerHidden = useOrchestratorStore((s) => s.togglePlayerHidden);
  const addPlayerToSquad = useOrchestratorStore((s) => s.addPlayerToSquad);

  const [query, setQuery] = useState("");
  const [position, setPosition] = useState<"ALL" | Position>("ALL");
  const [club, setClub] = useState<string>("ALL");
  const [kpiFilter, setKpiFilter] = useState<KpiFilterId>("mentioned");
  const [sortKey, setSortKey] = useState<ColKey>("score");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [showHidden, setShowHidden] = useState(false);

  const squadIds = useMemo(
    () => new Set([...tab.starters, ...tab.bench].filter((id): id is string => !!id)),
    [tab.bench, tab.starters]
  );
  const squadCounts = useMemo(() => {
    const result: Record<Position, number> = { TOR: 0, ABW: 0, MIT: 0, STU: 0 };
    Array.from(squadIds).forEach((id) => {
      const p = players.find((entry) => entry.id === id);
      if (p) result[p.position] += 1;
    });
    return result;
  }, [players, squadIds]);
  const squadSpent = useMemo(
    () =>
      Array.from(squadIds)
        .map((id) => players.find((p) => p.id === id)?.marketValue ?? 0)
        .reduce((a, b) => a + b, 0),
    [players, squadIds]
  );

  const columns = useMemo(() => buildListColumns(tab), [tab]);

  const [feedSentiment, setFeedSentiment] = useState<string>("ALL");
  const [feedSource, setFeedSource] = useState<string>("ALL");
  const [feedSort, setFeedSort] = useState<"newest" | "oldest">("newest");

  const normalizedQuery = query.trim().toLowerCase();

  const activePlayers = useMemo(
    () => players.filter((p) => p.active !== false && (showHidden ? true : !p.isHidden)),
    [players, showHidden]
  );

  const matchesTextFilters = useCallback(
    (p: Player) => {
      if (position !== "ALL" && p.position !== position) return false;
      if (club !== "ALL" && p.club !== club) return false;
      if (normalizedQuery) {
        if (
          !p.name.toLowerCase().includes(normalizedQuery) &&
          !p.club.toLowerCase().includes(normalizedQuery)
        ) {
          return false;
        }
      }
      return true;
    },
    [position, club, normalizedQuery]
  );

  const matchesKpi = useCallback(
    (p: Player) => {
      switch (kpiFilter) {
        case "mentioned":
          return (p.mentionsCount ?? 0) > 0;
        case "valuePick":
          return !!p.valuePick;
        case "favorite":
          return !!p.isFavorite;
        case "rated":
          return (p.userRating ?? 0) > 0;
        default:
          return true;
      }
    },
    [kpiFilter]
  );

  const stats = useMemo(() => {
    const valuePicks = activePlayers.filter((p) => p.valuePick).length;
    const mentioned = activePlayers.filter((p) => (p.mentionsCount ?? 0) > 0).length;
    const favorites = activePlayers.filter((p) => p.isFavorite).length;
    const rated = activePlayers.filter((p) => (p.userRating ?? 0) > 0).length;
    const totalMentions = activePlayers.reduce((sum, p) => sum + (p.mentionsCount ?? 0), 0);
    return {
      total: activePlayers.length,
      valuePicks,
      mentioned,
      favorites,
      rated,
      totalMentions,
    };
  }, [activePlayers]);

  const onSort = (key: ColKey) => {
    if (sortKey === key) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const visiblePlayers = useMemo(
    () =>
      activePlayers
        .filter(matchesTextFilters)
        .filter(matchesKpi)
        .sort((a, b) => {
          const col = columns.find((c) => c.key === sortKey);
          const av = col ? col.sortValue(a) : 0;
          const bv = col ? col.sortValue(b) : 0;
          if (typeof av === "string" || typeof bv === "string") {
            return sortDir === "desc" ? String(bv).localeCompare(String(av)) : String(av).localeCompare(String(bv));
          }
          return sortDir === "desc" ? bv - av : av - bv;
        }),
    [activePlayers, matchesTextFilters, matchesKpi, sortKey, sortDir, columns]
  );

  const feedSources = useMemo(() => {
    const set = new Set<string>();
    activePlayers.forEach((p) => (p.mentions ?? []).forEach((m) => m.source_name && set.add(m.source_name)));
    return Array.from(set).sort();
  }, [activePlayers]);

  const feed: MentionRow[] = useMemo(() => {
    const rows: MentionRow[] = [];
    activePlayers.forEach((p) => {
      if (!matchesTextFilters(p)) return;
      (p.mentions ?? []).forEach((m, idx) => {
        if (feedSentiment !== "ALL" && (m.sentiment ?? "neutral") !== feedSentiment) return;
        if (feedSource !== "ALL" && m.source_name !== feedSource) return;
        rows.push({ player: p, index: idx, ...m });
      });
    });
    return rows.sort((a, b) => {
      const cmp = String(a.published ?? "").localeCompare(String(b.published ?? ""));
      return feedSort === "newest" ? -cmp : cmp;
    });
  }, [activePlayers, matchesTextFilters, feedSentiment, feedSource, feedSort]);

  const toggleExpanded = (id: string) =>
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const totalColumns = 5 + columns.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-6">
        <StatCard
          label="Spieler aktiv"
          value={stats.total}
          active={kpiFilter === "all"}
          onClick={() => setKpiFilter("all")}
        />
        <StatCard
          label="Besprochen"
          value={stats.mentioned}
          active={kpiFilter === "mentioned"}
          onClick={() => setKpiFilter((f) => (f === "mentioned" ? "all" : "mentioned"))}
        />
        <StatCard
          label="Value-Picks"
          value={stats.valuePicks}
          tone="green"
          active={kpiFilter === "valuePick"}
          onClick={() => setKpiFilter((f) => (f === "valuePick" ? "all" : "valuePick"))}
        />
        <StatCard
          label="Favoriten"
          value={stats.favorites}
          active={kpiFilter === "favorite"}
          onClick={() => setKpiFilter((f) => (f === "favorite" ? "all" : "favorite"))}
        />
        <StatCard
          label="Bewertet"
          value={stats.rated}
          active={kpiFilter === "rated"}
          onClick={() => setKpiFilter((f) => (f === "rated" ? "all" : "rated"))}
        />
        <StatCard label="Erkenntnisse gesamt" value={stats.totalMentions} />
      </div>

      <div className="glass-panel flex flex-wrap items-center gap-2 rounded-xl p-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Name oder Verein suchen"
          className="min-w-[220px] flex-1 rounded-lg border border-outline-variant/30 bg-surface-container-low px-3 py-1.5 text-xs text-on-surface outline-none placeholder:text-on-surface-variant/60"
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
              {pos === "ALL" ? "Alle Posi" : pos}
            </button>
          ))}
        </div>
        <ClubCrestFilter players={activePlayers} value={club} onChange={setClub} size={20} />
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
        <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
          {visiblePlayers.length} / {stats.total} Spieler
        </span>
      </div>

      <section className="glass-panel rounded-xl p-3">
        <div className="min-h-0 overflow-auto">
          {!playersLoaded && <div className="p-3 text-xs text-on-surface-variant">Lade…</div>}
          {playersLoaded && visiblePlayers.length === 0 && (
            <div className="rounded-lg border border-dashed border-outline-variant/30 p-4 text-center text-xs text-on-surface-variant">
              Keine Spieler für den aktuellen Filter.
            </div>
          )}
          {playersLoaded && visiblePlayers.length > 0 && (
            <table className="w-full min-w-[1520px] border-collapse text-left text-xs">
              <thead className="sticky top-0 z-10 bg-surface-container-high">
                <tr>
                  <th className="sticky left-0 z-20 w-8 bg-surface-container-high px-1 py-2" />
                  <th className="sticky left-8 z-20 bg-surface-container-high px-2 py-2 font-mono text-[9px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Spieler
                  </th>
                  <th className="px-1.5 py-2 text-left font-mono text-[9px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Liga
                  </th>
                  <th className="px-1.5 py-2 text-center font-mono text-[9px] font-bold uppercase tracking-wider text-on-surface-variant" title="Favorit">
                    Fav
                  </th>
                  <th className="px-1.5 py-2 text-center font-mono text-[9px] font-bold uppercase tracking-wider text-on-surface-variant" title="Deine manuelle Bewertung">
                    Bewertung
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
                {visiblePlayers.map((player) => {
                  const expanded = expandedIds.has(player.id);
                  const mentionsCount = player.mentionsCount ?? 0;
                  const disabledReason = rowDisabledReason(player, squadIds, squadCounts, squadSpent);
                  return (
                    <Fragment key={player.id}>
                      <tr
                        className={`border-t border-outline-variant/10 hover:bg-surface-container-high/50 ${
                          player.isHidden ? "opacity-50" : ""
                        }`}
                      >
                        <td className="sticky left-0 z-10 bg-surface-container px-1 py-2 text-center">
                          {mentionsCount > 0 && (
                            <button
                              type="button"
                              onClick={() => toggleExpanded(player.id)}
                              className="text-on-surface-variant hover:text-brand-pink"
                              title={expanded ? "Erkenntnisse einklappen" : "Erkenntnisse anzeigen"}
                            >
                              {expanded ? (
                                <ChevronDown className="h-3.5 w-3.5" />
                              ) : (
                                <ChevronRight className="h-3.5 w-3.5" />
                              )}
                            </button>
                          )}
                        </td>
                        <td className="sticky left-8 z-10 bg-surface-container px-2 py-2">
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
                                <span className="truncate text-sm font-bold text-on-surface">{player.name}</span>
                                <InjuryBadge injury={player.injury} size={10} />
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
                        <td className="px-1.5 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => togglePlayerFavorite(player.id)}
                            title={player.isFavorite ? "Favorit entfernen" : "Als Favorit markieren"}
                          >
                            <Heart
                              className="h-4 w-4"
                              fill={player.isFavorite ? "#e8143c" : "none"}
                              color={player.isFavorite ? "#e8143c" : "#8a9099"}
                            />
                          </button>
                        </td>
                        <td className="px-1.5 py-2">
                          <StarRating
                            value={player.userRating}
                            size={12}
                            onChange={(v) => setPlayerRating(player.id, v)}
                          />
                        </td>
                        {columns.map((c) => (
                          <td key={c.key} className="px-1.5 py-2 text-right">
                            {c.key === "feed" && mentionsCount > 0 ? (
                              <button
                                type="button"
                                onClick={() => toggleExpanded(player.id)}
                                className="inline-flex"
                                title="Erkenntnisse ein-/ausklappen"
                              >
                                {c.render(player)}
                              </button>
                            ) : (
                              c.render(player)
                            )}
                          </td>
                        ))}
                      </tr>
                      {expanded && mentionsCount > 0 && (
                        <tr className="border-t border-outline-variant/5 bg-background/30">
                          <td colSpan={totalColumns} className="px-3 py-2">
                            <div className="grid grid-cols-1 gap-2 py-1 md:grid-cols-2 xl:grid-cols-3">
                              {[...(player.mentions ?? [])]
                                .sort((a, b) => String(b.published ?? "").localeCompare(String(a.published ?? "")))
                                .map((m, idx) => (
                                  <MentionCard key={idx} m={{ ...m, player, index: idx }} />
                                ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <section className="glass-panel flex min-h-0 flex-col rounded-xl p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Newspaper className="h-4 w-4 text-sky-300" />
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-on-surface">
              Erkenntnisse &amp; Feed
            </h3>
            <span className="font-mono text-[10px] text-on-surface-variant">{feed.length} Einträge</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {SENTIMENTS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setFeedSentiment(s.id)}
                className={`rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${
                  feedSentiment === s.id
                    ? "bg-brand-pink text-white"
                    : "bg-surface-container-high text-on-surface-variant"
                }`}
              >
                {s.label}
              </button>
            ))}
            <select
              value={feedSource}
              onChange={(e) => setFeedSource(e.target.value)}
              className="rounded-full border border-outline-variant/30 bg-surface-container-high px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-on-surface-variant outline-none"
              title="Nach Quelle filtern"
            >
              <option value="ALL">Alle Quellen</option>
              {feedSources.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={feedSort}
              onChange={(e) => setFeedSort(e.target.value as "newest" | "oldest")}
              className="rounded-full border border-outline-variant/30 bg-surface-container-high px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-on-surface-variant outline-none"
              title="Sortierung nach Alter"
            >
              <option value="newest">Neueste zuerst</option>
              <option value="oldest">Älteste zuerst</option>
            </select>
          </div>
        </div>
        <div className="grid max-h-[560px] grid-cols-1 gap-2 overflow-auto pr-1 md:grid-cols-2 xl:grid-cols-3">
          {!playersLoaded && <div className="text-xs text-on-surface-variant">Lade…</div>}
          {playersLoaded && feed.length === 0 && (
            <div className="col-span-full rounded-lg border border-dashed border-outline-variant/30 p-4 text-center text-xs text-on-surface-variant">
              Keine Erkenntnisse für den aktuellen Filter.
            </div>
          )}
          {feed.map((m) => (
            <MentionCard
              key={`${m.player.id}-${m.index}`}
              m={m}
              showPlayer
              onOpenPlayer={() => openPlayerModal(m.player.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
