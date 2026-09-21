import React, { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../Lib/SupaBase";

export interface Subscription {
  id: string;
  user_id: string;
  status: "active" | "trialing" | "canceled" | "incomplete" | string;
  plan_id?: string;
  current_period_end?: string;
}

export interface AuthState {
  session: Session | null;
  user: User | null;
  subscription: Subscription | null;
  isAuthenticated: boolean;
  hasActiveSubscription: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch subscription directly tied to authenticated user ID
  const fetchSubscription = async (
    userId: string,
  ): Promise<Subscription | null> => {
    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching subscription:", error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.error("Subscription query failure:", err);
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;

    // 1. Initial Session Load
    const initializeAuth = async () => {
      try {
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();

        if (!isMounted) return;
        setSession(initialSession);

        if (initialSession?.user) {
          const sub = await fetchSubscription(initialSession.user.id);
          if (isMounted) setSubscription(sub);
        }
      } catch (err) {
        console.error("Error initializing auth state:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initializeAuth();

    // 2. Realtime Auth State Listener (login, logout, token refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        setSession(currentSession);

        if (currentSession?.user) {
          const sub = await fetchSubscription(currentSession.user.id);
          setSubscription(sub);
        } else {
          setSubscription(null);
        }
        setIsLoading(false);
      },
    );

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setSubscription(null);
  };

  const hasActiveSubscription = Boolean(
    subscription &&
    (subscription.status === "active" || subscription.status === "trialing"),
  );

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        subscription,
        isAuthenticated: Boolean(session?.user),
        hasActiveSubscription,
        isLoading,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthState => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
