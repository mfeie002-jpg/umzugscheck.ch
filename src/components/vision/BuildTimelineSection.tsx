/**
 * BuildTimelineSection — Shows Nov 2025–Mar 2026 build progress
 * SVG timeline + Founder Stats block
 */

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Code2, FileText, Globe, Layers, Rocket } from "lucide-react";

const MONTHS = [
  { month: "Nov 2025", label: "Konzept & Architektur", icon: Layers, detail: "Positionierung, Marktanalyse, Tech-Stack, Domänen" },
  { month: "Dez 2025", label: "Funnel & Angebotslogik", icon: Code2, detail: "Vergleichslogik, Preisrechner, Servicestruktur" },
  { month: "Jan 2026", label: "Plattform live", icon: Globe, detail: "Domain, SSL, erste Module, CMS, Datenbank" },
  { month: "Feb 2026", label: "Content & SEO-Basis", icon: FileText, detail: "26 Städte, 10 Rechner, lokale Struktur, Blog" },
  { month: "Mär 2026", label: "System steht", icon: Rocket, detail: "Tracking, Automation, Proof, 60 Funnels getestet" },
];

const FOUNDER_STATS = [
  { value: "130+", label: "Seiten live" },
  { value: "26", label: "Städte" },
  { value: "10", label: "Rechner" },
  { value: "2'903+", label: "Entwicklungsstunden" },
  { value: "60", label: "Funnel-Varianten" },
  { value: "95%", label: "KI-Automatisiert" },
];

export function BuildTimelineSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 border-primary/50 text-primary bg-primary/5">
            ✅ PHASE 0 — BEREITS GELEISTET
          </Badge>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">
            Was bereits gebaut wurde
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            5 Monate Vollzeit. Kein Gehalt. 100% Eigeninvestition. Die Maschine steht.
          </p>
        </motion.div>

        {/* SVG Timeline */}
        <div className="max-w-4xl mx-auto mb-14">
          <div className="relative">
            {/* Horizontal line */}
            <div className="absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-secondary rounded-full hidden md:block" />
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-2">
              {MONTHS.map((m, i) => (
                <motion.div
                  key={m.month}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Node */}
                  <div className="w-16 h-16 rounded-full bg-primary/15 border-2 border-primary flex items-center justify-center mb-3 relative z-10">
                    <m.icon className="w-7 h-7 text-primary" />
                  </div>
                  
                  {/* Month */}
                  <span className="text-xs font-bold text-primary mb-1">{m.month}</span>
                  
                  {/* Label */}
                  <h4 className="text-sm font-semibold text-foreground mb-1">{m.label}</h4>
                  
                  {/* Detail */}
                  <p className="text-xs text-muted-foreground leading-relaxed">{m.detail}</p>
                  
                  {/* Check */}
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-2" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Founder Stats Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="rounded-2xl border border-primary/20 bg-card p-6 md:p-8">
            <h3 className="text-center text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6">
              Founder Built First — Die Zahlen
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {FOUNDER_STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="text-center p-3 rounded-xl bg-muted/50"
                >
                  <p className="text-2xl md:text-3xl font-black text-primary">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-6 italic">
              «Der Motor ist gebaut. Jetzt braucht er Benzin.»
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}