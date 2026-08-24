"use client";

import { useMemo } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "./api";
import { defaultProjection, projectionForPlayer, projectionPoints, sanitizeProjection } from "./scoring";
import {
  benchSlotPositions,
  reconcileSquadPositions,
  reflowFormation,
  starterCounts,
  starterSlotPositions,
} from "./formation";
import {
  BUDGET_MAX,
  type PlayerProjection,
  POSITION_LIMITS,
  type PointsView,
  type PortalMode,
  type Player,
  type Position,
  type RiskProfileId,
  type SquadState,
  type SquadTab,
  type Team,
  VARIANT_IDS,
  type VariantId,
} from "./types";
import { MOCK_PLAYERS } from "./mock-players";

function emptySlots(n: number): (string | null)[] {
  return Array.from({ length: n }, () => null);
}

let tabSeq = 0;
function nextTabId(): string {
  tabSeq += 1;
  return `tab-${tabSeq}`;
}

function createTab(partial?: Partial<SquadTab>): SquadTab {
  return {
    id: nextTabId(),
    label: "Neuer Entwurf",
    riskProfileId: "balanced",
    starRating: 0,
    formation: "4-3-3",
    starters: emptySlots(11),
    bench: emptySlots(11),
    excludedPlayerIds: [],
    projections: {},
    swapOutIds: [],
    swapInByOut: {},
    reviewedPlayerIds: [],
    goldenSchnittTarget: 200,
    swapVariants: { A: {}, B: {}, C: {} },
    ...partial,
  };
}

function defaultState(): SquadState {
  // Stable IDs so SSR and first client paint match (avoids hydration wipe).
  const primary = createTab({
    id: "tab-primary",
    label: "Primary Squad",
    riskProfileId: "aggressive",
    starRating: 4,
  });
  const bTeam = createTab({
    id: "tab-bteam",
    label: "B-Team",
    riskProfileId: "floor",
    starRating: 2,
  });
  const risk = createTab({
    id: "tab-risk",
    label: "Risk/Reward",
    riskProfileId: "ueberperformer",
    starRating: 0,
  });
  return {
    tabs: [primary, bTeam, risk],
    activeTabId: primary.id,
    budgetMax: BUDGET_MAX,
    updatedAt: "1970-01-01T00:00:00.000Z",
    portalMode: "bewerten",
  };
}

function squadPlayerIds(tab: SquadTab): string[] {
  return [...tab.starters, ...tab.bench].filter((id): id is string => !!id);
}

function countByPosition(players: Player[], ids: string[]): Record<Position, number> {
  const counts: Record<Position, number> = { TOR: 0, ABW: 0, MIT: 0, STU: 0 };
  for (const id of ids) {
    const p = players.find((x) => x.id === id);
    if (p) counts[p.position] += 1;
  }
  return counts;
}

export type SquadMetrics = {
  spent: number;
  remaining: number;
  count: number;
  positions: Record<Position, number>;
  xPoints: number;
  pktPerMio: number;
  valid: boolean;
  starterLastSeasonPoints: number;
  starterProjectedPoints: number;
  benchLastSeasonPoints: number;
  benchProjectedPoints: number;
  goldenTarget: number;
  goldenDiffSaison: number;
  goldenDiffPrognose: number;
  reviewedCount: number;
  starterCount: number;
  benchCount: number;
  starterReviewedCount: number;
  benchReviewedCount: number;
};

export function resolveActiveTab(tabs: SquadTab[], activeTabId: string): SquadTab {
  return tabs.find((t) => t.id === activeTabId) ?? tabs[0] ?? createTab({ id: "tab-fallback", label: "Fallback" });
}

