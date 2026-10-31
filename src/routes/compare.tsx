import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { TEETH, getTooth } from "@/lib/teeth";
import { tellApart } from "@/lib/lessons";
import { Tooth3D } from "@/components/Tooth3D";
import type { OrbitState } from "@/components/ToothCanvas";
import { SectionTitle, Card } from "@/components/ui";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Confronta due denti — DentalMind3D" },
      { name: "description", content: "Confronto affiancato di due denti FDI con modelli 3D sincronizzati e differenze anatomiche." },
      { property: "og:title", content: "Confronta due denti — DentalMind3D" },
      { property: "og:description", content: "Modelli sincronizzati e differenze di radici, canali e cuspidi." },
    ],
  }),
  component: ComparePage,
});

function ToothSelect({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const { loc } = useI18n();
  return (
    <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-medium text-foreground outline-none focus:border-primary"
      >
        {TEETH.map((t) => (
          <option key={t.fdi} value={t.fdi}>
            {t.fdi} — {loc(t.name)}
          </option>
        ))}
      </select>
    </label>
  );
}

function ComparePage() {
  const { t, loc, lang } = useI18n();
  const [a, setA] = React.useState("16");
  const [b, setB] = React.useState("36");
  const [sync, setSync] = React.useState(true);
  const [selA, setSelA] = React.useState<string | null>(null);
  const [selB, setSelB] = React.useState<string | null>(null);
  const [orbit, setOrbit] = React.useState<OrbitState | null>(null);

  const ta = getTooth(a)!;
  const tb = getTooth(b)!;
  const cues = a === b ? [] : tellApart(ta, tb, lang).slice(0, 1);

  const rows = [
    { label: t("study.roots"), a: loc(ta.anatomy.rootsTypical), b: loc(tb.anatomy.rootsTypical) },
    { label: t("study.canals"), a: loc(ta.anatomy.canalsTypical), b: loc(tb.anatomy.canalsTypical) },
    { label: t("study.cusps"), a: loc(ta.anatomy.cuspsTypical), b: loc(tb.anatomy.cuspsTypical) },
    { label: t("study.crown"), a: loc(ta.anatomy.crown), b: loc(tb.anatomy.crown) },
    { label: t("study.eruption"), a: loc(ta.anatomy.eruption), b: loc(tb.anatomy.eruption) },
  ];

  return (
    <div>
      <SectionTitle title={t("compare.title")} subtitle={t("compare.subtitle")} />

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <ToothSelect value={a} onChange={setA} label={t("compare.left")} />
        <ToothSelect value={b} onChange={setB} label={t("compare.right")} />
      </div>

      <label className="mb-4 inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium">
        <input type="checkbox" checked={sync} onChange={(e) => setSync(e.target.checked)} className="accent-[var(--primary)]" />
        {t("compare.sync")}
      </label>

      <div className="grid gap-5 lg:grid-cols-2">
        <Tooth3D
          tooth={ta}
          compact
          selected={selA}
          onSelect={setSelA}
          {...(sync ? { orbit, onOrbit: setOrbit } : {})}
        />
        <Tooth3D
          tooth={tb}
          compact
          selected={selB}
          onSelect={setSelB}
          {...(sync ? { orbit, onOrbit: setOrbit } : {})}
        />
      </div>

      <Card className="mt-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t("compare.diff")}</h2>
        {a === b ? (
          <p className="text-sm text-muted-foreground">{t("compare.same")}</p>
        ) : (
          <div className="space-y-3">
            {cues.map((cue) => (
              <p key={cue} className="rounded-xl bg-primary/8 p-3 text-sm">
                <strong className="text-primary">{t("compare.howTo")}: </strong>
                {cue}
              </p>
            ))}
            {rows.map((r) => (
              <div key={r.label} className="grid gap-2 border-b border-border pb-3 last:border-0 sm:grid-cols-[110px_1fr_1fr]">
                <div className="text-xs font-bold uppercase tracking-wide text-primary">{r.label}</div>
                <p className="text-sm">
                  <span className="font-semibold">{ta.fdi}: </span>
                  {r.a}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{tb.fdi}: </span>
                  {r.b}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
