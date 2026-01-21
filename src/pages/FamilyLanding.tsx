/**
 * Family Landing Page
 * Dedizierte Seite für Eltern/Familie - einfach erklärt
 */

import { SEOHead } from "@/components/SEOHead";
import { CustomerUSPVisualCards } from "@/components/homepage/CustomerUSPVisualCards";
import { FamilySummary } from "@/components/homepage/FamilySummary";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Users, Sparkles, Home, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function FamilyLanding() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        pageType="home"
        url="https://umzugscheck.ch/family"
      />

      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Zurück
              </Button>
            </Link>
            <Link to="/vision">
              <Button variant="outline" size="sm">
                Vollständige Vision
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
              <Heart className="w-4 h-4" />
              Für die Familie
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6">
              Was ich <span className="text-primary">baue</span> 🚀
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Eine einfache Erklärung für Mama, Papa und alle, 
              <br className="hidden md:block" />
              die verstehen wollen, woran ich arbeite.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Facts */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { icon: Home, label: "Seit", value: "31.10.2024" },
              { icon: Sparkles, label: "Komponenten", value: "370+" },
              { icon: Users, label: "Seiten", value: "130+" },
              { icon: CheckCircle2, label: "Fortschritt", value: "85%" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border rounded-xl p-4 text-center"
              >
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-black text-primary">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Family Summary - Main Content */}
      <FamilySummary />

      {/* 10 Customer Benefits */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
              10 Vorteile für Kunden
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Was unsere Nutzer bekommen – alles aus einer Hand, vollautomatisiert.
            </p>
          </div>
          <CustomerUSPVisualCards />
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground mb-4">
            Noch Fragen? Hier gibt es mehr Details:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/vision">
              <Button size="lg">
                Vollständige Vision ansehen
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" size="lg">
                Zur Hauptseite
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
