import type { Player, SquadState, Team } from "./types";

export type ActivityLogStatus = "ok" | "warning" | "error" | "running";
export type ActivityLogCategory = "media" | "ingest" | "sync" | "backup" | "system";

export interface ActivityLogEntry {
  id: number;
  fingerprint: string;
  createdAt: string;
  status: ActivityLogStatus;
  category: ActivityLogCategory | string;
  title: string;
  message: string;
  details: Record<string, unknown>;
}

const BASE = "/api";
const USER_ID = "default";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  listPlayers: async (): Promise<Player[]> =>
    // includeHidden=true, damit ausgeblendete Spieler im Store bleiben (fuer "Ausgeblendete
    // anzeigen"-Toggle in Dashboard/Players Table); die Panels filtern isHidden selbst clientseitig.
    handle<Player[]>(await fetch(`${BASE}/players?includeHidden=true`, { cache: "no-store" })),

  patchPlayer: async (
    id: string,
    patch: { isFavorite?: boolean; userRating?: number | null; isHidden?: boolean }
  ): Promise<Player> =>
    handle<Player>(
      await fetch(`${BASE}/players/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      })
    ),

  listTeams: async (): Promise<Team[]> =>
    handle<Team[]>(await fetch(`${BASE}/teams`, { cache: "no-store" })),

  getSquad: async (): Promise<SquadState> =>
    handle<SquadState>(await fetch(`${BASE}/squads/${USER_ID}`, { cache: "no-store" })),

  saveSquad: async (state: SquadState): Promise<{ ok: boolean; updatedAt: string }> =>
    handle<{ ok: boolean; updatedAt: string }>(
      await fetch(`${BASE}/squads/${USER_ID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      })
    ),

  listLogs: async (): Promise<{ items: ActivityLogEntry[]; total: number }> =>
    handle<{ items: ActivityLogEntry[]; total: number }>(
      await fetch(`${BASE}/logs?limit=500`, { cache: "no-store" })
    ),
};
