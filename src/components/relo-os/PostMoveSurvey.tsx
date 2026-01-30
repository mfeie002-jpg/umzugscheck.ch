/**
 * PostMoveSurvey - 5-Step Wizard for Move Health Index
 * Collects satisfaction and stress feedback after a move
 * Integrated with Relo-OS Phase 6 (Complete)
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Zap, 
  CalendarCheck, 
  Truck, 
  FileText, 
  Users,
  Check,
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PostMoveSurveyProps {
  leadId?: string;
  fromCanton: string;
  toCanton: string;
  onComplete?: () => void;
  onSkip?: () => void;
}

type MoveType = "professional" | "self" | "mixed";
type HouseholdType = "single" | "couple" | "family" | "shared";

interface SurveyData {
  overallSatisfaction: number;
  stressLevel: number;
  planningEase: number;
  movingCompanySatisfaction: number;
  adminEase: number;
  neighborsWelcome: number;
  hadDamage: boolean;
  moveType: MoveType;
  householdType: HouseholdType;
  whatWentWell: string;
  whatCouldImprove: string;
}

const STEPS = [
  { id: 1, title: "Gesamteindruck", icon: Heart },
  { id: 2, title: "Planung", icon: CalendarCheck },
  { id: 3, title: "Umzugstag", icon: Truck },
  { id: 4, title: "Behörden", icon: FileText },
  { id: 5, title: "Neues Zuhause", icon: Users },
];

const RATING_LABELS: Record<number, string> = {
  1: "Sehr schlecht",
  2: "Schlecht",
  3: "Okay",
  4: "Gut",
  5: "Sehr gut",
};

const STRESS_LABELS: Record<number, string> = {
  1: "Sehr entspannt",
  2: "Entspannt",
  3: "Neutral",
  4: "Stressig",
  5: "Sehr stressig",
};

export function PostMoveSurvey({ 
  leadId, 
  fromCanton, 
  toCanton, 
  onComplete, 
  onSkip 
}: PostMoveSurveyProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const [data, setData] = useState<SurveyData>({
    overallSatisfaction: 0,
    stressLevel: 0,
    planningEase: 0,
    movingCompanySatisfaction: 0,
    adminEase: 0,
    neighborsWelcome: 0,
    hadDamage: false,
    moveType: "professional",
    householdType: "couple",
    whatWentWell: "",
    whatCouldImprove: "",
  });

  const updateData = <K extends keyof SurveyData>(key: K, value: SurveyData[K]) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const progress = (step / STEPS.length) * 100;

  const canProceed = () => {
    switch (step) {
      case 1: return data.overallSatisfaction > 0 && data.stressLevel > 0;
      case 2: return data.planningEase > 0;
      case 3: return data.movingCompanySatisfaction > 0;
      case 4: return data.adminEase > 0;
      case 5: return data.neighborsWelcome > 0;
      default: return false;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("submit-post-move-survey", {
        body: {
          leadId,
          fromCanton,
          toCanton,
          overallSatisfaction: data.overallSatisfaction,
          stressLevel: data.stressLevel,
          planningEase: data.planningEase,
          movingCompanySatisfaction: data.movingCompanySatisfaction,
          adminEase: data.adminEase,
          neighborsWelcome: data.neighborsWelcome,
          hadDamage: data.hadDamage,
          moveType: data.moveType,
          householdType: data.householdType,
          whatWentWell: data.whatWentWell,
          whatCouldImprove: data.whatCouldImprove,
        },
      });

      if (error) throw error;

      setIsComplete(true);
      toast.success("Vielen Dank für Ihr Feedback!");
      onComplete?.();
    } catch (error) {
      console.error("Survey submission error:", error);
      toast.error("Fehler beim Absenden. Bitte versuchen Sie es erneut.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isComplete) {
    return (
      <Card className="max-w-lg mx-auto">
        <CardContent className="pt-8 pb-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4"
          >
            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
          </motion.div>
          <h3 className="text-xl font-semibold mb-2">Vielen Dank!</h3>
          <p className="text-muted-foreground">
            Ihr Feedback hilft anderen bei der Planung ihres Umzugs und verbessert die 
            Umzugsqualität in der Schweiz.
          </p>
        </CardContent>
      </Card>
    );
  }

  const renderRatingSelector = (
    value: number,
    onChange: (v: number) => void,
    labels: Record<number, string> = RATING_LABELS
  ) => (
    <div className="flex gap-2 justify-center my-4">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          onClick={() => onChange(rating)}
          className={`w-12 h-12 rounded-lg border-2 transition-all font-semibold ${
            value === rating
              ? "bg-primary text-primary-foreground border-primary scale-110"
              : "border-border hover:border-primary/50 hover:bg-accent"
          }`}
        >
          {rating}
        </button>
      ))}
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-2 block">
                Wie zufrieden waren Sie mit Ihrem Umzug insgesamt?
              </Label>
              {renderRatingSelector(data.overallSatisfaction, v => updateData("overallSatisfaction", v))}
              {data.overallSatisfaction > 0 && (
                <p className="text-center text-sm text-muted-foreground">
                  {RATING_LABELS[data.overallSatisfaction]}
                </p>
              )}
            </div>

            <div>
              <Label className="text-base font-medium mb-2 block flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Wie stressig war der Umzug für Sie?
              </Label>
              {renderRatingSelector(data.stressLevel, v => updateData("stressLevel", v), STRESS_LABELS)}
              {data.stressLevel > 0 && (
                <p className="text-center text-sm text-muted-foreground">
                  {STRESS_LABELS[data.stressLevel]}
                </p>
              )}
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">Wie haben Sie Ihren Umzug durchgeführt?</Label>
              <RadioGroup
                value={data.moveType}
                onValueChange={(v) => updateData("moveType", v as MoveType)}
                className="flex flex-wrap gap-3"
              >
                {[
                  { value: "professional", label: "Mit Umzugsfirma" },
                  { value: "self", label: "Selbst organisiert" },
                  { value: "mixed", label: "Gemischt" },
                ].map((option) => (
                  <Label
                    key={option.value}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors ${
                      data.moveType === option.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <RadioGroupItem value={option.value} />
                    {option.label}
                  </Label>
                ))}
              </RadioGroup>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-2 block">
                Wie einfach war die Planung Ihres Umzugs?
              </Label>
              {renderRatingSelector(data.planningEase, v => updateData("planningEase", v))}
              {data.planningEase > 0 && (
                <p className="text-center text-sm text-muted-foreground">
                  {RATING_LABELS[data.planningEase]}
                </p>
              )}
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">Ihre Haushaltssituation</Label>
              <RadioGroup
                value={data.householdType}
                onValueChange={(v) => updateData("householdType", v as HouseholdType)}
                className="grid grid-cols-2 gap-3"
              >
                {[
                  { value: "single", label: "Einzelperson" },
                  { value: "couple", label: "Paar" },
                  { value: "family", label: "Familie" },
                  { value: "shared", label: "WG" },
                ].map((option) => (
                  <Label
                    key={option.value}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                      data.householdType === option.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <RadioGroupItem value={option.value} />
                    {option.label}
                  </Label>
                ))}
              </RadioGroup>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-2 block">
                Wie zufrieden waren Sie mit der Umzugsdurchführung?
              </Label>
              {renderRatingSelector(data.movingCompanySatisfaction, v => updateData("movingCompanySatisfaction", v))}
              {data.movingCompanySatisfaction > 0 && (
                <p className="text-center text-sm text-muted-foreground">
                  {RATING_LABELS[data.movingCompanySatisfaction]}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg border bg-accent/30">
              <Checkbox
                id="hadDamage"
                checked={data.hadDamage}
                onCheckedChange={(v) => updateData("hadDamage", v as boolean)}
              />
              <Label htmlFor="hadDamage" className="cursor-pointer">
                Es gab Schäden an meinem Umzugsgut
              </Label>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-2 block">
                Wie einfach waren die Behördengänge (Ummeldung, etc.)?
              </Label>
              {renderRatingSelector(data.adminEase, v => updateData("adminEase", v))}
              {data.adminEase > 0 && (
                <p className="text-center text-sm text-muted-foreground">
                  {RATING_LABELS[data.adminEase]}
                </p>
              )}
            </div>

            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                💡 Tipp: Mit <strong>eUmzugCH</strong> können Sie in vielen Kantonen 
                die Ummeldung komplett digital erledigen.
              </p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-2 block">
                Wie willkommen fühlen Sie sich in Ihrer neuen Nachbarschaft?
              </Label>
              {renderRatingSelector(data.neighborsWelcome, v => updateData("neighborsWelcome", v))}
              {data.neighborsWelcome > 0 && (
                <p className="text-center text-sm text-muted-foreground">
                  {RATING_LABELS[data.neighborsWelcome]}
                </p>
              )}
            </div>

            <div>
              <Label className="text-base font-medium mb-2 block">
                Was lief besonders gut? (optional)
              </Label>
              <Textarea
                value={data.whatWentWell}
                onChange={(e) => updateData("whatWentWell", e.target.value)}
                placeholder="z.B. Pünktliches Team, reibungslose Ummeldung..."
                maxLength={500}
                rows={3}
              />
            </div>

            <div>
              <Label className="text-base font-medium mb-2 block">
                Was könnte verbessert werden? (optional)
              </Label>
              <Textarea
                value={data.whatCouldImprove}
                onChange={(e) => updateData("whatCouldImprove", e.target.value)}
                placeholder="z.B. Bessere Kommunikation, längere Öffnungszeiten..."
                maxLength={500}
                rows={3}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const CurrentIcon = STEPS[step - 1].icon;

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <CurrentIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{STEPS[step - 1].title}</CardTitle>
              <CardDescription>Schritt {step} von {STEPS.length}</CardDescription>
            </div>
          </div>
          {onSkip && step === 1 && (
            <Button variant="ghost" size="sm" onClick={onSkip}>
              Überspringen
            </Button>
          )}
        </div>
        <Progress value={progress} className="h-1.5" />
      </CardHeader>

      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setStep(s => s - 1)}
            disabled={step === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Zurück
          </Button>

          {step < STEPS.length ? (
            <Button
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
            >
              Weiter
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Senden...
                </>
              ) : (
                <>
                  Absenden
                  <Check className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
