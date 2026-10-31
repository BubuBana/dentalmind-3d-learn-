import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { useProgress } from "@/lib/progress";
import { LANGS } from "@/lib/teeth";
import { SectionTitle, Card, Pill } from "@/components/ui";
import { LanguageSwitch } from "@/components/AppShell";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Impostazioni — DentalMind3D" },
      { name: "description", content: "Lingua, tema, rotazione automatica dei modelli e gestione dei dati locali." },
      { property: "og:title", content: "Impostazioni — DentalMind3D" },
      { property: "og:description", content: "Preferenze di lingua, tema e modelli 3D." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { t, lang, other, setOther } = useI18n();
  const { state, setSetting } = useProgress();

  return (
    <div className="space-y-4">
      <SectionTitle title={t("settings.title")} />

      <Card>
        <h2 className="text-sm font-semibold">{t("settings.language")}</h2>
        <div className="mt-3">
          <LanguageSwitch />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{t("settings.translationNote")}</p>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold">{t("settings.theme")}</h2>
        <div className="mt-3 flex gap-1.5">
          <Pill active={state.settings.theme === "light"} onClick={() => setSetting("theme", "light")}>
            {t("settings.theme.light")}
          </Pill>
          <Pill active={state.settings.theme === "dark"} onClick={() => setSetting("theme", "dark")}>
            {t("settings.theme.dark")}
          </Pill>
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={state.settings.autoSpin}
            onChange={(e) => setSetting("autoSpin", e.target.checked)}
            className="accent-[var(--primary)]"
          />
          {t("settings.autoSpin")}
        </label>
        <label className="mt-2 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={state.settings.bilingualTerms}
            onChange={(e) => setSetting("bilingualTerms", e.target.checked)}
            className="accent-[var(--primary)]"
          />
          {t("settings.terms")}
        </label>
        {state.settings.bilingualTerms && (
          <div className="mt-3">
            <div className="text-xs font-medium text-muted-foreground">{t("settings.secondLang")}</div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {LANGS.filter((l) => l !== lang).map((l) => (
                <Pill key={l} active={other === l} onClick={() => setOther(l)}>
                  {t(`lang.${l}`)}
                </Pill>
              ))}
            </div>
          </div>
        )}
      </Card>

      <Card>
        <h2 className="text-sm font-semibold">{t("settings.models")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("settings.modelsText")}</p>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold">{t("auth.title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("auth.subtitle")}</p>
        <Link
          to="/auth"
          className="mt-3 inline-block rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary"
        >
          {t("nav.account")}
        </Link>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold">{t("settings.about")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("settings.aboutText")}</p>
      </Card>
    </div>
  );
}
