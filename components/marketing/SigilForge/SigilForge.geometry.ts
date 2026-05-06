/* Polyhedron data + 3D rotation utility for the Sigil Forge artifact. */

import type { GeometryId } from "./SigilForge.constants";

export type Vec3 = { x: number; y: number; z: number };
export interface PolyData {
  vertices: Vec3[];
  faceIdx: number[][];
  edges: number[][];
  R: number;
}

function edgesFromFaces(facesIdx: number[][]): number[][] {
  const edgeSet = new Set<string>();
  facesIdx.forEach((f) => {
    [
      [f[0], f[1]],
      [f[1], f[2]],
      [f[2], f[0]],
    ].forEach(([a, b]) => {
      const k = a < b ? `${a}-${b}` : `${b}-${a}`;
      edgeSet.add(k);
    });
  });
  return [...edgeSet].map((k) => k.split("-").map(Number));
}

function buildIcosaData(): PolyData {
  const t = (1 + Math.sqrt(5)) / 2;
  const verts: number[][] = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ];
  const R = 110;
  const scaled: Vec3[] = verts.map((v) => {
    const m = Math.hypot(v[0], v[1], v[2]);
    return { x: (v[0] / m) * R, y: (v[1] / m) * R, z: (v[2] / m) * R };
  });
  const facesIdx = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ];
  return { vertices: scaled, faceIdx: facesIdx, edges: edgesFromFaces(facesIdx), R };
}

function buildOctaData(): PolyData {
  const R = 110;
  const verts: Vec3[] = [
    { x: R, y: 0, z: 0 }, { x: -R, y: 0, z: 0 },
    { x: 0, y: R, z: 0 }, { x: 0, y: -R, z: 0 },
    { x: 0, y: 0, z: R }, { x: 0, y: 0, z: -R },
  ];
  const facesIdx = [
    [0, 2, 4], [2, 1, 4], [1, 3, 4], [3, 0, 4],
    [2, 0, 5], [1, 2, 5], [3, 1, 5], [0, 3, 5],
  ];
  return { vertices: verts, faceIdx: facesIdx, edges: edgesFromFaces(facesIdx), R };
}

function buildTetraData(): PolyData {
  const R = 120;
  const verts: Vec3[] = [
    { x: R, y: R, z: R },
    { x: -R, y: -R, z: R },
    { x: -R, y: R, z: -R },
    { x: R, y: -R, z: -R },
  ];
  const facesIdx = [[0, 1, 2], [0, 3, 1], [0, 2, 3], [1, 3, 2]];
  return { vertices: verts, faceIdx: facesIdx, edges: edgesFromFaces(facesIdx), R };
}

function buildPentaData(): PolyData {
  const R = 115;
  const eqR = R * 0.88;
  const verts: Vec3[] = [
    { x: 0, y: -R, z: 0 },
    { x: 0, y: R, z: 0 },
  ];
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    verts.push({ x: Math.cos(angle) * eqR, y: 0, z: Math.sin(angle) * eqR });
  }
  const facesIdx: number[][] = [];
  for (let i = 0; i < 5; i++) {
    const a = 2 + i;
    const b = 2 + ((i + 1) % 5);
    facesIdx.push([0, b, a]);
    facesIdx.push([1, a, b]);
  }
  return { vertices: verts, faceIdx: facesIdx, edges: edgesFromFaces(facesIdx), R };
}

const ICOSA_DATA = buildIcosaData();
const OCTA_DATA = buildOctaData();
const TETRA_DATA = buildTetraData();
const PENTA_DATA = buildPentaData();

export function getPolyhedron(geometry: GeometryId): PolyData {
  if (geometry === "icosa") return ICOSA_DATA;
  if (geometry === "octa") return OCTA_DATA;
  if (geometry === "penta") return PENTA_DATA;
  return TETRA_DATA;
}

/* Rotate a 3D point: ry first, then rx (matches CSS rotateY * rotateX order). */
export function rotatePoint(p: Vec3, rx: number, ry: number): Vec3 {
  const cy = Math.cos(ry), sy = Math.sin(ry);
  const cx = Math.cos(rx), sx = Math.sin(rx);
  const x1 = p.x * cy + p.z * sy;
  const z1 = -p.x * sy + p.z * cy;
  const y1 = p.y;
  const y2 = y1 * cx - z1 * sx;
  const z2 = y1 * sx + z1 * cx;
  return { x: x1, y: y2, z: z2 };
}
