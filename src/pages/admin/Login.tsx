import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock, User, Shield, ArrowRight, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [existingAdminEmail, setExistingAdminEmail] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // Check if already authenticated - always show this screen first
  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          if (!cancelled) setCheckingSession(false);
          return;
        }

        // Check if user has admin role
        const { data: isAdmin, error: roleError } = await supabase.rpc("has_role", {
          _user_id: session.user.id,
          _role: "admin",
        });

        if (!cancelled) {
          if (!roleError && isAdmin) {
            // Show the "already logged in" screen - don't auto-redirect
            setExistingAdminEmail(session.user.email ?? session.user.id);
          } else {
            // User is logged in but not an admin - sign out first
            await supabase.auth.signOut();
          }
          setCheckingSession(false);
        }
      } catch (error) {
        if (!cancelled) setCheckingSession(false);
      }
    };

    checkAuth();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogoutAndContinue = async () => {
    await supabase.auth.signOut();
    setExistingAdminEmail(null);
  };

  const handleContinueAsAdmin = () => {
    navigate("/admin");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Check if user has admin role
        const { data: isAdmin, error: roleError } = await supabase.rpc("has_role", {
          _user_id: data.user.id,
          _role: "admin",
        });

        if (roleError || !isAdmin) {
          await supabase.auth.signOut();
          toast({
            title: "Zugriff verweigert",
            description: "Sie haben keine Admin-Berechtigung.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Erfolgreich angemeldet",
          description: "Willkommen im Admin-Dashboard",
        });
        
        navigate("/admin");
      }
    } catch (error: any) {
      toast({
        title: "Anmeldefehler",
        description: error.message || "Ungültige E-Mail oder Passwort",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
        <div className="animate-pulse text-muted-foreground">Lade...</div>
      </div>
    );
  }

  // Show existing admin session notice
  if (existingAdminEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
        <Card className="w-full max-w-md shadow-xl border-2">
          <CardHeader className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Bereits angemeldet</CardTitle>
              <CardDescription>
                Du bist eingeloggt als Admin
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg flex items-center gap-3">
              <User className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">{existingAdminEmail}</span>
            </div>
            
            <Button
              onClick={handleContinueAsAdmin}
              className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90"
            >
              Zum Admin-Dashboard
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">oder</span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleLogoutAndContinue}
              className="w-full flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              Mit anderem Account anmelden
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md shadow-xl border-2">
        <CardHeader className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
            <CardDescription>
              Zugang zum Admin-Dashboard
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Anmeldung läuft..." : "Anmelden"}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t space-y-4">
            <p className="text-sm text-center text-muted-foreground">
              Noch kein Konto?
            </p>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate("/auth")}
            >
              Registrieren
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Geschützter Bereich nur für autorisierte Administratoren
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;