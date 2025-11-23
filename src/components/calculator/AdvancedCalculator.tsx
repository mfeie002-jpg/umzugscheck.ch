import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, MapPin, Home, Package, Calendar as CalendarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  fromPostal: z.string().min(4),
  fromCity: z.string().min(2),
  toPostal: z.string().min(4),
  toCity: z.string().min(2),
  rooms: z.string().min(1),
  livingArea: z.string().min(1),
  floor: z.string().min(1),
  elevator: z.string().min(1),
  movingDate: z.date({
    required_error: "Bitte Datum wählen",
  }),
  packing: z.boolean().default(false),
  mounting: z.boolean().default(false),
  cleaning: z.boolean().default(false),
  disposal: z.boolean().default(false),
  storage: z.boolean().default(false),
  piano: z.boolean().default(false),
  heavyItems: z.string().optional(),
});

export const AdvancedCalculator = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromPostal: "",
      fromCity: "",
      toPostal: "",
      toCity: "",
      rooms: "",
      livingArea: "",
      floor: "",
      elevator: "no",
      packing: false,
      mounting: false,
      cleaning: false,
      disposal: false,
      storage: false,
      piano: false,
      heavyItems: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    navigate("/rechner/ergebnis", { state: { calculatorData: values, type: "advanced" } });
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
                Wohnungsdetails
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="rooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zimmerzahl</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Wählen" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1 Zimmer</SelectItem>
                          <SelectItem value="2">2 Zimmer</SelectItem>
                          <SelectItem value="3">3 Zimmer</SelectItem>
                          <SelectItem value="4">4 Zimmer</SelectItem>
                          <SelectItem value="5">5 Zimmer</SelectItem>
                          <SelectItem value="6+">6+ Zimmer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="livingArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wohnfläche (m²)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="z.B. 85" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="floor"
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
                          <SelectItem value="ground">Erdgeschoss</SelectItem>
                          <SelectItem value="1">1. Stock</SelectItem>
                          <SelectItem value="2">2. Stock</SelectItem>
                          <SelectItem value="3">3. Stock</SelectItem>
                          <SelectItem value="4">4. Stock</SelectItem>
                          <SelectItem value="5+">5+ Stock</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="elevator"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lift vorhanden?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wählen" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="no">Nein</SelectItem>
                        <SelectItem value="yes">Ja</SelectItem>
                        <SelectItem value="partial">Teilweise (nur Auszug oder Einzug)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                  name="mounting"
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

                <FormField
                  control={form.control}
                  name="piano"
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
                          Klavier/Flügel
                        </FormLabel>
                        <FormDescription>
                          Spezialtransport für Klavier
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Heavy Items */}
            <FormField
              control={form.control}
              name="heavyItems"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Besondere Gegenstände</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="z.B. Tresor, Aquarium, Kunstwerke..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Listen Sie schwere oder empfindliche Gegenstände auf
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
