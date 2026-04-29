import type { FreqId, GeometryId, HueId } from "./SigilForge.constants";

export interface SigilForgeProps {
  /** Optional override for the eyebrow label */
  eyebrow?: string;
  /** Optional override for the heading */
  heading?: string;
  /** Word inside heading rendered with cyan accent */
  headingAccent?: string;
  /** Sub-text under the heading */
  body?: string;
}

export type Phase =
  | "idle"
  | "warn"
  | "critical"
  | "detonating"
  | "rebooting"
  | "wreckage";

export interface Shard {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  vr: number;
  r: number;
  s: number;
  life: number;
}

export interface Rotation {
  x: number;
  y: number;
}

export type { FreqId, GeometryId, HueId };
