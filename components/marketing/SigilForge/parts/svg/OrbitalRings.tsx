"use client";

import type { Hue } from "../../SigilForge.constants";

export function OrbitalRings({ hueObj, tick }: { hueObj: Hue; tick: number }) {
  return (
    <>
      <ellipse
        cx="0" cy="0" rx="240" ry="84"
        fill="none" stroke={hueObj.shadow} strokeWidth="0.5" strokeDasharray="2 4"
        opacity="0.5"
        transform={`rotate(${tick * 0.01}) skewX(${Math.sin(tick * 0.001) * 5})`}
      />
      <ellipse
        cx="0" cy="0" rx="200" ry="60"
        fill="none" stroke={hueObj.glow} strokeWidth="0.4"
        opacity="0.35"
      />
    </>
  );
}
