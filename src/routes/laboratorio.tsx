import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { CROWN_WORKFLOW, LAB_QUIZ, LAB_SECTIONS } from "@/lib/lab";
import { mulberry32 } from "@/lib/quiz";
import { SectionTitle, Card } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, RotateCcw, X } from "lucide-react";

export const Route = createFileRoute("/laboratorio")({
  head: () => ({
    meta: [
      { title: "Laboratorio — DentalMind3D" },
      {
        name: "description",
        content: "Basi per futuri odontotecnici: occlusione, modelli, materiali, protesi, CAD/CAM, colore e sicurezza, in IT/DE/EN/SQ.",
      },
      { property: "og:title", content: "Laboratorio — DentalMind3D" },
      { property: "og:description", content: "Basi di tecnica dentale in quattro lingue, con esercizi interattivi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LabPage,
});

function LabPage() {
  const { t, loc } = useI18n();
  return (
    <div className="space-y-5">
      <SectionTitle title={t("lab.title")} subtitle={t("lab.subtitle")} />

      <nav aria-label={t("lab.title")} className="flex flex-wrap gap-1.5">
        {LAB_SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary"
          >
            {loc(s.title)}
          </a>
        ))}
        <a href="#workflow" className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
          {t("lab.workflow.title")}
        </a>
        <a href="#quiz" className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
          {t("lab.quiz.title")}
        </a>
      </nav>

      {LAB_SECTIONS.map((s, i) => (
        <Card key={s.id} id={s.id} className="scroll-mt-20">
          <div className="text-[10px] font-bold uppercase text-muted-foreground">{String(i + 1).padStart(2, "0")}</div>
          <h2 className="text-xl font-black">{loc(s.title)}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{loc(s.intro)}</p>
          <div className="mt-4 grid gap-2">
            {s.items.map((item) => (
              <details key={item.term.it} className="group rounded-lg border border-border p-3 open:border-primary/40 open:bg-primary/5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2 font-semibold">
                  {loc(item.term)}
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition group-open:rotate-180" />
                </summary>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{loc(item.text)}</p>
              </details>
            ))}
          </div>
        </Card>
      ))}

      <WorkflowExercise />
      <LabQuiz />

      <p className="text-center text-xs text-muted-foreground">{t("lab.disclaimer")}</p>
    </div>
  );
}

/** Tap the steps in the right order. A wrong tap is shown and does not count. */
function WorkflowExercise() {
  const { t, loc } = useI18n();
  const [seed, setSeed] = React.useState(7);
  const order = React.useMemo(() => {
    const rnd = mulberry32(seed);
    const idx = CROWN_WORKFLOW.map((_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [idx[i], idx[j]] = [idx[j]!, idx[i]!];
    }
    return idx;
  }, [seed]);
  const [done, setDone] = React.useState<number[]>([]);
  const [wrong, setWrong] = React.useState<number | null>(null);
  const [errors, setErrors] = React.useState(0);
  const finished = done.length === CROWN_WORKFLOW.length;

  const pick = (i: number) => {
    if (done.includes(i) || finished) return;
    if (i === done.length) {
      setDone((d) => [...d, i]);
      setWrong(null);
    } else {
      setWrong(i);
      setErrors((e) => e + 1);
    }
  };

  const reset = () => {
    setSeed((s) => s + 1);
    setDone([]);
    setWrong(null);
    setErrors(0);
  };

  return (
    <Card id="workflow" className="scroll-mt-20">
      <h2 className="text-xl font-black">{t("lab.workflow.title")}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{t("lab.workflow.text")}</p>

      {done.length > 0 && (
        <ol className="mt-4 space-y-1.5">
          {done.map((i, n) => (
            <li key={i} className="flex items-start gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm">
              <span className="font-black text-primary">{n + 1}.</span>
              {loc(CROWN_WORKFLOW[i]!)}
            </li>
          ))}
        </ol>
      )}

      {!finished ? (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {order
            .filter((i) => !done.includes(i))
            .map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => pick(i)}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition",
                  wrong === i ? "border-destructive bg-destructive/10" : "border-border hover:border-primary hover:text-primary",
                )}
              >
                {wrong === i && <X className="h-4 w-4 shrink-0 text-destructive" />}
                {loc(CROWN_WORKFLOW[i]!)}
              </button>
            ))}
        </div>
      ) : (
        <p role="status" className="mt-4 flex items-center gap-2 rounded-lg bg-primary/10 p-3 text-sm font-semibold text-primary">
          <Check className="h-4 w-4" />
          {t("lab.workflow.done", { errors })}
        </p>
      )}

      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
        <span>{t("lab.workflow.errors", { errors })}</span>
        <button type="button" onClick={reset} className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 font-medium hover:border-primary hover:text-primary">
          <RotateCcw className="h-3.5 w-3.5" />
          {t("quiz.restart")}
        </button>
      </div>
    </Card>
  );
}

function LabQuiz() {
  const { t, loc } = useI18n();
  const [answers, setAnswers] = React.useState<Record<number, number>>({});
  const score = LAB_QUIZ.filter((q, i) => answers[i] === q.correct).length;
  return (
    <Card id="quiz" className="scroll-mt-20">
      <h2 className="text-xl font-black">{t("lab.quiz.title")}</h2>
      <div className="mt-4 space-y-4">
        {LAB_QUIZ.map((item, i) => {
          const given = answers[i];
          const done = given !== undefined;
          return (
            <fieldset key={item.q.it} className="rounded-lg border border-border p-4">
              <legend className="px-1 text-sm font-bold">
                {i + 1}. {loc(item.q)}
              </legend>
              <div className="mt-2 grid gap-2">
                {item.options.map((opt, o) => (
                  <button
                    key={opt.it}
                    type="button"
                    aria-pressed={given === o}
                    onClick={() => setAnswers((prev) => ({ ...prev, [i]: o }))}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-left text-sm transition",
                      done && o === item.correct
                        ? "border-primary bg-primary/12 font-semibold text-primary"
                        : done && given === o
                          ? "border-[var(--warn-fg)] bg-[var(--warn-bg)] text-[var(--warn-fg)]"
                          : "border-border hover:border-primary hover:text-primary",
                    )}
                  >
                    {loc(opt)}
                  </button>
                ))}
              </div>
              {done && (
                <p role="status" className="mt-3 rounded-lg bg-secondary/60 p-3 text-sm text-muted-foreground">
                  <strong className="text-foreground">{given === item.correct ? t("quiz.correct") : t("quiz.wrong")}</strong>{" "}
                  {loc(item.why)}
                </p>
              )}
            </fieldset>
          );
        })}
      </div>
      <p aria-live="polite" className="mt-4 text-sm font-semibold text-primary">
        {t("quiz.score")}: {score}/{LAB_QUIZ.length}
      </p>
    </Card>
  );
}
