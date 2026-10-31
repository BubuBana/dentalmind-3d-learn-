import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { QuizRunner } from "@/components/QuizRunner";
import { SectionTitle, Card } from "@/components/ui";
import { Timer } from "lucide-react";

export const Route = createFileRoute("/exam")({
  head: () => ({
    meta: [
      { title: "Modalità esame — DentalMind3D" },
      {
        name: "description",
        content: "Esame a tempo senza suggerimenti: una sola risposta per domanda e analisi finale per argomento.",
      },
      { property: "og:title", content: "Modalità esame — DentalMind3D" },
      { property: "og:description", content: "Prova finale a tempo con valutazione per argomento." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ExamPage,
});

const PRESETS = [
  { questions: 10, minutes: 5 },
  { questions: 20, minutes: 10 },
  { questions: 30, minutes: 15 },
];

function ExamPage() {
  const { t } = useI18n();
  const [preset, setPreset] = React.useState(PRESETS[0]!);
  const [started, setStarted] = React.useState(false);
  const [left, setLeft] = React.useState(0);
  const [over, setOver] = React.useState(false);
  const [finished, setFinished] = React.useState(false);

  React.useEffect(() => {
    if (!started || finished || over) return;
    const id = window.setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          setOver(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [started, finished, over]);

  const mmss = `${String(Math.floor(left / 60)).padStart(2, "0")}:${String(left % 60).padStart(2, "0")}`;

  const start = () => {
    setLeft(preset.minutes * 60);
    setOver(false);
    setFinished(false);
    setStarted(true);
  };

  return (
    <div>
      <SectionTitle title={t("exam.title")} subtitle={t("exam.subtitle")} />

      {!started ? (
        <Card>
          <p className="text-sm text-muted-foreground">{t("exam.noHints")}</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {PRESETS.map((p) => (
              <button
                key={p.questions}
                type="button"
                onClick={() => setPreset(p)}
                aria-pressed={preset.questions === p.questions}
                className={
                  "rounded-xl border px-4 py-3 text-sm transition " +
                  (preset.questions === p.questions ? "border-primary bg-primary/10 text-foreground" : "border-border hover:border-primary/60")
                }
              >
                <strong>{p.questions}</strong> {t("exam.questions").toLowerCase()} · {p.minutes} {t("exam.minutes").toLowerCase()}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={start}
            className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            {t("exam.start")}
          </button>
        </Card>
      ) : over && !finished ? (
        <Card>
          <h2 className="text-lg font-bold text-destructive">{t("exam.timeUp")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("exam.timeUpText")}</p>
          <button
            type="button"
            onClick={() => setStarted(false)}
            className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            {t("exam.start")}
          </button>
        </Card>
      ) : (
        <div className="space-y-4">
          {!finished && (
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm">
              <Timer className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">{t("exam.time")}:</span>
              <strong className={left <= 30 ? "text-destructive" : "text-foreground"}>{mmss}</strong>
              <span className="ml-auto text-xs text-muted-foreground">
                {preset.questions} {t("exam.questions").toLowerCase()}
              </span>
            </div>
          )}
          <QuizRunner exam total={preset.questions} onFinish={() => setFinished(true)} />
        </div>
      )}
    </div>
  );
}
