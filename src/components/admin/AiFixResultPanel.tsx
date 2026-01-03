/**
 * AI Fix Result Panel
 * Shows the expected score improvement after AI fix and allows copying the implementation prompt
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Sparkles,
  Copy,
  Check,
  ChevronDown,
  TrendingUp,
  Code,
  Zap,
  RefreshCw,
  ExternalLink,
  Loader2,
  ArrowRight,
  Target
} from 'lucide-react';

interface AiFixResult {
  id: string;
  flowId: string;
  variantName: string;
  createdAt: string;
  originalScore: number;
  expectedScore: number;
  changes: Array<{
    component: string;
    description: string;
    priority: number;
    impact: string;
    implementation: string;
  }>;
  newComponents: Array<{
    name: string;
    purpose: string;
    code: string;
  }>;
  keyImprovements: string[];
}

interface AiFixResultPanelProps {
  flowId: string;
  currentScore: number;
  onReanalyze?: () => void;
}

export function AiFixResultPanel({ flowId, currentScore, onReanalyze }: AiFixResultPanelProps) {
  const [latestFix, setLatestFix] = useState<AiFixResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [isReanalyzing, setIsReanalyzing] = useState(false);

  useEffect(() => {
    loadLatestFix();
  }, [flowId]);

  const loadLatestFix = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('flow_feedback_variants')
        .select('*')
        .eq('flow_id', flowId)
        .eq('status', 'done')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data?.result_json) {
        const result = data.result_json as any;
        const optimizedFlow = result.optimizedFlow || result;
        
        setLatestFix({
          id: data.id,
          flowId: data.flow_id,
          variantName: data.variant_name,
          createdAt: data.created_at,
          originalScore: currentScore,
          expectedScore: optimizedFlow.expectedScore || currentScore + 10,
          changes: optimizedFlow.changes || [],
          newComponents: optimizedFlow.newComponents || [],
          keyImprovements: result.summary?.keyImprovements || [],
        });
      } else {
        setLatestFix(null);
      }
    } catch (err) {
      console.error('Failed to load AI fix result:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateLovablePrompt = (): string => {
    if (!latestFix) return '';

    const changesText = latestFix.changes
      .sort((a, b) => (a.priority || 5) - (b.priority || 5))
      .map((c, i) => `${i + 1}. **${c.component}**: ${c.description}\n   - Umsetzung: ${c.implementation}`)
      .join('\n\n');

    const newComponentsText = latestFix.newComponents.length > 0
      ? `\n\n## Neue Komponenten\n${latestFix.newComponents.map(nc => 
          `### ${nc.name}\n- Zweck: ${nc.purpose}\n\`\`\`tsx\n${nc.code}\n\`\`\``
        ).join('\n\n')}`
      : '';

    return `# AI-Optimierung für ${latestFix.flowId}

## Ziel
Erhöhe den Score von **${latestFix.originalScore}** auf **${latestFix.expectedScore}+**

## Änderungen (nach Priorität sortiert)

${changesText}
${newComponentsText}

## Wichtige Hinweise
- Mobile-First: Alle Änderungen müssen auf Mobilgeräten funktionieren
- Trust-Signale: ASTAG-Badge, Schweizer Qualität prominent platzieren
- CTA immer sichtbar: Sticky Footer auf Mobile
- Swissness: "Zügeln", "Offerte", keine ß-Schreibweise

Nach der Umsetzung bitte Re-Analyse durchführen um den neuen Score zu ermitteln.`;
  };

  const handleCopyPrompt = async () => {
    const prompt = generateLovablePrompt();
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      toast.success('Prompt in Zwischenablage kopiert!', {
        description: 'Füge ihn in Lovable ein, um die Änderungen umzusetzen.',
      });
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      toast.error('Kopieren fehlgeschlagen');
    }
  };

  const handleReanalyze = async () => {
    setIsReanalyzing(true);
    try {
      if (onReanalyze) {
        await onReanalyze();
      }
      toast.success('Re-Analyse gestartet');
    } finally {
      setIsReanalyzing(false);
    }
  };

  if (loading) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!latestFix) {
    return null;
  }

  const scoreDiff = latestFix.expectedScore - latestFix.originalScore;
  const isSignificantImprovement = scoreDiff >= 5;

  return (
    <Card className={`border-2 ${isSignificantImprovement ? 'border-green-500/50 bg-gradient-to-br from-green-50/50 to-background dark:from-green-950/10' : 'border-primary/30'}`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isSignificantImprovement ? 'bg-green-500/10' : 'bg-primary/10'}`}>
                  <Sparkles className={`h-5 w-5 ${isSignificantImprovement ? 'text-green-500' : 'text-primary'}`} />
                </div>
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    AI-Optimierung verfügbar
                    {isSignificantImprovement && (
                      <Badge className="bg-green-500">+{scoreDiff} Punkte</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {new Date(latestFix.createdAt).toLocaleString('de-CH')}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {/* Score Preview */}
                <div className="flex items-center gap-2 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-muted-foreground">{latestFix.originalScore}</div>
                    <div className="text-xs text-muted-foreground">Aktuell</div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${isSignificantImprovement ? 'text-green-600' : 'text-primary'}`}>
                      {latestFix.expectedScore}
                    </div>
                    <div className="text-xs text-muted-foreground">Erwartet</div>
                  </div>
                </div>
                <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Key Improvements */}
            {latestFix.keyImprovements.length > 0 && (
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Wichtigste Verbesserungen
                </h4>
                <ul className="space-y-1 text-sm">
                  {latestFix.keyImprovements.slice(0, 5).map((imp, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      {imp}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Changes List */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Code className="h-4 w-4" />
                {latestFix.changes.length} Änderungen
              </h4>
              <ScrollArea className="h-48">
                <div className="space-y-2">
                  {latestFix.changes
                    .sort((a, b) => (a.priority || 5) - (b.priority || 5))
                    .map((change, i) => (
                      <div key={i} className="p-3 bg-background border rounded-lg">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              P{change.priority || i + 1}
                            </Badge>
                            <span className="font-medium text-sm">{change.component}</span>
                          </div>
                          {change.impact && (
                            <Badge variant="secondary" className="text-xs shrink-0">
                              {change.impact.slice(0, 20)}...
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{change.description}</p>
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </div>

            {/* New Components */}
            {latestFix.newComponents.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-500" />
                  {latestFix.newComponents.length} neue Komponenten
                </h4>
                <div className="flex flex-wrap gap-2">
                  {latestFix.newComponents.map((nc, i) => (
                    <Badge key={i} variant="outline" className="bg-purple-50 dark:bg-purple-950/20">
                      {nc.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleCopyPrompt} 
                className="flex-1 gap-2 bg-gradient-to-r from-primary to-primary/80"
                size="lg"
              >
                {copied ? (
                  <>
                    <Check className="h-5 w-5" />
                    Kopiert!
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5" />
                    Änderungen als Prompt kopieren
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleReanalyze}
                disabled={isReanalyzing}
                className="gap-2"
              >
                {isReanalyzing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Re-Analyse starten
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Tipp: Nach Umsetzung der Änderungen Re-Analyse starten, um den neuen Score zu sehen.
            </p>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

export default AiFixResultPanel;
