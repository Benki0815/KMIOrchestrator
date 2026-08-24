"use client";

import { Check } from "lucide-react";
import { useActiveTab, useOrchestratorStore, useSquadMetrics } from "@/lib/store";
import { cn } from "@/lib/utils";
import { formatMio } from "@/lib/utils";
import type { PointsView, PortalMode } from "@/lib/types";
import { APP_VERSION } from "@/lib/version";

// "praesentieren" ist bewusst ausgeblendet (aktuell keine Verwendung), Code/Route bleiben erhalten.
const MODES: Array<{ id: PortalMode; label: string }> = [
  { id: "dashboard", label: "Dashboard" },
  { id: "bewerten", label: "Entwerfen" },
  { id: "tauschen", label: "Tauschen" },
  { id: "players", label: "Players Table" },
  { id: "teams", label: "Teams" },
  { id: "logs", label: "Log" },
];

export function TopNav() {
  const mode = useOrchestratorStore((s) => s.portalMode);
  const setPortalMode = useOrchestratorStore((s) => s.setPortalMode);
  const pointsView = useOrchestratorStore((s) => s.pointsView);
  const setPointsView = useOrchestratorStore((s) => s.setPointsView);
  const saveStatus = useOrchestratorStore((s) => s.saveStatus);
  const budgetMax = useOrchestratorStore((s) => s.budgetMax);
  const metrics = useSquadMetrics();
  const tab = useActiveTab();
  const swapCount = tab.swapOutIds.length;

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-outline-variant/30 bg-background/90 shadow-cyan-strong backdrop-blur-xl">
      <div className="flex h-16 w-full items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-6">
          <span className="font-display text-lg font-black uppercase tracking-tight text-on-surface">
            Kicker <span className="text-brand-pink">Orchestrator</span>
            <span className="ml-2 text-[10px] font-mono font-normal text-on-surface-variant">
              {APP_VERSION}
            </span>
          </span>
          <div className="flex items-center gap-1.5">
            {MODES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setPortalMode(item.id)}
                className={cn(
                  "rounded-full px-4 py-1.5 font-mono text-[12px] font-bold uppercase tracking-wider transition-colors",
                  mode === item.id
                    ? "bg-brand-pink text-white shadow-[0_0_16px_rgba(232,20,60,0.5)]"
                    : "text-on-surface-variant hover:text-on-surface"
                )}
              >
                {item.label}
                {item.id === "tauschen" && swapCount > 0 ? ` · ${swapCount}` : ""}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 rounded-lg border border-outline-variant/30 bg-surface-container-low px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider md:flex">
            <span className="text-on-surface-variant">
              Budget
              <span className="ml-1 text-on-surface">{formatMio(budgetMax)}</span>
            </span>
            <span className="text-on-surface-variant">
              Eingesetzt
              <span className="ml-1 text-on-surface">{formatMio(metrics.spent)}</span>
            </span>
            <span className="text-on-surface-variant">
              Frei
              <span className={`ml-1 font-bold ${metrics.remaining >= 0 ? "text-primary-fixed-dim" : "text-tertiary-fixed-dim"}`}>
                {metrics.remaining >= 0 ? "+" : ""}
                {formatMio(metrics.remaining)}
              </span>
            </span>
          </div>
          <span className="hidden items-center gap-1.5 rounded-lg border border-outline-variant/30 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-on-surface-variant md:flex">
            {saveStatus === "saving" ? (
              "Speichert…"
            ) : (
              <>
                <Check className="h-3.5 w-3.5 text-primary-fixed-dim" />
                Auto-Save
              </>
            )}
          </span>
          <ViewToggle value={pointsView} onChange={setPointsView} />
        </div>
      </div>
    </nav>
  );
}

function ViewToggle({
  value,
  onChange,
}: {
  value: PointsView;
  onChange: (v: PointsView) => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-outline-variant/30 bg-surface-container-low p-1">
      {(
        [
          { id: "prognose" as PointsView, label: "Prognose 26/27" },
          { id: "saison" as PointsView, label: "Saison 25/26" },
        ]
      ).map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={cn(
            "rounded-full px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors",
            value === item.id
              ? "bg-brand-pink text-white"
              : "text-on-surface-variant hover:text-on-surface"
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
