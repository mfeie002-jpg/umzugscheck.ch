/**
 * TrustLandingV3 - Konsumenten-Fokus (Käuferschutz)
 * "Du bist geschützt - emotional sicher"
 */

import { Helmet } from "react-helmet-async";
import { TrustHeroV3Consumer, ConsumerProtectionBar, GuaranteesGridV3, RealTestimonialsV3 } from "@/components/trust-variants/v3";
import { HowItWorks } from "@/components/HowItWorks";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertTriangle, CheckCircle2, Shield, Phone, Mail } from "lucide-react";
import FinalCta from "@/components/FinalCta";

// Pain Section: "Was kann schief gehen?"
const PainSection = () => (
  <section className="py-16 bg-red-50 dark:bg-red-950/20">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Was kann beim Umzug schief gehen?</h2>
          <p className="text-muted-foreground">Diese Sorgen kennen Sie vielleicht...</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            { pain: "Möbel werden beschädigt", solution: "CHF 2 Mio. Vollkasko-Versicherung" },
            { pain: "Versteckte Kosten im Nachhinein", solution: "Festpreis-Garantie vor Auftrag" },
            { pain: "Firma taucht nicht auf", solution: "24h-Notfall-Hotline + Ersatzfirma" },
            { pain: "Keine Ansprechperson bei Problemen", solution: "Persönlicher Kundenservice" },
          ].map((item, idx) => (
            <div key={idx} className="bg-card rounded-xl p-5 border">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <div className="font-medium text-foreground line-through opacity-60 mb-1">{item.pain}</div>
                  <div className="flex items-center gap-2 text-success">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="font-semibold">{item.solution}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// Alternativer Kontakt
const AlternativeContact = () => (
  <section className="py-16 bg-muted/30">
    <div className="container mx-auto px-4 text-center">
      <Shield className="w-12 h-12 text-success mx-auto mb-4" />
      <h2 className="text-2xl font-bold mb-4">Wir sind für Sie da</h2>
      <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
        Bei Fragen oder Problemen erreichen Sie uns jederzeit. Ihr Anliegen ist uns wichtig.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="tel:+41446880404"
          className="inline-flex items-center justify-center gap-2 bg-success text-white px-6 py-3 rounded-xl font-semibold hover:bg-success/90 transition-colors"
        >
          <Phone className="w-5 h-5" />
          +41 44 688 04 04
        </a>
        <a
          href="mailto:support@umzugscheck.ch"
          className="inline-flex items-center justify-center gap-2 bg-card border px-6 py-3 rounded-xl font-semibold hover:bg-muted transition-colors"
        >
          <Mail className="w-5 h-5" />
          support@umzugscheck.ch
        </a>
      </div>
    </div>
  </section>
);

// Angstbasiertes FAQ
const AngstFAQ = () => (
  <section className="py-16 bg-background">
    <div className="container mx-auto px-4 max-w-3xl">
      <h2 className="text-2xl font-bold text-center mb-10">Ihre Fragen – ehrliche Antworten</h2>
      <Accordion type="single" collapsible className="space-y-3">
        <AccordionItem value="1" className="bg-card rounded-lg border px-4">
          <AccordionTrigger>Was passiert, wenn etwas kaputt geht?</AccordionTrigger>
          <AccordionContent>
            Alle unsere Partner sind bis CHF 2 Millionen versichert. Im Schadensfall melden Sie sich 
            bei uns, wir kümmern uns um die Abwicklung mit der Versicherung. Sie erhalten vollständigen Ersatz.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="2" className="bg-card rounded-lg border px-4">
          <AccordionTrigger>Kann ich die Buchung stornieren?</AccordionTrigger>
          <AccordionContent>
            Ja, bis 48 Stunden vor dem Umzug kostenlos. Bei kurzfristigeren Stornierungen 
            fällt maximal eine Aufwandsentschädigung von CHF 100 an.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="3" className="bg-card rounded-lg border px-4">
          <AccordionTrigger>Was wenn die Firma nicht kommt?</AccordionTrigger>
          <AccordionContent>
            Unser 24h-Notfall-Service organisiert innerhalb von 2 Stunden eine Ersatzfirma. 
            Die Mehrkosten übernehmen wir. Das ist bisher in weniger als 0.1% der Fälle vorgekommen.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="4" className="bg-card rounded-lg border px-4">
          <AccordionTrigger>Sind meine Daten sicher?</AccordionTrigger>
          <AccordionContent>
            Ja, Ihre Daten werden ausschliesslich auf Schweizer Servern gespeichert und 
            niemals an Dritte verkauft. Sie werden nur für die Vermittlung verwendet.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  </section>
);

export default function TrustLandingV3() {
  return (
    <>
      <Helmet>
        <title>Umziehen ohne Risiko | 100% Käuferschutz | umzugscheck.ch</title>
        <meta name="description" content="Vollversichert, Geld-zurück-Garantie, Trusted Shops zertifiziert. Umzugsfirmen sicher vergleichen." />
      </Helmet>

      <main className="min-h-screen">
        {/* Hero mit Käuferschutz */}
        <TrustHeroV3Consumer />

        {/* Consumer Protection Bar */}
        <ConsumerProtectionBar />

        {/* Pain Section */}
        <PainSection />

        {/* Guarantees Grid */}
        <GuaranteesGridV3 />

        {/* Testimonials */}
        <RealTestimonialsV3 />

        {/* How it Works */}
        <HowItWorks />

        {/* Alternative Contact */}
        <AlternativeContact />

        {/* FAQ */}
        <AngstFAQ />

        {/* Final CTA */}
        <FinalCta />
      </main>
    </>
  );
}
