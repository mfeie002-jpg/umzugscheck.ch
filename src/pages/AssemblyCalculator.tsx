import { Helmet } from "react-helmet";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Wrench, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { calculateAssemblyPrice, AssemblyCalculatorInput } from "@/lib/pricing";
import { formatCurrency } from "@/lib/pricing";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  furnitureItems: z.object({
    beds: z.number().min(0).max(20),
    wardrobes: z.number().min(0).max(20),
    shelves: z.number().min(0).max(50),
    tables: z.number().min(0).max(20),
    chairs: z.number().min(0).max(50),
    kitchen: z.number().min(0).max(10),
  }),
  hasComplexItems: z.boolean().default(false),
});

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Möbelmontage",
  "name": "Möbelmontage-Rechner - Montage Kosten berechnen",
  "description": "Berechnen Sie die Kosten für Möbelmontage und -demontage. Betten, Schränke, Regale, Küchen und mehr. Professionelle Monteure für Ihren Umzug.",
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
    "priceRange": "CHF 150-1200",
    "priceCurrency": "CHF"
  },
  "category": "Möbelmontage",
  "serviceOutput": "Professionelle Möbelmontage und -demontage",
  "availableChannel": {
    "@type": "ServiceChannel",
    "serviceUrl": "https://umzugscheck.ch/montage-rechner"
  }
};

const AssemblyCalculator = () => {
  const [result, setResult] = useState<any>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      furnitureItems: {
        beds: 0,
        wardrobes: 0,
        shelves: 0,
        tables: 0,
        chairs: 0,
        kitchen: 0,
      },
      hasComplexItems: false,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const calculation = calculateAssemblyPrice(values as AssemblyCalculatorInput);
    setResult(calculation);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Möbelmontage-Rechner - Montage Kosten berechnen | Umzugscheck.ch</title>
        <meta name="description" content="Berechnen Sie die Kosten für Möbelmontage und -demontage. Betten, Schränke, Regale, Küchen. ✓ Professionelle Monteure ✓ Faire Preise" />
        <meta name="keywords" content="Möbelmontage Rechner, Montage Kosten, Möbeldemontage Schweiz, Küchenmontage Preis" />
        <link rel="canonical" href="https://umzugscheck.ch/montage-rechner" />
        
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
                <Wrench className="w-8 h-8 text-primary" />
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Möbelmontage-Rechner
              </h1>
              
              <p className="text-lg text-muted-foreground">
                Berechnen Sie Ihre Montagekosten
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Form Card */}
              <Card className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <Label className="text-base font-semibold">Möbelstücke zur Montage</Label>
                      
                      <FormField
                        control={form.control}
                        name="furnitureItems.beds"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Betten</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="furnitureItems.wardrobes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Schränke</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="furnitureItems.shelves"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Regale</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="furnitureItems.tables"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tische</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="furnitureItems.chairs"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stühle</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="furnitureItems.kitchen"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Küchenmöbel / Einbauschränke</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="hasComplexItems"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Komplexe Möbel (z.B. Designer-Möbel, Spezialanfertigungen)
                          </FormLabel>
                        </FormItem>
                      )}
                    />

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
                        💡 <strong>Tipp:</strong> Professionelle Montage garantiert fachgerechten Aufbau. 
                        Werkzeug und Material sind inklusive.
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
                    <Wrench className="w-16 h-16 text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Bereit für Ihre Kostenschätzung
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Geben Sie die Anzahl der zu montierenden Möbelstücke ein und 
                      erhalten Sie eine transparente Preisberechnung.
                    </p>
                  </div>
                )}
              </Card>
            </div>

            {/* SEO Content */}
            <div className="mt-16 prose prose-slate max-w-none">
              <h2 className="text-2xl font-bold text-foreground mb-4">Professionelle Möbelmontage beim Umzug</h2>
              
              <div className="grid md:grid-cols-2 gap-8 text-muted-foreground">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Stressfrei montieren lassen</h3>
                  <p className="mb-4">
                    Nach einem anstrengenden Umzug noch Möbel aufbauen? Unsere erfahrenen Monteure übernehmen 
                    diese Aufgabe für Sie. Mit professionellem Werkzeug und Know-how werden Ihre Möbel fachgerecht 
                    und sicher montiert – egal ob IKEA-Möbel oder hochwertige Designer-Stücke.
                  </p>
                  <p>
                    Sparen Sie Zeit und Nerven. Unsere Monteure kennen sich mit allen gängigen Möbelsystemen aus 
                    und sorgen für einen stabilen und dauerhaften Aufbau nach Herstellervorgaben.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Unsere Montageleistungen</h3>
                  <ul className="space-y-2">
                    <li>✓ Aufbau aller Möbeltypen</li>
                    <li>✓ Demontage beim Auszug</li>
                    <li>✓ Küchenmontage</li>
                    <li>✓ Einbauschränke & Schiebesysteme</li>
                    <li>✓ TV-Wandmontage & Regalsysteme</li>
                    <li>✓ Lampenmontage</li>
                    <li>✓ Fachgerecht nach Herstellervorgaben</li>
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

export default AssemblyCalculator;
