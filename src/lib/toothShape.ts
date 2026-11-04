import type { Geometry } from "./teeth";

/**
 * Pure (three.js-free) procedural tooth geometry.
 *
 * Local frame of every tooth (before mirroring for the patient side):
 *   x: mesial (-) → distal (+)
 *   y: apical (-) → occlusal/incisal (+); the cervical line is around y = 0
 *   z: oral (-) → vestibular (+)
 * Units: 1 = 10 mm. Proportions come from the average measurements table.
 */

export interface MeshData {
  positions: number[];
  indices: number[];
  normals: number[];
}

interface Cusp {
  u: number; // mesio-distal position, -1 (mesial) … 1 (distal)
  w: number; // oral (-1) … vestibular (1)
  a: number; // height, fraction of crown height
  su: number; // spread along u
  sw: number; // spread along w
}

type Pt = [number, number];
type Groove = Pt[];

interface CrownSpec {
  /** superellipse exponent of the cross-section (2 = ellipse, higher = squarer) */
  n: number;
  /** oral half is this fraction of the vestibular half (bucco-lingual taper) */
  oral: number;
  /** mesial shift of the vestibular side (rhomboid outline of upper molars) */
  shear: number;
  /** anterior tooth (blade-like crown, incisal edge) */
  anterior: boolean;
  /** incisal-edge rounding of the mesial and distal corners (fraction of height) */
  roundM: number;
  roundD: number;
  /** canine cusp tip */
  tip?: { u: number; a: number };
  cusps: Cusp[];
  grooves: Groove[];
  /** lingual tilt of the occlusal table (lower first premolar) */
  tilt: number;
  /** height of the cervical line curve on proximal surfaces (units) */
  cej: number;
}

const C = (u: number, w: number, a: number, su = 0.42, sw = 0.42): Cusp => ({ u, w, a, su, sw });

