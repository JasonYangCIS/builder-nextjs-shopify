"use client";

import * as React from "react";
import { cn } from "@/utils/cn";
import styles from "./SigilForge.module.scss";
import type { SigilForgeProps } from "./SigilForge.types";

export type { SigilForgeProps } from "./SigilForge.types";

/* ── data ───────────────────────────────────────────────── */
const SF_HUES = [
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
] as const;

const SF_FREQS = [
  { id: "low", hz: "7.83 Hz", name: "SCHUMANN", speedMul: 0.55, particleMul: 0.7 },
  { id: "mid", hz: "40.0 Hz", name: "GAMMA", speedMul: 1.0, particleMul: 1.0 },
  { id: "high", hz: "432 Hz", name: "VERDANT", speedMul: 1.6, particleMul: 1.4 },
  { id: "xeno", hz: "7741 Hz", name: "XENO-PEAK", speedMul: 2.6, particleMul: 1.8 },
] as const;

const SF_GLYPHS = "⌁◉▰⟁⊹⊿✦◈◊⬢⬡⟆⟁△▽◇◆";

type Vec3 = { x: number; y: number; z: number };
type PolyData = {
  vertices: Vec3[];
  faceIdx: number[][];
  edges: number[][];
  R: number;
};

const buildIcosaData = (): PolyData => {
  const t = (1 + Math.sqrt(5)) / 2;
  const verts: number[][] = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ];
  const R = 110;
  const scaled: Vec3[] = verts.map((v) => {
    const m = Math.hypot(v[0], v[1], v[2]);
    return { x: (v[0] / m) * R, y: (v[1] / m) * R, z: (v[2] / m) * R };
  });
  const facesIdx = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ];
  const edgeSet = new Set<string>();
  facesIdx.forEach((f) => {
    [[f[0], f[1]], [f[1], f[2]], [f[2], f[0]]].forEach(([a, b]) => {
      const k = a < b ? `${a}-${b}` : `${b}-${a}`;
      edgeSet.add(k);
    });
  });
  const edges = [...edgeSet].map((k) => k.split("-").map(Number));
  return { vertices: scaled, faceIdx: facesIdx, edges, R };
};

const buildOctaData = (): PolyData => {
  const R = 110;
  const verts: Vec3[] = [
    { x: R, y: 0, z: 0 }, { x: -R, y: 0, z: 0 },
    { x: 0, y: R, z: 0 }, { x: 0, y: -R, z: 0 },
    { x: 0, y: 0, z: R }, { x: 0, y: 0, z: -R },
  ];
  const facesIdx = [
    [0, 2, 4], [2, 1, 4], [1, 3, 4], [3, 0, 4],
    [2, 0, 5], [1, 2, 5], [3, 1, 5], [0, 3, 5],
  ];
  const edgeSet = new Set<string>();
  facesIdx.forEach((f) => {
    [[f[0], f[1]], [f[1], f[2]], [f[2], f[0]]].forEach(([a, b]) => {
      const k = a < b ? `${a}-${b}` : `${b}-${a}`;
      edgeSet.add(k);
    });
  });
  const edges = [...edgeSet].map((k) => k.split("-").map(Number));
  return { vertices: verts, faceIdx: facesIdx, edges, R };
};

const buildTetraData = (): PolyData => {
  const R = 120;
  const verts: Vec3[] = [
    { x: R, y: R, z: R },
    { x: -R, y: -R, z: R },
    { x: -R, y: R, z: -R },
    { x: R, y: -R, z: -R },
  ];
  const facesIdx = [[0, 1, 2], [0, 3, 1], [0, 2, 3], [1, 3, 2]];
  const edgeSet = new Set<string>();
  facesIdx.forEach((f) => {
    [[f[0], f[1]], [f[1], f[2]], [f[2], f[0]]].forEach(([a, b]) => {
      const k = a < b ? `${a}-${b}` : `${b}-${a}`;
      edgeSet.add(k);
    });
  });
  const edges = [...edgeSet].map((k) => k.split("-").map(Number));
  return { vertices: verts, faceIdx: facesIdx, edges, R };
};

