"use client";

import * as React from "react";
import { cn } from "@/utils/cn";
import styles from "./SigilForge.module.scss";
import {
  SF_FREQS,
  SF_GEOMETRIES,
  SF_GLYPHS,
  SF_HUES,
  type FreqId,
  type GeometryId,
  type Hue,
  type HueId,
} from "./SigilForge.constants";
import { getPolyhedron, rotatePoint } from "./SigilForge.geometry";
import type { Phase, Rotation, Shard } from "./SigilForge.types";

/* ── Header — eyebrow / title / readout ─────────────────── */
export function ForgeHeader({
  eyebrow,
  heading,
  headingAccent,
  body,
  hueObj,
  freqHz,
  geomReadout,
  autoSpin,
}: {
  eyebrow: string;
  heading: string;
  headingAccent?: string;
  body: string;
  hueObj: Hue;
  freqHz: string;
  geomReadout: string;
  autoSpin: boolean;
}) {
  const renderedHeading = React.useMemo(() => {
    if (!headingAccent) return heading;
    const idx = heading.toLowerCase().indexOf(headingAccent.toLowerCase());
    if (idx === -1) return heading;
    return (
      <>
        {heading.slice(0, idx)}
        <em>{heading.slice(idx, idx + headingAccent.length)}</em>
        {heading.slice(idx + headingAccent.length)}
      </>
    );
  }, [heading, headingAccent]);

  return (
    <div className={styles.sf__head}>
      <div>
        <span className={styles.tEyebrow}>{eyebrow}</span>
        <h2 className={styles.sf__title}>{renderedHeading}</h2>
        <p className={styles.sf__sub}>
          {body.split("\n").map((line, i, arr) => (
            <React.Fragment key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      </div>
      <Readout
        hueObj={hueObj}
        freqHz={freqHz}
        geomReadout={geomReadout}
        autoSpin={autoSpin}
      />
    </div>
  );
}

function Readout({
  hueObj,
  freqHz,
  geomReadout,
  autoSpin,
}: {
  hueObj: Hue;
  freqHz: string;
  geomReadout: string;
  autoSpin: boolean;
}) {
  const c = { color: hueObj.glow };
  return (
    <div className={cn(styles.sf__readout, styles.tMono)}>
      <ReadoutRow label="FREQ" value={freqHz} style={c} />
      <ReadoutRow label="HUE" value={hueObj.name} style={c} />
      <ReadoutRow label="GEOM" value={geomReadout} style={c} />
      <ReadoutRow label="STATE" value={autoSpin ? "ORBITING" : "STILL"} style={c} />
    </div>
  );
}

function ReadoutRow({
  label,
  value,
  style,
}: {
  label: string;
  value: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={styles["sf__readout-row"]}>
      <span>{label}</span>
      <strong style={style}>{value}</strong>
    </div>
  );
}

/* ── Stage chrome — corners, chips, atmospheric blob, hint ─ */
export function StageCorners() {
  return (
    <>
      <span className={cn(styles.sf__corner, styles.tl)} />
      <span className={cn(styles.sf__corner, styles.tr)} />
      <span className={cn(styles.sf__corner, styles.bl)} />
      <span className={cn(styles.sf__corner, styles.br)} />
    </>
  );
}

export function StageAtmos({ hueObj, pulse }: { hueObj: Hue; pulse: number }) {
  return (
    <div
      className={styles.sf__atmos}
      style={{
        background: `radial-gradient(60% 50% at 50% 50%, ${hueObj.shadow}, transparent 70%)`,
        transform: `translate(-50%, -50%) scale(${0.85 + pulse * 0.25})`,
        opacity: 0.6 + pulse * 0.3,
      }}
    />
  );
}

export function StageChips({
  rot,
  zoom,
  pulse,
}: {
  rot: Rotation;
  zoom: number;
  pulse: number;
}) {
  return (
    <>
      <Chip pos="tl" symbol="θ" value={`${((rot.y * 57.2958) % 360).toFixed(1)}°`} />
      <Chip pos="tr" symbol="φ" value={`${(rot.x * 57.2958).toFixed(1)}°`} />
      <Chip pos="bl" symbol="ZM" value={`${zoom.toFixed(2)}×`} />
      <Chip pos="br" symbol="ψ" value={`${(pulse * 100).toFixed(0)}%`} />
    </>
  );
}

function Chip({
  pos,
  symbol,
  value,
}: {
  pos: "tl" | "tr" | "bl" | "br";
  symbol: string;
  value: string;
}) {
  return (
    <div className={cn(styles.sf__chip, styles[`sf__chip--${pos}`])}>
      <span className={styles["sf__chip-num"]}>{symbol}</span>
      <span className={styles["sf__chip-val"]}>{value}</span>
    </div>
  );
}

export function StageHint() {
  return (
    <div className={cn(styles.sf__hint, styles.tMono)}>
      <span>◉ DRAG TO ROTATE</span>
      <span>⌁ SCROLL TO ZOOM</span>
    </div>
  );
}

/* ── Sigil SVG — orbits, glyphs, particles, polyhedron, core ─ */
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
  const polyData = React.useMemo(() => getPolyhedron(geometry), [geometry]);
  const projected = polyData.vertices.map((v) => rotatePoint(v, rot.x, rot.y));

  const edgeSvg = polyData.edges.map(([a, b], i) => {
    const va = projected[a];
    const vb = projected[b];
    const depth = (va.z + vb.z) / 2;
    const opacity = 0.25 + 0.6 * ((depth + polyData.R) / (2 * polyData.R));
    return (
      <line
        key={i}
        x1={va.x} y1={-va.y} x2={vb.x} y2={-vb.y}
        stroke={hueObj.glow}
        strokeWidth={1.2}
        opacity={opacity}
        style={{ filter: `drop-shadow(0 0 4px ${hueObj.shadow})` }}
      />
    );
  });

  const vertSvg = projected.map((v, i) => {
    const r = 2 + ((v.z + polyData.R) / polyData.R) * 2;
    return (
      <circle
        key={i}
        cx={v.x} cy={-v.y} r={r}
        fill={hueObj.glow}
        opacity={0.45 + 0.5 * ((v.z + polyData.R) / (2 * polyData.R))}
        style={{ filter: `drop-shadow(0 0 6px ${hueObj.shadow})` }}
      />
    );
  });

  const ringCount = 18;
  const glyphRing = Array.from({ length: ringCount }, (_, i) => {
    const a = (i / ringCount) * Math.PI * 2 + tick * 0.0006;
    const r = 200;
    return {
      x: Math.cos(a) * r,
      y: Math.sin(a) * r * 0.35,
      ch: SF_GLYPHS[i % SF_GLYPHS.length],
      a,
    };
  });

  const particleCount = Math.floor(28 * particleMul);
  const particles = Array.from({ length: particleCount }, (_, i) => {
    const seed = i * 37.7;
    const a = seed + tick * 0.0008 * (1 + (i % 3) * 0.4);
    const r = 130 + ((i * 13) % 110);
    const tilt = (i % 5) * 0.12;
    const z = Math.sin(a * 0.7) * r;
    return {
      x: Math.cos(a) * r,
      y: Math.sin(a) * r * (0.3 + tilt),
      depth: (z + 200) / 400,
      key: i,
    };
  });

  return (
    <svg
      className={styles.sf__svg}
      viewBox="-260 -260 520 520"
      style={{
        transform: `scale(${zoom * (phase === "critical" ? 1 + Math.sin(tick * 0.04) * 0.04 : 1)})`,
        opacity: phase === "detonating" || phase === "wreckage" ? 0 : 1,
        filter:
          phase === "critical"
            ? "brightness(1.6) saturate(1.4)"
            : phase === "warn"
              ? "brightness(1.2)"
              : "none",
        transition: "opacity 0.2s, filter 0.4s",
      }}
    >
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

      {particles
        .filter((p) => p.depth < 0.5)
        .map((p) => (
          <circle
            key={"pb" + p.key}
            cx={p.x} cy={p.y} r={1.2 + p.depth * 1.5}
            fill={hueObj.glow} opacity={0.2 + p.depth * 0.4}
          />
        ))}

      {glyphRing.map((g, i) => (
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

      <g style={{ filter: `drop-shadow(0 0 8px ${hueObj.shadow})` }}>
        {edgeSvg}
        {vertSvg}
      </g>

      {particles
        .filter((p) => p.depth >= 0.5)
        .map((p) => (
          <circle
            key={"pf" + p.key}
            cx={p.x} cy={p.y} r={1.2 + p.depth * 2}
            fill={hueObj.glow} opacity={0.3 + p.depth * 0.5}
            style={{ filter: `drop-shadow(0 0 4px ${hueObj.shadow})` }}
          />
        ))}

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

      <line x1="-32" y1="0" x2="-12" y2="0" stroke={hueObj.glow} strokeWidth="0.5" opacity="0.6" />
      <line x1="12" y1="0" x2="32" y2="0" stroke={hueObj.glow} strokeWidth="0.5" opacity="0.6" />
      <line x1="0" y1="-32" x2="0" y2="-12" stroke={hueObj.glow} strokeWidth="0.5" opacity="0.6" />
      <line x1="0" y1="12" x2="0" y2="32" stroke={hueObj.glow} strokeWidth="0.5" opacity="0.6" />
    </svg>
  );
}

/* ── Resonance charge meter ─────────────────────────────── */
export function ChargeMeter({
  charge,
  phase,
  hueObj,
}: {
  charge: number;
  phase: Phase;
  hueObj: Hue;
}) {
  const fillBg =
    phase === "critical"
      ? "linear-gradient(90deg, #ff5a7a, #ffb86b)"
      : phase === "warn"
        ? `linear-gradient(90deg, ${hueObj.glow}, #ffb86b)`
        : `linear-gradient(90deg, ${hueObj.primary}, ${hueObj.glow})`;
  const fillShadow =
    phase === "critical"
      ? "0 0 16px rgba(255,90,122,0.7)"
      : `0 0 12px ${hueObj.shadow}`;

  return (
    <div className={styles.sf__charge}>
      <div className={cn(styles["sf__charge-lbl"], styles.tMono)}>
        <span>⌁ RESONANCE CHARGE</span>
        <span>{(charge * 100).toFixed(0)}%</span>
      </div>
      <div className={styles["sf__charge-bar"]}>
        <div
          className={styles["sf__charge-fill"]}
          style={{
            width: `${charge * 100}%`,
            background: fillBg,
            boxShadow: fillShadow,
          }}
        />
        <div className={styles["sf__charge-mark"]} style={{ left: "55%" }} />
        <div
          className={styles["sf__charge-mark"]}
          style={{ left: "100%", borderColor: "#ff5a7a" }}
        />
      </div>
    </div>
  );
}

/* ── Warn / critical banner ─────────────────────────────── */
export function WarningBanner({ phase }: { phase: Phase }) {
  if (phase !== "warn" && phase !== "critical") return null;
  return (
    <div
      className={cn(
        styles.sf__warn,
        phase === "critical" && styles["sf__warn--critical"],
      )}
    >
      <span className={styles["sf__warn-dot"]} />
      <span className={styles["sf__warn-t"]}>
        {phase === "critical"
          ? "CONTAINMENT BREACH IMMINENT"
          : "LATTICE OVERHEATING — EASE OFF"}
      </span>
      <span className={styles["sf__warn-meta"]}>
        {phase === "critical" ? "T-MINUS 1.4s" : "CHARGE > 55%"}
      </span>
    </div>
  );
}

/* ── Detonation flash + flying shards ───────────────────── */
export function ShardField({
  shards,
  detTick,
  hueObj,
}: {
  shards: Shard[];
  detTick: number;
  hueObj: Hue;
}) {
  return (
    <>
      <div
        className={styles.sf__flash}
        style={{ opacity: Math.max(0, 1 - detTick / 600) }}
      />
      <div className={styles.sf__shards}>
        {shards.map((s) => (
          <div
            key={s.id}
            className={styles.sf__shard}
            style={{
              transform: `translate(${s.x}px, ${s.y}px) rotate(${s.r}deg)`,
              width: s.s + "px",
              height: s.s * 0.6 + "px",
              background: hueObj.glow,
              boxShadow: `0 0 ${8 + s.s}px ${hueObj.shadow}`,
              opacity: Math.max(0, s.life / 1800),
            }}
          />
        ))}
      </div>
    </>
  );
}

/* ── Wreckage / reboot overlay ──────────────────────────── */
export function WreckageOverlay({
  hueObj,
  discoveries,
  onReboot,
}: {
  hueObj: Hue;
  discoveries: number;
  onReboot: () => void;
}) {
  return (
    <div className={styles.sf__wreckage}>
      <div className={styles["sf__wreckage-glitch"]}>SIGIL // SHATTERED</div>
      <div className={styles["sf__wreckage-h"]}>The lattice could not hold.</div>
      <p className={styles["sf__wreckage-p"]}>
        You drove resonance past containment. The artifact has dispersed across the{" "}
        {hueObj.name.toLowerCase()} band.
        <br />
        Reconstitute it from the seed — every forge requires a witness.
      </p>
      <div className={cn(styles["sf__wreckage-meta"], styles.tMono)}>
        <span>◉ EVENT</span>
        <span>{String(discoveries).padStart(4, "0")} / DETONATIONS LOGGED</span>
        <span>⌁ {hueObj.name} BAND</span>
      </div>
      <button
        type="button"
        className={cn(styles.sfBtn, styles["sfBtn--primary"], styles["sfBtn--lg"])}
        onClick={onReboot}
      >
        ↻ Reconstitute the sigil
      </button>
      <div className={cn(styles["sf__wreckage-hint"], styles.tMono)}>
        [ keep dragging next time, pilot ]
      </div>
    </div>
  );
}

/* ── Right-hand control deck ────────────────────────────── */
export function ControlPanel({
  freq,
  setFreq,
  hue,
  setHue,
  geometry,
  setGeometry,
  hueObj,
  pulse,
  particleCount,
  vertices,
  edges,
  faces,
  autoSpin,
  setAutoSpin,
  onRecenter,
}: {
  freq: FreqId;
  setFreq: (v: FreqId) => void;
  hue: HueId;
  setHue: (v: HueId) => void;
  geometry: GeometryId;
  setGeometry: (v: GeometryId) => void;
  hueObj: Hue;
  pulse: number;
  particleCount: number;
  vertices: number;
  edges: number;
  faces: number;
  autoSpin: boolean;
  setAutoSpin: (fn: (s: boolean) => boolean) => void;
  onRecenter: () => void;
}) {
  return (
    <aside className={styles.sf__panel}>
      <FrequencyPicker freq={freq} setFreq={setFreq} />
      <HuePicker hue={hue} setHue={setHue} />
      <LatticePicker geometry={geometry} setGeometry={setGeometry} />
      <Telemetry
        hueObj={hueObj}
        pulse={pulse}
        particleCount={particleCount}
        vertices={vertices}
        edges={edges}
        faces={faces}
      />
      <PanelActions
        autoSpin={autoSpin}
        setAutoSpin={setAutoSpin}
        onRecenter={onRecenter}
      />
    </aside>
  );
}

function PanelBlock({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles["sf__panel-block"]}>
      <div className={styles["sf__panel-h"]}>{heading}</div>
      {children}
    </div>
  );
}

function FrequencyPicker({
  freq,
  setFreq,
}: {
  freq: FreqId;
  setFreq: (v: FreqId) => void;
}) {
  return (
    <PanelBlock heading="⌁ Frequency">
      <div className={styles.sf__row}>
        {SF_FREQS.map((f) => (
          <OptionButton
            key={f.id}
            active={freq === f.id}
            name={f.name}
            meta={f.hz}
            onClick={() => setFreq(f.id)}
          />
        ))}
      </div>
    </PanelBlock>
  );
}

function HuePicker({
  hue,
  setHue,
}: {
  hue: HueId;
  setHue: (v: HueId) => void;
}) {
  return (
    <PanelBlock heading="⌁ Hue band">
      <div className={styles.sf__hues}>
        {SF_HUES.map((h) => (
          <button
            type="button"
            key={h.id}
            className={cn(styles.sf__hue, hue === h.id && styles["is-on"])}
            style={
              {
                ["--c" as string]: h.primary,
                ["--cg" as string]: h.glow,
                ["--cs" as string]: h.shadow,
              } as React.CSSProperties
            }
            onClick={() => setHue(h.id)}
          >
            <span className={styles["sf__hue-dot"]} />
            <span className={styles["sf__hue-name"]}>{h.name}</span>
          </button>
        ))}
      </div>
    </PanelBlock>
  );
}

function LatticePicker({
  geometry,
  setGeometry,
}: {
  geometry: GeometryId;
  setGeometry: (v: GeometryId) => void;
}) {
  return (
    <PanelBlock heading="⌁ Lattice">
      <div className={cn(styles.sf__row, styles["sf__row--3"])}>
        {SF_GEOMETRIES.map((g) => (
          <OptionButton
            key={g.id}
            active={geometry === g.id}
            name={g.name}
            meta={g.meta}
            onClick={() => setGeometry(g.id)}
          />
        ))}
      </div>
    </PanelBlock>
  );
}

function OptionButton({
  active,
  name,
  meta,
  onClick,
}: {
  active: boolean;
  name: string;
  meta: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(styles.sf__btn, active && styles["is-on"])}
      onClick={onClick}
    >
      <span className={styles["sf__btn-name"]}>{name}</span>
      <span className={styles["sf__btn-meta"]}>{meta}</span>
    </button>
  );
}

function Telemetry({
  hueObj,
  pulse,
  particleCount,
  vertices,
  edges,
  faces,
}: {
  hueObj: Hue;
  pulse: number;
  particleCount: number;
  vertices: number;
  edges: number;
  faces: number;
}) {
  return (
    <PanelBlock heading="⌁ Telemetry">
      <div className={cn(styles.sf__telem, styles.tMono)}>
        <TelemetryRow label="vertices" value={vertices} />
        <TelemetryRow label="edges" value={edges} />
        <TelemetryRow label="faces" value={faces} />
        <TelemetryRow
          label="orbital ψ"
          value={`${(pulse * 100).toFixed(0)}%`}
          color={hueObj.glow}
        />
        <TelemetryRow label="particles" value={particleCount} />
      </div>
    </PanelBlock>
  );
}

function TelemetryRow({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className={styles["sf__telem-row"]}>
      <span>{label}</span>
      <strong style={color ? { color } : undefined}>{value}</strong>
    </div>
  );
}

function PanelActions({
  autoSpin,
  setAutoSpin,
  onRecenter,
}: {
  autoSpin: boolean;
  setAutoSpin: (fn: (s: boolean) => boolean) => void;
  onRecenter: () => void;
}) {
  return (
    <div className={styles["sf__panel-actions"]}>
      <button
        type="button"
        className={cn(
          styles.sfBtn,
          autoSpin ? styles["sfBtn--primary"] : styles["sfBtn--ghost"],
        )}
        onClick={() => setAutoSpin((s) => !s)}
      >
        {autoSpin ? "◉ Halt orbit" : "↻ Resume orbit"}
      </button>
      <button
        type="button"
        className={cn(styles.sfBtn, styles["sfBtn--ghost"])}
        onClick={onRecenter}
      >
        ⌁ Recenter
      </button>
    </div>
  );
}
