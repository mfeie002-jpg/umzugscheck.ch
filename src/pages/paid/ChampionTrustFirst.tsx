/**
 * Champion B: Trust-First Landing Page (Cold Traffic)
 * 
 * Purpose: Retargeting + brand awareness keywords
 * Target Keywords: "umzugsfirma in der nähe", "zügeln zürich", "umzug+reinigung"
 * Focus: Build confidence → Social proof → Lead capture
 * 
 * Branding: Umzugscheck.ch (Portal for multiple providers)
 */

import { Helmet } from "react-helmet-async";
import { DynamicNavigation } from "@/components/DynamicNavigation";
import Footer from "@/components/Footer";
import { ExpressQuoteForm } from "@/components/ExpressQuoteForm";
import { Card } from "@/components/ui/card";
import { track } from "@/utils/track";
import { Star, Users, Award, MapPin, Shield, Clock, CheckCircle } from "lucide-react";

type FormData = {
  phone: string;
  startPlz: string;
  endPlz: string;
  moveDate?: string;
};

const ChampionTrustFirst = () => {
  const handleFormComplete = (data: FormData) => {
    track("lead_submitted", {
      funnel: "champion_trust_first",
      start_plz: data.startPlz,
      end_plz: data.endPlz,
      move_date: data.moveDate,
    });
    window.location.href = "/booking?source=champion_trust_first";
  };

  const testimonials = [
    {
      name: "Maria K., Zürich",
      quote: "Über Umzugscheck drei Offerten erhalten – super einfach und transparent!",
      rating: 5,
    },
    {
      name: "Hans M., Bern",
      quote: "Konnte schnell vergleichen und den passenden Anbieter finden. Top Service!",
      rating: 5,
    },
    {
      name: "Petra S., Basel",
      quote: "Endlich eine Plattform, die wirklich hält was sie verspricht. Sehr empfehlenswert!",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Umzugsfirmen vergleichen | Umzugscheck.ch - Gratis Offerten</title>
        <meta
          name="description"
          content="Vergleichen Sie kostenlos Umzugsfirmen in Ihrer Region. 500+ geprüfte Partner, transparente Preise, Schweizer Qualität."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://umzugscheck.ch/champion-trust-first" />
      </Helmet>

      <DynamicNavigation />

      <main className="flex-1">
        {/* Hero with Social Proof */}
        <section className="relative isolate bg-gradient-to-b from-secondary/30 via-background to-background pt-20 pb-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
                Umzugsfirmen <span className="text-primary">vergleichen</span> & sparen
              </h1>
              <p className="text-xl text-muted-foreground">
                500+ geprüfte Umzugsfirmen • Kostenlose Offerten • Schweizer Qualität
              </p>
            </div>

            {/* Trust Numbers */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <Card className="p-6 text-center border-border bg-card">
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <p className="text-muted-foreground">Partner-Firmen</p>
              </Card>
              <Card className="p-6 text-center border-border bg-card">
                <div className="text-4xl font-bold text-foreground mb-2">4.8★</div>
                <p className="text-muted-foreground">Kundenbewertung</p>
              </Card>
              <Card className="p-6 text-center border-border bg-card">
                <div className="text-4xl font-bold text-foreground mb-2">3</div>
                <p className="text-muted-foreground">Offerten gratis</p>
              </Card>
              <Card className="p-6 text-center border-border bg-card">
                <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
                <p className="text-muted-foreground">Kostenlos</p>
              </Card>
            </div>

            {/* Trust Badges */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border">
                <Award className="w-6 h-6 text-primary" />
                <span className="font-medium text-foreground">Geprüfte Anbieter</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border">
                <Shield className="w-6 h-6 text-primary" />
                <span className="font-medium text-foreground">Schweizer Qualität</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border">
                <MapPin className="w-6 h-6 text-primary" />
                <span className="font-medium text-foreground">Alle Kantone</span>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 px-4 bg-background">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Das sagen unsere Nutzer</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, i) => (
                <Card key={i} className="p-6 border-border bg-card">
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">So funktioniert's</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "1", title: "Anfrage stellen", desc: "Füllen Sie das kurze Formular aus" },
                { step: "2", title: "Offerten erhalten", desc: "Bis zu 3 Angebote von geprüften Firmen" },
                { step: "3", title: "Vergleichen & buchen", desc: "Wählen Sie das beste Angebot" },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-16 px-4 bg-background">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Jetzt Gratis Offerten erhalten</h2>
            <Card className="p-8 border-2 border-primary/20 shadow-lg">
              <ExpressQuoteForm onComplete={handleFormComplete} />
            </Card>
          </div>
        </section>

        {/* Call-to-Action Banner */}
        <section className="py-16 px-4 bg-primary/5">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Persönliche Beratung gewünscht?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Unser Team hilft Ihnen gerne bei der Auswahl der richtigen Umzugsfirma.
            </p>
            <a
              href="tel:+41445678900"
              onClick={() => track("cta_call_click", { location: "banner", funnel: "champion_trust_first" })}
              className="inline-block px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors text-lg"
            >
              Jetzt Anrufen: +41 44 567 89 00
            </a>
            <p className="text-sm text-muted-foreground mt-4">Mo–Fr: 08:00–18:00 Uhr</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ChampionTrustFirst;
