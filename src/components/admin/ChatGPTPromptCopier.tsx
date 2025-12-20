import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Copy, Zap, Search, Code, ChevronDown, Check, Sparkles } from "lucide-react";
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
} as const;

export function ChatGPTPromptCopier({ 
  data, 
  className,
  compact = false,
  showCard = true 
}: ChatGPTPromptCopierProps) {
  const [selectedVariant, setSelectedVariant] = useState<PromptVariant>("quick");
  const [copied, setCopied] = useState(false);

  const defaultData: PromptData = {
    projectName: "Umzugscheck.ch",
    projectUrl: "https://umzugscheck.ch",
    conversionRate: 14,
    bounceRate: 38.5,
    mobileScore: 67,
    avgSessionDuration: "2:45",
    topPages: ["Homepage", "Rechner", "Firmen-Verzeichnis", "Offerten"],
    competitors: ["movu.ch", "comparis.ch", "umzug.ch"],
    ...data,
  };

  const handleCopy = async () => {
    const prompt = generatePrompt(selectedVariant, defaultData);
    
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      toast.success("ChatGPT-Prompt kopiert!", {
        description: "Jetzt in ChatGPT einfügen und analysieren lassen.",
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
              <SelectedIcon className="h-4 w-4" />
              {variantInfo.name}
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {(Object.keys(PROMPT_VARIANTS) as PromptVariant[]).map((variant) => {
              const Icon = variantIcons[variant];
              const info = PROMPT_VARIANTS[variant];
              return (
                <DropdownMenuItem
                  key={variant}
                  onClick={() => setSelectedVariant(variant)}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  <div>
                    <div className="font-medium">{info.name}</div>
                    <div className="text-xs text-muted-foreground">{info.description}</div>
                  </div>
                  {selectedVariant === variant && <Check className="h-4 w-4 ml-auto" />}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {(Object.keys(PROMPT_VARIANTS) as PromptVariant[]).map((variant) => {
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
                <Icon className={cn("h-5 w-5", isSelected ? "text-primary" : "text-muted-foreground")} />
                <span className="font-medium">{info.name}</span>
              </div>
              <p className="text-xs text-muted-foreground">{info.description}</p>
            </button>
          );
        })}
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
            ChatGPT-Prompt kopieren
          </>
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Funktioniert mit ChatGPT-4, Claude, Gemini und anderen LLMs
      </p>
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
          ChatGPT-Prompt Generator
        </CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
