import { OptimizedSEO } from "@/components/OptimizedSEO";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Link } from "react-router-dom";
import { Package, ArrowLeft, Home } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { calculatePackingPrice, PackingCalculatorInput } from "@/lib/pricing";
import { formatCurrency } from "@/lib/pricing";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { OffertenCTA } from "@/components/OffertenCTA";

const formSchema = z.object({
  rooms: z.number().min(1).max(10),
  packingLevel: z.enum(['partial', 'full']),
  hasFragileItems: z.boolean().default(false),
  hasArtwork: z.boolean().default(false),
});

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Packservice",
  "name": "Packservice-Rechner - Verpackung Kosten berechnen",
  "description": "Berechnen Sie die Kosten für professionellen Packservice. Teil- oder Vollservice, Schutz für fragile Gegenstände und Kunstwerke.",
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
    "priceRange": "CHF 200-1500",
    "priceCurrency": "CHF"
  },
  "category": "Packservice",
  "serviceOutput": "Professionelle Verpackung von Hausrat",
  "availableChannel": {
    "@type": "ServiceChannel",
    "serviceUrl": "https://umzugscheck.ch/packservice-rechner"
  }
};

const PackingCalculator = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rooms: 3,
      packingLevel: 'full',
      hasFragileItems: false,
      hasArtwork: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      const calculation = calculatePackingPrice(values as PackingCalculatorInput);
      setResult(calculation);
      
      // Create estimate session
      const { data: sessionData, error: sessionError } = await supabase.functions.invoke(
        'create-estimate-session',
        {
          body: {
            moveDetails: {
              fromPostal: '8000',
              fromCity: 'Zürich',
              toPostal: '8000',
              toCity: 'Zürich',
              calculatorType: 'packing',
              packingDetails: values,
            },
            estimate: {
              priceMin: calculation.priceRange.min,
              priceMax: calculation.priceRange.max,
              volumeM3: values.rooms * 15, // Rough estimate
              estimatedHours: calculation.estimatedHours,
              distance: 0,
            },
          },
        }
      );

      if (!sessionError && sessionData?.success) {
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
    <div className="min-h-screen bg-background flex flex-col">
      <OptimizedSEO
        title="Packservice-Rechner - Verpackung Kosten berechnen"
        description="Berechnen Sie die Kosten für professionellen Packservice. Teil- oder Vollservice, Schutz für fragile Gegenstände. ✓ Kostenlose Schätzung ✓ Sicherer Transport"
        canonicalUrl="https://umzugscheck.ch/packservice-rechner"
        keywords="Packservice Rechner, Verpackung Kosten, Umzugskartons Schweiz, Packservice Preis"
        schemaMarkup={SERVICE_SCHEMA}
      />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 sm:py-8 md:py-16">
          <Link 
            to="/umzugsofferten"
            className="inline-flex items-center gap-2 text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors mb-6 sm:mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zu allen Rechnern
          </Link>

          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Package className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3 px-4">
                Packservice-Rechner
              </h1>
              
              <p className="text-base sm:text-lg text-muted-foreground px-4">
                Berechnen Sie Ihre Packservice-Kosten
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Form Card */}
              <Card className="p-4 sm:p-6" variant="elevated">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        </FormItem>
                      )}
                    />

                    {/* Packing Level */}
                    <FormField
                      control={form.control}
                      name="packingLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Packservice-Umfang</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="full">Komplettservice (alle Räume)</SelectItem>
                              <SelectItem value="partial">Teilservice (nur bestimmte Bereiche)</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-sm text-muted-foreground mt-2">
                            {field.value === 'full' 
                              ? 'Wir packen und beschriften alle Gegenstände'
                              : 'Sie packen selbst, wir packen nur ausgewählte Bereiche'}
                          </p>
                        </FormItem>
                      )}
                    />

                    {/* Special Items */}
                    <div className="space-y-4">
                      <Label className="text-base font-semibold">Besondere Gegenstände</Label>
                      
                      <FormField
                        control={form.control}
                        name="hasFragileItems"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Zerbrechliche Gegenstände (Glas, Porzellan)
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="hasArtwork"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Kunstwerke oder wertvolle Gegenstände
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      Preis berechnen
                    </Button>
                  </form>
                </Form>
              </Card>

              {/* Results Card */}
              <Card className="p-6" variant="elevated">
                {result ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        Ihre Kostenschätzung
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Basierend auf Ihren Angaben
                      </p>
                    </div>

                    <div className="bg-primary/10 rounded-xl p-6 text-center">
                      <div className="text-sm text-muted-foreground mb-2">Geschätzter Preis</div>
                      <div className="text-4xl font-bold text-primary mb-1">
                        {formatCurrency(result.totalPrice)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(result.priceRange.min)} - {formatCurrency(result.priceRange.max)}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b border-border">
                        <span className="text-muted-foreground">Materialkosten</span>
                        <span className="font-semibold">{formatCurrency(result.materialCost)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center pb-3 border-b border-border">
                        <span className="text-muted-foreground">Arbeitskosten</span>
                        <span className="font-semibold">{formatCurrency(result.laborCost)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center pb-3 border-b border-border">
                        <span className="text-muted-foreground">Geschätzte Dauer</span>
                        <span className="font-semibold">{result.estimatedHours}h</span>
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">
                        💡 <strong>Tipp:</strong> Professionelles Packen spart Zeit und schützt Ihre Gegenstände. 
                        Alle Materialien und Versicherung inklusive.
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
                    <Package className="w-16 h-16 text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Bereit für Ihre Kostenschätzung
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Füllen Sie das Formular aus und erhalten Sie sofort eine 
                      transparente Preisberechnung für Ihren Packservice.
                    </p>
                  </div>
                )}
              </Card>
            </div>

            {/* SEO Content */}
            <div className="mt-16 prose prose-slate max-w-none">
              <h2 className="text-2xl font-bold text-foreground mb-4">Professioneller Packservice für Ihren Umzug</h2>
              
              <div className="grid md:grid-cols-2 gap-8 text-muted-foreground">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Warum professionelles Packen?</h3>
                  <p className="mb-4">
                    Das Packen ist oft der zeitaufwendigste Teil eines Umzugs. Unsere professionellen Packteams 
                    bringen Erfahrung, Effizienz und das richtige Material mit. So wird Ihr Hab und Gut optimal 
                    geschützt und der Umzug läuft reibungslos ab.
                  </p>
                  <p>
                    Mit speziellen Techniken für zerbrechliche und wertvolle Gegenstände sorgen wir dafür, dass 
                    alles sicher am Zielort ankommt. Alle Kartons werden beschriftet für einfaches Auspacken.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Unsere Packservices</h3>
                  <ul className="space-y-2">
                    <li>✓ Komplettservice oder Teilservice</li>
                    <li>✓ Hochwertiges Verpackungsmaterial inklusive</li>
                    <li>✓ Spezialverpackung für Empfindliches</li>
                    <li>✓ Beschriftung aller Kartons</li>
                    <li>✓ Möbelschutz & Polsterung</li>
                    <li>✓ Demontage & Montage auf Wunsch</li>
                    <li>✓ Auspackservice am Zielort verfügbar</li>
                  </ul>
              </div>
            </div>

            {/* Offerten CTA */}
            <div className="mt-12">
              <OffertenCTA 
                title="Umzug mit Packservice kombinieren?"
                description="Sparen Sie Zeit und Stress – lassen Sie Profis packen. Holen Sie sich kombinierte Offerten für Umzug und Verpackung."
                buttonText="Kombinierte Offerten anfordern"
                buttonLink="/umzugsofferten"
              />
            </div>
          </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PackingCalculator;
