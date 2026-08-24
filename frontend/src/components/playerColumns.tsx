"use client";

import type { Player, Position, SquadTab } from "@/lib/types";
import { BUDGET_MAX, POSITION_LABELS, POSITION_LIMITS } from "@/lib/types";
import { formatDateDe, formatMio } from "@/lib/utils";
import { Pill } from "@/components/ui/Pill";
import { pointsPerMio, ratedGames, scoreScaled } from "@/lib/playerStats";
import { hasAcceptedPrognose, listXPoints } from "@/lib/scoring";

export type ColKey =
  | "name"
  | "position"
  | "club"
  | "mw"
  | "pkt"
  | "pktMio"
  | "xpkt"
  | "tore"
  | "vorl"
  | "sp"
  | "note"
  | "score"
  | "plaier"
  | "sofascore"
  | "feed"
  | "stab"
  | "uber"
  | "update"
  | "prognose";

export interface ColumnDef {
  key: ColKey;
  label: string;
  title?: string;
  sortValue: (p: Player) => number | string;
  render: (p: Player) => React.ReactNode;
}

/** Alle KPIs, die wir zu einem Spieler vorhalten — genutzt in SDB-Panel und Players-Table-Tab. */
export const PLAYER_COLUMNS: ColumnDef[] = [
  {
    key: "mw",
    label: "MW",
    title: "Marktwert",
    sortValue: (p) => p.marketValue,
    render: (p) => <Pill tone="neutral">{formatMio(p.marketValue)}</Pill>,
  },
  {
    key: "pkt",
    label: "Pkt 25/26",
    title: "Punkte Vorsaison",
    sortValue: (p) => p.pointsLastSeason ?? 0,
    render: (p) => <Pill tone="pink">{p.pointsLastSeason ?? 0}</Pill>,
  },
  {
    key: "pktMio",
    label: "Pkt/Mio",
    sortValue: (p) => pointsPerMio(p),
    render: (p) => <Pill tone="cyan">{pointsPerMio(p).toFixed(1)}</Pill>,
  },
  {
    key: "xpkt",
    label: "xPunkte",
    title: "Erwartete Punkte — übernommene Prognose, sonst Modell",
    sortValue: (p) => p.xPoints,
    render: (p) => <Pill tone="blue">{Math.round(p.xPoints)}</Pill>,
  },
  {
    key: "tore",
    label: "Tore",
    title: "Tore Vorsaison (Kicker-CSV)",
    sortValue: (p) => p.goalsLastSeason ?? 0,
    render: (p) => <Pill tone="green">{p.goalsLastSeason ?? 0}</Pill>,
  },
  {
    key: "vorl",
    label: "Vorl",
    title: "Vorlagen Vorsaison (Kicker-CSV)",
    sortValue: (p) => p.assistsLastSeason ?? 0,
    render: (p) => <Pill tone="blue">{p.assistsLastSeason ?? 0}</Pill>,
  },
  {
    key: "sp",
    label: "SP",
    title: "Einsätze/benotete Spiele Vorsaison",
    sortValue: (p) => ratedGames(p),
    render: (p) => <Pill tone="neutral">{ratedGames(p)}</Pill>,
  },
  {
    key: "note",
    label: "Note",
    title: "Ø-Note Vorsaison",
    sortValue: (p) => p.averageGrade ?? 0,
    render: (p) => <Pill tone="amber">{p.averageGrade == null ? "–" : p.averageGrade.toFixed(2)}</Pill>,
  },
  {
    key: "score",
    label: "Score",
    title: "Agent-Score (0-100)",
    sortValue: (p) => scoreScaled(p) ?? -1,
    render: (p) => <Pill tone="green">{scoreScaled(p) ?? "–"}</Pill>,
  },
  {
    key: "plaier",
    label: "PlAIer",
    title: "PlAIer-Score (MAIK mit AI Podcast)",
    sortValue: (p) => p.plaierScore ?? -1,
    render: (p) => <Pill tone="cyan">{p.plaierScore == null ? "–" : Math.round(p.plaierScore)}</Pill>,
  },
  {
    key: "sofascore",
    label: "SofaScore",
    sortValue: (p) => p.sofascoreSeasonRating ?? 0,
    render: (p) => (
      <Pill tone="cyan">{p.sofascoreSeasonRating == null ? "–" : p.sofascoreSeasonRating.toFixed(2)}</Pill>
    ),
  },
  {
    key: "feed",
    label: "Feed",
    title: "Anzahl Erkenntnisse/Mentions",
    sortValue: (p) => p.mentionsCount ?? 0,
    render: (p) => <Pill tone="gray">{p.mentionsCount ?? 0}</Pill>,
  },
  {
    key: "stab",
    label: "StabIdx",
    title: "Stabilitätsindex",
    sortValue: (p) => p.stabIndex,
    render: (p) => <Pill tone="neutral">{p.stabIndex.toFixed(1)}</Pill>,
  },
  {
    key: "uber",
    label: "ÜberPerf",
    title: "Überperformer-Score",
    sortValue: (p) => p.ueberperformerScore,
    render: (p) => <Pill tone="pink">{p.ueberperformerScore.toFixed(1)}</Pill>,
  },
  {
    key: "update",
    label: "Update",
    title: "Datum der juengsten Erwaehnung/Mention zu diesem Spieler",
    sortValue: (p) => p.lastMentionDate ?? "",
    render: (p) =>
      p.lastMentionDate ? (
        <Pill tone="cyan">{formatDateDe(p.lastMentionDate)}</Pill>
      ) : (
        <span className="text-on-surface-variant/40">–</span>
      ),
  },
];

/** Tab-gebundene Listenspalten: xPunkte zeigt die übernommene Prognose (pink),
 * sonst den Modellwert (blau). Keine Extra-Prognose-Spalte — User sucht den Wert unter xPunkte. */
export function buildListColumns(tab: SquadTab): ColumnDef[] {
  return PLAYER_COLUMNS.map((c) => {
    if (c.key !== "xpkt") return c;
    return {
      ...c,
      title: `xPunkte für "${tab.label}": übernommene Prognose (pink) oder Modell (blau)`,
      sortValue: (p) => listXPoints(tab, p),
      render: (p) => {
        const custom = hasAcceptedPrognose(tab, p.id);
        return (
          <Pill tone={custom ? "pink" : "blue"} title={custom ? "Deine Prognose" : "Modell"}>
            {listXPoints(tab, p)}
          </Pill>
        );
      },
    };
  });
}

export function SortTh({
  label,
  title,
  sortKeyValue,
  activeKey,
  dir,
  onSort,
}: {
  label: string;
  title?: string;
  sortKeyValue: ColKey;
  activeKey: ColKey;
  dir: "asc" | "desc";
  onSort: (key: ColKey) => void;
}) {
  return (
    <th className="px-1.5 py-2 text-right" title={title}>
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

export function leagueLabel(tag?: string | null): string {
  if (!tag) return "AUSLAND";
  if (tag === "2. BUNDESLIGA") return "2. BL";
  if (tag === "BUNDESLIGA") return "BL";
  return tag;
}

export function rowDisabledReason(
  player: Player,
  squadIds: Set<string>,
  counts: Record<Position, number>,
  spent: number
): string | null {
  if (squadIds.has(player.id)) return "Schon im Kader";
  if (squadIds.size >= 22) return "Kader voll";
  if (counts[player.position] >= POSITION_LIMITS[player.position]) {
    return `${POSITION_LABELS[player.position]} voll`;
  }
  if (spent + player.marketValue > BUDGET_MAX) return "Budget zu niedrig";
  return null;
}
