import { Helmet } from "react-helmet";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuickCalculator } from "@/components/calculator/QuickCalculator";
import { AdvancedCalculator } from "@/components/calculator/AdvancedCalculator";
import { AICalculator } from "@/components/calculator/AICalculator";
import { Calculator as CalculatorIcon, Wrench, Sparkles } from "lucide-react";
import { OtherCalculators } from "@/components/OtherCalculators";

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Umzugskosten-Rechner",
  "name": "Umzugsrechner - Kostenlose Kostenschätzung",
  "description": "Berechnen Sie Ihre Umzugskosten kostenlos und unverbindlich. Wählen Sie zwischen Schnell-Rechner (60 Sekunden), detailliertem Rechner oder KI-gestützter Analyse mit Fotos/Videos.",
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
    "price": "0",
    "priceCurrency": "CHF",
    "description": "Kostenlose Umzugskostenschätzung"
  },
  "category": "Umzugsdienstleistungen",
  "audience": {
    "@type": "Audience",
    "audienceType": "Private Haushalte und Unternehmen"
  },
  "availableChannel": {
    "@type": "ServiceChannel",
    "serviceUrl": "https://umzugscheck.ch/rechner"
  }
};

const Calculator = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Umzugsrechner - Kostenlose Kostenschätzung | Umzugscheck.ch</title>
        <meta name="description" content="Berechnen Sie Ihre Umzugskosten in 60 Sekunden. Schnell-Rechner, detaillierter Rechner oder KI-Analyse mit Fotos. ✓ Kostenlos ✓ Unverbindlich ✓ Präzise Schätzung" />
        <meta name="keywords" content="Umzugsrechner, Umzugskosten berechnen, Umzug Kostenrechner Schweiz, Umzugskalkulator" />
        <link rel="canonical" href="https://umzugscheck.ch/rechner" />
        
        <script type="application/ld+json">
          {JSON.stringify(SERVICE_SCHEMA)}
        </script>
      </Helmet>

      <Navigation />
      
      <main className="flex-1 bg-gradient-light">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs
            items={[
              { label: "Startseite", href: "/" },
              { label: "Kostenrechner" },
            ]}
          />
        </div>

        {/* Header */}
        <section className="py-8 sm:py-12 md:py-16 gradient-hero text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">Umzugskosten berechnen</h1>
              <p className="text-base sm:text-lg md:text-xl text-white/90">
                Wählen Sie Ihren Rechner – von schnell bis präzise. 
                Erhalten Sie sofort eine Kostenschätzung.
              </p>
            </div>
          </div>
        </section>

        {/* Calculator Tabs */}
        <section className="py-8 sm:py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <Tabs defaultValue="quick" className="w-full">
                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto gap-2 bg-white p-2 rounded-xl shadow-medium">
                  <TabsTrigger 
                    value="quick" 
                    className="flex flex-col sm:flex-row items-center justify-center gap-2 py-3 sm:py-4 data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    <CalculatorIcon className="w-5 h-5 flex-shrink-0" />
                    <div className="text-center sm:text-left">
                      <div className="font-semibold text-sm sm:text-base">Schnell-Rechner</div>
                      <div className="text-xs opacity-70">60 Sekunden</div>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="advanced"
                    className="flex flex-col sm:flex-row items-center justify-center gap-2 py-3 sm:py-4 data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    <Wrench className="w-5 h-5 flex-shrink-0" />
                    <div className="text-center sm:text-left">
                      <div className="font-semibold text-sm sm:text-base">Detailliert</div>
                      <div className="text-xs opacity-70">Präzise Kalkulation</div>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="ai"
                    className="flex flex-col sm:flex-row items-center justify-center gap-2 py-3 sm:py-4 data-[state=active]:bg-accent data-[state=active]:text-white"
                  >
                    <Sparkles className="w-5 h-5 flex-shrink-0" />
                    <div className="text-center sm:text-left">
                      <div className="font-semibold text-sm sm:text-base">KI-Rechner</div>
                      <div className="text-xs opacity-70">Mit Foto/Video</div>
                    </div>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="quick" className="mt-8">
                  <QuickCalculator />
                </TabsContent>

                <TabsContent value="advanced" className="mt-8">
                  <AdvancedCalculator />
                </TabsContent>

                <TabsContent value="ai" className="mt-8">
                  <AICalculator />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
        
        {/* Other Calculators */}
        <OtherCalculators currentPath="/rechner" />
      </main>

      <Footer />
    </div>
  );
};

export default Calculator;
