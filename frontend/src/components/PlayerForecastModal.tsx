"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { useActiveTab, useOrchestratorStore } from "@/lib/store";
import {
  gradePointsPerGame,
  MAX_MATCHES_PER_SEASON,
  playerGoldenTarget,
  pointsBreakdown,
  projectionFieldMax,
  projectionPoints,
  projectionsEqual,
  sanitizeProjection,
} from "@/lib/scoring";
import type { PlayerProjection, Position } from "@/lib/types";
import { POSITION_GOAL_POINTS, POSITION_LABELS } from "@/lib/types";
import { formatMio } from "@/lib/utils";

const INT_FIELDS: Array<{ key: keyof PlayerProjection; label: string; hint: (pos: Position) => string }> = [
  { key: "starts", label: "Startelf-Einsätze", hint: () => `4 PKT · max ${MAX_MATCHES_PER_SEASON}` },
  { key: "subApps", label: "Einwechslungen", hint: () => "2 PKT · Restspiele" },
  { key: "ratedGames", label: "Benotete Spiele", hint: () => "max = Einsätze gesamt" },
  { key: "goals", label: "Tore", hint: (pos) => `${POSITION_GOAL_POINTS[pos]} PKT` },
  { key: "assists", label: "Vorlagen", hint: () => "2 PKT" },
  { key: "motm", label: "Spieler des Spiels", hint: () => "3 PKT" },
  { key: "yellowRed", label: "Gelb-Rot", hint: () => "-3 PKT" },
  { key: "redCards", label: "Rote Karten", hint: () => "-6 PKT" },
];

const BREAKDOWN_ROWS: Array<{
  key: keyof ReturnType<typeof pointsBreakdown>;
  label: string;
  color: string;
  onlyGk?: boolean;
}> = [
  { key: "starts", label: "Startelf", color: "bg-sky-400" },
  { key: "subApps", label: "Einwechslungen", color: "bg-sky-600" },
  { key: "notePoints", label: "Noten", color: "bg-pink-400" },
  { key: "goals", label: "Tore", color: "bg-emerald-400" },
  { key: "assists", label: "Vorlagen", color: "bg-emerald-600" },
  { key: "motm", label: "Spieler des Spiels", color: "bg-amber-400" },
  { key: "cards", label: "Karten", color: "bg-tertiary-fixed-dim" },
  { key: "cleanSheets", label: "Zu null", color: "bg-cyan-400", onlyGk: true },
];

function Stepper({
  label,
  hint,
  value,
  onChange,
  min = 0,
  max = 99,
  step = 1,
}: {
  label: string;
  hint: string;
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div className="rounded-lg border border-outline-variant/20 bg-surface-container-low px-3 py-2">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs text-on-surface">{label}</span>
        <span className="font-mono text-[10px] text-on-surface-variant">{hint}</span>
      </div>
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - step))}
          className="h-7 w-7 rounded bg-surface-container-high text-on-surface hover:text-brand-pink"
        >
          −
        </button>
        <span className="w-10 text-center font-mono text-sm font-bold">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + step))}
          className="h-7 w-7 rounded bg-surface-container-high text-on-surface hover:text-brand-pink"
        >
          +
        </button>
      </div>
    </div>
  );
}

