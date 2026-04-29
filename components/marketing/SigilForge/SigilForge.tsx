"use client";

import * as React from "react";
import styles from "./SigilForge.module.scss";
import { SF_GEOMETRIES } from "./SigilForge.constants";
import { getPolyhedron } from "./SigilForge.geometry";
import { ForgeHeader } from "./parts/ForgeHeader";
import {
  StageAtmos,
  StageChips,
  StageCorners,
  StageHint,
  StageScan,
} from "./parts/StageChrome";
import { SigilSvg } from "./parts/SigilSvg";
import { ChargeMeter } from "./parts/ChargeMeter";
import { WarningBanner } from "./parts/WarningBanner";
import { ShardField } from "./parts/ShardField";
import { WreckageOverlay } from "./parts/WreckageOverlay";
import { ControlPanel } from "./parts/ControlPanel";
import type { SigilForgeProps } from "./SigilForge.types";
import { useSigilForge } from "./useSigilForge";

export type { SigilForgeProps } from "./SigilForge.types";

const DEFAULTS = {
  eyebrow: "⌁ § Sigil Forge / interactive artifact",
  heading: "Drag to commune.",
  headingAccent: "commune",
  body: "A live xenotechnical sigil — drawn from the same lattice as every artifact in the catalogue.\nDrag to rotate. Scroll to lean closer. Cycle the frequency.",
} as const;

export default function SigilForge({
  eyebrow = DEFAULTS.eyebrow,
  heading = DEFAULTS.heading,
  headingAccent = DEFAULTS.headingAccent,
  body = DEFAULTS.body,
}: SigilForgeProps) {
  const s = useSigilForge();

  const polyData = React.useMemo(() => getPolyhedron(s.geometry), [s.geometry]);
  const particleCount = Math.floor(28 * s.freqObj.particleMul);
  const geomReadout =
    SF_GEOMETRIES.find((g) => g.id === s.geometry)?.readout ?? "";

  const stageStyle: React.CSSProperties = {
    ["--sf-primary" as string]: s.hueObj.primary,
    ["--sf-glow" as string]: s.hueObj.glow,
    ["--sf-shadow" as string]: s.hueObj.shadow,
    ["--sf-charge" as string]: s.charge.toFixed(3),
  };

  return (
    <section className={styles.sf}>
      <ForgeHeader
        eyebrow={eyebrow}
        heading={heading}
        headingAccent={headingAccent}
        body={body}
        hueObj={s.hueObj}
        freqHz={s.freqObj.hz}
        geomReadout={geomReadout}
        autoSpin={s.autoSpin}
      />

      <div className={styles.sf__body} suppressHydrationWarning>
        {!s.mounted ? (
          <div
            className={styles.sf__stage}
            aria-hidden="true"
            style={stageStyle}
          />
        ) : (
          <>
            <div
              className={styles.sf__stage}
              onPointerDown={s.onPointerDown}
              onPointerMove={s.onPointerMove}
              onPointerUp={s.onPointerUp}
              onPointerCancel={s.onPointerUp}
              onWheel={s.onWheel}
              style={stageStyle}
            >
              <StageCorners />
              <StageAtmos hueObj={s.hueObj} pulse={s.pulse} />
              <StageChips rot={s.rot} zoom={s.zoom} pulse={s.pulse} />

              <SigilSvg
                hueObj={s.hueObj}
                rot={s.rot}
                tick={s.tick}
                zoom={s.zoom}
                pulse={s.pulse}
                phase={s.phase}
                geometry={s.geometry}
                particleMul={s.freqObj.particleMul}
              />

              <StageHint />
              <ChargeMeter charge={s.charge} phase={s.phase} hueObj={s.hueObj} />
              <WarningBanner phase={s.phase} />

              {s.phase === "detonating" && (
                <ShardField
                  shards={s.shards}
                  detTick={s.detTick}
                  hueObj={s.hueObj}
                />
              )}

              {s.phase === "wreckage" && (
                <WreckageOverlay
                  hueObj={s.hueObj}
                  discoveries={s.discoveries}
                  onReboot={s.reboot}
                />
              )}

              {s.phase === "rebooting" && <div className={styles.sf__reboot} />}

              <StageScan />
            </div>

            <ControlPanel
              freq={s.freq}
              setFreq={s.setFreq}
              hue={s.hue}
              setHue={s.setHue}
              geometry={s.geometry}
              setGeometry={s.setGeometry}
              hueObj={s.hueObj}
              pulse={s.pulse}
              particleCount={particleCount}
              vertices={polyData.vertices.length}
              edges={polyData.edges.length}
              faces={polyData.faceIdx.length}
              autoSpin={s.autoSpin}
              setAutoSpin={s.setAutoSpin}
              onRecenter={s.recenter}
            />
          </>
        )}
      </div>
    </section>
  );
}
