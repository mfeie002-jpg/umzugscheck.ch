import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Clock, Shield, ThumbsUp, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "name": "Umzugsofferte anfragen",
  "description": "Fordern Sie kostenlos und unverbindlich Umzugsofferten von geprüften Schweizer Umzugsfirmen an.",
  "url": "https://umzugscheck.ch/offerte"
};

const Offerte = () => {
  return (
    <>
      <SEOHead
        title="Kostenlose Umzugsofferte anfragen - Vergleichen & Sparen | Umzugscheck.ch"
        description="Fordern Sie kostenlos und unverbindlich Umzugsofferten von bis zu 5 geprüften Schweizer Umzugsfirmen an. Schnell, einfach und transparent."
        keywords="umzugsofferte, offerte umzug, umzug anfragen, kostenlose offerte, umzugsangebot"
        canonical="/offerte"
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <Breadcrumbs 
            items={[
              { label: "Startseite", href: "/" },
              { label: "Offerte", href: "/offerte" }
            ]}
          />

          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Kostenlose Umzugsofferte in 2 Minuten
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Erhalten Sie innerhalb von 24 Stunden passende Offerten von bis zu 5 geprüften Umzugsfirmen – kostenlos und unverbindlich
            </p>
            <Button size="lg" asChild>
              <Link to="/rechner">
                <Calculator className="w-5 h-5 mr-2" />
                Jetzt Offerte anfordern
              </Link>
            </Button>
          </div>

          {/* Vorteile */}
          <section className="mb-16">
            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  icon: Clock,
                  title: "Schnell",
                  description: "Offerten innerhalb von 24 Stunden"
                },
                {
                  icon: Shield,
                  title: "Sicher",
                  description: "Nur geprüfte & verifizierte Firmen"
                },
                {
                  icon: ThumbsUp,
                  title: "Kostenlos",
                  description: "100% kostenlos & unverbindlich"
                },
                {
                  icon: CheckCircle,
                  title: "Einfach",
                  description: "Formular in 2 Minuten ausfüllen"
                }
              ].map((benefit, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* So funktioniert's */}
          <section className="mb-16 bg-muted/30 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-8 text-center">
              So funktioniert's
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Formular ausfüllen",
                  description: "Beschreiben Sie Ihren Umzug in unserem intelligenten Rechner. Geben Sie Details zu Wohnungsgröße, Distanz und gewünschten Zusatzleistungen an.",
                  icon: Calculator
                },
                {
                  step: "2",
                  title: "Offerten erhalten",
                  description: "Wir leiten Ihre Anfrage an passende, geprüfte Umzugsfirmen weiter. Innerhalb von 24 Stunden erhalten Sie bis zu 5 detaillierte Offerten per E-Mail.",
                  icon: Clock
                },
                {
                  step: "3",
                  title: "Vergleichen & auswählen",
                  description: "Vergleichen Sie die Offerten nach Preis, Bewertungen und Leistungen. Wählen Sie die beste Firma für Ihren Umzug aus und kontaktieren Sie diese direkt.",
                  icon: CheckCircle
                }
              ].map((item, index) => (
                <div key={index} className="relative">
                  <div className="bg-background p-6 rounded-xl shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">
                        {item.step}
                      </div>
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="w-8 h-8 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Was ist enthalten */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">
              Was enthalten Ihre Offerten?
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                {
                  title: "Detaillierte Preisaufschlüsselung",
                  description: "Transparente Kostenaufstellung aller Positionen: Transportkosten, Arbeitszeit, Fahrzeugkosten und Zusatzleistungen."
                },
                {
                  title: "Umfassende Leistungsbeschreibung",
                  description: "Genaue Beschreibung aller angebotenen Services: An- und Abtransport, Verpackungsmaterial, Montage/Demontage."
                },
                {
                  title: "Versicherungsdetails",
                  description: "Informationen zum Versicherungsschutz während des Transports und Haftungsbedingungen."
                },
                {
                  title: "Verfügbarkeit & Termine",
                  description: "Konkrete Terminvorschläge und Verfügbarkeit der Umzugsfirma zu Ihrem Wunschtermin."
                },
                {
                  title: "Firmenreferenzen",
                  description: "Bewertungen anderer Kunden, Zertifikate und Referenzen der Umzugsfirma."
                },
                {
                  title: "Kontaktinformationen",
                  description: "Direkter Ansprechpartner mit Telefonnummer und E-Mail für Rückfragen."
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 bg-muted/30 p-6 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Warum Umzugscheck.ch */}
          <section className="mb-16 bg-primary text-primary-foreground rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Warum Offerten über Umzugscheck.ch?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Shield,
                  title: "Qualitätsgarantie",
                  description: "Alle Umzugsfirmen werden von uns geprüft und verifiziert. Nur seriöse Anbieter mit nachweislich guter Qualität."
                },
                {
                  icon: ThumbsUp,
                  title: "Beste Preise",
                  description: "Durch den Wettbewerb der Firmen profitieren Sie von attraktiven Konditionen und können bis zu 35% sparen."
                },
                {
                  icon: CheckCircle,
                  title: "Unabhängig & neutral",
                  description: "Wir sind keine Umzugsfirma, sondern eine unabhängige Plattform. Ihr Vorteil steht im Mittelpunkt."
                }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary-foreground/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                  <p className="text-primary-foreground/90">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Final CTA */}
          <section className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Bereit für Ihre kostenlose Offerte?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Füllen Sie jetzt unser Formular aus und erhalten Sie innerhalb von 24 Stunden passende Angebote
            </p>
            <Button size="lg" asChild>
              <Link to="/rechner">
                <Calculator className="w-5 h-5 mr-2" />
                Jetzt Offerte anfordern
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Kostenlos • Unverbindlich • Keine versteckten Kosten
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default Offerte;
