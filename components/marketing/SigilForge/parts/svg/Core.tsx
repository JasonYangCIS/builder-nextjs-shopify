"use client";

import type { Hue } from "../../SigilForge.constants";

export function Core({
  hueObj,
  tick,
  pulse,
}: {
  hueObj: Hue;
  tick: number;
  pulse: number;
}) {
  return (
    <>
      <g style={{ transform: `rotate(${tick * 0.04}deg)`, transformOrigin: "center" }}>
        <polygon
          points="0,-22 19,11 -19,11"
          fill="none" stroke={hueObj.glow} strokeWidth="1"
          opacity={0.6 + pulse * 0.4}
          style={{ filter: `drop-shadow(0 0 6px ${hueObj.shadow})` }}
        />
      </g>
      <g style={{ transform: `rotate(${-tick * 0.06}deg)`, transformOrigin: "center" }}>
        <polygon
          points="0,22 19,-11 -19,-11"
          fill="none" stroke={hueObj.primary} strokeWidth="1"
          opacity={0.5 + pulse * 0.4}
        />
      </g>
      <circle
        cx="0" cy="0" r={6 + pulse * 4}
        fill={hueObj.glow} opacity="0.9"
        style={{ filter: `drop-shadow(0 0 12px ${hueObj.glow})` }}
      />
      <Crosshair color={hueObj.glow} />
    </>
  );
}

function Crosshair({ color }: { color: string }) {
  return (
    <g stroke={color} strokeWidth="0.5" opacity="0.6">
      <line x1="-32" y1="0" x2="-12" y2="0" />
      <line x1="12" y1="0" x2="32" y2="0" />
      <line x1="0" y1="-32" x2="0" y2="-12" />
      <line x1="0" y1="12" x2="0" y2="32" />
    </g>
  );
}
