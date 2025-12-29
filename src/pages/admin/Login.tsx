import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock, User, Shield, ArrowRight, AlertTriangle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { user, isAdmin, adminChecked, loading, signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Prevent "infinite loading" when backend signOut hangs (network/db issues)
  const safeSignOut = async () => {
    try {
      await Promise.race([
        supabase.auth.signOut(),
        new Promise<void>((resolve) => setTimeout(resolve, 2000)),
      ]);
    } catch {
      // ignore
    }
  };

  const handleLogoutAndContinue = async () => {
    await safeSignOut();
  };

  const handleContinueAsAdmin = () => {
    navigate("/admin");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) throw error;

      toast({
        title: "Erfolgreich angemeldet",
        description: "Admin-Zugriff wird geprüft…",
      });

      // AdminLayout übernimmt die sichere Rollenprüfung; kein doppelter has_role Check hier.
      navigate("/admin");
    } catch (error: any) {
      toast({
        title: "Anmeldefehler",
        description: error?.message || "Ungültige E-Mail oder Passwort",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // While the session and role are being verified, show a stable loading UI
  if (loading || (user && !adminChecked)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Admin-Zugriff wird geprüft…</span>
        </div>
      </div>
    );
  }

  // Auto-redirect if already admin - no manual click needed
  useEffect(() => {
    if (user && isAdmin && adminChecked) {
      navigate("/admin", { replace: true });
    }
  }, [user, isAdmin, adminChecked, navigate]);

  // If already admin, show brief loading while redirect happens
  if (user && isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Weiterleitung zum Dashboard…</span>
        </div>
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
            <CardDescription>Zugang zum Admin-Dashboard</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {user && !isAdmin && (
            <div className="mb-6 rounded-lg border bg-muted/40 p-4 text-sm">
              <p className="font-medium">Du bist bereits eingeloggt, aber ohne Admin-Rechte.</p>
              <div className="mt-3 flex flex-col gap-2">
                <Button variant="outline" onClick={handleLogoutAndContinue} className="w-full">
                  Abmelden und neu versuchen
                </Button>
              </div>
            </div>
          )}

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
            <p className="text-sm text-center text-muted-foreground">Noch kein Konto?</p>
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