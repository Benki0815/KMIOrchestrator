"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw, ScrollText, Search } from "lucide-react";
import { api, type ActivityLogEntry } from "@/lib/api";
import { Pill, type PillTone } from "@/components/ui/Pill";

const CATEGORY_FILTERS: Array<{ id: string; label: string }> = [
  { id: "all", label: "Alle" },
  { id: "media", label: "Medien" },
  { id: "ingest", label: "Ingest" },
  { id: "sync", label: "Sync" },
  { id: "backup", label: "Backup" },
  { id: "error", label: "Fehler" },
];

const CATEGORY_LABEL: Record<string, string> = {
  media: "Medien",
  ingest: "Ingest",
  sync: "Sync",
  backup: "Backup",
  system: "System",
};

const STATUS_LABEL: Record<string, string> = {
  ok: "OK",
  warning: "Warnung",
  error: "Fehler",
  running: "Läuft",
};

function statusTone(status: string): PillTone {
  if (status === "ok") return "green";
  if (status === "warning") return "amber";
  if (status === "error") return "red";
  if (status === "running") return "cyan";
  return "neutral";
}

function categoryTone(category: string): PillTone {
  if (category === "media") return "blue";
  if (category === "ingest") return "pink";
  if (category === "sync") return "cyan";
  if (category === "backup") return "amber";
  return "gray";
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function LogPanel() {
  const [items, setItems] = useState<ActivityLogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await api.listLogs();
      setItems(data.items);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Logs konnten nicht geladen werden");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const timer = window.setInterval(() => {
      void load();
    }, 15000);
    return () => window.clearInterval(timer);
  }, [load]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (filter === "error" && item.status !== "error") return false;
      if (filter !== "all" && filter !== "error" && item.category !== filter) return false;
      if (!q) return true;
      return (
        item.message.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    });
  }, [items, query, filter]);

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-outline-variant/25 bg-surface-container-low px-4 py-3">
        <div className="flex items-center gap-2">
          <ScrollText className="h-4 w-4 text-brand-pink" />
          <div>
            <div className="font-display text-sm font-black uppercase tracking-tight text-on-surface">
              Backend-Log
            </div>
            <div className="font-mono text-[10px] text-on-surface-variant">
              {total} Einträge persistent · neueste zuerst
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORY_FILTERS.map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => setFilter(chip.id)}
              className={`rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider ${
                filter === chip.id
                  ? "bg-brand-pink text-white"
                  : "bg-surface-container-high text-on-surface-variant"
              }`}
            >
              {chip.label}
            </button>
          ))}
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-on-surface-variant" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Log durchsuchen…"
              className="w-52 rounded-lg border border-outline-variant/30 bg-surface-container-highest py-1.5 pl-8 pr-3 text-[12px] text-on-surface outline-none focus:border-brand-pink"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              void load();
            }}
            className="rounded-lg border border-outline-variant/30 p-1.5 text-on-surface-variant hover:text-on-surface"
            title="Aktualisieren"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {error && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}
        {!error && loading && items.length === 0 && (
          <div className="px-2 py-8 text-center font-mono text-xs text-on-surface-variant">Lade Logs…</div>
        )}
        {!error && !loading && visible.length === 0 && (
          <div className="px-2 py-8 text-center font-mono text-xs text-on-surface-variant">
            Keine Log-Einträge gefunden.
          </div>
        )}
        <div className="flex flex-col gap-2">
          {visible.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[11px] text-on-surface-variant">
                  {formatTimestamp(item.createdAt)}
                </span>
                <Pill tone={statusTone(item.status)}>{STATUS_LABEL[item.status] ?? item.status}</Pill>
                <Pill tone={categoryTone(item.category)}>
                  {CATEGORY_LABEL[item.category] ?? item.category}
                </Pill>
                <span className="font-display text-xs font-bold uppercase tracking-wide text-on-surface">
                  {item.title}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-on-surface">{item.message}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
