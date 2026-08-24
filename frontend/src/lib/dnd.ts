import type { DragEvent as ReactDragEvent } from "react";
import { useEffect, useState } from "react";
import type { Position } from "./types";

export type DragSlotRef = {
  kind: "slot";
  area: "starter" | "bench";
  index: number;
  playerId: string;
  position: Position;
};

export type DragPoolRef = {
  kind: "pool";
  playerId: string;
  position: Position;
};

export type DragPayload = DragSlotRef | DragPoolRef;

/** Chrome liefert Custom-MIME und oft auch text/plain auf drop nicht zuverlässig.
 * Deshalb liegt die Payload parallel im Modulspeicher (gesetzt in dragstart, leer in dragend). */
let livePayload: DragPayload | null = null;
const listeners = new Set<() => void>();

function notify(): void {
  listeners.forEach((fn) => fn());
}

function writeTransfer(event: ReactDragEvent, payload: DragPayload, effect: "copy" | "move"): void {
  livePayload = payload;
  notify();
  const json = JSON.stringify(payload);
  try {
    event.dataTransfer.setData("text/plain", json);
    event.dataTransfer.setData("text", json);
  } catch {
    // IE/Edge-Legacy: setData kann werfen – livePayload reicht.
  }
  event.dataTransfer.effectAllowed = effect;
  event.dataTransfer.dropEffect = effect;
}

export function writeDragSlot(
  event: ReactDragEvent,
  slot: { area: "starter" | "bench"; index: number; playerId: string; position: Position }
): void {
  writeTransfer(event, { kind: "slot", ...slot }, "move");
}

export function writeDragPool(event: ReactDragEvent, playerId: string, position: Position): void {
  writeTransfer(event, { kind: "pool", playerId, position }, "copy");
}

export function clearDrag(): void {
  if (livePayload === null) return;
  livePayload = null;
  notify();
}

export function currentDrag(): DragPayload | null {
  return livePayload;
}

export function readDragPayload(event: ReactDragEvent): DragPayload | null {
  if (livePayload) return livePayload;
  const raw = event.dataTransfer.getData("text/plain") || event.dataTransfer.getData("text");
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<DragPayload>;
    if (
      parsed.kind === "slot" &&
      (parsed.area === "starter" || parsed.area === "bench") &&
      typeof parsed.index === "number" &&
      typeof parsed.playerId === "string" &&
      typeof parsed.position === "string"
    ) {
      return parsed as DragSlotRef;
    }
    if (parsed.kind === "pool" && typeof parsed.playerId === "string" && typeof parsed.position === "string") {
      return parsed as DragPoolRef;
    }
  } catch {
    // ignore
  }
  return null;
}

export function allowDrop(event: ReactDragEvent, slotPosition?: Position): boolean {
  event.preventDefault();
  event.stopPropagation();
  const payload = currentDrag() ?? readDragPayload(event);
  const ok = !!payload && (!slotPosition || payload.position === slotPosition);
  event.dataTransfer.dropEffect = ok ? (payload?.kind === "pool" ? "copy" : "move") : "none";
  return ok;
}

export function useActiveDrag(): DragPayload | null {
  const [payload, setPayload] = useState<DragPayload | null>(livePayload);
  useEffect(() => {
    const onChange = () => setPayload(livePayload);
    listeners.add(onChange);
    return () => {
      listeners.delete(onChange);
    };
  }, []);
  return payload;
}
