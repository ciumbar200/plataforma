import { createContext, useContext, useEffect, useState } from "react";
import { AuthService } from "../lib/auth";
import { supabase } from "../lib/supabase";

type User = { id: string; email: string; name?: string; role: "ADMIN"|"INQUILINO"|"PROPIETARIO"; plan: string; image?: string; videoUrl?: string; };
type AuthCtx = { user: User | null; loading: boolean; refresh: () => Promise<void>; logout: () => Promise<void> };

const Ctx = createContext<AuthCtx>({ user: null, loading: true, refresh: async () => {}, logout: async () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const profile = await AuthService.getCurrentUser();
      setUser(profile);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await AuthService.signOut();
    setUser(null);
  }

  useEffect(() => {
    // Initial session check
    refresh();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await refresh();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return <Ctx.Provider value={{ user, loading, refresh, logout }}>{children}</Ctx.Provider>;
}
export const useAuth = () => useContext(Ctx);
