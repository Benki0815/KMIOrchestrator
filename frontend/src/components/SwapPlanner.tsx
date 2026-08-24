"use client";

import { X } from "lucide-react";
import { useActiveTab, useOrchestratorStore, useSquadMetrics } from "@/lib/store";
import { projectionPoints } from "@/lib/scoring";
import type { Player, SquadTab, VariantId } from "@/lib/types";
import { POSITION_LABELS, VARIANT_IDS } from "@/lib/types";
import { formatMio } from "@/lib/utils";

function pointsFor(playerId: string, tab: SquadTab, players: Player[]): number {
  const player = players.find((p) => p.id === playerId);
  if (!player) return 0;
  const projection = tab.projections[player.id] ?? player.baselineProjection;
  if (!projection) return 0;
  return projectionPoints(player.position, projection);
}

export function BudgetPanel() {
  const tab = useActiveTab();
  const players = useOrchestratorStore((s) => s.players);
  const metrics = useSquadMetrics();

  const swapOutPlayers = tab.swapOutIds
    .map((id) => players.find((p) => p.id === id))
    .filter((p): p is Player => !!p);
  const freedByVerkauf = swapOutPlayers.reduce((sum, p) => sum + p.marketValue, 0);
  const available = metrics.remaining + freedByVerkauf;

  return (
    <div className="glass-panel flex w-full flex-col gap-4 rounded-xl p-4">
      <h3 className="font-display text-sm font-bold uppercase tracking-wider text-on-surface">
        Mein Budget
      </h3>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
          Frei durch Verkauf
        </span>
        <span className="font-mono text-lg font-bold text-primary-fixed">
          {formatMio(freedByVerkauf)}
        </span>
      </div>
      <div className="flex items-center justify-between border-t border-outline-variant/10 pt-3">
        <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
          Restbudget
        </span>
        <span className="font-mono text-lg text-on-surface">{formatMio(metrics.remaining)}</span>
      </div>
      <div className="rounded-lg border border-brand-amber/30 bg-brand-amber/10 p-3">
        <div className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
          Verfügbar
        </div>
        <div className="font-mono text-3xl font-black text-brand-amber">{formatMio(available)}</div>
      </div>
      <p className="font-mono text-[11px] text-on-surface-variant">
        Bis zu {formatMio(available)} für {tab.swapOutIds.length || 0} Zugänge.
      </p>
    </div>
  );
}

