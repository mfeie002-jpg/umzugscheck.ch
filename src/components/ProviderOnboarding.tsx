import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  FileCheck,
  Users,
  TrendingUp,
  ArrowRight,
  X,
  CheckCircle,
} from "lucide-react";
import { useProviderAuth } from "@/contexts/ProviderAuthContext";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: typeof Building2;
  action: string;
  route: string;
}

const steps: OnboardingStep[] = [
  {
    id: "profile",
    title: "Firmenprofil vervollständigen",
    description: "Erstellen Sie ein aussagekräftiges Profil mit Ihren Services und Regionen",
    icon: Building2,
    action: "Profil bearbeiten",
    route: "/anbieter/profil",
  },
  {
    id: "verification",
    title: "Verifizierung abwarten",
    description: "Unser Team prüft Ihre Angaben und schaltet Sie in 1-2 Werktagen frei",
    icon: FileCheck,
    action: "Status prüfen",
    route: "/anbieter/dashboard",
  },
  {
    id: "leads",
    title: "Qualifizierte Leads erhalten",
    description: "Erhalten Sie passende Anfragen und kaufen Sie Leads gezielt nach Budget",
    icon: Users,
    action: "Leads ansehen",
    route: "/anbieter/dashboard",
  },
  {
    id: "grow",
    title: "Geschäft ausbauen",
    description: "Nutzen Sie Analytics, Optimierungsvorschläge und KI-gestützte Features",
    icon: TrendingUp,
    action: "Dashboard öffnen",
    route: "/anbieter/dashboard",
  },
};

export const ProviderOnboarding = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { provider } = useProviderAuth();

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("provider-onboarding-seen");

    if (provider && !hasSeenOnboarding) {
      setTimeout(() => setIsOpen(true), 1000);
    }
  }, [provider]);

  const handleComplete = () => {
    localStorage.setItem("provider-onboarding-seen", "true");
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

  if (!provider) return null;

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
                        <span>Logo und Galerie hochladen</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Services und Regionen definieren</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Preisniveau und Kapazität festlegen</span>
                      </div>
                    </>
                  )}
                  {currentStep === 1 && (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Schnelle Überprüfung (1-2 Tage)</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Qualitätssicherung garantiert</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>E-Mail bei Freischaltung</span>
                      </div>
                    </>
                  )}
                  {currentStep === 2 && (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Geprüfte, zahlungsbereite Kunden</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Lead-Qualitäts-Scores</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Bieten oder direkt kaufen</span>
                      </div>
                    </>
                  )}
                  {currentStep === 3 && (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Conversion-Tracking</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Konkurrenzanalyse</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>KI-gestützte Optimierung</span>
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
