import { OptimizedSEO } from "@/components/OptimizedSEO";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { Sparkles, ArrowLeft, Home, Droplets, Square } from "lucide-react";
import { OffertenCTA } from "@/components/OffertenCTA";
import { useCleaningCalculator } from "@/hooks/calculators";
import { AccessibleSlider, CalculatorResultCard } from "@/components/calculators";
import { formatCurrency } from "@/lib/pricing";
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
  const {
    form,
    result,
    isSubmitting,
    onSubmit,
    handleSliderChange,
    priceAnnouncement,
  } = useCleaningCalculator();

  // Build breakdown items when we have a result
  const breakdownItems = result ? [
    { label: "Basispreis", value: result.basePrice },
    { label: "Zusatzleistungen", value: result.servicesPrice },
    { label: "Geschätzte Dauer", value: result.estimatedHours },
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-light flex flex-col">
      <OptimizedSEO
        title="Reinigungsrechner - Endreinigung Kosten berechnen"
        description="Berechnen Sie die Kosten für Ihre Wohnungsendreinigung. Endreinigung, normale Reinigung oder Tiefenreinigung. ✓ Kostenlose Schätzung ✓ Sofort Ergebnis"
        keywords="Reinigungsrechner, Endreinigung Kosten, Wohnungsreinigung Preis, Umzugsreinigung Schweiz"
        canonicalUrl="https://umzugscheck.ch/reinigungsrechner"
        schemaMarkup={SERVICE_SCHEMA}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="gradient-hero text-white py-12 md:py-16">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="max-w-3xl mx-auto text-center">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" aria-hidden="true" />
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
            to="/umzugsofferten"
            className="inline-flex items-center gap-2 text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
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
                              <SelectTrigger aria-describedby="cleaning-type-hint">
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

                    {/* Square Meters with accessible slider */}
                    <FormField
                      control={form.control}
                      name="squareMeters"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Square className="w-4 h-4" aria-hidden="true" />
                            Wohnfläche: {field.value} m²
                          </FormLabel>
                          <FormControl>
                            <AccessibleSlider
                              min={20}
                              max={500}
                              step={10}
                              value={[field.value]}
                              onValueChange={(vals) => field.onChange(vals[0])}
                              onValueChangeWithTracking={handleSliderChange}
                              trackingName="squareMeters"
                              label="Wohnfläche in Quadratmetern"
                              unit="Quadratmeter"
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
                            <Home className="w-4 h-4" aria-hidden="true" />
                            Anzahl Zimmer: {field.value}
                          </FormLabel>
                          <FormControl>
                            <AccessibleSlider
                              min={1}
                              max={10}
                              step={1}
                              value={[field.value]}
                              onValueChange={(vals) => field.onChange(vals[0])}
                              onValueChangeWithTracking={handleSliderChange}
                              trackingName="rooms"
                              label="Anzahl Zimmer"
                              unit="Zimmer"
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
                            <Droplets className="w-4 h-4" aria-hidden="true" />
                            Anzahl Badezimmer: {field.value}
                          </FormLabel>
                          <FormControl>
                            <AccessibleSlider
                              min={1}
                              max={5}
                              step={1}
                              value={[field.value]}
                              onValueChange={(vals) => field.onChange(vals[0])}
                              onValueChangeWithTracking={handleSliderChange}
                              trackingName="bathrooms"
                              label="Anzahl Badezimmer"
                              unit="Badezimmer"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Additional Services */}
                    <fieldset className="space-y-4">
                      <legend className="text-base font-semibold">Zusätzliche Services</legend>
                      
                      <FormField
                        control={form.control}
                        name="hasWindows"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                id="hasWindows"
                              />
                            </FormControl>
                            <FormLabel htmlFor="hasWindows" className="font-normal cursor-pointer">
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
                                id="hasOven"
                              />
                            </FormControl>
                            <FormLabel htmlFor="hasOven" className="font-normal cursor-pointer">
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
                                id="hasBalcony"
                              />
                            </FormControl>
                            <FormLabel htmlFor="hasBalcony" className="font-normal cursor-pointer">
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
                                id="hasCarpets"
                              />
                            </FormControl>
                            <FormLabel htmlFor="hasCarpets" className="font-normal cursor-pointer">
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
                                id="hasStorage"
                              />
                            </FormControl>
                            <FormLabel htmlFor="hasStorage" className="font-normal cursor-pointer">
                              Keller/Estrich
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </fieldset>

                    <Button 
                      type="submit" 
                      className="w-full text-sm sm:text-base" 
                      size="lg" 
                      disabled={isSubmitting}
                      aria-busy={isSubmitting}
                    >
                      {isSubmitting ? "Berechne..." : "Preis berechnen"}
                    </Button>
                  </form>
                </Form>
              </Card>

              {/* Results Card with Accessibility */}
              <Card variant="elevated" className="p-6">
                {result ? (
                  <div className="space-y-4 sm:space-y-6" role="region" aria-label="Kostenschätzung Ergebnis" aria-live="polite">
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

                    <div className="space-y-4" role="list" aria-label="Preisaufschlüsselung">
                      <div className="flex justify-between items-center pb-3 border-b border-border" role="listitem">
                        <span className="text-muted-foreground">Basispreis</span>
                        <span className="font-semibold">{formatCurrency(result.basePrice)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center pb-3 border-b border-border" role="listitem">
                        <span className="text-muted-foreground">Zusatzleistungen</span>
                        <span className="font-semibold">{formatCurrency(result.servicesPrice)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center pb-3 border-b border-border" role="listitem">
                        <span className="text-muted-foreground">Geschätzte Dauer</span>
                        <span className="font-semibold">{result.estimatedHours}h</span>
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">
                        💡 <strong>Tipp:</strong> Bei Umzugsreinigung mit Abnahmegarantie kommen wir kostenlos zurück, 
                        falls der Vermieter Mängel beanstandet.
                      </p>
                    </div>

                    <Link to="/kontakt">
                      <Button className="w-full" size="lg">
                        Offerte anfragen
                      </Button>
                    </Link>

                    {/* Screen reader announcement */}
                    <div className="sr-only" role="status" aria-live="polite">
                      {priceAnnouncement}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <Sparkles className="w-16 h-16 text-muted-foreground/30 mb-4" aria-hidden="true" />
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
              <h2 className="text-2xl font-bold text-foreground mb-4">Professionelle Endreinigung in der Schweiz</h2>
              
              <div className="grid md:grid-cols-2 gap-8 text-muted-foreground">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Warum eine professionelle Endreinigung?</h3>
                  <p className="mb-4">
                    Die Wohnungsübergabe ist ein wichtiger Moment. Mit einer professionellen Endreinigung 
                    stellen Sie sicher, dass Ihre Mietwohnung in einwandfreiem Zustand übergeben wird. 
                    Unsere erfahrenen Reinigungsfachkräfte kennen die Schweizer Standards und arbeiten 
                    nach der offiziellen Checkliste des Hauseigentümerverbands.
                  </p>
                  <p>
                    Sparen Sie Zeit und Nerven – während wir reinigen, können Sie sich voll auf Ihren 
                    Umzug konzentrieren. Bei Mängelbeanstandung kommen wir kostenlos zurück.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Unsere Reinigungsleistungen</h3>
                  <ul className="space-y-2">
                    <li>✓ Endreinigung nach HEV-Checkliste</li>
                    <li>✓ Fensterreinigung innen & aussen</li>
                    <li>✓ Küchen- & Gerätereinigung</li>
                    <li>✓ Bad & WC tiefenrein</li>
                    <li>✓ Bodenreinigung aller Art</li>
                    <li>✓ Abnahmegarantie inklusive</li>
                    <li>✓ Flexible Terminplanung</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Offerten CTA */}
            <div className="mt-12">
              <OffertenCTA 
                title="Umzug mit Reinigung kombinieren?"
                description="Sparen Sie Zeit und Geld: Holen Sie sich kombinierte Offerten für Umzug und Reinigung."
                buttonText="Kombinierte Offerten anfordern"
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
