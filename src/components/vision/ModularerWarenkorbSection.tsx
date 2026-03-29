/**
 * ModularerWarenkorbSection — Cross-Selling AOV visualization
 * Shows how a single lead generates CHF 2,660+ through modular upselling
 */
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Truck, SprayCan, Trash2, Package, Plus, ArrowRight, TrendingUp,
} from "lucide-react";

const modules = [
  { icon: Truck, label: "Basis-Umzug (3 Zimmer)", price: 1650, note: "Standard-Auftrag", highlight: false },
  { icon: SprayCan, label: "Endreinigung (Upsell)", price: 450, note: "Sehr hohe Marge", highlight: true },
  { icon: Trash2, label: "Räumung/Entsorgung (Upsell)", price: 300, note: "Eigener Service (Feierabend)", highlight: true },
  { icon: Package, label: "Packservice & Kartons (Upsell)", price: 260, note: "Reiner Profit", highlight: true },
];

const totalAOV = modules.reduce((sum, m) => sum + m.price, 0);

export function ModularerWarenkorbSection() {
  return (
    <section className="py-16 md:py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <Badge className="mb-4 bg-primary/10 text-primary">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            Unit Economics
          </Badge>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">
            Der modulare Warenkorb
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Die Konkurrenz verkauft einen Umzug. Wir verkaufen ein Ökosystem.
            Ein Lead ist nicht ein Auftrag — er ist der Einstieg in eine Service-Kette.
          </p>
        </motion.div>

        {/* Module Cards */}
        <div className="space-y-3 mb-8">
          {modules.map((mod, i) => (
            <motion.div
              key={mod.label}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`flex items-center gap-4 rounded-xl border p-4 ${
                mod.highlight
                  ? "border-primary/30 bg-primary/5"
                  : "border-border bg-card"
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                mod.highlight ? "bg-primary/20" : "bg-muted"
              }`}>
                <mod.icon className={`w-5 h-5 ${mod.highlight ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm">{mod.label}</p>
                <p className="text-xs text-muted-foreground">{mod.note}</p>
              </div>
              {i > 0 && (
                <Plus className="w-4 h-4 text-primary/40 flex-shrink-0 mr-2" />
              )}
              <span className={`text-lg font-black flex-shrink-0 ${
                mod.highlight ? "text-primary" : "text-foreground"
              }`}>
                CHF {mod.price.toLocaleString("de-CH")}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Total AOV */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border-2 border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div>
            <p className="text-sm font-medium text-muted-foreground">Totaler Kundenwert (AOV)</p>
            <p className="text-3xl md:text-4xl font-black text-primary">
              CHF {totalAOV.toLocaleString("de-CH")}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowRight className="w-4 h-4 text-primary" />
            <span>Der wahre Wert eines einzigen Leads</span>
          </div>
        </motion.div>

        <p className="text-center text-xs text-muted-foreground/60 mt-4 italic">
          Bei 10–15% branchenüblicher CAC = bis CHF 375 Akquisebudget pro Vollauftrag.
          Verkauft an 3–5 Firmen sinkt der CPL pro Firma auf CHF 40–70.
        </p>
      </div>
    </section>
  );
}
