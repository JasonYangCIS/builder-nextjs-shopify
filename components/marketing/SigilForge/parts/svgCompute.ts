/* Pure helpers used by the SVG sub-layers — no React, no DOM. */

import { SF_GLYPHS } from "../SigilForge.constants";

export interface Particle {
  key: number;
  x: number;
  y: number;
  depth: number;
}

export interface RingGlyph {
  x: number;
  y: number;
  ch: string;
  a: number;
}

export function computeParticles(tick: number, count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const seed = i * 37.7;
    const a = seed + tick * 0.0008 * (1 + (i % 3) * 0.4);
    const r = 130 + ((i * 13) % 110);
    const tilt = (i % 5) * 0.12;
    const z = Math.sin(a * 0.7) * r;
    return {
      key: i,
      x: Math.cos(a) * r,
      y: Math.sin(a) * r * (0.3 + tilt),
      depth: (z + 200) / 400,
    };
  });
}

export function computeGlyphRing(tick: number, ringCount = 18): RingGlyph[] {
  return Array.from({ length: ringCount }, (_, i) => {
    const a = (i / ringCount) * Math.PI * 2 + tick * 0.0006;
    const r = 200;
    return {
      x: Math.cos(a) * r,
      y: Math.sin(a) * r * 0.35,
      ch: SF_GLYPHS[i % SF_GLYPHS.length],
      a,
    };
  });
}
