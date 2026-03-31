/**
 * BusinessCaseOverviewSection — Destillierter Business Case
 * Zwei Projekte. Ein Ökosystem. PDF-Download.
 */
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Shield, TrendingUp, Layers, ArrowRight } from "lucide-react";

const advantages = [
  {
    icon: Shield,
    title: "Glaubwürdigkeit durch Trennung",
    description: "Umzugscheck bleibt als Vergleichsportal neutral und unabhängig. Feierabend liefert separat — ohne Interessenkonflikt. Kunden vertrauen dem Vergleich, weil er nicht vom Anbieter kommt.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: TrendingUp,
    title: "Zero CAC für Feierabend",
    description: "Feierabend Services bekommt qualifizierte Kunden organisch über das Portal — ohne eigene Werbeausgaben. Jeder Lead, den Umzugscheck generiert, kann auch intern bedient werden.",
    color: "text-[#FF6B1A]",
    bg: "bg-[#FF6B1A]/10",
  },
  {
    icon: Layers,
    title: "Doppelter Einkommensstrom",
    description: "Umzugscheck verdient an Vermittlung, Vergleich und Plattform-Marge. Feierabend verdient an operativer Ausführung und Premium-Services. Zwei Margen aus demselben Markt.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
];

const synergyLeft = [
  "Reichweite & SEO-Traffic",
  "Qualifizierte Leads",
  "Markt- & Preisdaten",
  "KI-Automatisierung",
  "Skalierung über Regionen",
];

const synergyRight = [
  "40+ Jahre Erfahrung",
  "Operative Exzellenz",
  "Praxiswissen & Feedback",
  "Premium-Positionierung",
  "Proof of Concept",
];

export function BusinessCaseOverviewSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-primary/10 text-primary">Business Case</Badge>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
            Zwei Projekte. Ein Ökosystem.
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Der Schweizer Umzugsmarkt ist intransparent und fragmentiert. Unsere Lösung trennt bewusst Vergleich und Ausführung — 
            und verbindet beides durch KI.{" "}
            <span className="font-semibold text-foreground">
              Umzugscheck bringt die Kunden. Feierabend macht die Arbeit.
            </span>
          </p>
        </motion.div>

        {/* 3 Advantage Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {advantages.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow"
            >
              <div className={`w-12 h-12 rounded-lg ${item.bg} flex items-center justify-center mb-4`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Synergy Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-xl font-bold text-center text-foreground mb-6">
            Was jede Seite einbringt
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Umzugscheck Column */}
            <div className="bg-card rounded-xl border border-primary/20 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-lg">🔍</span>
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Umzugscheck.ch</h4>
                  <p className="text-xs text-muted-foreground">Vergleichsportal & Lead-Engine</p>
                </div>
              </div>
              <ul className="space-y-3">
                {synergyLeft.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ArrowRight className="w-4 h-4 text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Feierabend Column */}
            <div className="bg-card rounded-xl border border-[#FF6B1A]/20 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#FF6B1A]/10 flex items-center justify-center">
                  <span className="text-lg">🚚</span>
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Feierabend Services</h4>
                  <p className="text-xs text-muted-foreground">Operativer Dienstleister</p>
                </div>
              </div>
              <ul className="space-y-3">
                {synergyRight.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ArrowRight className="w-4 h-4 text-[#FF6B1A] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Download CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <a href="/business-case-umzugscheck-feierabend.pdf" download>
            <Button size="lg" variant="outline" className="gap-2 border-primary/30 hover:bg-primary/5">
              <Download className="w-5 h-5" />
              Business Case herunterladen (PDF)
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
