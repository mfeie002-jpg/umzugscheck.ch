import { OptimizedSEO } from "@/components/OptimizedSEO";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { Sparkles, ArrowLeft, Home, Droplets, Square, Users } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { calculateCleaningPrice, CleaningCalculatorInput } from "@/lib/pricing";
import { formatCurrency } from "@/lib/pricing";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { OffertenCTA } from "@/components/OffertenCTA";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  cleaningType: z.enum(['end-of-lease', 'regular', 'deep-clean']),
  squareMeters: z.number().min(20).max(500),
  rooms: z.number().min(1).max(10),
  bathrooms: z.number().min(1).max(5),
  hasBalcony: z.boolean().default(false),
  hasWindows: z.boolean().default(false),
  hasOven: z.boolean().default(false),
  hasCarpets: z.boolean().default(false),
  hasStorage: z.boolean().default(false),
});

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Endreinigung-Rechner",
  "name": "Reinigungsrechner - Endreinigung Kosten berechnen",
  "description": "Berechnen Sie die Kosten für Ihre Wohnungsendreinigung. Geben Sie Quadratmeter, Zimmerzahl und zusätzliche Services an für eine präzise Kostenschätzung.",
  "provider": {
    "@type": "Organization",
    "name": "Umzugscheck.ch",
    "url": "https://umzugscheck.ch"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Switzerland"
  },
  "offers": {
    "@type": "Offer",
    "priceRange": "CHF 200-800",
    "priceCurrency": "CHF"
  },
  "category": "Reinigungsdienstleistungen",
  "serviceOutput": "Professionelle Endreinigung nach Umzug",
  "availableChannel": {
    "@type": "ServiceChannel",
    "serviceUrl": "https://umzugscheck.ch/reinigungsrechner"
  }
};

