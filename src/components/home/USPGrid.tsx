import { Shield, Zap, Award, TrendingDown, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const usps = [
  {
    icon: Shield,
    title: "100% kostenlos",
    description: "Unverbindliche Offerten ohne versteckte Kosten"
  },
  {
    icon: Zap,
    title: "In 2 Minuten",
    description: "Schnell ausfüllen, innerhalb 24h Angebote"
  },
  {
    icon: Award,
    title: "Geprüfte Qualität",
    description: "Nur versicherte und zertifizierte Firmen"
  },
  {
    icon: TrendingDown,
    title: "Bis 40% sparen",
    description: "Durch direkten Preisvergleich"
  }
];

export const USPGrid = () => {
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
            Warum umzugscheck.ch?
          </h2>
          <p className="text-sm md:text-base text-slate-600 max-w-xl mx-auto">
            Die clevere Art, Umzugskosten zu vergleichen
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 max-w-4xl mx-auto mb-8">
          {usps.map((usp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="group bg-gradient-to-b from-slate-50 to-white rounded-xl p-4 md:p-5 border border-slate-100 hover:border-primary/30 hover:shadow-lg transition-all text-center"
            >
              <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-primary/10 group-hover:bg-primary/15 flex items-center justify-center mb-3 mx-auto transition-colors">
                <usp.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <h3 className="text-sm md:text-base font-bold mb-1 text-slate-900">{usp.title}</h3>
              <p className="text-[11px] md:text-xs text-slate-500 leading-relaxed">{usp.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link to="/umzugsrechner">
            <Button size="lg" className="h-11 md:h-12 px-6 md:px-8 text-sm md:text-base font-bold shadow-lg hover:shadow-xl transition-all">
              <CheckCircle className="mr-2 h-4 w-4" />
              Jetzt vergleichen
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
