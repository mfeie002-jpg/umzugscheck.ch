/**
 * Enhanced Dropdown CTA Card
 * Warm, inviting & trust-building conversion card
 */

import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, LucideIcon, Sparkles, Shield, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DropdownCTACardProps {
  title: string;
  description?: string;
  bullets?: string[];
  buttonText: string;
  buttonHref?: string;
  onButtonClick?: () => void;
  icon?: LucideIcon;
  className?: string;
  onClose?: () => void;
}

// Micro trust signals
const MICRO_TRUST = [
  { icon: Shield, label: "Geprüft" },
  { icon: Star, label: "4.8★" },
  { icon: Users, label: "12k+" },
];

export const DropdownCTACard = ({
  title,
  description,
  bullets,
  buttonText,
  buttonHref,
  onButtonClick,
  icon: Icon,
  className,
  onClose,
}: DropdownCTACardProps) => {
  const handleClick = () => {
    onButtonClick?.();
    onClose?.();
  };

  const ButtonContent = (
    <>
      <Sparkles className="w-4 h-4 mr-2" />
      {buttonText}
      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
    </>
  );

  return (
    <motion.div 
      className={cn(
        "relative overflow-hidden rounded-2xl p-5",
        "bg-gradient-to-br from-primary/[0.08] via-primary/[0.05] to-emerald-500/[0.05]",
        "border border-primary/20 hover:border-primary/30 transition-colors",
        "shadow-lg shadow-primary/5",
        className
      )}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {/* Decorative gradient blob */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-primary/20 to-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-tr from-secondary/10 to-amber-500/10 rounded-full blur-2xl pointer-events-none" />
      
      <div className="relative">
        {/* Icon */}
        {Icon && (
          <motion.div 
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-4 shadow-lg shadow-primary/25"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
          >
            <Icon className="w-6 h-6 text-primary-foreground" />
          </motion.div>
        )}
        
        {/* Title */}
        <h4 className="font-bold text-lg text-foreground mb-2">{title}</h4>
        
        {/* Description */}
        {description && (
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{description}</p>
        )}

        {/* Bullets with enhanced styling */}
        {bullets && bullets.length > 0 && (
          <ul className="space-y-2 mb-5">
            {bullets.map((bullet, idx) => (
              <motion.li 
                key={idx} 
                className="flex items-start gap-2.5 text-sm text-foreground/80"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.05 }}
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
                <span className="font-medium">{bullet}</span>
              </motion.li>
            ))}
          </ul>
        )}

        {/* CTA Button */}
        {buttonHref ? (
          <Button 
            asChild 
            className="group w-full h-12 bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary text-primary-foreground font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
          >
            <Link to={buttonHref} onClick={handleClick}>
              {ButtonContent}
            </Link>
          </Button>
        ) : (
          <Button 
            onClick={handleClick}
            className="group w-full h-12 bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary text-primary-foreground font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
          >
            {ButtonContent}
          </Button>
        )}

        {/* Micro trust row */}
        <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-primary/10">
          {MICRO_TRUST.map((item, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <item.icon className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[11px] font-semibold text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
