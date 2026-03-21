import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: { full_name: string | null; phone: string | null; avatar_url: string | null } | null;
  roles: AppRole[];
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; user: Record<string, unknown> | null }>;
  signOut: () => Promise<void>;
  hasRole: (role: AppRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function buildStoredUser(user: User) {
  return {
    ...user,
    _id: user.id,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AuthContextType["profile"]>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        localStorage.setItem("user", JSON.stringify(buildStoredUser(session.user)));
        setTimeout(() => {
          fetchProfile(session.user.id);
          fetchRoles(session.user.id);
        }, 0);
      } else {
        localStorage.removeItem("user");
        setProfile(null);
        setRoles([]);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        localStorage.setItem("user", JSON.stringify(buildStoredUser(session.user)));
        fetchProfile(session.user.id);
        fetchRoles(session.user.id);
      } else {
        localStorage.removeItem("user");
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    const { data } = await supabase.from("profiles").select("full_name, phone, avatar_url").eq("id", userId).single();
    if (data) setProfile(data);
  }

  async function fetchRoles(userId: string) {
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
    if (data) setRoles(data.map((r) => r.role));
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) return { error: error as Error };
    // Update profile with full_name
    if (data.user) {
      await supabase.from("profiles").update({ full_name: fullName }).eq("id", data.user.id);
    }
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (data.user) {
      const storedUser = buildStoredUser(data.user);
      localStorage.setItem("user", JSON.stringify(storedUser));
      return { error: null, user: storedUser };
    }

    return { error: error as Error | null, user: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("user");
    setSession(null);
    setUser(null);
    setProfile(null);
    setRoles([]);
  };

  const hasRole = (role: AppRole) => roles.includes(role);

  return (
    <AuthContext.Provider value={{ session, user, profile, roles, loading, signUp, signIn, signOut, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
