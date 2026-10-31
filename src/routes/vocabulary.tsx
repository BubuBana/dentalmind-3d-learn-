import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { LANGS } from "@/lib/teeth";
import { VOCABULARY, type VocabCategory } from "@/lib/vocabulary";
import { SectionTitle, Card, Pill } from "@/components/ui";
import { Search } from "lucide-react";

export const Route = createFileRoute("/vocabulary")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Vocabolario IT–DE–EN–SQ — DentalMind3D" },
      { name: "description", content: "Glossario odontoiatrico in italiano, tedesco, inglese e albanese: anatomia, superfici, clinica, materiali e strumenti." },
      { property: "og:title", content: "Vocabolario IT–DE–EN–SQ — DentalMind3D" },
      { property: "og:description", content: "Termini dentali essenziali in quattro lingue." },
    ],
  }),
  component: VocabPage,
});

const CATS: VocabCategory[] = ["anatomy", "surfaces", "clinic", "materials"];

function VocabPage() {
  const { t, lang } = useI18n();
  const [q, setQ] = React.useState("");
  const [cat, setCat] = React.useState<VocabCategory | null>(null);
  // Current interface language first, then the others.
  const order = [lang, ...LANGS.filter((l) => l !== lang)];

  const rows = VOCABULARY.filter((v) => {
    if (cat && v.category !== cat) return false;
    const s = q.trim().toLowerCase();
    return !s || LANGS.some((l) => v[l].toLowerCase().includes(s));
  });

  return (
    <div>
      <SectionTitle title={t("vocab.title")} subtitle={t("vocab.subtitle")} />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("vocab.search")}
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Pill active={cat === null} onClick={() => setCat(null)}>
            {t("vocab.cat.all")}
          </Pill>
          {CATS.map((c) => (
            <Pill key={c} active={cat === c} onClick={() => setCat(c)}>
              {t(`vocab.cat.${c}` as never)}
            </Pill>
          ))}
        </div>
      </div>

      <Card className="p-0">
        <div className="hidden grid-cols-4 gap-3 border-b border-border px-4 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground sm:grid">
          {order.map((l) => (
            <span key={l}>{t(`lang.${l}`)}</span>
          ))}
        </div>
        {rows.map((v) => (
          <div key={v.id} className="grid grid-cols-2 gap-x-3 gap-y-1.5 border-b border-border px-4 py-3 text-sm last:border-0 sm:grid-cols-4">
            {order.map((l, i) => (
              <span key={l} className={i === 0 ? "font-medium" : "text-muted-foreground"}>
                <span className="mr-1.5 text-[10px] font-bold uppercase text-primary/70 sm:hidden">{l}</span>
                {v[l]}
              </span>
            ))}
          </div>
        ))}
        {rows.length === 0 && <div className="px-4 py-6 text-sm text-muted-foreground">{t("study.empty")}</div>}
      </Card>
    </div>
  );
}
