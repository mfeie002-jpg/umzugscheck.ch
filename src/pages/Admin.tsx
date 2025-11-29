import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Home, Settings, FileText, MapPin, HelpCircle, DollarSign, Award, LogOut } from "lucide-react";
import { HomepageEditor } from "@/components/admin/HomepageEditor";
import { supabase } from "@/integrations/supabase/client";

const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Check if user has admin role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', authData.user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (roleError) throw roleError;

      if (!roleData) {
        await supabase.auth.signOut();
        toast.error("Keine Admin-Berechtigung");
        return;
      }

      toast.success("Login erfolgreich");
      onLogin();
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || "Login fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Melden Sie sich mit Ihrem Admin-Konto an</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Passwort</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Passwort"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Wird geprüft..." : "Anmelden"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("homepage");
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setAuthenticated(false);
        setLoading(false);
        return;
      }

      // Check if user has admin role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      setAuthenticated(!!roleData);
    } catch (error) {
      console.error('Auth check error:', error);
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setAuthenticated(false);
      toast.success("Erfolgreich abgemeldet");
    } catch (error) {
      toast.error("Fehler beim Abmelden");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Wird geladen...</div>
      </div>
    );
  }

  if (!authenticated) {
    return <AdminLogin onLogin={() => checkAuth()} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">umzugscheck.ch Admin</h1>
            <p className="text-sm text-slate-600">Content Management</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate("/")}>
              Zur Website
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Abmelden
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-7 w-full">
            <TabsTrigger value="homepage">
              <Home className="h-4 w-4 mr-2" />
              Homepage
            </TabsTrigger>
            <TabsTrigger value="services">
              <FileText className="h-4 w-4 mr-2" />
              Services
            </TabsTrigger>
            <TabsTrigger value="regions">
              <MapPin className="h-4 w-4 mr-2" />
              Regionen
            </TabsTrigger>
            <TabsTrigger value="faq">
              <HelpCircle className="h-4 w-4 mr-2" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="costs">
              <DollarSign className="h-4 w-4 mr-2" />
              Preise
            </TabsTrigger>
            <TabsTrigger value="whyus">
              <Award className="h-4 w-4 mr-2" />
              Why Us
            </TabsTrigger>
            <TabsTrigger value="seo">
              <Settings className="h-4 w-4 mr-2" />
              SEO
            </TabsTrigger>
          </TabsList>

          <TabsContent value="homepage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Homepage Inhalt bearbeiten</CardTitle>
                <CardDescription>
                  Ändern Sie Texte, Überschriften und andere Inhalte der Startseite
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HomepageEditor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dienstleistungen</CardTitle>
                <CardDescription>
                  Verwalten Sie alle Services und Leistungen
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-slate-600">
                  <p>Services Editor</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="regions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Regionen & Städte</CardTitle>
                <CardDescription>
                  Verwalten Sie alle Schweizer Regionen und Städte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-slate-600">
                  <p>Regionen Editor</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>FAQ</CardTitle>
                <CardDescription>
                  Verwalten Sie häufig gestellte Fragen
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-slate-600">
                  <p>FAQ Editor</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="costs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preisbeispiele</CardTitle>
                <CardDescription>
                  Verwalten Sie Kostenbeispiele
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-slate-600">
                  <p>Preise Editor</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="whyus" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Why Us / USPs</CardTitle>
                <CardDescription>
                  Verwalten Sie Ihre Alleinstellungsmerkmale
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-slate-600">
                  <p>Why Us Editor</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SEO Einstellungen</CardTitle>
                <CardDescription>
                  Verwalten Sie Meta-Tags und SEO-Inhalte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-slate-600">
                  <p>SEO Editor</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
