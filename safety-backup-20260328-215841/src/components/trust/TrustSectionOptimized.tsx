/**
 * Trust Section Component
 * Repositioned for maximum conversion impact
 */
import { memo } from "react";
import { motion } from "framer-motion";
import { Shield, Users, Star, Award, CheckCircle, Clock, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrustSectionProps {
  variant?: 'hero' | 'inline' | 'full';
  className?: string;
}

const trustMetrics = [
  { 
    icon: Users, 
    value: '2,847+', 
    label: 'Zufriedene Kunden', 
    color: 'text-primary' 
  },
  { 
    icon: Shield, 
    value: '200+', 
    label: 'Geprüfte Firmen', 
    color: 'text-emerald-600' 
  },
  { 
    icon: Star, 
    value: '4.8/5', 
    label: 'Durchschn. Bewertung', 
    color: 'text-amber-500' 
  },
  { 
    icon: TrendingDown, 
    value: '40%', 
    label: 'Durchschn. Ersparnis', 
    color: 'text-green-600' 
  },
];

const certifications = [
  { name: 'ASTAG', description: 'Schweizer Transportverband' },
  { name: 'ISO 9001', description: 'Qualitätsmanagement' },
  { name: 'Datenschutz', description: 'CH-Hosting' },
];

export const TrustSectionOptimized = memo(function TrustSectionOptimized({
  variant = 'inline',
  className
}: TrustSectionProps) {
  // Hero variant - compact, above the fold
  if (variant === 'hero') {
    return (
      <div className={cn("flex flex-wrap justify-center gap-4 sm:gap-6", className)}>
        {trustMetrics.slice(0, 3).map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-2 text-sm"
          >
            <metric.icon className={cn("w-4 h-4", metric.color)} />
            <span className="font-bold text-foreground">{metric.value}</span>
            <span className="text-muted-foreground hidden sm:inline">{metric.label}</span>
          </motion.div>
        ))}
      </div>
    );
  }
  
  // Inline variant - horizontal bar
  if (variant === 'inline') {
    return (
      <div className={cn(
        "py-4 sm:py-6 bg-muted/30 border-y border-border/50",
        className
      )}>
        <div className="container">
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10 md:gap-14">
            {trustMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 sm:gap-3"
              >
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full bg-background shadow-sm",
                  "border border-border"
                )}>
                  <metric.icon className={cn("w-5 h-5", metric.color)} />
                </div>
                <div className="text-left">
                  <p className="text-base sm:text-lg font-bold text-foreground">{metric.value}</p>
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // Full variant - detailed section
  return (
    <section className={cn("py-12 sm:py-16 bg-gradient-to-b from-background to-muted/20", className)}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Warum über 2'800 Schweizer uns vertrauen
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Qualität, Transparenz und Sicherheit – das sind unsere Grundwerte
          </p>
        </motion.div>
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-10">
          {trustMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-xl p-4 sm:p-6 text-center border shadow-sm"
            >
              <div className={cn(
                "inline-flex items-center justify-center w-12 h-12 rounded-full mb-3",
                "bg-gradient-to-br from-muted to-muted/50"
              )}>
                <metric.icon className={cn("w-6 h-6", metric.color)} />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">{metric.value}</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">{metric.label}</p>
            </motion.div>
          ))}
        </div>
        
        {/* Certifications */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/20"
            >
              <CheckCircle className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{cert.name}</span>
              <span className="text-xs text-muted-foreground hidden sm:inline">– {cert.description}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default TrustSectionOptimized;
