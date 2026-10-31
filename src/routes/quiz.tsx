import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { getTooth } from "@/lib/teeth";
import { QuizRunner } from "@/components/QuizRunner";
import { SectionTitle, Card } from "@/components/ui";

export const Route = createFileRoute("/quiz")({
  validateSearch: (search: Record<string, unknown>): { fdi?: string } =>
    typeof search["fdi"] === "string" ? { fdi: search["fdi"] as string } : {},
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Quiz adattivo — DentalMind3D" },
      {
        name: "description",
        content: "Quiz passo-passo sull'anatomia dei denti FDI, con suggerimenti, ritentativi e spiegazione del ragionamento.",
      },
      { property: "og:title", content: "Quiz adattivo — DentalMind3D" },
      { property: "og:description", content: "Domande adattive su denti FDI, radici, cuspidi, reperi e terminologia in quattro lingue." },
    ],
  }),
  component: QuizPage,
});

function QuizPage() {
  const { t, loc } = useI18n();
  const { fdi } = Route.useSearch();
  const [started, setStarted] = React.useState(false);
  const tooth = fdi ? getTooth(fdi) : undefined;

  return (
    <div>
      <SectionTitle title={t("quiz.title")} subtitle={t("quiz.subtitle")} />
      {!started ? (
        <Card>
          <p className="text-sm text-muted-foreground">
            {t("quiz.scope")}: <strong className="text-foreground">{tooth ? `${tooth.fdi} — ${loc(tooth.name)}` : t("quiz.scope.all")}</strong>
          </p>
          <button
            type="button"
            onClick={() => setStarted(true)}
            className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            {t("quiz.start")}
          </button>
        </Card>
      ) : (
        <QuizRunner total={8} {...(tooth ? { focusFdi: tooth.fdi } : {})} />
      )}
    </div>
  );
}
