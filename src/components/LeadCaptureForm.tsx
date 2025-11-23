import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowRight, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { MovingCalculation } from "@/lib/pricing";

const formSchema = z.object({
  name: z.string().min(2, "Name muss mindestens 2 Zeichen lang sein").max(100),
  email: z.string().email("Bitte gültige E-Mail-Adresse eingeben").max(255),
  phone: z.string().min(10, "Bitte gültige Telefonnummer eingeben").max(20),
  moveDate: z.date({
    required_error: "Bitte Umzugsdatum wählen",
  }),
  comments: z.string().max(1000).optional(),
});

interface LeadCaptureFormProps {
  calculatorData: any;
  calculation: MovingCalculation;
  distance: number;
  calculatorType: "quick" | "advanced" | "ai";
  onSuccess?: () => void;
}

export const LeadCaptureForm = ({
  calculatorData,
  calculation,
  distance,
  calculatorType,
  onSuccess,
}: LeadCaptureFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
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

      toast({
        title: "Anfrage erfolgreich gesendet!",
        description: "Wir leiten Ihre Anfrage an passende Umzugsfirmen weiter.",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting lead:", error);
      toast({
        title: "Fehler beim Senden",
        description: "Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="shadow-strong border-success/20 bg-success-light">
        <CardContent className="pt-12 pb-12 text-center">
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-success" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Vielen Dank!</h3>
              <p className="text-muted-foreground max-w-md">
                Ihre Anfrage wurde erfolgreich übermittelt. Sie erhalten in Kürze Offerten von geprüften
                Umzugsfirmen direkt per E-Mail.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>Antwortzeit: Normalerweise innerhalb 24 Stunden</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-strong">
      <CardHeader>
        <CardTitle>Kostenlose Offerten erhalten</CardTitle>
        <CardDescription>
          Füllen Sie das Formular aus und erhalten Sie bis zu 5 unverbindliche Angebote von geprüften
          Umzugsfirmen.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vor- und Nachname *</FormLabel>
                    <FormControl>
                      <Input placeholder="Max Mustermann" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-Mail-Adresse *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="max@beispiel.ch" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefonnummer *</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="+41 79 123 45 67" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="moveDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Umzugsdatum *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-secondary/30 rounded-lg p-4 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">100% kostenlos & unverbindlich</p>
                  <p className="text-muted-foreground text-xs">
                    Ihre Daten werden vertraulich behandelt und nur an geprüfte Umzugsfirmen weitergeleitet.
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 shadow-accent group"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Wird gesendet..." : "Jetzt Offerten anfordern"}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
