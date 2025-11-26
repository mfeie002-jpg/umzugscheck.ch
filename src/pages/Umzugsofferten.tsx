import { Button } from "@/components/ui/button";
import { CheckCircle2, Shield, Clock, TrendingDown, ArrowRight, Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ENHANCED_COMPANIES } from "@/data/enhanced-companies";
import { useEffect } from "react";
import { 
  generateOrganizationSchema, 
  generateServiceSchema, 
  generateFAQSchema,
  generateBreadcrumbSchema,
  injectSchema 
} from "@/lib/schema-markup";

const topCompanies = ENHANCED_COMPANIES
  .filter(c => c.is_featured)
  .sort((a, b) => (b.rating || 0) - (a.rating || 0))
  .slice(0, 3);

const regions = [
  { name: "Zürich", slug: "zuerich" },
  { name: "Bern", slug: "bern" },
  { name: "Basel", slug: "basel" },
  { name: "Luzern", slug: "luzern" },
  { name: "Aargau", slug: "aargau" },
  { name: "St. Gallen", slug: "st-gallen" },
  { name: "Zug", slug: "zug" },
  { name: "Schwyz", slug: "schwyz" },
  { name: "Thurgau", slug: "thurgau" },
  { name: "Solothurn", slug: "solothurn" },
  { name: "Graubünden", slug: "graubuenden" },
  { name: "Wallis", slug: "wallis" }
];

const faqs = [
  {
    question: "Was kostet ein Umzug in der Schweiz?",
    answer: "Die Kosten variieren je nach Umfang, Distanz und zusätzlichen Services. Ein 2-Zimmer-Umzug kostet durchschnittlich CHF 800-1'500, ein 4-Zimmer-Umzug CHF 1'500-3'000. Mit unserem Vergleich sparen Sie bis zu 40%."
  },
  {
    question: "Sind die Offerten wirklich kostenlos?",
    answer: "Ja, 100%. Umzugscheck.ch ist für Privatkunden vollständig kostenlos und unverbindlich. Sie bezahlen nur die Umzugsfirma, die Sie beauftragen."
  },
  {
    question: "Wie viele Offerten sollte ich einholen?",
    answer: "Wir empfehlen 3-5 Offerten zu vergleichen. Das gibt Ihnen einen guten Marktüberblick und zeigt, welche Firma das beste Preis-Leistungs-Verhältnis bietet."
  },
  {
    question: "Wie lange dauert der Vergleich?",
    answer: "Das Ausfüllen des Formulars dauert 2-3 Minuten. Innerhalb von 24 Stunden erhalten Sie passende Offerten von geprüften Umzugsfirmen."
  },
  {
    question: "Sind alle Firmen geprüft und versichert?",
    answer: "Ja, alle Partner-Firmen auf Umzugscheck.ch sind geprüft, versichert und zertifiziert. Wir arbeiten nur mit seriösen Schweizer Umzugsunternehmen."
  }
];

