import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, ChevronRight, ChevronLeft, Calculator, Building2, ClipboardList, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  targetSelector?: string;
  position: "center" | "top" | "bottom";
}

const tourSteps: TourStep[] = [
  {
    id: "welcome",
    title: "Willkommen bei Umzugscheck.ch",
    description: "Wir helfen Ihnen, die beste Umzugsfirma in der Schweiz zu finden. Lassen Sie uns Ihnen zeigen, wie es funktioniert.",
    icon: <Building2 className="h-8 w-8 text-primary" />,
    position: "center",
  },
  {
    id: "calculator",
    title: "Preisrechner",
    description: "Berechnen Sie kostenlos und unverbindlich die voraussichtlichen Kosten für Ihren Umzug mit unserem intelligenten KI-Rechner.",
    icon: <Calculator className="h-8 w-8 text-primary" />,
    targetSelector: "[data-tour='calculator']",
    position: "bottom",
  },
  {
    id: "companies",
    title: "Umzugsfirmen vergleichen",
    description: "Vergleichen Sie geprüfte Umzugsfirmen in Ihrer Region anhand von Bewertungen, Preisen und Services.",
    icon: <Building2 className="h-8 w-8 text-primary" />,
    targetSelector: "[data-tour='companies']",
    position: "bottom",
  },
  {
    id: "tools",
    title: "Praktische Tools",
    description: "Nutzen Sie unsere kostenlosen Tools wie Checklisten, Budget-Planer und den Umzugskalender für eine stressfreie Organisation.",
    icon: <ClipboardList className="h-8 w-8 text-primary" />,
    targetSelector: "[data-tour='tools']",
    position: "bottom",
  },
  {
    id: "request",
    title: "Offerten einholen",
    description: "Fordern Sie mit wenigen Klicks Offerten von mehreren Umzugsfirmen an und sparen Sie bis zu 40%.",
    icon: <Send className="h-8 w-8 text-primary" />,
    position: "center",
  },
];

export const OnboardingTour = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenTour, setHasSeenTour] = useState(true);

  useEffect(() => {
    const seen = localStorage.getItem("onboarding-tour-completed");
    if (!seen) {
      // Show tour after a short delay for new users
      const timer = setTimeout(() => {
        setHasSeenTour(false);
        setIsOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("onboarding-tour-completed", "true");
    setHasSeenTour(true);
  };

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleClose();
  };

  const restartTour = () => {
    setCurrentStep(0);
    setIsOpen(true);
  };

  const step = tourSteps[currentStep];

  if (!isOpen) {
    // Show restart button for users who have seen the tour
    if (hasSeenTour) {
      return null;
    }
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50 animate-fade-in" />

      {/* Tour Card */}
      <div
        className={cn(
          "fixed z-50 animate-scale-in",
          step.position === "center" && "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          step.position === "top" && "top-20 left-1/2 -translate-x-1/2",
          step.position === "bottom" && "bottom-20 left-1/2 -translate-x-1/2"
        )}
      >
        <Card className="w-[90vw] max-w-md shadow-2xl">
          <CardContent className="p-6">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Step indicator */}
            <div className="flex justify-center gap-1 mb-4">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-1.5 w-6 rounded-full transition-colors",
                    index === currentStep ? "bg-primary" : "bg-muted"
                  )}
                />
              ))}
            </div>

            {/* Content */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary/10 rounded-full">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-muted-foreground"
              >
                Überspringen
              </Button>
              <div className="flex gap-2">
                {currentStep > 0 && (
                  <Button variant="outline" onClick={handlePrev}>
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Zurück
                  </Button>
                )}
                <Button onClick={handleNext}>
                  {currentStep === tourSteps.length - 1 ? (
                    "Fertig"
                  ) : (
                    <>
                      Weiter
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

// Export helper to restart tour manually
export const useOnboardingTour = () => {
  const restartTour = () => {
    localStorage.removeItem("onboarding-tour-completed");
    window.location.reload();
  };

  return { restartTour };
};
