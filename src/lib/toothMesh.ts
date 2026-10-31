import * as THREE from "three";
import type { Geometry } from "./teeth";

/**
 * Procedural, fully volumetric tooth meshes.
 *
 * Everything is a closed lofted surface built from the per-tooth geometry data:
 * a crown with a real cervical constriction, an occlusal/incisal relief with
 * cusps and a central fossa, and tapering, curved roots. No planes, no cards.
 * The meshes are schematic: anatomical facts come from anatomyFacts.ts/teeth.ts.
 */

const SEG = 72;
const BODY_RINGS = 24;
const CAP_RINGS = 10;
const ROOT_SEG = 40;
const ROOT_RINGS = 22;

/** cervix -> occlusal width profile (fraction of the maximum crown radius) */
const WIDTH_PROFILE: Array<[number, number]> = [
  [0, 0.6],
  [0.12, 0.72],
  [0.3, 0.94],
  [0.5, 1],
  [0.72, 0.99],
  [0.9, 0.93],
  [1, 0.85],
];

function profileAt(v: number): number {
  const p = WIDTH_PROFILE;
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[i]!;
    const b = p[i + 1]!;
    if (v <= b[0]) {
      const tRaw = (v - a[0]) / (b[0] - a[0] || 1);
      const t = tRaw * tRaw * (3 - 2 * tRaw);
      return a[1] + (b[1] - a[1]) * t;
    }
  }
  return p[p.length - 1]![1];
}

export type Silhouette = Geometry["silhouette"];

/** cusp relief: rf = 1 at the crown periphery, 0 at the centre of the table */
function occlusalRelief(g: Geometry, rf: number, theta: number): number {
  const h = g.crownHeight;
  switch (g.silhouette) {
    case "blade": {
      // incisal edge: nearly flat, slightly higher towards the mesio-distal ends
      const edge = 0.02 * h * Math.abs(Math.cos(theta));
      return -0.03 * h * (1 - rf) + edge * rf;
    }
    case "pointed": {
      // single cusp tip in the middle of the table
      return 0.34 * h * Math.pow(1 - rf, 1.4);
    }
    case "premolar": {
      const n = Math.max(2, g.cuspCount);
      const peaks = 0.5 + 0.5 * Math.cos(n * theta);
      const fossa = 0.1 * h;
      return -fossa + (0.2 * h * peaks + fossa) * Math.pow(rf, 0.85);
    }
    default: {
      const n = Math.max(3, g.cuspCount);
      const peaks = 0.5 + 0.5 * Math.cos(n * theta + Math.PI / n);
      const fossa = 0.12 * h;
      return -fossa + (0.17 * h * peaks + fossa) * Math.pow(rf, 0.8);
    }
  }
}

