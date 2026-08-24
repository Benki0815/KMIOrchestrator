"use client";

import { useMemo } from "react";
import type { Player } from "@/lib/types";

/** Wappen liegen unter frontend/public/club-logos/{clubCode}.png, siehe
 * backend/scripts/fetch_club_logos.py (Quelle: SofaScore, wie BallistiXG). */
export function clubLogoSrc(clubCode: string | undefined | null): string | null {
  if (!clubCode || clubCode === "UNK") return null;
  return `/club-logos/${clubCode}.png`;
}

/** Vereinsfilter als klickbare Wappen statt Dropdown. Klick auf ein Wappen selektiert den
 * Verein, erneuter Klick auf das aktive Wappen (oder "Alle") hebt den Filter wieder auf. */
export function ClubCrestFilter({
  players,
  value,
  onChange,
  size = 22,
}: {
  players: Player[];
  value: string; // "ALL" oder Vereinsname
  onChange: (club: string) => void;
  size?: number;
}) {
  const clubs = useMemo(() => {
    const map = new Map<string, string>();
    players.forEach((p) => {
      if (p.club && !map.has(p.club)) map.set(p.club, p.clubCode);
    });
    return Array.from(map.entries())
      .map(([name, code]) => ({ name, code }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [players]);

  return (
    <div className="flex flex-wrap items-center gap-1">
      <button
        type="button"
        onClick={() => onChange("ALL")}
        title="Alle Vereine"
        className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wider ${
          value === "ALL"
            ? "bg-brand-pink text-white"
            : "bg-surface-container-high text-on-surface-variant hover:text-on-surface"
        }`}
      >
        Alle
      </button>
      {clubs.map(({ name, code }) => {
        const src = clubLogoSrc(code);
        const active = value === name;
        return (
          <button
            key={name}
            type="button"
            onClick={() => onChange(active ? "ALL" : name)}
            title={name}
            className={`flex shrink-0 items-center justify-center rounded-lg border p-0.5 transition-transform hover:scale-110 ${
              active
                ? "border-brand-pink bg-brand-pink/10 shadow-[0_0_8px_rgba(232,20,60,0.4)]"
                : "border-transparent hover:border-outline-variant/40"
            }`}
          >
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={name}
                style={{ width: size, height: size }}
                className="object-contain"
              />
            ) : (
              <span
                style={{ width: size, height: size }}
                className="flex items-center justify-center font-mono text-[8px] text-on-surface-variant"
              >
                {code}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