export function PlayerForecastModal() {
  const selectedPlayerId = useOrchestratorStore((s) => s.selectedPlayerId);
  const players = useOrchestratorStore((s) => s.players);
  const close = useOrchestratorStore((s) => s.closePlayerModal);
  const acceptProjection = useOrchestratorStore((s) => s.acceptProjection);
  const removePlayerAndClose = useOrchestratorStore((s) => s.removePlayerAndClose);
  const picker = useOrchestratorStore((s) => s.alternativePicker);
  const setVariantSwapIn = useOrchestratorStore((s) => s.setVariantSwapIn);
  const closeAlternativePicker = useOrchestratorStore((s) => s.closeAlternativePicker);
  const activeTab = useActiveTab();

  const player = selectedPlayerId
    ? players.find((p) => p.id === selectedPlayerId) ?? null
    : null;

  const fallbackProjection: PlayerProjection = useMemo(
    () => ({
      starts: 0,
      subApps: 0,
      ratedGames: 0,
      goals: 0,
      assists: 0,
      motm: 0,
      yellowRed: 0,
      redCards: 0,
      cleanSheets: 0,
      avgGrade: 3.5,
    }),
    []
  );

  const baseline: PlayerProjection = useMemo(() => {
    if (!player) return fallbackProjection;
    return sanitizeProjection(player.position, player.baselineProjection ?? {
      starts: player.appearancesLastSeason ?? 0,
      subApps: 0,
      ratedGames: player.appearancesLastSeason ?? 0,
      goals: player.goalsLastSeason ?? 0,
      assists: player.assistsLastSeason ?? 0,
      motm: 0,
      yellowRed: 0,
      redCards: 0,
      cleanSheets: 0,
      avgGrade: player.averageGrade ?? 3.5,
    });
  }, [fallbackProjection, player]);

  const projection = useMemo(() => {
    if (!player) return fallbackProjection;
    return sanitizeProjection(
      player.position,
      activeTab.projections[player.id] ?? baseline
    );
  }, [activeTab.projections, baseline, fallbackProjection, player]);

  const [draft, setDraft] = useState<PlayerProjection>(projection);
  useEffect(() => {
    setDraft(projection);
  }, [projection, selectedPlayerId, activeTab.id]);

  if (!selectedPlayerId || !player) return null;

  // Solange sich am Entwurf nichts geaendert hat, gibt es nichts zu "uebernehmen" -
  // Schliessen bietet die Uebernehmen/Verwerfen-Wahl deshalb nur bei echten Aenderungen an
  // (User-Feedback 24.08.2026: Regler passen die Prognose schon live an, ein separater
  // "Einschätzung übernehmen"-Button war damit doppelt/verwirrend).
  const hasUnsavedChanges = !projectionsEqual(draft, projection);

  const points = projectionPoints(player.position, draft);
  const breakdown = pointsBreakdown(player.position, draft);
  const baselineBreakdown = pointsBreakdown(player.position, baseline);
  const goldenTarget = playerGoldenTarget(player.position);
  const goldenDelta = points - goldenTarget;
  const isGk = player.position === "TOR";
  const noLeagueGrades = !player.leagueTag && !player.averageGrade;
  const pickingForVariant = !!picker && player.id !== picker.swapOutId;
  const maxBar = Math.max(
    1,
    ...BREAKDOWN_ROWS.map((r) => Math.abs(baselineBreakdown[r.key] as number))
  );

  return (
    <div className="fixed inset-0 z-[120] overflow-y-auto bg-background/70 backdrop-blur-sm">
      <div className="mx-auto my-10 w-[min(1040px,94vw)] rounded-2xl border border-outline-variant/30 bg-surface-container p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-container-highest font-mono text-xs text-on-surface-variant">
              {player.clubCode}
            </div>
            <div>
              <h3 className="font-display text-2xl font-black text-on-surface">
                {player.shortName.toUpperCase()}
              </h3>
              <p className="text-sm text-on-surface-variant">
                {POSITION_LABELS[player.position]} · {player.club} · {formatMio(player.marketValue)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            className="rounded-full p-2 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
            aria-label="Schliessen"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.15fr]">
          {/* Left: last season facts */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {player.leagueTag === "2. BUNDESLIGA" ? (
                <span className="rounded-full border border-brand-amber/40 bg-brand-amber/10 px-3 py-1 font-mono text-[11px] font-bold text-brand-amber">
                  ! 2. BUNDESLIGA
                </span>
              ) : player.leagueTag ? (
                <span className="rounded-full border border-primary-fixed/40 bg-primary-fixed/10 px-3 py-1 font-mono text-[11px] font-bold text-primary-fixed">
                  ✓ {player.leagueTag}
                </span>
              ) : (
                <span className="rounded-full border border-tertiary-fixed-dim/40 bg-tertiary-fixed-dim/10 px-3 py-1 font-mono text-[11px] font-bold text-tertiary-fixed-dim">
                  ! AUSLAND / UNBEKANNT
                </span>
              )}
              {typeof player.sofascoreSeasonRating === "number" && (
                <span className="rounded-full border border-outline-variant/30 bg-surface-container-low px-3 py-1 font-mono text-[11px] font-bold text-sky-300">
                  SofaScore {player.sofascoreSeasonRating.toFixed(2)}
                </span>
              )}
            </div>

            {noLeagueGrades && (
              <div className="rounded-lg border border-brand-amber/30 bg-brand-amber/10 p-3 text-xs text-on-surface">
                Kein kicker-Notensystem in dieser Liga — die Vorsaison hat deshalb 0 benotete Spiele.
                Für die Prognose 26/27 kannst du Benotete Spiele und Notenschnitt trotzdem frei setzen.
              </div>
            )}

            <div>
              <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                Saison 25/26 · So kamen die Punkte
              </div>
              <div className="space-y-1.5">
                {BREAKDOWN_ROWS.filter((r) => !r.onlyGk || isGk).map((row) => {
                  const value = baselineBreakdown[row.key] as number;
                  const width = Math.max(4, (Math.abs(value) / maxBar) * 100);
                  return (
                    <div key={row.key} className="flex items-center gap-2">
                      <span className="w-32 shrink-0 text-xs text-on-surface-variant">{row.label}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-container-low">
                        <div className={`h-full rounded-full ${row.color}`} style={{ width: `${width}%` }} />
                      </div>
                      <span
                        className={`w-12 shrink-0 text-right font-mono text-xs font-bold ${
                          value >= 0 ? "text-primary-fixed" : "text-tertiary-fixed-dim"
                        }`}
                      >
                        {value >= 0 ? "+" : ""}
                        {value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-3">
              <span className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant">
                Gesamt 25/26
              </span>
              <span className="font-mono text-2xl font-black text-on-surface">
                {player.pointsLastSeason ?? 0}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg border border-outline-variant/20 bg-surface-container-low p-2 text-center">
                <div className="font-mono text-[9px] uppercase text-on-surface-variant">Startelf</div>
                <div className="font-mono text-lg font-bold text-on-surface">
                  {player.appearancesLastSeason ?? 0}
                </div>
              </div>
              <div className="rounded-lg border border-outline-variant/20 bg-surface-container-low p-2 text-center">
                <div className="font-mono text-[9px] uppercase text-on-surface-variant">Einw.</div>
                <div className="font-mono text-lg font-bold text-on-surface">0</div>
              </div>
              <div className="rounded-lg border border-outline-variant/20 bg-surface-container-low p-2 text-center">
                <div className="font-mono text-[9px] uppercase text-on-surface-variant">Note</div>
                <div className="font-mono text-lg font-bold text-on-surface">
                  {player.averageGrade ? player.averageGrade.toFixed(2) : "–"}
                </div>
              </div>
            </div>

            {(player.mentions ?? []).length > 0 && (
              <div className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-3">
                <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
                  Scout-Notizen
                  {player.agentLabel ? ` · ${player.agentLabel}` : ""}
                </div>
                <div className="max-h-32 space-y-2 overflow-y-auto pr-1">
                  {(player.mentions ?? []).slice(0, 5).map((m, idx) => (
                    <div key={idx} className="rounded-md border border-outline-variant/10 bg-background/30 p-2 text-xs">
                      <div className="text-on-surface-variant">
                        {m.source_name} · {m.published} · {m.sentiment}
                      </div>
                      <div className="mt-1 text-on-surface">{m.quote ?? m.rating_label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: prognosis inputs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-brand-pink">
                Deine Prognose 26/27
              </div>
              <div className="font-mono text-[10px] text-on-surface-variant">
                Tor als {POSITION_LABELS[player.position]} = {POSITION_GOAL_POINTS[player.position]} PKT
              </div>
            </div>
            <div className="rounded-md border border-outline-variant/20 bg-surface-container-low px-3 py-2 font-mono text-[10px] text-on-surface-variant">
              Realismus-Guard aktiv: max. {MAX_MATCHES_PER_SEASON} Ligaspiele, positionsabhängige Tor-/Assist-Caps.
            </div>

            <div className="grid grid-cols-2 gap-2">
              {INT_FIELDS.map((field) => (
                <Stepper
                  key={field.key}
                  label={field.label}
                  hint={field.hint(player.position)}
                  value={draft[field.key] as number}
                  max={projectionFieldMax(player.position, draft, field.key)}
                  onChange={(next) =>
                    setDraft((prev) =>
                      sanitizeProjection(player.position, { ...prev, [field.key]: next })
                    )
                  }
                />
              ))}
              {isGk && (
                <Stepper
                  label="Zu-null-Spiele"
                  hint="2 PKT"
                  value={draft.cleanSheets}
                  max={projectionFieldMax(player.position, draft, "cleanSheets")}
                  onChange={(next) =>
                    setDraft((prev) =>
                      sanitizeProjection(player.position, { ...prev, cleanSheets: next })
                    )
                  }
                />
              )}
            </div>

            <div className="rounded-lg border border-outline-variant/20 bg-surface-container-low px-3 py-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-on-surface">Notenschnitt</span>
                <span className="font-mono text-sm font-bold text-on-surface">
                  {draft.avgGrade.toFixed(2)} ={" "}
                  {gradePointsPerGame(draft.avgGrade).toFixed(1)} PKT / Spiel
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={6}
                step={0.01}
                value={draft.avgGrade}
                onChange={(e) =>
                  setDraft((prev) =>
                    sanitizeProjection(player.position, {
                      ...prev,
                      avgGrade: Number.parseFloat(e.target.value),
                    })
                  )
                }
                className="w-full accent-brand-pink"
              />
              <div className="mt-1 flex justify-between font-mono text-[10px] text-on-surface-variant">
                <span>1,00 = +10 PKT</span>
                <span>3,50 = 0 PKT</span>
                <span>6,00 = −10 PKT</span>
              </div>
            </div>

            <div className="rounded-xl border border-brand-pink/30 bg-brand-pink/10 p-4">
              <div className="grid grid-cols-[1fr_auto] gap-4">
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant">
                    Prognose
                  </div>
                  <div className="font-mono text-5xl font-black text-on-surface">{points}</div>
                  <div
                    className={`mt-1 font-mono text-xs font-bold ${
                      goldenDelta >= 0 ? "text-primary-fixed" : "text-tertiary-fixed-dim"
                    }`}
                  >
                    {goldenDelta >= 0 ? "+" : ""}
                    {goldenDelta} über/unter Goldenem Schnitt {goldenTarget}
                  </div>
                </div>
                <div className="space-y-0.5 text-right font-mono text-xs">
                  <BreakdownLine label="Startelf" count={draft.starts} value={breakdown.starts} />
                  <BreakdownLine label="Einwechslung" count={draft.subApps} value={breakdown.subApps} />
                  <BreakdownLine
                    label={`Noten (${draft.ratedGames})`}
                    value={breakdown.notePoints}
                  />
                  <BreakdownLine label="Tore" count={draft.goals} value={breakdown.goals} />
                  <BreakdownLine label="Vorlagen" count={draft.assists} value={breakdown.assists} />
                  <BreakdownLine label="Spieler des Spiels" count={draft.motm} value={breakdown.motm} />
                  <BreakdownLine label="Platzverweise" count={draft.yellowRed + draft.redCards} value={breakdown.cards} />
                  {isGk && (
                    <BreakdownLine label="Zu null" count={draft.cleanSheets} value={breakdown.cleanSheets} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          {!pickingForVariant && (
            <button
              type="button"
              onClick={() => removePlayerAndClose(player.id)}
              className="rounded-lg border border-tertiary-fixed-dim/40 px-4 py-2 text-sm font-semibold text-tertiary-fixed-dim hover:bg-tertiary-fixed-dim/10"
            >
              Entfernen
            </button>
          )}
          <button
            type="button"
            onClick={() => setDraft(sanitizeProjection(player.position, baseline))}
            title="Lädt die Vorjahreswerte in die Regler - die Prognose oben aktualisiert sich sofort, das Fenster bleibt offen."
            className="rounded-lg border border-outline-variant/30 px-4 py-2 text-sm text-on-surface-variant hover:text-on-surface"
          >
            Vorjahr laden
          </button>
          {pickingForVariant ? (
            <>
              <button
                type="button"
                onClick={close}
                className="rounded-lg border border-outline-variant/30 px-4 py-2 text-sm text-on-surface-variant hover:text-on-surface"
              >
                Zurück zur Liste
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!picker) return;
                  if (hasUnsavedChanges) acceptProjection(player.id, draft);
                  setVariantSwapIn(picker.variant, picker.swapOutId, player.id);
                  close();
                  closeAlternativePicker();
                }}
                className="rounded-lg bg-brand-pink px-5 py-2 text-sm font-bold text-white shadow-[0_0_14px_rgba(232,20,60,0.4)] hover:bg-brand-pink-dim"
              >
                In Variante {picker?.variant} übernehmen
              </button>
            </>
          ) : hasUnsavedChanges ? (
            <>
              <button
                type="button"
                onClick={close}
                title="Änderungen an dieser Prognose verwerfen"
                className="rounded-lg border border-outline-variant/30 px-4 py-2 text-sm text-on-surface-variant hover:text-on-surface"
              >
                Verwerfen
              </button>
              <button
                type="button"
                onClick={() => {
                  acceptProjection(player.id, draft);
                  close();
                }}
                className="rounded-lg bg-brand-pink px-5 py-2 text-sm font-bold text-white shadow-[0_0_14px_rgba(232,20,60,0.4)] hover:bg-brand-pink-dim"
              >
                Übernehmen &amp; schließen
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={close}
              className="rounded-lg border border-outline-variant/30 px-4 py-2 text-sm text-on-surface-variant hover:text-on-surface"
            >
              Schließen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function BreakdownLine({
  label,
  count,
  value,
}: {
  label: string;
  count?: number;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-on-surface-variant">
      <span>
        {label}
        {typeof count === "number" ? ` · ${count}` : ""}
      </span>
      <span className={value >= 0 ? "text-primary-fixed" : "text-tertiary-fixed-dim"}>
        {value >= 0 ? "+" : ""}
        {value}
      </span>
    </div>
  );
}
