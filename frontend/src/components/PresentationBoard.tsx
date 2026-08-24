"use client";

import { useActiveTab, useOrchestratorStore, useSquadMetrics } from "@/lib/store";
import { projectionPoints } from "@/lib/scoring";
import { formatMio } from "@/lib/utils";

function useSwapPairs() {
  const tab = useActiveTab();
  const players = useOrchestratorStore((s) => s.players);
  return tab.swapOutIds
    .map((outId) => {
      const outPlayer = players.find((p) => p.id === outId);
      const inId = tab.swapInByOut[outId];
      const inPlayer = players.find((p) => p.id === inId);
      if (!outPlayer || !inPlayer) return null;
      const outProjection = tab.projections[outPlayer.id] ?? outPlayer.baselineProjection;
      const inProjection = tab.projections[inPlayer.id] ?? inPlayer.baselineProjection;
      const outPoints = outProjection ? projectionPoints(outPlayer.position, outProjection) : 0;
      const inPoints = inProjection ? projectionPoints(inPlayer.position, inProjection) : 0;
      return { outPlayer, inPlayer, outPoints, inPoints };
    })
    .filter((x): x is NonNullable<typeof x> => !!x);
}

export function FazitPanel() {
  const swapPairs = useSwapPairs();
  const deltaPoints = swapPairs.reduce((sum, pair) => sum + (pair.inPoints - pair.outPoints), 0);
  const positive = deltaPoints >= 0;

  return (
    <div className="glass-panel flex w-full flex-col gap-3 rounded-xl p-4">
      <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
        Mein Fazit
      </div>
      <div
        className={`font-mono text-5xl font-black ${
          positive ? "text-primary-fixed" : "text-tertiary-fixed-dim"
        }`}
      >
        {positive ? "+" : ""}
        {deltaPoints}
      </div>
      <div className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant">
        Punkte-Differenz
      </div>
      <div className="border-t border-outline-variant/10 pt-3">
        <div className="font-display text-sm font-bold uppercase leading-snug text-on-surface">
          {swapPairs.length === 0
            ? "Noch keine Wechsel geplant"
            : `Diese ${swapPairs.length} Wechsel machen das Team ${positive ? "stärker" : "schwächer"}`}
        </div>
        <p className="mt-1 text-xs text-on-surface-variant">
          {swapPairs.length} Wechsel · Basis: Punkte 25/26 gegen deine Prognose 26/27
        </p>
      </div>
    </div>
  );
}

export function RausReinBoard() {
  const tab = useActiveTab();
  const metrics = useSquadMetrics();
  const applySwapPlan = useOrchestratorStore((s) => s.applySwapPlan);
  const swapPairs = useSwapPairs();

  const sumOut = swapPairs.reduce((sum, pair) => sum + pair.outPlayer.marketValue, 0);
  const sumIn = swapPairs.reduce((sum, pair) => sum + pair.inPlayer.marketValue, 0);
  const restBudget = metrics.remaining + sumOut - sumIn;
  const teamValueNew = metrics.spent - sumOut + sumIn;
  const starterIds = new Set(tab.starters.filter((id): id is string => !!id));
  const starterDelta = swapPairs.reduce(
    (sum, pair) => (starterIds.has(pair.outPlayer.id) ? sum + (pair.inPoints - pair.outPoints) : sum),
    0
  );
  const starterPointsNew = metrics.starterProjectedPoints + starterDelta;

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-tertiary-fixed-dim/30 bg-tertiary-fixed-dim/10 p-3">
          <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-wider text-tertiary-fixed-dim">
            Raus
          </div>
          <div className="space-y-2">
            {swapPairs.map((pair) => (
              <div
                key={pair.outPlayer.id}
                className="flex items-center justify-between rounded-md bg-background/30 px-3 py-2"
              >
                <div>
                  <div className="text-sm font-semibold text-on-surface">{pair.outPlayer.shortName}</div>
                  <div className="font-mono text-[10px] text-on-surface-variant">
                    {formatMio(pair.outPlayer.marketValue)}
                  </div>
                </div>
                <span className="font-mono text-sm font-bold text-tertiary-fixed-dim">
                  {pair.outPoints}
                </span>
              </div>
            ))}
            {swapPairs.length === 0 && (
              <div className="text-sm text-on-surface-variant">Keine Spieler markiert.</div>
            )}
          </div>
          <div className="mt-2 flex justify-between border-t border-outline-variant/10 pt-2 font-mono text-xs text-on-surface-variant">
            <span>Summe</span>
            <span className="text-on-surface">
              {swapPairs.reduce((sum, p) => sum + p.outPoints, 0)}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-primary-container/30 bg-primary-container/10 p-3">
          <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-wider text-primary-fixed">
            Rein
          </div>
          <div className="space-y-2">
            {swapPairs.map((pair) => (
              <div
                key={pair.inPlayer.id}
                className="flex items-center justify-between rounded-md bg-background/30 px-3 py-2"
              >
                <div>
                  <div className="text-sm font-semibold text-on-surface">{pair.inPlayer.shortName}</div>
                  <div className="font-mono text-[10px] text-on-surface-variant">
                    {formatMio(pair.inPlayer.marketValue)}
                  </div>
                </div>
                <span className="font-mono text-sm font-bold text-primary-fixed">{pair.inPoints}</span>
              </div>
            ))}
            {swapPairs.length === 0 && (
              <div className="text-sm text-on-surface-variant">Noch keine Alternativen gewählt.</div>
            )}
          </div>
          <div className="mt-2 flex justify-between border-t border-outline-variant/10 pt-2 font-mono text-xs text-on-surface-variant">
            <span>Summe</span>
            <span className="text-on-surface">
              {swapPairs.reduce((sum, p) => sum + p.inPoints, 0)}
            </span>
          </div>
        </div>
      </div>

      <div className="glass-panel flex flex-wrap items-center justify-between gap-4 rounded-xl p-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
            Teamwert neu
          </div>
          <div className="font-mono text-lg font-bold text-brand-amber">{formatMio(teamValueNew)}</div>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
            Budget frei
          </div>
          <div
            className={`font-mono text-lg font-bold ${
              restBudget >= 0 ? "text-primary-fixed" : "text-tertiary-fixed-dim"
            }`}
          >
            {formatMio(restBudget)}
          </div>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
            Startelf neu
          </div>
          <div className="font-mono text-lg font-bold text-on-surface">
            {starterPointsNew.toFixed(0)}
          </div>
        </div>
        <button
          type="button"
          onClick={applySwapPlan}
          disabled={swapPairs.length === 0}
          className={`rounded-lg px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider transition-colors ${
            swapPairs.length > 0
              ? "bg-brand-pink text-white shadow-[0_0_16px_rgba(232,20,60,0.4)] hover:bg-brand-pink-dim"
              : "cursor-not-allowed bg-surface-container-highest text-on-surface-variant/50"
          }`}
        >
          Kader übernehmen
        </button>
      </div>
    </div>
  );
}
