import { motion } from "framer-motion";
import { Star, Users, Award, TrendingUp, CheckCircle } from "lucide-react";

interface CantonSocialProofProps {
  cantonName: string;
  stats?: {
    rating: number;
    customers: number;
    companies: number;
    savings: number;
  };
}

export const CantonSocialProof = ({ 
  cantonName, 
  stats = { rating: 4.8, customers: 2500, companies: 45, savings: 35 } 
}: CantonSocialProofProps) => {
  const proofs = [
    { icon: Star, value: `${stats.rating}/5`, label: "Durchschnittsbewertung", color: "text-yellow-500" },
    { icon: Users, value: `${stats.customers.toLocaleString()}+`, label: "Zufriedene Kunden", color: "text-primary" },
    { icon: Award, value: `${stats.companies}+`, label: "Geprüfte Firmen", color: "text-accent" },
    { icon: TrendingUp, value: `${stats.savings}%`, label: "Durchschnittl. Ersparnis", color: "text-success" },
  ];

  return (
    <section className="py-10 bg-gradient-to-r from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h3 className="text-lg font-semibold mb-2">Vertrauen Sie auf Erfahrung</h3>
          <p className="text-sm text-muted-foreground">Tausende {cantonName}er haben bereits mit uns verglichen</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {proofs.map((proof, i) => {
            const Icon = proof.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className={`w-12 h-12 rounded-xl bg-card border border-border/50 flex items-center justify-center mx-auto mb-3 shadow-sm`}>
                  <Icon className={`h-6 w-6 ${proof.color}`} />
                </div>
                <p className="text-2xl font-bold">{proof.value}</p>
                <p className="text-xs text-muted-foreground">{proof.label}</p>
              </motion.div>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-success" />100% kostenlos</span>
          <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-success" />Keine Verpflichtung</span>
          <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-success" />Swiss Made</span>
        </div>
      </div>
    </section>
  );
};