const CleaningCalculator = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cleaningType: 'end-of-lease',
      squareMeters: 80,
      rooms: 3,
      bathrooms: 1,
      hasBalcony: false,
      hasWindows: false,
      hasOven: false,
      hasCarpets: false,
      hasStorage: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      const calculation = calculateCleaningPrice(values as CleaningCalculatorInput);
      setResult(calculation);
      
      // Create estimate session for funnel
      const { data: sessionData, error: sessionError } = await supabase.functions.invoke(
        'create-estimate-session',
        {
          body: {
            moveDetails: {
              fromPostal: '8000',
              fromCity: 'Zürich',
              toPostal: '8000',
              toCity: 'Zürich',
              calculatorType: 'cleaning',
              cleaningDetails: values,
            },
            estimate: {
              priceMin: calculation.priceRange.min,
              priceMax: calculation.priceRange.max,
              volumeM3: values.squareMeters,
              estimatedHours: calculation.estimatedHours,
              distance: 0,
            },
          },
        }
      );

      if (!sessionError && sessionData?.success) {
        // Navigate to funnel after short delay to show result
        setTimeout(() => {
          navigate(`/ergebnis/${sessionData.data.id}`);
        }, 1500);
        
        toast.success("Kostenschätzung berechnet!");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Fehler bei der Berechnung");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-light flex flex-col">
      <OptimizedSEO
        title="Reinigungsrechner - Endreinigung Kosten berechnen"
        description="Berechnen Sie die Kosten für Ihre Wohnungsendreinigung. Endreinigung, normale Reinigung oder Tiefenreinigung. ✓ Kostenlose Schätzung ✓ Sofort Ergebnis"
        keywords="Reinigungsrechner, Endreinigung Kosten, Wohnungsreinigung Preis, Umzugsreinigung Schweiz"
        canonicalUrl="https://umzugscheck.ch/reinigungsrechner"
        schemaMarkup={SERVICE_SCHEMA}
      />

      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="gradient-hero text-white py-12 md:py-16">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="max-w-3xl mx-auto text-center">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  Reinigungsrechner
                </h1>
                <p className="text-lg md:text-xl text-white/90">
                  Berechnen Sie die Kosten für Ihre Endreinigung in wenigen Klicks
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8 md:py-12">
          <Link 
            to="/rechner"
            className="inline-flex items-center gap-2 text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zu allen Rechnern
          </Link>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Form Card */}
              <Card variant="elevated" className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                    {/* Cleaning Type */}
                    <FormField
                      control={form.control}
                      name="cleaningType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Art der Reinigung</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="end-of-lease">Endreinigung (Auszug)</SelectItem>
                              <SelectItem value="deep-clean">Grundreinigung</SelectItem>
                              <SelectItem value="regular">Unterhaltsreinigung</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Square Meters */}
                    <FormField
                      control={form.control}
                      name="squareMeters"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Square className="w-4 h-4" />
                            Wohnfläche: {field.value} m²
                          </FormLabel>
                          <FormControl>
                            <Slider
                              min={20}
                              max={500}
                              step={10}
                              value={[field.value]}
                              onValueChange={(vals) => field.onChange(vals[0])}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Rooms */}
                    <FormField
                      control={form.control}
                      name="rooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Home className="w-4 h-4" />
                            Anzahl Zimmer: {field.value}
                          </FormLabel>
                          <FormControl>
                            <Slider
                              min={1}
                              max={10}
                              step={1}
                              value={[field.value]}
                              onValueChange={(vals) => field.onChange(vals[0])}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Bathrooms */}
                    <FormField
                      control={form.control}
                      name="bathrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Droplets className="w-4 h-4" />
                            Anzahl Badezimmer: {field.value}
                          </FormLabel>
                          <FormControl>
                            <Slider
                              min={1}
                              max={5}
                              step={1}
                              value={[field.value]}
                              onValueChange={(vals) => field.onChange(vals[0])}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Additional Services */}
                    <div className="space-y-4">
                      <Label className="text-base font-semibold">Zusätzliche Services</Label>
                      
                      <FormField
                        control={form.control}
                        name="hasWindows"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Fensterreinigung
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="hasOven"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Ofenreinigung
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="hasBalcony"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Balkon/Terrasse
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="hasCarpets"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Teppichreinigung
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="hasStorage"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Keller/Estrich
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit" className="w-full text-sm sm:text-base" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? "Berechne..." : "Preis berechnen"}
                    </Button>
                  </form>
                </Form>
              </Card>

              {/* Results Card */}
              <Card variant="elevated" className="p-6">
                {result ? (
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                        Ihre Kostenschätzung
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Basierend auf Ihren Angaben
                      </p>
                    </div>

                    <div className="bg-primary/10 rounded-xl p-4 sm:p-6 text-center">
                      <div className="text-xs sm:text-sm text-muted-foreground mb-2">Geschätzter Preis</div>
                      <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">
                        {formatCurrency(result.totalPrice)}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        {formatCurrency(result.priceRange.min)} - {formatCurrency(result.priceRange.max)}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b border-border">
                        <span className="text-muted-foreground">Basispreis</span>
                        <span className="font-semibold">{formatCurrency(result.basePrice)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center pb-3 border-b border-border">
                        <span className="text-muted-foreground">Zusätzliche Services</span>
                        <span className="font-semibold">{formatCurrency(result.servicesPrice)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center pb-3 border-b border-border">
                        <span className="text-muted-foreground">Geschätzte Dauer</span>
                        <span className="font-semibold">{result.estimatedHours}h</span>
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">
                        💡 <strong>Tipp:</strong> Die Endreinigung ist bei Wohnungswechsel Pflicht. 
                        Professionelle Reinigung sichert Ihre Kaution.
                      </p>
                    </div>

                    <Link to="/kontakt">
                      <Button className="w-full" size="lg">
                        Offerte anfragen
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <Sparkles className="w-16 h-16 text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Bereit für Ihre Kostenschätzung
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Füllen Sie das Formular aus und erhalten Sie sofort eine 
                      transparente Preisberechnung für Ihre Reinigung.
                    </p>
                  </div>
                )}
              </Card>
            </div>

            {/* SEO Content */}
            <div className="mt-16 prose prose-slate max-w-none">
              <h2 className="text-2xl font-bold text-foreground mb-4">Endreinigung beim Umzug in der Schweiz</h2>
              
              <div className="grid md:grid-cols-2 gap-8 text-muted-foreground">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Warum professionelle Endreinigung?</h3>
                  <p className="mb-4">
                    Die Endreinigung ist bei einem Wohnungswechsel in der Schweiz Pflicht und entscheidend für die 
                    Rückerstattung Ihrer Mietkaution. Eine professionelle Reinigung garantiert, dass alle Räume, 
                    Böden, Fenster und sanitären Anlagen dem geforderten Standard entsprechen.
                  </p>
                  <p>
                    Unsere Partner kennen die Anforderungen der Vermieter und Verwaltungen genau. Mit professionellem 
                    Equipment und Erfahrung sorgen sie dafür, dass Ihre Wohnung abnahmebereit ist.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Unsere Reinigungsleistungen</h3>
                  <ul className="space-y-2">
                    <li>✓ Komplette Wohnungsreinigung nach Standard</li>
                    <li>✓ Fensterreinigung innen & aussen</li>
                    <li>✓ Küchen- und Ofenreinigung</li>
                    <li>✓ Bad- und WC-Reinigung</li>
                    <li>✓ Boden- und Teppichreinigung</li>
                    <li>✓ Balkon- und Kellerreinigung</li>
                    <li>✓ Abnahmegarantie</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Offerten CTA */}
            <div className="mt-12">
              <OffertenCTA 
                title="Reinigung & Umzug kombinieren?"
                description="Planen Sie einen Umzug und benötigen auch eine Endreinigung? Holen Sie sich kombinierte Offerten für beide Services."
                buttonText="Kombinierte Offerten erhalten"
                buttonLink="/umzugsofferten"
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CleaningCalculator;
