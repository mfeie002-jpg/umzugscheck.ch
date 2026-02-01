/**
 * TrustLandingV2 - Branchen-Fokus (Verbands-Legitimität)
 * "Branchenverband = Qualitätsstandard"
 */

import { Helmet } from "react-helmet-async";
import { TrustHeroV2SMA, IndustryAssociationBar, CertifiedCompanyCard } from "@/components/trust-variants/v2";
import { HowItWorks } from "@/components/HowItWorks";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Award, Shield, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import FinalCta from "@/components/FinalCta";

// Qualitätsstandards erklärt
const QualityStandards = () => (
  <section className="py-16 bg-background">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Was bedeutet SMA-Zertifizierung?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Die Swiss Movers Association setzt strenge Qualitätsstandards für Umzugsunternehmen
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {[
          { title: "Fachausbildung", desc: "Alle Mitarbeiter durchlaufen eine zertifizierte Ausbildung" },
          { title: "Versicherung", desc: "Pflicht-Haftpflichtversicherung für alle Transporte" },
          { title: "Qualitätskontrollen", desc: "Regelmässige Audits und Kundenzufriedenheits-Checks" },
        ].map((item, idx) => (
          <div key={idx} className="text-center p-6 bg-card rounded-xl border">
            <CheckCircle2 className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Firmen-Preview mit Badges
const CompanyPreview = () => (
  <section className="py-16 bg-muted/30">
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold text-center mb-10">Unsere zertifizierten Partner</h2>
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <CertifiedCompanyCard
          name="Müller Umzüge AG"
          rating={4.9}
          reviewCount={234}
          location="Zürich"
          certifications={["SMA", "ASTAG", "ISO"]}
          featured
        />
        <CertifiedCompanyCard
          name="Berner Transport GmbH"
          rating={4.8}
          reviewCount={189}
          location="Bern"
          certifications={["SMA", "FIDI"]}
        />
        <CertifiedCompanyCard
          name="Basel Möbellift AG"
          rating={4.7}
          reviewCount={156}
          location="Basel"
          certifications={["SMA", "ASTAG"]}
        />
      </div>
    </div>
  </section>
);

// Für Firmen CTA
const FuerFirmenCta = () => (
  <section className="py-16 bg-primary/5">
    <div className="container mx-auto px-4 text-center">
      <Award className="w-12 h-12 text-primary mx-auto mb-4" />
      <h2 className="text-2xl font-bold mb-4">Sie sind SMA-Mitglied?</h2>
      <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
        Als zertifiziertes Unternehmen profitieren Sie von bevorzugter Platzierung und qualifizierten Leads.
      </p>
      <Link to="/anbieter-werden">
        <Button size="lg">Jetzt Partner werden</Button>
      </Link>
    </div>
  </section>
);

// FAQ
const BranchenFAQ = () => (
  <section className="py-16 bg-background">
    <div className="container mx-auto px-4 max-w-3xl">
      <h2 className="text-2xl font-bold text-center mb-10">Häufige Fragen</h2>
      <Accordion type="single" collapsible className="space-y-3">
        <AccordionItem value="1" className="bg-card rounded-lg border px-4">
          <AccordionTrigger>Was ist die SMA?</AccordionTrigger>
          <AccordionContent>
            Die Swiss Movers Association (SMA) ist der führende Branchenverband für Umzugsunternehmen 
            in der Schweiz. Sie setzt Qualitätsstandards und bietet Zertifizierungen an.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="2" className="bg-card rounded-lg border px-4">
          <AccordionTrigger>Warum auf Zertifizierung achten?</AccordionTrigger>
          <AccordionContent>
            Zertifizierte Unternehmen haben nachweislich geschultes Personal, 
            ausreichende Versicherung und unterliegen regelmässigen Qualitätskontrollen.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="3" className="bg-card rounded-lg border px-4">
          <AccordionTrigger>Sind alle Partner bei Ihnen zertifiziert?</AccordionTrigger>
          <AccordionContent>
            Wir bevorzugen SMA- und ASTAG-zertifizierte Partner. Nicht-zertifizierte Unternehmen 
            werden besonders streng geprüft und müssen alternative Qualitätsnachweise erbringen.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  </section>
);

export default function TrustLandingV2() {
  return (
    <>
      <Helmet>
        <title>SMA-zertifizierte Umzugsfirmen | Branchenverband-geprüft | umzugscheck.ch</title>
        <meta name="description" content="Nur die besten Umzugsfirmen: SMA, ASTAG und FIDI zertifiziert. Branchenverband-geprüfte Qualität." />
      </Helmet>

      <main className="min-h-screen">
        {/* Hero mit SMA-Badge */}
        <TrustHeroV2SMA />

        {/* Verbands-Logos */}
        <IndustryAssociationBar />

        {/* Qualitätsstandards */}
        <QualityStandards />

        {/* How it Works */}
        <HowItWorks />

        {/* Firmen-Preview */}
        <CompanyPreview />

        {/* FAQ */}
        <BranchenFAQ />

        {/* Für Firmen CTA */}
        <FuerFirmenCta />

        {/* Final CTA */}
        <FinalCta />
      </main>
    </>
  );
}
