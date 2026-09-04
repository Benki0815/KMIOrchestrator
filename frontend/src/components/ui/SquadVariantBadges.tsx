"use client";

import { useMemo } from "react";
import { useOrchestratorStore } from "@/lib/store";
import { variantLetterForIndex } from "@/lib/squadVariants";

/** Compact A/B/C circles for squad tabs the player is currently in. */
export function SquadVariantBadges({
  playerId,
  size = 14,
}: {
  playerId: string;
  size?: number;
}) {
  const tabs = useOrchestratorStore((s) => s.tabs);
  const letters = useMemo(() => {
    const result: string[] = [];
    tabs.forEach((tab, index) => {
      if (tab.starters.includes(playerId) || tab.bench.includes(playerId)) {
        result.push(variantLetterForIndex(index));
      }
    });
    return result;
  }, [tabs, playerId]);

  if (!letters.length) return null;

  const fontSize = Math.max(8, size - 5);

  return (
    <span className="inline-flex shrink-0 items-center gap-0.5">
      {letters.map((letter) => (
        <span
          key={letter}
          title={`In Variante ${letter}`}
          className="inline-flex items-center justify-center rounded-full bg-primary-container/35 font-mono font-bold leading-none text-primary-fixed"
          style={{ width: size, height: size, fontSize }}
        >
          {letter}
        </span>
      ))}
    </span>
  );
}
