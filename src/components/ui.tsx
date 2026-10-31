import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("app-card rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] sm:rounded-2xl sm:p-5", className)}
      {...props}
    />
  );
}

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4 sm:mb-5">
      <h1 className="text-xl font-bold sm:text-3xl">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

export function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card className="p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-bold text-primary">{value}</div>
      {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
    </Card>
  );
}

export function Progressbar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
      <div
        className="h-full rounded-full bg-[image:var(--gradient-primary)] transition-all"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function Pill({
  active,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-primary",
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function TypicalVariable({
  typicalLabel,
  variableLabel,
  typical,
  variable,
}: {
  typicalLabel: string;
  variableLabel: string;
  typical: string;
  variable: string;
}) {
  return (
    <div className="space-y-1.5">
      <p className="flex gap-2 text-sm">
        <span className="mt-0.5 h-fit shrink-0 rounded-md bg-primary/12 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
          {typicalLabel}
        </span>
        <span className="text-foreground">{typical}</span>
      </p>
      <p className="flex gap-2 text-sm">
        <span className="mt-0.5 h-fit shrink-0 rounded-md bg-[var(--warn-bg)] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--warn-fg)]">
          {variableLabel}
        </span>
        <span className="text-muted-foreground">{variable}</span>
      </p>
    </div>
  );
}
