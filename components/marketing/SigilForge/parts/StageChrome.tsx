"use client";

import * as React from "react";
import { cn } from "@/utils/cn";
import styles from "../SigilForge.module.scss";
import type { Hue } from "../SigilForge.constants";
import type { Rotation } from "../SigilForge.types";

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

export function StageScan() {
  return <div className={styles.sf__scan} />;
}
