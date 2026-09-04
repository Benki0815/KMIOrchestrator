"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { ArrowLeftRight, Bolt, Shuffle, Wand2, X } from "lucide-react";
import {
  useActiveTab,
  useOrchestratorStore,
  useSquadMetrics,
} from "@/lib/store";
import { FORMATIONS, type Player, type PortalMode, type Position } from "@/lib/types";
import { starterSlotPositions } from "@/lib/formation";
import { lastSeasonDisplayPoints, listXPoints, projectionPoints, viewDisplayPoints } from "@/lib/scoring";
import { formatMio } from "@/lib/utils";
import { allowDrop, clearDrag, readDragPayload, useActiveDrag, writeDragSlot } from "@/lib/dnd";
import { InjuryBadge } from "@/components/ui/InjuryBadge";
import { SquadVariantBadges } from "@/components/ui/SquadVariantBadges";

const POSITION_FALLBACK: Record<Player["position"], { primary: string; secondary: string }> = {
  TOR: { primary: "#f5c542", secondary: "#916e18" },
  ABW: { primary: "#509bff", secondary: "#1d4ca0" },
  MIT: { primary: "#25ebff", secondary: "#0a6aa5" },
  STU: { primary: "#e8143c", secondary: "#7a0824" },
};

const CLUB_JERSEY: Record<string, { primary: string; secondary: string; stripe?: string }> = {
  FCB: { primary: "#cf102d", secondary: "#7f0a1c", stripe: "#ffffff44" }, // Bayern
  BVB: { primary: "#ffd400", secondary: "#c7a300", stripe: "#11111166" }, // Dortmund
  TSG: { primary: "#1f7bff", secondary: "#0f3f8d", stripe: "#a9c7ff66" }, // Hoffenheim
  B04: { primary: "#cb1a2f", secondary: "#0f0f12", stripe: "#f5d58f66" }, // Leverkusen
  RBL: { primary: "#f0f5ff", secondary: "#c9d5ef", stripe: "#d5122e66" },
  SGE: { primary: "#0e0e12", secondary: "#2f2f36", stripe: "#e0e0e066" },
  SCF: { primary: "#b30d24", secondary: "#111216", stripe: "#ffffff44" },
  VFB: { primary: "#f4f4f6", secondary: "#d2d2d8", stripe: "#d5162f88" },
  SVW: { primary: "#15905f", secondary: "#0d5c3d", stripe: "#d8f6e988" },
  BMG: { primary: "#1f1f24", secondary: "#0c0d10", stripe: "#ffffff44" },
  FCU: { primary: "#c7132f", secondary: "#111216", stripe: "#ffcc3366" },
  STP: { primary: "#7a5131", secondary: "#4d301c", stripe: "#f6e4d288" },
  S04: { primary: "#195fcc", secondary: "#0f3f8d", stripe: "#c8dbff66" },
  HSV: { primary: "#103f8e", secondary: "#0b2c65", stripe: "#f7f9ff77" },
  H96: { primary: "#22834d", secondary: "#135030", stripe: "#ffffff33" },
};

function jerseyStyle(player: Player): CSSProperties {
  const fallback = POSITION_FALLBACK[player.position];
  const club = CLUB_JERSEY[player.clubCode] ?? fallback;
  return {
    ["--jersey-primary" as string]: club.primary,
    ["--jersey-secondary" as string]: club.secondary,
    ["--jersey-stripe" as string]: club.stripe ?? "rgba(255,255,255,0.32)",
  };
}

