import { motion } from "framer-motion";
import { Shield, Award, Star, Heart, Leaf, CheckCircle } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const TrustLogos = () => {
  const badges = [
    { icon: Shield, label: "Vollversichert", sublabel: "bis CHF 2 Mio." },
    { icon: Award, label: "Swiss Made", sublabel: "Qualität" },
    { icon: Star, label: "5.0 Sterne", sublabel: "Google Rating" },
    { icon: Heart, label: "Familienbetrieb", sublabel: "seit 1980" },
    { icon: Leaf, label: "Umweltbewusst", sublabel: "CO₂-reduziert" },
    { icon: CheckCircle, label: "Festpreis", sublabel: "Garantie" },
  ];

  return (
    <section className="py-10 lg:py-14 border-y border-border bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <p className="text-center text-sm text-muted-foreground mb-6">
            Vertrauen Sie dem Original – seit über 40 Jahren
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
            {badges.map((badge, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3 text-center"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
              >
                <div className="w-10 h-10 rounded-lg bg-alpine/10 flex items-center justify-center">
                  <badge.icon className="h-5 w-5 text-alpine" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm">{badge.label}</p>
                  <p className="text-xs text-muted-foreground">{badge.sublabel}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default TrustLogos;
