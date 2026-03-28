/**
 * ZIP Exporter Admin Page
 * =======================
 * Export Flows, Landing Pages, and complete project backup as ZIP files
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Package,
  Download,
  Loader2,
  FileArchive,
  Layers,
  FileText,
  Database,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { format } from "date-fns";

interface ExportStatus {
  isExporting: boolean;
  progress: number;
  message: string;
  type: 'flows' | 'landingpages' | 'complete' | null;
}

export default function ZipExporter() {
  const [status, setStatus] = useState<ExportStatus>({
    isExporting: false,
    progress: 0,
    message: '',
    type: null,
  });
  const [stats, setStats] = useState({
    flows: 0,
    landingPages: 0,
    leads: 0,
    providers: 0,
  });

  // Load stats on mount
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [flowsRes, lpRes, leadsRes, providersRes] = await Promise.all([
        supabase.from('flow_versions').select('id', { count: 'exact', head: true }),
        supabase.from('landing_pages').select('id', { count: 'exact', head: true }),
        supabase.from('leads').select('id', { count: 'exact', head: true }),
        supabase.from('service_providers').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        flows: flowsRes.count || 0,
        landingPages: lpRes.count || 0,
        leads: leadsRes.count || 0,
        providers: providersRes.count || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  // ============================================================================
  // FLOWS EXPORT
  // ============================================================================
  const exportFlows = async () => {
    setStatus({ isExporting: true, progress: 0, message: 'Lade Flow-Daten...', type: 'flows' });
    
    try {
      const zip = new JSZip();
      const flowsFolder = zip.folder('flows');
      
      // Get all flow versions
      setStatus(s => ({ ...s, progress: 10, message: 'Lade Flow-Versionen...' }));
      const { data: flowVersions, error: fvError } = await supabase
        .from('flow_versions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (fvError) throw fvError;
      
      // Get flow analysis runs
      setStatus(s => ({ ...s, progress: 25, message: 'Lade Analyse-Daten...' }));
      const { data: analysisRuns } = await supabase
        .from('flow_analysis_runs')
        .select('*')
        .order('created_at', { ascending: false });

      // Get flow feature scores
      setStatus(s => ({ ...s, progress: 40, message: 'Lade Feature-Scores...' }));
      const { data: featureScores } = await supabase
        .from('flow_feature_scores')
        .select('*')
        .order('created_at', { ascending: false });

      // Get flow UX issues
      setStatus(s => ({ ...s, progress: 55, message: 'Lade UX-Issues...' }));
      const { data: uxIssues } = await supabase
        .from('flow_ux_issues')
        .select('*')
        .order('created_at', { ascending: false });

      // Get custom flow configs
      setStatus(s => ({ ...s, progress: 65, message: 'Lade Custom Configs...' }));
      const { data: customConfigs } = await supabase
        .from('custom_flow_configs')
        .select('*')
        .order('created_at', { ascending: false });

      // Get flow feedback variants
      setStatus(s => ({ ...s, progress: 75, message: 'Lade Feedback-Varianten...' }));
      const { data: feedbackVariants } = await supabase
        .from('flow_feedback_variants')
        .select('*')
        .order('created_at', { ascending: false });

      // Create JSON files
      setStatus(s => ({ ...s, progress: 85, message: 'Erstelle ZIP...' }));
      
      flowsFolder?.file('flow_versions.json', JSON.stringify(flowVersions || [], null, 2));
      flowsFolder?.file('flow_analysis_runs.json', JSON.stringify(analysisRuns || [], null, 2));
      flowsFolder?.file('flow_feature_scores.json', JSON.stringify(featureScores || [], null, 2));
      flowsFolder?.file('flow_ux_issues.json', JSON.stringify(uxIssues || [], null, 2));
      flowsFolder?.file('custom_flow_configs.json', JSON.stringify(customConfigs || [], null, 2));
      flowsFolder?.file('flow_feedback_variants.json', JSON.stringify(feedbackVariants || [], null, 2));
      
      // Create summary
      const summary = {
        exportDate: new Date().toISOString(),
        flowVersionsCount: flowVersions?.length || 0,
        analysisRunsCount: analysisRuns?.length || 0,
        featureScoresCount: featureScores?.length || 0,
        uxIssuesCount: uxIssues?.length || 0,
        customConfigsCount: customConfigs?.length || 0,
        feedbackVariantsCount: feedbackVariants?.length || 0,
      };
      flowsFolder?.file('_summary.json', JSON.stringify(summary, null, 2));

      // Generate ZIP
      setStatus(s => ({ ...s, progress: 95, message: 'Generiere Download...' }));
      const content = await zip.generateAsync({ type: 'blob' });
      const fileName = `umzugscheck-flows-export-${format(new Date(), 'yyyy-MM-dd')}.zip`;
      saveAs(content, fileName);

      setStatus({ isExporting: false, progress: 100, message: 'Fertig!', type: null });
      toast.success(`Flows Export erstellt: ${fileName}`);
    } catch (error) {
      console.error('Flows export error:', error);
      toast.error('Export fehlgeschlagen');
      setStatus({ isExporting: false, progress: 0, message: '', type: null });
    }
  };

  // ============================================================================
  // LANDING PAGES EXPORT
  // ============================================================================
  const exportLandingPages = async () => {
    setStatus({ isExporting: true, progress: 0, message: 'Lade Landing Pages...', type: 'landingpages' });
    
    try {
      const zip = new JSZip();
      const lpFolder = zip.folder('landing-pages');
      
      // Get all landing pages
      setStatus(s => ({ ...s, progress: 15, message: 'Lade Landing Pages...' }));
      const { data: landingPages, error: lpError } = await supabase
        .from('landing_pages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (lpError) throw lpError;
      
      // Get landing page versions
      setStatus(s => ({ ...s, progress: 35, message: 'Lade Versionen...' }));
      const { data: versions } = await supabase
        .from('landing_page_versions')
        .select('*')
        .order('created_at', { ascending: false });

      // Get landing page analyses
      setStatus(s => ({ ...s, progress: 55, message: 'Lade Analysen...' }));
      const { data: analyses } = await supabase
        .from('landing_page_analyses')
        .select('*')
        .order('created_at', { ascending: false });

      // Get landing page comparisons
      setStatus(s => ({ ...s, progress: 70, message: 'Lade Vergleiche...' }));
      const { data: comparisons } = await supabase
        .from('landing_page_comparisons')
        .select('*')
        .order('created_at', { ascending: false });

      // Create JSON files
      setStatus(s => ({ ...s, progress: 85, message: 'Erstelle ZIP...' }));
      
      lpFolder?.file('landing_pages.json', JSON.stringify(landingPages || [], null, 2));
      lpFolder?.file('landing_page_versions.json', JSON.stringify(versions || [], null, 2));
      lpFolder?.file('landing_page_analyses.json', JSON.stringify(analyses || [], null, 2));
      lpFolder?.file('landing_page_comparisons.json', JSON.stringify(comparisons || [], null, 2));
      
      // Create summary
      const summary = {
        exportDate: new Date().toISOString(),
        landingPagesCount: landingPages?.length || 0,
        versionsCount: versions?.length || 0,
        analysesCount: analyses?.length || 0,
        comparisonsCount: comparisons?.length || 0,
      };
      lpFolder?.file('_summary.json', JSON.stringify(summary, null, 2));

      // Generate ZIP
      setStatus(s => ({ ...s, progress: 95, message: 'Generiere Download...' }));
      const content = await zip.generateAsync({ type: 'blob' });
      const fileName = `umzugscheck-landingpages-all-${format(new Date(), 'yyyy-MM-dd')}.zip`;
      saveAs(content, fileName);

      setStatus({ isExporting: false, progress: 100, message: 'Fertig!', type: null });
      toast.success(`Landing Pages Export erstellt: ${fileName}`);
    } catch (error) {
      console.error('Landing pages export error:', error);
      toast.error('Export fehlgeschlagen');
      setStatus({ isExporting: false, progress: 0, message: '', type: null });
    }
  };

  // ============================================================================
  // COMPLETE BACKUP EXPORT
  // ============================================================================
  const exportComplete = async () => {
    setStatus({ isExporting: true, progress: 0, message: 'Starte kompletten Backup...', type: 'complete' });
    
    try {
      const zip = new JSZip();
      
      // ===== FLOWS =====
      setStatus(s => ({ ...s, progress: 5, message: 'Exportiere Flows...' }));
      const flowsFolder = zip.folder('flows');
      
      const { data: flowVersions } = await supabase.from('flow_versions').select('*');
      const { data: analysisRuns } = await supabase.from('flow_analysis_runs').select('*');
      const { data: featureScores } = await supabase.from('flow_feature_scores').select('*');
      const { data: uxIssues } = await supabase.from('flow_ux_issues').select('*');
      const { data: customConfigs } = await supabase.from('custom_flow_configs').select('*');
      const { data: feedbackVariants } = await supabase.from('flow_feedback_variants').select('*');
      const { data: flowStepMetrics } = await supabase.from('flow_step_metrics').select('*');
      const { data: flowAlerts } = await supabase.from('flow_alerts').select('*');
      
      flowsFolder?.file('flow_versions.json', JSON.stringify(flowVersions || [], null, 2));
      flowsFolder?.file('flow_analysis_runs.json', JSON.stringify(analysisRuns || [], null, 2));
      flowsFolder?.file('flow_feature_scores.json', JSON.stringify(featureScores || [], null, 2));
      flowsFolder?.file('flow_ux_issues.json', JSON.stringify(uxIssues || [], null, 2));
      flowsFolder?.file('custom_flow_configs.json', JSON.stringify(customConfigs || [], null, 2));
      flowsFolder?.file('flow_feedback_variants.json', JSON.stringify(feedbackVariants || [], null, 2));
      flowsFolder?.file('flow_step_metrics.json', JSON.stringify(flowStepMetrics || [], null, 2));
      flowsFolder?.file('flow_alerts.json', JSON.stringify(flowAlerts || [], null, 2));

      // ===== LANDING PAGES =====
      setStatus(s => ({ ...s, progress: 25, message: 'Exportiere Landing Pages...' }));
      const lpFolder = zip.folder('landing-pages');
      
      const { data: landingPages } = await supabase.from('landing_pages').select('*');
      const { data: lpVersions } = await supabase.from('landing_page_versions').select('*');
      const { data: lpAnalyses } = await supabase.from('landing_page_analyses').select('*');
      const { data: lpComparisons } = await supabase.from('landing_page_comparisons').select('*');
      
      lpFolder?.file('landing_pages.json', JSON.stringify(landingPages || [], null, 2));
      lpFolder?.file('landing_page_versions.json', JSON.stringify(lpVersions || [], null, 2));
      lpFolder?.file('landing_page_analyses.json', JSON.stringify(lpAnalyses || [], null, 2));
      lpFolder?.file('landing_page_comparisons.json', JSON.stringify(lpComparisons || [], null, 2));

      // ===== LEADS & BUSINESS DATA =====
      setStatus(s => ({ ...s, progress: 45, message: 'Exportiere Leads...' }));
      const businessFolder = zip.folder('business-data');
      
      const { data: leads } = await supabase.from('leads').select('*');
      const { data: estimateSessions } = await supabase.from('estimate_sessions').select('*');
      const { data: leadTransactions } = await supabase.from('lead_transactions').select('*');
      const { data: leadBids } = await supabase.from('lead_bids').select('*');
      const { data: conversionAnalytics } = await supabase.from('conversion_analytics').select('*');
      
      businessFolder?.file('leads.json', JSON.stringify(leads || [], null, 2));
      businessFolder?.file('estimate_sessions.json', JSON.stringify(estimateSessions || [], null, 2));
      businessFolder?.file('lead_transactions.json', JSON.stringify(leadTransactions || [], null, 2));
      businessFolder?.file('lead_bids.json', JSON.stringify(leadBids || [], null, 2));
      businessFolder?.file('conversion_analytics.json', JSON.stringify(conversionAnalytics || [], null, 2));

      // ===== PROVIDERS =====
      setStatus(s => ({ ...s, progress: 60, message: 'Exportiere Provider...' }));
      const providersFolder = zip.folder('providers');
      
      const { data: providers } = await supabase.from('service_providers').select('*');
      const { data: reviews } = await supabase.from('reviews').select('*');
      const { data: companies } = await supabase.from('companies').select('*');
      const { data: providerMetrics } = await supabase.from('provider_performance_metrics').select('*');
      
      providersFolder?.file('service_providers.json', JSON.stringify(providers || [], null, 2));
      providersFolder?.file('reviews.json', JSON.stringify(reviews || [], null, 2));
      providersFolder?.file('companies.json', JSON.stringify(companies || [], null, 2));
      providersFolder?.file('provider_performance_metrics.json', JSON.stringify(providerMetrics || [], null, 2));

      // ===== ANALYTICS & AB TESTS =====
      setStatus(s => ({ ...s, progress: 75, message: 'Exportiere Analytics...' }));
      const analyticsFolder = zip.folder('analytics');
      
      const { data: abTests } = await supabase.from('ab_tests').select('*');
      const { data: platformAnalytics } = await supabase.from('platform_analytics').select('*');
      const { data: homepageEvents } = await supabase.from('homepage_ab_events').select('*');
      
      analyticsFolder?.file('ab_tests.json', JSON.stringify(abTests || [], null, 2));
      analyticsFolder?.file('platform_analytics.json', JSON.stringify(platformAnalytics || [], null, 2));
      analyticsFolder?.file('homepage_ab_events.json', JSON.stringify(homepageEvents || [], null, 2));

      // ===== CONFIG & SETTINGS =====
      setStatus(s => ({ ...s, progress: 85, message: 'Exportiere Konfiguration...' }));
      const configFolder = zip.folder('config');
      
      const { data: emailCampaigns } = await supabase.from('email_campaigns').select('*');
      const { data: subscriptionPlans } = await supabase.from('subscription_plans').select('*');
      const { data: userRoles } = await supabase.from('user_roles').select('*');
      
      configFolder?.file('email_campaigns.json', JSON.stringify(emailCampaigns || [], null, 2));
      configFolder?.file('subscription_plans.json', JSON.stringify(subscriptionPlans || [], null, 2));
      configFolder?.file('user_roles.json', JSON.stringify(userRoles || [], null, 2));

      // ===== SUMMARY =====
      const summary = {
        exportDate: new Date().toISOString(),
        exportType: 'complete',
        counts: {
          flowVersions: flowVersions?.length || 0,
          analysisRuns: analysisRuns?.length || 0,
          landingPages: landingPages?.length || 0,
          leads: leads?.length || 0,
          providers: providers?.length || 0,
          reviews: reviews?.length || 0,
          abTests: abTests?.length || 0,
        },
      };
      zip.file('_export_summary.json', JSON.stringify(summary, null, 2));
      zip.file('README.md', `# Umzugscheck.ch - Kompletter Backup

Exportiert am: ${format(new Date(), 'dd.MM.yyyy HH:mm')}

## Inhalt

- **/flows/** - Alle Flow-Versionen, Analysen, Scores
- **/landing-pages/** - Alle Landing Pages und Versionen
- **/business-data/** - Leads, Transaktionen, Sessions
- **/providers/** - Dienstleister, Reviews, Performance
- **/analytics/** - AB-Tests, Platform Analytics
- **/config/** - Email-Kampagnen, Subscription Plans

## Statistiken

- ${flowVersions?.length || 0} Flow-Versionen
- ${landingPages?.length || 0} Landing Pages
- ${leads?.length || 0} Leads
- ${providers?.length || 0} Provider
- ${reviews?.length || 0} Reviews
`);

      // Generate ZIP
      setStatus(s => ({ ...s, progress: 95, message: 'Generiere Download...' }));
      const content = await zip.generateAsync({ type: 'blob' });
      const fileName = `umzugscheckv2-complete-backup-${format(new Date(), 'yyyy-MM-dd')}.zip`;
      saveAs(content, fileName);

      setStatus({ isExporting: false, progress: 100, message: 'Fertig!', type: null });
      toast.success(`Kompletter Backup erstellt: ${fileName}`);
    } catch (error) {
      console.error('Complete export error:', error);
      toast.error('Export fehlgeschlagen');
      setStatus({ isExporting: false, progress: 0, message: '', type: null });
    }
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileArchive className="h-8 w-8 text-primary" />
          ZIP Exporter
        </h1>
        <p className="text-muted-foreground mt-2">
          Exportiere Flows, Landing Pages oder komplette Backups als ZIP-Dateien
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.flows}</p>
                <p className="text-xs text-muted-foreground">Flow Versionen</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.landingPages}</p>
                <p className="text-xs text-muted-foreground">Landing Pages</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{stats.leads}</p>
                <p className="text-xs text-muted-foreground">Leads</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{stats.providers}</p>
                <p className="text-xs text-muted-foreground">Provider</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Progress */}
      {status.isExporting && (
        <Card className="mb-8 border-primary">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <div className="flex-1">
                <p className="font-medium">{status.message}</p>
                <Progress value={status.progress} className="mt-2" />
              </div>
              <Badge variant="outline">{status.progress}%</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Options */}
      <Tabs defaultValue="flows" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="flows" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Flows
          </TabsTrigger>
          <TabsTrigger value="landingpages" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Landing Pages
          </TabsTrigger>
          <TabsTrigger value="complete" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Kompletter Backup
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flows">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-blue-500" />
                Flows Export
              </CardTitle>
              <CardDescription>
                Exportiert alle Flow-Versionen, Analysen, Feature-Scores und UX-Issues
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted rounded-lg p-4">
                <h4 className="font-medium mb-2">Enthält:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• flow_versions.json - Alle Flow-Versionen mit Screenshots</li>
                  <li>• flow_analysis_runs.json - Analyse-Ergebnisse</li>
                  <li>• flow_feature_scores.json - Feature-Bewertungen</li>
                  <li>• flow_ux_issues.json - UX-Probleme und Fixes</li>
                  <li>• custom_flow_configs.json - Custom Configs</li>
                  <li>• flow_feedback_variants.json - AI Feedback</li>
                </ul>
              </div>
              <Button 
                onClick={exportFlows} 
                disabled={status.isExporting}
                className="w-full"
                size="lg"
              >
                {status.isExporting && status.type === 'flows' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Flows als ZIP exportieren
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="landingpages">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-500" />
                Landing Pages Export
              </CardTitle>
              <CardDescription>
                Exportiert alle Landing Pages mit Versionen, Analysen und Vergleichen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted rounded-lg p-4">
                <h4 className="font-medium mb-2">Enthält:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• landing_pages.json - Alle Landing Pages</li>
                  <li>• landing_page_versions.json - Alle Versionen mit HTML</li>
                  <li>• landing_page_analyses.json - Analyse-Ergebnisse</li>
                  <li>• landing_page_comparisons.json - Vergleiche</li>
                </ul>
              </div>
              <Button 
                onClick={exportLandingPages} 
                disabled={status.isExporting}
                className="w-full"
                size="lg"
              >
                {status.isExporting && status.type === 'landingpages' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Landing Pages als ZIP exportieren
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="complete">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-purple-500" />
                Kompletter Backup
              </CardTitle>
              <CardDescription>
                Exportiert alle Daten: Flows, Landing Pages, Leads, Provider, Analytics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted rounded-lg p-4">
                <h4 className="font-medium mb-2">Enthält:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>/flows/</strong> - Alle Flow-Daten</li>
                  <li>• <strong>/landing-pages/</strong> - Alle LP-Daten</li>
                  <li>• <strong>/business-data/</strong> - Leads, Sessions, Transaktionen</li>
                  <li>• <strong>/providers/</strong> - Provider, Reviews, Metrics</li>
                  <li>• <strong>/analytics/</strong> - AB-Tests, Platform Analytics</li>
                  <li>• <strong>/config/</strong> - Email-Kampagnen, Plans, Roles</li>
                </ul>
              </div>
              <Button 
                onClick={exportComplete} 
                disabled={status.isExporting}
                className="w-full"
                size="lg"
                variant="default"
              >
                {status.isExporting && status.type === 'complete' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Kompletten Backup erstellen
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
