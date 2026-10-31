import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { useProgress } from "@/lib/progress";
import { TEETH, QUADRANT_LABEL, LANGS } from "@/lib/teeth";
import { SectionTitle, Card, Pill } from "@/components/ui";
import { ClinicalChart } from "@/components/ClinicalChart";
import { Check, Search } from "lucide-react";

export const Route = createFileRoute("/study/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Studio dei denti — DentalMind3D" },
      {
        name: "description",
        content: "Esplora tutti i 32 denti permanenti FDI con modelli interattivi, reperi anatomici e anatomia tipica e variabile.",
      },
      { property: "og:title", content: "Studio dei denti — DentalMind3D" },
      { property: "og:description", content: "32 denti FDI: modelli interattivi, reperi e anatomia tipica/variabile." },
    ],
  }),
  component: StudyIndex,
});

function StudyIndex() {
  const { t, loc } = useI18n();
  const { state } = useProgress();
  const [query, setQuery] = React.useState("");
  const [quadrant, setQuadrant] = React.useState<number | null>(null);

  // Search matches the tooth name in any of the four languages.
  const filtered = TEETH.filter((tooth) => {
    if (quadrant && tooth.quadrant !== quadrant) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return tooth.fdi.includes(q) || LANGS.some((l) => tooth.name[l].toLowerCase().includes(q));
  });

  const doneFdi = TEETH.filter((x) => state.teeth[x.fdi]?.studied).map((x) => x.fdi);

  return (
    <div>
      <SectionTitle title={t("study.title")} subtitle={t("study.subtitle")} />

      <div className="mb-6">
        <ClinicalChart matches={filtered.map((x) => x.fdi)} doneFdi={doneFdi} />
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("study.search")}
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Pill active={quadrant === null} onClick={() => setQuadrant(null)}>
            {t("study.filter.all")}
          </Pill>
          {[1, 2, 3, 4].map((q) => (
            <Pill key={q} active={quadrant === q} onClick={() => setQuadrant(q)}>
              {loc(QUADRANT_LABEL[q]!)}
            </Pill>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="text-sm text-muted-foreground">{t("study.empty")}</Card>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((tooth) => {
            const done = state.teeth[tooth.fdi]?.studied;
            return (
              <Link
                key={tooth.fdi}
                to="/study/$fdi"
                params={{ fdi: tooth.fdi }}
                className="group rounded-2xl border border-border bg-card p-4 transition hover:border-primary hover:shadow-[var(--shadow-soft)]"
              >
                <div className="flex items-start justify-between">
                  <span className="text-2xl font-black text-primary">{tooth.fdi}</span>
                  {done && (
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-primary/12 text-primary">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  )}
                </div>
                <div className="mt-2 text-sm font-semibold leading-tight">{loc(tooth.shortName)}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{loc(tooth.name)}</div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
