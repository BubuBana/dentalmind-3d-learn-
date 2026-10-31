import * as React from "react";
import type { Tooth, Landmark } from "@/lib/teeth";
import { useI18n } from "@/lib/i18n";
import { hasRealModel } from "@/lib/models";
import { cn } from "@/lib/utils";

export interface ViewerCamera {
  rotY: number;
  rotX: number;
  zoom: number;
}

export const VIEW_PRESETS: Record<string, ViewerCamera> = {
  buccal: { rotY: 0, rotX: -6, zoom: 1 },
  oral: { rotY: 180, rotX: -6, zoom: 1 },
  mesial: { rotY: -90, rotX: -6, zoom: 1 },
  distal: { rotY: 90, rotX: -6, zoom: 1 },
  occlusal: { rotY: 0, rotX: -78, zoom: 1.05 },
};

const CROWN_LAYERS = 12;
const ROOT_LAYERS = 10;

function crownClip(silhouette: Tooth["geometry"]["silhouette"]): string {
  switch (silhouette) {
    case "blade":
      return "polygon(6% 0%, 94% 0%, 100% 62%, 96% 92%, 50% 100%, 4% 92%, 0% 62%)";
    case "pointed":
      return "polygon(10% 0%, 90% 0%, 100% 55%, 62% 96%, 50% 100%, 38% 96%, 0% 55%)";
    case "premolar":
      return "polygon(10% 8%, 34% 0%, 66% 0%, 90% 8%, 100% 55%, 88% 96%, 12% 96%, 0% 55%)";
    default:
      return "polygon(8% 10%, 26% 0%, 50% 8%, 74% 0%, 92% 10%, 100% 60%, 86% 98%, 14% 98%, 0% 60%)";
  }
}

function Crown({ tooth, size }: { tooth: Tooth; size: number }) {
  const g = tooth.geometry;
  const w = g.crownWidth * size;
  const h = g.crownHeight * size;
  const depth = g.depth * size;
  const clip = crownClip(g.silhouette);
  return (
    <>
      {Array.from({ length: CROWN_LAYERS }).map((_, i) => {
        const p = i / (CROWN_LAYERS - 1);
        const z = (p - 0.5) * depth;
        const bulge = 1 - Math.pow(Math.abs(p - 0.5) * 2, 2) * 0.16;
        const shade = 0.86 + 0.14 * (1 - Math.abs(p - 0.5) * 2);
        return (
          <div
            key={i}
            className="absolute left-1/2 top-1/2"
            style={{
              width: w * bulge,
              height: h,
              marginLeft: -(w * bulge) / 2,
              marginTop: -h / 2 - size * 0.28,
              transform: `translateZ(${z}px)`,
              clipPath: clip,
              background: `linear-gradient(155deg, color-mix(in oklab, var(--tooth-hi) ${shade * 100}%, transparent), var(--tooth-lo))`,
              boxShadow: "inset 0 -6px 14px rgba(0,0,0,.10)",
            }}
          />
        );
      })}
    </>
  );
}

function Root({
  tooth,
  size,
  index,
}: {
  tooth: Tooth;
  size: number;
  index: number;
}) {
  const g = tooth.geometry;
  const n = g.rootCount;
  const len = g.rootLength * size;
  const baseW = (g.crownWidth * size) / Math.max(1, n) * 0.78;
  // spread roots buccal/oral for 2 roots, tripod for 3
  const spread = g.rootSpread * size;
  let offsetX = 0;
  let offsetZ = 0;
  if (n === 2) {
    if (tooth.arch === "upper" && tooth.position <= 5) {
      offsetZ = index === 0 ? spread : -spread;
    } else {
      offsetX = index === 0 ? -spread : spread;
    }
  } else if (n === 3) {
    if (index === 0) {
      offsetX = -spread * 0.8;
      offsetZ = spread * 0.6;
    } else if (index === 1) {
      offsetX = spread * 0.8;
      offsetZ = spread * 0.6;
    } else {
      offsetZ = -spread * 0.9;
    }
  }
  const tiltX = offsetX * 0.12;
  const tiltZ = offsetZ * 0.12;

  return (
    <>
      {Array.from({ length: ROOT_LAYERS }).map((_, i) => {
        const p = i / (ROOT_LAYERS - 1);
        const w = baseW * (1 - p * 0.72);
        const y = size * 0.2 + p * len;
        const shade = 0.9 - p * 0.18;
        return (
          <div
            key={i}
            className="absolute left-1/2 top-1/2"
            style={{
              width: w,
              height: Math.max(10, (len / ROOT_LAYERS) * 2.4),
              marginLeft: -w / 2,
              marginTop: -size * 0.28,
              transform: `translate3d(${offsetX + tiltX * p * 6}px, ${y}px, ${offsetZ + tiltZ * p * 6}px)`,
              borderRadius: "40%",
              background: `linear-gradient(180deg, color-mix(in oklab, var(--root-hi) ${shade * 100}%, transparent), var(--root-lo))`,
            }}
          />
        );
      })}
    </>
  );
}

