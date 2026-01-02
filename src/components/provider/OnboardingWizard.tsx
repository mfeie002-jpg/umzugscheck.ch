import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useProviderAuth } from "@/contexts/ProviderAuthContext";
import {
  Building2,
  MapPin,
  Briefcase,
  Image,
  Settings,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Upload,
  Sparkles,
  Trophy,
  Target,
} from "lucide-react";

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: typeof Building2;
}

const wizardSteps: WizardStep[] = [
  {
    id: "basics",
    title: "Grunddaten",
    description: "Firmenname, Kontakt & Beschreibung",
    icon: Building2,
  },
  {
    id: "services",
    title: "Dienstleistungen",
    description: "Welche Services bieten Sie an?",
    icon: Briefcase,
  },
  {
    id: "regions",
    title: "Regionen",
    description: "Wo sind Sie tätig?",
    icon: MapPin,
  },
  {
    id: "media",
    title: "Medien",
    description: "Logo hochladen",
    icon: Image,
  },
  {
    id: "settings",
    title: "Einstellungen",
    description: "Preise und Kapazitäten",
    icon: Settings,
  },
];

const allServices = [
  "Privatumzug",
  "Firmenumzug",
  "Möbeltransport",
  "Reinigung",
  "Entsorgung",
  "Räumung",
  "Lagerung",
  "Möbelmontage",
  "Verpackung",
  "Klaviertransport",
  "Internationale Umzüge",
];

const swissCantons = [
  "Zürich", "Bern", "Luzern", "Uri", "Schwyz", "Obwalden", "Nidwalden",
  "Glarus", "Zug", "Freiburg", "Solothurn", "Basel-Stadt", "Basel-Landschaft",
  "Schaffhausen", "Appenzell Ausserrhoden", "Appenzell Innerrhoden", "St. Gallen",
  "Graubünden", "Aargau", "Thurgau", "Tessin", "Waadt", "Wallis", "Neuenburg",
  "Genf", "Jura",
];

