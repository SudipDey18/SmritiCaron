import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { tokenStore } from "./api/client";
import { authApi, usersApi } from "./api/endpoints";
import type { AuthUser, Language, Profile } from "./api/types";

type AuthState = {
  user: (AuthUser | Profile) | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (input: { name: string; email: string; password: string; language?: Language }) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const load = useCallback(async () => {
    if (!tokenStore.access()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      setUser(await usersApi.me());
    } catch {
      setUser(null);
      tokenStore.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const onAuth = () => void load();
    window.addEventListener("smriti-auth", onAuth);
    return () => window.removeEventListener("smriti-auth", onAuth);
  }, [load]);

  const value = useMemo<AuthState>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      async signIn(email, password) {
        const result = await authApi.login({ email, password });
        tokenStore.set(result.tokens);
        setUser(result.user);
        setLoading(false);
      },
      async signUp(input) {
        const result = await authApi.register(input);
        tokenStore.set(result.tokens);
        setUser(result.user);
        setLoading(false);
      },
      async signOut() {
        const refresh = tokenStore.refresh();
        try {
          await authApi.logout(refresh);
        } catch {
          /* logging out locally is enough */
        }
        await queryClient.cancelQueries();
        queryClient.clear();
        tokenStore.clear();
        setUser(null);
        void navigate({ to: "/sign-in", replace: true });
      },
      refreshUser: load,
    }),
    [user, loading, load, queryClient, navigate],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

/** Redirects to /sign-in on the client when no session exists. */
export function useRequireAuth() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !isAuthenticated) void navigate({ to: "/sign-in", replace: true });
  }, [loading, isAuthenticated, navigate]);
  return { ready: isAuthenticated && !loading, loading };
}