const ICOSA_DATA = buildIcosaData();
const OCTA_DATA = buildOctaData();
const TETRA_DATA = buildTetraData();

function buildPolyhedron(geometry: string): PolyData {
  if (geometry === "icosa") return ICOSA_DATA;
  if (geometry === "octa") return OCTA_DATA;
  return TETRA_DATA;
}

function rotatePoint(p: Vec3, rx: number, ry: number): Vec3 {
  const cy = Math.cos(ry), sy = Math.sin(ry);
  const cx = Math.cos(rx), sx = Math.sin(rx);
  const x1 = p.x * cy + p.z * sy;
  const z1 = -p.x * sy + p.z * cy;
  const y1 = p.y;
  const y2 = y1 * cx - z1 * sx;
  const z2 = y1 * sx + z1 * cx;
  return { x: x1, y: y2, z: z2 };
}

type Phase = "idle" | "warn" | "critical" | "detonating" | "rebooting" | "wreckage";
type Shard = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  vr: number;
  r: number;
  s: number;
  life: number;
};

export default function SigilForge({
  eyebrow = "⌁ § Sigil Forge / interactive artifact",
  heading = "Drag to commune.",
  headingAccent = "commune",
  body = "A live xenotechnical sigil — drawn from the same lattice as every artifact in the catalogue.\nDrag to rotate. Scroll to lean closer. Cycle the frequency.",
}: SigilForgeProps) {
  const [hue, setHue] = React.useState<string>("cyan");
  const [freq, setFreq] = React.useState<string>("mid");
  const [geometry, setGeometry] = React.useState<string>("icosa");
  const [autoSpin, setAutoSpin] = React.useState(true);
  const [zoom, setZoom] = React.useState(1);
  const [rot, setRot] = React.useState({ x: -0.3, y: 0.4 });
  const [tick, setTick] = React.useState(0);
  const [charge, setCharge] = React.useState(0);
  const [phase, setPhase] = React.useState<Phase>("idle");
  const [shards, setShards] = React.useState<Shard[]>([]);
  const [detTick, setDetTick] = React.useState(0);
  const [discoveries, setDiscoveries] = React.useState<number>(0);

  const dragRef = React.useRef<{
    active: boolean;
    lx: number;
    ly: number;
    energy?: number;
  }>({ active: false, lx: 0, ly: 0 });
  const rafRef = React.useRef(0);
  const stageRef = React.useRef<HTMLDivElement | null>(null);
  const phaseRef = React.useRef<Phase>("idle");
  phaseRef.current = phase;

  React.useEffect(() => {
    try {
      const v = parseInt(localStorage.getItem("xcs.sf.detonations") || "0", 10);
      if (!Number.isNaN(v)) setDiscoveries(v);
    } catch {}
  }, []);

  const hueObj = SF_HUES.find((h) => h.id === hue) ?? SF_HUES[0];
  const freqObj = SF_FREQS.find((f) => f.id === freq) ?? SF_FREQS[1];
  const polyData = buildPolyhedron(geometry);

  const detonate = React.useCallback(() => {
    setPhase("detonating");
    setDetTick(0);
    const next: Shard[] = [];
    const N = 64;
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2 + Math.random() * 0.5;
      const speed = 4 + Math.random() * 8;
      next.push({
        id: i,
        x: (Math.random() - 0.5) * 30,
        y: (Math.random() - 0.5) * 30,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed - 2,
        r: Math.random() * 360,
        vr: (Math.random() - 0.5) * 14,
        s: 4 + Math.random() * 14,
        life: 1400 + Math.random() * 800,
      });
    }
    setShards(next);
    window.setTimeout(() => {
      setPhase("wreckage");
      setDiscoveries((d) => {
        const nd = d + 1;
        try {
          localStorage.setItem("xcs.sf.detonations", String(nd));
        } catch {}
        return nd;
      });
    }, 1900);
  }, []);

  // animation tick
  React.useEffect(() => {
    let last = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(64, t - last);
      last = t;
      setTick((prev) => prev + dt * freqObj.speedMul);

      const ph = phaseRef.current;

      if (ph !== "detonating" && ph !== "rebooting" && ph !== "wreckage") {
        setCharge((c) => {
          const rate = dt / 8000;
          const nc = dragRef.current.active
            ? Math.min(1, c + rate)
            : Math.max(0, c - rate);

          if (nc >= 1 && ph !== "critical") {
            setPhase("critical");
            window.setTimeout(() => {
              if (phaseRef.current === "critical" && dragRef.current.active) {
                detonate();
              }
            }, 1400);
          } else if (nc >= 0.55 && ph === "idle") {
            setPhase("warn");
          } else if (nc < 0.5 && ph === "warn") {
            setPhase("idle");
          } else if (nc < 0.85 && ph === "critical") {
            setPhase("warn");
          }
          return nc;
        });
      }

      if (ph === "detonating") {
        setDetTick((d) => d + dt);
        setShards((sh) =>
          sh
            .map((s) => ({
              ...s,
              x: s.x + s.vx * dt * 0.06,
              y: s.y + s.vy * dt * 0.06,
              vy: s.vy + dt * 0.03,
              vx: s.vx * 0.995,
              r: s.r + s.vr * dt * 0.06,
              life: s.life - dt,
            }))
            .filter((s) => s.life > 0),
        );
      }

      if (
        autoSpin &&
        !dragRef.current.active &&
        ph !== "detonating" &&
        ph !== "wreckage" &&
        ph !== "rebooting"
      ) {
        const boost = ph === "critical" ? 4 : ph === "warn" ? 1.6 : 1;
        setRot((r) => ({
          x: r.x,
          y: r.y + (dt / 1000) * 0.35 * freqObj.speedMul * boost,
        }));
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [autoSpin, freqObj.speedMul, detonate]);

  const reboot = () => {
    setPhase("rebooting");
    setShards([]);
    setCharge(0);
    setRot({ x: -0.3, y: 0.4 });
    setZoom(1);
    window.setTimeout(() => setPhase("idle"), 1200);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (phase === "wreckage" || phase === "detonating" || phase === "rebooting") return;
    dragRef.current = { active: true, lx: e.clientX, ly: e.clientY, energy: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.lx;
    const dy = e.clientY - dragRef.current.ly;
    dragRef.current.lx = e.clientX;
    dragRef.current.ly = e.clientY;
    dragRef.current.energy = (dragRef.current.energy || 0) + Math.hypot(dx, dy);
    setRot((r) => ({
      x: Math.max(-1.4, Math.min(1.4, r.x - dy * 0.008)),
      y: r.y + dx * 0.008,
    }));
  };
  const onPointerUp = () => {
    dragRef.current.active = false;
  };
  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (phase === "wreckage" || phase === "detonating" || phase === "rebooting") return;
    e.preventDefault();
    setZoom((z) => Math.max(0.6, Math.min(1.8, z - e.deltaY * 0.001)));
  };

  const projected = polyData.vertices.map((v) => rotatePoint(v, rot.x, rot.y));
  const edgeSvg = polyData.edges.map(([a, b], i) => {
    const va = projected[a], vb = projected[b];
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

  const glyphRing: { x: number; y: number; ch: string; a: number }[] = [];
  const ringCount = 18;
  for (let i = 0; i < ringCount; i++) {
    const a = (i / ringCount) * Math.PI * 2 + tick * 0.0006;
    const r = 200;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r * 0.35;
    glyphRing.push({ x, y, ch: SF_GLYPHS[i % SF_GLYPHS.length], a });
  }

  const particleCount = Math.floor(28 * freqObj.particleMul);
  const particles: { x: number; y: number; depth: number; key: number }[] = [];
  for (let i = 0; i < particleCount; i++) {
    const seed = i * 37.7;
    const a = seed + tick * 0.0008 * (1 + (i % 3) * 0.4);
    const r = 130 + ((i * 13) % 110);
    const tilt = (i % 5) * 0.12;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r * (0.3 + tilt);
    const z = Math.sin(a * 0.7) * r;
    const depth = (z + 200) / 400;
    particles.push({ x, y, depth, key: i });
  }

  const pulse = 0.5 + 0.5 * Math.sin(tick * 0.003);

  const renderHeading = () => {
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
  };

  const stageStyle: React.CSSProperties = {
    ["--sf-primary" as string]: hueObj.primary,
    ["--sf-glow" as string]: hueObj.glow,
    ["--sf-shadow" as string]: hueObj.shadow,
    ["--sf-charge" as string]: charge.toFixed(3),
  };

  return (
    <section className={styles.sf}>
      <div className={styles.sf__head}>
        <div>
          <span className={styles.tEyebrow}>{eyebrow}</span>
          <h2 className={styles.sf__title}>{renderHeading()}</h2>
          <p className={styles.sf__sub}>
            {body.split("\n").map((line, i, arr) => (
              <React.Fragment key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        </div>
        <div className={cn(styles.sf__readout, styles.tMono)}>
          <div className={styles.sf__readout-row}>
            <span>FREQ</span>
            <strong style={{ color: hueObj.glow }}>{freqObj.hz}</strong>
          </div>
          <div className={styles.sf__readout-row}>
            <span>HUE</span>
            <strong style={{ color: hueObj.glow }}>{hueObj.name}</strong>
          </div>
          <div className={styles.sf__readout-row}>
            <span>GEOM</span>
            <strong style={{ color: hueObj.glow }}>
              {geometry === "icosa" ? "D20·ICOSA" : geometry === "octa" ? "D8·OCTA" : "D4·TETRA"}
            </strong>
          </div>
          <div className={styles.sf__readout-row}>
            <span>STATE</span>
            <strong style={{ color: hueObj.glow }}>{autoSpin ? "ORBITING" : "STILL"}</strong>
          </div>
        </div>
      </div>

      <div className={styles.sf__body}>
        <div
          className={styles.sf__stage}
          ref={stageRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onWheel={onWheel}
          style={stageStyle}
        >
          <span className={cn(styles.sf__corner, styles.tl)} />
          <span className={cn(styles.sf__corner, styles.tr)} />
          <span className={cn(styles.sf__corner, styles.bl)} />
          <span className={cn(styles.sf__corner, styles.br)} />

          <div
            className={styles.sf__atmos}
            style={{
              background: `radial-gradient(60% 50% at 50% 50%, ${hueObj.shadow}, transparent 70%)`,
              transform: `translate(-50%, -50%) scale(${0.85 + pulse * 0.25})`,
              opacity: 0.6 + pulse * 0.3,
            }}
          />

          <div className={cn(styles.sf__chip, styles["sf__chip--tl"])}>
            <span className={styles["sf__chip-num"]}>θ</span>
            <span className={styles["sf__chip-val"]}>
              {((rot.y * 57.2958) % 360).toFixed(1)}°
            </span>
          </div>
          <div className={cn(styles.sf__chip, styles["sf__chip--tr"])}>
            <span className={styles["sf__chip-num"]}>φ</span>
            <span className={styles["sf__chip-val"]}>{(rot.x * 57.2958).toFixed(1)}°</span>
          </div>
          <div className={cn(styles.sf__chip, styles["sf__chip--bl"])}>
            <span className={styles["sf__chip-num"]}>ZM</span>
            <span className={styles["sf__chip-val"]}>{zoom.toFixed(2)}×</span>
          </div>
          <div className={cn(styles.sf__chip, styles["sf__chip--br"])}>
            <span className={styles["sf__chip-num"]}>ψ</span>
            <span className={styles["sf__chip-val"]}>{(pulse * 100).toFixed(0)}%</span>
          </div>

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

          <div className={cn(styles.sf__hint, styles.tMono)}>
            <span>◉ DRAG TO ROTATE</span>
            <span>⌁ SCROLL TO ZOOM</span>
          </div>

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
                  background:
                    phase === "critical"
                      ? "linear-gradient(90deg, #ff5a7a, #ffb86b)"
                      : phase === "warn"
                        ? `linear-gradient(90deg, ${hueObj.glow}, #ffb86b)`
                        : `linear-gradient(90deg, ${hueObj.primary}, ${hueObj.glow})`,
                  boxShadow:
                    phase === "critical"
                      ? "0 0 16px rgba(255,90,122,0.7)"
                      : `0 0 12px ${hueObj.shadow}`,
                }}
              />
              <div className={styles["sf__charge-mark"]} style={{ left: "55%" }} />
              <div
                className={styles["sf__charge-mark"]}
                style={{ left: "100%", borderColor: "#ff5a7a" }}
              />
            </div>
          </div>

          {(phase === "warn" || phase === "critical") && (
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
          )}

          {phase === "detonating" && (
            <div
              className={styles.sf__flash}
              style={{ opacity: Math.max(0, 1 - detTick / 600) }}
            />
          )}

          {phase === "detonating" && (
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
          )}

          {phase === "wreckage" && (
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
                onClick={reboot}
              >
                ↻ Reconstitute the sigil
              </button>
              <div className={cn(styles["sf__wreckage-hint"], styles.tMono)}>
                [ keep dragging next time, pilot ]
              </div>
            </div>
          )}

          {phase === "rebooting" && <div className={styles.sf__reboot} />}

          <div className={styles.sf__scan} />
        </div>

        <aside className={styles.sf__panel}>
          <div className={styles.sf__panel-block}>
            <div className={styles.sf__panel-h}>⌁ Frequency</div>
            <div className={styles.sf__row}>
              {SF_FREQS.map((f) => (
                <button
                  type="button"
                  key={f.id}
                  className={cn(styles.sf__btn, freq === f.id && styles["is-on"])}
                  onClick={() => setFreq(f.id)}
                >
                  <span className={styles["sf__btn-name"]}>{f.name}</span>
                  <span className={styles["sf__btn-meta"]}>{f.hz}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.sf__panel-block}>
            <div className={styles.sf__panel-h}>⌁ Hue band</div>
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
          </div>

          <div className={styles.sf__panel-block}>
            <div className={styles.sf__panel-h}>⌁ Lattice</div>
            <div className={cn(styles.sf__row, styles["sf__row--3"])}>
              {[
                { id: "tetra", name: "TETRA", meta: "D4 · 4 faces" },
                { id: "octa", name: "OCTA", meta: "D8 · 8 faces" },
                { id: "icosa", name: "ICOSA", meta: "D20 · 20 faces" },
              ].map((g) => (
                <button
                  type="button"
                  key={g.id}
                  className={cn(styles.sf__btn, geometry === g.id && styles["is-on"])}
                  onClick={() => setGeometry(g.id)}
                >
                  <span className={styles["sf__btn-name"]}>{g.name}</span>
                  <span className={styles["sf__btn-meta"]}>{g.meta}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.sf__panel-block}>
            <div className={styles.sf__panel-h}>⌁ Telemetry</div>
            <div className={cn(styles.sf__telem, styles.tMono)}>
              <div className={styles.sf__telem-row}>
                <span>vertices</span>
                <strong>{polyData.vertices.length}</strong>
              </div>
              <div className={styles.sf__telem-row}>
                <span>edges</span>
                <strong>{polyData.edges.length}</strong>
              </div>
              <div className={styles.sf__telem-row}>
                <span>faces</span>
                <strong>{polyData.faceIdx.length}</strong>
              </div>
              <div className={styles.sf__telem-row}>
                <span>orbital ψ</span>
                <strong style={{ color: hueObj.glow }}>{(pulse * 100).toFixed(0)}%</strong>
              </div>
              <div className={styles.sf__telem-row}>
                <span>particles</span>
                <strong>{particleCount}</strong>
              </div>
            </div>
          </div>

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
              onClick={() => {
                setRot({ x: -0.3, y: 0.4 });
                setZoom(1);
              }}
            >
              ⌁ Recenter
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
