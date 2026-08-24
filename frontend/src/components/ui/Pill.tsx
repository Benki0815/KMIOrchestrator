"use client";

import type { ReactNode } from "react";

export const PILL_TONES = {
  neutral: "bg-surface-container-highest text-on-surface-variant",
  green: "bg-emerald-500/15 text-emerald-300",
  blue: "bg-sky-500/15 text-sky-300",
  pink: "bg-brand-pink/15 text-brand-pink",
  amber: "bg-brand-amber/15 text-brand-amber",
  cyan: "bg-cyan-400/15 text-cyan-300",
  red: "bg-rose-500/15 text-rose-300",
  gray: "bg-surface-container-high text-on-surface-variant/70",
} as const;

export type PillTone = keyof typeof PILL_TONES;

export function Pill({
  tone,
  children,
  title,
}: {
  tone: PillTone;
  children: ReactNode;
  title?: string;
}) {
  return (
    <span
      title={title}
      className={`inline-flex min-w-[42px] justify-center rounded-md px-1.5 py-0.5 font-mono text-[10px] font-bold ${PILL_TONES[tone]}`}
    >
      {children}
    </span>
  );
}