function PlayerChip({
  player,
  mode,
  isSwapOut,
  dropReady,
  points,
  delta,
  onOpen,
  onRemove,
  onToggleSwap,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}: {
  player: Player | null;
  mode: PortalMode;
  isSwapOut?: boolean;
  dropReady?: boolean;
  points?: number;
  delta?: number;
  onOpen?: () => void;
  onRemove?: () => void;
  onToggleSwap?: () => void;
  onDragStart?: React.DragEventHandler<HTMLDivElement>;
  onDragEnd?: React.DragEventHandler<HTMLDivElement>;
  onDragOver?: React.DragEventHandler<HTMLDivElement>;
  onDrop?: React.DragEventHandler<HTMLDivElement>;
}) {
  if (!player) {
    return (
      <div
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`flex h-[64px] w-[72px] items-center justify-center rounded-xl border-2 border-dashed ${
          dropReady
            ? "border-brand-pink bg-brand-pink/15 opacity-100"
            : "border-outline-variant/20 opacity-30"
        }`}
      />
    );
  }
  const positive = typeof delta === "number" ? delta >= 0 : true;
  return (
    <div className="group relative flex w-[80px] flex-col items-center gap-0.5">
      <div className="relative h-[72px] w-[80px]">
        <div
          role="button"
          tabIndex={0}
          draggable
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onClick={onOpen}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onOpen?.();
          }}
          title={`${player.name} Details — ziehen zum Verschieben`}
          style={jerseyStyle(player)}
          className={`jersey-chip jersey-club absolute left-1/2 top-1.5 flex h-[64px] w-[64px] -translate-x-1/2 cursor-grab flex-col items-center justify-center border-2 shadow-lg transition-transform hover:-translate-y-0.5 active:cursor-grabbing ${
            isSwapOut || dropReady
              ? "border-brand-pink shadow-[0_0_14px_rgba(232,20,60,0.45)]"
              : "border-outline-variant/40"
          }`}
        >
          <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-on-surface-variant/90">
            {player.position}
          </span>
          {typeof points === "number" && (
            <span
              className={`jersey-number font-mono text-lg font-black leading-none ${
                positive ? "text-primary-fixed" : "text-tertiary-fixed-dim"
              }`}
            >
              {Math.round(points)}
            </span>
          )}
          {typeof delta === "number" && (
            <span
              className={`font-mono text-[10px] font-bold leading-none ${
                positive ? "text-primary-fixed-dim" : "text-tertiary-fixed-dim"
              }`}
            >
              {positive ? "+" : ""}
              {Math.round(delta)}
            </span>
          )}
        </div>
        {onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            title="Von Feld entfernen"
            className="absolute right-0 top-0 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-surface-container-highest text-on-surface-variant opacity-0 shadow transition-opacity hover:text-tertiary-fixed-dim group-hover:opacity-100"
          >
            <X className="h-3 w-3" />
          </button>
        )}
        {onToggleSwap && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSwap();
            }}
            title="Zum Tausch markieren"
            className={`absolute bottom-0 right-0 z-20 flex h-5 w-5 items-center justify-center rounded-full shadow transition-opacity ${
              isSwapOut
                ? "bg-brand-pink text-white opacity-100"
                : "bg-surface-container-highest text-on-surface-variant opacity-0 group-hover:opacity-100"
            }`}
          >
            <ArrowLeftRight className="h-3 w-3" />
          </button>
        )}
        {player.injury && (
          <div className="absolute left-0 top-0 z-20">
            <InjuryBadge injury={player.injury} size={11} />
          </div>
        )}
      </div>
      <div className="flex flex-col items-center">
        <span className="flex max-w-[80px] items-center justify-center gap-0.5">
          <span className="truncate font-mono text-[10px] font-semibold text-on-surface">
            {player.shortName}
          </span>
          <SquadVariantBadges playerId={player.id} size={12} />
        </span>
        <span className="font-mono text-[9px] text-on-surface-variant">
          {formatMio(player.marketValue)}
        </span>
      </div>
    </div>
  );
}

