import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Calculator,
  Building2,
  FileText,
  CheckCircle,
  ArrowRight,
  X,
} from "lucide-react";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: typeof Calculator;
  action: string;
  route: string;
}

const steps: OnboardingStep[] = [
  {
    id: "calculator",
    title: "Umzugskosten berechnen",
    description: "Erhalten Sie in 2 Minuten eine erste Kostenschätzung für Ihren Umzug",
    icon: Calculator,
    action: "Rechner starten",
    route: "/rechner",
  },
  {
    id: "compare",
    title: "Umzugsfirmen vergleichen",
    description: "Vergleichen Sie Preise, Bewertungen und Services von geprüften Firmen",
    icon: Building2,
    action: "Firmen anzeigen",
    route: "/firmen",
  },
  {
    id: "request",
    title: "Offerten anfordern",
    description: "Fordern Sie kostenlos und unverbindlich Offerten von passenden Firmen an",
    icon: FileText,
    action: "Offerte anfordern",
    route: "/rechner",
  },
];

export const CustomerOnboarding = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("customer-onboarding-seen");
    const isFirstVisit = !localStorage.getItem("visited-before");

    if (!hasSeenOnboarding && isFirstVisit) {
      setTimeout(() => setIsOpen(true), 1500);
      localStorage.setItem("visited-before", "true");
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem("customer-onboarding-seen", "true");
    setIsOpen(false);
  };

  const handleAction = (route: string) => {
    handleComplete();
    navigate(route);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const step = steps[currentStep];
  const Icon = step.icon;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <div className="relative">
          <Button
            onClick={handleSkip}
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 z-10"
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="p-6 space-y-6">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Schritt {currentStep + 1} von {steps.length}
                </span>
                <span className="font-semibold">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>

            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon className="w-10 h-10 text-primary" />
              </div>
            </div>

            {/* Content */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">{step.title}</h2>
              <p className="text-muted-foreground">{step.description}</p>
            </div>

            {/* Features */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {currentStep === 0 && (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Kostenlos & unverbindlich</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Sofort Ergebnis</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>KI-gestützte Berechnung</span>
                      </div>
                    </>
                  )}
                  {currentStep === 1 && (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Über 200 geprüfte Firmen</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Echte Kundenbewertungen</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Transparente Preise</span>
                      </div>
                    </>
                  )}
                  {currentStep === 2 && (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Bis zu 40% sparen</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Mehrere Angebote gleichzeitig</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Keine versteckten Kosten</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={() => handleAction(step.route)}
                className="flex-1"
              >
                {step.action}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              {currentStep < steps.length - 1 && (
                <Button onClick={handleNext} variant="outline">
                  Weiter
                </Button>
              )}
            </div>

            {/* Skip */}
            <div className="text-center">
              <Button onClick={handleSkip} variant="ghost" size="sm">
                Tour überspringen
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
