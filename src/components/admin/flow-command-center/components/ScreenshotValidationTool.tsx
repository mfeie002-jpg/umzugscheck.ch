import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Loader2, 
  ImageOff,
  RefreshCw,
  FileWarning,
  ChevronDown,
  ChevronUp,
  Camera,
  Monitor,
  Smartphone,
  Wrench
} from "lucide-react";
import { toast } from "sonner";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SITE_CONFIG } from "@/data/constants";

interface MissingScreenshot {
  stepNumber: number;
  type: 'desktop' | 'mobile' | 'both';
}

interface FlowValidationResult {
  flowId: string;
  flowName: string;
  flowPath?: string;
  expectedSteps: number;
  actualSteps: number;
  missingSteps: number[];
  duplicateScreenshots: { type: 'desktop' | 'mobile'; steps: number[] }[];
  missingUrls: MissingScreenshot[];
  errorScreenshots: string[];
  status: 'valid' | 'warning' | 'error';
  issues: string[];
}

interface ScreenshotValidationToolProps {
  flowIds?: string[];
  showAllFlowsOption?: boolean;
}

export function ScreenshotValidationTool({ flowIds, showAllFlowsOption = true }: ScreenshotValidationToolProps) {
  const [isValidating, setIsValidating] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [fixProgress, setFixProgress] = useState(0);
  const [fixMessage, setFixMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [results, setResults] = useState<FlowValidationResult[]>([]);
  const [validateAll, setValidateAll] = useState(!flowIds || flowIds.length === 0);
  const [expandedFlows, setExpandedFlows] = useState<Set<string>>(new Set());

  const toggleExpanded = (flowId: string) => {
    setExpandedFlows(prev => {
      const next = new Set(prev);
      if (next.has(flowId)) {
        next.delete(flowId);
      } else {
        next.add(flowId);
      }
      return next;
    });
  };

  const validateScreenshots = async (all: boolean = validateAll) => {
    console.log('[ValidateScreenshots] Starting validation, all:', all, 'flowIds:', flowIds);
    
    setIsValidating(true);
    setProgress(0);
    setProgressMessage("Lade Flows...");
    setResults([]);

    try {
      // Get all active flows from flow_versions
      const { data: flows, error: flowsError } = await supabase
        .from('flow_versions')
        .select('flow_id, version_name, step_configs')
        .eq('is_active', true)
        .order('flow_id');

      if (flowsError) {
        console.error('[ValidateScreenshots] Error fetching flows:', flowsError);
        toast.error("Fehler beim Laden der Flows");
        return;
      }

      if (!flows || flows.length === 0) {
        toast.error("Keine aktiven Flows gefunden");
        return;
      }

      console.log('[ValidateScreenshots] Found flows:', flows.length, 'Filtering:', !all, flowIds);
      
      // Filter flows based on validation mode
      let flowsToValidate = flows;
      if (!all && flowIds && flowIds.length > 0) {
        // Match by flow_id or version_name containing any of the flowIds
        flowsToValidate = flows.filter(f => 
          flowIds.some(id => 
            f.flow_id.toLowerCase().includes(id.toLowerCase()) ||
            (f.version_name && f.version_name.toLowerCase().includes(id.toLowerCase()))
          )
        );
        console.log('[ValidateScreenshots] Filtered to flows:', flowsToValidate.map(f => f.flow_id));
      }
      
      if (flowsToValidate.length === 0) {
        toast.warning("Keine passenden Flows gefunden für die Validierung");
        return;
      }

      const validationResults: FlowValidationResult[] = [];

      for (let i = 0; i < flowsToValidate.length; i++) {
        const flow = flowsToValidate[i];
        setProgress(Math.round(((i + 1) / flowsToValidate.length) * 100));
        setProgressMessage(`Prüfe ${flow.version_name || flow.flow_id}...`);

        // Get step configs to determine expected steps
        const stepConfigs = flow.step_configs as any[];
        const expectedSteps = Array.isArray(stepConfigs) ? stepConfigs.length : 4;

        // Get only completed runs
        const { data: completedRuns } = await supabase
          .from('flow_analysis_runs')
          .select('id')
          .eq('flow_id', flow.flow_id)
          .eq('status', 'completed')
          .order('created_at', { ascending: false })
          .limit(1);

        const latestRunId = completedRuns?.[0]?.id;

        // Get screenshots from latest completed run
        let query = supabase
          .from('flow_step_metrics')
          .select('step_number, desktop_screenshot_url, mobile_screenshot_url, created_at')
          .eq('flow_id', flow.flow_id)
          .order('step_number', { ascending: true });

        if (latestRunId) {
          query = query.eq('run_id', latestRunId);
        }

        const { data: screenshots } = await query;

        const issues: string[] = [];
        const missingSteps: number[] = [];
        const errorScreenshots: string[] = [];
        const missingUrls: MissingScreenshot[] = [];
        const duplicateScreenshots: { type: 'desktop' | 'mobile'; steps: number[] }[] = [];

        // Check for missing steps
        const foundSteps = new Set(screenshots?.map(s => s.step_number) || []);
        for (let step = 1; step <= expectedSteps; step++) {
          if (!foundSteps.has(step)) {
            missingSteps.push(step);
          }
        }

        if (missingSteps.length > 0) {
          issues.push(`${missingSteps.length} Step(s) komplett fehlen: ${missingSteps.join(', ')}`);
        }

        // Check for duplicate screenshots (same URL for different steps)
        const desktopUrls = new Map<string, number[]>();
        const mobileUrls = new Map<string, number[]>();

        screenshots?.forEach(s => {
          if (s.desktop_screenshot_url) {
            const existing = desktopUrls.get(s.desktop_screenshot_url) || [];
            existing.push(s.step_number);
            desktopUrls.set(s.desktop_screenshot_url, existing);
          }
          if (s.mobile_screenshot_url) {
            const existing = mobileUrls.get(s.mobile_screenshot_url) || [];
            existing.push(s.step_number);
            mobileUrls.set(s.mobile_screenshot_url, existing);
          }
        });

        desktopUrls.forEach((steps, _url) => {
          if (steps.length > 1) {
            duplicateScreenshots.push({ type: 'desktop', steps });
            issues.push(`Desktop dupliziert für Steps ${steps.join(', ')}`);
          }
        });

        mobileUrls.forEach((steps, _url) => {
          if (steps.length > 1) {
            duplicateScreenshots.push({ type: 'mobile', steps });
            issues.push(`Mobile dupliziert für Steps ${steps.join(', ')}`);
          }
        });

        // Check for null/missing screenshot URLs - more detailed
        screenshots?.forEach(s => {
          const hasDesktop = !!s.desktop_screenshot_url;
          const hasMobile = !!s.mobile_screenshot_url;
          
          if (!hasDesktop && !hasMobile) {
            missingUrls.push({ stepNumber: s.step_number, type: 'both' });
          } else if (!hasDesktop) {
            missingUrls.push({ stepNumber: s.step_number, type: 'desktop' });
          } else if (!hasMobile) {
            missingUrls.push({ stepNumber: s.step_number, type: 'mobile' });
          }
        });

        if (missingUrls.length > 0) {
          const bothMissing = missingUrls.filter(m => m.type === 'both');
          const desktopMissing = missingUrls.filter(m => m.type === 'desktop');
          const mobileMissing = missingUrls.filter(m => m.type === 'mobile');
          
          if (bothMissing.length > 0) {
            issues.push(`Step(s) ${bothMissing.map(m => m.stepNumber).join(', ')}: Beide Screenshots fehlen`);
          }
          if (desktopMissing.length > 0) {
            issues.push(`Step(s) ${desktopMissing.map(m => m.stepNumber).join(', ')}: Desktop fehlt`);
          }
          if (mobileMissing.length > 0) {
            issues.push(`Step(s) ${mobileMissing.map(m => m.stepNumber).join(', ')}: Mobile fehlt`);
          }
        }

        // Validate screenshot URLs are accessible (sample check)
        if (screenshots && screenshots.length > 0) {
          const sampleUrl = screenshots[0].desktop_screenshot_url;
          if (sampleUrl) {
            try {
              const response = await fetch(sampleUrl, { method: 'HEAD' });
              if (!response.ok) {
                issues.push('Screenshot-URLs nicht erreichbar');
                errorScreenshots.push(sampleUrl);
              }
            } catch {
              // Network error - skip for now
            }
          }
        }

        // Determine overall status
        let status: 'valid' | 'warning' | 'error' = 'valid';
        if (missingSteps.length > 0 || errorScreenshots.length > 0) {
          status = 'error';
        } else if (duplicateScreenshots.length > 0 || missingUrls.length > 0) {
          status = 'warning';
        }

        validationResults.push({
          flowId: flow.flow_id,
          flowName: flow.version_name || flow.flow_id,
          expectedSteps,
          actualSteps: foundSteps.size,
          missingSteps,
          duplicateScreenshots,
          missingUrls,
          errorScreenshots,
          status,
          issues
        });
      }

      setResults(validationResults);

      const errorCount = validationResults.filter(r => r.status === 'error').length;
      const warningCount = validationResults.filter(r => r.status === 'warning').length;
      const validCount = validationResults.filter(r => r.status === 'valid').length;

      if (errorCount > 0) {
        toast.error(`${errorCount} Flows mit Fehlern, ${warningCount} Warnungen, ${validCount} OK`);
      } else if (warningCount > 0) {
        toast.warning(`${warningCount} Flows mit Warnungen, ${validCount} OK`);
      } else {
        toast.success(`Alle ${validCount} Flows sind valide!`);
      }

    } catch (error) {
      console.error('Validation error:', error);
      toast.error("Validierung fehlgeschlagen");
    } finally {
      setIsValidating(false);
      setProgressMessage("");
    }
  };

  // Fix all broken flows by re-capturing screenshots
  const fixAllBrokenFlows = async () => {
    console.log('[FixAllBrokenFlows] Button clicked! Results length:', results.length);
    toast.info("🔧 Button wurde geklickt - starte...");
    
    const brokenFlows = results.filter(r => r.status === 'error' || r.status === 'warning');
    
    console.log('[FixAllBrokenFlows] Starting with', brokenFlows.length, 'flows');
    console.log('[FixAllBrokenFlows] Broken flows:', brokenFlows.map(f => f.flowId));
    
    if (brokenFlows.length === 0) {
      toast.info("Keine Flows zu reparieren");
      return;
    }

    setIsFixing(true);
    setFixProgress(0);
    setFixMessage("Starte Reparatur...");
    toast.success(`🚀 Starte Reparatur von ${brokenFlows.length} Flows...`);

    try {
      const baseUrl = SITE_CONFIG.previewUrl.replace(/\/$/, "");
      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < brokenFlows.length; i++) {
        const flow = brokenFlows[i];
        const progressPercent = Math.round(((i + 1) / brokenFlows.length) * 100);
        setFixProgress(progressPercent);
        setFixMessage(`Erfasse Screenshots für ${flow.flowName}... (${i + 1}/${brokenFlows.length})`);
        
        console.log(`[FixAllBrokenFlows] Processing ${flow.flowId} (${i + 1}/${brokenFlows.length})`);

        // Get the flow's path from flow_versions
        const { data: flowVersion, error: fetchError } = await supabase
          .from('flow_versions')
          .select('step_configs')
          .eq('flow_id', flow.flowId)
          .eq('is_active', true)
          .maybeSingle();

        if (fetchError) {
          console.error(`[FixAllBrokenFlows] Failed to fetch ${flow.flowId}:`, fetchError);
          errorCount++;
          continue;
        }

        const stepConfigs = flowVersion?.step_configs as any[] || [];
        
        if (stepConfigs.length === 0) {
          console.warn(`[FixAllBrokenFlows] No step_configs for ${flow.flowId}, using defaults`);
          // Use default 6 steps if no config
          for (let step = 1; step <= 6; step++) {
            stepConfigs.push({ name: `Step ${step}`, path: `/?step=${step}` });
          }
        }
        
        console.log(`[FixAllBrokenFlows] Invoking auto-analyze-flow for ${flow.flowId} with ${stepConfigs.length} steps`);
        
        // Call the auto-analyze-flow function
        const { error, data } = await supabase.functions.invoke('auto-analyze-flow', {
          body: {
            flowId: flow.flowId,
            flowName: flow.flowName,
            steps: stepConfigs.map((s: any, idx: number) => ({
              number: idx + 1,
              name: s.name || `Step ${idx + 1}`,
              path: s.path || `/?step=${idx + 1}`
            })),
            baseUrl,
            runType: 'manual'
          }
        });

        if (error) {
          console.error(`[FixAllBrokenFlows] Edge function error for ${flow.flowId}:`, error);
          toast.error(`Fehler bei ${flow.flowName}: ${error.message}`);
          errorCount++;
        } else {
          console.log(`[FixAllBrokenFlows] Successfully triggered ${flow.flowId}`, data);
          successCount++;
        }

        // Wait a bit between flows to not overload
        if (i < brokenFlows.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }

      if (successCount > 0) {
        toast.success(`${successCount} Flows zur Reparatur gestartet. Screenshots werden im Hintergrund erfasst.`);
      }
      if (errorCount > 0) {
        toast.error(`${errorCount} Flows konnten nicht gestartet werden.`);
      }
      
      // Re-validate after a delay
      setFixMessage("Warte auf Screenshot-Erfassung...");
      setTimeout(() => {
        validateScreenshots(validateAll);
      }, 8000);

    } catch (error) {
      console.error('[FixAllBrokenFlows] Critical error:', error);
      toast.error("Reparatur fehlgeschlagen");
    } finally {
      setIsFixing(false);
      setFixMessage("");
      setFixProgress(0);
    }
  };

  const getStatusIcon = (status: FlowValidationResult['status']) => {
    switch (status) {
      case 'valid':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusBadge = (status: FlowValidationResult['status']) => {
    switch (status) {
      case 'valid':
        return <Badge variant="default" className="bg-green-500">Valide</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Warnung</Badge>;
      case 'error':
        return <Badge variant="destructive">Fehler</Badge>;
    }
  };

  const errorFlows = results.filter(r => r.status === 'error');
  const warningFlows = results.filter(r => r.status === 'warning');
  const validFlows = results.filter(r => r.status === 'valid');
  const brokenFlowsCount = errorFlows.length + warningFlows.length;

  const renderFlowCard = (flow: FlowValidationResult, bgColor: string, borderColor: string, textColor: string) => {
    const isExpanded = expandedFlows.has(flow.flowId);
    
    return (
      <Collapsible key={flow.flowId} open={isExpanded} onOpenChange={() => toggleExpanded(flow.flowId)}>
        <div className={`p-3 ${bgColor} rounded-lg border ${borderColor}`}>
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(flow.status)}
                <span className="font-medium">{flow.flowName}</span>
                {getStatusBadge(flow.status)}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {flow.actualSteps}/{flow.expectedSteps} Steps
                </span>
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </div>
            <p className={`text-sm ${textColor} text-left mt-1`}>
              {flow.issues.length > 0 ? flow.issues[0] : 'Alles OK'}
              {flow.issues.length > 1 && ` (+${flow.issues.length - 1} weitere)`}
            </p>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <div className={`mt-3 pt-3 border-t ${borderColor} space-y-2`}>
              <p className="text-xs text-muted-foreground font-medium">Alle Issues:</p>
              {flow.issues.map((issue, i) => (
                <p key={i} className={`text-sm ${textColor} flex items-center gap-1`}>
                  <ImageOff className="h-3 w-3 flex-shrink-0" />
                  {issue}
                </p>
              ))}
              
              {/* Detailed missing URLs */}
              {flow.missingUrls.length > 0 && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs font-medium">Fehlende Screenshot-URLs:</p>
                  {flow.missingUrls.map((m, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className="font-mono bg-white/50 px-1 rounded">Step {m.stepNumber}</span>
                      {m.type === 'both' && (
                        <span className="flex items-center gap-1">
                          <Monitor className="h-3 w-3" /> + <Smartphone className="h-3 w-3" />
                        </span>
                      )}
                      {m.type === 'desktop' && <Monitor className="h-3 w-3" />}
                      {m.type === 'mobile' && <Smartphone className="h-3 w-3" />}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Fix suggestion */}
              <div className="mt-3 p-2 bg-white/50 rounded text-xs">
                <p className="font-medium mb-1">🔧 Behebung:</p>
                <ol className="list-decimal list-inside space-y-0.5">
                  <li>Flow im Command Center öffnen</li>
                  <li>"Screenshots" Tab → "Alle Screenshots erstellen" klicken</li>
                  <li>Danach "Analyse starten" für neue Analyse</li>
                </ol>
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    );
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold flex items-center gap-2">
            <FileWarning className="h-5 w-5" />
            Screenshot-Validierung
          </h3>
          <p className="text-sm text-muted-foreground">
            Prüft ob alle Screenshots vollständig und korrekt sind
          </p>
        </div>
        <div className="flex items-center gap-2">
          {showAllFlowsOption && (
            <Button
              variant={validateAll ? "default" : "outline"}
              size="sm"
              onClick={() => setValidateAll(!validateAll)}
              className="text-xs"
            >
              {validateAll ? "Alle Flows" : "Nur aktueller Flow"}
            </Button>
          )}
          <Button 
            onClick={() => validateScreenshots(validateAll)} 
            disabled={isValidating}
            variant="outline"
          >
            {isValidating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Validiere...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Validieren
              </>
            )}
          </Button>
        </div>
      </div>

      {isValidating && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-muted-foreground text-center">
            {progress}% - {progressMessage}
          </p>
        </div>
      )}

      {/* Fix Progress */}
      {isFixing && (
        <div className="space-y-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Reparatur läuft...</span>
          </div>
          <Progress value={fixProgress} className="h-2" />
          <p className="text-xs text-blue-600">{fixMessage}</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          {/* Summary + Fix All Button */}
          <div className="flex items-center justify-between">
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>{validFlows.length} Valide</span>
              </div>
              <div className="flex items-center gap-1">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span>{warningFlows.length} Warnungen</span>
              </div>
              <div className="flex items-center gap-1">
                <XCircle className="h-4 w-4 text-red-500" />
                <span>{errorFlows.length} Fehler</span>
              </div>
            </div>
            
            {brokenFlowsCount > 0 && (
              <Button
                onClick={fixAllBrokenFlows}
                disabled={isFixing || isValidating}
                variant="default"
                size="sm"
                className="bg-orange-600 hover:bg-orange-700"
              >
                {isFixing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Repariere...
                  </>
                ) : (
                  <>
                    <Wrench className="h-4 w-4 mr-2" />
                    Alle {brokenFlowsCount} beheben
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Error Flows */}
          {errorFlows.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-red-600">Flows mit Fehlern:</h4>
              {errorFlows.map(flow => renderFlowCard(flow, 'bg-red-50', 'border-red-200', 'text-red-700'))}
            </div>
          )}

          {/* Warning Flows */}
          {warningFlows.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-yellow-600">Flows mit Warnungen:</h4>
              {warningFlows.map(flow => renderFlowCard(flow, 'bg-yellow-50', 'border-yellow-200', 'text-yellow-700'))}
            </div>
          )}

          {/* Valid Flows (collapsed) */}
          {validFlows.length > 0 && (
            <Collapsible>
              <CollapsibleTrigger className="flex items-center gap-2 text-sm text-green-600 hover:underline">
                <CheckCircle2 className="h-4 w-4" />
                {validFlows.length} Flows haben vollständige Screenshots
                <ChevronDown className="h-3 w-3" />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 space-y-1">
                {validFlows.map(flow => (
                  <div key={flow.flowId} className="text-xs text-muted-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    {flow.flowName} ({flow.actualSteps}/{flow.expectedSteps} Steps)
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      )}
    </Card>
  );
}
