import * as React from "react";
import type { L, Tooth } from "@/lib/teeth";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Highlights, OrbitState, ViewKey } from "@/components/ToothCanvas";
import { Pill } from "@/components/ui";
import { Eye, EyeOff } from "lucide-react";

const ToothCanvas = React.lazy(() => import("@/components/ToothCanvas"));

const VIEWS: Array<{ key: ViewKey; label: L; badge: string }> = [
  { key: "buccal", label: { it: "Vestibolare", de: "Vestibulär", en: "Vestibular", sq: "Vestibulare" }, badge: "V" },
  { key: "oral", label: { it: "Linguale / palatale", de: "Lingual / palatinal", en: "Lingual / palatal", sq: "Linguale / palatinale" }, badge: "L/P" },
  { key: "mesial", label: { it: "Mesiale", de: "Mesial", en: "Mesial", sq: "Meziale" }, badge: "M" },
  { key: "distal", label: { it: "Distale", de: "Distal", en: "Distal", sq: "Distale" }, badge: "D" },
  { key: "occlusal", label: { it: "Occlusale / incisale", de: "Okklusal / inzisal", en: "Occlusal / incisal", sq: "Okluzale / incizale" }, badge: "O/I" },
  { key: "apical", label: { it: "Apicale", de: "Apikal", en: "Apical", sq: "Apikale" }, badge: "A" },
];

const HIGHLIGHT_KEYS: Array<{ key: keyof Highlights; label: L }> = [
  { key: "cusps", label: { it: "Cuspidi", de: "Höcker", en: "Cusps", sq: "Kuspidët" } },
  { key: "roots", label: { it: "Radici", de: "Wurzeln", en: "Roots", sq: "Rrënjët" } },
  { key: "surfaces", label: { it: "Superfici", de: "Flächen", en: "Surfaces", sq: "Sipërfaqet" } },
  { key: "fissures", label: { it: "Solchi", de: "Furchen", en: "Grooves", sq: "Brazdat" } },
];

const CODE_LABEL: Record<string, L> = {
  V: { it: "Vestibolare", de: "Vestibulär", en: "Vestibular", sq: "Vestibulare" },
  M: { it: "Mesiale", de: "Mesial", en: "Mesial", sq: "Meziale" },
  D: { it: "Distale", de: "Distal", en: "Distal", sq: "Distale" },
  P: { it: "Palatale", de: "Palatinal", en: "Palatal", sq: "Palatinale" },
  L: { it: "Linguale", de: "Lingual", en: "Lingual", sq: "Linguale" },
  "O/I": { it: "Occlusale / incisale", de: "Okklusal / inzisal", en: "Occlusal / incisal", sq: "Okluzale / incizale" },
  A: { it: "Apicale", de: "Apikal", en: "Apical", sq: "Apikale" },
};

const TXT = {
  loading: { it: "Caricamento del modello 3D…", de: "3D-Modell wird geladen…", en: "Loading the 3D model…", sq: "Po ngarkohet modeli 3D…" },
  drag: { it: "Trascina per ruotare · rotella per lo zoom", de: "Ziehen zum Drehen · Scrollen zum Zoomen", en: "Drag to rotate · scroll to zoom", sq: "Tërhiqni për ta rrotulluar · rrotullën për zmadhim" },
  disclaimer: {
    it: "Modello didattico schematico, non in scala e non validato per uso clinico. Forma, radici e reperi sono semplificati; anatomia interna e spessori reali non sono rappresentati.",
    de: "Schematisches Lernmodell, nicht maßstabsgetreu und nicht klinisch validiert. Form, Wurzeln und Landmarken sind vereinfacht; innere Anatomie und reale Gewebedicken fehlen.",
    en: "Schematic teaching model, not to scale and not validated for clinical use. Shape, roots and landmarks are simplified; internal anatomy and real tissue thicknesses are not shown.",
    sq: "Model mësimor skematik, jo në shkallë dhe i pavlerësuar për përdorim klinik. Forma, rrënjët dhe pikat referuese janë thjeshtuar; anatomia e brendshme dhe trashësitë reale nuk paraqiten.",
  },
  views: { it: "Viste", de: "Ansichten", en: "Views", sq: "Pamjet" },
  archToggle: { it: "Mostra o nascondi il contesto dell’arcata", de: "Zahnbogen-Kontext ein- oder ausblenden", en: "Show or hide the dental arch context", sq: "Shfaq ose fshih kontekstin e harkut dentar" },
  hideArch: { it: "Nascondi arcata", de: "Zahnbogen ausblenden", en: "Hide arch", sq: "Fshih harkun" },
  showArch: { it: "Mostra arcata", de: "Zahnbogen einblenden", en: "Show arch", sq: "Shfaq harkun" },
  landmarks: { it: "Reperi", de: "Landmarken", en: "Landmarks", sq: "Pikat referuese" },
  spin: { it: "Rotazione automatica", de: "Automatische Drehung", en: "Auto-rotate", sq: "Rrotullim automatik" },
} satisfies Record<string, L>;

