"use client";

import { X } from "lucide-react";

const THUMB_CLASSES =
  "pointer-events-none absolute inset-0 h-5 w-full cursor-pointer appearance-none bg-transparent " +
  "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 " +
  "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full " +
  "[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand-pink " +
  "[&::-webkit-slider-thumb]:bg-surface-container-lowest [&::-webkit-slider-thumb]:shadow " +
  "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 " +
  "[&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full " +
  "[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-brand-pink " +
  "[&::-moz-range-thumb]:bg-surface-container-lowest [&::-moz-range-thumb]:shadow " +
  "[&::-webkit-slider-runnable-track]:bg-transparent [&::-moz-range-track]:bg-transparent";

/** Zweigriffiger Bereichs-Schieberegler (z.B. Marktwert 2-4,5 Mio). `value` gleich `[min, max]`
 * gilt als "kein Filter aktiv" - dann wird kein Reset-X angezeigt. */
export function RangeSlider({
  min,
  max,
  step = 0.1,
  value,
  onChange,
  format = (v) => String(v),
  label,
}: {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  format?: (v: number) => string;
  label?: string;
}) {
  const [lo, hi] = value;
  const isActive = lo > min + step / 2 || hi < max - step / 2;
  const span = Math.max(max - min, step);
  const pctLo = ((lo - min) / span) * 100;
  const pctHi = ((hi - min) / span) * 100;

  return (
    <div className="flex min-w-[148px] shrink-0 items-center gap-2 rounded-lg border border-outline-variant/30 bg-surface-container-low px-2 py-1">
      {label && (
        <span className="shrink-0 font-mono text-[9px] font-bold uppercase tracking-wider text-on-surface-variant">
          {label}
        </span>
      )}
      <span className="shrink-0 whitespace-nowrap font-mono text-[10px] text-on-surface">
        {format(lo)}–{format(hi)}
      </span>
      <div className="relative h-5 w-24 shrink-0">
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-surface-container-highest" />
        <div
          className="pointer-events-none absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-brand-pink"
          style={{ left: `${pctLo}%`, right: `${100 - pctHi}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={lo}
          onChange={(e) => {
            const next = Math.min(Number(e.target.value), hi - step);
            onChange([next, hi]);
          }}
          className={THUMB_CLASSES}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={hi}
          onChange={(e) => {
            const next = Math.max(Number(e.target.value), lo + step);
            onChange([lo, next]);
          }}
          className={THUMB_CLASSES}
        />
      </div>
      {isActive && (
        <button
          type="button"
          onClick={() => onChange([min, max])}
          title="Filter aufheben"
          className="shrink-0 rounded p-0.5 text-on-surface-variant hover:text-brand-pink"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
