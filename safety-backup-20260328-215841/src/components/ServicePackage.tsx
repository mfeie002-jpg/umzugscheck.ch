import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ServicePackageProps {
  name: string;
  tagline: string;
  description: string;
  features: string[];
  highlight?: boolean;
  link: string;
  badge?: string;
  delay?: number;
}

const ServicePackage = ({
  name,
  tagline,
  description,
  features,
  highlight = false,
  link,
  badge,
  delay = 0,
}: ServicePackageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className={`relative rounded-2xl overflow-hidden ${
        highlight
          ? "border-2 border-primary shadow-glow bg-gradient-to-b from-primary/5 to-card"
          : "border border-border bg-card shadow-soft hover:shadow-medium"
      } transition-all duration-300`}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute top-0 left-0 right-0 py-2 bg-gradient-to-r from-warm to-warm/80 text-center">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3" />
            {badge}
          </span>
        </div>
      )}

      <div className={`p-6 md:p-8 ${badge ? "pt-12" : ""}`}>
        {/* Header */}
        <div className="mb-6">
          <h3 className="font-display text-2xl font-bold mb-2">{name}</h3>
          <p className="text-primary font-medium text-sm">{tagline}</p>
        </div>

        {/* Description */}
        <p className="text-muted-foreground leading-relaxed mb-6">
          {description}
        </p>

        {/* Features */}
        <ul className="space-y-3 mb-8">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-forest mt-0.5 flex-shrink-0" />
              <span className="text-foreground">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Button
          asChild
          className={`w-full ${
            highlight
              ? "bg-gradient-to-r from-primary to-alpine text-white hover:opacity-90"
              : ""
          }`}
          variant={highlight ? "default" : "outline"}
        >
          <Link to={link}>Mehr erfahren</Link>
        </Button>
      </div>
    </motion.div>
  );
};

export default ServicePackage;
