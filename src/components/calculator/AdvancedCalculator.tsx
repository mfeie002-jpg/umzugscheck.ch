import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, MapPin, Home, Package, Calendar as CalendarIcon, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { calculatorApi } from "@/lib/api";
import { useAnalytics } from "@/lib/analytics";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  fromPostal: z.string().min(4),
  fromCity: z.string().min(2),
  toPostal: z.string().min(4),
  toCity: z.string().min(2),
  floorsFrom: z.string().min(1),
  floorsTo: z.string().min(1),
  elevatorFrom: z.boolean().default(false),
  elevatorTo: z.boolean().default(false),
  boxes: z.string().min(1),
  wardrobes: z.string().min(1),
  beds: z.string().min(1),
  sofas: z.string().min(1),
  tables: z.string().min(1),
  chairs: z.string().min(1),
  movingDate: z.date({
    required_error: "Bitte Datum wählen",
  }),
  packing: z.boolean().default(false),
  assembly: z.boolean().default(false),
  cleaning: z.boolean().default(false),
  disposal: z.boolean().default(false),
  storage: z.boolean().default(false),
  specialItems: z.boolean().default(false),
});

export const AdvancedCalculator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const analytics = useAnalytics();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    analytics.trackCalculatorStarted('advanced');
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromPostal: "",
      fromCity: "",
      toPostal: "",
      toCity: "",
      floorsFrom: "0",
      floorsTo: "0",
      elevatorFrom: false,
      elevatorTo: false,
      boxes: "0",
      wardrobes: "0",
      beds: "0",
      sofas: "0",
      tables: "0",
      chairs: "0",
      packing: false,
      assembly: false,
      cleaning: false,
      disposal: false,
      storage: false,
      specialItems: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Prepare data for API
      const requestData: any = {
        fromPostal: values.fromPostal,
        fromCity: values.fromCity,
        toPostal: values.toPostal,
        toCity: values.toCity,
        rooms: "3", // Default for advanced
        movingType: "local",
        floorsFrom: values.floorsFrom,
        floorsTo: values.floorsTo,
        hasElevatorFrom: values.elevatorFrom,
        hasElevatorTo: values.elevatorTo,
        inventory: {
          boxes: parseInt(values.boxes),
          wardrobes: parseInt(values.wardrobes),
          beds: parseInt(values.beds),
          sofas: parseInt(values.sofas),
          tables: parseInt(values.tables),
          chairs: parseInt(values.chairs),
        },
        extraServices: {
          cleaning: values.cleaning,
          disposal: values.disposal,
          packing: values.packing,
          storage: values.storage,
          assembly: values.assembly,
          specialItems: values.specialItems,
        },
        movingDate: format(values.movingDate, "yyyy-MM-dd"),
      };

      const response = await calculatorApi.advanced(requestData);
      
      if (response.error) {
        setError(response.error);
        analytics.trackError('calculator_api_error', { 
          calculator_type: 'advanced',
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

      analytics.trackCalculatorCompleted('advanced', response.data);
      
      navigate("/rechner/ergebnis", { 
        state: { 
          calculatorData: values, 
          calculation: response.data,
          type: "advanced" 
        } 
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Ein unerwarteter Fehler ist aufgetreten';
      setError(errorMsg);
      analytics.trackError('calculator_error', { 
        calculator_type: 'advanced',
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
    <Card className="shadow-strong">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-6 h-6 text-primary" />
          Detaillierter Rechner
        </CardTitle>
        <CardDescription>
          Präzise Kalkulation mit allen Details für eine genaue Offerte.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Locations */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <MapPin className="w-4 h-4" />
                Umzugsorte
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Von</h4>
                  <div className="space-y-3">
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

                <div className="space-y-4">
                  <h4 className="font-medium">Nach</h4>
                  <div className="space-y-3">
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
              </div>
            </div>

            {/* Property Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Home className="w-4 h-4" />
                Stockwerk & Lift
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Auszugsadresse</h4>
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="floorsFrom"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stockwerk</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Wählen" />
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
                      name="elevatorFrom"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="cursor-pointer">
                              Lift vorhanden
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Einzugsadresse</h4>
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="floorsTo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stockwerk</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Wählen" />
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
                      name="elevatorTo"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="cursor-pointer">
                              Lift vorhanden
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Package className="w-4 h-4" />
                Inventar
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="boxes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Umzugskartons</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="wardrobes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kleiderschränke</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="beds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Betten</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sofas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sofas</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tables"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tische</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="chairs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stühle</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Moving Date */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <CalendarIcon className="w-4 h-4" />
                Umzugsdatum
              </div>
              <FormField
                control={form.control}
                name="movingDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Gewünschtes Datum</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full md:w-[300px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd.MM.yyyy")
                            ) : (
                              <span>Datum wählen</span>
                            )}
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
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Flexibel? Geben Sie einen ungefähren Zeitraum an.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Additional Services */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Package className="w-4 h-4" />
                Zusätzliche Services
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="packing"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="cursor-pointer">
                          Packservice
                        </FormLabel>
                        <FormDescription>
                          Professionelles Ein- und Auspacken
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assembly"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="cursor-pointer">
                          Montageservice
                        </FormLabel>
                        <FormDescription>
                          Möbel ab- und aufbauen
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cleaning"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="cursor-pointer">
                          Endreinigung
                        </FormLabel>
                        <FormDescription>
                          Professionelle Wohnungsreinigung
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="disposal"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="cursor-pointer">
                          Entsorgung
                        </FormLabel>
                        <FormDescription>
                          Möbel und Sperrgut entsorgen
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="storage"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="cursor-pointer">
                          Zwischenlagerung
                        </FormLabel>
                        <FormDescription>
                          Möbel temporär einlagern
                        </FormDescription>
                      </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 shadow-medium group" 
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Wird berechnet..." : "Präzise Offerten erhalten"}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
