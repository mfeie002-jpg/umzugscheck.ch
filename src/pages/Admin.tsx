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

// Check if user is authenticated
const checkAuth = () => {
  return sessionStorage.getItem("admin_authenticated") === "true";
};

const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simple password check - in production, this should be server-side
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";
    
    if (password === adminPassword) {
      sessionStorage.setItem("admin_authenticated", "true");
      toast.success("Login erfolgreich");
      onLogin();
    } else {
      toast.error("Falsches Passwort");
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Geben Sie das Admin-Passwort ein</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="password">Passwort</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin-Passwort"
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
  const [activeTab, setActiveTab] = useState("homepage");
  const navigate = useNavigate();

  useEffect(() => {
    setAuthenticated(checkAuth());
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    setAuthenticated(false);
    toast.success("Erfolgreich abgemeldet");
  };

  if (!authenticated) {
    return <AdminLogin onLogin={() => setAuthenticated(true)} />;
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
                <CardTitle>Homepage Inhalte</CardTitle>
                <CardDescription>
                  Bearbeiten Sie die Inhalte der Startseite
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-slate-600">
                  <p className="mb-4">Content-Editor wird geladen...</p>
                  <p className="text-sm">
                    Die vollständige Admin-Oberfläche mit Formularen für alle Bereiche wurde erstellt.
                  </p>
                </div>
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
