import type { Player, PlayerProjection, PointsView, Position, SquadTab } from "./types";
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
  const parsed = Number(projection.avgGrade);
  const avgGrade = clamp(Number.isFinite(parsed) && parsed >= 1 ? parsed : 3.5, 1, 6);

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

/** Kicker-Noten sind 1.00–6.00. 0.0 aus der CSV heisst "keine Benotung". */
export function validAverageGrade(value: number | null | undefined): number | null {
  if (value == null || !Number.isFinite(value) || value < 1 || value > 6) return null;
  return value;
}

/** 2L-Archiv-CSV hat oft 2024/25-Punkte. BL-CSV nie anfassen (Bankspieler
 * liegen unter dem Startelf-Boden). CSV 0 = keine Kicker-Saison. */
export function csvPointsAreStale(
  stored: number,
  starts: number,
  reconstructed: number,
  pointsSource?: string | null,
  goals = 0,
  assists = 0,
  position: Position = "MIT"
): boolean {
  if (!Number.isFinite(stored) || stored <= 0) return false;
  const src = (pointsSource || "").toUpperCase();
  if (src === "BL") return false;
  if (src === "2L" && starts >= 10) {
    const allSubsFloor = starts * 2 + goals * GOAL_POINTS[position] + assists * 2;
    return stored < allSubsFloor - 15;
  }
  if (src === "2L" && starts <= 8 && stored > reconstructed + 40) return true;
  return false;
}

function lastYearProjectionRaw(player: Player, avgGrade: number): PlayerProjection {
  const base = player.baselineProjection;
  return sanitizeProjection(player.position, {
    starts: base?.starts ?? player.appearancesLastSeason ?? 0,
    subApps: base?.subApps ?? 0,
    ratedGames: base?.ratedGames ?? player.appearancesLastSeason ?? 0,
    goals: base?.goals ?? player.goalsLastSeason ?? 0,
    assists: base?.assists ?? player.assistsLastSeason ?? 0,
    motm: base?.motm ?? 0,
    yellowRed: base?.yellowRed ?? 0,
    redCards: base?.redCards ?? 0,
    cleanSheets: base?.cleanSheets ?? 0,
    avgGrade,
  });
}

/** Vorsaison-Prognose: gespeicherte Baseline (inkl. manueller Overrides wie Ramaj),
 * echte Kicker-Note gegen 3.50. 2L-Archivnoten nur droppen, wenn die CSV-Punkte
 * zur Einsatz-Saison unmoeglich sind. */
export function lastYearProjection(player: Player): PlayerProjection {
  const base = player.baselineProjection;
  const storedGrade = validAverageGrade(player.averageGrade) ?? base?.avgGrade ?? 3.5;
  const source = player.leagueTag === "2. BUNDESLIGA" ? "2L" : player.leagueTag === "BUNDESLIGA" ? "BL" : null;
  const neutral = lastYearProjectionRaw(player, 3.5);
  const reconstructed = projectionPoints(player.position, neutral);
  if (
    csvPointsAreStale(
      player.pointsLastSeason ?? 0,
      neutral.starts,
      reconstructed,
      source,
      player.goalsLastSeason ?? 0,
      player.assistsLastSeason ?? 0,
      player.position
    )
  ) {
    return lastYearProjectionRaw(player, 3.5);
  }
  return lastYearProjectionRaw(player, storedGrade);
}

/** Pkt 25/26: API/CSV vertrauen. 0 ist ein echter Wert (kein Kicker-Jahr), nicht rekonstruieren. */
export function lastSeasonDisplayPoints(player: Player): number {
  if (player.pointsLastSeason != null) return player.pointsLastSeason;
  return Math.round(projectionPoints(player.position, lastYearProjection(player)));
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
  return lastYearProjection(player);
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

function roundedPoints(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value);
}

/** Chip/Bank/Liste: xPunkte wenn gesetzt, sonst Pkt 25/26 (Transfers ohne Kicker-Jahr). */
export function preferredDisplayPoints(tab: SquadTab, player: Player): number {
  const xp = listXPoints(tab, player);
  if (xp) return xp;
  return lastSeasonDisplayPoints(player);
}

/** Sicht-abhängige Anzeige mit Kreuz-Fallback, damit 0 nicht eine vorhandene Kennzahl verdeckt. */
export function viewDisplayPoints(
  lastSeasonPoints: number,
  xPoints: number,
  pointsView: PointsView
): number {
  const last = roundedPoints(lastSeasonPoints);
  const xp = roundedPoints(xPoints);
  if (pointsView === "saison") return last || xp;
  return xp || last;
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
