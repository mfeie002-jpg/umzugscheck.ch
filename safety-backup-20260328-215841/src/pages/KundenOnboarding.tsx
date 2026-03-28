import { useState, useEffect } from "react";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Circle,
  Play,
  ArrowRight,
  ArrowLeft,
  Download,
  Copy,
  ExternalLink,
  Sparkles,
  BarChart3,
  FileText,
  Lightbulb,
  Video,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ChatGPTPromptCopier } from "@/components/admin/ChatGPTPromptCopier";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: typeof BarChart3;
  videoId?: string;
  videoDuration?: string;
  content: React.ReactNode;
}

const STORAGE_KEY = "kunden-onboarding-progress";

const KundenOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { currentStep: savedStep, completedSteps: savedCompleted } = JSON.parse(saved);
      setCurrentStep(savedStep);
      setCompletedSteps(savedCompleted);
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ currentStep, completedSteps }));
  }, [currentStep, completedSteps]);

  const markComplete = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const goToStep = (stepId: number) => {
    setCurrentStep(stepId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const nextStep = () => {
    markComplete(currentStep);
    if (currentStep < steps.length) {
      goToStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  const resetProgress = () => {
    setCurrentStep(1);
    setCompletedSteps([]);
    localStorage.removeItem(STORAGE_KEY);
    toast.success("Fortschritt zurückgesetzt");
  };

  const progress = (completedSteps.length / 5) * 100;

  const VideoPlaceholder = ({ title, duration }: { title: string; duration: string }) => (
    <div className="aspect-video rounded-xl bg-muted/50 border border-border flex flex-col items-center justify-center gap-3">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
        <Play className="w-8 h-8 text-primary ml-1" />
      </div>
      <div className="text-center">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{duration} • Video kommt bald</p>
      </div>
    </div>
  );

  const steps: Step[] = [
    {
      id: 1,
      title: "Willkommen",
      description: "Übersicht und Ihre Möglichkeiten",
      icon: Sparkles,
      videoId: "PLACEHOLDER_WELCOME",
      videoDuration: "2:30",
      content: (
        <div className="space-y-6">
          <VideoPlaceholder title="Willkommen bei Umzugscheck" duration="2:30" />
          
          <div className="prose prose-sm max-w-none">
            <h3 className="text-xl font-bold">Was Sie in dieser Anleitung lernen</h3>
            <p className="text-muted-foreground">
              Diese Schritt-für-Schritt Anleitung zeigt Ihnen, wie Sie:
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              { icon: BarChart3, title: "Website analysieren", desc: "Automatische Analyse Ihrer Website-Performance" },
              { icon: Download, title: "Daten exportieren", desc: "Alle relevanten Daten als ZIP oder URL" },
              { icon: Sparkles, title: "KI-Analyse nutzen", desc: "ChatGPT für fundierte Empfehlungen" },
              { icon: Lightbulb, title: "Optimierungen umsetzen", desc: "Priorisierte Action Items erhalten" },
            ].map((item) => (
              <Card key={item.title} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">Tipp</Badge>
            </div>
            <p className="text-sm">
              Halten Sie Ihre Login-Daten für das Admin-Dashboard bereit. 
              Falls Sie noch keinen Zugang haben, kontaktieren Sie uns unter{" "}
              <a href="mailto:partner@umzugscheck.ch" className="text-primary hover:underline">
                partner@umzugscheck.ch
              </a>
            </p>
          </Card>
        </div>
      ),
    },
    {
      id: 2,
      title: "Analyse starten",
      description: "Ultimate Package generieren",
      icon: BarChart3,
      videoId: "PLACEHOLDER_ANALYSIS",
      videoDuration: "4:15",
      content: (
        <div className="space-y-6">
          <VideoPlaceholder title="Website-Analyse durchführen" duration="4:15" />

          <div className="space-y-4">
            <h3 className="text-xl font-bold">So starten Sie die Analyse</h3>
            
            <div className="space-y-3">
              {[
                { step: 1, text: "Öffnen Sie das Admin-Dashboard", link: "/admin", linkText: "Dashboard öffnen" },
                { step: 2, text: "Navigieren Sie zum Tab 'Analytics'" },
                { step: 3, text: "Scrollen Sie zu 'Ultimate AI Feedback Package v3.0'" },
                { step: 4, text: "Konfigurieren Sie die Optionen (Screenshots, HTML, Lighthouse)" },
                { step: 5, text: "Klicken Sie auf 'Ultimate Package generieren'" },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.text}</p>
                    {item.link && (
                      <Link to={item.link}>
                        <Button variant="link" size="sm" className="p-0 h-auto mt-1">
                          {item.linkText}
                          <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Card className="p-4 bg-amber-500/10 border-amber-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="border-amber-500 text-amber-600">Wichtig</Badge>
              </div>
              <p className="text-sm">
                Die Generierung kann 30-60 Sekunden dauern, je nach gewählten Optionen. 
                Schliessen Sie das Fenster nicht während der Generierung.
              </p>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: "Daten exportieren",
      description: "ZIP, URL oder Clipboard",
      icon: Download,
      videoId: "PLACEHOLDER_EXPORT",
      videoDuration: "3:00",
      content: (
        <div className="space-y-6">
          <VideoPlaceholder title="Export-Optionen erklärt" duration="3:00" />

          <h3 className="text-xl font-bold">Ihre Export-Optionen</h3>

          <div className="grid gap-4">
            {[
              {
                title: "ZIP-Download",
                desc: "Alle Dateien lokal speichern",
                icon: Download,
                pros: ["Offline verfügbar", "Alle Dateien inkl. Screenshots", "Ideal für Archivierung"],
                best: "Für lokale Analyse & Backup",
              },
              {
                title: "Public URL",
                desc: "Teilbarer Link für 24 Stunden",
                icon: ExternalLink,
                pros: ["Direkt mit ChatGPT nutzbar", "Keine Uploads nötig", "Einfach teilbar"],
                best: "Für ChatGPT mit Web-Browsing",
                recommended: true,
              },
              {
                title: "Copy to Clipboard",
                desc: "Prompt direkt kopieren",
                icon: Copy,
                pros: ["Sofort einsatzbereit", "Optimierter Prompt", "Kein Download nötig"],
                best: "Für schnelle Analysen",
              },
            ].map((option) => (
              <Card key={option.title} className={cn("p-4", option.recommended && "border-primary")}>
                {option.recommended && (
                  <Badge className="mb-2">Empfohlen</Badge>
                )}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <option.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold">{option.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{option.desc}</p>
                    <ul className="space-y-1">
                      {option.pros.map((pro) => (
                        <li key={pro} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-primary mt-2 font-medium">
                      → {option.best}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: "ChatGPT-Analyse",
      description: "KI-gestützte Auswertung",
      icon: Sparkles,
      videoId: "PLACEHOLDER_CHATGPT",
      videoDuration: "5:00",
      content: (
        <div className="space-y-6">
          <VideoPlaceholder title="ChatGPT-Analyse durchführen" duration="5:00" />

          <h3 className="text-xl font-bold">Prompt kopieren & analysieren</h3>

          <p className="text-muted-foreground">
            Wählen Sie eine Analyse-Variante und kopieren Sie den optimierten Prompt. 
            Fügen Sie ihn dann in ChatGPT, Claude oder ein anderes LLM ein.
          </p>

          <ChatGPTPromptCopier />

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-4">
              <h4 className="font-bold mb-2">Mit Public URL (Empfohlen)</h4>
              <ol className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">1</span>
                  <span>Öffnen Sie ChatGPT (GPT-4 mit Browsing)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">2</span>
                  <span>Fügen Sie die Public URL aus Schritt 3 ein</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">3</span>
                  <span>Fügen Sie den kopierten Prompt hinzu</span>
                </li>
              </ol>
            </Card>

            <Card className="p-4">
              <h4 className="font-bold mb-2">Mit Datei-Upload</h4>
              <ol className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">1</span>
                  <span>Entpacken Sie die ZIP-Datei</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">2</span>
                  <span>Laden Sie PROJECT_BRIEF.md hoch</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">3</span>
                  <span>Fügen Sie den Prompt ein</span>
                </li>
              </ol>
            </Card>
          </div>

          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">Pro-Tipp</Badge>
            </div>
            <p className="text-sm">
              Für beste Ergebnisse nutzen Sie <strong>GPT-4</strong> oder <strong>Claude</strong>. 
              Diese Modelle liefern die genauesten Analysen und konkretesten Empfehlungen.
            </p>
          </Card>
        </div>
      ),
    },
    {
      id: 5,
      title: "Ergebnisse & nächste Schritte",
      description: "Interpretation & Umsetzung",
      icon: Lightbulb,
      videoId: "PLACEHOLDER_RESULTS",
      videoDuration: "3:30",
      content: (
        <div className="space-y-6">
          <VideoPlaceholder title="Ergebnisse interpretieren" duration="3:30" />

          <h3 className="text-xl font-bold">Was Sie mit den Ergebnissen tun können</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-6 border-primary">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-bold text-lg mb-2">Wir machen das für Sie</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Unser Team setzt die Empfehlungen professionell um. 
                Sie erhalten einen detaillierten Plan mit Zeitschätzung.
              </p>
              <a href="mailto:partner@umzugscheck.ch?subject=Analyse%20Umsetzung%20anfragen">
                <Button className="w-full">
                  Umsetzung anfragen
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </a>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-muted-foreground" />
              </div>
              <h4 className="font-bold text-lg mb-2">Selbst implementieren</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Nutzen Sie unseren Code-Export um die Änderungen 
                selbst vorzunehmen oder an Ihr Entwicklerteam zu geben.
              </p>
              <Link to="/admin/code-export">
                <Button variant="outline" className="w-full">
                  Zum Code-Export
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6">
            <h4 className="font-bold mb-4">Typische Ergebnisse nach der Analyse</h4>
            <div className="grid gap-3 md:grid-cols-3">
              {[
                { label: "Quick Wins identifiziert", value: "5-10" },
                { label: "Conversion-Potenzial", value: "+15-30%" },
                { label: "Umsetzungszeit", value: "1-2 Wochen" },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-3 bg-background rounded-lg">
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <Card className="p-4 bg-green-500/10 border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="font-bold">Onboarding abgeschlossen!</span>
            </div>
            <p className="text-sm">
              Sie wissen jetzt, wie Sie Ihre Website analysieren und optimieren können. 
              Bei Fragen steht Ihnen unser Support-Team jederzeit zur Verfügung.
            </p>
          </Card>
        </div>
      ),
    },
  ];

  const currentStepData = steps.find((s) => s.id === currentStep)!;

  return (
    <div className="min-h-screen bg-background">
      <OptimizedSEO
        title="Kunden-Onboarding: Website analysieren & optimieren"
        description="Schritt-für-Schritt Anleitung: Lernen Sie, wie Sie Ihre Website analysieren und mit ChatGPT optimieren können."
        canonicalUrl="https://umzugscheck.ch/kunden-onboarding"
      />

      <main className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/fuer-firmen">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zu Für Firmen
            </Button>
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Website-Analyse Onboarding
          </h1>
          <p className="text-lg text-muted-foreground">
            Lernen Sie in 5 einfachen Schritten, wie Sie Ihre Website analysieren
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="p-4 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Schritt {currentStep} von {steps.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {completedSteps.length} abgeschlossen
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          
          {/* Step indicators */}
          <div className="flex justify-between mt-4">
            {steps.map((step) => {
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = step.id === currentStep;
              
              return (
                <button
                  key={step.id}
                  onClick={() => goToStep(step.id)}
                  className={cn(
                    "flex flex-col items-center gap-1 transition-colors",
                    isCurrent && "text-primary",
                    isCompleted && !isCurrent && "text-green-500",
                    !isCompleted && !isCurrent && "text-muted-foreground"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors",
                    isCurrent && "border-primary bg-primary text-primary-foreground",
                    isCompleted && !isCurrent && "border-green-500 bg-green-500 text-white",
                    !isCompleted && !isCurrent && "border-border"
                  )}>
                    {isCompleted && !isCurrent ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <span className="text-sm font-bold">{step.id}</span>
                    )}
                  </div>
                  <span className="text-xs hidden md:block max-w-[80px] text-center truncate">
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Current Step Content */}
        <Card className="p-6 md:p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <currentStepData.icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{currentStepData.title}</h2>
              <p className="text-sm text-muted-foreground">{currentStepData.description}</p>
            </div>
          </div>

          {currentStepData.content}
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück
          </Button>

          <Button variant="ghost" size="sm" onClick={resetProgress}>
            Fortschritt zurücksetzen
          </Button>

          {currentStep < steps.length ? (
            <Button onClick={nextStep}>
              Weiter
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={() => markComplete(currentStep)} className="bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Abschliessen
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default KundenOnboarding;
