export type Position = "TOR" | "ABW" | "MIT" | "STU";
export type PortalMode = "dashboard" | "bewerten" | "tauschen" | "praesentieren" | "players" | "teams" | "logs";
export type PointsView = "saison" | "prognose";
export type VariantId = "A" | "B" | "C";
export const VARIANT_IDS: VariantId[] = ["A", "B", "C"];

export const POSITION_LABELS: Record<Position, string> = {
  TOR: "Torwart",
  ABW: "Abwehr",
  MIT: "Mittelfeld",
  STU: "Sturm",
};

export const POSITION_GOAL_POINTS: Record<Position, number> = {
  TOR: 6,
  ABW: 5,
  MIT: 4,
  STU: 3,
};

export type RiskProfileId =
  | "floor"
  | "balanced"
  | "aggressive"
  | "ueberperformer";

export interface Player {
  id: string;
  name: string;
  shortName: string;
  club: string;
  clubCode: string;
  position: Position;
  marketValue: number;
  xPoints: number;
  pointsPerMio: number;
  stabIndex: number;
  ueberperformerScore: number;
  form: number[];
  pointsLastSeason?: number | null;
  averageGrade?: number | null;
  goalsLastSeason?: number | null;
  assistsLastSeason?: number | null;
  appearancesLastSeason?: number | null;
  agentScore?: number | null;
  agentLabel?: string | null;
  /** PlAIer-Score aus dem "MAIK mit AI"-Podcast (4-stelliger Wert, z.B. 6992). */
  plaierScore?: number | null;
  valuePick?: boolean;
  userRating?: number | null;
  isFavorite?: boolean;
  isHidden?: boolean;
  active?: boolean;
  sofascoreSeasonRating?: number | null;
  mentionsCount?: number;
  mentions?: Array<{
    source_type?: string | null;
    source_name?: string | null;
    source_title?: string | null;
    sentiment?: string | null;
    rating_label?: string | null;
    quote?: string | null;
    source_url?: string | null;
    published?: string | null;
    weight?: number | null;
  }>;
  baselineProjection?: PlayerProjection;
  locked?: boolean;
  /** "BUNDESLIGA" | "2. BUNDESLIGA" | null (null = unbekannt/Ausland -> Risiko-Flag) */
  leagueTag?: string | null;
  /** Aktuelle Verletzung laut Video-/Podcast-Auswertung, siehe Team-Rubrik. */
  injury?: PlayerInjury | null;
  /** Datum (YYYY-MM-DD) der juengsten Erwaehnung/Mention, fuer die sortierbare "Update"-Spalte. */
  lastMentionDate?: string | null;
}

export interface PlayerInjury {
  type?: string | null;
  expectedReturn?: string | null;
  note?: string | null;
  source?: string | null;
  published?: string | null;
}

export interface TeamInjury {
  player: string;
  art?: string | null;
  dauer?: string | null;
  hinweis?: string | null;
}

export interface TeamSource {
  sourceType?: string | null;
  sourceName?: string | null;
  sourceTitle?: string | null;
  sourceUrl?: string | null;
  published?: string | null;
}

export interface Team {
  team: string;
  clubCode: string;
  kernaussage?: string | null;
  kernaussageSource?: string | null;
  kernaussagePublished?: string | null;
  tabellenplatzMin?: number | null;
  tabellenplatzMax?: number | null;
  zugaenge: string[];
  abgaenge: string[];
  valueSpieler: string[];
  talente: string[];
  verletzungen: TeamInjury[];
  sources: TeamSource[];
  updatedAt?: string | null;
}

export interface PlayerProjection {
  starts: number;
  subApps: number;
  ratedGames: number;
  goals: number;
  assists: number;
  motm: number;
  yellowRed: number;
  redCards: number;
  cleanSheets: number;
  avgGrade: number;
}

export interface SquadTab {
  id: string;
  label: string;
  riskProfileId: RiskProfileId;
  starRating: number;
  formation: string;
  starters: (string | null)[];
  bench: (string | null)[];
  excludedPlayerIds: string[];
  projections: Record<string, PlayerProjection>;
  swapOutIds: string[];
  swapInByOut: Record<string, string | null>;
  /** Zielpunktzahl pro Starter ("Goldener Schnitt"), editierbar. */
  goldenSchnittTarget: number;
  reviewedPlayerIds: string[];
  /** Je Variante (A/B/C) die geplante Alternative pro ausgehendem Spieler. */
  swapVariants: Record<VariantId, Record<string, string | null>>;
}

export interface SquadState {
  tabs: SquadTab[];
  activeTabId: string;
  budgetMax: number;
  updatedAt: string;
  portalMode: PortalMode;
}

export const POSITION_LIMITS: Record<Position, number> = {
  TOR: 3,
  ABW: 7,
  MIT: 7,
  STU: 5,
};

export const BUDGET_MAX = 42.5;

export const RISK_PROFILES: { id: RiskProfileId; label: string }[] = [
  { id: "floor", label: "Sicherheits-FC" },
  { id: "balanced", label: "Ausgewogen" },
  { id: "aggressive", label: "Aggressiv" },
  { id: "ueberperformer", label: "Überperformer-Jäger" },
];

export const FORMATIONS = [
  "3-4-3",
  "4-3-3",
  "4-4-2",
  "3-5-2",
  "5-3-2",
  "5-4-1",
  "4-5-1",
] as const;
