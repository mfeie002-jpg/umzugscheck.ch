import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Shield, Users, Target, TrendingUp, Heart, Award } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { DataProtectionBadge } from "@/components/trust/DataProtectionBadge";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Helmet } from "react-helmet";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Umzugscheck.ch",
  "alternateName": "Umzugscheck",
  "url": "https://umzugscheck.ch",
  "logo": "https://umzugscheck.ch/logo.png",
  "description": "Schweizer Vergleichsplattform für Umzugsofferten. Vergleichen Sie geprüfte Umzugsfirmen aus allen 26 Kantonen und sparen Sie Zeit und Geld bei Ihrem Umzug.",
  "foundingDate": "2024",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "CH",
    "addressRegion": "Schweiz"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": ["German", "French", "Italian"]
  },
  "areaServed": {
    "@type": "Country",
    "name": "Switzerland"
  },
  "knowsAbout": [
    "Umzugsservice",
    "Wohnungsendreinigung",
    "Entsorgung",
    "Lagerung",
    "Packservice",
    "Möbelmontage"
  ]
};

const About = () => {
  const values = [
    {
      icon: Shield,
      title: "Transparenz",
      description: "Wir glauben an volle Transparenz bei Preisen und Leistungen. Keine versteckten Kosten, keine Überraschungen."
    },
    {
      icon: Users,
      title: "Unabhängigkeit",
      description: "Wir sind komplett unabhängig und nicht an einzelne Umzugsfirmen gebunden. Ihre Interessen stehen im Mittelpunkt."
    },
    {
      icon: Target,
      title: "Qualität",
      description: "Wir arbeiten nur mit geprüften und verifizierten Umzugsfirmen zusammen, die unsere hohen Qualitätsstandards erfüllen."
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description: "Durch moderne Technologie und smarte Rechner machen wir Umzugsplanung einfacher und schneller."
    },
    {
      icon: Heart,
      title: "Kundenfokus",
      description: "Ihre Zufriedenheit ist unser Erfolg. Wir begleiten Sie durch den gesamten Umzugsprozess."
    },
    {
      icon: Award,
      title: "Schweizer Qualität",
      description: "Als Schweizer Plattform kennen wir die lokalen Anforderungen und Standards genau."
    }
  ];

  const stats = [
    { number: "500+", label: "Zufriedene Kunden" },
    { number: "50+", label: "Geprüfte Umzugsfirmen" },
    { number: "26", label: "Kantone abgedeckt" },
    { number: "98%", label: "Kundenzufriedenheit" }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Über uns - Umzugscheck.ch | Ihre unabhängige Schweizer Vergleichsplattform</title>
        <meta 
          name="description" 
          content="Erfahren Sie mehr über Umzugscheck.ch - die unabhängige Schweizer Vergleichsplattform für Umzugsofferten. Unsere Mission, Werte und wie wir Ihnen helfen, den besten Umzugsservice zu finden."
        />
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
      </Helmet>

      <Navigation />
      
      <main className="flex-1">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 py-4">
          <Breadcrumbs items={[{ label: "Über uns" }]} showHome />
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-secondary/30 to-background border-b border-border py-16 md:py-24">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                  Über Umzugscheck.ch
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Die unabhängige Schweizer Vergleichsplattform für stressfreie Umzüge
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-center">
                  Unsere Mission
                </h2>
                <div className="bg-secondary/20 border border-border rounded-2xl p-8 md:p-12">
                  <p className="text-lg text-foreground mb-6">
                    Umzugscheck.ch wurde gegründet, um den Umzugsprozess in der Schweiz transparenter, 
                    einfacher und kostengünstiger zu gestalten. Wir wissen, dass ein Umzug eine der 
                    stressigsten Lebenssituationen sein kann – von der Planung über die Kostenkalkulation 
                    bis zur Auswahl der richtigen Umzugsfirma.
                  </p>
                  <p className="text-lg text-foreground mb-6">
                    Deshalb haben wir eine Plattform geschaffen, die Ihnen hilft, in wenigen Minuten 
                    mehrere Offerten von geprüften Umzugsfirmen zu vergleichen. Unsere intelligenten 
                    Preisrechner geben Ihnen sofort eine realistische Einschätzung Ihrer Umzugskosten, 
                    und unsere Datenbank mit verifizierten Umzugsunternehmen aus allen 26 Schweizer 
                    Kantonen stellt sicher, dass Sie nur mit professionellen Anbietern in Kontakt kommen.
                  </p>
                  <p className="text-lg text-foreground">
                    Wir sind komplett unabhängig und arbeiten für Sie – nicht für die Umzugsfirmen. 
                    Unser Ziel ist es, Ihnen die beste Entscheidungsgrundlage zu bieten und Ihnen 
                    Zeit, Nerven und Geld zu sparen.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 md:py-24 bg-secondary/10">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
                  Umzugscheck.ch in Zahlen
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                        {stat.number}
                      </div>
                      <div className="text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
                  Unsere Werte
                </h2>
                <p className="text-lg text-muted-foreground mb-12 text-center max-w-2xl mx-auto">
                  Diese Prinzipien leiten uns in allem, was wir tun
                </p>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {values.map((value, index) => (
                    <div 
                      key={index}
                      className="bg-background border border-border rounded-xl p-6 hover:border-primary/40 hover:shadow-soft transition-all"
                    >
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                        <value.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-3">
                        {value.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {value.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* How We Work Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-secondary/10 to-background">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-center">
                  So funktioniert's
                </h2>
                <div className="space-y-6">
                  <div className="bg-background border border-border rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">
                        1
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-2">
                          Kostenlos Preise berechnen
                        </h3>
                        <p className="text-muted-foreground">
                          Nutzen Sie unsere intelligenten Rechner, um eine realistische Kostenschätzung 
                          für Ihren Umzug zu erhalten – in wenigen Minuten und völlig kostenlos.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-background border border-border rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">
                        2
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-2">
                          Umzugsfirmen vergleichen
                        </h3>
                        <p className="text-muted-foreground">
                          Durchsuchen Sie unsere Datenbank mit geprüften Umzugsfirmen aus Ihrer Region. 
                          Vergleichen Sie Bewertungen, Leistungen und Preise auf einen Blick.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-background border border-border rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">
                        3
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-2">
                          Offerten erhalten
                        </h3>
                        <p className="text-muted-foreground">
                          Fordern Sie kostenlos und unverbindlich Offerten von den Firmen Ihrer Wahl an. 
                          Sie erhalten mehrere Angebote und können in Ruhe das beste auswählen.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-16 md:py-24 border-t border-border">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Warum Umzugscheck.ch?
                </h2>
                <div className="space-y-4 text-lg text-muted-foreground">
                  <p>
                    🔒 <strong className="text-foreground">100% kostenlos</strong> – Keine versteckten Gebühren, 
                    keine Verpflichtungen
                  </p>
                  <p>
                    ✓ <strong className="text-foreground">Unabhängig und neutral</strong> – Wir arbeiten für Sie, 
                    nicht für die Umzugsfirmen
                  </p>
                  <p>
                    🇨🇭 <strong className="text-foreground">Schweizer Qualität</strong> – Nur geprüfte und 
                    verifizierte Umzugsunternehmen
                  </p>
                  <p>
                    ⚡ <strong className="text-foreground">Schnell und einfach</strong> – In wenigen Minuten 
                    zur passenden Offerte
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Data Protection Section */}
        <section className="py-16 md:py-24 bg-secondary/10">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
                  Ihre Daten sind sicher
                </h2>
                <DataProtectionBadge />
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
