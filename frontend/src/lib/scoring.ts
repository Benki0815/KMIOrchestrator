import type { Player, PlayerProjection, Position, SquadTab } from "./types";
import { POSITION_GOAL_POINTS } from "./types";

export const GOAL_POINTS = POSITION_GOAL_POINTS;
export const MAX_MATCHES_PER_SEASON = 34;

const GOAL_CAP: Record<Position, number> = {
  TOR: 3,
  ABW: 15,
  MIT: 22,
  STU: 35,
};

const ASSIST_CAP: Record<Position, number> = {
  TOR: 4,
  ABW: 14,
  MIT: 24,
  STU: 18,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function toInt(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value);
}

export function sanitizeProjection(position: Position, projection: PlayerProjection): PlayerProjection {
  const starts = clamp(toInt(projection.starts), 0, MAX_MATCHES_PER_SEASON);
  const subApps = clamp(toInt(projection.subApps), 0, MAX_MATCHES_PER_SEASON - starts);
  const appearanceCap = starts + subApps;
  const ratedGames = clamp(toInt(projection.ratedGames), 0, appearanceCap);
  const goals = clamp(toInt(projection.goals), 0, GOAL_CAP[position]);
  const assists = clamp(toInt(projection.assists), 0, ASSIST_CAP[position]);
  const motm = clamp(toInt(projection.motm), 0, 12);
  const yellowRed = clamp(toInt(projection.yellowRed), 0, 4);
  const redCards = clamp(toInt(projection.redCards), 0, 3);
  const cleanSheets =
    position === "TOR" ? clamp(toInt(projection.cleanSheets), 0, Math.min(20, starts)) : 0;
  const avgGrade = clamp(Number(projection.avgGrade) || 3.5, 1, 6);

  return {
    starts,
    subApps,
    ratedGames,
    goals,
    assists,
    motm,
    yellowRed,
    redCards,
    cleanSheets,
    avgGrade: Number(avgGrade.toFixed(2)),
  };
}

export function projectionFieldMax(
  position: Position,
  projection: PlayerProjection,
  field: keyof PlayerProjection
): number {
  const starts = clamp(toInt(projection.starts), 0, MAX_MATCHES_PER_SEASON);
  switch (field) {
    case "starts":
      return MAX_MATCHES_PER_SEASON;
    case "subApps":
      return MAX_MATCHES_PER_SEASON - starts;
    case "ratedGames":
      return starts + clamp(toInt(projection.subApps), 0, MAX_MATCHES_PER_SEASON - starts);
    case "goals":
      return GOAL_CAP[position];
    case "assists":
      return ASSIST_CAP[position];
    case "motm":
      return 12;
    case "yellowRed":
      return 4;
    case "redCards":
      return 3;
    case "cleanSheets":
      return position === "TOR" ? Math.min(20, starts) : 0;
    default:
      return 99;
  }
}

export function gradePointsPerGame(avgGrade: number): number {
  return (3.5 - avgGrade) * 4;
}

export interface PointsBreakdown {
  starts: number;
  subApps: number;
  goals: number;
  assists: number;
  motm: number;
  cards: number;
  cleanSheets: number;
  notePoints: number;
  total: number;
}

export function pointsBreakdown(position: Position, projection: PlayerProjection): PointsBreakdown {
  const notePoints = Math.round(gradePointsPerGame(projection.avgGrade) * projection.ratedGames);
  const starts = projection.starts * 4;
  const subApps = projection.subApps * 2;
  const goals = projection.goals * GOAL_POINTS[position];
  const assists = projection.assists * 2;
  const motm = projection.motm * 3;
  const cards = projection.yellowRed * -3 + projection.redCards * -6;
  const cleanSheets = position === "TOR" ? projection.cleanSheets * 2 : 0;
  const total = starts + subApps + goals + assists + motm + cards + cleanSheets + notePoints;
  return { starts, subApps, goals, assists, motm, cards, cleanSheets, notePoints, total };
}

export function projectionPoints(position: Position, projection: PlayerProjection): number {
  return pointsBreakdown(position, projection).total;
}

/** Fixer Zielwert je Spieler ("Goldener Schnitt") — Torwart hat einen hoeheren Sockel. */
export function playerGoldenTarget(position: Position): number {
  return position === "TOR" ? 225 : 200;
}

/** Fallback-Prognose, solange der Nutzer noch keine eigene Einschaetzung fuer den Spieler
 * in dieser Kader-Variante uebernommen hat (siehe PlayerForecastModal "Vorjahr/Einschaetzung
 * uebernehmen"). Verschoben aus store.ts, damit auch Tabellen-Spalten (playerColumns.tsx)
 * ohne Store-Import darauf zugreifen koennen. */
export function defaultProjection(player: Player): PlayerProjection {
  if (player.baselineProjection) return sanitizeProjection(player.position, player.baselineProjection);
  return sanitizeProjection(player.position, {
    starts: player.appearancesLastSeason ?? 0,
    subApps: 0,
    ratedGames: player.appearancesLastSeason ?? 0,
    goals: player.goalsLastSeason ?? 0,
    assists: player.assistsLastSeason ?? 0,
    motm: 0,
    yellowRed: 0,
    redCards: 0,
    cleanSheets: 0,
    avgGrade: player.averageGrade ?? 3.5,
  });
}

/** Die fuer eine Kader-Variante (SquadTab) aktuell gueltige Prognose eines Spielers -
 * entweder die vom Nutzer uebernommene Einschaetzung oder der Fallback. */
export function projectionForPlayer(tab: SquadTab, player: Player): PlayerProjection {
  return sanitizeProjection(player.position, tab.projections[player.id] ?? defaultProjection(player));
}

export function hasAcceptedPrognose(tab: SquadTab, playerId: string): boolean {
  return Boolean(tab.projections[playerId]) && (tab.reviewedPlayerIds ?? []).includes(playerId);
}

/** Listen-xPunkte: übernommene Prognose aus dem Modal schlägt den Modellwert. */
export function listXPoints(tab: SquadTab, player: Player): number {
  if (hasAcceptedPrognose(tab, player.id)) {
    return Math.round(projectionPoints(player.position, projectionForPlayer(tab, player)));
  }
  return Math.round(player.xPoints);
}

/** Shallow-Vergleich zweier Prognosen - Basis fuer den "ungespeicherte Aenderungen"-Hinweis
 * im PlayerForecastModal (User-Feedback 24.08.2026: Schliessen soll nur dann zwischen
 * Uebernehmen/Verwerfen unterscheiden, wenn sich am Entwurf tatsaechlich etwas geaendert hat). */
export function projectionsEqual(a: PlayerProjection, b: PlayerProjection): boolean {
  return (
    a.starts === b.starts &&
    a.subApps === b.subApps &&
    a.ratedGames === b.ratedGames &&
    a.goals === b.goals &&
    a.assists === b.assists &&
    a.motm === b.motm &&
    a.yellowRed === b.yellowRed &&
    a.redCards === b.redCards &&
    a.cleanSheets === b.cleanSheets &&
    a.avgGrade === b.avgGrade
  );
}
