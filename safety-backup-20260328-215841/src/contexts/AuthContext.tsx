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
      const timeoutMs = 15000; // Increased timeout for slow networks
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
        // On timeout/error, still allow app to load without session
        logger.warn("Session check failed, continuing without auth", error);
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
    const isNetworkError = (err: any) => {
      const msg = String(err?.message || err || "").toLowerCase();
      return msg.includes("failed to fetch") || 
             msg.includes("networkerror") || 
             msg.includes("network error") ||
             msg.includes("load failed");
    };

    // 1) Try normal browser login first with timeout
    try {
      console.log("[Auth] Attempting signInWithPassword...");
      
      const signInPromise = supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error("Login timeout")), 15000)
      );
      
      const { error, data } = await Promise.race([signInPromise, timeoutPromise]);

      if (!error) {
        console.log("[Auth] signInWithPassword succeeded");
        return { error: null, data };
      }
      
      // If it's not a network error, return the actual error
      if (!isNetworkError(error)) {
        console.log("[Auth] signInWithPassword failed (not network):", error.message);
        return { error, data };
      }
      
      console.log("[Auth] signInWithPassword network error, trying edge function fallback...");
    } catch (directError: any) {
      // Check if it's a network error - if not, return it
      if (!isNetworkError(directError)) {
        console.log("[Auth] signInWithPassword exception (not network):", directError?.message);
        return { error: directError, data: null };
      }
      console.log("[Auth] signInWithPassword network exception, trying edge function fallback...");
    }

    // 2) Fallback: try edge function for environments where /auth/v1 is blocked
    try {
      console.log("[Auth] Invoking admin-login edge function...");
      
      const fnPromise = supabase.functions.invoke("admin-login", { 
        body: { email, password } 
      });
      
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error("Edge function timeout")), 20000)
      );
      
      const { data: fnData, error: fnError } = await Promise.race([fnPromise, timeoutPromise]);

      if (fnError) {
        const msg = fnError.message || "";
        console.log("[Auth] Edge function error:", msg);
        
        if (isNetworkError(fnError)) {
          return {
            error: new Error("Backend nicht erreichbar. Bitte Adblocker/Privacy-Shields prüfen oder im Inkognito-Modus testen."),
            data: null,
          };
        }
        return { error: new Error(msg || "Anmeldung fehlgeschlagen"), data: null };
      }

      const access_token = (fnData as any)?.access_token;
      const refresh_token = (fnData as any)?.refresh_token;
      
      if (!access_token || !refresh_token) {
        // Check if there's an error message in the response
        const errorMsg = (fnData as any)?.error;
        if (errorMsg) {
          console.log("[Auth] Edge function returned error:", errorMsg);
          return { error: new Error(errorMsg), data: null };
        }
        console.log("[Auth] Edge function missing tokens");
        return { error: new Error("Anmeldung fehlgeschlagen"), data: null };
      }

      console.log("[Auth] Edge function succeeded, setting session...");
      
      const { data: sessionData, error: setError } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (setError) {
        console.log("[Auth] setSession error:", setError.message);
      } else {
        console.log("[Auth] Session set successfully");
      }

      return { error: setError, data: sessionData };
    } catch (fallbackError: any) {
      console.log("[Auth] Edge function exception:", fallbackError?.message);
      
      if (isNetworkError(fallbackError)) {
        return {
          error: new Error("Backend nicht erreichbar. Bitte Adblocker/Privacy-Shields prüfen oder im Inkognito-Modus testen."),
          data: null,
        };
      }
      return {
        error: new Error(fallbackError?.message || "Anmeldung fehlgeschlagen"),
        data: null,
      };
    }
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
