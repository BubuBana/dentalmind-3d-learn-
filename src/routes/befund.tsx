import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import {
  BEFUND_BY_CODE,
  BEFUND_CASES,
  BEFUND_CODES,
  CHART_LOWER,
  CHART_UPPER,
  checkChart,
  type Chart,
  type CheckResult,
} from "@/lib/befund";
import { SectionTitle, Card, Pill } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Check, Eraser, Eye, RotateCcw, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/befund")({
  head: () => ({
    meta: [
      { title: "Scheda dentale (Befund) — DentalMind3D" },
      {
        name: "description",
        content: "Esercizio interattivo: compila lo schema dentale con le sigle di reperto standard, con casi e correzione automatica.",
      },
      { property: "og:title", content: "Scheda dentale (Befund) — DentalMind3D" },
      { property: "og:description", content: "Impara a leggere e compilare un Befund dentale in quattro lingue." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BefundPage,
});

const FREE_KEY = "dentalmind3d.befund.free";

function readFree(): Chart {
  try {
    const raw = localStorage.getItem(FREE_KEY);
    return raw ? (JSON.parse(raw) as Chart) : {};
  } catch {
    return {};
  }
}

function BefundPage() {
  const { t } = useI18n();
  const [mode, setMode] = React.useState<"case" | "free">("case");
  return (
    <div className="space-y-4">
      <SectionTitle title={t("befund.title")} subtitle={t("befund.subtitle")} />
      <div className="flex gap-1.5">
        <Pill active={mode === "case"} onClick={() => setMode("case")}>
          {t("befund.mode.case")}
        </Pill>
        <Pill active={mode === "free"} onClick={() => setMode("free")}>
          {t("befund.mode.free")}
        </Pill>
      </div>
      {mode === "case" ? <CaseMode /> : <FreeMode />}
      <Legend />
      <p className="text-center text-xs text-muted-foreground">{t("befund.disclaimer")}</p>
    </div>
  );
}

function CaseMode() {
  const { t, loc } = useI18n();
  const [index, setIndex] = React.useState(0);
  const [chart, setChart] = React.useState<Chart>({});
  const [result, setResult] = React.useState<CheckResult | null>(null);
  const [shown, setShown] = React.useState(false);
  const item = BEFUND_CASES[index]!;

  const go = (i: number) => {
    setIndex(i);
    setChart({});
    setResult(null);
    setShown(false);
  };

  const total = Object.keys(item.solution).length;

  return (
    <div className="space-y-3">
      <Card className="p-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          {t("befund.case")} {index + 1}/{BEFUND_CASES.length}
        </div>
        <p className="mt-1 text-sm font-medium leading-6">{loc(item.text)}</p>
      </Card>

      <BefundChart
        chart={shown ? item.solution : chart}
        onChange={(c) => {
          if (shown) return;
          setChart(c);
          setResult(null);
        }}
        result={shown ? null : result}
      />

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setResult(checkChart(chart, item.solution))}
          disabled={shown}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          <Check className="h-4 w-4" />
          {t("befund.check")}
        </button>
        <button
          type="button"
          onClick={() => setShown((s) => !s)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:border-primary hover:text-primary"
        >
          <Eye className="h-4 w-4" />
          {shown ? t("befund.hideSolution") : t("befund.solution")}
        </button>
        <button
          type="button"
          onClick={() => go((index + 1) % BEFUND_CASES.length)}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:border-primary hover:text-primary"
        >
          {t("befund.next")}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {result && (
        <p
          role="status"
          className={cn(
            "rounded-lg p-3 text-sm font-semibold",
            result.correct.length === total && result.wrong.length === 0
              ? "bg-primary/10 text-primary"
              : "bg-[var(--warn-bg)] text-[var(--warn-fg)]",
          )}
        >
          {result.correct.length === total && result.wrong.length === 0
            ? t("befund.allRight")
            : t("befund.result", { correct: result.correct.length, total, wrong: result.wrong.length, missing: result.missing.length })}
        </p>
      )}
    </div>
  );
}

function FreeMode() {
  const { t } = useI18n();
  const [chart, setChart] = React.useState<Chart>({});
  React.useEffect(() => setChart(readFree()), []);
  const update = (c: Chart) => {
    setChart(c);
    try {
      localStorage.setItem(FREE_KEY, JSON.stringify(c));
    } catch {
      /* storage unavailable: keep the chart in memory */
    }
  };
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">{t("befund.freeText")}</p>
      <BefundChart chart={chart} onChange={update} result={null} />
      <button
        type="button"
        onClick={() => update({})}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:border-primary hover:text-primary"
      >
        <RotateCcw className="h-4 w-4" />
        {t("befund.clearAll")}
      </button>
    </div>
  );
}

const GROUP_STYLE: Record<string, string> = {
  missing: "text-slate-500 dark:text-slate-400",
  restored: "text-blue-700 dark:text-blue-300",
  treat: "text-red-700 dark:text-red-300",
};

/**
 * Findings chart in the layout of dental practice software:
 * a code row above the upper teeth and below the lower teeth.
 * Keyboard: arrows move, type a code and press Enter, Delete clears.
 */
function BefundChart({ chart, onChange, result }: { chart: Chart; onChange: (c: Chart) => void; result: CheckResult | null }) {
  const { t, loc } = useI18n();
  const [sel, setSel] = React.useState<string>("16");
  const [buffer, setBuffer] = React.useState("");

  const set = (fdi: string, code: string | null) => {
    const next = { ...chart };
    if (code) next[fdi] = code;
    else delete next[fdi];
    onChange(next);
  };

  const move = (dx: number, dy: number) => {
    const upper = CHART_UPPER.includes(sel);
    const row = upper ? CHART_UPPER : CHART_LOWER;
    let i = row.indexOf(sel);
    if (dy !== 0) {
      setSel((dy > 0 ? CHART_LOWER : CHART_UPPER)[i]!);
      return;
    }
    i = Math.max(0, Math.min(row.length - 1, i + dx));
    setSel(row[i]!);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") move(-1, 0);
    else if (e.key === "ArrowRight") move(1, 0);
    else if (e.key === "ArrowUp") move(0, -1);
    else if (e.key === "ArrowDown") move(0, 1);
    else if (e.key === "Delete" || (e.key === "Backspace" && !buffer)) set(sel, null);
    else if (e.key === "Backspace") setBuffer((b) => b.slice(0, -1));
    else if (e.key === "Escape") setBuffer("");
    else if (e.key === "Enter") {
      if (BEFUND_BY_CODE.has(buffer)) {
        set(sel, buffer);
        move(1, 0);
      }
      setBuffer("");
    } else if (/^[a-z]$/i.test(e.key)) setBuffer((b) => (b + e.key.toLowerCase()).slice(-2));
    else return;
    e.preventDefault();
  };

  const status = (fdi: string) =>
    !result ? null : result.wrong.includes(fdi) ? "wrong" : result.missing.includes(fdi) ? "missing" : result.correct.includes(fdi) ? "ok" : null;

  const cell = (fdi: string, codeOnTop: boolean) => {
    const code = chart[fdi];
    const info = code ? BEFUND_BY_CODE.get(code) : undefined;
    const st = status(fdi);
    const codeBox = (
      <div className={cn("flex h-7 items-center justify-center font-mono text-sm font-bold", info && GROUP_STYLE[info.group])}>
        {code ?? ""}
      </div>
    );
    return (
      <button
        key={fdi}
        type="button"
        onClick={() => setSel(fdi)}
        title={info ? `${fdi}: ${code} — ${loc(info.label)}` : fdi}
        aria-pressed={sel === fdi}
        className={cn(
          "relative flex min-w-0 flex-col border-r border-border last:border-r-0",
          sel === fdi ? "bg-primary/15 outline outline-2 -outline-offset-2 outline-primary" : "hover:bg-secondary",
          st === "wrong" && "bg-red-500/15",
          st === "missing" && "bg-amber-400/20",
          st === "ok" && "bg-emerald-500/15",
        )}
      >
        {codeOnTop && codeBox}
        <div
          className={cn(
            "flex h-7 items-center justify-center border-y border-border bg-muted/60 text-[11px] font-semibold tabular-nums",
            (code === "f" || code === "e" || code === "b") && "text-muted-foreground line-through",
            code === "x" && "text-red-700 dark:text-red-300",
          )}
        >
          {fdi}
        </div>
        {!codeOnTop && codeBox}
      </button>
    );
  };

  const selInfo = chart[sel] ? BEFUND_BY_CODE.get(chart[sel]!) : undefined;

  return (
    <Card className="overflow-hidden p-0">
      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-border bg-secondary/70 px-3 py-2 text-xs">
        <span className="font-bold uppercase tracking-wide text-muted-foreground">{t("befund.chart")}</span>
        <span>
          {t("common.tooth")}: <strong className="tabular-nums">{sel}</strong>
          {selInfo && (
            <>
              {" "}
              · <span className="font-mono font-bold">{chart[sel]}</span> {loc(selInfo.label)}
            </>
          )}
        </span>
        <span className="ml-auto font-mono text-muted-foreground">
          {t("befund.input")}: <span className="inline-block min-w-6 rounded border border-border bg-background px-1 text-foreground">{buffer || " "}</span>
        </span>
      </div>

      {/* chart */}
      <div tabIndex={0} onKeyDown={onKey} className="overflow-x-auto outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={t("befund.chart")}>
        <div className="min-w-[640px]">
          <div className="grid grid-cols-[2.5rem_repeat(16,minmax(0,1fr))] border-b-2 border-foreground/30">
            <div className="flex flex-col text-[10px] font-semibold text-muted-foreground">
              <div className="flex h-7 items-center justify-center">{t("befund.rowCode")}</div>
              <div className="flex h-7 items-center justify-center border-y border-border bg-muted/60">{t("befund.upperShort")}</div>
            </div>
            {CHART_UPPER.map((fdi) => cell(fdi, true))}
          </div>
          <div className="grid grid-cols-[2.5rem_repeat(16,minmax(0,1fr))]">
            <div className="flex flex-col text-[10px] font-semibold text-muted-foreground">
              <div className="flex h-7 items-center justify-center border-y border-border bg-muted/60">{t("befund.lowerShort")}</div>
              <div className="flex h-7 items-center justify-center">{t("befund.rowCode")}</div>
            </div>
            {CHART_LOWER.map((fdi) => cell(fdi, false))}
          </div>
        </div>
      </div>

      {/* code palette */}
      <div className="border-t border-border p-3">
        <div className="flex flex-wrap gap-1.5">
          {BEFUND_CODES.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => set(sel, c.code)}
              title={loc(c.label)}
              className={cn(
                "min-w-10 rounded-md border px-2 py-1 font-mono text-sm font-bold transition hover:border-primary",
                chart[sel] === c.code ? "border-primary bg-primary text-primary-foreground" : cn("border-border bg-background", GROUP_STYLE[c.group]),
              )}
            >
              {c.code}
            </button>
          ))}
          <button
            type="button"
            onClick={() => set(sel, null)}
            className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium hover:border-primary hover:text-primary"
          >
            <Eraser className="h-3.5 w-3.5" />
            {t("befund.clear")}
          </button>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">{t("befund.keys")}</p>
      </div>
    </Card>
  );
}

function Legend() {
  const { t, loc } = useI18n();
  return (
    <Card>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t("befund.legend")}</h2>
      <dl className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
        {BEFUND_CODES.map((c) => (
          <div key={c.code} className="flex gap-3">
            <dt className={cn("w-8 shrink-0 font-mono font-bold", GROUP_STYLE[c.group])}>{c.code}</dt>
            <dd className="text-muted-foreground">{loc(c.label)}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-xs text-muted-foreground">{t("befund.legendNote")}</p>
    </Card>
  );
}
