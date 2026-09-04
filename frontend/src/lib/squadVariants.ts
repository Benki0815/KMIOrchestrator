import type { SquadTab } from "@/lib/types";

/** Letter for a squad tab by index: 0 → A, 1 → B, … */
export function variantLetterForIndex(index: number): string {
  return String.fromCharCode(65 + index);
}

/** Map playerId → letters of all squad tabs (Varianten) that currently include the player. */
export function buildSquadVariantLettersByPlayer(tabs: SquadTab[]): Map<string, string[]> {
  const map = new Map<string, string[]>();
  tabs.forEach((tab, index) => {
    const letter = variantLetterForIndex(index);
    const add = (id: string | null) => {
      if (!id) return;
      const existing = map.get(id);
      if (existing) {
        if (!existing.includes(letter)) existing.push(letter);
      } else {
        map.set(id, [letter]);
      }
    };
    tab.starters.forEach(add);
    tab.bench.forEach(add);
  });
  return map;
}