function spec(kind: string): CrownSpec {
  const base: CrownSpec = { n: 2.3, oral: 0.9, shear: 0, anterior: false, roundM: 0, roundD: 0, cusps: [], grooves: [], tilt: 0, cej: 0.08 };
  switch (kind) {
    case "upper:centralIncisor":
      return { ...base, n: 2.4, oral: 0.85, anterior: true, roundM: 0.03, roundD: 0.16, cej: 0.32 };
    case "upper:lateralIncisor":
      return { ...base, n: 2.2, oral: 0.85, anterior: true, roundM: 0.1, roundD: 0.28, cej: 0.28 };
    case "lower:centralIncisor":
      return { ...base, n: 2.4, oral: 0.85, anterior: true, roundM: 0.03, roundD: 0.04, cej: 0.28 };
    case "lower:lateralIncisor":
      return { ...base, n: 2.4, oral: 0.85, anterior: true, roundM: 0.04, roundD: 0.1, cej: 0.28 };
    case "upper:canine":
      return { ...base, n: 2.1, oral: 0.9, anterior: true, tip: { u: -0.1, a: 0.3 }, cej: 0.25 };
    case "lower:canine":
      return { ...base, n: 2.1, oral: 0.85, anterior: true, tip: { u: -0.05, a: 0.22 }, cej: 0.24 };
    case "upper:firstPremolar":
      return {
        ...base, n: 2.2, oral: 0.85, cej: 0.1,
        cusps: [C(0.12, 0.5, 0.34, 0.5, 0.42), C(0, -0.5, 0.24, 0.45, 0.38)],
        grooves: [[[-0.75, 0], [0.7, 0.02]], [[-0.75, 0], [-0.98, 0.05]]],
      };
    case "upper:secondPremolar":
      return {
        ...base, n: 2.2, oral: 0.9, cej: 0.1,
        cusps: [C(0, 0.5, 0.28, 0.5, 0.42), C(0, -0.5, 0.26, 0.5, 0.4)],
        grooves: [[[-0.45, 0], [0.45, 0]]],
      };
    case "lower:firstPremolar":
      return {
        ...base, n: 2.1, oral: 0.65, tilt: 0.14, cej: 0.1,
        cusps: [C(0, 0.3, 0.36, 0.55, 0.5), C(0, -0.62, 0.1, 0.35, 0.3)],
        grooves: [[[-0.2, -0.2], [-0.6, -0.85]]],
      };
    case "lower:secondPremolar":
      return {
        ...base, n: 2.4, oral: 0.95, tilt: 0.04, cej: 0.1,
        cusps: [C(0, 0.45, 0.28, 0.55, 0.42), C(-0.38, -0.5, 0.22, 0.32, 0.35), C(0.42, -0.5, 0.15, 0.3, 0.32)],
        grooves: [[[-0.65, 0.02], [0, -0.05], [0.65, 0.02]], [[0, -0.05], [0.08, -0.85]]],
      };
    case "upper:firstMolar":
      return {
        ...base, n: 3, oral: 0.95, shear: 0.14, cej: 0.06,
        cusps: [C(-0.45, 0.5, 0.24), C(0.42, 0.5, 0.2, 0.38, 0.4), C(-0.32, -0.48, 0.28, 0.55, 0.5), C(0.52, -0.55, 0.15, 0.35, 0.35)],
        grooves: [
          [[-0.78, -0.05], [-0.05, 0.08]],
          [[-0.05, 0.08], [0.02, 0.92]],
          [[0.28, -0.12], [0.6, -0.4], [0.82, -0.8]],
        ],
      };
    case "upper:secondMolar":
      return {
        ...base, n: 3, oral: 0.88, shear: 0.2, cej: 0.06,
        cusps: [C(-0.45, 0.5, 0.24), C(0.42, 0.5, 0.17, 0.35, 0.38), C(-0.3, -0.45, 0.27, 0.58, 0.5), C(0.55, -0.55, 0.09, 0.3, 0.3)],
        grooves: [
          [[-0.78, -0.05], [-0.05, 0.08]],
          [[-0.05, 0.08], [0.02, 0.92]],
          [[0.3, -0.1], [0.7, -0.7]],
        ],
      };
    case "upper:thirdMolar":
      return {
        ...base, n: 2.6, oral: 0.75, shear: 0.18, cej: 0.06,
        cusps: [C(-0.4, 0.5, 0.22), C(0.42, 0.5, 0.15), C(-0.1, -0.5, 0.25, 0.6, 0.45)],
        grooves: [[[-0.7, 0], [0.5, 0.05]], [[0, 0.05], [0.05, 0.9]]],
      };
    case "lower:firstMolar":
      return {
        ...base, n: 2.8, oral: 0.88, cej: 0.06,
        cusps: [
          C(-0.55, 0.5, 0.2, 0.36, 0.42),
          C(0.05, 0.55, 0.18, 0.34, 0.4),
          C(0.68, 0.32, 0.13, 0.26, 0.32),
          C(-0.5, -0.5, 0.25, 0.38, 0.42),
          C(0.25, -0.5, 0.22, 0.38, 0.42),
        ],
        grooves: [
          [[-0.82, 0], [-0.25, 0.05], [0.42, 0.02], [0.8, -0.05]],
          [[-0.25, 0.05], [-0.25, 0.92]],
          [[0.42, 0.02], [0.5, 0.85]],
          [[-0.12, 0.02], [-0.12, -0.92]],
        ],
      };
    case "lower:secondMolar":
      return {
        ...base, n: 2.9, oral: 0.9, cej: 0.06,
        cusps: [C(-0.45, 0.5, 0.2), C(0.45, 0.5, 0.18), C(-0.45, -0.5, 0.24), C(0.45, -0.5, 0.22)],
        grooves: [[[-0.82, 0], [0.82, 0]], [[0, 0], [0, 0.92]], [[0, 0], [0, -0.92]]],
      };
    case "lower:thirdMolar":
    default:
      return {
        ...base, n: 2.6, oral: 0.88, cej: 0.06,
        cusps: [C(-0.45, 0.5, 0.18), C(0.42, 0.45, 0.15), C(-0.45, -0.5, 0.22), C(0.4, -0.5, 0.17), C(0.1, 0.05, 0.05, 0.25, 0.25)],
        grooves: [[[-0.8, 0.05], [0, -0.05], [0.8, 0.05]], [[0, -0.05], [-0.05, 0.85]], [[0, -0.05], [0.05, -0.85]]],
      };
  }
}

