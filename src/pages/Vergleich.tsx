import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Calculator, Search, CheckCircle, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ComparisonPreview } from "@/components/ComparisonPreview";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Umzugsfirmen Vergleich Schweiz",
  "description": "Vergleichen Sie Schweizer Umzugsfirmen nach Preis, Service und Bewertungen. Finden Sie die perfekte Umzugsfirma für Ihren Umzug.",
  "url": "https://umzugscheck.ch/vergleich"
};

const Vergleich = () => {
  return (
    <>
      <SEOHead
        title="Umzugsfirmen Vergleich Schweiz - Beste Anbieter finden | Umzugscheck.ch"
        description="Vergleichen Sie über 200 geprüfte Schweizer Umzugsfirmen nach Preis, Service und Bewertungen. Unabhängig, transparent und kostenlos. Jetzt beste Umzugsfirma finden."
        keywords="umzugsfirmen vergleich, umzugsunternehmen schweiz, beste umzugsfirma, umzugsfirma bewertung"
        canonical="/vergleich"
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <Breadcrumbs 
            items={[
              { label: "Startseite", href: "/" },
              { label: "Vergleich", href: "/vergleich" }
            ]}
          />

          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Die beste Umzugsfirma für Ihren Umzug finden
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Vergleichen Sie über 200 geprüfte Umzugsfirmen in der ganzen Schweiz – transparent, unabhängig und 100% kostenlos
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/rechner">
                  <Calculator className="w-5 h-5 mr-2" />
                  Jetzt Preis berechnen
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/firmen">
                  <Search className="w-5 h-5 mr-2" />
                  Umzugsfirmen durchsuchen
                </Link>
              </Button>
            </div>
          </div>

          {/* So funktioniert der Vergleich */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">
              So funktioniert unser Vergleich
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  step: "1",
                  title: "Anforderungen eingeben",
                  description: "Beschreiben Sie Ihren Umzug mit unserem intelligenten Rechner in nur 2 Minuten."
                },
                {
                  step: "2",
                  title: "Angebote erhalten",
                  description: "Erhalten Sie passende Offerten von geprüften Umzugsfirmen in Ihrer Region."
                },
                {
                  step: "3",
                  title: "Firmen vergleichen",
                  description: "Vergleichen Sie Preise, Bewertungen, Services und wählen Sie die beste Option."
                },
                {
                  step: "4",
                  title: "Umzug durchführen",
                  description: "Beauftragen Sie die Firma direkt und profitieren Sie von unserem Service."
                }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Vergleichskriterien */}
          <section className="mb-16 bg-muted/30 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Darauf sollten Sie beim Vergleich achten
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Preis-Leistungs-Verhältnis",
                  description: "Vergleichen Sie nicht nur die Preise, sondern auch die enthaltenen Leistungen. Der günstigste ist nicht immer der beste."
                },
                {
                  title: "Kundenbewertungen",
                  description: "Echte Kundenbewertungen geben Ihnen einen realistischen Einblick in die Qualität und Zuverlässigkeit der Firma."
                },
                {
                  title: "Versicherungsschutz",
                  description: "Achten Sie darauf, dass Ihre Güter während des Transports ausreichend versichert sind."
                },
                {
                  title: "Zusatzleistungen",
                  description: "Prüfen Sie, welche Extra-Services angeboten werden: Packservice, Entsorgung, Endreinigung, Möbelmontage."
                },
                {
                  title: "Regionale Präsenz",
                  description: "Firmen mit lokaler Expertise kennen die Region besser und können effizienter arbeiten."
                },
                {
                  title: "Verfügbarkeit",
                  description: "Können die Firmen zu Ihrem gewünschten Umzugstermin? Frühzeitige Buchung sichert bessere Preise."
                }
              ].map((item, index) => (
                <div key={index} className="bg-background p-6 rounded-xl shadow-sm">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Simple Comparison Table */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">
              Beispiel: Umzugsfirmen im direkten Vergleich
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-background rounded-xl border shadow-medium">
                <thead>
                  <tr className="border-b bg-secondary/20">
                    <th className="text-left p-4 font-semibold">Firma</th>
                    <th className="text-left p-4 font-semibold">Region</th>
                    <th className="text-left p-4 font-semibold">Preisniveau</th>
                    <th className="text-left p-4 font-semibold">Bewertung</th>
                    <th className="text-left p-4 font-semibold">Services</th>
                    <th className="text-left p-4 font-semibold"></th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Zürich Umzüge AG", region: "Zürich & Umgebung", price: "CHF", rating: 4.8, services: ["Transport", "Montage", "Reinigung"] },
                    { name: "Berner Zügelfirma", region: "Bern & Mittelland", price: "CHF CHF", rating: 4.7, services: ["Transport", "Entsorgung"] },
                    { name: "Basel Express Moving", region: "Basel-Stadt", price: "CHF CHF CHF", rating: 4.9, services: ["Transport", "Montage", "Lagerung"] },
                    { name: "Luzern Transport AG", region: "Zentralschweiz", price: "CHF CHF", rating: 4.6, services: ["Transport", "Reinigung", "Lagerung"] }
                  ].map((company, index) => (
                    <tr key={index} className="border-b last:border-0 hover:bg-secondary/5 transition-colors">
                      <td className="p-4 font-medium">{company.name}</td>
                      <td className="p-4 text-sm text-muted-foreground">{company.region}</td>
                      <td className="p-4">
                        <span className="text-primary font-semibold">{company.price}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-4 h-4 ${i < Math.floor(company.rating) ? 'fill-yellow-500 text-yellow-500' : 'fill-gray-300 text-gray-300'}`} viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="ml-1 font-medium">{company.rating}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {company.services.map((service, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 bg-secondary rounded-full">
                              {service}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <Button size="sm" variant="outline" asChild>
                          <Link to="/umzugsfirmen">Details</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Dies sind Beispieldaten. Ihre tatsächlichen Offerten basieren auf Ihren individuellen Anforderungen.
            </p>
          </section>

          {/* City Links */}
          <section className="mb-16 bg-muted/30 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center mb-8">
              Zum Vergleich in deiner Region
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              Finden Sie die besten Umzugsfirmen in Ihrer Stadt
            </p>
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
              {[
                { name: "Zürich", slug: "zuerich" },
                { name: "Bern", slug: "bern" },
                { name: "Basel", slug: "basel" },
                { name: "Luzern", slug: "luzern" },
                { name: "Winterthur", slug: "winterthur" },
                { name: "St. Gallen", slug: "st-gallen" }
              ].map((city, index) => (
                <Button key={index} variant="outline" asChild className="h-auto py-4">
                  <Link to={`/umzugsfirmen/${city.slug}`} className="flex flex-col items-center gap-2">
                    <Search className="w-5 h-5" />
                    <span className="font-medium">{city.name}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </section>

          {/* Vorteile Umzugscheck.ch */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">
              Warum Umzugscheck.ch?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: CheckCircle,
                  title: "Unabhängig & neutral",
                  description: "Wir sind kein Umzugsunternehmen, sondern eine unabhängige Vergleichsplattform. Ihre Zufriedenheit steht im Mittelpunkt."
                },
                {
                  icon: TrendingUp,
                  title: "Geprüfte Qualität",
                  description: "Alle Firmen werden von uns geprüft und verifiziert. Nur seriöse Anbieter mit gutem Service sind bei uns gelistet."
                },
                {
                  icon: Calculator,
                  title: "Intelligenter Vergleich",
                  description: "Unser KI-gestützter Algorithmus findet die besten Firmen für Ihre spezifischen Anforderungen."
                }
              ].map((benefit, index) => (
                <div key={index} className="text-center p-6 bg-muted/30 rounded-xl">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-xl mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Jetzt Offerte anfordern und vergleichen
            </h2>
            <p className="text-xl mb-8 text-primary-foreground/90">
              Erhalten Sie kostenlose Offerten von geprüften Umzugsfirmen und vergleichen Sie transparent
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/offerte">
                  Offerte anfordern
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link to="/rechner">
                  <Calculator className="w-5 h-5 mr-2" />
                  Kosten berechnen
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Vergleich;
