import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { 
  Copy, 
  Zap, 
  Search, 
  Code, 
  ChevronDown, 
  Check, 
  Sparkles, 
  Camera,
  GitCompare,
  Eye,
  ExternalLink,
  Layers,
} from "lucide-react";
import { generatePrompt, PROMPT_VARIANTS, type PromptVariant, type PromptData } from "@/lib/chatgpt-prompts";
import { cn } from "@/lib/utils";

interface ChatGPTPromptCopierProps {
  data?: PromptData;
  className?: string;
  compact?: boolean;
  showCard?: boolean;
}

const variantIcons = {
  quick: Zap,
  deep: Search,
  code: Code,
  screenshot: Camera,
  regression: GitCompare,
  seo: Search,
  accessibility: Eye,
  complete: Layers,
} as const;

const variantColors = {
  quick: "text-amber-500",
  deep: "text-primary",
  code: "text-green-500",
  screenshot: "text-purple-500",
  regression: "text-orange-500",
  seo: "text-blue-500",
  accessibility: "text-pink-500",
  complete: "text-gradient-to-r from-primary to-purple-500",
} as const;

const variantCategories = {
  basic: ["quick", "deep", "code"] as PromptVariant[],
  screenshot: ["screenshot", "regression"] as PromptVariant[],
  advanced: ["seo", "accessibility"] as PromptVariant[],
};

