/**
 * Investoren Landing Page
 * Dedizierte Seite für Investoren - Business-fokussiert
 */

import { SEOHead } from "@/components/SEOHead";
import { Vision10PillarSection } from "@/components/homepage/Vision10PillarSection";
import { RevenueStreamExamples } from "@/components/vision/RevenueStreamExamples";
import { UnitEconomicsDetailed } from "@/components/vision/UnitEconomicsDetailed";
import { MarketPotentialSection } from "@/components/vision/MarketPotentialSection";
import { ExitTimeline } from "@/components/vision/ExitTimeline";
import { VisionUniqueness } from "@/components/vision/VisionUniqueness";
import { VisionProgressMilestones } from "@/components/vision/VisionProgressMilestones";
import { ContributionBreakdown } from "@/components/vision/ContributionBreakdown";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, Target, DollarSign, Rocket, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function InvestorenLanding() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        pageType="home"
        url="https://umzugscheck.ch/investoren"
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
              <TrendingUp className="w-4 h-4" />
              Investor Hub
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6">
              <span className="text-primary">Umzugscheck.ch</span>
              <br />
              Investment Opportunity
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Die intelligenteste Umzugs-Plattform der Schweiz mit 10 Einnahmequellen, 
              90%+ Marge und First-Mover-Advantage.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Key Metrics Banner */}
      <section className="py-8 border-b bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {[
              { icon: DollarSign, label: "Revenue/Kunde", value: "553 CHF" },
              { icon: Target, label: "Contribution Margin", value: ">90%" },
              { icon: Building2, label: "Revenue Streams", value: "10" },
              { icon: Rocket, label: "Automatisierung", value: "95%" },
              { icon: TrendingUp, label: "Marktpotenzial", value: "450k/Jahr" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-background border rounded-xl p-4 text-center"
              >
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-xl md:text-2xl font-black text-primary">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Progress Section */}
      <section className="py-12">
        <VisionProgressMilestones language="de" />
        <ContributionBreakdown language="de" />
      </section>

      {/* 10 Business Pillars */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-primary/10 text-primary">Business Model</Badge>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
              10 Strategische Säulen
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Jede Säule ist ein eigenständiger Profit Center mit klarer Unit Economics.
            </p>
          </div>
          <Vision10PillarSection allExpanded={false} />
        </div>
      </section>

      {/* Revenue Streams */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-primary/10 text-primary">553 CHF/Kunde</Badge>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
              10 Einnahmequellen im Detail
            </h2>
          </div>
          <RevenueStreamExamples language="de" />
        </div>
      </section>

      {/* Unit Economics */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-primary/10 text-primary">90%+ Marge</Badge>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
              Unit Economics: Wie wir Geld verdienen
            </h2>
          </div>
          <UnitEconomicsDetailed language="de" />
        </div>
      </section>

      {/* Market Potential */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-primary/10 text-primary">450k Umzüge/Jahr</Badge>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
              Marktpotenzial Schweiz
            </h2>
          </div>
          <MarketPotentialSection language="de" />
        </div>
      </section>

      {/* Uniqueness */}
      <ScrollReveal>
        <VisionUniqueness language="de" />
      </ScrollReveal>

      {/* Exit Timeline */}
      <ScrollReveal>
        <ExitTimeline language="de" />
      </ScrollReveal>

      {/* Footer CTA */}
      <section className="py-12 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Interessiert?</h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Wir sind offen für Gespräche über strategische Partnerschaften und Investments.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/vision">
              <Button size="lg">
                Vollständige Vision ansehen
              </Button>
            </Link>
            <Link to="/family">
              <Button variant="outline" size="lg">
                Einfache Erklärung (Familie)
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