const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};
const bump = (c: number, w: number, x: number) => Math.exp(-((x - c) * (x - c)) / (w * w));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function segDist(p: Pt, a: Pt, b: Pt): number {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const l2 = dx * dx + dy * dy || 1e-9;
  const t = Math.min(1, Math.max(0, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l2));
  const ex = a[0] + t * dx - p[0];
  const ey = a[1] + t * dy - p[1];
  return Math.sqrt(ex * ex + ey * ey);
}

/** Everything needed to evaluate one crown. */
export class CrownModel {
  readonly s: CrownSpec;
  readonly H: number;
  readonly rx: number;
  readonly rz: number;
  readonly cx: number;
  readonly cz: number;

  constructor(readonly g: Geometry) {
    this.s = spec(g.kind ?? "lower:firstMolar");
    this.H = g.crownHeight;
    this.rx = g.crownWidth / 2;
    this.rz = g.depth / 2;
    this.cx = g.cervixX ?? 0.75;
    this.cz = g.cervixZ ?? 0.85;
  }

  /** width profiles: proximal contour high (incisal/occlusal third), facial/lingual contour low (cervical third) */
  private profX(v: number) {
    const peak = this.s.anterior ? 0.72 : 0.68;
    return v < peak ? lerp(this.cx, 1, smooth(0, peak, v) ** 0.8) : lerp(1, 0.9, smooth(peak, 1, v));
  }

  private profZ(v: number) {
    const peak = 0.3;
    const top = this.s.anterior ? 0.32 : 0.86;
    return v < peak ? lerp(this.cz, 1, smooth(0, peak, v)) : lerp(1, top, smooth(peak, 1, v) ** (this.s.anterior ? 0.8 : 1.4));
  }

  /** cross-section point at angle theta and height fraction v (no height) */
  outline(theta: number, v: number): Pt {
    const s = this.s;
    const c = Math.cos(theta);
    const sn = Math.sin(theta);
    const e = 2 / s.n;
    let x = this.rx * this.profX(v) * Math.sign(c) * Math.abs(c) ** e;
    let zr = this.rz * this.profZ(v);
    if (sn < 0) zr *= s.oral;
    let z = zr * Math.sign(sn) * Math.abs(sn) ** e;
    // proximal surfaces converge towards the oral side on posterior teeth
    if (!s.anterior && sn < 0) x *= 1 - 0.08 * -sn;
    if (s.anterior && sn < 0) {
      // lingual fossa between the marginal ridges, cingulum in the cervical third
      const centre = 1 - Math.abs(c) ** 2;
      z *= 1 - 0.35 * centre * bump(0.62, 0.2, v) + 0.18 * centre * bump(0.18, 0.1, v);
    }
    if (s.shear) x -= s.shear * (z / this.rz) * this.rx;
    return [x, z];
  }

  /** height above the crown top for an occlusal-table point (normalised u, w) */
  table(u: number, w: number): number {
    const s = this.s;
    const H = this.H;
    if (s.anterior) {
      let h = -s.roundM * H * smooth(0.45, 1, -u) ** 1.6 - s.roundD * H * smooth(0.45, 1, u) ** 1.6;
      if (s.tip) {
        const d = Math.abs(u - s.tip.u);
        h += s.tip.a * H * Math.max(0, 1 - d / 1.15) ** 1.2;
      }
      return h - 0.04 * H * Math.max(0, -w);
    }
    const r2 = Math.min(1, u * u + w * w);
    let h = -0.12 * H * (1 - r2) + 0.05 * H * smooth(0.72, 1, Math.sqrt(r2)) + s.tilt * H * w;
    for (const k of s.cusps) {
      h += k.a * H * Math.exp(-((u - k.u) ** 2) / (k.su * k.su) - ((w - k.w) ** 2) / (k.sw * k.sw));
    }
    for (const gr of s.grooves) {
      let d = 9;
      for (let i = 0; i < gr.length - 1; i++) d = Math.min(d, segDist([u, w], gr[i]!, gr[i + 1]!));
      h -= 0.055 * H * Math.exp(-(d * d) / 0.006);
    }
    return h;
  }

