import * as THREE from "three";
import type { Arch, Side, Tooth } from "./teeth";

export interface ArchSlot {
  position: [number, number, number];
  rotationY: number;
  mirrorX: 1 | -1;
}

const SLOT_X = [0.38, 0.83, 1.31, 1.82, 2.34, 2.88, 3.43, 3.98];

/**
 * Places an FDI tooth on a patient-relative parabolic arch.
 * Patient right sits at negative X (clinical view); the anterior arch is +Z.
 */
export function getArchSlot(tooth: Pick<Tooth, "position" | "side" | "arch">): ArchSlot {
  const sideSign = tooth.side === "right" ? -1 : 1;
  const x = sideSign * (SLOT_X[tooth.position - 1] ?? 0.38);
  const archDepth = tooth.arch === "upper" ? 1.62 : 1.48;
  const curvature = tooth.arch === "upper" ? 0.105 : 0.095;
  const z = archDepth - curvature * x * x;

  return {
    position: [x, 0, z],
    rotationY: Math.atan2(x * 0.34, 1),
    mirrorX: tooth.side === "left" ? -1 : 1,
  };
}

export function getArchTeeth(teeth: Tooth[], arch: Arch): Tooth[] {
  return teeth
    .filter((tooth) => tooth.arch === arch)
    .sort((a, b) => {
      if (a.side !== b.side) return a.side === "right" ? -1 : 1;
      return a.side === "right" ? b.position - a.position : a.position - b.position;
    });
}

export function buildArchCurve(teeth: Tooth[], arch: Arch): THREE.CatmullRomCurve3 {
  const points = getArchTeeth(teeth, arch).map((tooth) => {
    const [x, y, z] = getArchSlot(tooth).position;
    return new THREE.Vector3(x, y + 0.02, z);
  });
  return new THREE.CatmullRomCurve3(points, false, "centripetal");
}

export function mesialDirection(side: Side): 1 | -1 {
  return side === "right" ? 1 : -1;
}
