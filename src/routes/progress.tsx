import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { useProgress } from "@/lib/progress";
import { TEETH, QUADRANT_LABEL } from "@/lib/teeth";
import { SectionTitle, Card, Stat, Progressbar } from "@/components/ui";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Progressi — DentalMind3D" },
      { name: "description", content: "Copertura dei 32 denti, statistiche del quiz e denti da ripassare, salvati sul dispositivo." },
      { property: "og:title", content: "Progressi — DentalMind3D" },
      { property: "og:description", content: "Statistiche di studio e quiz sull'anatomia dentale." },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  const { t, loc } = useI18n();
  const { state, reset } = useProgress();

  const studied = Object.values(state.teeth).filter((s) => s.studied).length;
  const accuracy = state.quiz.answered ? Math.round((state.quiz.correct / state.quiz.answered) * 100) : 0;

  const weakest = TEETH.map((tooth) => {
    const s = state.teeth[tooth.fdi];
    if (!s || s.answered < 2) return null;
    return { tooth, rate: s.correct / s.answered, answered: s.answered };
  })
    .filter(Boolean)
    .sort((a, b) => a!.rate - b!.rate)
    .slice(0, 6);

  return (
    <div>
      <SectionTitle title={t("progress.title")} subtitle={t("progress.subtitle")} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label={t("progress.answered")} value={String(state.quiz.answered)} />
        <Stat label={t("progress.correct")} value={String(state.quiz.correct)} />
        <Stat label={t("progress.accuracy")} value={`${accuracy}%`} />
        <Stat label={t("progress.bestStreak")} value={String(state.quiz.bestStreak)} />
      </div>

      <Card className="mt-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t("progress.coverage")}</h2>
        <div className="mt-2 text-2xl font-bold text-primary">{studied}/32</div>
        <div className="mt-2">
          <Progressbar value={(studied / 32) * 100} />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[1, 2, 3, 4].map((q) => {
            const teeth = TEETH.filter((x) => x.quadrant === q);
            const done = teeth.filter((x) => state.teeth[x.fdi]?.studied).length;
            return (
              <div key={q} className="rounded-xl border border-border p-3">
                <div className="flex justify-between text-xs font-medium">
                  <span>{loc(QUADRANT_LABEL[q]!)}</span>
                  <span className="text-muted-foreground">{done}/8</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {teeth.map((tooth) => (
                    <Link
                      key={tooth.fdi}
                      to="/study/$fdi"
                      params={{ fdi: tooth.fdi }}
                      className={
                        state.teeth[tooth.fdi]?.studied
                          ? "rounded-md bg-primary px-2 py-1 text-[11px] font-bold text-primary-foreground"
                          : "rounded-md bg-secondary px-2 py-1 text-[11px] font-medium text-muted-foreground"
                      }
                    >
                      {tooth.fdi}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="mt-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t("progress.weakest")}</h2>
        {weakest.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">{t("progress.none")}</p>
        ) : (
          <div className="mt-3 space-y-2">
            {weakest.map((w) => (
              <Link
                key={w!.tooth.fdi}
                to="/study/$fdi"
                params={{ fdi: w!.tooth.fdi }}
                className="flex items-center gap-3 rounded-xl border border-border px-3 py-2 text-sm hover:border-primary"
              >
                <span className="font-bold text-primary">{w!.tooth.fdi}</span>
                <span className="truncate">{loc(w!.tooth.name)}</span>
                <span className="ml-auto text-xs text-muted-foreground">{Math.round(w!.rate * 100)}%</span>
              </Link>
            ))}
          </div>
        )}
      </Card>

      <button
        type="button"
        onClick={() => {
          if (window.confirm(t("progress.resetConfirm"))) reset();
        }}
        className="mt-4 rounded-xl border border-destructive px-4 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/10"
      >
        {t("progress.reset")}
      </button>
    </div>
  );
}