  /** normalised table coordinates of a point on the top outline */
  norm(x: number, z: number): Pt {
    const xs = x + (this.s.shear ? this.s.shear * (z / this.rz) * this.rx : 0);
    return [xs / (this.rx * this.profX(1)), z / (this.rz * this.profZ(1) * (z < 0 ? this.s.oral : 1))];
  }

  /** cervical-line height at angle theta (rises on the proximal surfaces) */
  cejY(theta: number) {
    return this.s.cej * Math.cos(theta) ** 2;
  }

  /** point on the occlusal surface for normalised (u, w) inside the outline */
  tablePoint(u: number, w: number): [number, number, number] {
    // find the outline point in that direction and scale
    const theta = Math.atan2(w, u);
    const rf = Math.min(1, Math.hypot(u, w));
    const [ox, oz] = this.outline(theta, 1);
    const x = ox * rf;
    const z = oz * rf;
    const [nu, nw] = this.norm(x, z);
    return [x, this.H + this.table(nu, nw), z];
  }

  cuspTips(): Array<[number, number, number]> {
    if (this.s.tip) return [this.tablePoint(this.s.tip.u * 0.8, 0)];
    if (this.s.anterior) return [this.tablePoint(-0.75, 0), this.tablePoint(0.75, 0)];
    return this.s.cusps.map((k) => this.tablePoint(k.u * 0.9, k.w * 0.9));
  }

  groovePaths(): Array<Array<[number, number, number]>> {
    return this.s.grooves.map((gr) => {
      const out: Array<[number, number, number]> = [];
      for (let i = 0; i < gr.length - 1; i++) {
        const a = gr[i]!;
        const b = gr[i + 1]!;
        for (let k = 0; k <= 10; k++) {
          if (i > 0 && k === 0) continue;
          const t = k / 10;
          const p = this.tablePoint(lerp(a[0], b[0], t) * 0.95, lerp(a[1], b[1], t) * 0.95);
          out.push([p[0], p[1] + 0.006, p[2]]);
        }
      }
      return out;
    });
  }
}

/** Compute smooth normals, welding vertices that share a position (seams, poles). */
export function withNormals(positions: number[], indices: number[]): MeshData {
  const n = positions.length / 3;
  const key = (i: number) =>
    `${Math.round(positions[i * 3]! * 1e5)},${Math.round(positions[i * 3 + 1]! * 1e5)},${Math.round(positions[i * 3 + 2]! * 1e5)}`;
  const group = new Map<string, number>();
  const rep = new Array<number>(n);
  for (let i = 0; i < n; i++) {
    const k = key(i);
    const g = group.get(k);
    if (g === undefined) {
      group.set(k, i);
      rep[i] = i;
    } else rep[i] = g;
  }
  const acc = new Float64Array(n * 3);
  for (let f = 0; f < indices.length; f += 3) {
    const [a, b, c] = [indices[f]!, indices[f + 1]!, indices[f + 2]!];
    const ax = positions[a * 3]!, ay = positions[a * 3 + 1]!, az = positions[a * 3 + 2]!;
    const e1 = [positions[b * 3]! - ax, positions[b * 3 + 1]! - ay, positions[b * 3 + 2]! - az];
    const e2 = [positions[c * 3]! - ax, positions[c * 3 + 1]! - ay, positions[c * 3 + 2]! - az];
    const nx = e1[1]! * e2[2]! - e1[2]! * e2[1]!;
    const ny = e1[2]! * e2[0]! - e1[0]! * e2[2]!;
    const nz = e1[0]! * e2[1]! - e1[1]! * e2[0]!;
    for (const v of [a, b, c]) {
      const r = rep[v]!;
      acc[r * 3] = acc[r * 3]! + nx;
      acc[r * 3 + 1] = acc[r * 3 + 1]! + ny;
      acc[r * 3 + 2] = acc[r * 3 + 2]! + nz;
    }
  }
  const normals: number[] = new Array(n * 3);
  for (let i = 0; i < n; i++) {
    const r = rep[i]!;
    const x = acc[r * 3]!, y = acc[r * 3 + 1]!, z = acc[r * 3 + 2]!;
    const l = Math.hypot(x, y, z) || 1;
    normals[i * 3] = x / l;
    normals[i * 3 + 1] = y / l;
    normals[i * 3 + 2] = z / l;
  }
  return { positions, indices, normals };
}

