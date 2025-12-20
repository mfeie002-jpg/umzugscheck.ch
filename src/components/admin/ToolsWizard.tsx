import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, ArrowLeft, Package, Bot, FileText, Camera, 
  Search, Sparkles, Globe, Target, Clock, CheckCircle2,
  Zap, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Goal {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  duration: string;
  tool: string;
  color: string;
}

const GOALS: Goal[] = [
  {
    id: "replicate",
    icon: <Package className="h-6 w-6" />,
    title: "Tool replizieren",
    description: "Das komplette Analyse-Tool auf ein neues Lovable-Projekt kopieren",
    duration: "~10 Min",
    tool: "mega-export",
    color: "from-primary to-orange-500"
  },
  {
    id: "quick-analyze",
    icon: <Bot className="h-6 w-6" />,
    title: "Website schnell analysieren",
    description: "1-Klick KI-Analyse mit automatischem Screenshot + HTML",
    duration: "1-2 Min",
    tool: "1-click-ai",
    color: "from-purple-500 to-pink-500"
  },
  {
    id: "external-ai",
    icon: <FileText className="h-6 w-6" />,
    title: "Daten für ChatGPT/Claude",
    description: "ZIP-Package mit Screenshots, HTML und Prompts erstellen",
    duration: "3-5 Min",
    tool: "manual-package",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "screenshots",
    icon: <Camera className="h-6 w-6" />,
    title: "Screenshots erstellen",
    description: "Einzel- oder Bulk-Screenshots von Websites",
    duration: "30 Sek",
    tool: "screenshot-machine",
    color: "from-green-500 to-emerald-500"
  },
  {
    id: "seo-analyze",
    icon: <Search className="h-6 w-6" />,
    title: "SEO/HTML analysieren",
    description: "Raw vs. Rendered HTML vergleichen, Meta-Tags prüfen",
    duration: "1 Min",
    tool: "seo-analyzer",
    color: "from-orange-500 to-amber-500"
  },
  {
    id: "get-prompts",
    icon: <Sparkles className="h-6 w-6" />,
    title: "KI-Prompts generieren",
    description: "7 optimierte Analyse-Prompts für verschiedene Zwecke",
    duration: "1 Min",
    tool: "prompt-generator",
    color: "from-pink-500 to-rose-500"
  },
  {
    id: "discover-urls",
    icon: <Globe className="h-6 w-6" />,
    title: "Alle Seiten finden",
    description: "Automatisch alle Unterseiten einer Website entdecken",
    duration: "30 Sek",
    tool: "url-discovery",
    color: "from-cyan-500 to-teal-500"
  }
];

interface ToolsWizardProps {
  onSelectTool: (toolId: string) => void;
}

export const ToolsWizard = ({ onSelectTool }: ToolsWizardProps) => {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [showWizard, setShowWizard] = useState(true);

  const handleSelectGoal = (goal: Goal) => {
    setSelectedGoal(goal);
  };

  const handleConfirm = () => {
    if (selectedGoal) {
      onSelectTool(selectedGoal.tool);
      setShowWizard(false);
    }
  };

  const handleReset = () => {
    setSelectedGoal(null);
    setShowWizard(true);
  };

  if (!showWizard) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleReset}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Anderes Ziel wählen
      </Button>
    );
  }

  return (
    <Card className="mb-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto p-3 rounded-full bg-primary/10 w-fit mb-3">
          <Target className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Was möchtest du tun?</CardTitle>
        <CardDescription className="text-base">
          Wähle dein Ziel und wir zeigen dir das passende Tool
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {GOALS.map((goal) => (
            <button
              key={goal.id}
              onClick={() => handleSelectGoal(goal)}
              className={cn(
                "p-4 rounded-xl border-2 text-left transition-all duration-200",
                "hover:shadow-lg hover:scale-[1.02]",
                selectedGoal?.id === goal.id
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border hover:border-primary/50 bg-background"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "p-2 rounded-lg bg-gradient-to-br text-white shrink-0",
                  goal.color
                )}>
                  {goal.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-sm">{goal.title}</h3>
                    {selectedGoal?.id === goal.id && (
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {goal.description}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{goal.duration}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Selected Goal Details */}
        {selectedGoal && (
          <div className="p-4 rounded-xl bg-muted/50 border animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg bg-gradient-to-br text-white",
                  selectedGoal.color
                )}>
                  {selectedGoal.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{selectedGoal.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedGoal.description}</p>
                </div>
              </div>
              <Button 
                onClick={handleConfirm}
                className={cn("bg-gradient-to-r", selectedGoal.color)}
              >
                Weiter
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            {/* Quick Info based on selection */}
            <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {selectedGoal.id === "replicate" && (
                <>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <span>Firecrawl benötigt</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-blue-500" />
                    <span>ZIP + Prompt Export</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>5 Edge Functions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>SQL Migration inkl.</span>
                  </div>
                </>
              )}
              {selectedGoal.id === "quick-analyze" && (
                <>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Kein Firecrawl nötig</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-purple-500" />
                    <span>Lovable AI</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-blue-500" />
                    <span>Auto-Screenshot</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-orange-500" />
                    <span>Markdown Export</span>
                  </div>
                </>
              )}
              {selectedGoal.id === "external-ai" && (
                <>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <span>Firecrawl benötigt</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-blue-500" />
                    <span>Desktop + Mobile</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-pink-500" />
                    <span>7 Prompts inkl.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-500" />
                    <span>PDF Brief inkl.</span>
                  </div>
                </>
              )}
              {selectedGoal.id === "screenshots" && (
                <>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <span>Firecrawl benötigt</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-blue-500" />
                    <span>Einzel + Bulk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Full-Page Option</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-orange-500" />
                    <span>ZIP Download</span>
                  </div>
                </>
              )}
              {selectedGoal.id === "seo-analyze" && (
                <>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <span>Firecrawl für Rendered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-blue-500" />
                    <span>Meta-Tags Extraktion</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Heading-Struktur</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-orange-500" />
                    <span>LLM-ready Export</span>
                  </div>
                </>
              )}
              {selectedGoal.id === "get-prompts" && (
                <>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Kein Setup nötig</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-pink-500" />
                    <span>7 Varianten</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Copy-Paste ready</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    <span>Personalisiert</span>
                  </div>
                </>
              )}
              {selectedGoal.id === "discover-urls" && (
                <>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <span>Firecrawl benötigt</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-cyan-500" />
                    <span>Bis 50 URLs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Auswahl möglich</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-blue-500" />
                    <span>Direkt zur Analyse</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Skip option */}
        <div className="text-center pt-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowWizard(false)}
            className="text-muted-foreground"
          >
            Alle Tools anzeigen
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ToolsWizard;
