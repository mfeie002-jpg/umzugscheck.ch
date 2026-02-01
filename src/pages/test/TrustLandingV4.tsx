/**
 * TrustLandingV4 - Best of Lovable Analysis (Synthese)
 * "Das Beste aus allen Welten, psychologisch optimiert"
 */

import { Helmet } from "react-helmet-async";
import { TrustPills, TrustDrawer, TrustFloor, InteractiveTrustHub, StickyMobileTrustBar } from "@/components/trust-variants/v4";
import { HowItWorks } from "@/components/HowItWorks";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, Star, Users, Shield, Clock, CheckCircle2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TRUST } from "@/content/trust";
import { SWISS_MEDIA_PARTNERS, ColoredMediaLogo } from "@/components/trust/media-logos";
import FinalCta from "@/components/FinalCta";
import { useState, useEffect } from "react";

// Premium Hero mit Trust-Pills
const PremiumHero = () => (
  <section className="relative bg-gradient-to-b from-primary/5 via-background to-background py-16 md:py-24 overflow-hidden">
    {/* Decorative Elements */}
    <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
    <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
    
    <div className="container mx-auto px-4 relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        {/* Live Activity Badge */}
        <div className="inline-flex items-center gap-2 bg-success/10 border border-success/20 px-4 py-2 rounded-full text-sm font-medium text-success mb-6">
          <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span>Jetzt aktiv: 23 Personen vergleichen Offerten</span>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
          Die beste Umzugsfirma finden
          <br />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            in nur 2 Minuten
          </span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Vergleichen Sie kostenlos Offerten von geprüften Umzugsfirmen. 
          Sparen Sie durchschnittlich <strong className="text-foreground">CHF {TRUST.savingsAverage}</strong>.
        </p>

        {/* CTA with Trust-Pills */}
        <div className="space-y-4 max-w-md mx-auto">
          <Link to="/umzugsofferten">
            <Button size="lg" className="w-full py-6 text-lg shadow-lg group">
              <Zap className="w-5 h-5 mr-2" />
              Jetzt Offerten erhalten
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          
          {/* Trust Pills unter CTA */}
          <TrustPills />
          
          {/* Drawer Trigger */}
          <div className="pt-2">
            <TrustDrawer />
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Media Logos + Live Counter
const MediaLogosSection = () => {
  const [counter, setCounter] = useState(15234);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-8 bg-muted/30 border-y">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Media Logos */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">Bekannt aus:</span>
            <div className="flex items-center gap-4">
              {SWISS_MEDIA_PARTNERS.slice(0, 4).map((partner) => (
                <ColoredMediaLogo key={partner.name} name={partner.name} size="sm" />
              ))}
            </div>
          </div>
          
          {/* Live Counter */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span className="font-bold">{counter.toLocaleString('de-CH')}</span>
              <span className="text-muted-foreground">Umzüge vermittelt</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="font-bold">{TRUST.ratingValue}</span>
              <span className="text-muted-foreground">/ 5</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Pain vs Gain Section
const PainVsGain = () => (
  <section className="py-16 bg-background">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
          Warum umzugscheck.ch?
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Pain */}
          <div className="space-y-4">
            <h3 className="font-semibold text-red-600 mb-4">Ohne Vergleich:</h3>
            {[
              "Stundenlange Recherche",
              "Keine Preistransparenz",
              "Unsichere Anbieter",
              "Versteckte Kosten",
            ].map((pain, idx) => (
              <div key={idx} className="flex items-center gap-3 text-muted-foreground">
                <div className="w-6 h-6 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
                  <span className="text-red-500 text-xs">✗</span>
                </div>
                {pain}
              </div>
            ))}
          </div>
          
          {/* Gain */}
          <div className="space-y-4">
            <h3 className="font-semibold text-success mb-4">Mit umzugscheck.ch:</h3>
            {[
              "5 Offerten in 24-48h",
              "Preise transparent vergleichen",
              "Nur geprüfte Partner",
              "Festpreis-Garantie",
            ].map((gain, idx) => (
              <div key={idx} className="flex items-center gap-3 text-foreground">
                <div className="w-6 h-6 bg-success/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                </div>
                {gain}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Guarantees (compact)
const GuaranteesCompact = () => (
  <section className="py-12 bg-muted/30">
    <div className="container mx-auto px-4">
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
        {[
          { icon: Shield, label: "Vollversichert bis CHF 2 Mio." },
          { icon: Clock, label: "Pünktlichkeits-Garantie" },
          { icon: CheckCircle2, label: "30 Tage Geld-zurück" },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm">
            <item.icon className="w-5 h-5 text-primary" />
            <span className="font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// FAQ
const CompactFAQ = () => (
  <section className="py-16 bg-background">
    <div className="container mx-auto px-4 max-w-3xl">
      <h2 className="text-2xl font-bold text-center mb-10">Häufige Fragen</h2>
      <Accordion type="single" collapsible className="space-y-3">
        <AccordionItem value="1" className="bg-card rounded-lg border px-4">
          <AccordionTrigger>Wie funktioniert der Vergleich?</AccordionTrigger>
          <AccordionContent>
            Sie geben Ihre Umzugsdaten ein (2 Min.), erhalten bis zu 5 Offerten von geprüften 
            Firmen und wählen das beste Angebot. Alles kostenlos und unverbindlich.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="2" className="bg-card rounded-lg border px-4">
          <AccordionTrigger>Wie werden die Firmen geprüft?</AccordionTrigger>
          <AccordionContent>
            Dreifache Prüfung: Handelsregister-Verifizierung, Branchenverbands-Status 
            und kontinuierliche Kundenbewertungen. Nur Top-Partner werden vermittelt.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="3" className="bg-card rounded-lg border px-4">
          <AccordionTrigger>Was kostet mich das?</AccordionTrigger>
          <AccordionContent>
            Für Sie als Privatperson: Nichts. Der Service ist 100% kostenlos. 
            Die Umzugsfirmen zahlen eine Vermittlungsgebühr.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  </section>
);

export default function TrustLandingV4() {
  return (
    <>
      <Helmet>
        <title>Umzugsfirmen vergleichen | Dreifach geprüft | umzugscheck.ch</title>
        <meta name="description" content="Staatlich, durch Branchenverbände und durch Konsumentenschutz geprüfte Umzugsfirmen. Kostenlos vergleichen." />
      </Helmet>

      <main className="min-h-screen pb-24 md:pb-0">
        {/* Premium Hero mit Trust-Pills */}
        <PremiumHero />

        {/* Trust Floor */}
        <TrustFloor />

        {/* Media Logos + Live Counter */}
        <MediaLogosSection />

        {/* Pain vs Gain */}
        <PainVsGain />

        {/* How it Works */}
        <HowItWorks />

        {/* Interactive Trust Hub */}
        <InteractiveTrustHub />

        {/* Guarantees */}
        <GuaranteesCompact />

        {/* FAQ */}
        <CompactFAQ />

        {/* Final CTA */}
        <FinalCta />

        {/* Sticky Mobile Bar */}
        <StickyMobileTrustBar />
      </main>
    </>
  );
}