export const OnboardingWizard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const { provider, refreshProvider } = useProviderAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    company_name: "",
    description: "",
    phone: "",
    website: "",
    services_offered: [] as string[],
    cantons_served: [] as string[],
    logo_url: "",
    price_level: "",
    employees_count: 0,
    fleet_size: 0,
    max_leads_per_month: 50,
  });

  useEffect(() => {
    if (provider) {
      setFormData({
        company_name: provider.company_name || "",
        description: provider.description || "",
        phone: provider.phone || "",
        website: provider.website || "",
        services_offered: provider.services_offered || [],
        cantons_served: provider.cantons_served || [],
        logo_url: provider.logo_url || "",
        price_level: provider.price_level || "",
        employees_count: provider.employees_count || 0,
        fleet_size: provider.fleet_size || 0,
        max_leads_per_month: provider.max_leads_per_month || 50,
      });

      // Calculate completed steps
      const completed: string[] = [];
      if (provider.company_name && provider.description) completed.push("basics");
      if (provider.services_offered && provider.services_offered.length > 0) completed.push("services");
      if (provider.cantons_served && provider.cantons_served.length > 0) completed.push("regions");
      if (provider.logo_url) completed.push("media");
      if (provider.price_level) completed.push("settings");
      setCompletedSteps(completed);
    }
  }, [provider]);

  useEffect(() => {
    const hasSeenWizard = localStorage.getItem("provider-wizard-completed");
    // Show wizard if provider hasn't completed their profile
    if (provider && !hasSeenWizard) {
      const hasIncompleteProfile = 
        !provider.description || 
        !provider.services_offered?.length || 
        !provider.cantons_served?.length ||
        !provider.logo_url ||
        !provider.price_level;
      
      if (hasIncompleteProfile) {
        setTimeout(() => setIsOpen(true), 1500);
      }
    }
  }, [provider]);

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services_offered: prev.services_offered.includes(service)
        ? prev.services_offered.filter(s => s !== service)
        : [...prev.services_offered, service],
    }));
  };

  const handleCantonToggle = (canton: string) => {
    setFormData(prev => ({
      ...prev,
      cantons_served: prev.cantons_served.includes(canton)
        ? prev.cantons_served.filter(c => c !== canton)
        : [...prev.cantons_served, canton],
    }));
  };

  const saveCurrentStep = async () => {
    if (!provider) return;
    setIsLoading(true);

    try {
      const step = wizardSteps[currentStep];
      let updateData: Record<string, any> = {};

      switch (step.id) {
        case "basics":
          updateData = {
            company_name: formData.company_name,
            description: formData.description,
            phone: formData.phone,
            website: formData.website,
          };
          break;
        case "services":
          updateData = { services_offered: formData.services_offered };
          break;
        case "regions":
          updateData = { cantons_served: formData.cantons_served };
          break;
        case "media":
          updateData = { logo_url: formData.logo_url };
          break;
        case "settings":
          updateData = {
            price_level: formData.price_level || null,
            employees_count: formData.employees_count,
            fleet_size: formData.fleet_size,
            max_leads_per_month: formData.max_leads_per_month,
          };
          break;
      }

      const { error } = await supabase
        .from("service_providers")
        .update(updateData)
        .eq("id", provider.id);

      if (error) throw error;

      if (!completedSteps.includes(step.id)) {
        setCompletedSteps([...completedSteps, step.id]);
      }

      await refreshProvider();

      toast({
        title: "Gespeichert",
        description: `${step.title} wurde aktualisiert.`,
      });
    } catch (error) {
      console.error("Error saving step:", error);
      toast({
        title: "Fehler",
        description: "Speichern fehlgeschlagen. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    await saveCurrentStep();
    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleComplete = () => {
    localStorage.setItem("provider-wizard-completed", "true");
    setIsOpen(false);
    toast({
      title: "Onboarding abgeschlossen!",
      description: "Ihr Profil ist jetzt vollständig. Viel Erfolg!",
    });
    navigate("/anbieter/dashboard");
  };

  const handleSkip = () => {
    localStorage.setItem("provider-wizard-completed", "true");
    setIsOpen(false);
  };

  const calculateProgress = () => {
    return ((completedSteps.length) / wizardSteps.length) * 100;
  };

  // Manual open function for external use
  const openWizard = () => setIsOpen(true);

  if (!provider) return null;

  const step = wizardSteps[currentStep];
  const Icon = step.icon;

  const renderStepContent = () => {
    switch (step.id) {
      case "basics":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">Firmenname *</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                placeholder="Ihr Firmenname"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Beschreibung *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Beschreiben Sie Ihre Firma und Dienstleistungen"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+41 XX XXX XX XX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://www.example.ch"
                />
              </div>
            </div>
          </div>
        );

      case "services":
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Wählen Sie alle Dienstleistungen, die Sie anbieten:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {allServices.map((service) => (
                <div
                  key={service}
                  onClick={() => handleServiceToggle(service)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    formData.services_offered.includes(service)
                      ? "bg-primary/10 border-primary"
                      : "bg-background hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Checkbox checked={formData.services_offered.includes(service)} />
                    <span className="text-sm">{service}</span>
                  </div>
                </div>
              ))}
            </div>
            <Badge variant="secondary">
              {formData.services_offered.length} ausgewählt
            </Badge>
          </div>
        );

      case "regions":
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              In welchen Kantonen sind Sie tätig?
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFormData({ ...formData, cantons_served: [...swissCantons] })}
              >
                Alle auswählen
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFormData({ ...formData, cantons_served: [] })}
              >
                Keine
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
              {swissCantons.map((canton) => (
                <div
                  key={canton}
                  onClick={() => handleCantonToggle(canton)}
                  className={`p-2 rounded border cursor-pointer transition-all text-center text-sm ${
                    formData.cantons_served.includes(canton)
                      ? "bg-primary/10 border-primary"
                      : "bg-background hover:bg-muted/50"
                  }`}
                >
                  {canton}
                </div>
              ))}
            </div>
            <Badge variant="secondary">
              {formData.cantons_served.length} Kantone ausgewählt
            </Badge>
          </div>
        );

      case "media":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logo_url">Logo URL</Label>
              <div className="flex gap-2">
                <Input
                  id="logo_url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  placeholder="https://example.com/logo.png"
                />
                <Button variant="outline" size="icon">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              {formData.logo_url && (
                <div className="mt-2 p-4 bg-muted rounded-lg">
                  <img
                    src={formData.logo_url}
                    alt="Logo Preview"
                    className="max-h-20 object-contain"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                </div>
              )}
            </div>
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Tipp</p>
                    <p className="text-xs text-muted-foreground">
                      Profile mit professionellen Bildern erhalten bis zu 3x mehr Anfragen.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="price_level">Preislevel</Label>
              <Select
                value={formData.price_level}
                onValueChange={(value) => setFormData({ ...formData, price_level: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wählen Sie Ihr Preislevel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="günstig">Günstig</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employees_count">Mitarbeiter</Label>
                <Input
                  id="employees_count"
                  type="number"
                  min={0}
                  value={formData.employees_count}
                  onChange={(e) => setFormData({ ...formData, employees_count: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fleet_size">Fahrzeuge</Label>
                <Input
                  id="fleet_size"
                  type="number"
                  min={0}
                  value={formData.fleet_size}
                  onChange={(e) => setFormData({ ...formData, fleet_size: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_leads_per_month">Max. Leads pro Monat</Label>
              <Input
                id="max_leads_per_month"
                type="number"
                min={1}
                value={formData.max_leads_per_month}
                onChange={(e) => setFormData({ ...formData, max_leads_per_month: parseInt(e.target.value) || 50 })}
              />
              <p className="text-xs text-muted-foreground">
                Wir senden Ihnen maximal diese Anzahl Leads pro Monat.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Profil vervollständigen
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={handleSkip}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Fortschritt</span>
              <span className="font-semibold">{Math.round(calculateProgress())}%</span>
            </div>
            <Progress value={calculateProgress()} />
          </div>

          {/* Step indicators */}
          <div className="flex justify-between">
            {wizardSteps.map((s, index) => {
              const StepIcon = s.icon;
              const isCompleted = completedSteps.includes(s.id);
              const isCurrent = index === currentStep;

              return (
                <div
                  key={s.id}
                  onClick={() => setCurrentStep(index)}
                  className={`flex flex-col items-center cursor-pointer transition-all ${
                    isCurrent ? "scale-110" : ""
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isCurrent
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <StepIcon className="h-5 w-5" />
                    )}
                  </div>
                  <span className={`text-xs mt-1 ${isCurrent ? "font-semibold" : "text-muted-foreground"}`}>
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Current step content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-primary" />
                {step.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </CardHeader>
            <CardContent>{renderStepContent()}</CardContent>
          </Card>

          {/* Navigation buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={handleSkip}>
                Später
              </Button>
              <Button onClick={handleNext} disabled={isLoading}>
                {currentStep === wizardSteps.length - 1 ? (
                  <>
                    <Target className="mr-2 h-4 w-4" />
                    Abschliessen
                  </>
                ) : (
                  <>
                    Speichern & Weiter
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Export a trigger button component
export const OnboardingWizardTrigger = () => {
  const [wizardOpen, setWizardOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setWizardOpen(true)} variant="outline" size="sm">
        <Trophy className="mr-2 h-4 w-4" />
        Profil vervollständigen
      </Button>
      {wizardOpen && <OnboardingWizard />}
    </>
  );
};
