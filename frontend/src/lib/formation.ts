import { POSITION_LIMITS, type Player, type Position, type SquadTab } from "./types";

/**
 * kicker Managerspiel Interactive: 22er-Kader (3 TOR / 7 ABW / 7 MIT / 5 STU).
 * Die Formation legt nur fest, wie viele ABW/MIT/STU in der Startelf stehen
 * (TOR ist immer 1). Der Rest jeder Position landet automatisch auf der Bank.
 */
export interface FormationLayout {
  ABW: number;
  MIT: number;
  STU: number;
}

export const FORMATION_LAYOUTS: Record<string, FormationLayout> = {
  "3-4-3": { ABW: 3, MIT: 4, STU: 3 },
  "4-3-3": { ABW: 4, MIT: 3, STU: 3 },
  "4-4-2": { ABW: 4, MIT: 4, STU: 2 },
  "3-5-2": { ABW: 3, MIT: 5, STU: 2 },
  "5-3-2": { ABW: 5, MIT: 3, STU: 2 },
  "5-4-1": { ABW: 5, MIT: 4, STU: 1 },
  "4-5-1": { ABW: 4, MIT: 5, STU: 1 },
};

const DEFAULT_FORMATION = "4-3-3";

export function starterCounts(formation: string): Record<Position, number> {
  const layout = FORMATION_LAYOUTS[formation] ?? FORMATION_LAYOUTS[DEFAULT_FORMATION];
  return { TOR: 1, ABW: layout.ABW, MIT: layout.MIT, STU: layout.STU };
}

export function benchCounts(formation: string): Record<Position, number> {
  const starters = starterCounts(formation);
  return {
    TOR: POSITION_LIMITS.TOR - starters.TOR,
    ABW: POSITION_LIMITS.ABW - starters.ABW,
    MIT: POSITION_LIMITS.MIT - starters.MIT,
    STU: POSITION_LIMITS.STU - starters.STU,
  };
}

/** Flat 11er-Array: welcher Slot-Index in `starters[]` gehoert zu welcher Position (TOR->ABW->MIT->STU). */
export function starterSlotPositions(formation: string): Position[] {
  const counts = starterCounts(formation);
  return [
    "TOR",
    ...Array<Position>(counts.ABW).fill("ABW"),
    ...Array<Position>(counts.MIT).fill("MIT"),
    ...Array<Position>(counts.STU).fill("STU"),
  ];
}

/** Flat 11er-Array: welcher Slot-Index in `bench[]` gehoert zu welcher Position (TOR->ABW->MIT->STU). */
export function benchSlotPositions(formation: string): Position[] {
  const counts = benchCounts(formation);
  return [
    ...Array<Position>(counts.TOR).fill("TOR"),
    ...Array<Position>(counts.ABW).fill("ABW"),
    ...Array<Position>(counts.MIT).fill("MIT"),
    ...Array<Position>(counts.STU).fill("STU"),
  ];
}

/** Gruppiert die Slot-Indizes eines Bereichs (starter/bench) nach Position, in Slot-Reihenfolge. */
export function groupSlotIndicesByPosition(slotPositions: Position[]): Record<Position, number[]> {
  const groups: Record<Position, number[]> = { TOR: [], ABW: [], MIT: [], STU: [] };
  slotPositions.forEach((pos, index) => groups[pos].push(index));
  return groups;
}

/**
 * Baut starters/bench fuer eine neue Formation neu auf, ohne den 22er-Kader zu veraendern.
 * Bisherige Startelf-Spieler behalten Prioritaet auf ihrer Position; schrumpft die
 * Startelf-Kapazitaet einer Position, wandern die letzten Spieler dieser Position auf die
 * Bank; waechst sie, ruecken die ersten Bank-Spieler dieser Position nach.
 */
export function reflowFormation(
  tab: Pick<SquadTab, "formation" | "starters" | "bench">,
  newFormation: string
): { starters: (string | null)[]; bench: (string | null)[] } {
  const oldStarterPos = starterSlotPositions(tab.formation);
  const oldBenchPos = benchSlotPositions(tab.formation);

  const byPosition: Record<Position, (string | null)[]> = { TOR: [], ABW: [], MIT: [], STU: [] };
  oldStarterPos.forEach((pos, i) => byPosition[pos].push(tab.starters[i] ?? null));
  oldBenchPos.forEach((pos, i) => byPosition[pos].push(tab.bench[i] ?? null));

  const cursor: Record<Position, number> = { TOR: 0, ABW: 0, MIT: 0, STU: 0 };
  const take = (pos: Position): string | null => {
    const value = byPosition[pos][cursor[pos]] ?? null;
    cursor[pos] += 1;
    return value;
  };

  const newStarterPos = starterSlotPositions(newFormation);
  const newBenchPos = benchSlotPositions(newFormation);

  return {
    starters: newStarterPos.map(take),
    bench: newBenchPos.map(take),
  };
}

/**
 * Repariert starters/bench anhand der tatsaechlichen Spielerposition (z.B. Altbestand aus
 * einer Zeit, in der Slots noch nicht positionsgebunden waren -> "Kane in der Abwehr").
 * Ein Spieler wandert dabei in den Slot-Block seiner echten Position; Startelf-Status wird
 * nach Moeglichkeit erhalten (Startelf-Slots zuerst eingelesen), Reihenfolge bleibt stabil.
 * Kein Effekt, wenn bereits alles konsistent ist.
 */
export function reconcileSquadPositions(
  tab: Pick<SquadTab, "formation" | "starters" | "bench">,
  players: Player[]
): { starters: (string | null)[]; bench: (string | null)[] } {
  if (players.length === 0) {
    return { starters: [...tab.starters], bench: [...tab.bench] };
  }
  const realPosition = (id: string | null): Position | null =>
    id ? players.find((p) => p.id === id)?.position ?? null : null;

  const byPosition: Record<Position, (string | null)[]> = { TOR: [], ABW: [], MIT: [], STU: [] };
  tab.starters.forEach((id) => {
    const pos = realPosition(id);
    if (pos) byPosition[pos].push(id);
  });
  tab.bench.forEach((id) => {
    const pos = realPosition(id);
    if (pos) byPosition[pos].push(id);
  });

  const cursor: Record<Position, number> = { TOR: 0, ABW: 0, MIT: 0, STU: 0 };
  const take = (pos: Position): string | null => {
    const value = byPosition[pos][cursor[pos]] ?? null;
    cursor[pos] += 1;
    return value;
  };

  return {
    starters: starterSlotPositions(tab.formation).map(take),
    bench: benchSlotPositions(tab.formation).map(take),
  };
}
