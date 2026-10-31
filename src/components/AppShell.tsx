import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { LANGS } from "@/lib/teeth";
import { cn } from "@/lib/utils";
import {
  Home,
  BookOpen,
  GraduationCap,
  Brain,
  Columns2,
  Languages,
  BarChart3,
  CalendarCheck,
  Settings,
  MessagesSquare,
  Route,
  Timer,
  Menu,
  X,
} from "lucide-react";


const NAV = [
  { to: "/", key: "nav.home", icon: Home },
  { to: "/conosci-il-dente", key: "nav.knowTooth", icon: BookOpen },
  { to: "/study", key: "nav.study", icon: GraduationCap },
  { to: "/quiz", key: "nav.quiz", icon: Brain },
  { to: "/tutor", key: "nav.tutor", icon: MessagesSquare },
  { to: "/path", key: "nav.path", icon: Route },
  { to: "/exam", key: "nav.exam", icon: Timer },
  { to: "/compare", key: "nav.compare", icon: Columns2 },
  { to: "/vocabulary", key: "nav.vocabulary", icon: Languages },
  { to: "/progress", key: "nav.progress", icon: BarChart3 },
  { to: "/daily", key: "nav.daily", icon: CalendarCheck },
  { to: "/settings", key: "nav.settings", icon: Settings },
] as const;


export function LanguageSwitch({ className }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  return (
    <div
      role="group"
      aria-label={t("lang.label")}
      className={cn("inline-flex rounded-full border border-border bg-card p-0.5", className)}
    >
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          title={t(`lang.${l}`)}
          className={cn(
            "grid min-h-9 min-w-9 place-items-center rounded-full px-1.5 text-[11px] font-semibold uppercase transition sm:min-h-0 sm:min-w-0 sm:px-2.5 sm:py-1 sm:text-xs",
            lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const [open, setOpen] = React.useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto grid h-14 max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-3 sm:flex sm:h-16 sm:gap-3 sm:px-4">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[image:var(--gradient-primary)] text-xs font-black text-primary-foreground shadow-[var(--shadow-soft)] sm:h-9 sm:w-9 sm:rounded-xl sm:text-sm">
              3D
            </span>
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="text-sm font-bold tracking-tight">{t("app.name")}</span>
              <span className="text-[11px] text-muted-foreground">{t("app.tagline")}</span>
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-0.5 xl:flex">
            {NAV.slice(0, 6).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                search={{}}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition",
                  isActive(item.to) ? "bg-secondary text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2 xl:ml-2">
            <LanguageSwitch />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border xl:hidden"
              aria-label="Menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            <Link
              to="/settings"
              className="hidden h-9 w-9 place-items-center rounded-lg border border-border xl:grid"
              aria-label={t("nav.settings")}
            >
              <Settings className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {open && (
          <div id="mobile-menu" className="max-h-[calc(100dvh-8rem)] overflow-y-auto border-t border-border bg-card xl:hidden">
            <div className="mx-auto grid max-w-6xl grid-cols-2 gap-1 p-3 sm:grid-cols-3">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  search={{}}
                  className={cn(
                    "flex min-w-0 items-center gap-2 rounded-lg px-2 py-2.5 text-xs font-medium sm:px-3 sm:text-sm",
                    isActive(item.to) ? "bg-secondary text-primary" : "text-muted-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {t(item.key)}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="app-content mx-auto min-w-0 max-w-6xl px-3 pb-[calc(5rem+env(safe-area-inset-bottom))] pt-4 sm:px-4 sm:pt-6 lg:pb-14">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-5 pb-[env(safe-area-inset-bottom)]">
          {NAV.slice(0, 5).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              search={{}}
              className={cn(
                "flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 px-1 py-2 text-center text-[10px] font-medium leading-tight",
                isActive(item.to) ? "text-primary" : "text-muted-foreground",
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className="line-clamp-2">{t(item.key)}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
