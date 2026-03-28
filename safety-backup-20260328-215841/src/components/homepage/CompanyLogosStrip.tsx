import { memo } from "react";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";

const companyNames = [
  "Mega Umzüge",
  "SwissMove",
  "Schnell & Sicher",
  "Helvetia Transport",
  "Pro Umzug",
  "Swiss Relocations",
  "Express Umzüge",
  "Alpen Movers",
];

export const CompanyLogosStrip = memo(function CompanyLogosStrip() {
  const doubled = [...companyNames, ...companyNames];

  return (
    <section className="py-6 border-y border-border/50 overflow-hidden bg-muted/20">
      <div className="container mb-3">
        <p className="text-center text-xs text-muted-foreground">
          Einige unserer 200+ Partner
        </p>
      </div>
      
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-muted/20 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-muted/20 to-transparent z-10" />
        
        <motion.div
          className="flex gap-8"
          animate={{ x: [0, -40 * companyNames.length] }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {doubled.map((name, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 flex items-center gap-2 text-muted-foreground/70"
            >
              <Building2 className="w-4 h-4" />
              <span className="text-sm font-medium whitespace-nowrap">{name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
});