export function computeSquadMetrics(
  players: Player[],
  tab: SquadTab,
  budgetMax: number = BUDGET_MAX
): SquadMetrics {
  const ids = squadPlayerIds(tab);
  const squadPlayers = ids
    .map((id) => players.find((p) => p.id === id))
    .filter((p): p is Player => !!p);
  const spent = squadPlayers.reduce((sum, p) => sum + p.marketValue, 0);
  const xPoints = squadPlayers.reduce((sum, p) => sum + p.xPoints, 0);
  const starterPlayers = tab.starters
    .map((id) => players.find((p) => p.id === id))
    .filter((p): p is Player => !!p);
  const benchPlayers = tab.bench
    .map((id) => players.find((p) => p.id === id))
    .filter((p): p is Player => !!p);
  const positions = countByPosition(players, ids);
  const valid =
    ids.length === 22 &&
    spent <= budgetMax &&
    (Object.keys(POSITION_LIMITS) as Position[]).every(
      (pos) => positions[pos] === POSITION_LIMITS[pos]
    );
  const starterLastSeasonPoints = starterPlayers.reduce(
    (sum, p) => sum + (p.pointsLastSeason ?? 0),
    0
  );
  const starterProjectedPoints = starterPlayers.reduce((sum, p) => {
    const projection = projectionForPlayer(tab, p);
    return sum + projectionPoints(p.position, projection);
  }, 0);
  const benchLastSeasonPoints = benchPlayers.reduce(
    (sum, p) => sum + (p.pointsLastSeason ?? 0),
    0
  );
  const benchProjectedPoints = benchPlayers.reduce((sum, p) => {
    const projection = projectionForPlayer(tab, p);
    return sum + projectionPoints(p.position, projection);
  }, 0);
  const goldenTarget = tab.goldenSchnittTarget ?? 200;
  const starterTargetTotal = goldenTarget * (starterPlayers.length || 11);
  const goldenDiffSaison = starterLastSeasonPoints - starterTargetTotal;
  const goldenDiffPrognose = starterProjectedPoints - starterTargetTotal;
  const reviewed = tab.reviewedPlayerIds ?? [];
  const reviewedCount = ids.filter((id) => reviewed.includes(id)).length;
  const starterIds = tab.starters.filter((id): id is string => !!id);
  const benchIds = tab.bench.filter((id): id is string => !!id);
  return {
    spent,
    remaining: budgetMax - spent,
    count: ids.length,
    positions,
    xPoints,
    pktPerMio: spent > 0 ? xPoints / spent : 0,
    valid,
    starterLastSeasonPoints,
    starterProjectedPoints,
    benchLastSeasonPoints,
    benchProjectedPoints,
    goldenTarget,
    goldenDiffSaison,
    goldenDiffPrognose,
    reviewedCount,
    starterCount: starterIds.length,
    benchCount: benchIds.length,
    starterReviewedCount: starterIds.filter((id) => reviewed.includes(id)).length,
    benchReviewedCount: benchIds.filter((id) => reviewed.includes(id)).length,
  };
}

interface OrchestratorStore extends SquadState {
  players: Player[];
  teams: Team[];
  selectedPlayerId: string | null;
  playersLoaded: boolean;
  remoteLoaded: boolean;
  search: string;
  sortKey: keyof Player;
  sortDir: "asc" | "desc";
  positionFilter: Position | "ALL";
  saveStatus: "idle" | "saving" | "saved" | "error";
  saveError: string | null;
  pointsView: PointsView;
  alternativePicker: { variant: VariantId; swapOutId: string } | null;
  setPlayers: (players: Player[]) => void;
  setTeams: (teams: Team[]) => void;
  setPortalMode: (mode: PortalMode) => void;
  setPointsView: (view: PointsView) => void;
  setGoldenSchnittTarget: (value: number) => void;
  acceptProjection: (playerId: string, projection: PlayerProjection) => void;
  removePlayerAndClose: (playerId: string) => void;
  openAlternativePicker: (variant: VariantId, swapOutId: string) => void;
  closeAlternativePicker: () => void;
  setActiveTab: (id: string) => void;
  addTab: () => void;
  removeTab: (id: string) => void;
  renameTab: (id: string, label: string) => void;
  setStarRating: (id: string, rating: number) => void;
  setRiskProfile: (id: string, profile: RiskProfileId) => void;
  setFormation: (formation: string) => void;
  setSearch: (q: string) => void;
  setSort: (key: keyof Player) => void;
  setPositionFilter: (pos: Position | "ALL") => void;
  addPlayerToSquad: (playerId: string) => void;
  removePlayerFromSquad: (playerId: string) => void;
  moveSquadSlot: (
    from: { area: "starter" | "bench"; index: number },
    to: { area: "starter" | "bench"; index: number }
  ) => void;
  /** Zieht einen Spieler (z.B. aus der Spielerdatenbank per Drag&Drop) direkt in einen
   * konkreten Slot (Startelf/Bank). Nur erlaubt, wenn die Position passt und der Slot
   * frei ist; bei Neuaufnahme greifen die ueblichen Budget-/Kaderlimits. */
  assignPlayerToSlot: (playerId: string, target: { area: "starter" | "bench"; index: number }) => void;
  openPlayerModal: (playerId: string) => void;
  closePlayerModal: () => void;
  /** Favorit/Bewertung eines Spielers (Dashboard) - optimistisches Update + Persistenz
   * ueber PATCH /api/players/{id}, unabhaengig vom Kicker-Scout-Reimport. */
  togglePlayerFavorite: (playerId: string) => void;
  setPlayerRating: (playerId: string, rating: number) => void;
  togglePlayerHidden: (playerId: string) => void;
  setProjection: (playerId: string, projection: PlayerProjection) => void;
  updateProjection: (playerId: string, patch: Partial<PlayerProjection>) => void;
  toggleSwapOut: (playerId: string) => void;
  selectSwapIn: (swapOutId: string, swapInId: string | null) => void;
  setVariantSwapIn: (variant: VariantId, swapOutId: string, swapInId: string | null) => void;
  commitVariant: (variant: VariantId) => void;
  applySwapPlan: () => void;
  clearSwapPlan: () => void;
  excludePlayer: (playerId: string) => void;
  generateSuggestions: () => void;
  reshuffle: () => void;
  clearActiveTab: () => void;
  setSaveStatus: (status: "idle" | "saving" | "saved" | "error", error?: string | null) => void;
  hydrateFromServer: (incoming: SquadState) => void;
  initializeFromApi: () => Promise<void>;
  getActiveTab: () => SquadTab;
  getSquadMetrics: () => SquadMetrics;
}

