import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { buildApiUrl } from "@/lib/api";
import {
  AUTH_STORAGE_KEY,
  TOKEN_STORAGE_KEY,
  mapBackendRole,
  type StoredAuthUser,
  type StoredUserRole,
} from "@/lib/auth";

export type AppRole = StoredUserRole;

export type AppUser = {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: AppRole;
};

interface AuthContextType {
  user: AppUser | null;
  token: string | null;
  profile: { full_name: string | null; phone: string | null; avatar_url: string | null } | null;
  roles: AppRole[];
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; user: Record<string, unknown> | null }>;
  signOut: () => Promise<void>;
  hasRole: (role: AppRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function toAppUser(raw: StoredAuthUser): AppUser {
  return {
    id: raw.id,
    email: raw.email,
    name: raw.name,
    phone: raw.phone,
    role: raw.role,
  };
}

function persistSession(token: string, apiUser: { _id?: string; id?: string; email: string; name?: string; phone?: string; role?: string }) {
  const id = String(apiUser._id || apiUser.id || "");
  const mapped: StoredAuthUser = {
    id,
    email: apiUser.email,
    name: apiUser.name || apiUser.email.split("@")[0],
    phone: apiUser.phone,
    role: mapBackendRole(apiUser.role),
  };
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mapped));
  localStorage.setItem("user", JSON.stringify({ ...mapped, _id: id }));
  return toAppUser(mapped);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const hydrate = useCallback(() => {
    const t = localStorage.getItem(TOKEN_STORAGE_KEY);
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!t || !raw) {
      setToken(null);
      setUser(null);
      return;
    }
    try {
      const parsed = JSON.parse(raw) as StoredAuthUser;
      setToken(t);
      setUser(toAppUser(parsed));
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    hydrate();
    setLoading(false);
  }, [hydrate]);

  const profile = user
    ? { full_name: user.name, phone: user.phone ?? null, avatar_url: null as string | null }
    : null;

  const roles: AppRole[] = user ? [user.role] : [];

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const res = await fetch(buildApiUrl("/api/auth/signup"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name: fullName,
          role: "customer",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return { error: new Error(data.message || "Signup failed") };
      }
      if (data.token && data.user) {
        const u = persistSession(data.token, data.user);
        setToken(data.token);
        setUser(u);
      }
      return { error: null };
    } catch (e) {
      return { error: e instanceof Error ? e : new Error("Signup failed") };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const res = await fetch(buildApiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return { error: new Error(data.message || "Login failed"), user: null };
      }
      if (!data.token || !data.user) {
        return { error: new Error("Invalid server response"), user: null };
      }
      const u = persistSession(data.token, data.user);
      setToken(data.token);
      setUser(u);
      return { error: null, user: { ...u, _id: u.id } as Record<string, unknown> };
    } catch (e) {
      return { error: e instanceof Error ? e : new Error("Login failed"), user: null };
    }
  };

  const signOut = async () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const hasRole = (role: AppRole) => roles.includes(role);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        profile,
        roles,
        loading,
        signUp,
        signIn,
        signOut,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
