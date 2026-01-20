import { SEOHead } from "@/components/SEOHead";
import { Vision10PillarSection } from "@/components/homepage/Vision10PillarSection";
import { CustomerUSPVisualCards } from "@/components/homepage/CustomerUSPVisualCards";
import { FamilySummary } from "@/components/homepage/FamilySummary";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function VisionPage() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        pageType="home"
        url="https://umzugscheck.ch/vision"
      />

      {/* Simple Header */}
      <div className="container mx-auto px-4 py-6">
        <Link to="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zur Hauptseite
          </Button>
        </Link>
      </div>

      {/* Hero for Vision Page */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            Interne Präsentation
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Umzugscheck.ch Vision
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Die vollständige Übersicht für Familie und Investoren – 
            was wir bauen, warum es funktioniert und wohin die Reise geht.
          </p>
        </div>
      </section>

      {/* 10 Kunden-USPs - Visuelle Infografik-Karten */}
      <ScrollReveal>
        <CustomerUSPVisualCards />
      </ScrollReveal>

      {/* Vision 10 Pillars - Kunden & Investoren USPs (Tabs) */}
      <ScrollReveal>
        <Vision10PillarSection />
      </ScrollReveal>

      {/* Eltern-Zusammenfassung */}
      <ScrollReveal>
        <FamilySummary />
      </ScrollReveal>

      {/* Footer CTA */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground mb-4">
            Fragen? Sprich mich einfach an.
          </p>
          <Link to="/">
            <Button size="lg">
              Zur Hauptseite
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