export function ChatGPTPromptCopier({ 
  data, 
  className,
  compact = false,
  showCard = true 
}: ChatGPTPromptCopierProps) {
  const [selectedVariant, setSelectedVariant] = useState<PromptVariant>("quick");
  const [copied, setCopied] = useState(false);

  const defaultData: PromptData = {
    projectName: "",
    projectUrl: "",
    conversionRate: undefined,
    bounceRate: undefined,
    mobileScore: undefined,
    avgSessionDuration: "",
    topPages: [],
    competitors: [],
    ...data,
  };

  const handleCopy = async () => {
    const prompt = generatePrompt(selectedVariant, defaultData);
    
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      toast.success("Prompt kopiert!", {
        description: `${PROMPT_VARIANTS[selectedVariant].name} - Jetzt in ChatGPT/Claude einfügen.`,
        action: {
          label: "ChatGPT öffnen",
          onClick: () => window.open("https://chat.openai.com", "_blank"),
        },
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Fehler beim Kopieren");
    }
  };

  const SelectedIcon = variantIcons[selectedVariant];
  const variantInfo = PROMPT_VARIANTS[selectedVariant];

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <SelectedIcon className={cn("h-4 w-4", variantColors[selectedVariant])} />
              {variantInfo.name}
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuLabel>Standard-Analysen</DropdownMenuLabel>
            {variantCategories.basic.map((variant) => {
              const Icon = variantIcons[variant];
              const info = PROMPT_VARIANTS[variant];
              return (
                <DropdownMenuItem
                  key={variant}
                  onClick={() => setSelectedVariant(variant)}
                  className="gap-2"
                >
                  <Icon className={cn("h-4 w-4", variantColors[variant])} />
                  <div className="flex-1">
                    <div className="font-medium">{info.name}</div>
                    <div className="text-xs text-muted-foreground">{info.description}</div>
                  </div>
                  {selectedVariant === variant && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
              );
            })}
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Screenshot-Analysen</DropdownMenuLabel>
            {variantCategories.screenshot.map((variant) => {
              const Icon = variantIcons[variant];
              const info = PROMPT_VARIANTS[variant];
              return (
                <DropdownMenuItem
                  key={variant}
                  onClick={() => setSelectedVariant(variant)}
                  className="gap-2"
                >
                  <Icon className={cn("h-4 w-4", variantColors[variant])} />
                  <div className="flex-1">
                    <div className="font-medium">{info.name}</div>
                    <div className="text-xs text-muted-foreground">{info.description}</div>
                  </div>
                  {selectedVariant === variant && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
              );
            })}
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Erweiterte Analysen</DropdownMenuLabel>
            {variantCategories.advanced.map((variant) => {
              const Icon = variantIcons[variant];
              const info = PROMPT_VARIANTS[variant];
              return (
                <DropdownMenuItem
                  key={variant}
                  onClick={() => setSelectedVariant(variant)}
                  className="gap-2"
                >
                  <Icon className={cn("h-4 w-4", variantColors[variant])} />
                  <div className="flex-1">
                    <div className="font-medium">{info.name}</div>
                    <div className="text-xs text-muted-foreground">{info.description}</div>
                  </div>
                  {selectedVariant === variant && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button onClick={handleCopy} size="sm" className="gap-2">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Kopiert!" : "Prompt kopieren"}
        </Button>
      </div>
    );
  }

  const content = (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="h-4 w-4" />
        <span>Wähle eine Analyse-Variante und kopiere den optimierten Prompt</span>
      </div>

      {/* Complete Analysis - Featured */}
      <div className="mb-4">
        <button
          onClick={() => setSelectedVariant("complete")}
          className={cn(
            "w-full p-5 rounded-xl border-2 transition-all text-left relative overflow-hidden",
            selectedVariant === "complete"
              ? "border-primary bg-gradient-to-r from-primary/10 to-purple-500/10"
              : "border-border hover:border-primary/50 bg-gradient-to-r from-muted/30 to-muted/50 hover:from-primary/5 hover:to-purple-500/5"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-purple-500">
              <Layers className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">Komplett-Analyse</span>
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/20 text-primary">
                  7-in-1
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Alle 7 Analysen in einem Prompt - Für umfassende Website-Audits
              </p>
            </div>
            {selectedVariant === "complete" && (
              <Check className="h-5 w-5 text-primary" />
            )}
          </div>
        </button>
      </div>

      {/* Standard Analyses */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">Standard-Analysen</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {variantCategories.basic.map((variant) => {
            const Icon = variantIcons[variant];
            const info = PROMPT_VARIANTS[variant];
            const isSelected = selectedVariant === variant;
            
            return (
              <button
                key={variant}
                onClick={() => setSelectedVariant(variant)}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all text-left",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={cn("h-5 w-5", variantColors[variant])} />
                  <span className="font-medium">{info.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">{info.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Screenshot Analyses */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">Screenshot-Analysen</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {variantCategories.screenshot.map((variant) => {
            const Icon = variantIcons[variant];
            const info = PROMPT_VARIANTS[variant];
            const isSelected = selectedVariant === variant;
            
            return (
              <button
                key={variant}
                onClick={() => setSelectedVariant(variant)}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all text-left",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={cn("h-5 w-5", variantColors[variant])} />
                  <span className="font-medium">{info.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">{info.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced Analyses */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">Erweiterte Analysen</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {variantCategories.advanced.map((variant) => {
            const Icon = variantIcons[variant];
            const info = PROMPT_VARIANTS[variant];
            const isSelected = selectedVariant === variant;
            
            return (
              <button
                key={variant}
                onClick={() => setSelectedVariant(variant)}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all text-left",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={cn("h-5 w-5", variantColors[variant])} />
                  <span className="font-medium">{info.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">{info.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      <Button onClick={handleCopy} className="w-full gap-2" size="lg">
        {copied ? (
          <>
            <Check className="h-5 w-5" />
            Prompt kopiert!
          </>
        ) : (
          <>
            <Copy className="h-5 w-5" />
            {PROMPT_VARIANTS[selectedVariant].name} Prompt kopieren
          </>
        )}
      </Button>

      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <span>Funktioniert mit:</span>
        <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground flex items-center gap-1">
          ChatGPT <ExternalLink className="h-3 w-3" />
        </a>
        <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="hover:text-foreground flex items-center gap-1">
          Claude <ExternalLink className="h-3 w-3" />
        </a>
        <a href="https://gemini.google.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground flex items-center gap-1">
          Gemini <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );

  if (!showCard) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          KI-Prompt Generator
          <span className="text-xs font-normal text-muted-foreground ml-2">
            {Object.keys(PROMPT_VARIANTS).length} Varianten
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
