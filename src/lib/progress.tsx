import * as React from "react";

export interface ToothStat {
  views: number;
  studied: boolean;
  answered: number;
  correct: number;
}

export interface ProgressState {
  version: 1;
  teeth: Record<string, ToothStat>;
  recent: string[];
  quiz: { answered: number; correct: number; sessions: number; bestStreak: number };
  xp: number;
  daily: { lastDate: string | null; streak: number; bestStreak: number; history: string[] };
  settings: { bilingualTerms: boolean; autoSpin: boolean; theme: "light" | "dark" };
}

const KEY = "dentalmind3d.progress.v1";

const initial: ProgressState = {
  version: 1,
  teeth: {},
  recent: [],
  quiz: { answered: 0, correct: 0, sessions: 0, bestStreak: 0 },
  xp: 0,
  daily: { lastDate: null, streak: 0, bestStreak: 0, history: [] },
  settings: { bilingualTerms: true, autoSpin: false, theme: "light" },
};

const emptyStat: ToothStat = { views: 0, studied: false, answered: 0, correct: 0 };

type Ctx = {
  state: ProgressState;
  ready: boolean;
  recordView: (fdi: string) => void;
  markStudied: (fdi: string, studied?: boolean) => void;
  recordAnswer: (fdi: string | null, correct: boolean, xp: number) => void;
  recordSession: (streak: number) => void;
  completeDaily: () => void;
  setSetting: <K extends keyof ProgressState["settings"]>(k: K, v: ProgressState["settings"][K]) => void;
  reset: () => void;
};

const ProgressContext = React.createContext<Ctx | null>(null);

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<ProgressState>(initial);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ProgressState;
        setState({ ...initial, ...parsed, settings: { ...initial.settings, ...parsed.settings } });
      }
    } catch {
      /* ignore corrupt state */
    }
    setReady(true);
  }, []);

  React.useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, ready]);

  React.useEffect(() => {
    if (!ready) return;
    document.documentElement.classList.toggle("dark", state.settings.theme === "dark");
  }, [state.settings.theme, ready]);

  const update = React.useCallback((fn: (s: ProgressState) => ProgressState) => {
    setState((s) => fn(s));
  }, []);

  const value = React.useMemo<Ctx>(
    () => ({
      state,
      ready,
      recordView: (fdi) =>
        update((s) => ({
          ...s,
          teeth: { ...s.teeth, [fdi]: { ...emptyStat, ...s.teeth[fdi], views: (s.teeth[fdi]?.views ?? 0) + 1 } },
          recent: [fdi, ...s.recent.filter((f) => f !== fdi)].slice(0, 8),
        })),
      markStudied: (fdi, studied = true) =>
        update((s) => ({
          ...s,
          xp: s.xp + (studied && !s.teeth[fdi]?.studied ? 10 : 0),
          teeth: { ...s.teeth, [fdi]: { ...emptyStat, ...s.teeth[fdi], studied } },
        })),
      recordAnswer: (fdi, correct, xp) =>
        update((s) => {
          const teeth = { ...s.teeth };
          if (fdi) {
            const prev = { ...emptyStat, ...teeth[fdi] };
            teeth[fdi] = { ...prev, answered: prev.answered + 1, correct: prev.correct + (correct ? 1 : 0) };
          }
          return {
            ...s,
            teeth,
            xp: s.xp + (correct ? xp : 0),
            quiz: {
              ...s.quiz,
              answered: s.quiz.answered + 1,
              correct: s.quiz.correct + (correct ? 1 : 0),
            },
          };
        }),
      recordSession: (streak) =>
        update((s) => ({
          ...s,
          quiz: { ...s.quiz, sessions: s.quiz.sessions + 1, bestStreak: Math.max(s.quiz.bestStreak, streak) },
        })),
      completeDaily: () =>
        update((s) => {
          const today = todayKey();
          if (s.daily.lastDate === today) return s;
          const streak = s.daily.lastDate === yesterdayKey() ? s.daily.streak + 1 : 1;
          return {
            ...s,
            xp: s.xp + 25,
            daily: {
              lastDate: today,
              streak,
              bestStreak: Math.max(s.daily.bestStreak, streak),
              history: [today, ...s.daily.history].slice(0, 30),
            },
          };
        }),
      setSetting: (k, v) => update((s) => ({ ...s, settings: { ...s.settings, [k]: v } })),
      reset: () => setState(initial),
    }),
    [state, ready, update],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): Ctx {
  const ctx = React.useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside ProgressProvider");
  return ctx;
}

export function levelFromXp(xp: number): { level: number; into: number; needed: number } {
  const needed = 100;
  return { level: Math.floor(xp / needed) + 1, into: xp % needed, needed };
}
