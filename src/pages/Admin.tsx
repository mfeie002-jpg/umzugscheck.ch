import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Home, Settings, FileText, MapPin, HelpCircle, DollarSign, Award, LogOut, Building2, Users, CreditCard, BarChart3, Mail, Download, Target } from "lucide-react";
import { HomepageEditor } from "@/components/admin/HomepageEditor";
import { ProviderManagement } from "@/components/admin/ProviderManagement";
import { LeadManagement } from "@/components/admin/LeadManagement";
import { PaymentManagement } from "@/components/admin/PaymentManagement";
import { AdminStatistics } from "@/components/admin/AdminStatistics";
import { EmailTemplateEditor } from "@/components/admin/EmailTemplateEditor";
import { LeadQualityDashboard } from "@/components/admin/LeadQualityDashboard";
import { RevenueAnalytics } from "@/components/admin/RevenueAnalytics";
import { LeadExport } from "@/components/admin/LeadExport";
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
  const [activeTab, setActiveTab] = useState("dashboard");
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
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full gap-1">
            <TabsTrigger value="dashboard">
              <BarChart3 className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="providers">
              <Building2 className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Anbieter</span>
            </TabsTrigger>
            <TabsTrigger value="leads">
              <Users className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Leads</span>
            </TabsTrigger>
            <TabsTrigger value="quality">
              <Target className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Qualität</span>
            </TabsTrigger>
            <TabsTrigger value="payments">
              <CreditCard className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Zahlungen</span>
            </TabsTrigger>
            <TabsTrigger value="revenue">
              <DollarSign className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Umsatz</span>
            </TabsTrigger>
            <TabsTrigger value="emails">
              <Mail className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">E-Mails</span>
            </TabsTrigger>
            <TabsTrigger value="homepage">
              <Home className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Content</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AdminStatistics />
          </TabsContent>

          <TabsContent value="providers">
            <ProviderManagement />
          </TabsContent>

          <TabsContent value="leads">
            <div className="space-y-6">
              <LeadManagement />
              <LeadExport />
            </div>
          </TabsContent>

          <TabsContent value="quality">
            <LeadQualityDashboard />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentManagement />
          </TabsContent>

          <TabsContent value="revenue">
            <RevenueAnalytics />
          </TabsContent>

          <TabsContent value="emails">
            <EmailTemplateEditor />
          </TabsContent>

          <TabsContent value="homepage">
            <Card>
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
                <CardDescription>Homepage und andere Inhalte bearbeiten</CardDescription>
              </CardHeader>
              <CardContent>
                <HomepageEditor />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