export function PitchView() {
  const tab = useActiveTab();
  const players = useOrchestratorStore((s) => s.players);
  const metrics = useSquadMetrics();
  const mode = useOrchestratorStore((s) => s.portalMode);
  const activeDrag = useActiveDrag();
  const pointsView = useOrchestratorStore((s) => s.pointsView);
  const setFormation = useOrchestratorStore((s) => s.setFormation);
  const generateSuggestions = useOrchestratorStore((s) => s.generateSuggestions);
  const reshuffle = useOrchestratorStore((s) => s.reshuffle);
  const openPlayerModal = useOrchestratorStore((s) => s.openPlayerModal);
  const toggleSwapOut = useOrchestratorStore((s) => s.toggleSwapOut);
  const removePlayerFromSquad = useOrchestratorStore((s) => s.removePlayerFromSquad);
  const moveSquadSlot = useOrchestratorStore((s) => s.moveSquadSlot);
  const assignPlayerToSlot = useOrchestratorStore((s) => s.assignPlayerToSlot);
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  const resolve = (id: string | null) =>
    id ? players.find((p) => p.id === id) ?? null : null;

  const projectionFor = (player: Player) =>
    tab.projections[player.id] ?? player.baselineProjection;
  const projectionPointsFor = (player: Player) => {
    const projection = projectionFor(player);
    if (!projection) return 0;
    return projectionPoints(player.position, projection);
  };
  const pointsFor = (player: Player) =>
    viewDisplayPoints(
      lastSeasonDisplayPoints(player),
      projectionPointsFor(player) || listXPoints(tab, player),
      pointsView
    );
  const deltaFor = (player: Player) =>
    projectionPointsFor(player) - lastSeasonDisplayPoints(player);

  const starters = tab.starters.map(resolve);
  const starterPositions = starterSlotPositions(tab.formation);

  const LINE_META: Record<Position, { label: string; tint: string }> = {
    TOR: { label: "TOR", tint: "from-brand-amber/30 to-brand-amber/5" },
    ABW: { label: "DEF", tint: "from-sky-500/30 to-sky-500/5" },
    MIT: { label: "MID", tint: "from-cyan-400/30 to-cyan-400/5" },
    STU: { label: "OFF", tint: "from-brand-pink/35 to-brand-pink/5" },
  };

  const lines = (["STU", "MIT", "ABW", "TOR"] as Position[]).map((pos) => ({
    id: pos,
    label: LINE_META[pos].label,
    tint: LINE_META[pos].tint,
    players: starterPositions
      .map((p, slot) => ({ p, slot }))
      .filter(({ p }) => p === pos)
      .map(({ slot }) => ({ slot, player: starters[slot] })),
  }));

  return (
    <section className="flex h-full w-full flex-col gap-3">
      <div className="flex items-center gap-2">
        <label className="glass-panel flex items-center gap-2 rounded-lg px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-wider">
          Formation
          <select
            className="bg-transparent text-primary-fixed outline-none"
            value={tab.formation}
            onChange={(e) => setFormation(e.target.value)}
          >
            {FORMATIONS.map((f) => (
              <option key={f} value={f} className="bg-surface-container">
                {f}
              </option>
            ))}
          </select>
        </label>
        <span
          className={`rounded-lg px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider ${
            metrics.valid
              ? "border border-primary-container/30 bg-primary-container/10 text-primary-fixed"
              : "border border-tertiary-fixed-dim/30 bg-tertiary-fixed-dim/10 text-tertiary-fixed-dim"
          }`}
        >
          {metrics.valid ? "Regelkonform" : "Entwurf unvollständig"}
        </span>
        <span className="rounded-lg border border-outline-variant/30 bg-surface-container-low px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
          Drag & Drop
        </span>
      </div>

      <div className="relative mx-auto h-[clamp(460px,74vh,800px)] w-full max-w-[520px] overflow-hidden rounded-2xl glass-panel pitch-gradient">
        <div className="pointer-events-none absolute inset-0 pitch-lines opacity-20" />
        <div className="absolute inset-0 flex flex-col justify-around px-3 py-2">
          {lines.map((line, li) => (
            <div key={line.id} className="relative flex min-h-[88px] items-center justify-center">
              <div
                className={`pointer-events-none absolute inset-x-1 inset-y-1 rounded-xl bg-gradient-to-r ${line.tint}`}
              />
              <div className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/80">
                {line.label}
              </div>
              <div className="relative z-10 flex items-center justify-center gap-2">
                {line.players.map(({ slot, player }, pi) => {
                  const slotPos = starterPositions[slot];
                  const dropReady = !!activeDrag && activeDrag.position === slotPos;
                  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
                    if (allowDrop(event, slotPos)) setDragOver(slot);
                  };
                  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setDragOver(null);
                    setDragFrom(null);
                    const source = readDragPayload(event);
                    clearDrag();
                    if (!source) return;
                    if (source.kind === "pool") {
                      assignPlayerToSlot(source.playerId, { area: "starter", index: slot });
                    } else {
                      moveSquadSlot(
                        { area: source.area, index: source.index },
                        { area: "starter", index: slot }
                      );
                    }
                  };
                  return (
                  <div
                    key={`${li}-${pi}`}
                    onDragOver={onDragOver}
                    onDragLeave={() => setDragOver((cur) => (cur === slot ? null : cur))}
                    onDrop={onDrop}
                    className={
                      dragFrom === slot || dragOver === slot || dropReady
                        ? "rounded-lg ring-2 ring-brand-pink/70"
                        : undefined
                    }
                  >
                    <PlayerChip
                      player={player}
                      mode={mode}
                      isSwapOut={!!player && tab.swapOutIds.includes(player.id)}
                      dropReady={dropReady}
                      points={player ? pointsFor(player) : undefined}
                      delta={player ? deltaFor(player) : undefined}
                      onOpen={player ? () => openPlayerModal(player.id) : undefined}
                      onRemove={player ? () => removePlayerFromSquad(player.id) : undefined}
                      onToggleSwap={player ? () => toggleSwapOut(player.id) : undefined}
                      onDragStart={(event) => {
                        if (!player) {
                          event.preventDefault();
                          return;
                        }
                        writeDragSlot(event, {
                          area: "starter",
                          index: slot,
                          playerId: player.id,
                          position: player.position,
                        });
                        setDragFrom(slot);
                      }}
                      onDragEnd={() => {
                        clearDrag();
                        setDragFrom(null);
                        setDragOver(null);
                      }}
                      onDragOver={onDragOver}
                      onDrop={onDrop}
                    />
                  </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <button
          type="button"
          onClick={generateSuggestions}
          className="glass-panel flex items-center justify-center gap-2 rounded-xl py-3 font-display text-xs font-semibold uppercase tracking-wider text-secondary hover:bg-secondary-container/10 hover:text-secondary"
        >
          <Bolt className="h-4 w-4" />
          Optimieren
        </button>
        <div className="glass-panel flex flex-col items-center justify-center rounded-xl px-3 py-3 text-center">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
            Budget frei
          </span>
          <span className="mt-0.5 font-mono text-sm font-bold text-primary-fixed">
            {metrics.remaining >= 0 ? "+" : ""}
            {formatMio(metrics.remaining)}
          </span>
        </div>
        <button
          type="button"
          onClick={generateSuggestions}
          className="flex items-center justify-center gap-2 rounded-xl bg-brand-pink py-3 font-display text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_16px_rgba(232,20,60,0.35)] hover:bg-brand-pink-dim"
        >
          <Wand2 className="h-4 w-4" />
          Vorschläge
        </button>
        <button
          type="button"
          onClick={reshuffle}
          className="glass-panel flex items-center justify-center gap-2 rounded-xl py-3 font-display text-xs font-semibold uppercase tracking-wider text-primary-fixed hover:bg-primary-container/10"
        >
          <Shuffle className="h-4 w-4" />
          Reshuffle
        </button>
      </div>
    </section>
  );
}
