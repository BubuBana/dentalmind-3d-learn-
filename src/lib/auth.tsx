import * as React from "react";

/**
 * Auth is prepared but intentionally local-only for the MVP.
 * Swapping this provider for a real session (and syncing the progress
 * store) is the only change required to enable cross-device accounts.
 */
export interface AppUser {
  id: string;
  email: string;
}

type Ctx = {
  user: AppUser | null;
  enabled: boolean;
  signInLocal: (email: string) => void;
  signOut: () => void;
};

const AuthContext = React.createContext<Ctx | null>(null);
const KEY = "dentalmind3d.user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AppUser | null>(null);

  React.useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      try {
        setUser(JSON.parse(raw) as AppUser);
      } catch {
        /* ignore */
      }
    }
  }, []);

  const value = React.useMemo<Ctx>(
    () => ({
      user,
      enabled: false,
      signInLocal: (email: string) => {
        const u = { id: "local", email };
        setUser(u);
        localStorage.setItem(KEY, JSON.stringify(u));
      },
      signOut: () => {
        setUser(null);
        localStorage.removeItem(KEY);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): Ctx {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
