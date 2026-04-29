"use client";

import * as React from "react";
import type { Hue, GeometryId } from "../../SigilForge.constants";
import { getPolyhedron, rotatePoint } from "../../SigilForge.geometry";
import type { Rotation } from "../../SigilForge.types";

export function Polyhedron({
  hueObj,
  rot,
  geometry,
}: {
  hueObj: Hue;
  rot: Rotation;
  geometry: GeometryId;
}) {
  const polyData = React.useMemo(() => getPolyhedron(geometry), [geometry]);
  const projected = polyData.vertices.map((v) => rotatePoint(v, rot.x, rot.y));
  const R = polyData.R;
  const shadowFilter = `drop-shadow(0 0 4px ${hueObj.shadow})`;
  const vertFilter = `drop-shadow(0 0 6px ${hueObj.shadow})`;

  return (
    <g style={{ filter: `drop-shadow(0 0 8px ${hueObj.shadow})` }}>
      {polyData.edges.map(([a, b], i) => {
        const va = projected[a];
        const vb = projected[b];
        const depth = (va.z + vb.z) / 2;
        return (
          <line
            key={`e${i}`}
            x1={va.x} y1={-va.y} x2={vb.x} y2={-vb.y}
            stroke={hueObj.glow}
            strokeWidth={1.2}
            opacity={0.25 + 0.6 * ((depth + R) / (2 * R))}
            style={{ filter: shadowFilter }}
          />
        );
      })}
      {projected.map((v, i) => (
        <circle
          key={`v${i}`}
          cx={v.x} cy={-v.y} r={2 + ((v.z + R) / R) * 2}
          fill={hueObj.glow}
          opacity={0.45 + 0.5 * ((v.z + R) / (2 * R))}
          style={{ filter: vertFilter }}
        />
      ))}
    </g>
  );
}
