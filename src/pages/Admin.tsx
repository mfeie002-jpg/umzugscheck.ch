import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Home, DollarSign, LogOut, Building2, Users, CreditCard, BarChart3, Mail, Target, Camera, Package, MousePointer2 } from "lucide-react";
import { HomepageEditor } from "@/components/admin/HomepageEditor";
import { ProviderManagement } from "@/components/admin/ProviderManagement";
import { LeadManagement } from "@/components/admin/LeadManagement";
import { PaymentManagement } from "@/components/admin/PaymentManagement";
import { AdminStatistics } from "@/components/admin/AdminStatistics";
import { EmailTemplateEditor } from "@/components/admin/EmailTemplateEditor";
import { LeadQualityDashboard } from "@/components/admin/LeadQualityDashboard";
import { RevenueAnalytics } from "@/components/admin/RevenueAnalytics";
import { LeadExport } from "@/components/admin/LeadExport";
import { ScreenshotMachine } from "@/components/admin/ScreenshotMachine";
import { ScreenshotArchive } from "@/components/admin/ScreenshotArchive";
import { CompetitorCapture } from "@/components/admin/CompetitorCapture";
import { AIFeedbackPackage } from "@/components/admin/AIFeedbackPackage";
import { ScreenshotDiff } from "@/components/admin/ScreenshotDiff";
import { LovableImplementationKit } from "@/components/admin/LovableImplementationKit";
import { LighthouseAudit } from "@/components/admin/LighthouseAudit";
import { HeatmapAnalytics } from "@/components/admin/HeatmapAnalytics";
import { FormAnalytics } from "@/components/admin/analytics/FormAnalytics";
import { SessionRecordings } from "@/components/admin/analytics/SessionRecordings";
import { UserFlowVisualization } from "@/components/admin/analytics/UserFlowVisualization";
import { BounceRateTracker } from "@/components/admin/analytics/BounceRateTracker";
import { ConversionFunnels } from "@/components/admin/analytics/ConversionFunnels";
import { ABTestResults } from "@/components/admin/analytics/ABTestResults";
import { RealTimeVisitors } from "@/components/admin/analytics/RealTimeVisitors";
import { PageLoadTracker } from "@/components/admin/analytics/PageLoadTracker";
import { ErrorTracking } from "@/components/admin/analytics/ErrorTracking";
import { UserSegments } from "@/components/admin/analytics/UserSegments";
import { UltimateZipPackage } from "@/components/admin/analytics/UltimateZipPackage";
import { supabase } from "@/integrations/supabase/client";

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setAuthenticated(false);
        navigate('/admin/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/admin/login');
        return;
      }

      // Check if user has admin role
      const { data: roleData, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .single();

      if (error || !roleData) {
        toast.error("Keine Admin-Berechtigung");
        await supabase.auth.signOut();
        navigate('/admin/login');
        return;
      }

      setAuthenticated(true);
    } catch (error) {
      console.error('Auth check error:', error);
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Erfolgreich abgemeldet");
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Wird geladen...</div>
      </div>
    );
  }

  if (!authenticated) {
    return null; // Will redirect via useEffect
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
          <TabsList className="grid grid-cols-5 lg:grid-cols-11 w-full gap-1">
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
            <TabsTrigger value="screenshots">
              <Camera className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Screenshots</span>
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <MousePointer2 className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="ai-tools">
              <Package className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">AI Tools</span>
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

          <TabsContent value="screenshots">
            <div className="space-y-6">
              <ScreenshotMachine />
              <ScreenshotArchive />
              <ScreenshotDiff />
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <UltimateZipPackage />
              <HeatmapAnalytics />
              <div className="grid gap-6 md:grid-cols-2">
                <FormAnalytics />
                <SessionRecordings />
              </div>
              <UserFlowVisualization />
              <div className="grid gap-6 md:grid-cols-2">
                <BounceRateTracker />
                <ConversionFunnels />
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <ABTestResults />
                <RealTimeVisitors />
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <PageLoadTracker />
                <ErrorTracking />
              </div>
              <UserSegments />
            </div>
          </TabsContent>

          <TabsContent value="ai-tools">
            <div className="space-y-6">
              <LovableImplementationKit />
              <AIFeedbackPackage />
              <CompetitorCapture />
              <LighthouseAudit />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
