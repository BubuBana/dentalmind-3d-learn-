import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { useProgress, levelFromXp, todayKey } from "@/lib/progress";
import { TEETH, getTooth, QUADRANT_LABEL } from "@/lib/teeth";
import { Card, Stat, Progressbar } from "@/components/ui";
import { GraduationCap, Brain, Columns2, Languages, CalendarCheck, ArrowRight, BookOpen, Sparkles, FlaskConical } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "DentalMind3D — Anatomia dentale 3D · IT / DE / EN / SQ" },
      {
        name: "description",
        content:
          "Impara i 32 denti permanenti in notazione FDI con modelli 3D interattivi, quiz adattivo e vocabolario in italiano, tedesco, inglese e albanese.",
      },
      { property: "og:title", content: "DentalMind3D — Anatomia dentale 3D · IT / DE / EN / SQ" },
      {
        property: "og:description",
        content: "Studio interattivo dei 32 denti permanenti, quiz adattivo e vocabolario IT–DE–EN–SQ.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { t, loc } = useI18n();
  const { state } = useProgress();

  const studied = Object.values(state.teeth).filter((s) => s.studied).length;
  const accuracy = state.quiz.answered ? Math.round((state.quiz.correct / state.quiz.answered) * 100) : 0;
  const { level, into, needed } = levelFromXp(state.xp);
  const dailyDone = state.daily.lastDate === todayKey();

  const quick = [
    { to: "/study", label: t("home.startStudy"), icon: GraduationCap },
    { to: "/quiz", label: t("home.startQuiz"), icon: Brain },
    { to: "/compare", label: t("nav.compare"), icon: Columns2 },
    { to: "/vocabulary", label: t("nav.vocabulary"), icon: Languages },
    { to: "/laboratorio", label: t("nav.lab"), icon: FlaskConical },
  ] as const;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl bg-[image:var(--gradient-hero)] p-4 text-primary-foreground shadow-[var(--shadow-elegant)] sm:rounded-3xl sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">{t("home.greeting")}</p>
        <h1 className="mt-2 text-2xl font-black sm:text-4xl">{t("app.name")}</h1>
        <p className="mt-2 max-w-xl text-sm opacity-90">{t("home.subtitle")}</p>
        <div className="mt-4 flex flex-wrap gap-2 sm:mt-5">
          <Link
            to="/study"
            className="inline-flex items-center gap-2 rounded-xl bg-background px-4 py-2.5 text-sm font-semibold text-primary hover:opacity-90"
          >
            {t("home.startStudy")} <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/quiz"
            search={{}}
            className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/40 px-4 py-2.5 text-sm font-semibold hover:bg-primary-foreground/10"
          >
            {t("home.startQuiz")}
          </Link>
        </div>
        <div className="mt-4 max-w-sm sm:mt-6">
          <div className="mb-1 flex justify-between text-xs opacity-90">
            <span>
              {t("home.level")} {level}
            </span>
            <span>
              {into}/{needed} XP
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-primary-foreground/25">
            <div className="h-full rounded-full bg-background" style={{ width: `${(into / needed) * 100}%` }} />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-primary/30 bg-primary/8 p-4 sm:flex sm:items-center sm:gap-5 sm:p-5">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
          <BookOpen className="h-6 w-6" />
        </span>
        <div className="mt-3 flex-1 sm:mt-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-bold">{t("nav.knowTooth")}</h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/12 px-2 py-1 text-[10px] font-bold uppercase text-primary">
              <Sparkles className="h-3 w-3" />
              {t("home.know.badge")}
            </span>
          </div>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{t("home.know.text")}</p>
        </div>
        <Link to="/conosci-il-dente" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 sm:mt-0">
          {t("home.know.cta")}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label={t("home.stats.studied")} value={`${studied}/32`} />
        <Stat label={t("home.stats.accuracy")} value={`${accuracy}%`} hint={`${state.quiz.answered} ×`} />
        <Stat label={t("home.stats.streak")} value={String(state.daily.streak)} />
        <Stat label={t("home.stats.xp")} value={String(state.xp)} />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t("progress.coverage")}
          </h2>
          <div className="mt-3">
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
                  <div className="mt-2">
                    <Progressbar value={(done / 8) * 100} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t("nav.daily")}
          </h2>
          <div className="mt-3 flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/12 text-primary">
              <CalendarCheck className="h-6 w-6" />
            </span>
            <div className="text-sm">
              <div className="font-semibold">{dailyDone ? t("daily.done") : t("home.dailyCta")}</div>
              <div className="text-muted-foreground">
                {t("daily.streak")}: {state.daily.streak}
              </div>
            </div>
          </div>
          <Link
            to="/daily"
            className="mt-4 block rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            {t("daily.start")}
          </Link>
        </Card>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {t("home.quick")}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {quick.map((q) => (
            <Link
              key={q.to}
              to={q.to}
              search={{}}
              className="rounded-2xl border border-border bg-card p-4 transition hover:border-primary hover:shadow-[var(--shadow-soft)]"
            >
              <q.icon className="h-5 w-5 text-primary" />
              <div className="mt-3 text-sm font-semibold">{q.label}</div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {t("home.recent")}
        </h2>
        {state.recent.length === 0 ? (
          <Card className="text-sm text-muted-foreground">{t("home.noRecent")}</Card>
        ) : (
          <div className="flex flex-wrap gap-2">
            {state.recent.map((fdi) => {
              const tooth = getTooth(fdi);
              if (!tooth) return null;
              return (
                <Link
                  key={fdi}
                  to="/study/$fdi"
                  params={{ fdi }}
                  className="rounded-xl border border-border bg-card px-3 py-2 text-sm hover:border-primary"
                >
                  <span className="font-bold text-primary">{fdi}</span>{" "}
                  <span className="text-muted-foreground">{loc(tooth.shortName)}</span>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
