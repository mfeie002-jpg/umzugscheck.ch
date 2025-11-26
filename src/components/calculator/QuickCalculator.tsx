import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, MapPin, Home, CheckCircle2, AlertCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { calculatorApi } from "@/lib/api";
import { useAnalytics } from "@/lib/analytics";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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

const parseAddress = (address: string): { postal: string; city: string } => {
  const match = address.match(/^(\d{4,5})\s+(.+)$/);
  if (match) {
    return { postal: match[1], city: match[2] };
  }
  return { postal: "", city: address };
};

export const QuickCalculator = ({ embedded = false }: { embedded?: boolean }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const analytics = useAnalytics();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fromParam = searchParams.get("from") || "";
  const toParam = searchParams.get("to") || "";
  const fromAddress = parseAddress(fromParam);
  const toAddress = parseAddress(toParam);

  useEffect(() => {
    analytics.trackCalculatorStarted('quick');
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromPostal: fromAddress.postal,
      fromCity: fromAddress.city,
      toPostal: toAddress.postal,
      toCity: toAddress.city,
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
      // Call API with properly typed data
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

      // Track completion
      analytics.trackCalculatorCompleted('quick', response.data);
      
      // Create estimate session
      const { data: sessionData, error: sessionError } = await supabase.functions.invoke(
        'create-estimate-session',
        {
          body: {
            moveDetails: values,
            estimate: response.data,
          },
        }
      );

      if (sessionError || !sessionData?.success) {
        throw new Error(sessionData?.error?.message || 'Failed to create estimate session');
      }

      // Navigate to new result page
      navigate(`/ergebnis/${sessionData.data.id}`);
      
      toast({
        title: "Erfolg",
        description: "Kostenschätzung erfolgreich berechnet!",
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

  if (embedded) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-strong p-4 sm:p-6 md:p-8 text-foreground">
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2">Schnell-Rechner</h3>
            <p className="text-sm sm:text-base text-muted-foreground">Erhalten Sie in 60 Sekunden eine präzise Kostenschätzung</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <FormField
                control={form.control}
                name="fromPostal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Von (PLZ)</FormLabel>
                    <FormControl>
                      <Input placeholder="z.B. 8001" {...field} className="h-11" />
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
                    <FormLabel className="text-sm font-medium">Von (Ort)</FormLabel>
                    <FormControl>
                      <Input placeholder="z.B. Zürich" {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="toPostal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Nach (PLZ)</FormLabel>
                    <FormControl>
                      <Input placeholder="z.B. 3000" {...field} className="h-11" />
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
                    <FormLabel className="text-sm font-medium">Nach (Ort)</FormLabel>
                    <FormControl>
                      <Input placeholder="z.B. Bern" {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Wohnungsgrösse</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Wählen" />
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

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 shadow-medium group h-11 sm:h-12 text-sm sm:text-base"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Berechnen..." : "Offerten vergleichen"}
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </Form>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground pt-2 border-t">
            <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
            <span>Keine Kreditkarte erforderlich</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="shadow-strong">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="w-6 h-6 text-primary" />
          Schnell-Rechner
        </CardTitle>
        <CardDescription>
          Grundlegende Angaben für eine erste Kostenschätzung. Dauert nur 60 Sekunden.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* From Location */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <MapPin className="w-4 h-4" />
                Von (Aktueller Wohnort)
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fromPostal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PLZ</FormLabel>
                      <FormControl>
                        <Input placeholder="z.B. 8001" {...field} />
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
                        <Input placeholder="z.B. Zürich" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* To Location */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <MapPin className="w-4 h-4" />
                Nach (Neuer Wohnort)
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="toPostal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PLZ</FormLabel>
                      <FormControl>
                        <Input placeholder="z.B. 3000" {...field} />
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
                        <Input placeholder="z.B. Bern" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Rooms & Type */}
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="rooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wohnungsgrösse</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
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

            {/* Floors and Elevator */}
            <div className="space-y-4">
              <div className="text-sm font-semibold text-muted-foreground">Stockwerke & Lift</div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="floorsFrom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stockwerk (von)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
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

                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="floorsTo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stockwerk (nach)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
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
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 shadow-medium group" 
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Wird berechnet..." : "Kostenschätzung erhalten"}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
