import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, Calculator, Sparkles, TrendingDown, Clock, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { calculatorApi } from "@/lib/api";
import { useAnalytics } from "@/lib/analytics";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  fromPostal: z.string().min(4, "Bitte gültige PLZ eingeben").max(10),
  fromCity: z.string().min(2, "Bitte Ort eingeben"),
  toPostal: z.string().min(4, "Bitte gültige PLZ eingeben").max(10),
  toCity: z.string().min(2, "Bitte Ort eingeben"),
  rooms: z.string().min(1, "Bitte Zimmerzahl wählen"),
  movingType: z.string().min(1, "Bitte Umzugsart wählen"),
  floorsFrom: z.string(),
  floorsTo: z.string(),
  hasElevatorFrom: z.boolean(),
  hasElevatorTo: z.boolean(),
});

export const CalculatorSection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const analytics = useAnalytics();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromPostal: "",
      fromCity: "",
      toPostal: "",
      toCity: "",
      rooms: "",
      movingType: "local",
      floorsFrom: "0",
      floorsTo: "0",
      hasElevatorFrom: false,
      hasElevatorTo: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const requestData: any = {
        fromPostal: values.fromPostal,
        fromCity: values.fromCity,
        toPostal: values.toPostal,
        toCity: values.toCity,
        rooms: values.rooms,
        movingType: values.movingType,
        floorsFrom: values.floorsFrom,
        floorsTo: values.floorsTo,
        hasElevatorFrom: values.hasElevatorFrom,
        hasElevatorTo: values.hasElevatorTo,
      };

      const response = await calculatorApi.quick(requestData);
      
      if (response.error) {
        setError(response.error);
        analytics.trackError('calculator_api_error', { 
          calculator_type: 'quick',
          error: response.error 
        });
        toast({
          title: "Berechnung fehlgeschlagen",
          description: response.error,
          variant: "destructive",
        });
        return;
      }

      if (!response.data) {
        throw new Error('Keine Daten erhalten');
      }

      analytics.trackCalculatorCompleted('quick', response.data);
      
      navigate("/rechner/ergebnis", { 
        state: { 
          calculatorData: values, 
          calculation: response.data,
          distance: response.data.distance,
          type: "quick" 
        } 
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Ein unerwarteter Fehler ist aufgetreten';
      setError(errorMsg);
      analytics.trackError('calculator_error', { 
        calculator_type: 'quick',
        error: errorMsg 
      });
      toast({
        title: "Fehler",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background"></div>
      <div className="absolute top-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Kostenloses Tool</span>
          </div>
          <h2 className="mb-4 text-3xl md:text-4xl lg:text-5xl">
            Berechnen Sie Ihre Umzugskosten in <span className="text-accent">60 Sekunden</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Unser intelligenter Preisrechner gibt Ihnen eine präzise Kostenschätzung – 
            transparent, unverbindlich und sofort verfügbar.
          </p>
        </div>

        {/* Benefits Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white shadow-soft border border-border">
            <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
              <TrendingDown className="w-6 h-6 text-success" />
            </div>
            <div>
              <div className="font-bold text-foreground">Bis zu 40% sparen</div>
              <div className="text-sm text-muted-foreground">Durch Vergleich</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white shadow-soft border border-border">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-accent" />
            </div>
            <div>
              <div className="font-bold text-foreground">In 60 Sekunden</div>
              <div className="text-sm text-muted-foreground">Schnell & einfach</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white shadow-soft border border-border">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="font-bold text-foreground">100% kostenlos</div>
              <div className="text-sm text-muted-foreground">Keine Verpflichtung</div>
            </div>
          </div>
        </div>

        {/* Calculator Form */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-strong border border-border p-6 md:p-10 animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-8 pb-6 border-b">
              <div className="w-14 h-14 rounded-xl gradient-hero flex items-center justify-center">
                <Calculator className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Umzugskosten berechnen</h3>
                <p className="text-muted-foreground">Geben Sie Ihre Details ein und erhalten Sie sofort eine Schätzung</p>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {error && (
                  <Alert variant="destructive" className="animate-fade-in">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Location Section */}
                <div className="grid md:grid-cols-2 gap-8">
                  {/* From Location */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs">1</div>
                      Von (Aktueller Wohnort)
                    </div>
                    <div className="space-y-4 pl-10">
                      <FormField
                        control={form.control}
                        name="fromPostal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postleitzahl</FormLabel>
                            <FormControl>
                              <Input placeholder="z.B. 8001" {...field} className="h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="fromCity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ort</FormLabel>
                            <FormControl>
                              <Input placeholder="z.B. Zürich" {...field} className="h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* To Location */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-accent mb-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-xs">2</div>
                      Nach (Neuer Wohnort)
                    </div>
                    <div className="space-y-4 pl-10">
                      <FormField
                        control={form.control}
                        name="toPostal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postleitzahl</FormLabel>
                            <FormControl>
                              <Input placeholder="z.B. 3000" {...field} className="h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="toCity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ort</FormLabel>
                            <FormControl>
                              <Input placeholder="z.B. Bern" {...field} className="h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="rooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Wohnungsgrösse</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Zimmer wählen" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">1 Zimmer (Studio)</SelectItem>
                            <SelectItem value="2">2 Zimmer</SelectItem>
                            <SelectItem value="3">3 Zimmer</SelectItem>
                            <SelectItem value="4">4 Zimmer</SelectItem>
                            <SelectItem value="5">5 Zimmer</SelectItem>
                            <SelectItem value="6+">6+ Zimmer</SelectItem>
                            <SelectItem value="house">Haus</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="movingType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Umzugsart</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Art wählen" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="local">Lokal (gleiche Stadt)</SelectItem>
                            <SelectItem value="longDistance">Fernumzug</SelectItem>
                            <SelectItem value="international">International</SelectItem>
                            <SelectItem value="office">Büroumzug</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Floors Section */}
                <div className="grid md:grid-cols-2 gap-8 p-6 rounded-xl bg-secondary/30">
                  <div className="space-y-4">
                    <div className="font-semibold text-sm text-foreground">Ausgangsadresse</div>
                    <FormField
                      control={form.control}
                      name="floorsFrom"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stockwerk</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Stockwerk" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0">Erdgeschoss</SelectItem>
                              <SelectItem value="1">1. Stock</SelectItem>
                              <SelectItem value="2">2. Stock</SelectItem>
                              <SelectItem value="3">3. Stock</SelectItem>
                              <SelectItem value="4">4. Stock</SelectItem>
                              <SelectItem value="5">5+ Stock</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="hasElevatorFrom"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Lift vorhanden
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="font-semibold text-sm text-foreground">Zieladresse</div>
                    <FormField
                      control={form.control}
                      name="floorsTo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stockwerk</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Stockwerk" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0">Erdgeschoss</SelectItem>
                              <SelectItem value="1">1. Stock</SelectItem>
                              <SelectItem value="2">2. Stock</SelectItem>
                              <SelectItem value="3">3. Stock</SelectItem>
                              <SelectItem value="4">4. Stock</SelectItem>
                              <SelectItem value="5">5+ Stock</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="hasElevatorTo"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Lift vorhanden
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button 
                    type="submit" 
                    size="lg"
                    className="w-full h-14 text-lg bg-accent hover:bg-accent/90 shadow-strong group"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Berechne..." : "Jetzt kostenlos berechnen"}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    ✓ 100% kostenlos  ✓ Keine Anmeldung  ✓ Sofort Ergebnis
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};
