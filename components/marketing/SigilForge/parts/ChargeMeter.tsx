"use client";

import { cn } from "@/utils/cn";
import styles from "../SigilForge.module.scss";
import type { Hue } from "../SigilForge.constants";
import type { Phase } from "../SigilForge.types";

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
