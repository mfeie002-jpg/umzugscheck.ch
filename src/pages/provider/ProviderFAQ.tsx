import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FAQAccordion } from "@/components/FAQAccordion";
import { motion } from "framer-motion";

export default function ProviderFAQPage() {
  const faqs = [
    {
      question: "Wie viele Leads erhalte ich pro Monat?",
      answer: "Das hängt von Ihrem gewählten Modell ab. Bei Pay per Lead kaufen Sie Leads nach Bedarf. Bei Abonnement-Modellen erhalten Sie eine garantierte Anzahl pro Monat (z.B. 10-50 Leads)."
    },
    {
      question: "Wie funktioniert die Abrechnung?",
      answer: "Bei Pay per Lead wird jeder gekaufte Lead direkt abgerechnet. Bei Abonnements zahlen Sie eine monatliche Pauschale. Die Zahlung erfolgt per Rechnung oder SEPA-Lastschrift."
    },
    {
      question: "Kann ich Leads ablehnen?",
      answer: "Ja, Sie sehen eine Vorschau des Leads (Ort, Grösse, Datum) und entscheiden dann, ob Sie den Lead kaufen möchten. Nur gekaufte Leads werden berechnet."
    },
    {
      question: "Wie schnell erhalte ich Leads nach Anmeldung?",
      answer: "Nach Freischaltung Ihres Profils (in der Regel innerhalb 24 Stunden) erhalten Sie sofort passende Lead-Anfragen."
    },
    {
      question: "Gibt es eine Vertragsbindung?",
      answer: "Nein, bei Pay per Lead gibt es keine Vertragsbindung. Abonnements haben in der Regel eine Laufzeit von 1-12 Monaten mit monatlicher Kündigungsfrist."
    },
    {
      question: "Wie werden Leads verteilt?",
      answer: "Leads werden an 3-5 passende Anbieter in der Region verteilt. Die Auswahl basiert auf Service-Gebiet, Verfügbarkeit, Qualitätsscore und Abonnement-Typ."
    },
    {
      question: "Was ist der Qualitätsscore?",
      answer: "Der Qualitätsscore basiert auf Kundenbewertungen, Conversion-Rate, Reaktionszeit und Profilvollständigkeit. Ein hoher Score verbessert Ihre Platzierung."
    },
    {
      question: "Kann ich meine Region selbst wählen?",
      answer: "Ja, Sie definieren Ihre Service-Gebiete (Kantone/Städte) und erhalten nur Leads aus diesen Regionen."
    },
    {
      question: "Gibt es Support bei Fragen?",
      answer: "Ja, unser Partner-Support hilft Ihnen bei Fragen zu Leads, Abrechnung oder Profil-Optimierung. Kontakt per E-Mail oder Telefon."
    },
    {
      question: "Wie optimiere ich mein Profil?",
      answer: "Vollständiges Profil mit Fotos, Beschreibung, Zertifikaten und echten Kundenbewertungen erhöht Ihre Sichtbarkeit und Conversion-Rate erheblich."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Häufige Fragen für Umzugsfirmen | umzugscheck.ch</title>
        <meta 
          name="description" 
          content="Alle wichtigen Fragen und Antworten für Umzugsfirmen auf umzugscheck.ch. Lead-Verteilung, Abrechnung, Konditionen und Support." 
        />
        <link rel="canonical" href="https://umzugscheck.ch/anbieter/faq" />
      </Helmet>

      {/* Hero */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Häufige Fragen für <span className="text-primary">Umzugsfirmen</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Alle wichtigen Informationen zu Leads, Abrechnung und Partnerschaft
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <FAQAccordion items={faqs} variant="compact" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary via-primary/90 to-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Noch Fragen? Werden Sie jetzt Partner
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Starten Sie noch heute und erhalten Sie qualifizierte Umzugsanfragen
          </p>
          <Link to="/anbieter">
            <Button size="lg" variant="secondary" className="h-14 px-8 text-lg">
              Jetzt Partner werden
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}