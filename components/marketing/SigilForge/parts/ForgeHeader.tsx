"use client";

import * as React from "react";
import { cn } from "@/utils/cn";
import styles from "../SigilForge.module.scss";
import type { Hue } from "../SigilForge.constants";

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

  const c = { color: hueObj.glow };
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
      <div className={cn(styles.sf__readout, styles.tMono)}>
        <ReadoutRow label="FREQ" value={freqHz} style={c} />
        <ReadoutRow label="HUE" value={hueObj.name} style={c} />
        <ReadoutRow label="GEOM" value={geomReadout} style={c} />
        <ReadoutRow label="STATE" value={autoSpin ? "ORBITING" : "STILL"} style={c} />
      </div>
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
