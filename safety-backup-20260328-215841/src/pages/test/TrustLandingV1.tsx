/**
 * TrustLandingV1 - Behörden-Fokus (Staatliche Autorität)
 * "Wenn der Staat sagt, wir sind echt, dann sind wir echt"
 */

import { Helmet } from "react-helmet-async";
import { TrustHeroV1Zefix, StateAuthorityBar, LegalFooterStrip } from "@/components/trust-variants/v1";
import { HowItWorks } from "@/components/HowItWorks";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Building2, FileCheck, Calculator, CheckCircle2 } from "lucide-react";
import FinalCta from "@/components/FinalCta";

// Fakten-Grid (keine Emotionen, nur Zahlen)
const FactsGrid = () => (
  <section className="py-16 bg-background">
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold text-center mb-10">Die Fakten</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
        {[
          { value: "15'000+", label: "Vermittelte Umzüge", icon: FileCheck },
          { value: "200+", label: "Registrierte Partner", icon: Building2 },
          { value: "CHF 620", label: "Ø Ersparnis", icon: Calculator },
          { value: "100%", label: "HR-verifiziert", icon: CheckCircle2 },
        ].map((fact, idx) => (
          <div key={idx} className="text-center p-6 bg-card rounded-xl border">
            <fact.icon className="w-8 h-8 text-red-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-foreground">{fact.value}</div>
            <div className="text-sm text-muted-foreground">{fact.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Sachliches FAQ
const SachlichesFAQ = () => (
  <section className="py-16 bg-muted/30">
    <div className="container mx-auto px-4 max-w-3xl">
      <h2 className="text-2xl font-bold text-center mb-10">Häufige Fragen</h2>
      <Accordion type="single" collapsible className="space-y-3">
        <AccordionItem value="1" className="bg-card rounded-lg border px-4">
          <AccordionTrigger>Wie werden Partner verifiziert?</AccordionTrigger>
          <AccordionContent>
            Jeder Partner muss einen gültigen Handelsregistereintrag (Zefix) vorweisen. 
            Wir prüfen die UID-Nummer und den Geschäftszweck. Nur Unternehmen mit korrekter 
            Eintragung werden aufgenommen.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="2" className="bg-card rounded-lg border px-4">
          <AccordionTrigger>Was ist Zefix?</AccordionTrigger>
          <AccordionContent>
            Zefix (Zentraler Firmenindex) ist das offizielle Schweizer Handelsregister. 
            Es ist öffentlich einsehbar unter zefix.ch und wird vom Bundesamt für Justiz betrieben.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="3" className="bg-card rounded-lg border px-4">
          <AccordionTrigger>Entstehen Kosten für mich?</AccordionTrigger>
          <AccordionContent>
            Nein. Die Nutzung von umzugscheck.ch ist für Privatpersonen kostenlos und unverbindlich. 
            Die Umzugsfirmen zahlen eine Vermittlungsgebühr.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  </section>
);

export default function TrustLandingV1() {
  return (
    <>
      <Helmet>
        <title>Umzugsfirmen vergleichen | 100% verifiziert | umzugscheck.ch</title>
        <meta name="description" content="Alle Partner im Handelsregister eingetragen. Zefix-verifizierte Umzugsfirmen in der Schweiz vergleichen." />
      </Helmet>

      <main className="min-h-screen">
        {/* Hero mit Zefix-Link */}
        <TrustHeroV1Zefix />

        {/* Staatliche Partner */}
        <StateAuthorityBar />

        {/* Fakten-Grid */}
        <FactsGrid />

        {/* How it Works */}
        <HowItWorks />

        {/* FAQ */}
        <SachlichesFAQ />

        {/* Legal Footer */}
        <LegalFooterStrip />

        {/* Final CTA */}
        <FinalCta />
      </main>
    </>
  );
}