export default function Umzugsofferten() {
  useEffect(() => {
    // Inject structured data for SEO
    const schemas = [
      generateOrganizationSchema(),
      generateServiceSchema(
        "Umzugsofferten Vergleich",
        "Vergleichen Sie kostenlose Umzugsofferten von geprüften Schweizer Firmen und sparen Sie bis zu 40%",
        "CHF 800-3000"
      ),
      generateFAQSchema(faqs),
      generateBreadcrumbSchema([
        { name: "Startseite", url: "https://umzugscheck.ch" },
        { name: "Umzugsofferten", url: "https://umzugscheck.ch/umzugsofferten" }
      ])
    ];
    
    injectSchema(schemas);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary to-primary-dark text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Umzugsofferten vergleichen und bis zu 40% sparen
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Erhalten Sie kostenlose Offerten von geprüften Schweizer Umzugsfirmen – schnell, transparent und unverbindlich.
            </p>
            
            <Link to="/rechner">
              <Button size="lg" className="bg-accent hover:bg-accent-dark text-white h-14 text-lg px-8 shadow-xl">
                Jetzt Offerten erhalten
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>

            <div className="flex flex-wrap justify-center gap-6 mt-10">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium">Geprüfte Anbieter</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <TrendingDown className="w-5 h-5" />
                <span className="text-sm font-medium">Bis zu 40% günstiger</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Shield className="w-5 h-5" />
                <span className="text-sm font-medium">Kostenlos & unverbindlich</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Multiple Offers */}
      <section className="py-16 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Warum mehrere Offerten vergleichen?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ein Vergleich lohnt sich immer – hier ist warum
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <TrendingDown className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Preisunterschiede bis zu 40%</h3>
              <p className="text-muted-foreground text-sm">
                Die Preise variieren stark zwischen Anbietern. Mit unserem Vergleich finden Sie die beste Offerte.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-bold text-lg mb-2">Schnellere Terminfindung</h3>
              <p className="text-muted-foreground text-sm">
                Mehrere Firmen bedeuten mehr Flexibilität bei der Terminwahl – auch kurzfristig.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-bold text-lg mb-2">Seriöse Anbieter</h3>
              <p className="text-muted-foreground text-sm">
                Alle Partner sind geprüft, versichert und zertifiziert. Keine versteckten Kosten.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Bessere Qualität</h3>
              <p className="text-muted-foreground text-sm">
                Vergleichen Sie Bewertungen, Services und Erfahrungen für die beste Entscheidung.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Process */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              So einfach geht's
            </h2>
            <p className="text-lg text-muted-foreground">
              In 3 Schritten zur besten Umzugsofferte
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-bold text-xl mb-3">Formular ausfüllen</h3>
              <p className="text-muted-foreground">
                Beschreiben Sie Ihren Umzug in 2-3 Minuten. Alle Angaben sind unverbindlich.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-bold text-xl mb-3">Offerten erhalten</h3>
              <p className="text-muted-foreground">
                Innerhalb von 24 Stunden erhalten Sie 3-5 kostenlose Offerten von geprüften Firmen.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-bold text-xl mb-3">Beste Firma wählen</h3>
              <p className="text-muted-foreground">
                Vergleichen Sie Preise, Bewertungen und Services. Wählen Sie die beste Offerte und sparen Sie.
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link to="/rechner">
              <Button size="lg" className="h-12">
                Jetzt kostenlos vergleichen
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mini-Ranking Section */}
      <section className="py-16 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Unsere Top-Partner
            </h2>
            <p className="text-lg text-muted-foreground">
              Diese Umzugsfirmen werden von unseren Kunden am besten bewertet
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
            {topCompanies.map((company) => (
              <div key={company.id} className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all">
                <div className="flex items-start gap-4 mb-4">
                  {company.logo_url && (
                    <img src={company.logo_url} alt={company.name} className="w-16 h-16 object-contain" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{company.name}</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{company.rating?.toFixed(1)}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({company.review_count} Bewertungen)
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {company.short_description || company.long_description}
                </p>

                <div className="flex gap-2">
                  <Link to={`/umzugsfirmen/${company.slug}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Firma ansehen
                    </Button>
                  </Link>
                  <Link to="/rechner" className="flex-1">
                    <Button size="sm" className="w-full">
                      Offerte anfordern
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/firmen">
              <Button variant="outline" size="lg">
                Alle Firmen anzeigen
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Region Links */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Umzugsofferten nach Region
            </h2>
            <p className="text-lg text-muted-foreground">
              Finden Sie die besten Umzugsfirmen in Ihrer Region
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {regions.map((region) => (
              <Link
                key={region.slug}
                to={`/umzugsofferten/${region.slug}`}
                className="flex items-center gap-2 p-4 bg-white rounded-lg shadow-soft hover:shadow-medium transition-all group"
              >
                <MapPin className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="font-medium group-hover:text-primary transition-colors">
                  Umzugsofferten {region.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Häufig gestellte Fragen
              </h2>
              <p className="text-lg text-muted-foreground">
                Alles, was Sie über Umzugsofferten wissen müssen
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white rounded-lg shadow-soft px-6 border-0"
                >
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA Block */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary via-primary to-primary-dark text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Jetzt kostenlose Umzugsofferten vergleichen
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Sparen Sie Zeit und Geld mit unserem kostenlosen Vergleichsservice
            </p>
            <Link to="/rechner">
              <Button size="lg" className="bg-accent hover:bg-accent-dark text-white h-14 text-lg px-8">
                Offerten erhalten
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