function gridIndices(indices: number[], rings: number, seg: number, offset = 0) {
  for (let i = 0; i < rings; i++) {
    for (let j = 0; j < seg; j++) {
      const a = offset + i * (seg + 1) + j;
      const b = a + seg + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
}

/** Crown: closed volume from the cervical line up to the occlusal/incisal relief. */
export function buildCrownGeometry(g: Geometry): THREE.BufferGeometry {
  const h = g.crownHeight;
  const rx = g.crownWidth / 2;
  const rz = g.depth / 2;
  const pos: number[] = [];
  const idx: number[] = [];

  const push = (x: number, y: number, z: number) => pos.push(x, y, z);

  // body: cervix (v = 0) -> occlusal margin (v = 1)
  for (let i = 0; i <= BODY_RINGS; i++) {
    const v = i / BODY_RINGS;
    const s = profileAt(v);
    for (let j = 0; j <= SEG; j++) {
      const theta = (j / SEG) * Math.PI * 2;
      push(rx * s * Math.cos(theta), v * h, rz * s * Math.sin(theta));
    }
  }
  gridIndices(idx, BODY_RINGS, SEG);

  // occlusal / incisal table
  const capStart = (BODY_RINGS + 1) * (SEG + 1);
  const sTop = profileAt(1);
  for (let k = 0; k <= CAP_RINGS; k++) {
    const rf = 1 - k / CAP_RINGS;
    for (let j = 0; j <= SEG; j++) {
      const theta = (j / SEG) * Math.PI * 2;
      const r = sTop * rf;
      push(rx * r * Math.cos(theta), h + occlusalRelief(g, rf, theta), rz * r * Math.sin(theta));
    }
  }
  gridIndices(idx, CAP_RINGS, SEG, capStart);

  // cervical closing disc
  const baseCenter = pos.length / 3;
  push(0, 0, 0);
  const s0 = profileAt(0);
  const ringStart = pos.length / 3;
  for (let j = 0; j <= SEG; j++) {
    const theta = (j / SEG) * Math.PI * 2;
    push(rx * s0 * Math.cos(theta), 0, rz * s0 * Math.sin(theta));
  }
  for (let j = 0; j < SEG; j++) idx.push(baseCenter, ringStart + j + 1, ringStart + j);

  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geom.setIndex(idx);
  geom.computeVertexNormals();
  return geom;
}

export interface RootPlacement {
  geometry: THREE.BufferGeometry;
  position: [number, number, number];
  /** apex position in model space, used for markers */
  apex: [number, number, number];
}

/**
 * Root positions in model space (x = mesio-distal, z = buccal(+)/oral(-)).
 * 2 roots: molars mesial+distal, premolars buccal+palatal.
 * 3 roots (upper molars): mesiobuccal, distobuccal, palatal.
 */
function rootOffsets(g: Geometry): Array<[number, number]> {
  const dx = (g.crownWidth / 2) * 0.42;
  const dz = (g.depth / 2) * 0.42;
  switch (g.rootCount) {
    case 1:
      return [[0, 0]];
    case 2:
      return g.silhouette === "molar"
        ? [
            [dx, 0],
            [-dx, 0],
          ]
        : [
            [0, dz],
            [0, -dz],
          ];
    default:
      return [
        [dx, dz],
        [-dx, dz],
        [0, -dz * 1.15],
      ];
  }
}

function buildSingleRoot(g: Geometry, ox: number, oz: number): RootPlacement {
  // The palatal root of upper molars is the longest of the three.
  const palatal = g.rootCount >= 3 && oz < 0;
  const L = g.rootLength * 1.35 * (palatal ? 1.08 : 1);
  const spread = g.rootSpread;
  const fused = g.rootCount === 1 && g.silhouette === "molar";
  const baseR = (Math.min(g.crownWidth, g.depth) / 2) * (g.rootCount > 1 ? 0.42 : fused ? 0.82 : 0.72);
  const pos: number[] = [];
  const idx: number[] = [];
  const dirX = ox === 0 ? 0 : Math.sign(ox);
  const dirZ = oz === 0 ? 0 : Math.sign(oz);

  let apex: [number, number, number] = [0, -L, 0];
  for (let i = 0; i <= ROOT_RINGS; i++) {
    const u = i / ROOT_RINGS;
    const r = Math.max(0.008, baseR * Math.pow(1 - u, 0.55) * (1 - 0.12 * Math.sin(Math.PI * u)));
    const y = -u * L;
    const bendX = dirX * spread * u * u * 0.9 + (dirX === 0 && dirZ === 0 ? spread * u * u * 0.25 : 0);
    const bendZ = dirZ * spread * u * u * 0.8;
    if (i === ROOT_RINGS) apex = [bendX, y, bendZ];
    for (let j = 0; j <= ROOT_SEG; j++) {
      const theta = (j / ROOT_SEG) * Math.PI * 2;
      pos.push(bendX + r * Math.cos(theta), y, bendZ + r * 0.86 * Math.sin(theta));
    }
  }
  gridIndices(idx, ROOT_RINGS, ROOT_SEG);

  // apical closing point
  const tip = pos.length / 3;
  pos.push(apex[0], apex[1] - 0.02, apex[2]);
  const lastRing = ROOT_RINGS * (ROOT_SEG + 1);
  for (let j = 0; j < ROOT_SEG; j++) idx.push(tip, lastRing + j, lastRing + j + 1);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geometry.setIndex(idx);
  geometry.computeVertexNormals();

  return {
    geometry,
    position: [ox, 0.02, oz],
    apex: [ox + apex[0], apex[1], oz + apex[2]],
  };
}

export function buildRootGeometries(g: Geometry): RootPlacement[] {
  return rootOffsets(g).map(([ox, oz]) => buildSingleRoot(g, ox, oz));
}

/** Cusp tips (or the incisal edge points) in model space, for highlight markers. */
export function cuspPoints(g: Geometry): Array<[number, number, number]> {
  const rx = (g.crownWidth / 2) * profileAt(1) * 0.72;
  const rz = (g.depth / 2) * profileAt(1) * 0.72;
  const out: Array<[number, number, number]> = [];
  if (g.silhouette === "pointed") return [[0, g.crownHeight + 0.34 * g.crownHeight, 0]];
  if (g.silhouette === "blade") {
    return [
      [rx * 0.8, g.crownHeight, 0],
      [-rx * 0.8, g.crownHeight, 0],
    ];
  }
  const n = Math.max(2, g.cuspCount);
  const phase = g.silhouette === "molar" ? -Math.PI / n : 0;
  for (let i = 0; i < n; i++) {
    const theta = phase + (i * Math.PI * 2) / n;
    out.push([rx * Math.cos(theta), g.crownHeight + occlusalRelief(g, 0.72, theta), rz * Math.sin(theta)]);
  }
  return out;
}

/** Central fissure / groove polyline on the occlusal table. */
export function fissurePoints(g: Geometry): Array<[number, number, number]> {
  const rx = (g.crownWidth / 2) * profileAt(1) * 0.66;
  const pts: Array<[number, number, number]> = [];
  const n = 24;
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const x = -rx + 2 * rx * u;
    const theta = x >= 0 ? 0 : Math.PI;
    const rf = Math.abs(x) / (rx || 1);
    pts.push([x, g.crownHeight + occlusalRelief(g, rf * 0.9, theta) + 0.012, 0]);
  }
  return pts;
}

export function modelHeight(g: Geometry): number {
  return g.crownHeight * 1.4 + g.rootLength * 1.35;
}
