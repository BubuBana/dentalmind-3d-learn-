import * as React from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { useProgress } from "@/lib/progress";
import { TEETH, getTooth } from "@/lib/teeth";
import { Tooth3D } from "@/components/Tooth3D";
import { Card, TypicalVariable } from "@/components/ui";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Check, Brain } from "lucide-react";

export const Route = createFileRoute("/study/$fdi")({
  loader: ({ params }) => {
    const tooth = getTooth(params.fdi);
    if (!tooth) throw notFound();
    return { fdi: tooth.fdi, name: tooth.name };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { property: "og:type", content: "website" },
          { name: "twitter:card", content: "summary" },
          { title: "Dente non trovato — DentalMind3D" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `Dente ${loaderData.fdi} — ${loaderData.name.it} | DentalMind3D`;
    const desc = `Anatomia del dente FDI ${loaderData.fdi}: corona, radici, canali, cuspidi e reperi, in italiano, tedesco, inglese e albanese.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  errorComponent: ({ error }) => <div role="alert" className="p-6 text-sm">{error instanceof Error ? error.message : String(error)}</div>,
  notFoundComponent: () => <div className="p-6 text-sm">404</div>,
  component: ToothDetail,
});

function ToothDetail() {
  const { fdi } = Route.useParams();
  const tooth = getTooth(fdi)!;
  const { t, loc, other } = useI18n();
  const { state, recordView, markStudied } = useProgress();

  const [selected, setSelected] = React.useState<string | null>(null);

  React.useEffect(() => {
    recordView(fdi);
    setSelected(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fdi]);

  const idx = TEETH.findIndex((x) => x.fdi === fdi);
  const prev = TEETH[(idx - 1 + TEETH.length) % TEETH.length]!;
  const next = TEETH[(idx + 1) % TEETH.length]!;
  const studied = Boolean(state.teeth[fdi]?.studied);

  const rows = [
    { label: t("study.crown"), typical: loc(tooth.anatomy.crown), variable: null },
    { label: t("study.roots"), typical: loc(tooth.anatomy.rootsTypical), variable: loc(tooth.anatomy.rootsVariable) },
    { label: t("study.canals"), typical: loc(tooth.anatomy.canalsTypical), variable: loc(tooth.anatomy.canalsVariable) },
    { label: t("study.cusps"), typical: loc(tooth.anatomy.cuspsTypical), variable: loc(tooth.anatomy.cuspsVariable) },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <Link to="/study" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> {t("nav.study")}
        </Link>
        <div className="ml-auto flex gap-1.5">
          <Link
            to="/study/$fdi"
            params={{ fdi: prev.fdi }}
            className="rounded-lg border border-border px-3 py-1.5 text-xs hover:border-primary"
          >
            ← {prev.fdi}
          </Link>
          <Link
            to="/study/$fdi"
            params={{ fdi: next.fdi }}
            className="rounded-lg border border-border px-3 py-1.5 text-xs hover:border-primary"
          >
            {next.fdi} →
          </Link>
        </div>
      </div>

      <header className="flex flex-wrap items-end gap-3">
        <span className="text-5xl font-black leading-none text-primary">{tooth.fdi}</span>
        <div>
          <h1 className="text-xl font-bold leading-tight">{loc(tooth.name)}</h1>
          {state.settings.bilingualTerms && (
            <p className="text-xs text-muted-foreground">
              <span className="mr-1 font-bold uppercase text-primary/70">{other}</span>
              {tooth.name[other]}
            </p>
          )}
          <p className="text-sm text-muted-foreground">{loc(tooth.anatomy.eruption)}</p>
        </div>
        <button
          type="button"
          onClick={() => markStudied(fdi, !studied)}
          className={cn(
            "ml-auto inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition",
            studied
              ? "bg-primary text-primary-foreground"
              : "border border-border bg-card hover:border-primary hover:text-primary",
          )}
        >
          <Check className="h-4 w-4" />
          {studied ? t("study.studied") : t("study.markStudied")}
        </button>
      </header>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
        <Tooth3D tooth={tooth} selected={selected} onSelect={setSelected} />

        <div className="space-y-4">
          <Card>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {t("study.anatomy")}
            </h2>
            <div className="space-y-4">
              {rows.map((r) => (
                <div key={r.label}>
                  <div className="text-xs font-bold uppercase tracking-wide text-primary">{r.label}</div>
                  <div className="mt-1">
                    {r.variable ? (
                      <TypicalVariable
                        typicalLabel={t("study.typical")}
                        variableLabel={t("study.variable")}
                        typical={r.typical}
                        variable={r.variable}
                      />
                    ) : (
                      <p className="text-sm text-foreground">{r.typical}</p>
                    )}
                  </div>
                </div>
              ))}
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-primary">{t("study.clinical")}</div>
                <p className="mt-1 text-sm text-muted-foreground">{loc(tooth.anatomy.clinical)}</p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {t("study.landmarks")}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">{t("study.landmarksHint")}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tooth.landmarks.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => {
                    setSelected(selected === l.id ? null : l.id);
                  }}
                  title={state.settings.bilingualTerms ? l.label[other] : undefined}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                    selected === l.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-primary hover:text-primary",
                  )}
                >
                  {loc(l.label)}
                </button>
              ))}
            </div>
          </Card>

          <Link
            to="/quiz"
            search={{ fdi: tooth.fdi }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            <Brain className="h-4 w-4" />
            {t("study.quizThis")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
