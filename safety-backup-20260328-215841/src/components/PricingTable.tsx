import { motion } from "framer-motion";
import { Check, X, LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingTier {
  name: string;
  description: string;
  price: string;
  priceSubtext?: string;
  features: PricingFeature[];
  popular?: boolean;
  icon?: LucideIcon;
  link: string;
}

interface PricingTableProps {
  tiers: PricingTier[];
  className?: string;
}

const PricingTable = ({ tiers, className = "" }: PricingTableProps) => {
  return (
    <div className={`grid md:grid-cols-3 gap-6 lg:gap-8 ${className}`}>
      {tiers.map((tier, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.15 }}
          className={`
            relative rounded-2xl bg-card border-2 overflow-hidden
            ${tier.popular 
              ? "border-primary shadow-glow scale-105" 
              : "border-border shadow-soft hover:shadow-medium hover:border-primary/30"
            }
            transition-all duration-300
          `}
        >
          {/* Popular badge */}
          {tier.popular && (
            <div className="absolute top-0 left-0 right-0 py-2 bg-gradient-to-r from-primary to-alpine text-center">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Beliebt
              </span>
            </div>
          )}

          <div className={`p-6 lg:p-8 ${tier.popular ? "pt-12" : ""}`}>
            {/* Header */}
            <div className="text-center mb-6">
              {tier.icon && (
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                  <tier.icon className="w-7 h-7 text-primary" />
                </div>
              )}
              <h3 className="font-display text-2xl font-bold mb-2">{tier.name}</h3>
              <p className="text-sm text-muted-foreground">{tier.description}</p>
            </div>

            {/* Price */}
            <div className="text-center mb-6 pb-6 border-b border-border">
              <div className="text-4xl font-bold text-foreground mb-1">
                {tier.price}
              </div>
              {tier.priceSubtext && (
                <p className="text-sm text-muted-foreground">{tier.priceSubtext}</p>
              )}
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-8">
              {tier.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  {feature.included ? (
                    <Check className="w-5 h-5 text-forest mt-0.5 flex-shrink-0" />
                  ) : (
                    <X className="w-5 h-5 text-muted-foreground/50 mt-0.5 flex-shrink-0" />
                  )}
                  <span className={feature.included ? "text-foreground" : "text-muted-foreground/50"}>
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Button
              asChild
              className={`w-full ${tier.popular ? "bg-gradient-to-r from-primary to-alpine text-white" : ""}`}
              variant={tier.popular ? "default" : "outline"}
            >
              <Link to={tier.link}>Jetzt anfragen</Link>
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default PricingTable;
