import { Navigation } from "@/components/Navigation";

import { OptimizedSEO } from "@/components/OptimizedSEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal } from "@/components/ScrollReveal";
import { CheckCircle2, TrendingUp, Calendar, Users, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { FAQAccordion } from "@/components/FAQAccordion";

const BecomeProvider = () => {
  const benefits = [
    {
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      title: "Mehr qualifizierte Anfragen",
      description: "Erhalten Sie geprüfte Umzugsanfragen aus Ihrer Region mit vollständigen Kundendaten."
    },
    {
      icon: <Calendar className="w-8 h-8 text-primary" />,
      title: "Planbare Auslastung",
      description: "Füllen Sie freie Termine gezielt und erhöhen Sie Ihre Kapazitätsauslastung."
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Kein Marketingaufwand",
      description: "Wir bringen die Kunden zu Ihnen – Sie konzentrieren sich auf Ihr Kerngeschäft."
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Seriöse Plattform",
      description: "Profitieren Sie von unserem Vertrauen und unserer Reputation im Schweizer Markt."
    },
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "Schnelle Abwicklung",
      description: "Einfaches Lead-Management über Ihr persönliches Partner-Dashboard."
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-primary" />,
      title: "Faire Konditionen",
      description: "Transparente Preisgestaltung und flexible Pakete für jede Unternehmensgrösse."
    }
  ];

  const steps = [
    {
      number: "1",
      title: "Registrieren",
      description: "Füllen Sie das Anmeldeformular mit Ihren Firmendaten aus."
    },
    {
      number: "2",
      title: "Freischaltung",
      description: "Wir prüfen Ihre Angaben und schalten Ihren Account innerhalb von 24 Stunden frei."
    },
    {
      number: "3",
      title: "Leads erhalten",
      description: "Sie erhalten qualifizierte Umzugsanfragen direkt in Ihr Dashboard und per E-Mail."
    },
    {
      number: "4",
      title: "Offerte erstellen",
      description: "Kontaktieren Sie die Kunden, erstellen Sie Ihre Offerte und gewinnen Sie den Auftrag."
    }
  ];

  const testimonials = [
    {
      name: "Stefan Müller",
      company: "Müller Umzüge AG",
      canton: "Zürich",
      quote: "Seit wir Partner bei Umzugscheck.ch sind, haben wir 40% mehr Anfragen. Die Qualität der Leads ist ausgezeichnet."
    },
    {
      name: "Andrea Bianchi",
      company: "Bianchi Trasporti",
      canton: "Tessin",
      quote: "Perfekte Plattform für unser Geschäft. Einfache Bedienung und faire Preise. Sehr empfehlenswert!"
    },
    {
      name: "Thomas Gerber",
      company: "Gerber Umzugsservice",
      canton: "Bern",
      quote: "Wir konnten unsere Auslastung deutlich steigern und neue Kunden in der Region gewinnen."
    }
  ];

  const faqs = [
    {
      question: "Was kostet die Partnerschaft?",
      answer: "Die Registrierung ist kostenlos. Sie zahlen nur für erfolgreiche Leads nach einem transparenten Pay-per-Lead-Modell. Preise auf Anfrage."
    },
    {
      question: "Wie viele Leads kann ich erwarten?",
      answer: "Das hängt von Ihrer Region und Ihren Kapazitäten ab. Im Durchschnitt erhalten Partner 8-15 qualifizierte Anfragen pro Monat. Sie können Ihr Lead-Limit selbst festlegen."
    },
    {
      question: "Muss ich alle Anfragen annehmen?",
      answer: "Nein, Sie entscheiden selbst, welche Anfragen Sie bearbeiten möchten. Sie haben volle Kontrolle über Ihre Lead-Präferenzen."
    },
    {
      question: "Wie schnell wird mein Account freigeschaltet?",
      answer: "Nach Ihrer Registrierung prüfen wir Ihre Angaben innerhalb von 24 Stunden und schalten Ihren Account frei."
    },
    {
      question: "Welche Regionen werden unterstützt?",
      answer: "Umzugscheck.ch deckt alle 26 Schweizer Kantone ab. Sie können selbst wählen, in welchen Kantonen Sie Leads erhalten möchten."
    },
    {
      question: "Kann ich meine Daten später ändern?",
      answer: "Ja, Sie können Ihr Profil, Ihre Leistungen und Präferenzen jederzeit über Ihr Partner-Dashboard anpassen."
    }
  ];

  const faqItems = faqs.map(f => ({ question: f.question, answer: f.answer }));

  return (
    <>
      <OptimizedSEO
        title="Partner werden - Mehr Umzugsaufträge für Ihre Firma"
        description="Werden Sie Partner bei Umzugscheck.ch und erhalten Sie qualifizierte Umzugsanfragen aus Ihrer Region. Mehr Aufträge, planbare Auslastung, keine Marketingkosten."
        keywords="umzugsfirma partner, umzugsaufträge, leads umzug, umzugsfirma marketing"
        canonicalUrl="https://umzugscheck.ch/anbieter-werden"
      />

      <div className="min-h-screen flex flex-col">
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="gradient-hero text-white py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Mehr Umzugsaufträge durch Umzugscheck.ch
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-8">
                  Werden Sie Partner und profitieren Sie von qualifizierten Umzugsanfragen aus allen Schweizer Kantonen
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 shadow-premium">
                    <Link to="/anbieter/registrieren">
                      Jetzt als Partner registrieren
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    <Link to="/anbieter/login">
                      Login für Partner
                    </Link>
                  </Button>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 lg:py-24 gradient-light">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Warum Partner werden?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Nutzen Sie die Vorteile der führenden Schweizer Vergleichsplattform für Umzüge
                </p>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {benefits.map((benefit, index) => (
                <ScrollReveal key={index} delay={index * 0.1}>
                  <Card variant="elevated" className="p-6 hover-lift">
                    <div className="mb-4">{benefit.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 lg:py-24 gradient-light">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  So funktioniert die Zusammenarbeit
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  In 4 einfachen Schritten zum erfolgreichen Umzugspartner
                </p>
              </div>
            </ScrollReveal>

            <div className="max-w-4xl mx-auto">
              {steps.map((step, index) => (
                <ScrollReveal key={index} delay={index * 0.1}>
                  <div className="flex gap-6 mb-8 last:mb-0">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                        {step.number}
                      </div>
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-lg text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Stats/Potential */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Ihr Erfolgspotenzial
                </h2>
                <div className="grid md:grid-cols-3 gap-8 mt-12">
                  <div className="p-6">
                    <div className="text-5xl font-bold text-primary mb-2">8-15</div>
                    <p className="text-lg font-semibold mb-1">Leads pro Monat</p>
                    <p className="text-muted-foreground">Durchschnittlich pro Partner</p>
                  </div>
                  <div className="p-6">
                    <div className="text-5xl font-bold text-primary mb-2">40%</div>
                    <p className="text-lg font-semibold mb-1">Mehr Anfragen</p>
                    <p className="text-muted-foreground">Im Vergleich zu vorher</p>
                  </div>
                  <div className="p-6">
                    <div className="text-5xl font-bold text-primary mb-2">24h</div>
                    <p className="text-lg font-semibold mb-1">Schnelle Freischaltung</p>
                    <p className="text-muted-foreground">Nach der Registrierung</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Was unsere Partner sagen
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <ScrollReveal key={index} delay={index * 0.1}>
                  <Card variant="elevated" className="p-6">
                    <p className="text-lg mb-4 italic">"{testimonial.quote}"</p>
                    <div className="border-t pt-4">
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.canton}</p>
                    </div>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 lg:py-24 gradient-light">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="max-w-3xl mx-auto">
                <FAQAccordion
                  items={faqItems}
                  title="Häufige Fragen"
                  subtitle="Antworten für Partner-Interessenten"
                  variant="compact"
                />
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 lg:py-24 gradient-cta text-white">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Starten Sie jetzt durch!
                </h2>
                <p className="text-xl mb-8 opacity-90">
                  Registrieren Sie sich in wenigen Minuten und erhalten Sie schon bald Ihre ersten Anfragen
                </p>
                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 shadow-premium text-lg">
                  <Link to="/anbieter/registrieren">
                    Jetzt kostenlos registrieren
                  </Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </section>
        </main>

        
      </div>
    </>
  );
};

export default BecomeProvider;
