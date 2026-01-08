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
  FileWarning
} from "lucide-react";
import { toast } from "sonner";

interface FlowValidationResult {
  flowId: string;
  flowName: string;
  expectedSteps: number;
  actualSteps: number;
  missingSteps: number[];
  duplicateScreenshots: boolean;
  errorScreenshots: string[];
  blankScreenshots: string[];
  status: 'valid' | 'warning' | 'error';
  issues: string[];
}

interface ScreenshotValidationToolProps {
  flowIds?: string[];
}

export function ScreenshotValidationTool({ flowIds }: ScreenshotValidationToolProps) {
  const [isValidating, setIsValidating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<FlowValidationResult[]>([]);

  const validateScreenshots = async () => {
    setIsValidating(true);
    setProgress(0);
    setResults([]);

    try {
      // Get all active flows
      const { data: flows } = await supabase
        .from('flow_versions')
        .select('flow_id, version_name, step_configs')
        .eq('is_active', true);

      if (!flows || flows.length === 0) {
        toast.error("Keine aktiven Flows gefunden");
        return;
      }

      const flowsToValidate = flowIds 
        ? flows.filter(f => flowIds.includes(f.flow_id))
        : flows;

      const validationResults: FlowValidationResult[] = [];

      for (let i = 0; i < flowsToValidate.length; i++) {
        const flow = flowsToValidate[i];
        setProgress(Math.round(((i + 1) / flowsToValidate.length) * 100));

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
        const blankScreenshots: string[] = [];

        // Check for missing steps
        const foundSteps = new Set(screenshots?.map(s => s.step_number) || []);
        for (let step = 1; step <= expectedSteps; step++) {
          if (!foundSteps.has(step)) {
            missingSteps.push(step);
            issues.push(`Step ${step} fehlt`);
          }
        }

        // Check for duplicate screenshots (same URL for different steps)
        const desktopUrls = new Map<string, number[]>();
        const mobileUrls = new Map<string, number[]>();
        let hasDuplicates = false;

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

        desktopUrls.forEach((steps, url) => {
          if (steps.length > 1) {
            hasDuplicates = true;
            issues.push(`Desktop Screenshot dupliziert für Steps ${steps.join(', ')}`);
          }
        });

        mobileUrls.forEach((steps, url) => {
          if (steps.length > 1) {
            hasDuplicates = true;
            issues.push(`Mobile Screenshot dupliziert für Steps ${steps.join(', ')}`);
          }
        });

        // Check for null/missing screenshot URLs
        screenshots?.forEach(s => {
          if (!s.desktop_screenshot_url) {
            blankScreenshots.push(`Step ${s.step_number} Desktop`);
          }
          if (!s.mobile_screenshot_url) {
            blankScreenshots.push(`Step ${s.step_number} Mobile`);
          }
        });

        if (blankScreenshots.length > 0) {
          issues.push(`${blankScreenshots.length} fehlende Screenshot-URLs`);
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
        } else if (hasDuplicates || blankScreenshots.length > 0) {
          status = 'warning';
        }

        validationResults.push({
          flowId: flow.flow_id,
          flowName: flow.version_name || flow.flow_id,
          expectedSteps,
          actualSteps: foundSteps.size,
          missingSteps,
          duplicateScreenshots: hasDuplicates,
          errorScreenshots,
          blankScreenshots,
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
        <Button 
          onClick={validateScreenshots} 
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

      {isValidating && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-muted-foreground text-center">{progress}%</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          {/* Summary */}
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

          {/* Error Flows */}
          {errorFlows.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-red-600">Flows mit Fehlern:</h4>
              {errorFlows.map(flow => (
                <div key={flow.flowId} className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(flow.status)}
                    <span className="font-medium">{flow.flowName}</span>
                    <span className="text-xs text-muted-foreground">({flow.flowId})</span>
                    {getStatusBadge(flow.status)}
                  </div>
                  <div className="text-sm text-red-700 space-y-1">
                    <p>Erwartet: {flow.expectedSteps} Steps | Gefunden: {flow.actualSteps} Steps</p>
                    {flow.issues.map((issue, i) => (
                      <p key={i} className="flex items-center gap-1">
                        <ImageOff className="h-3 w-3" />
                        {issue}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Warning Flows */}
          {warningFlows.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-yellow-600">Flows mit Warnungen:</h4>
              {warningFlows.map(flow => (
                <div key={flow.flowId} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(flow.status)}
                    <span className="font-medium">{flow.flowName}</span>
                    {getStatusBadge(flow.status)}
                  </div>
                  <div className="text-sm text-yellow-700">
                    {flow.issues.map((issue, i) => (
                      <p key={i}>{issue}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Valid Flows (collapsed) */}
          {validFlows.length > 0 && (
            <div className="text-sm text-green-600">
              ✓ {validFlows.length} Flows haben vollständige und korrekte Screenshots
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
