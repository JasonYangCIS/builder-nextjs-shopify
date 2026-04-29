"use client";

import * as React from "react";
import styles from "../SigilForge.module.scss";
import type { Hue, GeometryId } from "../SigilForge.constants";
import type { Phase, Rotation } from "../SigilForge.types";
import { computeGlyphRing, computeParticles } from "./svgCompute";
import { OrbitalRings } from "./svg/OrbitalRings";
import { GlyphRing } from "./svg/GlyphRing";
import { ParticleLayer } from "./svg/ParticleLayer";
import { Polyhedron } from "./svg/Polyhedron";
import { Core } from "./svg/Core";

export function SigilSvg({
  hueObj,
  rot,
  tick,
  zoom,
  pulse,
  phase,
  geometry,
  particleMul,
}: {
  hueObj: Hue;
  rot: Rotation;
  tick: number;
  zoom: number;
  pulse: number;
  phase: Phase;
  geometry: GeometryId;
  particleMul: number;
}) {
  const particles = React.useMemo(
    () => computeParticles(tick, Math.floor(28 * particleMul)),
    [tick, particleMul],
  );
  const glyphs = React.useMemo(() => computeGlyphRing(tick), [tick]);

  const scale =
    zoom * (phase === "critical" ? 1 + Math.sin(tick * 0.04) * 0.04 : 1);
  const filter =
    phase === "critical"
      ? "brightness(1.6) saturate(1.4)"
      : phase === "warn"
        ? "brightness(1.2)"
        : "none";

  return (
    <svg
      className={styles.sf__svg}
      viewBox="-260 -260 520 520"
      style={{
        transform: `scale(${scale})`,
        opacity: phase === "detonating" || phase === "wreckage" ? 0 : 1,
        filter,
        transition: "opacity 0.2s, filter 0.4s",
      }}
    >
      <OrbitalRings hueObj={hueObj} tick={tick} />
      <ParticleLayer particles={particles} hueObj={hueObj} layer="back" />
      <GlyphRing glyphs={glyphs} hueObj={hueObj} />
      <Polyhedron hueObj={hueObj} rot={rot} geometry={geometry} />
      <ParticleLayer particles={particles} hueObj={hueObj} layer="front" />
      <Core hueObj={hueObj} tick={tick} pulse={pulse} />
    </svg>
  );
}