function grid(indices: number[], rings: number, seg: number, offset = 0) {
  for (let i = 0; i < rings; i++) {
    for (let j = 0; j < seg; j++) {
      const a = offset + i * (seg + 1) + j;
      const b = a + seg + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
}

const SEG = 96;
const BODY = 36;
const CAP = 18;

/** Crown: one continuous surface from the cervical line over the occlusal table. */
export function crownMesh(g: Geometry): MeshData {
  const m = new CrownModel(g);
  const pos: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= BODY; i++) {
    const v = i / BODY;
    for (let j = 0; j <= SEG; j++) {
      const theta = (j / SEG) * Math.PI * 2;
      const [x, z] = m.outline(theta, v);
      const [tx, tz] = m.outline(theta, 1);
      const rim = m.table(...m.norm(tx, tz));
      const y = lerp(m.cejY(theta), m.H, v) + smooth(0.45, 1, v) * rim;
      pos.push(x, y, z);
    }
  }
  for (let k = 1; k <= CAP; k++) {
    const rf = 1 - k / CAP;
    for (let j = 0; j <= SEG; j++) {
      const theta = (j / SEG) * Math.PI * 2;
      const [tx, tz] = m.outline(theta, 1);
      const x = tx * rf;
      const z = tz * rf;
      pos.push(x, m.H + m.table(...m.norm(x, z)), z);
    }
  }
  grid(idx, BODY + CAP, SEG);
  // close the cervical opening (hidden inside the root, avoids see-through gaps)
  const centre = pos.length / 3;
  pos.push(0, 0, 0);
  for (let j = 0; j < SEG; j++) idx.push(centre, j, j + 1);
  return withNormals(pos, idx);
}

export interface RootPart {
  mesh: MeshData;
  apex: [number, number, number];
}

interface RootDef {
  ox: number; // centre offset, fraction of cervical half-width (x) / half-depth (z)
  oz: number;
  rx: number; // radii, fraction of cervical half-width / half-depth
  rz: number;
  len: number; // fraction of the root length
}

function rootDefs(g: Geometry): RootDef[] {
  const kind = g.kind ?? "";
  if (g.rootCount >= 3) {
    return [
      { ox: -0.45, oz: 0.45, rx: 0.38, rz: 0.48, len: 0.95 },
      { ox: 0.45, oz: 0.45, rx: 0.32, rz: 0.42, len: 0.88 },
      { ox: 0, oz: -0.5, rx: 0.45, rz: 0.42, len: 1.05 },
    ];
  }
  if (g.rootCount === 2 && kind.startsWith("upper")) {
    return [
      { ox: 0, oz: 0.45, rx: 0.86, rz: 0.48, len: 1 },
      { ox: 0, oz: -0.45, rx: 0.8, rz: 0.45, len: 0.95 },
    ];
  }
  if (g.rootCount === 2) {
    return [
      { ox: -0.52, oz: 0, rx: 0.42, rz: 0.86, len: 1 },
      { ox: 0.52, oz: 0, rx: 0.4, rz: 0.8, len: 0.92 },
    ];
  }
  return [{ ox: 0, oz: 0, rx: 0.97, rz: 0.97, len: 1 }];
}

const RS = 48;
const RR = 30;

function tube(
  ring: (t: number) => { cx: number; cy: number; cz: number; rx: number; rz: number; rzo?: number },
  rings: number,
  closeBottom: boolean,
): MeshData {
  const pos: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= rings; i++) {
    const r = ring(i / rings);
    for (let j = 0; j <= RS; j++) {
      const th = (j / RS) * Math.PI * 2;
      const sn = Math.sin(th);
      pos.push(r.cx + r.rx * Math.cos(th), r.cy, r.cz + (sn < 0 ? (r.rzo ?? r.rz) : r.rz) * sn);
    }
  }
  grid(idx, rings, RS);
  // the tube runs downwards, so flip the winding to keep normals outward
  for (let f = 0; f < idx.length; f += 3) {
    const t = idx[f + 1]!;
    idx[f + 1] = idx[f + 2]!;
    idx[f + 2] = t;
  }
  if (closeBottom) {
    const last = ring(1);
    const tip = pos.length / 3;
    pos.push(last.cx, last.cy - 0.01, last.cz);
    const base = rings * (RS + 1);
    for (let j = 0; j < RS; j++) idx.push(tip, base + j, base + j + 1);
  }
  return withNormals(pos, idx);
}