function VariantColumn({ variant }: { variant: VariantId }) {
  const tab = useActiveTab();
  const players = useOrchestratorStore((s) => s.players);
  const metrics = useSquadMetrics();
  const openAlternativePicker = useOrchestratorStore((s) => s.openAlternativePicker);
  const setVariantSwapIn = useOrchestratorStore((s) => s.setVariantSwapIn);
  const commitVariant = useOrchestratorStore((s) => s.commitVariant);

  const swapOutPlayers = tab.swapOutIds
    .map((id) => players.find((p) => p.id === id))
    .filter((p): p is Player => !!p);
  const picks = tab.swapVariants[variant] ?? {};
  const setCount = swapOutPlayers.filter((p) => picks[p.id]).length;

  const freedByVerkauf = swapOutPlayers.reduce((sum, p) => sum + p.marketValue, 0);
  const availableTotal = metrics.remaining + freedByVerkauf;
  const cost = swapOutPlayers.reduce((sum, p) => {
    const inId = picks[p.id];
    const inPlayer = inId ? players.find((x) => x.id === inId) : null;
    return sum + (inPlayer?.marketValue ?? 0);
  }, 0);
  const rest = availableTotal - cost;
  const mehrpunkte = swapOutPlayers.reduce((sum, p) => {
    const inId = picks[p.id];
    if (!inId) return sum;
    return sum + (pointsFor(inId, tab, players) - pointsFor(p.id, tab, players));
  }, 0);

  const firstOpen = swapOutPlayers.find((p) => !picks[p.id]);
  const canApply = setCount > 0 && rest >= 0;

  return (
    <div className="flex min-w-[240px] flex-1 flex-col gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-low p-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-black uppercase tracking-wider text-on-surface">
          Variante {variant}
        </span>
        <span
          className={`font-mono text-[10px] font-bold uppercase ${
            setCount > 0 ? "text-primary-fixed" : "text-on-surface-variant"
          }`}
        >
          {setCount === 0 ? "offen" : `${setCount} von ${swapOutPlayers.length} gesetzt`}
        </span>
      </div>

      <div className="flex-1 space-y-2">
        {swapOutPlayers.map((outPlayer) => {
          const inId = picks[outPlayer.id];
          const inPlayer = inId ? players.find((p) => p.id === inId) : null;
          return (
            <div key={outPlayer.id} className="rounded-lg border border-outline-variant/15 bg-surface-container p-2">
              <div className="mb-1 font-mono text-[10px] text-on-surface-variant">
                statt {outPlayer.shortName}
                {tab.bench.includes(outPlayer.id) ? " (Bank)" : ""} · {formatMio(outPlayer.marketValue)}
              </div>
              {inPlayer ? (
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => openAlternativePicker(variant, outPlayer.id)}
                    className="min-w-0 flex-1 text-left"
                    title="Andere Alternative wählen"
                  >
                    <div className="text-sm font-semibold text-brand-pink">{inPlayer.shortName}</div>
                    <div className="font-mono text-[10px] text-on-surface-variant">
                      {inPlayer.club} · {formatMio(inPlayer.marketValue)}
                    </div>
                  </button>
                  <div className="flex items-center gap-1">
                    <span className="rounded bg-primary-container/20 px-1.5 py-0.5 font-mono text-xs font-bold text-primary-fixed">
                      {pointsFor(inPlayer.id, tab, players)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setVariantSwapIn(variant, outPlayer.id, null)}
                      className="rounded p-1 text-on-surface-variant hover:text-tertiary-fixed-dim"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => openAlternativePicker(variant, outPlayer.id)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <div>
                    <div className="text-sm font-semibold text-on-surface-variant">Alternative</div>
                    <div className="font-mono text-[10px] text-on-surface-variant">
                      {POSITION_LABELS[outPlayer.position]} · noch offen
                    </div>
                  </div>
                  <span className="rounded-md border border-outline-variant/30 px-2 py-1 font-mono text-[10px] font-bold uppercase text-brand-pink hover:bg-brand-pink/10">
                    Wählen
                  </span>
                </button>
              )}
            </div>
          );
        })}
        {swapOutPlayers.length === 0 && (
          <div className="rounded-lg border border-dashed border-outline-variant/30 p-3 text-center text-xs text-on-surface-variant">
            Markiere Spieler auf dem Feld oder der Bank zum Tausch.
          </div>
        )}
      </div>

      <div className="space-y-1 border-t border-outline-variant/10 pt-2">
        <div className="flex justify-between font-mono text-xs text-on-surface-variant">
          <span>Kosten</span>
          <span className="text-on-surface">{formatMio(cost)}</span>
        </div>
        <div className="flex justify-between font-mono text-xs text-on-surface-variant">
          <span>Rest</span>
          <span className={rest >= 0 ? "text-primary-fixed" : "text-tertiary-fixed-dim"}>
            {formatMio(rest)}
          </span>
        </div>
        <div className="flex justify-between font-mono text-xs text-on-surface-variant">
          <span>Mehrpunkte</span>
          <span className={mehrpunkte >= 0 ? "text-primary-fixed" : "text-tertiary-fixed-dim"}>
            {mehrpunkte >= 0 ? "+" : ""}
            {mehrpunkte}
          </span>
        </div>
      </div>

      <button
        type="button"
        disabled={swapOutPlayers.length === 0 || (setCount > 0 && rest < 0)}
        title={
          rest < 0 && setCount > 0
            ? "Variante sprengt das Budget"
            : setCount === 0
              ? "Zuerst eine Alternative wählen"
              : "Variante in den Kader übernehmen"
        }
        onClick={() => {
          if (setCount === 0) {
            if (firstOpen) openAlternativePicker(variant, firstOpen.id);
            return;
          }
          if (!canApply) return;
          commitVariant(variant);
        }}
        className={`rounded-lg py-2 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors ${
          canApply
            ? "bg-brand-pink text-white hover:bg-brand-pink-dim"
            : setCount === 0 && swapOutPlayers.length > 0
              ? "border border-brand-pink/40 bg-brand-pink/10 text-brand-pink hover:bg-brand-pink/20"
              : "cursor-not-allowed bg-surface-container-highest text-on-surface-variant/50"
        }`}
      >
        {setCount > 0 ? "Variante übernehmen" : "Alternative wählen"}
      </button>
    </div>
  );
}

export function VariantenBoard() {
  const tab = useActiveTab();
  const players = useOrchestratorStore((s) => s.players);
  const clearSwapPlan = useOrchestratorStore((s) => s.clearSwapPlan);

  const swapOutPlayers = tab.swapOutIds
    .map((id) => players.find((p) => p.id === id))
    .filter((p): p is Player => !!p);

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="glass-panel flex flex-wrap items-center gap-3 rounded-xl p-3">
        {swapOutPlayers.length === 0 && (
          <span className="px-2 py-1 text-sm text-on-surface-variant">
            Noch kein Spieler markiert — im Entwerfen-Modus über das Tausch-Icon auf Feld oder Bank markieren.
          </span>
        )}
        {swapOutPlayers.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-3 rounded-lg border border-outline-variant/20 bg-surface-container-low px-3 py-2"
          >
            <div>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-on-surface">
                {p.shortName}
                {tab.bench.includes(p.id) && (
                  <span className="rounded bg-surface-container-highest px-1 py-px font-mono text-[9px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Bank
                  </span>
                )}
              </div>
              <div className="font-mono text-[10px] text-on-surface-variant">
                {POSITION_LABELS[p.position]} · {p.club} · {formatMio(p.marketValue)}
              </div>
            </div>
            <span className="rounded bg-surface-container-highest px-2 py-1 font-mono text-sm font-bold text-primary-fixed-dim">
              {pointsFor(p.id, tab, players)} PKT
            </span>
          </div>
        ))}
        {swapOutPlayers.length > 0 && (
          <button
            type="button"
            onClick={clearSwapPlan}
            className="ml-auto rounded-lg border border-outline-variant/30 px-3 py-2 text-xs text-on-surface-variant hover:text-on-surface"
          >
            Markierungen leeren
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row">
        {VARIANT_IDS.map((v) => (
          <VariantColumn key={v} variant={v} />
        ))}
      </div>
    </div>
  );
}