export function ToothViewer({
  tooth,
  camera,
  onCameraChange,
  showLandmarks,
  onToggleLandmarks,
  selected,
  onSelect,
  autoSpin,
  onToggleSpin,
  compact = false,
}: {
  tooth: Tooth;
  camera: ViewerCamera;
  onCameraChange: (c: ViewerCamera) => void;
  showLandmarks: boolean;
  onToggleLandmarks: (v: boolean) => void;
  selected: string | null;
  onSelect: (id: string | null) => void;
  autoSpin: boolean;
  onToggleSpin: (v: boolean) => void;
  compact?: boolean;
}) {
  const { t, loc } = useI18n();
  const size = compact ? 86 : 118;
  const dragging = React.useRef<{ x: number; y: number } | null>(null);

  React.useEffect(() => {
    if (!autoSpin) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      onCameraChange({ ...camera, rotY: (camera.rotY + dt * 28) % 360 });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoSpin, camera, onCameraChange]);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    dragging.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - dragging.current.x;
    const dy = e.clientY - dragging.current.y;
    dragging.current = { x: e.clientX, y: e.clientY };
    onCameraChange({
      ...camera,
      rotY: camera.rotY + dx * 0.6,
      rotX: Math.max(-90, Math.min(60, camera.rotX - dy * 0.4)),
    });
  };
  const endDrag = () => {
    dragging.current = null;
  };

  const roots = Array.from({ length: tooth.geometry.rootCount });

  const landmarkPos = (l: Landmark) => ({
    x: l.x * tooth.geometry.crownWidth * size * 0.55,
    y: l.y * (tooth.geometry.crownHeight + tooth.geometry.rootLength) * size * 0.52,
    z: l.z * tooth.geometry.depth * size * 0.55,
  });

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative overflow-hidden rounded-2xl border border-border bg-[var(--viewer-bg)] touch-none select-none"
        style={{ height: compact ? 300 : 400 }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,color-mix(in_oklab,var(--primary)_16%,transparent),transparent_60%)]" />
        <div className="absolute left-3 top-3 z-10 rounded-full bg-background/80 px-2.5 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur">
          {hasRealModel(tooth.fdi) ? "GLB" : t("viewer.placeholder")}
        </div>
        <div className="absolute right-3 top-3 z-10 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
          FDI {tooth.fdi}
        </div>

        <div className="absolute inset-0 grid place-items-center" style={{ perspective: 1000 }}>
          <div
            className="relative"
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateX(${camera.rotX}deg) rotateY(${camera.rotY}deg) scale(${camera.zoom})`,
              transition: dragging.current ? "none" : "transform .35s ease",
              width: 1,
              height: 1,
            }}
          >
            <Crown tooth={tooth} size={size} />
            {roots.map((_, i) => (
              <Root key={i} tooth={tooth} size={size} index={i} />
            ))}

            {showLandmarks &&
              tooth.landmarks.map((l) => {
                const p = landmarkPos(l);
                const active = selected === l.id;
                return (
                  <button
                    key={l.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(active ? null : l.id);
                    }}
                    className="absolute left-1/2 top-1/2"
                    style={{
                      transform: `translate3d(${p.x}px, ${p.y - size * 0.28}px, ${p.z}px) rotateY(${-camera.rotY}deg) rotateX(${-camera.rotX}deg)`,
                      transformStyle: "preserve-3d",
                    }}
                    aria-label={loc(l.label)}
                  >
                    <span
                      className={cn(
                        "block h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background transition",
                        active ? "scale-125 bg-primary ring-4 ring-primary/25" : "bg-accent-foreground/70 hover:bg-primary",
                      )}
                    />
                  </button>
                );
              })}
          </div>
        </div>

        {selected && (
          <div className="absolute inset-x-3 bottom-3 z-10 rounded-xl border border-border bg-background/95 p-3 text-sm shadow-lg backdrop-blur">
            <div className="font-semibold text-foreground">
              {loc(tooth.landmarks.find((l) => l.id === selected)!.label)}
            </div>
            <p className="mt-0.5 text-muted-foreground">
              {loc(tooth.landmarks.find((l) => l.id === selected)!.hint)}
            </p>
          </div>
        )}
        {!selected && (
          <div className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-[11px] text-muted-foreground">
            {t("viewer.dragHint")}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {Object.entries(VIEW_PRESETS).map(([key, preset]) => (
          <button
            key={key}
            type="button"
            onClick={() => onCameraChange({ ...preset, zoom: camera.zoom })}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition",
              Math.round(camera.rotY % 360) === preset.rotY && Math.round(camera.rotX) === preset.rotX
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:border-primary/50 hover:text-primary",
            )}
          >
            {t(`viewer.${key}` as never)}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-xs text-muted-foreground">
          {t("viewer.rotate")}
          <input
            type="range"
            min={-180}
            max={180}
            value={((camera.rotY + 540) % 360) - 180}
            onChange={(e) => onCameraChange({ ...camera, rotY: Number(e.target.value) })}
            className="mt-1 w-full accent-[var(--primary)]"
          />
        </label>
        <label className="text-xs text-muted-foreground">
          {t("viewer.tilt")}
          <input
            type="range"
            min={-90}
            max={60}
            value={camera.rotX}
            onChange={(e) => onCameraChange({ ...camera, rotX: Number(e.target.value) })}
            className="mt-1 w-full accent-[var(--primary)]"
          />
        </label>
        <label className="text-xs text-muted-foreground">
          {t("viewer.zoom")}
          <input
            type="range"
            min={60}
            max={180}
            value={camera.zoom * 100}
            onChange={(e) => onCameraChange({ ...camera, zoom: Number(e.target.value) / 100 })}
            className="mt-1 w-full accent-[var(--primary)]"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onCameraChange({ ...(VIEW_PRESETS['buccal'] as ViewerCamera), zoom: 1 })}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary hover:text-primary"
        >
          {t("viewer.reset")}
        </button>
        <label className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs">
          <input type="checkbox" checked={autoSpin} onChange={(e) => onToggleSpin(e.target.checked)} className="accent-[var(--primary)]" />
          {t("viewer.spin")}
        </label>
        <label className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs">
          <input
            type="checkbox"
            checked={showLandmarks}
            onChange={(e) => onToggleLandmarks(e.target.checked)}
            className="accent-[var(--primary)]"
          />
          {t("viewer.showLandmarks")}
        </label>
      </div>
    </div>
  );
}
