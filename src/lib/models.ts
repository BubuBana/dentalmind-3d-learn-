/**
 * Modular 3D model registry.
 *
 * The study/compare viewers render an interactive procedural placeholder today.
 * When real assets are available, register them here (public/models/11.glb, …)
 * and `hasRealModel()` will switch the viewer to the GLB/GLTF loader without
 * touching any screen code.
 */
export interface ModelSource {
  fdi: string;
  url: string;
  credit?: string;
  scale?: number;
}

export const MODEL_REGISTRY: Record<string, ModelSource> = {
  // "16": { fdi: "16", url: "/models/16.glb", credit: "…", scale: 1 },
};

export function getModelSource(fdi: string): ModelSource | null {
  return MODEL_REGISTRY[fdi] ?? null;
}

export function hasRealModel(fdi: string): boolean {
  return Boolean(MODEL_REGISTRY[fdi]);
}
