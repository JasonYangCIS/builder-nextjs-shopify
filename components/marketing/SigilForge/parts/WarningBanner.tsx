"use client";

import { cn } from "@/utils/cn";
import styles from "../SigilForge.module.scss";
import type { Phase } from "../SigilForge.types";

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
