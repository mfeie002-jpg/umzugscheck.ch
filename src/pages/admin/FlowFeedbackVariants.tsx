/**
 * Flow Feedback Variants Page
 * Displays generated Ultimate Flow results and other AI-generated flow variants
 */

import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Sparkles, CheckCircle2, AlertCircle, Code, FileJson, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PerformanceErrorBoundary } from '@/components/performance/PerformanceErrorBoundary';

interface UltimateFlowStep {
  number: number;
  name: string;
  sourceElements?: string[];
  features?: string[];
  archetypeValue?: Record<string, string>;
}

interface UltimateFlowResult {
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
    componentCode?: string;
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
  };
  error?: string;
  raw?: string;
}

function FlowFeedbackVariantsContent() {
  const [searchParams] = useSearchParams();
  const variantId = searchParams.get('variant');

  console.log('[FlowFeedbackVariants] Rendering with variantId:', variantId);

  const { data: variant, isLoading, error } = useQuery({
    queryKey: ['flow-feedback-variant', variantId],
    queryFn: async () => {
      console.log('[FlowFeedbackVariants] Fetching variant:', variantId);
      if (!variantId) return null;
      
      const { data, error } = await supabase
        .from('flow_feedback_variants')
        .select('*')
        .eq('id', variantId)
        .maybeSingle();
      
      console.log('[FlowFeedbackVariants] Query result:', { data, error });
      if (error) throw error;
      return data;
    },
    enabled: !!variantId,
  });

  // Parse result_json safely
  const resultJson = variant?.result_json as UltimateFlowResult | null;
  const hasError = resultJson?.error;
  const ultimateFlow = resultJson?.ultimateFlow;
  
  console.log('[FlowFeedbackVariants] State:', { isLoading, error, hasVariant: !!variant, hasResult: !!resultJson });

  if (!variantId) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Keine Variante ausgewählt</h2>
              <p className="text-muted-foreground mb-4">
                Bitte wähle eine Flow-Variante aus der Tiefenanalyse.
              </p>
              <Button asChild>
                <Link to="/admin/flow-deep-analysis">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Zur Tiefenanalyse
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (error || !variant) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-destructive">
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
              <h2 className="text-xl font-semibold mb-2">Fehler beim Laden</h2>
              <p className="text-muted-foreground mb-4">
                Die Variante konnte nicht gefunden werden.
              </p>
              <Button asChild variant="outline">
                <Link to="/admin/flow-deep-analysis">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Zurück
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link to="/admin/flow-deep-analysis">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zurück
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                {variant.variant_name}
              </h1>
              <p className="text-muted-foreground text-sm">
                {variant.variant_label} • {new Date(variant.created_at).toLocaleDateString('de-CH')}
              </p>
            </div>
            <Badge variant={variant.status === 'done' ? 'default' : 'secondary'}>
              {variant.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Error State */}
        {hasError && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                AI-Parsing fehlgeschlagen
              </CardTitle>
              <CardDescription>
                Die AI-Antwort konnte nicht vollständig geparst werden.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{resultJson?.error}</p>
              {resultJson?.raw && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium">Raw Response anzeigen</summary>
                  <ScrollArea className="h-96 mt-2">
                    <pre className="text-xs bg-muted p-4 rounded-lg whitespace-pre-wrap">
                      {resultJson.raw}
                    </pre>
                  </ScrollArea>
                </details>
              )}
            </CardContent>
          </Card>
        )}

        {/* Ultimate Flow Overview */}
        {ultimateFlow && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                {ultimateFlow.name || 'Ultimate Flow'}
              </CardTitle>
              <CardDescription>{ultimateFlow.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-primary">
                    {ultimateFlow.expectedScore || '?'}
                  </div>
                  <div className="text-sm text-muted-foreground">Expected Score</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-green-600">
                    {ultimateFlow.expectedConversionLift || '+?%'}
                  </div>
                  <div className="text-sm text-muted-foreground">Conversion Lift</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold">
                    {ultimateFlow.steps?.length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Steps</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold">
                    {ultimateFlow.keyFeatures?.length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Key Features</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs for detailed content */}
        <Tabs defaultValue="steps" className="space-y-4">
          <TabsList>
            <TabsTrigger value="steps">Steps</TabsTrigger>
            <TabsTrigger value="features">Key Features</TabsTrigger>
            <TabsTrigger value="code">Component Code</TabsTrigger>
            <TabsTrigger value="json">Raw JSON</TabsTrigger>
          </TabsList>

          <TabsContent value="steps">
            <Card>
              <CardHeader>
                <CardTitle>Flow Steps</CardTitle>
              </CardHeader>
              <CardContent>
                {ultimateFlow?.steps && ultimateFlow.steps.length > 0 ? (
                  <div className="space-y-4">
                    {ultimateFlow.steps.map((step, idx) => (
                      <div key={idx} className="border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline">{step.number}</Badge>
                          <h4 className="font-semibold">{step.name}</h4>
                        </div>
                        {step.sourceElements && (
                          <div className="mb-2">
                            <span className="text-sm text-muted-foreground">Source: </span>
                            {step.sourceElements.map((el, i) => (
                              <Badge key={i} variant="secondary" className="mr-1 text-xs">
                                {el}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {step.features && (
                          <ul className="list-disc list-inside text-sm text-muted-foreground">
                            {step.features.map((f, i) => (
                              <li key={i}>{f}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Keine Steps gefunden
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle>Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                {ultimateFlow?.keyFeatures && ultimateFlow.keyFeatures.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {ultimateFlow.keyFeatures.map((feature, idx) => (
                      <Card key={idx}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">{feature.feature}</CardTitle>
                          <CardDescription>von {feature.sourceFlow}</CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm">
                          <p>{feature.implementation}</p>
                          <Badge variant="outline" className="mt-2">{feature.impact}</Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Keine Key Features gefunden
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="code">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Component Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ultimateFlow?.componentCode ? (
                  <ScrollArea className="h-[600px]">
                    <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
                      <code>{ultimateFlow.componentCode}</code>
                    </pre>
                  </ScrollArea>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Kein Component Code generiert
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="json">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileJson className="h-5 w-5" />
                  Raw JSON Response
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <pre className="text-xs bg-muted p-4 rounded-lg whitespace-pre-wrap">
                    {JSON.stringify(resultJson, null, 2)}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Implementation Plan */}
        {resultJson?.implementationPlan && (
          <Card>
            <CardHeader>
              <CardTitle>Implementation Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {Object.entries(resultJson.implementationPlan).map(([key, phase]) => (
                  <Card key={key}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{phase?.name}</CardTitle>
                      <CardDescription>{phase?.duration}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside text-sm">
                        {phase?.tasks?.map((task, i) => (
                          <li key={i}>{task}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Wrapper with Error Boundary
export default function FlowFeedbackVariants() {
  return (
    <PerformanceErrorBoundary>
      <FlowFeedbackVariantsContent />
    </PerformanceErrorBoundary>
  );
}
