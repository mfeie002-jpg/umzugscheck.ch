import { Home, Building2, Warehouse } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const examples = [
  {
    icon: Home,
    title: "2-Zimmer Wohnung",
    details: "30m², Zürich → Bern",
    priceRange: "CHF 650 – 1'200",
    features: ["2 Umzugshelfer", "1 Umzugswagen", "4-6 Stunden"]
  },
  {
    icon: Building2,
    title: "4-Zimmer Wohnung",
    details: "90m², Basel → Luzern",
    priceRange: "CHF 1'800 – 2'800",
    features: ["3-4 Umzugshelfer", "1 LKW", "8-10 Stunden"]
  },
  {
    icon: Warehouse,
    title: "Einfamilienhaus",
    details: "150m², Genf → Zürich",
    priceRange: "CHF 3'500 – 5'500",
    features: ["4-5 Umzugshelfer", "2 LKWs", "12-14 Stunden"]
  }
];

export const CostExamples = () => {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-10"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3 text-slate-900">
            Kostenbeispiele
          </h2>
          <p className="text-sm md:text-base text-slate-600 max-w-xl mx-auto">
            Transparente Preise für typische Umzüge in der Schweiz
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto mb-8">
          {examples.map((example, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="bg-gradient-to-b from-slate-50 to-white rounded-xl p-5 md:p-6 border border-slate-100 hover:border-primary/30 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <example.icon className="h-6 w-6 md:h-7 md:w-7 text-primary" />
              </div>
              
              <h3 className="text-lg md:text-xl font-bold text-center mb-1 text-slate-900">{example.title}</h3>
              <p className="text-slate-500 text-center text-xs md:text-sm mb-3">{example.details}</p>
              
              <div className="bg-primary/5 rounded-lg p-3 mb-4 text-center border border-primary/10">
                <div className="text-xl md:text-2xl font-bold text-primary">{example.priceRange}</div>
              </div>

              <ul className="space-y-1.5">
                {example.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs md:text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    <span className="text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/umzugsrechner">
            <Button size="lg" className="h-11 md:h-12 px-6 md:px-8 text-sm md:text-base font-bold shadow-lg hover:shadow-xl transition-all">
              Meinen Preis berechnen
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
