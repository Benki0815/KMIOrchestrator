"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bandage,
  Gem,
  ListOrdered,
  Search,
  Sparkles,
  Star,
} from "lucide-react";
import { useOrchestratorStore } from "@/lib/store";
import type { Player, Team } from "@/lib/types";
import { clubLogoSrc } from "@/components/ui/ClubCrestFilter";

interface TeamCardData {
  team: string;
  clubCode: string;
  data: Team | null;
  squadSize: number;
  injuredCount: number;
}

function buildTeams(players: Player[], teams: Team[]): TeamCardData[] {
  const byTeam = new Map<string, Team>();
  teams.forEach((t) => byTeam.set(t.team, t));

  const clubMap = new Map<string, string>();
  players.forEach((p) => {
    if (p.club && !clubMap.has(p.club)) clubMap.set(p.club, p.clubCode);
  });

  const names = new Set<string>([...Array.from(clubMap.keys()), ...Array.from(byTeam.keys())]);

  return Array.from(names)
    .map((name) => {
      const data = byTeam.get(name) ?? null;
      const clubCode = data?.clubCode || clubMap.get(name) || "UNK";
      const squadPlayers = players.filter((p) => p.club === name);
      return {
        team: name,
        clubCode,
        data,
        squadSize: squadPlayers.length,
        injuredCount: squadPlayers.filter((p) => p.injury).length,
      };
    })
    .sort((a, b) => {
      const posA = a.data?.tabellenplatzMin ?? 99;
      const posB = b.data?.tabellenplatzMin ?? 99;
      if (posA !== posB) return posA - posB;
      return a.team.localeCompare(b.team);
    });
}

function TabellenPill({ min, max }: { min?: number | null; max?: number | null }) {
  if (min == null && max == null) return null;
  const label = min != null && max != null && min !== max ? `Platz ${min}–${max}` : `Platz ${min ?? max}`;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-cyan-400/15 px-2.5 py-1 font-mono text-[10px] font-bold text-cyan-300">
      <ListOrdered className="h-3 w-3" />
      {label}
    </span>
  );
}

function ListSection({
  icon,
  label,
  items,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  items: string[];
  tone: string;
}) {
  if (!items.length) return null;
  return (
    <div>
      <div className={`mb-1 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider ${tone}`}>
        {icon}
        {label}
      </div>
      <ul className="space-y-0.5 pl-1">
        {items.map((item, idx) => (
          <li key={idx} className="truncate text-[12px] leading-snug text-on-surface-variant">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TeamCard({ card }: { card: TeamCardData }) {
  const { data } = card;
  const src = clubLogoSrc(card.clubCode);
  const hasData = !!data && (data.kernaussage || data.zugaenge.length || data.abgaenge.length || data.verletzungen.length);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-outline-variant/25 bg-surface-container-low p-4 shadow-lg transition-shadow hover:shadow-[0_0_18px_rgba(232,20,60,0.12)]">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-container-highest">
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt={card.team} className="h-8 w-8 object-contain" />
            ) : (
              <span className="font-mono text-[10px] text-on-surface-variant">{card.clubCode}</span>
            )}
          </div>
          <div className="min-w-0">
            <div className="truncate font-display text-sm font-black uppercase tracking-tight text-on-surface">
              {card.team}
            </div>
            <div className="font-mono text-[10px] text-on-surface-variant">
              {card.squadSize} Spieler im Pool
              {card.injuredCount > 0 ? ` · ${card.injuredCount} verletzt` : ""}
            </div>
          </div>
        </div>
        <TabellenPill min={data?.tabellenplatzMin} max={data?.tabellenplatzMax} />
      </div>

      {!hasData ? (
        <div className="rounded-lg border border-dashed border-outline-variant/30 px-3 py-4 text-center font-mono text-[10px] uppercase tracking-wider text-on-surface-variant/60">
          Noch keine Video-/Podcast-Analyse für diesen Verein
        </div>
      ) : (
        <>
          {data?.kernaussage && (
            <p className="rounded-lg bg-surface-container-highest/60 px-3 py-2 text-[13px] italic leading-snug text-on-surface">
              „{data.kernaussage}“
            </p>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ListSection
              icon={<ArrowUpRight className="h-3 w-3" />}
              label="Zugänge"
              items={data?.zugaenge ?? []}
              tone="text-emerald-300"
            />
            <ListSection
              icon={<ArrowDownRight className="h-3 w-3" />}
              label="Abgänge"
              items={data?.abgaenge ?? []}
              tone="text-rose-300"
            />
            <ListSection
              icon={<Gem className="h-3 w-3" />}
              label="Value-Spieler"
              items={data?.valueSpieler ?? []}
              tone="text-cyan-300"
            />
            <ListSection
              icon={<Sparkles className="h-3 w-3" />}
              label="Talente"
              items={data?.talente ?? []}
              tone="text-brand-amber"
            />
          </div>

          {(data?.verletzungen?.length ?? 0) > 0 && (
            <div>
              <div className="mb-1 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-rose-400">
                <Bandage className="h-3 w-3" />
                Verletzungen
              </div>
              <ul className="space-y-1">
                {data!.verletzungen.map((inj, idx) => (
                  <li key={idx} className="flex flex-wrap items-baseline gap-x-1.5 text-[12px] leading-snug">
                    <span className="font-bold text-on-surface">{inj.player}</span>
                    {inj.art && <span className="text-on-surface-variant">— {inj.art}</span>}
                    {inj.dauer && <span className="text-on-surface-variant/70">({inj.dauer})</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data?.sources?.length ? (
            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 border-t border-outline-variant/15 pt-2 font-mono text-[9px] text-on-surface-variant/60">
              {data.sources.slice(0, 3).map((s, idx) => (
                <span key={idx}>
                  {s.sourceName ?? "Quelle"}
                  {s.published ? ` · ${s.published}` : ""}
                </span>
              ))}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

export function TeamsPanel() {
  const players = useOrchestratorStore((s) => s.players);
  const teams = useOrchestratorStore((s) => s.teams);
  const [search, setSearch] = useState("");
  const [onlyAnalyzed, setOnlyAnalyzed] = useState(false);

  const cards = useMemo(() => buildTeams(players, teams), [players, teams]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return cards.filter((c) => {
      if (q && !c.team.toLowerCase().includes(q)) return false;
      if (onlyAnalyzed && !c.data) return false;
      return true;
    });
  }, [cards, search, onlyAnalyzed]);

  const analyzedCount = cards.filter((c) => c.data).length;
  const injuredTotal = players.filter((p) => p.injury).length;

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-outline-variant/25 bg-surface-container-low px-4 py-3">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-brand-pink" />
          <div>
            <div className="font-display text-sm font-black uppercase tracking-tight text-on-surface">
              Teams — Kernaussagen aus Video &amp; Podcast
            </div>
            <div className="font-mono text-[10px] text-on-surface-variant">
              {analyzedCount}/{cards.length} Vereine analysiert · {injuredTotal} Verletzungen aktuell erfasst
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
            <input
              type="checkbox"
              checked={onlyAnalyzed}
              onChange={(e) => setOnlyAnalyzed(e.target.checked)}
              className="accent-brand-pink"
            />
            nur analysierte
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-on-surface-variant" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Verein suchen…"
              className="w-52 rounded-lg border border-outline-variant/30 bg-surface-container-highest py-1.5 pl-8 pr-3 text-[12px] text-on-surface outline-none focus:border-brand-pink"
            />
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((card) => (
            <TeamCard key={card.team} card={card} />
          ))}
        </div>
      </div>
    </div>
  );
}
