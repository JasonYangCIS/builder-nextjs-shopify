"use client";

import * as React from "react";
import {
  SF_FREQS,
  SF_HUES,
  SF_STORAGE_KEY,
  type Freq,
  type FreqId,
  type GeometryId,
  type Hue,
  type HueId,
} from "./SigilForge.constants";
import type { Phase, Rotation, Shard } from "./SigilForge.types";

/* ──────────────────────────────────────────────────────────
 * useSigilForge
 *  Owns all the volatile state for the artifact:
 *  – selected hue / freq / geometry
 *  – rotation, zoom, autospin
 *  – animation tick + pulse
 *  – charge / phase state machine
 *  – detonation shards
 *  – persisted detonation count
 *  – pointer + wheel handlers
 * ──────────────────────────────────────────────────────── */
/* SSR-safe "we're on the client now" flag without setState-in-effect. */
const subscribeNoop = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function useSigilForge() {
  const mounted = React.useSyncExternalStore(
    subscribeNoop,
    getClientSnapshot,
    getServerSnapshot,
  );

  const [hue, setHue] = React.useState<HueId>("cyan");
  const [freq, setFreq] = React.useState<FreqId>("mid");
  const [geometry, setGeometry] = React.useState<GeometryId>("icosa");
  const [autoSpin, setAutoSpin] = React.useState(true);
  const [zoom, setZoom] = React.useState(1);
  const [rot, setRot] = React.useState<Rotation>({ x: -0.3, y: 0.4 });
  const [tick, setTick] = React.useState(0);
  const [charge, setCharge] = React.useState(0);
  const [phase, setPhase] = React.useState<Phase>("idle");
  const [shards, setShards] = React.useState<Shard[]>([]);
  const [detTick, setDetTick] = React.useState(0);
  /* Bumped after each detonation so `discoveries` re-reads localStorage. */
  const [discoveriesBump, setDiscoveriesBump] = React.useState(0);

  const dragRef = React.useRef<{
    active: boolean;
    lx: number;
    ly: number;
    energy?: number;
  }>({ active: false, lx: 0, ly: 0 });
  const rafRef = React.useRef(0);
  const phaseRef = React.useRef<Phase>("idle");

  /* Mirror `phase` into a ref so the RAF loop can read the latest value
     without re-subscribing. Update happens after commit, never during render. */
  React.useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const hueObj: Hue = SF_HUES.find((h) => h.id === hue) ?? SF_HUES[0];
  const freqObj: Freq = SF_FREQS.find((f) => f.id === freq) ?? SF_FREQS[1];

  /* Persisted detonation count — read from localStorage on demand.
     `discoveriesBump` is intentionally a recomputation trigger, not a value. */
  const discoveries = React.useMemo(() => {
    void discoveriesBump;
    if (!mounted) return 0;
    try {
      const v = parseInt(localStorage.getItem(SF_STORAGE_KEY) || "0", 10);
      return Number.isNaN(v) ? 0 : v;
    } catch {
      return 0;
    }
  }, [mounted, discoveriesBump]);

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
      try {
        const prev =
          parseInt(localStorage.getItem(SF_STORAGE_KEY) || "0", 10) || 0;
        localStorage.setItem(SF_STORAGE_KEY, String(prev + 1));
      } catch {}
      setDiscoveriesBump((b) => b + 1);
    }, 1900);
  }, []);

  /* Animation loop — tick, charge dynamics, phase transitions, shard physics, autospin. */
  React.useEffect(() => {
    if (!mounted) return;
    let last = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(64, t - last);
      last = t;
      setTick((prev) => prev + dt * freqObj.speedMul);

      const ph = phaseRef.current;

      if (ph !== "detonating" && ph !== "rebooting" && ph !== "wreckage") {
        setCharge((c) => {
          const rate = dt / 5000;
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
  }, [autoSpin, freqObj.speedMul, detonate, mounted]);

  const reboot = React.useCallback(() => {
    setPhase("rebooting");
    setShards([]);
    setCharge(0);
    setRot({ x: -0.3, y: 0.4 });
    setZoom(1);
    window.setTimeout(() => setPhase("idle"), 1200);
  }, []);

  const recenter = React.useCallback(() => {
    setRot({ x: -0.3, y: 0.4 });
    setZoom(1);
  }, []);

  const isLocked =
    phase === "wreckage" || phase === "detonating" || phase === "rebooting";

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isLocked) return;
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
    if (isLocked) return;
    e.preventDefault();
    setZoom((z) => Math.max(0.6, Math.min(1.8, z - e.deltaY * 0.001)));
  };

  const pulse = 0.5 + 0.5 * Math.sin(tick * 0.003);

  return {
    mounted,
    hue,
    setHue,
    freq,
    setFreq,
    geometry,
    setGeometry,
    autoSpin,
    setAutoSpin,
    zoom,
    rot,
    tick,
    charge,
    phase,
    shards,
    detTick,
    discoveries,
    hueObj,
    freqObj,
    pulse,
    reboot,
    recenter,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onWheel,
  };
}

export type SigilForgeState = ReturnType<typeof useSigilForge>;
