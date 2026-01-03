/**
 * Batch Analysis Panel - Analyze multiple flows at once
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { Play, Loader2, CheckCircle, XCircle, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface BatchAnalysisPanelProps {
  availableFlows: string[];
  className?: string;
  onComplete?: () => void;
}

export const BatchAnalysisPanel: React.FC<BatchAnalysisPanelProps> = ({
  availableFlows,
  className,
  onComplete,
}) => {
  const [selectedFlows, setSelectedFlows] = useState<Set<string>>(new Set());
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<Map<string, 'success' | 'error'>>(new Map());
  const [currentFlow, setCurrentFlow] = useState<string | null>(null);

  const toggleFlow = (flowId: string) => {
    setSelectedFlows(prev => {
      const next = new Set(prev);
      if (next.has(flowId)) {
        next.delete(flowId);
      } else {
        next.add(flowId);
      }
      return next;
    });
  };

  const selectAll = () => {
    setSelectedFlows(new Set(availableFlows));
  };

  const selectNone = () => {
    setSelectedFlows(new Set());
  };

  const runBatchAnalysis = async () => {
    if (selectedFlows.size === 0) {
      toast.error('Bitte mindestens einen Flow auswählen');
      return;
    }

    setIsRunning(true);
    setProgress(0);
    setResults(new Map());

    const flowsArray = Array.from(selectedFlows);
    const total = flowsArray.length;
    let completed = 0;

    toast.info(`Starte Batch-Analyse für ${total} Flows...`);

    for (const flowId of flowsArray) {
      setCurrentFlow(flowId);
      
      try {
        const { error } = await supabase.functions.invoke('auto-analyze-flow', {
          body: {
            flowId,
            runType: 'batch',
            baseUrl: 'https://www.umzugscheck.ch'
          }
        });

        if (error) {
          setResults(prev => new Map(prev).set(flowId, 'error'));
        } else {
          setResults(prev => new Map(prev).set(flowId, 'success'));
        }
      } catch {
        setResults(prev => new Map(prev).set(flowId, 'error'));
      }

      completed++;
      setProgress(Math.round((completed / total) * 100));

      // Small delay between analyses
      if (completed < total) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    setIsRunning(false);
    setCurrentFlow(null);

    // Count results from the final state - use the local tracking
    const finalResults = new Map(results);
    flowsArray.forEach((flowId, index) => {
      if (!finalResults.has(flowId)) {
        // If somehow not set, count as error
        finalResults.set(flowId, 'error');
      }
    });
    
    const successCount = Array.from(finalResults.values()).filter(r => r === 'success').length;
    const errorCount = total - successCount;

    if (errorCount === 0) {
      toast.success(`Alle ${total} Flows erfolgreich analysiert!`);
    } else {
      toast.warning(`${successCount} erfolgreich, ${errorCount} fehlgeschlagen`);
    }

    onComplete?.();
  };

  // Group flows by version
  const flowsByVersion = availableFlows.reduce((acc, flow) => {
    const version = flow.match(/v\d+/)?.[0] || 'other';
    if (!acc[version]) acc[version] = [];
    acc[version].push(flow);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              Batch-Analyse
            </CardTitle>
            <CardDescription className="text-xs">
              Mehrere Flows gleichzeitig analysieren
            </CardDescription>
          </div>
          <Badge variant="secondary">{selectedFlows.size} ausgewählt</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selection Controls */}
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={selectAll} className="text-xs">
            Alle
          </Button>
          <Button variant="ghost" size="sm" onClick={selectNone} className="text-xs">
            Keine
          </Button>
        </div>

        {/* Flow List */}
        <ScrollArea className="h-[200px] border rounded-lg p-2">
          <div className="space-y-3">
            {Object.entries(flowsByVersion).map(([version, flows]) => (
              <div key={version}>
                <div className="text-xs font-medium text-muted-foreground mb-1 uppercase">
                  {version}
                </div>
                <div className="flex flex-wrap gap-2">
                  {flows.map(flow => {
                    const result = results.get(flow);
                    const isSelected = selectedFlows.has(flow);
                    
                    return (
                      <label 
                        key={flow}
                        className={`
                          flex items-center gap-1.5 px-2 py-1 rounded-md text-xs cursor-pointer
                          ${isSelected ? 'bg-primary/10 text-primary' : 'bg-muted hover:bg-muted/80'}
                          ${result === 'success' ? 'ring-1 ring-green-500' : ''}
                          ${result === 'error' ? 'ring-1 ring-red-500' : ''}
                        `}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleFlow(flow)}
                          disabled={isRunning}
                          className="h-3 w-3"
                        />
                        {flow}
                        {result === 'success' && <CheckCircle className="h-3 w-3 text-green-500" />}
                        {result === 'error' && <XCircle className="h-3 w-3 text-red-500" />}
                        {currentFlow === flow && <Loader2 className="h-3 w-3 animate-spin" />}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Progress */}
        {isRunning && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-center text-muted-foreground">
              Analysiere {currentFlow}... ({progress}%)
            </p>
          </div>
        )}

        {/* Run Button */}
        <Button
          onClick={runBatchAnalysis}
          disabled={isRunning || selectedFlows.size === 0}
          className="w-full"
        >
          {isRunning ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analysiere...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              {selectedFlows.size} Flows analysieren
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BatchAnalysisPanel;
