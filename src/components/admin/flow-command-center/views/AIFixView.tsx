/**
 * AI Fix View - Side-by-Side Comparison of Original vs AI-Fixed Flows
 * 
 * Features:
 * - List all AI fix variants with status
 * - Side-by-side comparison: Original screenshots vs AI-fixed flow live preview
 * - Apply/Mark as implemented
 * - Copy fix prompts
 * - View prompt details
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  Sparkles, 
  Loader2, 
  ExternalLink, 
  Copy, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Play,
  Eye,
  Code,
  ArrowLeftRight,
  Wand2,
  RefreshCw,
  ChevronRight,
  FileText,
  Smartphone,
  Monitor
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getAnalysisBaseUrl } from '@/data/constants';
import { FLOW_CONFIGS } from '@/data/flowConfigs';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface AIFixVariant {
  id: string;
  flow_id: string;
  variant_name: string;
  variant_label: string;
  status: string;
  output_flow_id: string | null;
  created_at: string;
  prompt: string;
  executed_at: string | null;
  error_message: string | null;
}

interface StepScreenshot {
  stepNumber: number;
  mobileUrl: string | null;
  desktopUrl: string | null;
}

interface AIFixViewProps {
  initialFlowId?: string;
  onSelectFlow?: (flowId: string) => void;
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export const AIFixView: React.FC<AIFixViewProps> = ({
  initialFlowId,
  onSelectFlow
}) => {
  const [variants, setVariants] = useState<AIFixVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<AIFixVariant | null>(null);
  const [originalScreenshots, setOriginalScreenshots] = useState<StepScreenshot[]>([]);
  const [loadingScreenshots, setLoadingScreenshots] = useState(false);
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [showPromptDialog, setShowPromptDialog] = useState(false);
  const [promptDialogVariant, setPromptDialogVariant] = useState<AIFixVariant | null>(null);

  // ─────────────────────────────────────────────────────────────
  // Data Fetching
  // ─────────────────────────────────────────────────────────────

  const fetchVariants = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('flow_feedback_variants')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Filter by flow if specified
      if (initialFlowId) {
        const normalizedId = initialFlowId.replace('umzugsofferten-', '').toLowerCase();
        query = query.or(`flow_id.eq.${initialFlowId},flow_id.ilike.%${normalizedId}%`);
      }
      
      const { data, error } = await query.limit(50);
      
      if (error) throw error;
      setVariants(data || []);
      
      // Auto-select first variant if available
      if (data && data.length > 0 && !selectedVariant) {
        setSelectedVariant(data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch AI fix variants:', err);
      toast.error('Fehler beim Laden der AI-Fix-Varianten');
    } finally {
      setLoading(false);
    }
  }, [initialFlowId, selectedVariant]);

  const fetchOriginalScreenshots = useCallback(async (flowId: string) => {
    setLoadingScreenshots(true);
    try {
      const normalizedId = flowId.replace('umzugsofferten-', '').toLowerCase();
      const candidates = [flowId, normalizedId, `umzugsofferten-${normalizedId}`];
      
      // Get latest completed run
      const { data: latestRun } = await supabase
        .from('flow_analysis_runs')
        .select('id')
        .in('flow_id', candidates)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (!latestRun?.id) {
        setOriginalScreenshots([]);
        return;
      }
      
      const { data: screenshots } = await supabase
        .from('flow_step_metrics')
        .select('step_number, mobile_screenshot_url, desktop_screenshot_url')
        .eq('run_id', latestRun.id)
        .order('step_number');
      
      setOriginalScreenshots(
        (screenshots || []).map(s => ({
          stepNumber: s.step_number,
          mobileUrl: s.mobile_screenshot_url,
          desktopUrl: s.desktop_screenshot_url
        }))
      );
    } catch (err) {
      console.error('Failed to fetch screenshots:', err);
    } finally {
      setLoadingScreenshots(false);
    }
  }, []);

  useEffect(() => {
    fetchVariants();
  }, [fetchVariants]);

  useEffect(() => {
    if (selectedVariant?.flow_id) {
      fetchOriginalScreenshots(selectedVariant.flow_id);
    }
  }, [selectedVariant?.flow_id, fetchOriginalScreenshots]);

  // ─────────────────────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────────────────────

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'done':
        return <Badge className="bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />Fertig</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Ausstehend</Badge>;
      case 'running':
        return <Badge className="bg-blue-600"><Loader2 className="h-3 w-3 mr-1 animate-spin" />Läuft</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Fehler</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getLiveUrl = (flowId: string | null): string => {
    if (!flowId) return '#';
    const normalized = flowId.replace('umzugsofferten-', '').toLowerCase();
    const config = FLOW_CONFIGS[normalized] || FLOW_CONFIGS[flowId];
    if (config?.path) {
      return config.path;
    }
    return `/umzugsofferten?v=${normalized}`;
  };

  const copyPrompt = async (variant: AIFixVariant) => {
    await navigator.clipboard.writeText(variant.prompt);
    toast.success('Prompt kopiert!');
  };

  const openPromptDialog = (variant: AIFixVariant) => {
    setPromptDialogVariant(variant);
    setShowPromptDialog(true);
  };

  const markAsImplemented = async (variantId: string) => {
    const { error } = await supabase
      .from('flow_feedback_variants')
      .update({ status: 'done', executed_at: new Date().toISOString() })
      .eq('id', variantId);
    
    if (error) {
      toast.error('Fehler beim Aktualisieren');
      return;
    }
    
    toast.success('Als implementiert markiert');
    fetchVariants();
  };

  // ─────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (variants.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Wand2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Keine AI-Fix-Varianten</h3>
          <p className="text-muted-foreground mb-4">
            Es wurden noch keine AI-generierten Fix-Varianten erstellt.
          </p>
          <Button variant="outline" onClick={fetchVariants}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Aktualisieren
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                AI Auto-Fix Vergleich
              </CardTitle>
              <CardDescription>
                {variants.length} Varianten • Vergleiche Original mit AI-generierten Fixes
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={fetchVariants}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Aktualisieren
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Variants List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">AI-Fix Varianten</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              <div className="space-y-1 p-3">
                {variants.map(variant => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg border transition-all",
                      selectedVariant?.id === variant.id
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-transparent hover:border-border hover:bg-muted/50"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-medium text-sm truncate flex-1">
                        {variant.variant_name}
                      </span>
                      {getStatusBadge(variant.status)}
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      Original: {variant.flow_id}
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      {variant.prompt.substring(0, 100)}...
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          openPromptDialog(variant);
                        }}
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Prompt
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyPrompt(variant);
                        }}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Comparison Panel */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <ArrowLeftRight className="h-4 w-4" />
                Side-by-Side Vergleich
              </CardTitle>
              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                <Button
                  variant={viewMode === 'mobile' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('mobile')}
                  className="h-7 px-2"
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'desktop' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('desktop')}
                  className="h-7 px-2"
                >
                  <Monitor className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedVariant ? (
              <div className="space-y-4">
                {/* Variant Info */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <div className="font-medium">{selectedVariant.variant_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedVariant.flow_id} → {selectedVariant.output_flow_id || 'Kein Output'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedVariant.output_flow_id && (
                      <Link 
                        to={getLiveUrl(selectedVariant.output_flow_id)}
                        target="_blank"
                      >
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Fix öffnen
                        </Button>
                      </Link>
                    )}
                    <Link 
                      to={getLiveUrl(selectedVariant.flow_id)}
                      target="_blank"
                    >
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4 mr-1" />
                        Original öffnen
                      </Button>
                    </Link>
                    {selectedVariant.status !== 'done' && (
                      <Button 
                        size="sm"
                        onClick={() => markAsImplemented(selectedVariant.id)}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Implementiert
                      </Button>
                    )}
                  </div>
                </div>

                {/* Side-by-Side View */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Original */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-center pb-2 border-b">
                      📷 Original Screenshots
                    </div>
                    <ScrollArea className="h-[450px]">
                      {loadingScreenshots ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                      ) : originalScreenshots.length > 0 ? (
                        <div className="space-y-3 pr-3">
                          {originalScreenshots.map(s => (
                            <div key={s.stepNumber} className="space-y-1">
                              <Badge variant="outline" className="text-xs">
                                Step {s.stepNumber}
                              </Badge>
                              {(viewMode === 'mobile' ? s.mobileUrl : s.desktopUrl) ? (
                                <img
                                  src={viewMode === 'mobile' ? s.mobileUrl! : s.desktopUrl!}
                                  alt={`Step ${s.stepNumber}`}
                                  className="w-full rounded-lg border"
                                />
                              ) : (
                                <div className="aspect-[9/16] bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-sm">
                                  Kein Screenshot
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          Keine Screenshots verfügbar
                        </div>
                      )}
                    </ScrollArea>
                  </div>

                  {/* Fixed Version - Live iframe */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-center pb-2 border-b flex items-center justify-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-500" />
                      AI-Fix Live Preview
                    </div>
                    {selectedVariant.output_flow_id ? (
                      <div 
                        className={cn(
                          "rounded-lg border overflow-hidden bg-white",
                          viewMode === 'mobile' ? "max-w-[375px] mx-auto" : ""
                        )}
                        style={{ height: 450 }}
                      >
                        <iframe
                          src={`${getAnalysisBaseUrl()}${getLiveUrl(selectedVariant.output_flow_id)}`}
                          className="w-full h-full"
                          title="AI Fix Preview"
                        />
                      </div>
                    ) : (
                      <div className="h-[450px] bg-muted rounded-lg flex flex-col items-center justify-center text-muted-foreground">
                        <AlertTriangle className="h-8 w-8 mb-2" />
                        <div className="text-sm font-medium">Kein Output-Flow</div>
                        <div className="text-xs mt-1">
                          Der Fix wurde noch nicht generiert
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-4"
                          onClick={() => openPromptDialog(selectedVariant)}
                        >
                          <Code className="h-4 w-4 mr-1" />
                          Prompt anzeigen
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Prompt Preview */}
                <div className="p-3 rounded-lg bg-muted/30 border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Fix-Prompt</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyPrompt(selectedVariant)}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Kopieren
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-3 font-mono">
                    {selectedVariant.prompt}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <div>Wähle eine Variante zum Vergleichen</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Prompt Dialog */}
      <Dialog open={showPromptDialog} onOpenChange={setShowPromptDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Fix-Prompt: {promptDialogVariant?.variant_name}
            </DialogTitle>
            <DialogDescription>
              Original Flow: {promptDialogVariant?.flow_id}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[50vh]">
            <pre className="text-sm bg-muted p-4 rounded-lg whitespace-pre-wrap font-mono">
              {promptDialogVariant?.prompt}
            </pre>
          </ScrollArea>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                if (promptDialogVariant) copyPrompt(promptDialogVariant);
              }}
            >
              <Copy className="h-4 w-4 mr-2" />
              Prompt kopieren
            </Button>
            <Button onClick={() => setShowPromptDialog(false)}>
              Schliessen
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIFixView;