function touch(state: SquadState): Partial<SquadState> {
  return { updatedAt: new Date().toISOString() };
}

function withTabDefaults(tab: SquadTab): SquadTab {
  return {
    ...tab,
    excludedPlayerIds: tab.excludedPlayerIds ?? [],
    projections: tab.projections ?? {},
    swapOutIds: tab.swapOutIds ?? [],
    swapInByOut: tab.swapInByOut ?? {},
    reviewedPlayerIds: tab.reviewedPlayerIds ?? [],
    goldenSchnittTarget: tab.goldenSchnittTarget ?? 200,
    swapVariants: {
      A: tab.swapVariants?.A ?? {},
      B: tab.swapVariants?.B ?? {},
      C: tab.swapVariants?.C ?? {},
    },
  };
}

function withStateDefaults(state: SquadState): SquadState {
  const safeTabs = state.tabs.map(withTabDefaults);
  return {
    ...state,
    tabs: safeTabs,
    portalMode: state.portalMode ?? "bewerten",
  };
}

function syncTabProjections(tab: SquadTab, players: Player[]): SquadTab {
  const { starters, bench } = reconcileSquadPositions(tab, players);
  const reviewed = new Set(tab.reviewedPlayerIds ?? []);
  const next = { ...tab, starters, bench, projections: { ...tab.projections } };
  const ids = [...starters, ...bench].filter((id): id is string => !!id);
  for (const id of ids) {
    const player = players.find((p) => p.id === id);
    if (!player) continue;
    // Nur explizit ueber "Vorjahr/Einschaetzung uebernehmen" bestaetigte Prognosen (siehe
    // acceptProjection) sind ein bewusster User-Override und bleiben unangetastet. Alle
    // anderen werden bei jedem Datenabgleich frisch aus den aktuellen Backend-Daten
    // (player.baselineProjection) neu abgeleitet - sonst haengen in bestehenden Kadern
    // veraltete/falsche gecachte Prognosen fest, obwohl Backend-Datenkorrekturen (z.B.
    // Realismus-Fixes, xPunkte-Formel-Aenderungen) laengst neue Werte liefern wuerden
    // (Bug vom 23.08.2026: Modal zeigte 216/uralte 28 Einsaetze, Liste laengst auf 0
    // korrigiert).
    next.projections[id] = reviewed.has(id)
      ? sanitizeProjection(player.position, next.projections[id] ?? defaultProjection(player))
      : defaultProjection(player);
  }
  return next;
}

function syncAllTabProjections(tabs: SquadTab[], players: Player[]): SquadTab[] {
  return tabs.map((tab) => syncTabProjections(tab, players));
}

function applySwapMapToTab(
  tab: SquadTab,
  players: Player[],
  swapMap: Record<string, string | null>,
  outIds: string[]
): SquadTab {
  let starters = [...tab.starters];
  let bench = [...tab.bench];
  const projections = { ...tab.projections };
  for (const outId of outIds) {
    const inId = swapMap[outId];
    if (!inId) continue;
    starters = starters.map((id) => (id === outId ? inId : id));
    bench = bench.map((id) => (id === outId ? inId : id));
    const player = players.find((p) => p.id === inId);
    if (player && !projections[inId]) projections[inId] = defaultProjection(player);
  }
  return {
    ...tab,
    starters,
    bench,
    projections,
    swapOutIds: [],
    swapInByOut: {},
    swapVariants: { A: {}, B: {}, C: {} },
  };
}

function updateActiveTab(
  state: OrchestratorStore,
  updater: (tab: SquadTab) => SquadTab
): Partial<OrchestratorStore> {
  const tabs = state.tabs.map((t) =>
    t.id === state.activeTabId ? withTabDefaults(updater(withTabDefaults(t))) : withTabDefaults(t)
  );
  return { tabs, ...touch(state), saveStatus: "saved" as const };
}

