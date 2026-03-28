import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Brain,
  Sparkles,
  Wand2,
  ArrowRight,
  Copy,
  Check,
  Loader2,
  FileCode,
  Eye,
  Download,
  RefreshCw,
  Lightbulb,
  GitBranch,
  Zap,
  MessageSquare,
  Code,
  Layers,
  CheckCircle,
  AlertCircle
} from "lucide-react";

// ============================================================================
// AI FLOW GENERATOR - Create V1.a, V1.b etc. from ChatGPT feedback
// ============================================================================

interface GeneratedFlow {
  id: string;
  name: string;
  description: string;
  steps: {
    step: number;
    name: string;
    changes: string[];
    code?: string;
  }[];
  improvements: string[];
  timestamp: string;
}

interface FlowComparison {
  original: string;
  generated: string;
  differences: string[];
}

const SYSTEM_PROMPT = `Du bist ein Elite-UX-Architekt für Conversion-optimierte Funnels.
Deine Aufgabe: Analysiere das Feedback und generiere eine verbesserte Flow-Version.

Antworte IMMER im folgenden JSON-Format:
{
  "flowName": "v1a",
  "flowLabel": "Umzugsofferten V1.a",
  "description": "Kurze Beschreibung der Hauptänderungen",
  "steps": [
    {
      "step": 1,
      "name": "Step Name",
      "changes": ["Änderung 1", "Änderung 2"],
      "componentChanges": "Beschreibung der Code-Änderungen"
    }
  ],
  "improvements": [
    "Verbesserung 1 mit Begründung",
    "Verbesserung 2 mit Begründung"
  ],
  "expectedImpact": {
    "conversionIncrease": "10-15%",
    "dropOffReduction": "20%",
    "userSatisfaction": "Höher"
  },
  "implementationPriority": [
    {"change": "Wichtigste Änderung", "effort": "low", "impact": "high"},
    {"change": "Zweite Änderung", "effort": "medium", "impact": "high"}
  ]
}`;

const EXAMPLE_PROMPTS = [
  {
    title: "UX Optimierung",
    prompt: `Analysiere den aktuellen V1 Flow und erstelle V1.a mit folgenden Verbesserungen:
- Reduziere Friction im Step 2
- Verbessere Mobile-UX
- Erhöhe Vertrauen durch bessere Trust-Signals
- Optimiere CTA-Texte für höhere Conversion`
  },
  {
    title: "Speed Optimierung",
    prompt: `Erstelle V1.a mit Fokus auf Geschwindigkeit:
- Weniger Formularfelder pro Step
- Progressive Disclosure
- Schnellere visuelle Feedback-Loops
- Optimierte Ladezeiten`
  },
  {
    title: "Trust & Conversion",
    prompt: `V1.a soll maximales Vertrauen aufbauen:
- Mehr Social Proof (Bewertungen, Logos)
- Transparente Preisanzeige
- Garantie-Badges
- Testimonials an kritischen Stellen`
  },
  {
    title: "Mobile-First",
    prompt: `Erstelle V1.a komplett Mobile-First:
- Touch-optimierte Interaktionen
- Größere Tap-Targets
- Vereinfachte Navigation
- Scroll-basierte Progression`
  }
];

