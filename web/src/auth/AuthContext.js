import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthService } from "../lib/auth";
import { supabase } from "../lib/supabase";
const Ctx = createContext({ user: null, loading: true, refresh: async () => { }, logout: async () => { } });
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    async function refresh() {
        try {
            const profile = await AuthService.getCurrentUser();
            setUser(profile);
        }
        catch {
            setUser(null);
        }
        finally {
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
            }
            else if (event === 'SIGNED_OUT') {
                setUser(null);
                setLoading(false);
            }
        });
        return () => subscription.unsubscribe();
    }, []);
    return _jsx(Ctx.Provider, { value: { user, loading, refresh, logout }, children: children });
}
export const useAuth = () => useContext(Ctx);
