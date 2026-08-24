"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useOrchestratorStore } from "@/lib/store";
import { api } from "@/lib/api";

/** Rehydrate persist after mount so SSR and first client paint stay in sync. */
export function StoreProvider({ children }: { children: ReactNode }) {
  const initializeFromApi = useOrchestratorStore((s) => s.initializeFromApi);
  const setSaveStatus = useOrchestratorStore((s) => s.setSaveStatus);
  const tabs = useOrchestratorStore((s) => s.tabs);
  const activeTabId = useOrchestratorStore((s) => s.activeTabId);
  const budgetMax = useOrchestratorStore((s) => s.budgetMax);
  const updatedAt = useOrchestratorStore((s) => s.updatedAt);
  const portalMode = useOrchestratorStore((s) => s.portalMode);
  const remoteLoaded = useOrchestratorStore((s) => s.remoteLoaded);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    void useOrchestratorStore.persist.rehydrate();
    void initializeFromApi();
  }, [initializeFromApi]);

  useEffect(() => {
    if (!remoteLoaded) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        setSaveStatus("saving");
        await api.saveSquad({ tabs, activeTabId, budgetMax, updatedAt, portalMode });
        setSaveStatus("saved");
      } catch (error) {
        setSaveStatus("error", error instanceof Error ? error.message : String(error));
      }
    }, 700);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [tabs, activeTabId, budgetMax, updatedAt, portalMode, remoteLoaded, setSaveStatus]);

  return <>{children}</>;
}
