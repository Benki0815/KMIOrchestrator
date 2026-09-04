"use client";

import { useState } from "react";
import { ArrowLeftRight, Pencil, RotateCcw, X } from "lucide-react";
import { useActiveTab, useOrchestratorStore, useSquadMetrics } from "@/lib/store";
import type { Player, Position } from "@/lib/types";
import { POSITION_LABELS } from "@/lib/types";
import { benchSlotPositions } from "@/lib/formation";
import {
  lastSeasonDisplayPoints,
  lastYearProjection,
  listXPoints,
  projectionPoints,
  viewDisplayPoints,
} from "@/lib/scoring";
import { formatMio } from "@/lib/utils";
import { allowDrop, clearDrag, readDragPayload, useActiveDrag, writeDragSlot } from "@/lib/dnd";
import { InjuryBadge } from "@/components/ui/InjuryBadge";
import { SquadVariantBadges } from "@/components/ui/SquadVariantBadges";

const GROUP_ORDER: Position[] = ["STU", "MIT", "ABW", "TOR"];

function BankRow({
  player,
  slotIndex,
  isDragOver,
  onDragStartRow,
  onDragEndRow,
  onDragOverRow,
  onDragLeaveRow,
  onDropRow,
}: {
  player: Player;
  slotIndex: number;
  isDragOver: boolean;
  onDragStartRow: (event: React.DragEvent<HTMLElement>) => void;
  onDragEndRow: () => void;
  onDragOverRow: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragLeaveRow: () => void;
  onDropRow: (event: React.DragEvent<HTMLDivElement>) => void;
}) {
  const tab = useActiveTab();
  const pointsView = useOrchestratorStore((s) => s.pointsView);
  const openPlayerModal = useOrchestratorStore((s) => s.openPlayerModal);
  const setProjection = useOrchestratorStore((s) => s.setProjection);
  const removePlayerFromSquad = useOrchestratorStore((s) => s.removePlayerFromSquad);
  const toggleSwapOut = useOrchestratorStore((s) => s.toggleSwapOut);
  const reviewed = tab.reviewedPlayerIds.includes(player.id);
  const isSwapOut = tab.swapOutIds.includes(player.id);

  const projection = tab.projections[player.id] ?? player.baselineProjection;
  const projPoints = projection ? projectionPoints(player.position, projection) : 0;
  const points = viewDisplayPoints(
    lastSeasonDisplayPoints(player),
    projPoints || listXPoints(tab, player),
    pointsView
  );

  return (
    <div
      draggable
      onDragStart={onDragStartRow}
      onDragEnd={onDragEndRow}
      onDragOver={onDragOverRow}
      onDragLeave={onDragLeaveRow}
      onDrop={onDropRow}
      title="Ziehen, um Position zu tauschen"
      className={`group flex cursor-grab flex-col gap-1 rounded-lg px-2 py-2 transition-colors hover:bg-surface-container-high/60 active:cursor-grabbing ${
        isSwapOut
          ? "bg-brand-pink/10 ring-2 ring-brand-pink/70"
          : isDragOver
            ? "ring-2 ring-brand-pink/70"
            : ""
      }`}
    >
      <div className="flex items-center gap-2">
        <div
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded font-mono text-[9px] font-bold ${
            reviewed ? "bg-primary-container/25 text-primary-fixed" : "bg-surface-container-highest text-on-surface-variant"
          }`}
        >
          {player.position}
        </div>
        <button
          type="button"
          onMouseDown={(event) => event.stopPropagation()}
          onClick={() => openPlayerModal(player.id)}
          className="min-w-0 flex-1 cursor-grab text-left active:cursor-grabbing"
        >
          <div className="flex items-center gap-1 truncate text-sm font-bold text-on-surface">
            <span className="truncate">{player.name}</span>
            <InjuryBadge injury={player.injury} size={10} />
            <SquadVariantBadges playerId={player.id} size={14} />
          </div>
          <div className="truncate text-[10px] text-on-surface-variant">{player.club}</div>
        </button>
        <span className="shrink-0 rounded-md bg-surface-container-highest px-1.5 py-0.5 font-mono text-xs font-bold text-primary-fixed-dim">
          {points}
        </span>
      </div>
      <div className="flex items-center justify-between pl-8">
        <span className="font-mono text-[10px] text-on-surface-variant">
          {formatMio(player.marketValue)}
        </span>
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            title={isSwapOut ? "Tausch-Markierung aufheben" : "Zum Tausch markieren"}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => toggleSwapOut(player.id)}
            className={`rounded p-1 ${
              isSwapOut
                ? "bg-brand-pink text-white"
                : "text-on-surface-variant opacity-0 hover:text-brand-pink group-hover:opacity-100"
            }`}
          >
            <ArrowLeftRight className="h-3 w-3" />
          </button>
          <button
            type="button"
            title="Prognose bearbeiten"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => openPlayerModal(player.id)}
            className="rounded p-1 text-on-surface-variant opacity-0 hover:text-brand-pink group-hover:opacity-100"
          >
            <Pencil className="h-3 w-3" />
          </button>
          <button
            type="button"
            title="Auf Vorjahr zuruecksetzen"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => setProjection(player.id, lastYearProjection(player))}
            className="rounded p-1 text-on-surface-variant opacity-0 hover:text-primary-fixed group-hover:opacity-100"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
          <button
            type="button"
            title="Aus Kader entfernen"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => removePlayerFromSquad(player.id)}
            className="rounded p-1 text-on-surface-variant opacity-0 hover:text-tertiary-fixed-dim group-hover:opacity-100"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyBenchSlot({
  position,
  isDragOver,
  onDragOverRow,
  onDragLeaveRow,
  onDropRow,
}: {
  position: Position;
  isDragOver: boolean;
  onDragOverRow: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragLeaveRow: () => void;
  onDropRow: (event: React.DragEvent<HTMLDivElement>) => void;
}) {
  return (
    <div
      onDragOver={onDragOverRow}
      onDragLeave={onDragLeaveRow}
      onDrop={onDropRow}
      className={`flex items-center gap-2 rounded-lg border border-dashed px-1.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-on-surface-variant/50 transition-colors ${
        isDragOver ? "border-brand-pink/70 ring-2 ring-brand-pink/70" : "border-outline-variant/25"
      }`}
    >
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-dashed border-outline-variant/30 text-[9px] font-bold">
        {position}
      </div>
      <span>Leerer Platz</span>
    </div>
  );
}

export function BankPanel() {
  const tab = useActiveTab();
  const players = useOrchestratorStore((s) => s.players);
  const metrics = useSquadMetrics();
  const moveSquadSlot = useOrchestratorStore((s) => s.moveSquadSlot);
  const assignPlayerToSlot = useOrchestratorStore((s) => s.assignPlayerToSlot);
  const activeDrag = useActiveDrag();
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const benchPositions = benchSlotPositions(tab.formation);
  const slotsByPosition: Record<Position, number[]> = { TOR: [], ABW: [], MIT: [], STU: [] };
  benchPositions.forEach((pos, index) => slotsByPosition[pos].push(index));

  const resolve = (id: string | null) => (id ? players.find((p) => p.id === id) ?? null : null);

  const dropHandlers = (slot: number, slotPos: Position) => ({
    onDragOverRow: (event: React.DragEvent<HTMLDivElement>) => {
      if (allowDrop(event, slotPos)) setDragOverIndex(slot);
    },
    onDragLeaveRow: () => setDragOverIndex((cur) => (cur === slot ? null : cur)),
    onDropRow: (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setDragOverIndex(null);
      const source = readDragPayload(event);
      clearDrag();
      if (!source) return;
      if (source.kind === "pool") {
        assignPlayerToSlot(source.playerId, { area: "bench", index: slot });
      } else {
        moveSquadSlot({ area: source.area, index: source.index }, { area: "bench", index: slot });
      }
    },
  });

  const hasAnyPlayer = tab.bench.some((id) => !!id);

  return (
    <div className="glass-panel flex h-full min-h-0 w-full flex-col gap-3 rounded-xl p-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-on-surface">
          Bank
        </h3>
        <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
          {metrics.benchReviewedCount} / {metrics.benchCount} bewertet
        </span>
      </div>

      <div className="min-h-0 space-y-2 overflow-auto pr-1">
        {GROUP_ORDER.map((pos) => {
          const slots = slotsByPosition[pos];
          if (slots.length === 0) return null;
          return (
            <div key={pos} className="space-y-0.5">
              <div className="px-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-on-surface-variant/70">
                {POSITION_LABELS[pos]}
              </div>
              {slots.map((slot) => {
                const player = resolve(tab.bench[slot]);
                const { onDragOverRow, onDragLeaveRow, onDropRow } = dropHandlers(slot, pos);
                const dropReady = !!activeDrag && activeDrag.position === pos;
                if (!player) {
                  return (
                    <EmptyBenchSlot
                      key={slot}
                      position={pos}
                      isDragOver={dragOverIndex === slot || dropReady}
                      onDragOverRow={onDragOverRow}
                      onDragLeaveRow={onDragLeaveRow}
                      onDropRow={onDropRow}
                    />
                  );
                }
                return (
                  <BankRow
                    key={slot}
                    player={player}
                    slotIndex={slot}
                    isDragOver={dragOverIndex === slot || dropReady}
                    onDragStartRow={(event) => {
                      writeDragSlot(event, {
                        area: "bench",
                        index: slot,
                        playerId: player.id,
                        position: player.position,
                      });
                    }}
                    onDragEndRow={() => {
                      clearDrag();
                      setDragOverIndex(null);
                    }}
                    onDragOverRow={onDragOverRow}
                    onDragLeaveRow={onDragLeaveRow}
                    onDropRow={onDropRow}
                  />
                );
              })}
            </div>
          );
        })}

        {!hasAnyPlayer && (
          <div className="rounded-lg border border-dashed border-outline-variant/30 p-3 text-center text-xs text-on-surface-variant">
            Bank ist leer. Ziehe Spieler aus dem Feld hierher oder füge sie über den Spielerpool hinzu.
          </div>
        )}
      </div>
    </div>
  );
}
