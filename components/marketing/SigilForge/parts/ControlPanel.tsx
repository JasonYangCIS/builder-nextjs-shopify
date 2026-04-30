"use client";

import * as React from "react";
import { cn } from "@/utils/cn";
import styles from "../SigilForge.module.scss";
import {
  SF_FREQS,
  SF_GEOMETRIES,
  SF_HUES,
  type FreqId,
  type GeometryId,
  type Hue,
  type HueId,
} from "../SigilForge.constants";

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

      <PanelBlock heading="⌁ Hue band">
        <div className={styles.sf__hues}>
          {SF_HUES.map((h) => (
            <HueSwatch
              key={h.id}
              hue={h}
              active={hue === h.id}
              onClick={() => setHue(h.id)}
            />
          ))}
        </div>
      </PanelBlock>

      <PanelBlock heading="⌁ Lattice">
        <div className={styles.sf__row}>
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

function HueSwatch({
  hue,
  active,
  onClick,
}: {
  hue: Hue;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(styles.sf__hue, active && styles["is-on"])}
      style={
        {
          ["--c" as string]: hue.primary,
          ["--cg" as string]: hue.glow,
          ["--cs" as string]: hue.shadow,
        } as React.CSSProperties
      }
      onClick={onClick}
    >
      <span className={styles["sf__hue-dot"]} />
      <span className={styles["sf__hue-name"]}>{hue.name}</span>
    </button>
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
