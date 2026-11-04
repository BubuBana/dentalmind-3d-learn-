import * as THREE from "three";
import type { Geometry } from "./teeth";
import { CrownModel, crownMesh, rootMeshes, type MeshData } from "./toothShape";

/**
 * three.js wrappers around the pure procedural shapes in toothShape.ts.
 *
 * Local frame: mesial = -x, vestibular = +z, occlusal = +y.
 * Mirror the tooth with scale-x = -mesialDirection(side) so that mesial
 * points to the midline for both sides of the patient.
 */

function toBuffer(m: MeshData): THREE.BufferGeometry {
  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.Float32BufferAttribute(m.positions, 3));
  geom.setAttribute("normal", new THREE.Float32BufferAttribute(m.normals, 3));
  geom.setIndex(m.indices);
  geom.computeBoundingSphere();
  return geom;
}

export type Silhouette = Geometry["silhouette"];

/** Crown: closed surface from the cervical line over the occlusal/incisal relief. */
export function buildCrownGeometry(g: Geometry): THREE.BufferGeometry {
  return toBuffer(crownMesh(g));
}

export interface RootPlacement {
  geometry: THREE.BufferGeometry;
  position: [number, number, number];
  /** apex position in model space, used for markers */
  apex: [number, number, number];
}

/** Root trunk and roots (already positioned in model space). */
export function buildRootGeometries(g: Geometry): RootPlacement[] {
  return rootMeshes(g).map((r) => ({ geometry: toBuffer(r.mesh), position: [0, 0, 0], apex: r.apex }));
}

/** Cusp tips (or the incisal corners) in model space, for highlight markers. */
export function cuspPoints(g: Geometry): Array<[number, number, number]> {
  return new CrownModel(g).cuspTips();
}

/** Developmental grooves on the occlusal table, as polylines. */
export function groovePaths(g: Geometry): Array<Array<[number, number, number]>> {
  return new CrownModel(g).groovePaths();
}

export function modelHeight(g: Geometry): number {
  return g.crownHeight * 1.4 + g.rootLength * 1.35;
}