/** Roots: a common trunk below the cervix, then the individual roots. */
export function rootMeshes(g: Geometry): RootPart[] {
  const m = new CrownModel(g);
  const r0x = m.rx * m.cx * 0.97;
  const r0z = m.rz * m.cz * 0.97;
  const L = g.rootLength * 1.35;
  const top = (m.s.cej || 0) + 0.04;
  const defs = rootDefs(g);
  // oral half of the cervix is narrower; the root top must stay inside the crown
  const oral = m.s.oral * (m.s.anterior ? 0.85 : 1);
  const distalCurve = 0.06 + 0.06 * (g.rootSpread > 0 ? 1 : 0);
  const parts: RootPart[] = [];

  if (defs.length === 1) {
    const d = defs[0]!;
    const fused = g.silhouette === "molar";
    const mesh = tube((t) => {
      const y = lerp(top, -L, t);
      const below = Math.min(1, Math.max(0, -y) / L);
      const f = Math.max(0.05, (1 - below) ** (fused ? 0.5 : 0.62) * (1 - 0.1 * Math.sin(Math.PI * below)));
      const k = y > 0 ? 1 : f;
      return { cx: distalCurve * below ** 2.5, cy: y, cz: 0, rx: r0x * d.rx * k, rz: r0z * d.rz * k, rzo: r0z * d.rz * k * lerp(oral, 1, below) };
    }, RR, true);
    parts.push({ mesh, apex: [distalCurve, -L, 0] });
    return parts;
  }

  const trunk = (g.rootCount >= 3 ? 0.24 : g.silhouette === "molar" ? 0.26 : 0.45) * L;
  parts.push({
    mesh: tube((t) => {
      const y = lerp(top, -trunk - 0.05, t);
      const f = 1 - 0.08 * smooth(0, trunk, -y);
      return { cx: 0, cy: y, cz: 0, rx: r0x * f, rz: r0z * f, rzo: r0z * f * oral };
    }, 10, false),
    apex: [0, -trunk, 0],
  });

  const spread = (g.silhouette === "molar" ? 0.05 : 0.03) + g.rootSpread * 0.28;
  for (const d of defs) {
    const len = L * d.len;
    const ox = d.ox * r0x;
    const oz = d.oz * r0z;
    const dir = Math.hypot(d.ox, d.oz) || 1;
    const start = -trunk + 0.06;
    let apex: [number, number, number] = [ox, -len, oz];
    const mesh = tube((t) => {
      const y = lerp(start, -len, t);
      const u = Math.min(1, Math.max(0, (y - start) / (-len - start)));
      const f = Math.max(0.06, (1 - u) ** 0.55 * (1 - 0.08 * Math.sin(Math.PI * u)));
      const div = spread * Math.sin(Math.min(1, u * 1.6) * Math.PI * 0.5) * (1 - 0.35 * u);
      const cx = ox + (d.ox / dir) * div + distalCurve * u ** 2.5;
      const cz = oz + (d.oz / dir) * div;
      if (t === 1) apex = [cx, y, cz];
      return { cx, cy: y, cz, rx: r0x * d.rx * f, rz: r0z * d.rz * f };
    }, RR, true);
    parts.push({ mesh, apex });
  }
  return parts;
}
