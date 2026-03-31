/**
 * NarrativeMoatSection — "Why Now?" + Growth Flywheel + Narrative Moat
 * Three blocks in one section showing scalability and defensibility
 */

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, Globe, Cpu, Building, Megaphone, 
  ArrowRight, RefreshCw, Search, Star, BarChart3, Users 
} from "lucide-react";

const WHY_NOW = [
  { icon: Building, title: "Fragmentierter Markt", desc: "Tausende kleine Firmen, kein Standard, keine Transparenz." },
  { icon: Cpu, title: "KI-Timing perfekt", desc: "Erst 2025/26 sind LLMs gut genug für autonome Workflows." },
  { icon: Globe, title: "Schweiz = härtester Testmarkt", desc: "Wenn es hier funktioniert, funktioniert es überall." },
  { icon: TrendingUp, title: "Content + Automation + Bundling", desc: "Diese Kombination war vorher technisch nicht möglich." },
];

const FLYWHEEL_STEPS = [
  { icon: Search, label: "SEO & Content" },
  { icon: Users, label: "High-Intent Traffic" },
  { icon: TrendingUp, label: "Beste Funnels" },
  { icon: Star, label: "Mehr Jobs & Reviews" },
  { icon: BarChart3, label: "Mehr Daten & Trust" },
  { icon: Megaphone, label: "Bessere Rankings & PR" },
];

export function NarrativeMoatSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        
        {/* === WHY NOW === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <Badge variant="outline" className="mb-4 border-secondary/50 text-secondary bg-secondary/5">
            ⏰ WHY NOW?
          </Badge>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">
            Warum genau jetzt?
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16">
          {WHY_NOW.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-xl border border-border bg-card text-center"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                <item.icon className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-foreground mb-1">{item.title}</h4>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* === GROWTH FLYWHEEL === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <Badge variant="outline" className="mb-4 border-primary/50 text-primary bg-primary/5">
            🔄 GROWTH FLYWHEEL
          </Badge>
          <h2 className="text-2xl md:text-3xl font-black text-foreground mb-3">
            Selbstverstärkender Wachstumskreislauf
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto mb-16">
          <div className="relative rounded-2xl border border-primary/20 bg-card p-6 md:p-8">
            {/* Circular flywheel visualization */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {FLYWHEEL_STEPS.map((step, i) => (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="flex items-center gap-2"
                >
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary/10 border border-primary/20">
                    <step.icon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">{step.label}</span>
                  </div>
                  {i < FLYWHEEL_STEPS.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-primary/40 hidden sm:block" />
                  )}
                </motion.div>
              ))}
              {/* Loop arrow */}
              <div className="flex items-center">
                <RefreshCw className="w-5 h-5 text-secondary" />
              </div>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-4 italic">
              Jeder Durchlauf senkt die Akquisekosten und erhöht den Datenvorteil.
            </p>
          </div>
        </div>

        {/* === NARRATIVE MOAT === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="rounded-2xl border border-secondary/30 bg-gradient-to-br from-secondary/5 to-primary/5 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <Megaphone className="w-6 h-6 text-secondary" />
              <h3 className="text-xl font-black text-foreground">Narrative Moat</h3>
            </div>
            <p className="text-foreground/80 mb-4 leading-relaxed">
              Das Projekt selbst ist ein Vertriebs-, PR- und Backlink-Asset. Die Kombination aus 
              KI-getriebener Produktentwicklung, radikaler Automatisierung und einem schwer 
              digitalisierbaren Service-Markt schafft <span className="text-primary font-bold">Earned Media</span> und 
              internationale Aufmerksamkeit als kostengünstigen Wachstumstreiber.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: "Story", value: "KI baut realen Service" },
                { label: "Markt", value: "Schweiz = härtester Test" },
                { label: "Reach", value: "Global via PR & Awards" },
              ].map((item) => (
                <div key={item.label} className="p-3 rounded-lg bg-background/80 text-center">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-bold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}