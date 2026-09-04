import type { Player } from "./types";
import type { PillTone } from "@/components/ui/Pill";
import { lastSeasonDisplayPoints } from "./scoring";

/** "Benotete Spiele" der Vorsaison — falls keine Baseline-Prognose vorliegt, Einsaetze als Fallback. */
export function ratedGames(p: Player): number {
  return p.baselineProjection?.ratedGames ?? p.appearancesLastSeason ?? 0;
}

export function pointsPerMio(p: Player): number {
  return p.marketValue > 0 ? lastSeasonDisplayPoints(p) / p.marketValue : 0;
}

/** Agent-Score (-1..1) auf 0..100 skaliert, wie im urspruenglichen Kicker-Scout-Dashboard. */
export function scoreScaled(p: Player): number | null {
  return typeof p.agentScore === "number" ? Math.round((p.agentScore + 1) * 50) : null;
}

export function sentimentTone(sentiment?: string | null): { tone: PillTone; label: string } {
  switch (sentiment) {
    case "positive":
      return { tone: "green", label: "Positiv" };
    case "negative":
      return { tone: "red", label: "Negativ" };
    case "watch":
      return { tone: "amber", label: "Beobachten" };
    default:
      return { tone: "gray", label: "Neutral" };
  }
}
