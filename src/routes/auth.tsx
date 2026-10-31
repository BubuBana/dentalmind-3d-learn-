import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { SectionTitle, Card } from "@/components/ui";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Account — DentalMind3D" },
      { name: "description", content: "Accesso predisposto per sincronizzare i progressi di studio tra dispositivi." },
      { property: "og:title", content: "Account — DentalMind3D" },
      { property: "og:description", content: "Accesso e sincronizzazione dei progressi (in arrivo)." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { t } = useI18n();
  const { user, signInLocal, signOut } = useAuth();
  const [email, setEmail] = React.useState("");

  return (
    <div className="mx-auto max-w-md">
      <SectionTitle title={t("auth.title")} subtitle={t("auth.subtitle")} />
      <Card>
        {user ? (
          <div className="space-y-3 text-sm">
            <p className="font-medium">{user.email}</p>
            <button
              type="button"
              onClick={signOut}
              className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:border-primary"
            >
              {t("common.close")}
            </button>
          </div>
        ) : (
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim()) signInLocal(email.trim());
            }}
          >
            <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("auth.email")}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              {t("auth.signIn")}
            </button>
          </form>
        )}
        <p className="mt-4 rounded-xl bg-[var(--warn-bg)] p-3 text-xs text-[var(--warn-fg)]">{t("auth.soon")}</p>
        <Link to="/" className="mt-3 block text-center text-sm text-muted-foreground hover:text-primary">
          {t("auth.local")}
        </Link>
      </Card>
    </div>
  );
}
