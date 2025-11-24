import { Helmet } from "react-helmet";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Link } from "react-router-dom";
import { Trash2, ArrowLeft, Package } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { calculateDisposalPrice, DisposalCalculatorInput } from "@/lib/pricing";
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
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  volumeM3: z.number().min(1).max(50),
  distance: z.number().min(1).max(200),
  hasHazardous: z.boolean().default(false),
  hasElectronics: z.boolean().default(false),
  hasFurniture: z.boolean().default(false),
});

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Entsorgung & Räumung",
  "name": "Entsorgungsrechner - Entrümpelung Kosten berechnen",
  "description": "Berechnen Sie die Kosten für Entsorgung und Räumung. Geben Sie Volumen und Art der Gegenstände an für eine präzise Kostenschätzung.",
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
    "priceRange": "CHF 150-2000",
    "priceCurrency": "CHF"
  },
  "category": "Entsorgungsdienstleistungen",
  "serviceOutput": "Professionelle Entrümpelung und Entsorgung",
  "availableChannel": {
    "@type": "ServiceChannel",
    "serviceUrl": "https://umzugscheck.ch/entsorgungsrechner"
  }
};

const DisposalCalculator = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      volumeM3: 5,
      distance: 10,
      hasHazardous: false,
      hasElectronics: false,
      hasFurniture: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      const calculation = calculateDisposalPrice(values as DisposalCalculatorInput);
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
              calculatorType: 'disposal',
              disposalDetails: values,
            },
            estimate: {
              priceMin: calculation.priceRange.min,
              priceMax: calculation.priceRange.max,
              volumeM3: values.volumeM3,
              estimatedHours: 0,
              distance: values.distance,
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
      <Helmet>
        <title>Entsorgungsrechner - Entrümpelung Kosten berechnen | Umzugscheck.ch</title>
        <meta name="description" content="Berechnen Sie die Kosten für Entsorgung und Entrümpelung. Möbel, Elektronik, Sondermüll. ✓ Kostenlose Schätzung ✓ Transparente Preise" />
        <meta name="keywords" content="Entsorgungsrechner, Entrümpelung Kosten, Räumung Preis, Sperrmüll Entsorgung Schweiz" />
        <link rel="canonical" href="https://umzugscheck.ch/entsorgungsrechner" />
        
        <script type="application/ld+json">
          {JSON.stringify(SERVICE_SCHEMA)}
        </script>
      </Helmet>

      <Navigation />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <Link 
            to="/rechner"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zu allen Rechnern
          </Link>

          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-primary" />
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Entsorgungsrechner
              </h1>
              
              <p className="text-lg text-muted-foreground">
                Berechnen Sie Ihre Entsorgungskosten
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Form Card */}
              <Card className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Volume */}
                    <FormField
                      control={form.control}
                      name="volumeM3"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Volumen: {field.value} m³
                          </FormLabel>
                          <FormControl>
                            <Slider
                              min={1}
                              max={50}
                              step={1}
                              value={[field.value]}
                              onValueChange={(vals) => field.onChange(vals[0])}
                            />
                          </FormControl>
                          <p className="text-sm text-muted-foreground mt-2">
                            Geschätzte Menge an zu entsorgendem Material
                          </p>
                        </FormItem>
                      )}
                    />

                    {/* Distance */}
                    <FormField
                      control={form.control}
                      name="distance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Entfernung zur Deponie: {field.value} km</FormLabel>
                          <FormControl>
                            <Slider
                              min={1}
                              max={200}
                              step={5}
                              value={[field.value]}
                              onValueChange={(vals) => field.onChange(vals[0])}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Material Types */}
                    <div className="space-y-4">
                      <Label className="text-base font-semibold">Art des Entsorgungsguts</Label>
                      
                      <FormField
                        control={form.control}
                        name="hasFurniture"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Möbel & Sperrmüll
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="hasElectronics"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Elektronikgeräte
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="hasHazardous"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Sondermüll (Farben, Chemikalien)
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
              <Card className="p-6">
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
                        <span className="text-muted-foreground">Entsorgungsgebühr</span>
                        <span className="font-semibold">{formatCurrency(result.disposalFee)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center pb-3 border-b border-border">
                        <span className="text-muted-foreground">Transportkosten</span>
                        <span className="font-semibold">{formatCurrency(result.transportFee)}</span>
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">
                        💡 <strong>Tipp:</strong> Sortieren Sie vorgängig recycelbare Materialien aus. 
                        Das spart Kosten und schont die Umwelt.
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
                    <Trash2 className="w-16 h-16 text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Bereit für Ihre Kostenschätzung
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Füllen Sie das Formular aus und erhalten Sie sofort eine 
                      transparente Preisberechnung für Ihre Entsorgung.
                    </p>
                  </div>
                )}
              </Card>
            </div>

            {/* SEO Content */}
            <div className="mt-16 prose prose-slate max-w-none">
              <h2 className="text-2xl font-bold text-foreground mb-4">Professionelle Entsorgung beim Umzug</h2>
              
              <div className="grid md:grid-cols-2 gap-8 text-muted-foreground">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Umweltgerechte Entsorgung</h3>
                  <p className="mb-4">
                    Bei einem Umzug fallen oft Gegenstände an, die nicht mehr benötigt werden oder nicht mitgenommen 
                    werden können. Unsere Partner kümmern sich um die fachgerechte und umweltschonende Entsorgung 
                    aller Materialien gemäss den Schweizer Umweltvorschriften.
                  </p>
                  <p>
                    Von Möbeln über Elektrogeräte bis zu Sondermüll – wir organisieren die sachgemässe Entsorgung 
                    und das Recycling, wo immer möglich. So sparen Sie Zeit und leisten einen Beitrag zum Umweltschutz.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Unsere Entsorgungsleistungen</h3>
                  <ul className="space-y-2">
                    <li>✓ Möbelentsorgung & Sperrmüll</li>
                    <li>✓ Elektronikgeräte (E-Waste)</li>
                    <li>✓ Sondermüll & Chemikalien</li>
                    <li>✓ Entrümpelung von Kellern & Estrich</li>
                    <li>✓ Recycling-freundliche Sortierung</li>
                    <li>✓ Gesetzeskonforme Entsorgung</li>
                    <li>✓ Entsorgungsnachweise & Belege</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DisposalCalculator;
