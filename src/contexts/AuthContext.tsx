import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  adminChecked: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any; data: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdminStatus = async (userId: string) => {
    const attempt = async (timeoutMs: number) => {
      const roleCheckPromise = supabase.rpc("has_role", {
        _user_id: userId,
        _role: "admin",
      });

      return await Promise.race([
        roleCheckPromise,
        new Promise<{ data: null; error: Error }>((_, reject) =>
          setTimeout(
            () => reject({ data: null, error: new Error("Role check timeout") }),
            timeoutMs
          )
        ),
      ]).catch(() => ({ data: null, error: new Error("Role check failed") }));
    };

    setAdminChecked(false);

    try {
      // First try with a generous timeout (cold starts / busy DB)
      let { data, error } = await attempt(8000);

      // One retry to avoid flaky "not admin" right after login
      if (error) {
        ({ data, error } = await attempt(8000));
      }

      const admin = !error && Boolean(data);
      setIsAdmin(admin);
      return admin;
    } catch (error) {
      logger.error("Error checking admin status", error);
      setIsAdmin(false);
      return false;
    } finally {
      setAdminChecked(true);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Mark as unchecked until we confirm role
        setAdminChecked(false);
        setTimeout(() => {
          checkAdminStatus(session.user.id);
        }, 0);
      } else {
        setIsAdmin(false);
        setAdminChecked(true);
      }
    });

    // Check for existing session (timeout-safe to avoid infinite loading)
    (async () => {
      const timeoutMs = 6000;
      try {
        const result = await Promise.race([
          supabase.auth.getSession(),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("getSession timeout")), timeoutMs)
          ),
        ]);

        const currentSession = result.data.session;
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          await checkAdminStatus(currentSession.user.id);
        } else {
          setIsAdmin(false);
          setAdminChecked(true);
        }
      } catch (error) {
        logger.error("Error loading session", error);
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        setAdminChecked(true);
      } finally {
        setLoading(false);
      }
    })();

    return () => subscription.unsubscribe();
  }, []);


  const signIn = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error, data };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        adminChecked,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
