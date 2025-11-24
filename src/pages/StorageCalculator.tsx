import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Link } from "react-router-dom";
import { Package, ArrowLeft, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { calculateStoragePrice, StorageCalculatorInput } from "@/lib/pricing";
import { formatCurrency } from "@/lib/pricing";
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

const formSchema = z.object({
  volumeM3: z.number().min(1).max(100),
  duration: z.number().min(1).max(24),
  climateControlled: z.boolean().default(false),
  insurance: z.boolean().default(false),
  accessFrequency: z.enum(['rare', 'monthly', 'weekly']),
});

const StorageCalculator = () => {
  const [result, setResult] = useState<any>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      volumeM3: 10,
      duration: 3,
      climateControlled: false,
      insurance: false,
      accessFrequency: 'rare',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const calculation = calculateStoragePrice(values as StorageCalculatorInput);
    setResult({ ...calculation, duration: values.duration });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
                <Package className="w-8 h-8 text-primary" />
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Lagerrechner
              </h1>
              
              <p className="text-lg text-muted-foreground">
                Berechnen Sie Ihre Lagerhaltungskosten
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
                              max={100}
                              step={1}
                              value={[field.value]}
                              onValueChange={(vals) => field.onChange(vals[0])}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Duration */}
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Lagerdauer: {field.value} Monate
                          </FormLabel>
                          <FormControl>
                            <Slider
                              min={1}
                              max={24}
                              step={1}
                              value={[field.value]}
                              onValueChange={(vals) => field.onChange(vals[0])}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Access Frequency */}
                    <FormField
                      control={form.control}
                      name="accessFrequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zugriffshäufigkeit</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="rare">Selten (bei Bedarf)</SelectItem>
                              <SelectItem value="monthly">Monatlich</SelectItem>
                              <SelectItem value="weekly">Wöchentlich</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    {/* Additional Options */}
                    <div className="space-y-4">
                      <Label className="text-base font-semibold">Zusätzliche Optionen</Label>
                      
                      <FormField
                        control={form.control}
                        name="climateControlled"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Klimakontrolliert
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="insurance"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Versicherung
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
                      <div className="text-sm text-muted-foreground mb-2">Monatlicher Preis</div>
                      <div className="text-4xl font-bold text-primary mb-1">
                        {formatCurrency(result.monthlyPrice)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(result.priceRange.min)} - {formatCurrency(result.priceRange.max)}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b border-border">
                        <span className="text-muted-foreground">Setup-Gebühr (einmalig)</span>
                        <span className="font-semibold">{formatCurrency(result.setupFee)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center pb-3 border-b border-border">
                        <span className="text-muted-foreground">Erster Monat (Total)</span>
                        <span className="font-semibold">{formatCurrency(result.totalFirstMonth)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center pb-3 border-b border-border">
                        <span className="text-muted-foreground">Total für {result.duration} Monate</span>
                        <span className="font-semibold text-lg text-primary">
                          {formatCurrency(result.setupFee + (result.monthlyPrice * result.duration))}
                        </span>
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">
                        💡 <strong>Tipp:</strong> Bei längerer Lagerdauer sind oft Rabatte verfügbar. 
                        Kontaktieren Sie uns für ein individuelles Angebot.
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
                      transparente Preisberechnung für Ihre Lagerung.
                    </p>
                  </div>
                )}
              </Card>
            </div>

            {/* SEO Content */}
            <div className="mt-16 prose prose-slate max-w-none">
              <h2 className="text-2xl font-bold text-foreground mb-4">Lagerlösung für Ihren Umzug in der Schweiz</h2>
              
              <div className="grid md:grid-cols-2 gap-8 text-muted-foreground">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Warum externe Lagerung?</h3>
                  <p className="mb-4">
                    Bei einem Umzug kann eine temporäre Lagerlösung eine wertvolle Hilfe sein. Ob als Zwischenlager 
                    zwischen zwei Wohnungen, für Renovierungsarbeiten oder zur längerfristigen Aufbewahrung – unsere 
                    Partner bieten sichere und flexible Lagerlösungen in der ganzen Schweiz.
                  </p>
                  <p>
                    Mit klimakontrollierten Optionen und verschiedenen Zugriffsmöglichkeiten finden Sie die passende 
                    Lösung für Ihre Bedürfnisse. Alle Lagerräume sind gesichert und versichert.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Unsere Lagerservices</h3>
                  <ul className="space-y-2">
                    <li>✓ Flexible Mietdauer (ab 1 Monat)</li>
                    <li>✓ Verschiedene Grössen verfügbar (1-100 m³)</li>
                    <li>✓ Klimakontrollierte Lagerräume</li>
                    <li>✓ 24/7 Videoüberwachung</li>
                    <li>✓ Individuelle Zugriffsrechte</li>
                    <li>✓ Versicherungsschutz verfügbar</li>
                    <li>✓ Transport zum/vom Lager organisierbar</li>
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

export default StorageCalculator;
