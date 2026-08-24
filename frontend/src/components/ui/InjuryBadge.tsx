"use client";

import { Bandage } from "lucide-react";
import type { PlayerInjury } from "@/lib/types";

/** Kompaktes Verletzungs-Icon mit Tooltip (Art + erwartete Dauer), siehe Team-Rubrik /
 * extraction/TEAMS_SCHEMA.md. Wird ueberall dort gerendert, wo ein Spielername steht. */
export function InjuryBadge({ injury, size = 12 }: { injury: PlayerInjury | null | undefined; size?: number }) {
  if (!injury) return null;
  const label = [injury.type, injury.expectedReturn].filter(Boolean).join(" · ") || "Verletzt (Details unbekannt)";
  return (
    <span
      title={`Verletzt: ${label}${injury.source ? ` (Quelle: ${injury.source})` : ""}`}
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-rose-400"
      style={{ width: size + 6, height: size + 6 }}
    >
      <Bandage style={{ width: size, height: size }} />
    </span>
  );
}
