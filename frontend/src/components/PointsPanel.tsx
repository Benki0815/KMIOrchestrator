"use client";

import { useOrchestratorStore, useSquadMetrics } from "@/lib/store";
import { formatMio } from "@/lib/utils";

export function PointsPanel() {
  const metrics = useSquadMetrics();
  const pointsView = useOrchestratorStore((s) => s.pointsView);
  const setGoldenSchnittTarget = useOrchestratorStore((s) => s.setGoldenSchnittTarget);
  const budgetMax = useOrchestratorStore((s) => s.budgetMax);

  const bigPoints =
    pointsView === "saison" ? metrics.starterLastSeasonPoints : metrics.starterProjectedPoints;
  const bankPoints =
    pointsView === "saison" ? metrics.benchLastSeasonPoints : metrics.benchProjectedPoints;
  const goldenDiff = pointsView === "saison" ? metrics.goldenDiffSaison : metrics.goldenDiffPrognose;
  const progressPct = Math.min(
    100,
    Math.max(0, (bigPoints / (metrics.goldenTarget * (metrics.starterCount || 11))) * 100)
  );

  return (
    <div className="glass-panel flex h-full w-full flex-col gap-3 rounded-xl p-3">
      <div>
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
          Punkte Startelf ·{" "}
          <span className="text-brand-pink">
            {pointsView === "saison" ? "Saison 25/26" : "Prognose 26/27"}
          </span>
        </div>
        <div className="font-mono text-3xl font-black text-on-surface">
          {bigPoints.toFixed(0)} <span className="text-base text-on-surface-variant">PKT</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-outline-variant/20 bg-surface-container-low px-3 py-2">
          <div className="font-mono text-[9px] uppercase tracking-wider text-on-surface-variant">
            Saison 25/26
          </div>
          <div className="font-mono text-lg text-on-surface">
            {metrics.starterLastSeasonPoints.toFixed(0)}
          </div>
        </div>
        <div className="rounded-lg border border-outline-variant/20 bg-surface-container-low px-3 py-2">
          <div className="font-mono text-[9px] uppercase tracking-wider text-on-surface-variant">
            Prognose 26/27
          </div>
          <div className="font-mono text-lg text-brand-pink-dim">
            {metrics.starterProjectedPoints.toFixed(0)}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-outline-variant/10 pt-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
          Punkte Bank
        </span>
        <span className="font-mono text-xl text-primary-fixed-dim">{bankPoints.toFixed(0)}</span>
      </div>

      <div className="border-t border-outline-variant/10 pt-3">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
            Goldener Schnitt
          </span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={metrics.goldenTarget}
              onChange={(e) => setGoldenSchnittTarget(Number.parseFloat(e.target.value) || 0)}
              className="w-14 rounded border border-outline-variant/30 bg-surface-container-lowest px-1.5 py-0.5 text-center font-mono text-xs text-brand-pink-dim outline-none"
            />
            <span
              className={`font-mono text-sm font-bold ${
                goldenDiff >= 0 ? "text-primary-fixed" : "text-tertiary-fixed-dim"
              }`}
            >
              {goldenDiff >= 0 ? "+" : ""}
              {goldenDiff.toFixed(0)} PKT
            </span>
          </div>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-low">
          <div
            className={`h-full rounded-full ${goldenDiff >= 0 ? "bg-primary-fixed" : "bg-brand-pink"}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-outline-variant/10 pt-3 font-mono text-[11px] text-on-surface-variant">
        <span>
          Bewertet{" "}
          <span className="text-on-surface">
            {metrics.reviewedCount}/{metrics.count}
          </span>
        </span>
        <span>
          Budget{" "}
          <span className="text-brand-amber">
            {formatMio(metrics.remaining)}
          </span>{" "}
          frei
        </span>
      </div>
      <div className="font-mono text-[10px] text-on-surface-variant">
        von {formatMio(budgetMax)} Gesamtbudget
      </div>
    </div>
  );
}
