"use client";

import { Plus, Star, X } from "lucide-react";
import { useOrchestratorStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function SquadTabs() {
  const tabs = useOrchestratorStore((s) => s.tabs);
  const activeTabId = useOrchestratorStore((s) => s.activeTabId);
  const setActiveTab = useOrchestratorStore((s) => s.setActiveTab);
  const addTab = useOrchestratorStore((s) => s.addTab);
  const removeTab = useOrchestratorStore((s) => s.removeTab);
  const setStarRating = useOrchestratorStore((s) => s.setStarRating);

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-2 rounded-xl bg-surface-container-low p-1">
        {tabs.map((tab) => {
          const active = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-col items-start rounded-lg px-5 py-2 transition-colors",
                active
                  ? "border border-primary-container/30 bg-primary-container/10 text-primary-fixed"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              )}
            >
              <span className="flex w-full items-center justify-between gap-2">
                <span className="font-mono text-[12px] uppercase tracking-wider">
                  {tab.label}
                </span>
                <button
                  type="button"
                  aria-label={`${tab.label} löschen`}
                  title="Variante löschen"
                  disabled={tabs.length <= 1}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTab(tab.id);
                  }}
                  className="rounded p-0.5 text-on-surface-variant/70 hover:text-tertiary-fixed-dim disabled:opacity-30"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
              <span
                className="mt-1 flex gap-0.5"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                role="group"
                aria-label={`Sterne für ${tab.label}`}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-label={`${n} Sterne`}
                    onClick={() =>
                      setStarRating(tab.id, tab.starRating === n ? 0 : n)
                    }
                    className="p-0.5"
                  >
                    <Star
                      className={cn(
                        "h-3 w-3",
                        n <= tab.starRating
                          ? "fill-primary-fixed-dim text-primary-fixed-dim"
                          : "text-outline-variant"
                      )}
                    />
                  </button>
                ))}
              </span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={addTab}
          className="rounded-lg px-3 py-2 text-on-surface-variant hover:bg-surface-container-high hover:text-primary-fixed"
          aria-label="Neuer Tab"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