function pickSquad(
  players: Player[],
  profile: RiskProfileId,
  lockedIds: string[],
  excluded: string[],
  formation: string = "4-3-3"
): { starters: (string | null)[]; bench: (string | null)[] } {
  const pool = players.filter((p) => !excluded.includes(p.id));
  const scored = [...pool].sort((a, b) => {
    const score = (p: Player) => {
      let s = p.xPoints;
      if (profile === "floor") s = p.xPoints * 0.6 + p.stabIndex * 40;
      if (profile === "aggressive") s = p.xPoints * 0.7 + (p.form.at(-1) ?? 0) * 3;
      if (profile === "ueberperformer")
        s = p.pointsPerMio * 8 + p.ueberperformerScore * 2;
      return s;
    };
    return score(b) - score(a);
  });

  const selected: Player[] = [];
  const counts: Record<Position, number> = { TOR: 0, ABW: 0, MIT: 0, STU: 0 };
  let spent = 0;

  for (const id of lockedIds) {
    const p = pool.find((x) => x.id === id);
    if (!p) continue;
    if (counts[p.position] >= POSITION_LIMITS[p.position]) continue;
    if (spent + p.marketValue > BUDGET_MAX) continue;
    selected.push(p);
    counts[p.position] += 1;
    spent += p.marketValue;
  }

  for (const p of scored) {
    if (selected.some((s) => s.id === p.id)) continue;
    if (counts[p.position] >= POSITION_LIMITS[p.position]) continue;
    if (spent + p.marketValue > BUDGET_MAX) continue;
    if (selected.length >= 22) break;
    selected.push(p);
    counts[p.position] += 1;
    spent += p.marketValue;
  }

  const byPos: Record<Position, Player[]> = { TOR: [], ABW: [], MIT: [], STU: [] };
  for (const p of selected) byPos[p.position].push(p);

  // XI gemaess gewaehlter Formation befuellen, Rest je Position wandert auf die Bank.
  const formationCounts = starterCounts(formation);
  const startersByPos: Record<Position, Player[]> = {
    TOR: byPos.TOR.slice(0, formationCounts.TOR),
    ABW: byPos.ABW.slice(0, formationCounts.ABW),
    MIT: byPos.MIT.slice(0, formationCounts.MIT),
    STU: byPos.STU.slice(0, formationCounts.STU),
  };
  const benchByPos: Record<Position, Player[]> = {
    TOR: byPos.TOR.slice(formationCounts.TOR),
    ABW: byPos.ABW.slice(formationCounts.ABW),
    MIT: byPos.MIT.slice(formationCounts.MIT),
    STU: byPos.STU.slice(formationCounts.STU),
  };

  const starterCursor: Record<Position, number> = { TOR: 0, ABW: 0, MIT: 0, STU: 0 };
  const starters = starterSlotPositions(formation).map((pos) => {
    const p = startersByPos[pos][starterCursor[pos]] ?? null;
    starterCursor[pos] += 1;
    return p ? p.id : null;
  });

  const benchCursor: Record<Position, number> = { TOR: 0, ABW: 0, MIT: 0, STU: 0 };
  const bench = benchSlotPositions(formation).map((pos) => {
    const p = benchByPos[pos][benchCursor[pos]] ?? null;
    benchCursor[pos] += 1;
    return p ? p.id : null;
  });

  return { starters, bench };
}

