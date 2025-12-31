/**
 * Ultimate Flow Exporter
 * ======================
 * Exports Ultimate Flows with complete assets for ChatGPT analysis:
 * 1. Build-Prompt (instructions to build in Lovable)
 * 2. Analyse-Prompt (feedback prompt for first run)
 * 3. Screenshots (Mobile + Desktop)
 * 4. HTML snapshots
 * 5. JSON data
 * 6. URLs
 * 7. Meta-data
 * 
 * Runs in BACKGROUND - you can close the page while export runs.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  Package,
  Download,
  Loader2,
  Copy,
  CheckCircle2,
  Wand2,
  Sparkles,
  FileText,
  RefreshCw,
  Eye,
  ExternalLink,
  CloudOff,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

// ============================================================================
// TYPES
// ============================================================================

interface UltimateFlowStep {
  number: number;
  name: string;
  sourceElements?: string[];
  features?: string[];
  archetypeValue?: Record<string, string>;
}

interface UltimateFlowData {
  id: string;
  flow_id: string;
  variant_name: string;
  variant_label: string;
  status: string;
  created_at: string;
  result_json: {
    ultimateFlow?: {
      name?: string;
      flowCode?: string;
      description?: string;
      expectedScore?: number;
      expectedConversionLift?: string;
      steps?: UltimateFlowStep[];
      keyFeatures?: Array<{
        feature: string;
        sourceFlow: string;
        implementation: string;
        impact: string;
      }>;
    };
    implementationPlan?: {
      phase1?: { name: string; duration: string; tasks: string[] };
      phase2?: { name: string; duration: string; tasks: string[] };
      phase3?: { name: string; duration: string; tasks: string[] };
    };
    successMetrics?: {
      targetScore?: number;
      conversionGoal?: string;
      archetypeCoverage?: Record<string, number>;
      kpis?: Array<{ metric: string; current: string; target: string }>;
    };
  } | null;
}

interface BackgroundJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  progressMessage: string;
  downloadUrl?: string;
  error?: string;
}

// ============================================================================
// PROMPT GENERATORS
// ============================================================================

function formatArchetype(key: string): string {
  const map: Record<string, string> = {
    securitySeeker: '🛡️ Security Seeker',
    efficiencyMaximizer: '⚡ Efficiency Maximizer',
    valueHunter: '💰 Value Hunter',
    overwhelmedParent: '🏠 Overwhelmed Parent',
  };
  return map[key] || key;
}

function generateBuildPrompt(flow: UltimateFlowData): string {
  const data = flow.result_json;
  if (!data?.ultimateFlow) return '// Keine Ultimate Flow Daten verfügbar';
  
  const uf = data.ultimateFlow;
  const plan = data.implementationPlan;
  
  let prompt = `# 🚀 LOVABLE BUILD PROMPT: ${uf.name || flow.variant_name}

## Projektübersicht
${uf.description || 'Ein optimierter Umzugs-Offerten-Funnel für die Schweiz.'}

**Ziel-Score:** ${uf.expectedScore || 95}/100
**Erwartete Conversion-Steigerung:** ${uf.expectedConversionLift || '+30%'}
**Flow-Code:** ${uf.flowCode || 'ultimate-flow'}

---

## Technische Anforderungen

Erstelle einen mehrstufigen Umzugs-Offerten-Funnel mit:
- **Framework:** React + TypeScript + Tailwind CSS
- **Design:** Mobile-First, Touch-Targets mindestens 48x48px
- **Lokalisierung:** Schweizer Deutsch (de-CH), CHF Preise
- **Responsive:** Optimiert für alle Bildschirmgrössen

---

## Flow-Struktur (${uf.steps?.length || 0} Steps)

`;

  if (uf.steps && uf.steps.length > 0) {
    uf.steps.forEach((step, idx) => {
      prompt += `### Step ${step.number || idx + 1}: ${step.name}\n\n`;
      if (step.features && step.features.length > 0) {
        prompt += `**Implementiere diese Features:**\n`;
        step.features.forEach(f => { prompt += `- ${f}\n`; });
      }
      if (step.archetypeValue) {
        prompt += `\n**Archetypen-Optimierung:**\n`;
        Object.entries(step.archetypeValue).forEach(([archetype, value]) => {
          prompt += `- ${formatArchetype(archetype)}: ${value}\n`;
        });
      }
      prompt += `\n`;
    });
  }

  if (uf.keyFeatures && uf.keyFeatures.length > 0) {
    prompt += `---\n\n## Key Features (KRITISCH)\n\n`;
    uf.keyFeatures.forEach((feature, idx) => {
      prompt += `### ${idx + 1}. ${feature.feature}
- **Implementation:** ${feature.implementation}
- **Impact:** ${feature.impact}

`;
    });
  }

  if (plan) {
    prompt += `---\n\n## Implementation Roadmap\n\n`;
    if (plan.phase1) {
      prompt += `### Phase 1: ${plan.phase1.name} (${plan.phase1.duration})\n`;
      plan.phase1.tasks?.forEach(t => { prompt += `- [ ] ${t}\n`; });
      prompt += `\n`;
    }
    if (plan.phase2) {
      prompt += `### Phase 2: ${plan.phase2.name} (${plan.phase2.duration})\n`;
      plan.phase2.tasks?.forEach(t => { prompt += `- [ ] ${t}\n`; });
      prompt += `\n`;
    }
    if (plan.phase3) {
      prompt += `### Phase 3: ${plan.phase3.name} (${plan.phase3.duration})\n`;
      plan.phase3.tasks?.forEach(t => { prompt += `- [ ] ${t}\n`; });
      prompt += `\n`;
    }
  }

  prompt += `---

## Design-Richtlinien

1. **Farben:** Schweizer Corporate-Blau (#0066CC) als Primärfarbe, Trust-Grün (#00A651) für Erfolg
2. **Typography:** Klare, lesbare Schriften (min. 16px auf Mobile)
3. **Spacing:** Grosszügige Abstände für Touch-Bedienung (min. 12px)
4. **Trust-Elemente:** ASTAG-Siegel, TÜV, Google Reviews an strategischen Punkten
5. **Progress:** Klare Fortschrittsanzeige "Schritt X von Y"
6. **CTA:** Auffällige, kontrastreiche Call-to-Action Buttons (min. 48px hoch)
`;

  return prompt;
}

function generateAnalysePrompt(flow: UltimateFlowData): string {
  const data = flow.result_json;
  if (!data?.ultimateFlow) return '// Keine Ultimate Flow Daten verfügbar';
  
  const uf = data.ultimateFlow;
  const metrics = data.successMetrics;
  
  let prompt = `# 🔍 CHATGPT ANALYSE PROMPT: ${uf.name || flow.variant_name}

Du bist ein UX/Conversion-Experte für Schweizer B2C-Plattformen. Analysiere diesen Umzugs-Offerten-Funnel.

## Deine Aufgabe

Ich habe diesen Flow implementiert und brauche dein Feedback. Analysiere die beigefügten Screenshots (Mobile + Desktop) und HTML-Dateien.

## Kontext

**Flow-Name:** ${uf.name || flow.variant_name}
**Ziel-Score:** ${uf.expectedScore || 95}/100
**Erwartete Conversion-Lift:** ${uf.expectedConversionLift || '+30%'}
**Anzahl Steps:** ${uf.steps?.length || 0}

## Zu prüfende Aspekte

### 1. Mobile-First UX (40% Gewichtung)
- Sind alle Touch-Targets mindestens 48x48px?
- Funktioniert die Swipe-Navigation?
- Ist die Schrift gross genug (min. 16px)?
- Gibt es horizontales Scrolling (sollte es nicht)?

### 2. Trust & Credibility (25% Gewichtung)
- Sind ASTAG/TÜV/Google-Siegel sichtbar?
- Gibt es Social Proof (Reviews, Anzahl Anfragen)?
- Werden Garantien kommuniziert?

### 3. Conversion-Optimierung (20% Gewichtung)
- Ist der CTA prominent und klar?
- Gibt es eine klare Fortschrittsanzeige?
- Werden Preise/Vorteile früh kommuniziert?
- Ist die Formular-Länge angemessen?

### 4. Archetypen-Abdeckung (15% Gewichtung)
`;

  if (metrics?.archetypeCoverage) {
    prompt += `\n**Geplante Abdeckung:**\n`;
    Object.entries(metrics.archetypeCoverage).forEach(([arch, score]) => {
      prompt += `- ${formatArchetype(arch)}: ${score}%\n`;
    });
  }

  prompt += `

## Erwartete Key Features

Prüfe ob diese Features korrekt implementiert sind:

`;

  if (uf.keyFeatures) {
    uf.keyFeatures.forEach((f, i) => {
      prompt += `${i + 1}. **${f.feature}**
   - Erwartet: ${f.implementation}
   - Impact: ${f.impact}
   
`;
    });
  }

  prompt += `## Dein Output

Gib mir:

1. **Overall Score (0-100)** mit kurzer Begründung
2. **Top 3 Stärken** - Was funktioniert besonders gut?
3. **Top 3 Probleme** - Was muss dringend gefixt werden?
4. **Quick Wins** - 3 Verbesserungen die unter 1h dauern
5. **Archetypen-Check** - Wird jeder der 4 Typen gut bedient?
`;

  return prompt;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function UltimateFlowExporter() {
  const [flows, setFlows] = useState<UltimateFlowData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeJob, setActiveJob] = useState<BackgroundJob | null>(null);
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  // Poll for job status
  const pollJobStatus = useCallback(async (jobId: string) => {
    try {
      const { data, error } = await supabase
        .from('export_jobs')
        .select('id, status, progress, progress_message, download_url, error_message')
        .eq('id', jobId)
        .single();

      if (error) {
        console.error('Poll error:', error);
        return null;
      }

      return {
        id: data.id,
        status: data.status as BackgroundJob['status'],
        progress: data.progress || 0,
        progressMessage: data.progress_message || '',
        downloadUrl: data.download_url || undefined,
        error: data.error_message || undefined,
      };
    } catch (err) {
      console.error('Poll error:', err);
      return null;
    }
  }, []);

  // Poll active job
  useEffect(() => {
    if (!activeJob || activeJob.status === 'completed' || activeJob.status === 'failed') {
      return;
    }

    const interval = setInterval(async () => {
      const status = await pollJobStatus(activeJob.id);
      if (status) {
        setActiveJob(status);
        
        if (status.status === 'completed') {
          toast.success('Export abgeschlossen! Download bereit.');
          clearInterval(interval);
        } else if (status.status === 'failed') {
          toast.error(`Export fehlgeschlagen: ${status.error || 'Unbekannter Fehler'}`);
          clearInterval(interval);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [activeJob, pollJobStatus]);

  // Check for pending jobs on mount
  useEffect(() => {
    const checkPendingJobs = async () => {
      try {
        const { data, error } = await supabase
          .from('export_jobs')
          .select('id, status, progress, progress_message, download_url, error_message, config')
          .in('status', ['pending', 'processing'])
          .eq('job_type', 'ultimate_flow_export')
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) throw error;

        if (data && data.length > 0) {
          const job = data[0];
          setActiveJob({
            id: job.id,
            status: job.status as BackgroundJob['status'],
            progress: job.progress || 0,
            progressMessage: job.progress_message || '',
            downloadUrl: job.download_url || undefined,
            error: job.error_message || undefined,
          });
        }
      } catch (err) {
        console.error('Failed to check pending jobs:', err);
      }
    };

    checkPendingJobs();
  }, []);

  // Load Ultimate Flows
  const loadFlows = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('flow_feedback_variants')
        .select('*')
        .or('variant_label.ilike.%ultimate%,variant_name.ilike.%ultimate%')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFlows((data || []) as UltimateFlowData[]);
      toast.success(`${data?.length || 0} Ultimate Flows geladen`);
    } catch (err) {
      console.error('Load flows error:', err);
      toast.error('Fehler beim Laden der Flows');
    } finally {
      setIsLoading(false);
    }
  };

  // Start background export
  const startBackgroundExport = async (flowIds?: string[]) => {
    try {
      // Create job record
      const configData = {
        type: 'ultimate_flow_export',
        flowIds: flowIds || [],
        baseUrl: window.location.origin,
      } as Json;

      const { data: jobData, error: jobError } = await supabase
        .from('export_jobs')
        .insert({
          job_type: 'ultimate_flow_export',
          status: 'pending',
          progress: 0,
          progress_message: 'Export wird gestartet...',
          config: configData,
        })
        .select()
        .single();

      if (jobError) throw jobError;

      const jobId = jobData.id;

      setActiveJob({
        id: jobId,
        status: 'pending',
        progress: 0,
        progressMessage: 'Export wird gestartet...',
      });

      // Trigger edge function (fire and forget)
      supabase.functions.invoke('export-ultimate-flows-background', {
        body: {
          jobId,
          flowIds: flowIds || undefined,
          baseUrl: window.location.origin,
          captureDesktop: true,
          captureMobile: true,
        },
      }).catch(err => {
        console.error('Edge function error:', err);
      });

      toast.success('Background-Export gestartet. Du kannst die Seite schliessen.');
    } catch (err) {
      console.error('Failed to start background export:', err);
      toast.error('Export konnte nicht gestartet werden');
    }
  };

  // Clear job
  const clearJob = () => {
    setActiveJob(null);
  };

  const copyPrompt = async (prompt: string, type: string) => {
    await navigator.clipboard.writeText(prompt);
    setCopiedPrompt(type);
    toast.success(`${type}-Prompt kopiert!`);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          Ultimate Flow Exporter
          <Badge variant="outline" className="ml-2">
            <CloudOff className="h-3 w-3 mr-1" />
            Background
          </Badge>
        </CardTitle>
        <CardDescription>
          Exportiere Ultimate Flows im Hintergrund – du kannst die Seite schliessen, der Export läuft weiter.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Active Job Status */}
        {activeJob && (
          <Alert className={activeJob.status === 'completed' ? 'border-green-500' : activeJob.status === 'failed' ? 'border-destructive' : ''}>
            <AlertDescription>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {activeJob.status === 'completed' ? '✅ Export abgeschlossen' :
                     activeJob.status === 'failed' ? '❌ Export fehlgeschlagen' :
                     '⏳ Export läuft im Hintergrund...'}
                  </span>
                  <Badge>
                    {activeJob.status === 'processing' ? `${activeJob.progress}%` : activeJob.status}
                  </Badge>
                </div>
                
                {(activeJob.status === 'pending' || activeJob.status === 'processing') && (
                  <Progress value={activeJob.progress} />
                )}
                
                <p className="text-sm text-muted-foreground">{activeJob.progressMessage}</p>
                
                {activeJob.status === 'completed' && activeJob.downloadUrl && (
                  <Button asChild className="mt-2">
                    <a href={activeJob.downloadUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" />
                      ZIP herunterladen
                      <ExternalLink className="h-3 w-3 ml-2" />
                    </a>
                  </Button>
                )}
                
                {activeJob.status === 'failed' && (
                  <p className="text-sm text-destructive">{activeJob.error}</p>
                )}
                
                {(activeJob.status === 'completed' || activeJob.status === 'failed') && (
                  <Button variant="outline" size="sm" onClick={clearJob}>
                    Schliessen
                  </Button>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Load Button */}
        <div className="flex gap-2">
          <Button onClick={loadFlows} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Ultimate Flows laden
          </Button>
          
          {flows.length > 0 && !activeJob && (
            <Button 
              onClick={() => startBackgroundExport()}
              variant="default"
            >
              <Download className="h-4 w-4 mr-2" />
              Alle exportieren ({flows.length})
            </Button>
          )}
        </div>

        {/* Flows List */}
        {flows.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Gefundene Ultimate Flows ({flows.length})</h3>
            
            <div className="grid gap-4">
              {flows.map((flow) => (
                <Card key={flow.id} className="border-muted">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span className="font-medium">{flow.variant_name}</span>
                          <Badge variant={flow.status === 'done' ? 'default' : 'secondary'}>
                            {flow.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {flow.result_json?.ultimateFlow?.description?.slice(0, 100) || 'Keine Beschreibung'}...
                        </p>
                        <div className="flex gap-4 mt-2 text-sm">
                          <span>Score: <strong>{flow.result_json?.ultimateFlow?.expectedScore || '?'}</strong>/100</span>
                          <span>Steps: <strong>{flow.result_json?.ultimateFlow?.steps?.length || 0}</strong></span>
                          <span>Lift: <strong>{flow.result_json?.ultimateFlow?.expectedConversionLift || '?'}</strong></span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedFlowId(selectedFlowId === flow.id ? null : flow.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Prompts
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => startBackgroundExport([flow.id])}
                          disabled={!!activeJob}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>

                    {/* Expanded Prompt Preview */}
                    {selectedFlowId === flow.id && (
                      <div className="mt-4 pt-4 border-t">
                        <Tabs defaultValue="build">
                          <TabsList>
                            <TabsTrigger value="build" className="gap-1">
                              <Wand2 className="h-3 w-3" />
                              Build-Prompt
                            </TabsTrigger>
                            <TabsTrigger value="analyse" className="gap-1">
                              <FileText className="h-3 w-3" />
                              Analyse-Prompt
                            </TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="build" className="mt-3">
                            <div className="flex justify-end mb-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyPrompt(generateBuildPrompt(flow), 'Build')}
                              >
                                {copiedPrompt === 'Build' ? (
                                  <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4 mr-1" />
                                )}
                                Kopieren
                              </Button>
                            </div>
                            <ScrollArea className="h-64 border rounded-lg p-3 bg-muted/30">
                              <pre className="text-xs whitespace-pre-wrap font-mono">
                                {generateBuildPrompt(flow)}
                              </pre>
                            </ScrollArea>
                          </TabsContent>
                          
                          <TabsContent value="analyse" className="mt-3">
                            <div className="flex justify-end mb-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyPrompt(generateAnalysePrompt(flow), 'Analyse')}
                              >
                                {copiedPrompt === 'Analyse' ? (
                                  <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4 mr-1" />
                                )}
                                Kopieren
                              </Button>
                            </div>
                            <ScrollArea className="h-64 border rounded-lg p-3 bg-muted/30">
                              <pre className="text-xs whitespace-pre-wrap font-mono">
                                {generateAnalysePrompt(flow)}
                              </pre>
                            </ScrollArea>
                          </TabsContent>
                        </Tabs>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && flows.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Keine Ultimate Flows gefunden.</p>
            <p className="text-sm">Klicke "Ultimate Flows laden" um zu starten.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default UltimateFlowExporter;
