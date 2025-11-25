import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, CheckCircle2, TrendingDown, Calculator, Lock, Clock, Star, Shield, Award } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { PopularBadge } from "@/components/trust/PopularBadge";
import { calculatorApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  fromPostal: z.string().min(4, "Bitte gültige PLZ eingeben"),
  fromCity: z.string().min(2, "Bitte Ort eingeben"),
  toPostal: z.string().min(4, "Bitte gültige PLZ eingeben"),
  toCity: z.string().min(2, "Bitte Ort eingeben"),
  rooms: z.string().min(1, "Bitte Zimmerzahl wählen"),
  moveDate: z.string().optional(),
  floor: z.string().optional(),
});

const partnerLogos = [
  "Swiss Quality",
  "TrustPilot",
  "ISO 9001",
  "Handelsregister",
  "DSGVO zertifiziert",
  "Versichert"
];

export const Hero = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromPostal: "",
      fromCity: "",
      toPostal: "",
      toCity: "",
      rooms: "",
      moveDate: "",
      floor: "0",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      const requestData: any = {
        fromPostal: values.fromPostal,
        fromCity: values.fromCity,
        toPostal: values.toPostal,
        toCity: values.toCity,
        rooms: values.rooms,
        movingType: "local",
        floorsFrom: values.floor || "0",
        floorsTo: "0",
        hasElevatorFrom: false,
        hasElevatorTo: false,
      };

      const response = await calculatorApi.quick(requestData);
      
      if (response.error) {
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
      
      navigate("/rechner/ergebnis", { 
        state: { 
          calculatorData: values, 
          calculation: response.data,
          distance: response.data.distance,
          type: "quick" 
        } 
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten';
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
  <section className="relative overflow-hidden bg-gradient-to-br from-background via-secondary/20 to-background">
    {/* Subtle Background Effects */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
    </div>
      
    <div className="container mx-auto px-4 py-12 md:py-20 lg:py-24 relative z-10">
      <div className="grid lg:grid-cols-2 gap-12 items-start max-w-7xl mx-auto">
        {/* Left Column - Content */}
        <div className="space-y-6 lg:pr-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-success/10 border border-success/20 px-4 py-2 rounded-full text-sm font-medium text-success">
            <CheckCircle2 className="w-4 h-4" />
            <span>100% kostenlos & unverbindlich · In 2 Minuten zu 3–5 Offerten</span>
          </div>

          {/* H1 Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
            Ihren Umzug in der Schweiz in <span className="text-primary">60 Sekunden</span> vergleichen.
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Füllen Sie einmal Ihr Umzugsprofil aus und erhalten Sie in kurzer Zeit passende Angebote von geprüften Umzugsfirmen. Transparent, fair und ohne Telefon-Spam.
          </p>

          {/* 3-Column Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border shadow-soft">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                <TrendingDown className="w-5 h-5 text-success" />
              </div>
              <div>
                <div className="font-bold text-foreground mb-1">Bis zu 40% sparen</div>
                <div className="text-sm text-muted-foreground">Im Schnitt günstiger als Einzelanfragen</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border shadow-soft">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Star className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="font-bold text-foreground mb-1">4.8 / 5 Zufriedenheit</div>
                <div className="text-sm text-muted-foreground">Bewertet von echten Kundinnen & Kunden</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border shadow-soft">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-bold text-foreground mb-1">15'000+ Umzüge</div>
                <div className="text-sm text-muted-foreground">Vom Studio bis zum Einfamilienhaus</div>
              </div>
            </div>
          </div>

          {/* Two Main Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link to="/rechner" className="flex-1">
              <Button 
                size="lg" 
                className="w-full h-14 text-lg bg-primary hover:bg-primary/90 text-white group transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <Calculator className="mr-2 w-5 h-5" />
                <span>Umzugskosten berechnen</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/umzugsfirmen" className="flex-1">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full h-14 text-lg border-2 transition-all duration-300 hover:bg-secondary"
              >
                Umzugsfirmen vergleichen
              </Button>
            </Link>
          </div>

          {/* Small Text Under Buttons */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="w-4 h-4 text-success" />
            <span>Kostenlos & ohne Verpflichtung. Ihre Daten werden nur für Ihre Offerten-Anfrage verwendet.</span>
          </div>
        </div>

        {/* Right Column - Schnell-Rechner Card */}
        <div className="lg:ml-auto w-full">
          <div className="relative bg-card rounded-2xl shadow-strong border border-border p-6 md:p-8">
            {/* Badge in top-right corner */}
            <div className="absolute top-4 right-4">
              <PopularBadge variant="popular" />
            </div>

            {/* Card Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Schnell-Rechner</h3>
                </div>
              </div>
              <p className="text-muted-foreground">In 60 Sekunden zu Ihrer ersten Kostenschätzung.</p>
            </div>

            {/* Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="fromPostal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Von (PLZ)</FormLabel>
                        <FormControl>
                          <Input placeholder="8001" {...field} className="h-11" />
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
                        <FormLabel className="text-sm">Von (Ort)</FormLabel>
                        <FormControl>
                          <Input placeholder="Zürich" {...field} className="h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="toPostal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Nach (PLZ)</FormLabel>
                        <FormControl>
                          <Input placeholder="3000" {...field} className="h-11" />
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
                        <FormLabel className="text-sm">Nach (Ort)</FormLabel>
                        <FormControl>
                          <Input placeholder="Bern" {...field} className="h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="rooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Wohnungsgrösse</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Zimmer wählen" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-card z-50">
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
                  name="moveDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Umzugsdatum (optional)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} className="h-11" />
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
                      <FormLabel className="text-sm">Etage & Lift</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Auswählen" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-card z-50">
                          <SelectItem value="0">Erdgeschoss</SelectItem>
                          <SelectItem value="1">1. Stock mit Lift</SelectItem>
                          <SelectItem value="1-no">1. Stock ohne Lift</SelectItem>
                          <SelectItem value="2">2. Stock mit Lift</SelectItem>
                          <SelectItem value="2-no">2. Stock ohne Lift</SelectItem>
                          <SelectItem value="3">3. Stock mit Lift</SelectItem>
                          <SelectItem value="3-no">3. Stock ohne Lift</SelectItem>
                          <SelectItem value="4+">4+ Stock mit Lift</SelectItem>
                          <SelectItem value="4+-no">4+ Stock ohne Lift</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={isSubmitting}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold group"
                >
                  {isSubmitting ? "Wird berechnet..." : "Offerten vergleichen"}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>

                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Durchschnittliche Antwortzeit: 3–24 Stunden</span>
                </div>
              </form>
            </Form>

            {/* Live Activity Widget */}
            <div className="mt-4 p-3 rounded-lg bg-success/5 border border-success/20">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
                <span className="text-success font-semibold">LIVE</span>
                <span className="text-muted-foreground">· Soeben 4 Umzugsofferten für Zürich versendet · vor 3 Minuten</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Partner Logos Row */}
    <div className="border-t border-border bg-secondary/30 py-8">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-muted-foreground mb-6 font-medium">
          Bekannt aus & geprüft von:
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {partnerLogos.map((logo, index) => (
            <div 
              key={index}
              className="flex items-center justify-center px-4 py-2 text-muted-foreground/70 font-semibold text-sm grayscale opacity-60 hover:opacity-100 transition-opacity"
            >
              <Shield className="w-5 h-5 mr-2" />
              {logo}
            </div>
          ))}
        </div>
      </div>
    </div>
    </section>
  );
};
