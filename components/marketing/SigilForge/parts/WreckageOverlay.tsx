"use client";

import { cn } from "@/utils/cn";
import styles from "../SigilForge.module.scss";
import type { Hue } from "../SigilForge.constants";

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
