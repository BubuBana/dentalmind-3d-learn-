import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { useProgress, todayKey } from "@/lib/progress";
import { TEETH } from "@/lib/teeth";
import { dailySeed } from "@/lib/quiz";
import { QuizRunner } from "@/components/QuizRunner";
import { SectionTitle, Card } from "@/components/ui";
import { CalendarCheck } from "lucide-react";

export const Route = createFileRoute("/daily")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Sfida del giorno — DentalMind3D" },
      { name: "description", content: "Cinque domande quotidiane su un dente protagonista, per mantenere la serie di studio." },
      { property: "og:title", content: "Sfida del giorno — DentalMind3D" },
      { property: "og:description", content: "Cinque domande al giorno su un dente FDI a rotazione." },
    ],
  }),
  component: DailyPage,
});

function DailyPage() {
  const { t, loc } = useI18n();
  const { state, completeDaily } = useProgress();
  const [started, setStarted] = React.useState(false);

  const date = todayKey();
  const seed = dailySeed(date);
  const tooth = TEETH[seed % TEETH.length]!;
  const done = state.daily.lastDate === date;

  return (
    <div>
      <SectionTitle title={t("daily.title")} subtitle={t("daily.subtitle")} />
      <Card className="mb-4 flex flex-wrap items-center gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/12 text-primary">
          <CalendarCheck className="h-6 w-6" />
        </span>
        <div className="text-sm">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">{t("daily.today")}</div>
          <div className="text-lg font-bold">
            {tooth.fdi} — {loc(tooth.name)}
          </div>
          <div className="text-muted-foreground">
            {t("daily.streak")}: {state.daily.streak}
          </div>
        </div>
        {done && (
          <span className="ml-auto rounded-full bg-primary/12 px-3 py-1.5 text-xs font-semibold text-primary">
            {t("daily.done")}
          </span>
        )}
      </Card>

      {!started ? (
        <button
          type="button"
          onClick={() => setStarted(true)}
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          {t("daily.start")}
        </button>
      ) : (
        <QuizRunner total={5} seed={seed} focusFdi={tooth.fdi} onFinish={() => completeDaily()} />
      )}
    </div>
  );
}
