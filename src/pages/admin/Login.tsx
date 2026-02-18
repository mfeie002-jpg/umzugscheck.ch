import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Lock, User, Shield, ArrowRight, Loader2, Wifi, WifiOff, Info, AlertCircle, KeyRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type ConnectionStatus = "idle" | "testing" | "ok" | "error";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { user, isAdmin, adminChecked, loading, signIn } = useAuth();

  const [email, setEmail] = useState("mfeie002@gmail.com");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [connStatus, setConnStatus] = useState<ConnectionStatus>("idle");
  const [connError, setConnError] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showResetInfo, setShowResetInfo] = useState(false);

  const testConnection = async () => {
    setConnStatus("testing");
    setConnError(null);
    try {
      const { error } = await supabase.functions.invoke("health");
      if (error) throw error;
      setConnStatus("ok");
    } catch (err: any) {
      setConnStatus("error");
      setConnError(err?.message || "Verbindung fehlgeschlagen");
    }
  };

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


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);

    try {
      console.log("[AdminLogin] Starting login for:", email);
      const { error } = await signIn(email, password);
      
      if (error) {
        console.log("[AdminLogin] Login error:", error.message);
        throw error;
      }

      console.log("[AdminLogin] Login successful, navigating to /admin");
      toast({
        title: "Erfolgreich angemeldet",
        description: "Admin-Zugriff wird geprüft…",
      });

      navigate("/admin");
    } catch (error: any) {
      console.error("[AdminLogin] Login failed:", error);
      
      const raw = error?.message || "";
      
      let errorMessage = "Anmeldung fehlgeschlagen. Bitte erneut versuchen.";
      
      if (raw.includes("Invalid login credentials") || raw.includes("invalid_credentials")) {
        errorMessage = "Falsches Passwort oder E-Mail. Bitte das Passwort zuerst zurücksetzen (siehe unten).";
        setShowResetInfo(true);
      } else if (raw.includes("Email not confirmed")) {
        errorMessage = "E-Mail wurde noch nicht bestätigt. Die Bestätigung wird automatisch vorgenommen – bitte kurz warten und erneut versuchen.";
      } else if (raw.includes("Failed to fetch") || raw.includes("NetworkError")) {
        errorMessage = "Backend nicht erreichbar. Bitte Verbindung prüfen.";
      } else if (raw) {
        errorMessage = raw;
      }
      
      setLoginError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-redirect if already admin - no manual click needed
  useEffect(() => {
    if (!loading && user && isAdmin && adminChecked) {
      navigate("/admin", { replace: true });
    }
  }, [user, isAdmin, adminChecked, loading, navigate]);

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

          {/* Login Error */}
          {loginError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}

          {/* Reset Info Banner */}
          {showResetInfo && (
            <Alert className="mb-4">
              <KeyRound className="h-4 w-4" />
              <AlertDescription className="space-y-1">
                <p className="font-medium">Passwort zurücksetzen</p>
                <p className="text-xs">
                  Rufe folgende URL auf um das Passwort zu setzen:<br />
                  <code className="text-xs bg-muted px-1 rounded break-all">
                    POST /functions/v1/admin-reset-password<br />
                    {"{ \"email\": \"mfeie002@gmail.com\", \"newPassword\": \"DeinNeuesPasswort123!\", \"secret\": \"umzug-admin-setup-2026\" }"}
                  </code>
                </p>
                <p className="text-xs mt-1">
                  Oder nutze den «Passwort vergessen» Flow unten.
                </p>
              </AlertDescription>
            </Alert>
          )}

          {/* Hint box */}
          <div className="mb-4 rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground flex gap-2">
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            <span>Primäre Admin-E-Mail: <strong>mfeie002@gmail.com</strong>. Falls das Passwort unbekannt ist, nutze die Reset-Funktion.</span>
          </div>

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
                  onChange={(e) => { setEmail(e.target.value); setLoginError(null); }}
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
                  onChange={(e) => { setPassword(e.target.value); setLoginError(null); }}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Anmeldung läuft...</>
              ) : (
                <>Anmelden <ArrowRight className="ml-2 w-4 h-4" /></>
              )}
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

            {/* Connection test */}
            <div className="mt-4 pt-4 border-t">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full text-muted-foreground"
                onClick={testConnection}
                disabled={connStatus === "testing"}
              >
                {connStatus === "testing" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {connStatus === "ok" && <Wifi className="mr-2 h-4 w-4 text-primary" />}
                {connStatus === "error" && <WifiOff className="mr-2 h-4 w-4 text-destructive" />}
                {connStatus === "idle" && <Wifi className="mr-2 h-4 w-4" />}
                Backend-Verbindung testen
              </Button>
              {connStatus === "ok" && (
                <p className="text-xs text-center text-primary mt-1">Verbindung OK</p>
              )}
              {connStatus === "error" && (
                <p className="text-xs text-center text-destructive mt-1">
                  {connError || "Verbindung fehlgeschlagen"}
                </p>
              )}
            </div>

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