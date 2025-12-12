import { memo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, TrendingDown, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const comparisons = [
  { size: "2.5 Zi.", from: "CHF 1'800", to: "CHF 1'200", savings: "33%" },
  { size: "3.5 Zi.", from: "CHF 2'500", to: "CHF 1'700", savings: "32%" },
  { size: "4.5 Zi.", from: "CHF 3'200", to: "CHF 2'100", savings: "34%" },
];

export const PriceComparisonTeaser = memo(function PriceComparisonTeaser() {
  const navigate = useNavigate();

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-muted/30 to-transparent">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Echte Einsparungen unserer Kunden
          </h2>
          <p className="text-muted-foreground">
            Durchschnittliche Preisvergleiche der letzten 30 Tage
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {comparisons.map((item, index) => (
            <motion.div
              key={item.size}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl border border-border p-5 text-center"
            >
              <div className="text-sm text-muted-foreground mb-2">{item.size} Wohnung</div>
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="text-muted-foreground line-through">{item.from}</span>
                <ArrowRight className="w-4 h-4 text-primary" />
                <span className="text-xl font-bold text-secondary">{item.to}</span>
              </div>
              <div className="inline-flex items-center gap-1 bg-green-500/10 text-green-600 text-sm font-medium px-3 py-1 rounded-full">
                <TrendingDown className="w-3.5 h-3.5" />
                {item.savings} gespart
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            className="bg-secondary hover:bg-secondary/90"
            onClick={() => navigate('/umzugsofferten')}
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Mein Sparpotenzial berechnen
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
});
