/* Static lookup tables for the Sigil Forge artifact. */

export type HueId = "cyan" | "violet" | "amber" | "danger";
export interface Hue {
  id: HueId;
  name: string;
  primary: string;
  glow: string;
  shadow: string;
}

export type FreqId = "low" | "mid" | "high" | "xeno";
export interface Freq {
  id: FreqId;
  hz: string;
  name: string;
  speedMul: number;
  particleMul: number;
}

export type GeometryId = "tetra" | "octa" | "icosa" | "penta";
export interface GeometryDef {
  id: GeometryId;
  name: string;
  meta: string;
  /** Label rendered in the FREQ readout strip */
  readout: string;
}

export const SF_HUES: readonly Hue[] = [
  {
    id: "cyan",
    name: "CRYO",
    primary: "#3dd9d6",
    glow: "#7af0ee",
    shadow: "rgba(61,217,214,0.55)",
  },
  {
    id: "violet",
    name: "NOCTURNE",
    primary: "#a76bff",
    glow: "#d6a8ff",
    shadow: "rgba(167,107,255,0.55)",
  },
  {
    id: "amber",
    name: "EMBER",
    primary: "#d97f3a",
    glow: "#f4b06a",
    shadow: "rgba(217,127,58,0.55)",
  },
  {
    id: "danger",
    name: "HAZARD",
    primary: "#ff5a7a",
    glow: "#ff8fa3",
    shadow: "rgba(255,90,122,0.55)",
  },
] as const;

export const SF_FREQS: readonly Freq[] = [
  { id: "low", hz: "7.83 Hz", name: "SCHUMANN", speedMul: 0.55, particleMul: 0.7 },
  { id: "mid", hz: "40.0 Hz", name: "GAMMA", speedMul: 1.0, particleMul: 1.0 },
  { id: "high", hz: "432 Hz", name: "VERDANT", speedMul: 1.6, particleMul: 1.4 },
  { id: "xeno", hz: "7741 Hz", name: "XENO-PEAK", speedMul: 2.6, particleMul: 1.8 },
] as const;

export const SF_GEOMETRIES: readonly GeometryDef[] = [
  { id: "tetra", name: "TETRA", meta: "D4 · 4 faces", readout: "D4·TETRA" },
  { id: "octa", name: "OCTA", meta: "D8 · 8 faces", readout: "D8·OCTA" },
  { id: "icosa", name: "ICOSA", meta: "D20 · 20 faces", readout: "D20·ICOSA" },
  { id: "penta", name: "PENTA", meta: "D10 · 10 faces", readout: "D10·PENTA" },
] as const;

export const SF_GLYPHS = "⌁◉▰⟁⊹⊿✦◈◊⬢⬡⟆⟁△▽◇◆";

export const SF_STORAGE_KEY = "xcs.sf.detonations";
