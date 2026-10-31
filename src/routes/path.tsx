import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { useProgress } from "@/lib/progress";
import { getTooth } from "@/lib/teeth";
import { SectionTitle, Card, Progressbar } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Lock, Check, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/path")({
  head: () => ({
    meta: [
      { title: "Percorso di apprendimento — DentalMind3D" },
      {
        name: "description",
        content: "Nove livelli progressivi: dalle basi FDI alle domande trabocchetto fino all'esame finale a tempo.",
      },
      { property: "og:title", content: "Percorso di apprendimento — DentalMind3D" },
      { property: "og:description", content: "Nove livelli che si sbloccano uno dopo l'altro." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PathPage,
});

type Target = { to: string; search?: Record<string, string> };

const LEVELS: { n: number; target: Target }[] = [
  { n: 1, target: { to: "/study" } },
  { n: 2, target: { to: "/conosci-il-dente" } },
  { n: 3, target: { to: "/study" } },
  { n: 4, target: { to: "/study" } },
  { n: 5, target: { to: "/quiz" } },
  { n: 6, target: { to: "/compare" } },
  { n: 7, target: { to: "/quiz" } },
  { n: 8, target: { to: "/vocabulary" } },
  { n: 9, target: { to: "/exam" } },
];

function PathPage() {
  const { t } = useI18n();
  const { state } = useProgress();

  const studied = Object.entries(state.teeth).filter(([, s]) => s.studied).map(([fdi]) => fdi);
  const upper = studied.filter((f) => getTooth(f)?.arch === "upper").length;
  const lower = studied.filter((f) => getTooth(f)?.arch === "lower").length;
  const correct = state.quiz.correct;

  // Keep these thresholds in sync with the path.lN.req texts in the dictionaries.
  const done = (n: number): boolean => {
    switch (n) {
      case 1:
        return studied.length >= 4;
      case 2:
        return studied.length >= 4 && correct >= 5;
      case 3:
        return upper >= 8;
      case 4:
        return lower >= 8;
      case 5:
        return correct >= 12;
      case 6:
        return correct >= 20;
      case 7:
        return state.quiz.sessions >= 2;
      case 8:
        return correct >= 40;
      default:
        return state.quiz.sessions >= 4 && correct >= 60;
    }
  };

  const unlocked = (n: number) => n === 1 || done(n - 1);
  const completed = LEVELS.filter((l) => done(l.n)).length;

  return (
    <div>
      <SectionTitle title={t("path.title")} subtitle={t("path.subtitle")} />

      <Card>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{t("path.progress")}</span>
          <span className="text-muted-foreground">{completed}/9</span>
        </div>
        <div className="mt-2">
          <Progressbar value={(completed / 9) * 100} />
        </div>
      </Card>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {LEVELS.map(({ n, target }) => {
          const isDone = done(n);
          const isOpen = unlocked(n);
          return (
            <Card key={n} className={cn(!isOpen && "opacity-60")}>
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-bold",
                    isDone ? "bg-primary text-primary-foreground" : isOpen ? "bg-secondary text-primary" : "bg-muted text-muted-foreground",
                  )}
                >
                  {isDone ? <Check className="h-4 w-4" /> : !isOpen ? <Lock className="h-4 w-4" /> : n}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold">
                    {t("path.level")} {n} · {t(`path.l${n}.title` as never)}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t(`path.l${n}.desc` as never)}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    <strong className="text-foreground">{t("path.requirement")}: </strong>
                    {t(`path.l${n}.req` as never)}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                        isDone ? "bg-primary/10 text-primary" : isOpen ? "bg-secondary text-primary" : "bg-muted text-muted-foreground",
                      )}
                    >
                      {isDone ? t("path.done") : isOpen ? t("path.unlocked") : t("path.locked")}
                    </span>
                    {isOpen && (
                      <Link
                        to={target.to}
                        search={{}}
                        className="ml-auto inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
                      >
                        {t("path.open")}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
