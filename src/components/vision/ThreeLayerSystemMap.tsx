/**
 * ThreeLayerSystemMap — Capture → Transaction → Expansion
 * Replaces 10 individual pillar cards with one clear architecture view
 */

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowDown, ShieldCheck, ArrowRight, Layers } from "lucide-react";

const LAYERS = [
  {
    title: "CAPTURE",
    subtitle: "Traffic rein",
    color: "from-primary/20 to-primary/10",
    borderColor: "border-primary/40",
    badgeColor: "bg-primary/15 text-primary",
    items: ["SEO & 2'110 Gemeinden", "Preisrechner & Funnels", "KI-Content-Pipeline", "Video-Offerte & AI Scan"],
    icon: Search,
  },
  {
    title: "TRANSACTION",
    subtitle: "Transaktion abgesichert",
    color: "from-secondary/20 to-secondary/10",
    borderColor: "border-secondary/40",
    badgeColor: "bg-secondary/15 text-secondary",
    items: ["Quality-Weighted Matching", "Dynamic Pricing Engine", "Smart Escrow (Treuhand)", "Digitales Übergabeprotokoll", "Echtzeit-Tracking"],
    icon: ShieldCheck,
  },
  {
    title: "EXPANSION",
    subtitle: "Zusatzumsatz hoch",
    color: "from-purple-500/15 to-purple-500/5",
    borderColor: "border-purple-500/30",
    badgeColor: "bg-purple-500/10 text-purple-400",
    items: ["Reinigung + Abnahmegarantie", "Versicherung & Micro-Insurance", "Entsorgung & Circular Economy", "Energie/Internet Switching", "B2B Corporate Relocation"],
    icon: Layers,
  },
];

export function ThreeLayerSystemMap() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 border-secondary/50 text-secondary bg-secondary/5">
            📐 SYSTEM-ARCHITEKTUR
          </Badge>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">
            3 Ebenen statt 10 Einzelkarten
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Traffic rein → Transaktion abgesichert → Zusatzumsatz hoch. So fliesst das Geld.
          </p>
        </motion.div>

        {/* Layers */}
        <div className="max-w-3xl mx-auto space-y-4">
          {LAYERS.map((layer, i) => (
            <motion.div
              key={layer.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <div className={`rounded-2xl border ${layer.borderColor} bg-gradient-to-r ${layer.color} p-5 md:p-6`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg ${layer.badgeColor} flex items-center justify-center`}>
                    <layer.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-foreground">{layer.title}</h3>
                    <p className="text-xs text-muted-foreground">{layer.subtitle}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {layer.items.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-foreground/80">
                      <ArrowRight className="w-3 h-3 text-primary flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Arrow between layers */}
              {i < LAYERS.length - 1 && (
                <div className="flex justify-center py-2">
                  <ArrowDown className="w-6 h-6 text-muted-foreground/40" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom summary */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-muted-foreground italic">
            Jede Ebene ist ein eigenständiger Profit Center. Zusammen ergeben sie <span className="text-primary font-bold">553 CHF pro Kunde</span>.
          </p>
        </motion.div>
      </div>
    </section>
  );
}