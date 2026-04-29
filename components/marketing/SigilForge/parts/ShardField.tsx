"use client";

import styles from "../SigilForge.module.scss";
import type { Hue } from "../SigilForge.constants";
import type { Shard } from "../SigilForge.types";

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