export interface Tooth3DProps {
  tooth: Tooth;
  compact?: boolean;
  orbit?: OrbitState | null;
  onOrbit?: (o: OrbitState) => void;
  selected?: string | null;
  onSelect?: (id: string | null) => void;
}

export function Tooth3D({ tooth, compact = false, orbit, onOrbit, selected, onSelect }: Tooth3DProps) {
  const { loc } = useI18n();
  const [mounted, setMounted] = React.useState(false);
  const [view, setView] = React.useState<ViewKey>("buccal");
  const [code, setCode] = React.useState("V");
  const [spin, setSpin] = React.useState(false);
  const [showLandmarks, setShowLandmarks] = React.useState(true);
  const [showArch, setShowArch] = React.useState(true);
  const [localSelected, setLocalSelected] = React.useState<string | null>(null);
  const [highlights, setHighlights] = React.useState<Highlights>({
    cusps: false,
    roots: false,
    surfaces: false,
    fissures: false,
  });

  React.useEffect(() => setMounted(true), []);

  const sel = selected !== undefined ? selected : localSelected;
  const select = onSelect ?? setLocalSelected;
  const landmark = tooth.landmarks.find((l) => l.id === sel);
  const codeLabel = CODE_LABEL[code];

  return (
    <div className="flex flex-col gap-3">
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border border-border bg-[var(--viewer-bg)] sm:rounded-2xl",
          compact ? "h-[260px] sm:h-[320px]" : "h-[300px] sm:h-[420px]",
        )}
      >
        {mounted ? (
          <React.Suspense fallback={null}>
            <ToothCanvas
              tooth={tooth}
              view={view}
              highlights={highlights}
              showLandmarks={showLandmarks}
              selected={sel ?? null}
              onSelect={select}
              autoSpin={spin}
              showArch={showArch}
              onOrientation={setCode}
              {...(orbit !== undefined ? { orbit } : {})}
              {...(onOrbit ? { onOrbit } : {})}
            />
          </React.Suspense>
        ) : (
          <div className="grid h-full place-items-center text-xs text-muted-foreground">{loc(TXT.loading)}</div>
        )}

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-black text-primary-foreground shadow">
            {code}
          </span>
          <span className="rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-semibold text-foreground shadow">
            {codeLabel ? loc(codeLabel) : code}
          </span>
        </div>
        <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-bold text-primary shadow">
          FDI {tooth.fdi}
        </span>
        <span className="pointer-events-none absolute inset-x-0 bottom-2 text-center text-[11px] text-muted-foreground">
          {loc(TXT.drag)}
        </span>
      </div>

      <p className="text-xs text-muted-foreground">{loc(TXT.disclaimer)}</p>
      {landmark && (
        <div className="rounded-xl border border-border bg-card p-3 text-sm">
          <div className="font-semibold">{loc(landmark.label)}</div>
          <p className="mt-0.5 text-muted-foreground">{loc(landmark.hint)}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5" role="group" aria-label={loc(TXT.views)}>
        {VIEWS.map((v) => (
          <button
            key={v.key}
            type="button"
            onClick={() => setView(v.key)}
            aria-pressed={view === v.key}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition",
              view === v.key
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:border-primary hover:text-primary",
            )}
          >
            <span className="font-black">{v.badge}</span> · {loc(v.label)}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Pill
          active={showArch}
          onClick={() => setShowArch((visible) => !visible)}
          aria-pressed={showArch}
          title={loc(TXT.archToggle)}
        >
          <span className="inline-flex items-center gap-1.5">
            {showArch ? <EyeOff className="h-3.5 w-3.5" aria-hidden="true" /> : <Eye className="h-3.5 w-3.5" aria-hidden="true" />}
            {showArch ? loc(TXT.hideArch) : loc(TXT.showArch)}
          </span>
        </Pill>
        {HIGHLIGHT_KEYS.map((h) => (
          <label
            key={h.key}
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs font-medium"
          >
            <input
              type="checkbox"
              checked={highlights[h.key]}
              onChange={(e) => setHighlights((prev) => ({ ...prev, [h.key]: e.target.checked }))}
              className="accent-[var(--primary)]"
            />
            {loc(h.label)}
          </label>
        ))}
        <label className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs font-medium">
          <input
            type="checkbox"
            checked={showLandmarks}
            onChange={(e) => setShowLandmarks(e.target.checked)}
            className="accent-[var(--primary)]"
          />
          {loc(TXT.landmarks)}
        </label>
        <label className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs font-medium">
          <input type="checkbox" checked={spin} onChange={(e) => setSpin(e.target.checked)} className="accent-[var(--primary)]" />
          {loc(TXT.spin)}
        </label>
      </div>
    </div>
  );
}

export default Tooth3D;
