"use client";

import type { Hue } from "../../SigilForge.constants";
import type { Particle } from "../svgCompute";

/* Renders either the back layer (depth < 0.5) or the front layer (depth >= 0.5)
   so callers can interleave them with the polyhedron. */
export function ParticleLayer({
  particles,
  hueObj,
  layer,
}: {
  particles: Particle[];
  hueObj: Hue;
  layer: "back" | "front";
}) {
  const isFront = layer === "front";
  const filtered = particles.filter((p) =>
    isFront ? p.depth >= 0.5 : p.depth < 0.5,
  );
  const prefix = isFront ? "pf" : "pb";

  return (
    <>
      {filtered.map((p) => (
        <circle
          key={prefix + p.key}
          cx={p.x}
          cy={p.y}
          r={1.2 + p.depth * (isFront ? 2 : 1.5)}
          fill={hueObj.glow}
          opacity={(isFront ? 0.3 : 0.2) + p.depth * (isFront ? 0.5 : 0.4)}
          style={
            isFront
              ? { filter: `drop-shadow(0 0 4px ${hueObj.shadow})` }
              : undefined
          }
        />
      ))}
    </>
  );
}
