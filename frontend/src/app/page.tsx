"use client";

import { TopNav } from "@/components/TopNav";
import { SquadTabs } from "@/components/SquadTabs";
import { PitchView } from "@/components/PitchView";
import { PointsPanel } from "@/components/PointsPanel";
import { BankPanel } from "@/components/BankPanel";
import { PlayerPoolPanel } from "@/components/PlayerPoolPanel";
import { DashboardPanel } from "@/components/DashboardPanel";
import { PlayersTablePanel } from "@/components/PlayersTablePanel";
import { TeamsPanel } from "@/components/TeamsPanel";
import { LogPanel } from "@/components/LogPanel";
import { PlayerForecastModal } from "@/components/PlayerForecastModal";
import { AlternativePickerModal } from "@/components/AlternativePickerModal";
import { BudgetPanel, VariantenBoard } from "@/components/SwapPlanner";
import { FazitPanel, RausReinBoard } from "@/components/PresentationBoard";
import { Footer } from "@/components/Footer";
import { useOrchestratorStore } from "@/lib/store";

export default function DraftRoomPage() {
  const portalMode = useOrchestratorStore((s) => s.portalMode);
  return (
    <>
      <TopNav />
      <main className="w-full px-4 pb-10 pt-[74px] lg:px-6">
        {portalMode !== "dashboard" &&
          portalMode !== "players" &&
          portalMode !== "teams" &&
          portalMode !== "logs" && (
          <div className="mb-3">
            <SquadTabs />
          </div>
        )}
        {portalMode === "dashboard" && <DashboardPanel />}
        {portalMode === "players" && (
          <div className="lg:h-[calc(100vh-156px)]">
            <PlayersTablePanel />
          </div>
        )}
        {portalMode === "teams" && (
          <div className="lg:h-[calc(100vh-156px)]">
            <TeamsPanel />
          </div>
        )}
        {portalMode === "logs" && (
          <div className="lg:h-[calc(100vh-156px)]">
            <LogPanel />
          </div>
        )}
        {portalMode === "bewerten" && (
          <div className="flex min-h-0 flex-col gap-3 lg:grid lg:h-[calc(100vh-156px)] lg:grid-cols-[220px_520px_300px_minmax(520px,1fr)]">
            <div className="min-h-0 w-full lg:h-full">
              <PointsPanel />
            </div>
            <div className="min-h-0 min-w-0 lg:h-full">
              <PitchView />
            </div>
            <div className="min-h-0 min-w-0 lg:h-full">
              <BankPanel />
            </div>
            <div className="min-h-0 min-w-0 lg:h-full">
              <PlayerPoolPanel />
            </div>
          </div>
        )}
        {portalMode === "tauschen" && (
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="w-full lg:w-[260px]">
              <BudgetPanel />
            </div>
            <div className="min-w-0 flex-1">
              <VariantenBoard />
            </div>
          </div>
        )}
        {portalMode === "praesentieren" && (
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="w-full lg:w-[260px]">
              <FazitPanel />
            </div>
            <div className="min-w-0 flex-1">
              <RausReinBoard />
            </div>
          </div>
        )}
      </main>
      <PlayerForecastModal />
      <AlternativePickerModal />
      <Footer />
    </>
  );
}
