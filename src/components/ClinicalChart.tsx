import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { TEETH, QUADRANT_LABEL } from "@/lib/teeth";
import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";

/**
 * FDI chart in clinical (dentist) view:
 * Q1 top-left, Q2 top-right, Q4 bottom-left, Q3 bottom-right.
 */
const QUADRANT_ORDER: Array<{ q: number; corner: string }> = [
  { q: 1, corner: "tl" },
  { q: 2, corner: "tr" },
  { q: 4, corner: "bl" },
  { q: 3, corner: "br" },
];

export function ClinicalViewBadge({ className }: { className?: string }) {
  const { t } = useI18n();
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary",
        className,
      )}
    >
      <Eye className="h-4 w-4" aria-hidden="true" />
      {t("chart.clinicalView")}
    </div>
  );
}

export function ClinicalChart({
  activeFdi,
  matches,
  onPick,
  doneFdi,
}: {
  activeFdi?: string;
  /** when provided, teeth outside this list are dimmed */
  matches?: string[];
  onPick?: (fdi: string) => void;
  doneFdi?: string[];
}) {
  const { t, loc } = useI18n();

  return (
    <section aria-label={t("chart.aria")}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <ClinicalViewBadge />
        <span className="text-xs text-muted-foreground">{t("chart.sideNote")}</span>
      </div>

      <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
        {QUADRANT_ORDER.map(({ q, corner }) => {
          const teeth = TEETH.filter((x) => x.quadrant === q).sort((a, b) =>
            corner === "tl" || corner === "bl" ? b.position - a.position : a.position - b.position,
          );
          const title = QUADRANT_LABEL[q]!;
          return (
            <div key={q} className="bg-card p-3">
              <div
                className={cn(
                  "mb-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground",
                  corner === "tr" || corner === "br" ? "text-right" : "text-left",
                )}
              >
                {loc(title)}
              </div>
              <ul className="flex flex-wrap gap-1.5" dir={corner === "tr" || corner === "br" ? "rtl" : "ltr"}>
                {teeth.map((tooth) => {
                  const dimmed = matches ? !matches.includes(tooth.fdi) : false;
                  const done = doneFdi?.includes(tooth.fdi);
                  const className = cn(
                    "grid h-11 w-11 place-items-center rounded-xl border text-sm font-bold transition",
                    tooth.fdi === activeFdi
                      ? "border-primary bg-primary text-primary-foreground"
                      : done
                        ? "border-primary/50 bg-primary/12 text-primary hover:border-primary"
                        : "border-border bg-background text-foreground hover:border-primary hover:text-primary",
                    dimmed && "opacity-35",
                  );
                  const label = `${tooth.fdi} — ${loc(tooth.name)}`;
                  return (
                    <li key={tooth.fdi} dir="ltr">
                      {onPick ? (
                        <button type="button" onClick={() => onPick(tooth.fdi)} className={className} title={label} aria-label={label}>
                          {tooth.fdi}
                        </button>
                      ) : (
                        <Link
                          to="/study/$fdi"
                          params={{ fdi: tooth.fdi }}
                          className={className}
                          title={label}
                          aria-label={label}
                        >
                          {tooth.fdi}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default ClinicalChart;
