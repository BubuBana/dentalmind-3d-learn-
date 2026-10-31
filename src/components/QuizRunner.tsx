import * as React from "react";
import { useI18n } from "@/lib/i18n";
import { useProgress } from "@/lib/progress";
import {
  buildQuestion,
  nextLevel,
  mulberry32,
  TOPIC_LABEL,
  type QuizLevel,
  type QuizMode,
  type QuizQuestion,
} from "@/lib/quiz";
import type { Arch, Lang } from "@/lib/teeth";
import { Card, Progressbar } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Lightbulb, RotateCcw, Check, X, Eye } from "lucide-react";

export interface QuizAnswerLog {
  topic: QuizQuestion["topic"];
  fdi: string | null;
  prompt: string;
  correct: boolean;
  usedHint: boolean;
}

export function QuizRunner({
  total = 8,
  seed,
  focusFdi,
  arch,
  mode = "standard",
  exam = false,
  vocabFrom,
  vocabTo,
  onFinish,
}: {
  total?: number;
  seed?: number;
  focusFdi?: string;
  arch?: Arch;
  mode?: QuizMode;
  /** Exam mode: no hints, one attempt per question, analysis at the end. */
  exam?: boolean;
  /** Vocabulary questions: language of the term and of the answers. */
  vocabFrom?: Lang;
  vocabTo?: Lang;
  onFinish?: (correct: number, total: number, log: QuizAnswerLog[]) => void;
}) {
  const { t, lang } = useI18n();
  const { recordAnswer, recordSession } = useProgress();

  const rnd = React.useMemo(() => mulberry32(seed ?? Math.floor(Math.random() * 1e9)), [seed]);
  const [level, setLevel] = React.useState<QuizLevel>(1);
  const [index, setIndex] = React.useState(0);
  const [question, setQuestion] = React.useState<QuizQuestion | null>(null);
  const [picked, setPicked] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<"idle" | "wrong" | "correct" | "revealed">("idle");
  const [attempts, setAttempts] = React.useState(0);
  const [hintStep, setHintStep] = React.useState(0);
  const [correctCount, setCorrectCount] = React.useState(0);
  const [streak, setStreak] = React.useState(0);
  const [bestStreak, setBestStreak] = React.useState(0);
  const [log, setLog] = React.useState<QuizAnswerLog[]>([]);
  const [done, setDone] = React.useState(false);

  const load = React.useCallback(
    (lvl: QuizLevel) => {
      setQuestion(
        buildQuestion({
          level: lvl,
          lang,
          rnd,
          mode,
          ...(focusFdi ? { focusFdi } : {}),
          ...(arch ? { arch } : {}),
          ...(vocabFrom ? { vocabFrom } : {}),
          ...(vocabTo ? { vocabTo } : {}),
        }),
      );
      setPicked(null);
      setStatus("idle");
      setAttempts(0);
      setHintStep(0);
    },
    [lang, rnd, focusFdi, arch, mode, vocabFrom, vocabTo],
  );

  React.useEffect(() => {
    load(level);
    // Rebuild the current question when the interface or vocabulary language changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, vocabFrom, vocabTo]);

  if (!question) return null;
  const q = question;
  const usedHint = hintStep > 0;

  const finish = (finalCorrect: number, finalLog: QuizAnswerLog[]) => {
    setDone(true);
    recordSession(bestStreak);
    onFinish?.(finalCorrect, total, finalLog);
  };

  const advance = (gainedCorrect: boolean) => {
    const nextCorrect = correctCount + (gainedCorrect ? 1 : 0);
    const nextLog: QuizAnswerLog[] = [
      ...log,
      { topic: q.topic, fdi: q.fdi, prompt: q.prompt, correct: gainedCorrect, usedHint },
    ];
    if (index + 1 >= total) {
      setLog(nextLog);
      setCorrectCount(nextCorrect);
      finish(nextCorrect, nextLog);
      return;
    }
    setLog(nextLog);
    setCorrectCount(nextCorrect);
    setIndex((i) => i + 1);
    load(level);
  };

  const submit = (optionId: string) => {
    if (status === "correct" || status === "revealed") return;
    setPicked(optionId);
    const isCorrect = optionId === q.answerId;
    const firstTry = attempts === 0 && !usedHint;
    setAttempts((a) => a + 1);

    if (exam) {
      recordAnswer(q.fdi, isCorrect, isCorrect ? 12 : 0);
      setStreak((s) => {
        const ns = isCorrect ? s + 1 : 0;
        setBestStreak((b) => Math.max(b, ns));
        return ns;
      });
      setStatus(isCorrect ? "correct" : "wrong");
      window.setTimeout(() => advance(isCorrect), 450);
      return;
    }

    if (isCorrect) {
      setStatus("correct");
      if (attempts === 0) recordAnswer(q.fdi, firstTry, firstTry ? 15 : 6);
      setStreak((s) => {
        const ns = firstTry ? s + 1 : 0;
        setBestStreak((b) => Math.max(b, ns));
        return ns;
      });
      setLevel((l) => nextLevel(l, firstTry));
    } else {
      setStatus("wrong");
      if (attempts === 0) {
        recordAnswer(q.fdi, false, 0);
        setStreak(0);
        setLevel((l) => nextLevel(l, false));
      }
    }
  };

  if (done) {
    const byTopic = new Map<QuizQuestion["topic"], { c: number; n: number }>();
    for (const a of log) {
      const cur = byTopic.get(a.topic) ?? { c: 0, n: 0 };
      byTopic.set(a.topic, { c: cur.c + (a.correct ? 1 : 0), n: cur.n + 1 });
    }
    const worst = [...byTopic.entries()].sort((a, b) => a[1].c / a[1].n - b[1].c / b[1].n)[0];
    return (
      <Card>
        <h2 className="text-center text-xl font-bold">{t("quiz.result")}</h2>
        <p className="mt-2 text-center text-4xl font-black text-primary">
          {correctCount}/{total}
        </p>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {exam ? t("quiz.resultText", { correct: correctCount, total }) : t("quiz.firstTryNote")}
        </p>

        <h3 className="mt-6 text-xs font-bold uppercase tracking-wide text-muted-foreground">{t("exam.byTopic")}</h3>
        <div className="mt-2 space-y-2">
          {[...byTopic.entries()].map(([topic, v]) => (
            <div key={topic} className="text-sm">
              <div className="flex justify-between">
                <span>{TOPIC_LABEL[topic][lang]}</span>
                <span className="text-muted-foreground">
                  {v.c}/{v.n}
                </span>
              </div>
              <div className="mt-1">
                <Progressbar value={(v.c / v.n) * 100} />
              </div>
            </div>
          ))}
        </div>

        {worst && worst[1].c / worst[1].n < 1 && (
          <p className="mt-4 rounded-xl bg-[var(--warn-bg)] p-3 text-sm text-[var(--warn-fg)]">
            <strong>{t("quiz.recommend")}: </strong>
            {TOPIC_LABEL[worst[0]][lang]}
          </p>
        )}

        <h3 className="mt-6 text-xs font-bold uppercase tracking-wide text-muted-foreground">{t("quiz.summary")}</h3>
        <ul className="mt-2 space-y-1.5">
          {log.map((a, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              {a.correct ? (
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              ) : (
                <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              )}
              <span className={a.correct ? "text-muted-foreground" : "text-foreground"}>{a.prompt}</span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => {
            setDone(false);
            setIndex(0);
            setCorrectCount(0);
            setStreak(0);
            setLog([]);
            setLevel(1);
            load(1);
          }}
          className="mt-5 w-full rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          {t("quiz.again")}
        </button>
      </Card>
    );
  }

  const revealOrCorrect = status === "correct" || status === "revealed";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">
          {t("quiz.question")} {index + 1} {t("quiz.of")} {total}
        </span>
        {!exam && (
          <span className="rounded-full bg-secondary px-2.5 py-1 font-medium text-primary">
            {t("quiz.level")}: {t(`quiz.level.${level}` as never)}
          </span>
        )}
        <span className="rounded-full bg-secondary px-2.5 py-1 font-medium text-muted-foreground">
          {TOPIC_LABEL[q.topic][lang]}
        </span>
        <span className="ml-auto">
          {t("quiz.score")}: <strong className="text-foreground">{correctCount}</strong>
        </span>
      </div>
      <Progressbar value={(index / total) * 100} />

      <Card>
        <h2 className="text-lg font-semibold leading-snug">{q.prompt}</h2>

        <div className="mt-4 grid gap-2">
          {q.options.map((o) => {
            const isAnswer = o.id === q.answerId;
            const isPicked = picked === o.id;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => submit(o.id)}
                disabled={revealOrCorrect}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm transition",
                  revealOrCorrect && isAnswer
                    ? "border-primary bg-primary/10 text-foreground"
                    : isPicked && status === "wrong"
                      ? "border-destructive bg-destructive/10"
                      : "border-border bg-card hover:border-primary/60",
                )}
              >
                <span>{o.label}</span>
                {revealOrCorrect && isAnswer && <Check className="h-4 w-4 text-primary" />}
                {isPicked && status === "wrong" && <X className="h-4 w-4 text-destructive" />}
              </button>
            );
          })}
        </div>

        {exam ? (
          <p className="mt-4 text-xs text-muted-foreground">{t("exam.noHints")}</p>
        ) : (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {hintStep < q.hints.length && !revealOrCorrect && (
              <button
                type="button"
                onClick={() => setHintStep((h) => h + 1)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:border-primary hover:text-primary"
              >
                <Lightbulb className="h-3.5 w-3.5" />
                {hintStep === 0 ? t("quiz.hint") : t("quiz.hint.more")}
              </button>
            )}
            {status === "wrong" && (
              <button
                type="button"
                onClick={() => {
                  setPicked(null);
                  setStatus("idle");
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:border-primary hover:text-primary"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                {t("quiz.retry")}
              </button>
            )}
            {status === "wrong" && attempts >= 2 && (
              <button
                type="button"
                onClick={() => setStatus("revealed")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:border-primary hover:text-primary"
              >
                <Eye className="h-3.5 w-3.5" />
                {t("quiz.reveal")}
              </button>
            )}
            {usedHint && <span className="text-[11px] text-muted-foreground">{t("quiz.usedHint")}</span>}
            {revealOrCorrect && (
              <button
                type="button"
                onClick={() => advance(status === "correct" && attempts === 1 && !usedHint)}
                className="ml-auto rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
              >
                {index + 1 >= total ? t("quiz.finish") : t("quiz.next")}
              </button>
            )}
          </div>
        )}

        {!exam && hintStep > 0 && !revealOrCorrect && (
          <div className="mt-3 space-y-2">
            {q.hints.slice(0, hintStep).map((h, i) => (
              <p key={i} className="rounded-xl bg-[var(--warn-bg)] p-3 text-sm text-[var(--warn-fg)]">
                <strong>{t("quiz.hint.step", { n: i + 1, total: q.hints.length })}: </strong>
                {h}
              </p>
            ))}
          </div>
        )}

        {status === "wrong" && !exam && <p className="mt-3 text-sm font-medium text-destructive">{t("quiz.wrong")}</p>}

        {revealOrCorrect && (
          <div className="mt-3 rounded-xl bg-primary/8 p-3">
            <p className="text-sm font-semibold text-primary">
              {status === "correct" ? t("quiz.correct") : t("quiz.revealed")}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              <strong className="text-foreground">{t("quiz.why")}: </strong>
              {q.reasoning}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
