import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarIcon, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  User, 
  Calendar as CalendarSimple,
  FileText,
  Package,
  Mail,
  Phone as PhoneIcon,
  MapPin
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { MovingCalculation } from "@/lib/pricing";
import { formatCurrency } from "@/lib/pricing";
import { useAnalytics } from "@/lib/analytics";

const formSchema = z.object({
  name: z.string().min(2, "Name muss mindestens 2 Zeichen lang sein").max(100),
  email: z.string().email("Bitte gültige E-Mail-Adresse eingeben").max(255),
  phone: z.string().min(10, "Bitte gültige Telefonnummer eingeben").max(20),
  moveDate: z.date({
    required_error: "Bitte Umzugsdatum wählen",
  }),
  flexibility: z.string().optional(),
  comments: z.string().max(1000).optional(),
});

interface LeadCaptureFormProps {
  calculatorData: any;
  calculation: MovingCalculation;
  distance: number;
  calculatorType: "quick" | "advanced" | "ai";
  onSuccess?: () => void;
}

const steps = [
  { id: 1, name: "Kontakt", icon: User },
  { id: 2, name: "Umzugsdetails", icon: CalendarSimple },
  { id: 3, name: "Zusammenfassung", icon: FileText },
];

export const LeadCaptureForm = ({
  calculatorData,
  calculation,
  distance,
  calculatorType,
  onSuccess,
}: LeadCaptureFormProps) => {
  const { toast } = useToast();
  const analytics = useAnalytics();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    analytics.trackPageView('Lead Form', '/rechner/ergebnis');
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      flexibility: "flexible",
      comments: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      // Insert lead into database
      const { error } = await supabase.from("leads").insert({
        name: values.name,
        email: values.email,
        phone: values.phone,
        move_date: format(values.moveDate, "yyyy-MM-dd"),
        from_postal: calculatorData.fromPostal,
        from_city: calculatorData.fromCity,
        to_postal: calculatorData.toPostal,
        to_city: calculatorData.toCity,
        calculator_type: calculatorType,
        calculator_input: calculatorData,
        calculator_output: {
          priceMin: calculation.priceMin,
          priceMax: calculation.priceMax,
          volumeM3: calculation.volumeM3,
          estimatedHours: calculation.estimatedHours,
          distance,
        },
        comments: values.comments || null,
      });

      if (error) throw error;

      setIsSuccess(true);

      // Track lead submission
      analytics.trackLeadSubmitted({
        calculatorType,
        moveDate: format(values.moveDate, "yyyy-MM-dd"),
        fromCity: calculatorData.fromCity,
        toCity: calculatorData.toCity,
        priceRange: `${calculation.priceMin}-${calculation.priceMax}`,
      });

      toast({
        title: "Anfrage erfolgreich gesendet!",
        description: "Wir leiten Ihre Anfrage an passende Umzugsfirmen weiter.",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting lead:", error);
      const errorMsg = error instanceof Error ? error.message : 'Unbekannter Fehler';
      analytics.trackError('lead_submission_error', { 
        error: errorMsg,
        calculatorType 
      });
      toast({
        title: "Fehler beim Senden",
        description: "Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof z.infer<typeof formSchema>)[] = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ["name", "email", "phone"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["moveDate"];
    }

    const isValid = await form.trigger(fieldsToValidate);
    
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Success/Confirmation Screen
  if (isSuccess) {
    return (
      <Card className="shadow-strong border-success/20 bg-gradient-to-br from-success-light to-white animate-fade-in">
        <CardContent className="pt-12 pb-12">
          <div className="flex flex-col items-center gap-8 text-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center animate-scale-in">
                <CheckCircle2 className="w-16 h-16 text-success" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-success flex items-center justify-center">
                <span className="text-white text-lg">✓</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-3xl font-bold">Perfekt! Anfrage gesendet</h3>
              <p className="text-lg text-muted-foreground max-w-md">
                Ihre Anfrage wurde erfolgreich übermittelt. Sie erhalten in Kürze bis zu 5 unverbindliche 
                Offerten von geprüften Umzugsfirmen.
              </p>
            </div>

            <div className="w-full max-w-md space-y-4">
              <div className="bg-white rounded-lg border p-6 space-y-4 text-left shadow-soft">
                <h4 className="font-semibold flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Was passiert jetzt?
                </h4>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <div className="font-medium text-sm">Offerten einholen</div>
                      <div className="text-xs text-muted-foreground">
                        Wir leiten Ihre Anfrage an passende Umzugsfirmen weiter
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <div className="font-medium text-sm">Angebote erhalten</div>
                      <div className="text-xs text-muted-foreground">
                        Sie erhalten innerhalb von 24-48h Offerten per E-Mail
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <div className="font-medium text-sm">Vergleichen & Buchen</div>
                      <div className="text-xs text-muted-foreground">
                        Wählen Sie das beste Angebot und buchen Sie direkt
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span>Bestätigungs-E-Mail wurde an {form.getValues("email")} gesendet</span>
              </div>
            </div>

            <Button 
              size="lg" 
              onClick={() => window.location.href = "/"}
              className="bg-primary hover:bg-primary/90"
            >
              Zurück zur Startseite
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-strong">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div>
            <CardTitle>Kostenlose Offerten erhalten</CardTitle>
            <CardDescription>
              Schritt {currentStep} von {steps.length}
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-success-light text-success border-success/20">
            100% Kostenlos
          </Badge>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center gap-2 flex-1">
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full transition-all",
                      isCompleted && "bg-success text-white",
                      isCurrent && "bg-primary text-white",
                      !isCompleted && !isCurrent && "bg-secondary text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <StepIcon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="hidden md:block">
                    <div className={cn("text-sm font-medium", isCurrent && "text-primary")}>
                      {step.name}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "h-1 flex-1 mx-2 rounded-full transition-all",
                    isCompleted ? "bg-success" : "bg-secondary"
                  )} />
                )}
              </div>
            );
          })}
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Contact Information */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-2 text-sm text-muted-foreground pb-4 border-b">
                  <User className="w-4 h-4" />
                  <span>Ihre Kontaktdaten für die Offerten</span>
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vor- und Nachname *</FormLabel>
                      <FormControl>
                        <Input placeholder="Max Mustermann" {...field} className="h-11" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-Mail-Adresse *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                              type="email" 
                              placeholder="max@beispiel.ch" 
                              {...field} 
                              className="h-11 pl-10" 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefonnummer *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                              type="tel" 
                              placeholder="+41 79 123 45 67" 
                              {...field} 
                              className="h-11 pl-10" 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="bg-primary/5 rounded-lg p-4 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-primary">Ihre Daten sind sicher</p>
                      <p className="text-muted-foreground text-xs">
                        Wir geben Ihre Kontaktdaten nur an geprüfte Umzugsfirmen weiter.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Move Details */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-2 text-sm text-muted-foreground pb-4 border-b">
                  <CalendarSimple className="w-4 h-4" />
                  <span>Wann planen Sie Ihren Umzug?</span>
                </div>

                <FormField
                  control={form.control}
                  name="moveDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Gewünschtes Umzugsdatum *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "pl-3 text-left font-normal h-11",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? format(field.value, "dd.MM.yyyy") : <span>Datum wählen</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Wählen Sie Ihr Wunschdatum oder einen ungefähren Zeitraum
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="flexibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zeitliche Flexibilität</FormLabel>
                      <FormControl>
                        <select 
                          {...field} 
                          className="w-full h-11 px-3 border border-input rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="flexible">Flexibel (±1 Woche)</option>
                          <option value="fixed">Fixiertes Datum</option>
                          <option value="very-flexible">Sehr flexibel (±2 Wochen)</option>
                        </select>
                      </FormControl>
                      <FormDescription>
                        Mehr Flexibilität kann zu besseren Preisen führen
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="comments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zusätzliche Informationen (optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Besondere Anforderungen, schwierige Zugänge, spezielle Gegenstände..."
                          className="resize-none"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Teilen Sie uns spezielle Anforderungen mit, um genauere Offerten zu erhalten
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 3: Summary */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-2 text-sm text-muted-foreground pb-4 border-b">
                  <FileText className="w-4 h-4" />
                  <span>Bitte überprüfen Sie Ihre Angaben</span>
                </div>

                {/* Contact Summary */}
                <div className="bg-secondary/30 rounded-lg p-6 space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Kontaktdaten
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Name</div>
                      <div className="font-medium">{form.getValues("name")}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">E-Mail</div>
                      <div className="font-medium">{form.getValues("email")}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Telefon</div>
                      <div className="font-medium">{form.getValues("phone")}</div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentStep(1)}
                    className="text-primary"
                  >
                    Bearbeiten
                  </Button>
                </div>

                {/* Move Details Summary */}
                <div className="bg-secondary/30 rounded-lg p-6 space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    Umzugsdetails
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Von:</span>
                      <span className="font-medium">{calculatorData.fromPostal} {calculatorData.fromCity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Nach:</span>
                      <span className="font-medium">{calculatorData.toPostal} {calculatorData.toCity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Datum:</span>
                      <span className="font-medium">
                        {form.getValues("moveDate") ? format(form.getValues("moveDate"), "dd.MM.yyyy") : "-"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Volumen:</span>
                      <span className="font-medium">{calculation.volumeM3} m³</span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentStep(2)}
                    className="text-primary"
                  >
                    Bearbeiten
                  </Button>
                </div>

                {/* Price Estimate */}
                <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-6 border border-primary/20">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">Geschätzte Kosten</h4>
                    <Badge className="bg-primary">Ihre Ersparnis</Badge>
                  </div>
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-3xl font-bold text-primary">
                      {formatCurrency(calculation.priceMin)}
                    </span>
                    <span className="text-xl text-muted-foreground">-</span>
                    <span className="text-3xl font-bold text-primary">
                      {formatCurrency(calculation.priceMax)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Sie erhalten bis zu 5 Offerten zum Vergleichen
                  </p>
                </div>

                <div className="bg-secondary/30 rounded-lg p-4 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-semibold">100% kostenlos & unverbindlich</p>
                      <p className="text-muted-foreground text-xs">
                        Mit dem Absenden bestätigen Sie, dass Sie die Datenschutzbestimmungen gelesen haben 
                        und der Weitergabe Ihrer Daten an Umzugsfirmen zustimmen.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-4">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Zurück
                </Button>
              )}

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  Weiter
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex-1 bg-accent hover:bg-accent/90 shadow-accent"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Wird gesendet..." : "Jetzt Offerten anfordern"}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