export const useOrchestratorStore = create<OrchestratorStore>()(
  persist(
    (set, get) => ({
      ...defaultState(),
      players: MOCK_PLAYERS,
      teams: [],
      selectedPlayerId: null,
      playersLoaded: false,
      remoteLoaded: false,
      search: "",
      sortKey: "xPoints",
      sortDir: "desc",
      positionFilter: "ALL",
      saveStatus: "idle",
      saveError: null,
      pointsView: "saison",
      alternativePicker: null,

      setTeams: (teams) => set({ teams }),

      setPlayers: (players) =>
        set((state) => ({
          players,
          tabs: syncAllTabProjections(state.tabs.map(withTabDefaults), players),
          playersLoaded: true,
        })),
      setPortalMode: (mode) =>
        set((state) => ({
          portalMode: mode,
          ...touch(state),
          saveStatus: "saved",
        })),
      setPointsView: (view) => set({ pointsView: view }),
      setGoldenSchnittTarget: (value) =>
        set((state) => updateActiveTab(state, (t) => ({ ...t, goldenSchnittTarget: value }))),
      setSaveStatus: (status, error = null) => set({ saveStatus: status, saveError: error }),

      getActiveTab: () => {
        const s = get();
        return withTabDefaults(resolveActiveTab(s.tabs, s.activeTabId));
      },

      getSquadMetrics: () => {
        const s = get();
        return computeSquadMetrics(
          s.players,
          resolveActiveTab(s.tabs, s.activeTabId),
          s.budgetMax
        );
      },

      setActiveTab: (id) => set({ activeTabId: id }),
      addTab: () =>
        set((state) => {
          const tab = createTab({
            label: `Variante ${String.fromCharCode(65 + state.tabs.length)}`,
          });
          return {
            tabs: [...state.tabs, tab],
            activeTabId: tab.id,
            ...touch(state),
            saveStatus: "saved",
          };
        }),
      removeTab: (id) =>
        set((state) => {
          if (state.tabs.length <= 1) return state;
          const removedIndex = state.tabs.findIndex((t) => t.id === id);
          if (removedIndex < 0) return state;
          const tabs = state.tabs.filter((t) => t.id !== id);
          if (tabs.length === 0) return state;
          const fallbackIndex = Math.max(0, Math.min(removedIndex - 1, tabs.length - 1));
          const activeTabId =
            state.activeTabId === id
              ? tabs[fallbackIndex]?.id ?? tabs[0].id
              : state.activeTabId;
          return {
            tabs,
            activeTabId,
            ...touch(state),
            saveStatus: "saved",
          };
        }),
      renameTab: (id, label) =>
        set((state) => ({
          tabs: state.tabs.map((t) => (t.id === id ? { ...t, label } : t)),
          ...touch(state),
          saveStatus: "saved",
        })),
      setStarRating: (id, rating) =>
        set((state) => ({
          tabs: state.tabs.map((t) =>
            t.id === id ? { ...t, starRating: rating } : t
          ),
          ...touch(state),
          saveStatus: "saved",
        })),
      setRiskProfile: (id, profile) =>
        set((state) => ({
          tabs: state.tabs.map((t) =>
            t.id === id ? { ...t, riskProfileId: profile } : t
          ),
          ...touch(state),
          saveStatus: "saved",
        })),
      setFormation: (formation) =>
        set((state) =>
          updateActiveTab(state, (t) => {
            const { starters, bench } = reflowFormation(t, formation);
            return { ...t, formation, starters, bench };
          })
        ),
      setSearch: (q) => set({ search: q }),
      setSort: (key) =>
        set((state) => ({
          sortKey: key,
          sortDir:
            state.sortKey === key && state.sortDir === "desc" ? "asc" : "desc",
        })),
      setPositionFilter: (pos) => set({ positionFilter: pos }),

      addPlayerToSquad: (playerId) =>
        set((state) => {
          const tab = state.getActiveTab();
          if (squadPlayerIds(tab).includes(playerId)) return state;
          if (squadPlayerIds(tab).length >= 22) return state;
          const player = state.players.find((p) => p.id === playerId);
          if (!player) return state;
          const counts = countByPosition(state.players, squadPlayerIds(tab));
          if (counts[player.position] >= POSITION_LIMITS[player.position])
            return state;
          const spent = squadPlayerIds(tab)
            .map((id) => state.players.find((p) => p.id === id)?.marketValue ?? 0)
            .reduce((a, b) => a + b, 0);
          if (spent + player.marketValue > BUDGET_MAX) return state;

          const starterPositions = starterSlotPositions(tab.formation);
          const benchPositions = benchSlotPositions(tab.formation);
          const starters = [...tab.starters];
          const bench = [...tab.bench];
          const emptyStarter = starters.findIndex(
            (x, i) => x === null && starterPositions[i] === player.position
          );
          if (emptyStarter >= 0) starters[emptyStarter] = playerId;
          else {
            const emptyBench = bench.findIndex(
              (x, i) => x === null && benchPositions[i] === player.position
            );
            if (emptyBench < 0) return state;
            bench[emptyBench] = playerId;
          }
          return updateActiveTab(state, (t) => ({
            ...t,
            starters,
            bench,
            projections: {
              ...t.projections,
              [playerId]: projectionForPlayer(t, player),
            },
          }));
        }),

      removePlayerFromSquad: (playerId) =>
        set((state) =>
          updateActiveTab(state, (t) => ({
            ...t,
            starters: t.starters.map((id) => (id === playerId ? null : id)),
            bench: t.bench.map((id) => (id === playerId ? null : id)),
            swapOutIds: t.swapOutIds.filter((id) => id !== playerId),
            swapInByOut: Object.fromEntries(
              Object.entries(t.swapInByOut).filter(([key]) => key !== playerId)
            ),
          }))
        ),
      moveSquadSlot: (from, to) =>
        set((state) =>
          updateActiveTab(state, (t) => {
            if (from.area === to.area && from.index === to.index) return t;
            const fromPositions =
              from.area === "starter" ? starterSlotPositions(t.formation) : benchSlotPositions(t.formation);
            const toPositions =
              to.area === "starter" ? starterSlotPositions(t.formation) : benchSlotPositions(t.formation);
            const fromPos = fromPositions[from.index];
            const toPos = toPositions[to.index];
            if (!fromPos || !toPos || fromPos !== toPos) return t;

            const starters = [...t.starters];
            const bench = [...t.bench];
            const fromArr = from.area === "starter" ? starters : bench;
            const toArr = to.area === "starter" ? starters : bench;
            const movingId = fromArr[from.index];
            if (!movingId) return t;
            const displacedId = toArr[to.index];
            toArr[to.index] = movingId;
            fromArr[from.index] = displacedId;
            return { ...t, starters, bench };
          })
        ),
      assignPlayerToSlot: (playerId, target) =>
        set((state) => {
          const tab = state.getActiveTab();
          const player = state.players.find((p) => p.id === playerId);
          if (!player) return state;

          const targetPositions =
            target.area === "starter" ? starterSlotPositions(tab.formation) : benchSlotPositions(tab.formation);
          const targetPos = targetPositions[target.index];
          if (!targetPos || targetPos !== player.position) return state;

          const targetArrCurrent = target.area === "starter" ? tab.starters : tab.bench;
          const displacedId = targetArrCurrent[target.index];
          // Kein No-Op mehr bei belegtem Slot: das ist der Normalfall beim Ziehen aus der
          // Spielerdatenbank auf ein bereits volles Feld/Bank (der eigentliche Zweck von
          // Drag&Drop - Spieler tauschen). Der bisherige Slot-Insasse wird verdraengt
          // (Bug vom 23.08.2026: "sichtbar, aber droppt nicht", weil hier stillschweigend
          // abgebrochen wurde).
          if (displacedId === playerId) return state;

          const alreadyInSquad = squadPlayerIds(tab).includes(playerId);
          if (!alreadyInSquad) {
            if (!displacedId && squadPlayerIds(tab).length >= 22) return state;
            if (!displacedId) {
              const counts = countByPosition(state.players, squadPlayerIds(tab));
              if (counts[player.position] >= POSITION_LIMITS[player.position]) return state;
            }
            // Verdraengt der Drop einen Slot-Insassen, gleicht sich das Positionslimit von
            // selbst aus (einer raus, einer rein) - nur das Budget muss weiterhin passen.
            const spentWithoutDisplaced = squadPlayerIds(tab)
              .filter((id) => id !== displacedId)
              .map((id) => state.players.find((p) => p.id === id)?.marketValue ?? 0)
              .reduce((a, b) => a + b, 0);
            if (spentWithoutDisplaced + player.marketValue > BUDGET_MAX) return state;
          }

          const starters = [...tab.starters];
          const bench = [...tab.bench];
          const si = starters.indexOf(playerId);
          if (si >= 0) starters[si] = null;
          const bi = bench.indexOf(playerId);
          if (bi >= 0) bench[bi] = null;
          const targetArr = target.area === "starter" ? starters : bench;
          targetArr[target.index] = playerId;

          return updateActiveTab(state, (t) => ({
            ...t,
            starters,
            bench,
            swapOutIds: t.swapOutIds.filter((id) => id !== displacedId),
            swapInByOut: Object.fromEntries(
              Object.entries(t.swapInByOut).filter(([key]) => key !== displacedId)
            ),
            projections: alreadyInSquad
              ? t.projections
              : { ...t.projections, [playerId]: projectionForPlayer(t, player) },
          }));
        }),
      openPlayerModal: (playerId) => set({ selectedPlayerId: playerId }),
      closePlayerModal: () => set({ selectedPlayerId: null }),
      togglePlayerFavorite: (playerId) => {
        const target = get().players.find((p) => p.id === playerId);
        if (!target) return;
        const nextValue = !target.isFavorite;
        set((state) => ({
          players: state.players.map((p) =>
            p.id === playerId ? { ...p, isFavorite: nextValue } : p
          ),
        }));
        api.patchPlayer(playerId, { isFavorite: nextValue }).catch(() => {
          set((state) => ({
            players: state.players.map((p) =>
              p.id === playerId ? { ...p, isFavorite: !nextValue } : p
            ),
          }));
        });
      },
      setPlayerRating: (playerId, rating) => {
        const previous = get().players.find((p) => p.id === playerId)?.userRating ?? null;
        const nextValue = rating > 0 ? rating : null;
        set((state) => ({
          players: state.players.map((p) =>
            p.id === playerId ? { ...p, userRating: nextValue } : p
          ),
        }));
        api.patchPlayer(playerId, { userRating: nextValue }).catch(() => {
          set((state) => ({
            players: state.players.map((p) =>
              p.id === playerId ? { ...p, userRating: previous } : p
            ),
          }));
        });
      },
      togglePlayerHidden: (playerId) => {
        const target = get().players.find((p) => p.id === playerId);
        if (!target) return;
        const nextValue = !target.isHidden;
        set((state) => ({
          players: state.players.map((p) =>
            p.id === playerId ? { ...p, isHidden: nextValue } : p
          ),
        }));
        api.patchPlayer(playerId, { isHidden: nextValue }).catch(() => {
          set((state) => ({
            players: state.players.map((p) =>
              p.id === playerId ? { ...p, isHidden: !nextValue } : p
            ),
          }));
        });
      },
      setProjection: (playerId, projection) =>
        set((state) =>
          updateActiveTab(state, (t) => {
            const player = state.players.find((p) => p.id === playerId);
            if (!player) return t;
            return {
              ...t,
              projections: {
                ...t.projections,
                [playerId]: sanitizeProjection(player.position, projection),
              },
            };
          })
        ),
      acceptProjection: (playerId, projection) =>
        set((state) =>
          updateActiveTab(state, (t) => {
            const player = state.players.find((p) => p.id === playerId);
            if (!player) return t;
            return {
              ...t,
              projections: {
                ...t.projections,
                [playerId]: sanitizeProjection(player.position, projection),
              },
              reviewedPlayerIds: t.reviewedPlayerIds.includes(playerId)
                ? t.reviewedPlayerIds
                : [...t.reviewedPlayerIds, playerId],
            };
          })
        ),
      removePlayerAndClose: (playerId) =>
        set((state) => {
          const next = updateActiveTab(state, (t) => ({
            ...t,
            starters: t.starters.map((id) => (id === playerId ? null : id)),
            bench: t.bench.map((id) => (id === playerId ? null : id)),
            swapOutIds: t.swapOutIds.filter((id) => id !== playerId),
            swapInByOut: Object.fromEntries(
              Object.entries(t.swapInByOut).filter(([key]) => key !== playerId)
            ),
            reviewedPlayerIds: t.reviewedPlayerIds.filter((id) => id !== playerId),
          }));
          return { ...next, selectedPlayerId: null };
        }),
      openAlternativePicker: (variant, swapOutId) => set({ alternativePicker: { variant, swapOutId } }),
      closeAlternativePicker: () => set({ alternativePicker: null }),
      updateProjection: (playerId, patch) =>
        set((state) =>
          updateActiveTab(state, (t) => {
            const player = state.players.find((p) => p.id === playerId);
            if (!player) return t;
            const base = projectionForPlayer(t, player);
            return {
              ...t,
              projections: {
                ...t.projections,
                [playerId]: sanitizeProjection(player.position, { ...base, ...patch }),
              },
            };
          })
        ),
      toggleSwapOut: (playerId) =>
        set((state) =>
          updateActiveTab(state, (t) => {
            const exists = t.swapOutIds.includes(playerId);
            if (exists) {
              const nextSwapMap = { ...t.swapInByOut };
              delete nextSwapMap[playerId];
              const nextVariants = { A: { ...t.swapVariants.A }, B: { ...t.swapVariants.B }, C: { ...t.swapVariants.C } };
              for (const v of VARIANT_IDS) delete nextVariants[v][playerId];
              return {
                ...t,
                swapOutIds: t.swapOutIds.filter((id) => id !== playerId),
                swapInByOut: nextSwapMap,
                swapVariants: nextVariants,
              };
            }
            if (t.swapOutIds.length >= 3) return t;
            return {
              ...t,
              swapOutIds: [...t.swapOutIds, playerId],
              swapInByOut: { ...t.swapInByOut, [playerId]: null },
            };
          })
        ),
      selectSwapIn: (swapOutId, swapInId) =>
        set((state) =>
          updateActiveTab(state, (t) => ({
            ...t,
            swapInByOut: { ...t.swapInByOut, [swapOutId]: swapInId },
          }))
        ),
      setVariantSwapIn: (variant, swapOutId, swapInId) =>
        set((state) =>
          updateActiveTab(state, (t) => ({
            ...t,
            swapVariants: {
              ...t.swapVariants,
              [variant]: { ...t.swapVariants[variant], [swapOutId]: swapInId },
            },
          }))
        ),
      commitVariant: (variant) =>
        set((state) => {
          const tab = state.getActiveTab();
          const picks = tab.swapVariants[variant] ?? {};
          if (!tab.swapOutIds.some((id) => picks[id])) return {};
          return {
            ...updateActiveTab(state, (t) => applySwapMapToTab(t, state.players, picks, t.swapOutIds)),
            portalMode: "bewerten",
            alternativePicker: null,
            selectedPlayerId: null,
          };
        }),
      applySwapPlan: () =>
        set((state) => {
          const tab = state.getActiveTab();
          return {
            ...updateActiveTab(state, (t) =>
              applySwapMapToTab(t, state.players, t.swapInByOut, t.swapOutIds)
            ),
            alternativePicker: null,
            selectedPlayerId: null,
          };
        }),
      clearSwapPlan: () =>
        set((state) =>
          updateActiveTab(state, (t) => ({
            ...t,
            swapOutIds: [],
            swapInByOut: {},
            swapVariants: { A: {}, B: {}, C: {} },
          }))
        ),

      excludePlayer: (playerId) =>
        set((state) =>
          updateActiveTab(state, (t) => ({
            ...t,
            excludedPlayerIds: t.excludedPlayerIds.includes(playerId)
              ? t.excludedPlayerIds
              : [...t.excludedPlayerIds, playerId],
            starters: t.starters.map((id) => (id === playerId ? null : id)),
            bench: t.bench.map((id) => (id === playerId ? null : id)),
          }))
        ),

      generateSuggestions: () =>
        set((state) => {
          const tab = state.getActiveTab();
          const { starters, bench } = pickSquad(
            state.players,
            tab.riskProfileId,
            [],
            tab.excludedPlayerIds,
            tab.formation
          );
          return updateActiveTab(state, (t) => ({ ...t, starters, bench }));
        }),

      reshuffle: () =>
        set((state) => {
          const tab = state.getActiveTab();
          const locked = squadPlayerIds(tab).slice(0, 5);
          const { starters, bench } = pickSquad(
            state.players,
            tab.riskProfileId,
            locked,
            tab.excludedPlayerIds,
            tab.formation
          );
          return updateActiveTab(state, (t) => ({ ...t, starters, bench }));
        }),

      clearActiveTab: () =>
        set((state) =>
          updateActiveTab(state, (t) => ({
            ...t,
            starters: emptySlots(11),
            bench: emptySlots(11),
            swapOutIds: [],
            swapInByOut: {},
          }))
        ),
      hydrateFromServer: (incoming) =>
        set((state) => {
          const merged = withStateDefaults(incoming);
          const localDate = Date.parse(state.updatedAt || "1970-01-01T00:00:00.000Z");
          const remoteDate = Date.parse(merged.updatedAt || "1970-01-01T00:00:00.000Z");
          const chosen = remoteDate >= localDate ? merged : withStateDefaults(state);
          return {
            ...chosen,
            tabs: syncAllTabProjections(chosen.tabs, state.players),
            remoteLoaded: true,
          };
        }),
      initializeFromApi: async () => {
        try {
          const [players, remoteSquad, teams] = await Promise.all([
            api.listPlayers(),
            api.getSquad(),
            api.listTeams().catch(() => []),
          ]);
          set((state) => {
            const normalizedPlayers = players.map((p) => ({
              ...p,
              baselineProjection: p.baselineProjection ?? defaultProjection(p),
            }));
            const mergedRemote = withStateDefaults(remoteSquad);
            const localDate = Date.parse(state.updatedAt || "1970-01-01T00:00:00.000Z");
            const remoteDate = Date.parse(mergedRemote.updatedAt || "1970-01-01T00:00:00.000Z");
            const chosen = remoteDate >= localDate ? mergedRemote : withStateDefaults(state);
            return {
              ...chosen,
              players: normalizedPlayers,
              teams,
              tabs: syncAllTabProjections(chosen.tabs, normalizedPlayers),
              playersLoaded: true,
              remoteLoaded: true,
              saveStatus: "saved",
              saveError: null,
            };
          });
        } catch (error) {
          set({
            playersLoaded: true,
            remoteLoaded: true,
            saveStatus: "error",
            saveError: error instanceof Error ? error.message : String(error),
          });
        }
      },
    }),
    {
      name: "kmi-orchestrator-squads-v3",
      version: 3,
      migrate: (persistedState) => {
        const incoming = persistedState as Partial<OrchestratorStore> | undefined;
        if (!incoming) return defaultState();
        const base = defaultState();
        const merged: SquadState = {
          tabs: (incoming.tabs as SquadTab[] | undefined) ?? base.tabs,
          activeTabId: incoming.activeTabId ?? base.activeTabId,
          budgetMax: incoming.budgetMax ?? base.budgetMax,
          updatedAt: incoming.updatedAt ?? base.updatedAt,
          portalMode: (incoming.portalMode as PortalMode | undefined) ?? "bewerten",
        };
        return withStateDefaults(merged);
      },
      skipHydration: true,
      partialize: (state) => ({
        tabs: state.tabs,
        activeTabId: state.activeTabId,
        budgetMax: state.budgetMax,
        updatedAt: state.updatedAt,
        portalMode: state.portalMode,
        pointsView: state.pointsView,
      }),
    }
  )
);

export function useActiveTab(): SquadTab {
  const tabs = useOrchestratorStore((s) => s.tabs);
  const activeTabId = useOrchestratorStore((s) => s.activeTabId);
  return resolveActiveTab(tabs, activeTabId);
}

/** Derive metrics via useMemo — nested objects must not go through store selectors. */
export function useSquadMetrics(): SquadMetrics {
  const players = useOrchestratorStore((s) => s.players);
  const tabs = useOrchestratorStore((s) => s.tabs);
  const activeTabId = useOrchestratorStore((s) => s.activeTabId);
  const budgetMax = useOrchestratorStore((s) => s.budgetMax);

  return useMemo(
    () =>
      computeSquadMetrics(
        players,
        resolveActiveTab(tabs, activeTabId),
        budgetMax
      ),
    [players, tabs, activeTabId, budgetMax]
  );
}