export const AIFlowGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [baseFlow, setBaseFlow] = useState("v1");
  const [newFlowName, setNewFlowName] = useState("v1a");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedResult, setGeneratedResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Bitte gib einen Prompt ein");
      return;
    }

    setIsGenerating(true);
    setProgress(10);
    setError(null);
    setGeneratedResult(null);

    try {
      setProgress(30);
      
      const fullPrompt = `
Basis-Flow: ${baseFlow}
Neuer Flow-Name: ${newFlowName}

FEEDBACK/ANFORDERUNGEN:
${prompt}

Generiere jetzt die verbesserte Version basierend auf diesem Feedback.
Berücksichtige alle Punkte und erkläre die Änderungen detailliert.
`;

      const { data, error: fnError } = await supabase.functions.invoke('ai-flow-generator', {
        body: {
          systemPrompt: SYSTEM_PROMPT,
          userPrompt: fullPrompt,
          baseFlow,
          newFlowName
        }
      });

      setProgress(80);

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data?.result) {
        setGeneratedResult(data.result);
        toast.success("Flow-Variante erfolgreich generiert!");
      } else if (data?.error) {
        throw new Error(data.error);
      }

      setProgress(100);
    } catch (err: any) {
      console.error('Generation failed:', err);
      setError(err.message || 'Generierung fehlgeschlagen');
      toast.error('Generierung fehlgeschlagen');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, section: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedSection(section);
    toast.success("In Zwischenablage kopiert");
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const applyExamplePrompt = (examplePrompt: string) => {
    setPrompt(examplePrompt);
    toast.success("Beispiel-Prompt eingefügt");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-background">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10">
              <Wand2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">AI Flow Generator</CardTitle>
              <CardDescription>
                Erstelle neue Flow-Varianten (V1.a, V1.b, etc.) basierend auf ChatGPT-Feedback
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          {/* Flow Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <GitBranch className="h-4 w-4" />
                Flow-Konfiguration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Basis-Flow</Label>
                  <Input
                    value={baseFlow}
                    onChange={(e) => setBaseFlow(e.target.value)}
                    placeholder="z.B. v1"
                  />
                  <p className="text-xs text-muted-foreground">
                    Welcher Flow soll als Basis dienen?
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Neuer Flow-Name</Label>
                  <Input
                    value={newFlowName}
                    onChange={(e) => setNewFlowName(e.target.value)}
                    placeholder="z.B. v1a"
                  />
                  <p className="text-xs text-muted-foreground">
                    Name der neuen Variante
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prompt Input */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                ChatGPT Feedback / Anweisungen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Füge hier das ChatGPT-Feedback ein oder beschreibe die gewünschten Änderungen...

Beispiel:
- Step 1: Größere CTA-Buttons
- Step 2: Weniger Formularfelder
- Step 3: Mehr Trust-Signals
- Allgemein: Bessere Mobile-Optimierung"
                className="min-h-[200px] font-mono text-sm"
              />
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {prompt.length} Zeichen
                </span>
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generiere...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Flow generieren
                    </>
                  )}
                </Button>
              </div>

              {isGenerating && (
                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center">
                    AI analysiert Feedback und generiert Flow-Variante...
                  </p>
                </div>
              )}

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  {error}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Example Prompts */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                Beispiel-Prompts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {EXAMPLE_PROMPTS.map((example, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    className="justify-start h-auto py-2 px-3"
                    onClick={() => applyExamplePrompt(example.prompt)}
                  >
                    <span className="text-xs">{example.title}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          {generatedResult ? (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Generiertes Ergebnis
                  </CardTitle>
                  <Badge variant="default" className="bg-green-500">
                    {generatedResult.flowName || newFlowName}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview">
                  <TabsList className="w-full">
                    <TabsTrigger value="overview" className="flex-1">Übersicht</TabsTrigger>
                    <TabsTrigger value="steps" className="flex-1">Steps</TabsTrigger>
                    <TabsTrigger value="code" className="flex-1">Code</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-4 space-y-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h4 className="font-medium mb-2">{generatedResult.flowLabel || `Flow ${newFlowName}`}</h4>
                      <p className="text-sm text-muted-foreground">
                        {generatedResult.description || "Neue optimierte Flow-Variante"}
                      </p>
                    </div>

                    {generatedResult.improvements && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Verbesserungen:</h4>
                        <ul className="space-y-1">
                          {generatedResult.improvements.map((imp: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                              {imp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {generatedResult.expectedImpact && (
                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-3 rounded-lg bg-green-500/10 text-center">
                          <div className="text-lg font-bold text-green-600">
                            {generatedResult.expectedImpact.conversionIncrease}
                          </div>
                          <div className="text-xs text-muted-foreground">Conversion ↑</div>
                        </div>
                        <div className="p-3 rounded-lg bg-blue-500/10 text-center">
                          <div className="text-lg font-bold text-blue-600">
                            {generatedResult.expectedImpact.dropOffReduction}
                          </div>
                          <div className="text-xs text-muted-foreground">Drop-off ↓</div>
                        </div>
                        <div className="p-3 rounded-lg bg-purple-500/10 text-center">
                          <div className="text-lg font-bold text-purple-600">
                            {generatedResult.expectedImpact.userSatisfaction}
                          </div>
                          <div className="text-xs text-muted-foreground">Zufriedenheit</div>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="steps" className="mt-4">
                    <ScrollArea className="h-[400px]">
                      <Accordion type="single" collapsible className="w-full">
                        {generatedResult.steps?.map((step: any, i: number) => (
                          <AccordionItem key={i} value={`step-${i}`}>
                            <AccordionTrigger className="text-sm">
                              <span className="flex items-center gap-2">
                                <Badge variant="outline">{step.step}</Badge>
                                {step.name}
                              </span>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2 pl-4">
                                <h5 className="text-xs font-medium text-muted-foreground">Änderungen:</h5>
                                <ul className="space-y-1">
                                  {step.changes?.map((change: string, j: number) => (
                                    <li key={j} className="text-sm flex items-start gap-2">
                                      <ArrowRight className="h-3 w-3 mt-1 text-primary shrink-0" />
                                      {change}
                                    </li>
                                  ))}
                                </ul>
                                {step.componentChanges && (
                                  <div className="mt-3 p-2 rounded bg-muted/50 text-xs font-mono">
                                    {step.componentChanges}
                                  </div>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="code" className="mt-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">JSON Export</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(JSON.stringify(generatedResult, null, 2), 'json')}
                        >
                          {copiedSection === 'json' ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <ScrollArea className="h-[300px]">
                        <pre className="p-4 rounded-lg bg-muted text-xs font-mono overflow-x-auto">
                          {JSON.stringify(generatedResult, null, 2)}
                        </pre>
                      </ScrollArea>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full min-h-[400px] flex items-center justify-center">
              <div className="text-center p-8">
                <Brain className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="font-medium text-muted-foreground">Noch kein Ergebnis</h3>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Gib einen Prompt ein und klicke auf "Flow generieren"
                </p>
              </div>
            </Card>
          )}

          {/* Implementation Priority */}
          {generatedResult?.implementationPriority && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  Implementierungs-Priorität
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {generatedResult.implementationPriority.map((item: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                    >
                      <span className="text-sm flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                          {i + 1}
                        </span>
                        {item.change}
                      </span>
                      <div className="flex gap-1">
                        <Badge variant="outline" className="text-xs">
                          {item.effort}
                        </Badge>
                        <Badge 
                          variant={item.impact === 'high' ? 'default' : 'outline'} 
                          className={item.impact === 'high' ? 'bg-green-500' : ''}
                        >
                          {item.impact}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIFlowGenerator;
