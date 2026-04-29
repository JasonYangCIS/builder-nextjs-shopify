"use client";

import type { Hue } from "../../SigilForge.constants";
import type { RingGlyph } from "../svgCompute";

export function GlyphRing({
  glyphs,
  hueObj,
}: {
  glyphs: RingGlyph[];
  hueObj: Hue;
}) {
  return (
    <>
      {glyphs.map((g, i) => (
        <text
          key={i}
          x={g.x} y={g.y}
          fontFamily="JetBrains Mono"
          fontSize="13"
          fill={hueObj.glow}
          opacity={0.3 + 0.5 * Math.cos(g.a)}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ filter: `drop-shadow(0 0 3px ${hueObj.shadow})` }}
        >
          {g.ch}
        </text>
      ))}
    </>
  );
}
