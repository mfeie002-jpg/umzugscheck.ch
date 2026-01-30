/**
 * Champion A: Ultra Low-Friction Paid Landing Page (Speed-to-Lead)
 * 
 * Purpose: Paid search default (high-intent keywords)
 * Target Keywords: "umzugsfirma zürich", "umzugsofferte", "umzug offerte online"
 * Focus: Fast form completion → Lead capture
 * 
 * Branding: Umzugscheck.ch (Portal for multiple providers)
 */

import { Helmet } from "react-helmet-async";
import { DynamicNavigation } from "@/components/DynamicNavigation";
import Footer from "@/components/Footer";
import { ExpressQuoteForm } from "@/components/ExpressQuoteForm";
import { Card } from "@/components/ui/card";
import { track } from "@/utils/track";
import { Phone, Shield, Zap, CheckCircle, Clock, Users } from "lucide-react";

type FormData = {
  phone: string;
  startPlz: string;
  endPlz: string;
  moveDate?: string;
};

const ChampionQuickFlow = () => {
  const handleFormComplete = (data: FormData) => {
    track("lead_submitted", {
      funnel: "champion_quick_flow",
      start_plz: data.startPlz,
      end_plz: data.endPlz,
      move_date: data.moveDate,
    });
    window.location.href = "/booking?source=champion_quick_flow";
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Umzugsofferte in 2 Min | Umzugscheck.ch - Kostenlos vergleichen</title>
        <meta
          name="description"
          content="Erhalten Sie in 2 Minuten bis zu 3 Offerten von geprüften Umzugsfirmen. Kostenlos vergleichen und sparen."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://umzugscheck.ch/champion-quick-flow" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Umzugscheck.ch - Umzugsofferten vergleichen",
            description: "Schweizer Vergleichsportal für Umzugsfirmen",
            url: "https://umzugscheck.ch/champion-quick-flow",
          })}
        </script>
      </Helmet>

      <DynamicNavigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative isolate bg-gradient-to-br from-secondary/30 via-background to-background pt-16 pb-12 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              Umzugsofferten in <span className="text-primary">2 Minuten</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Kostenlos • Unverbindlich • Bis zu 3 Angebote vergleichen
            </p>

            {/* Trust Badges Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-muted/50 border border-border">
                <Phone className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground">Hotline Mo–Fr 08–18 Uhr</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-muted/50 border border-border">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground">100% Kostenlos</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-muted/50 border border-border">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground">Sofort Offerten</span>
              </div>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-12 px-4 bg-background">
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 border-2 border-primary/20 shadow-lg">
              <ExpressQuoteForm onComplete={handleFormComplete} />
            </Card>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 px-4 bg-muted/30">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center text-foreground">Warum Umzugscheck.ch?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Users, title: "500+ Partner", desc: "Geprüfte Umzugsfirmen schweizweit" },
                { icon: CheckCircle, title: "Gratis vergleichen", desc: "Keine versteckten Kosten" },
                { icon: Clock, title: "Schnell & einfach", desc: "Offerten in wenigen Minuten" },
              ].map((item, i) => (
                <Card key={i} className="p-6 border-border bg-card">
                  <item.icon className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-12 px-4 bg-primary/5">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Noch Fragen?</h2>
            <p className="text-muted-foreground mb-6">
              Rufen Sie uns an — wir beraten Sie gerne und unverbindlich.
            </p>
            <a
              href="tel:+41445678900"
              onClick={() => track("cta_call_click", { location: "banner", funnel: "champion_quick_flow" })}
              className="inline-block px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors"
            >
              +41 44 567 89 00
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ChampionQuickFlow;
