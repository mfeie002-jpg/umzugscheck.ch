/**
 * TrustRibbon VARIANT G - Swiss Infrastructure
 * 
 * VERSION 7: Focus on official Swiss infrastructure partners
 * - eUmzugCH (Official state platform)
 * - Die Post (Mail forwarding)
 * - ASTAG (Industry association)
 * - Swiss Made Software
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { 
  Building2, 
  Mail, 
  Truck, 
  Code2,
  ExternalLink,
  Shield,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

const infrastructurePartners = [
  {
    id: "eumzugch",
    name: "eUmzugCH",
    description: "Offizielle Behörden-Umzugsmeldung",
    icon: Building2,
    url: "https://www.eumzug.swiss",
  },
  {
    id: "post",
    name: "Die Post",
    description: "Nachsendeauftrag & Adressänderung",
    icon: Mail,
    url: "https://www.post.ch/de/briefe-versenden/nachsendeauftrag",
  },
  {
    id: "astag",
    name: "ASTAG",
    description: "Schweizerischer Nutzfahrzeugverband",
    icon: Truck,
    url: "https://www.astag.ch",
  },
  {
    id: "swissmade",
    name: "Swiss Made",
    description: "Entwickelt in der Schweiz",
    icon: Code2,
    url: "https://www.swissmadesoftware.org",
  },
];

interface TrustRibbonVariantGProps {
  variant?: "full" | "compact";
  className?: string;
}

export const TrustRibbonVariantG = memo(function TrustRibbonVariantG({
  variant = "full",
  className,
}: TrustRibbonVariantGProps) {
  
  if (variant === "compact") {
    return (
      <div className={cn("py-3 bg-muted/30 border-b border-border/50", className)}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            <span className="text-xs text-muted-foreground">🇨🇭 Schweizer Standard:</span>
            {infrastructurePartners.slice(0, 3).map((p) => (
              <div key={p.id} className="flex items-center gap-1.5 text-sm font-medium text-foreground/70">
                <p.icon className="w-3.5 h-3.5 text-primary" />
                <span>{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className={cn("py-6 md:py-8 bg-gradient-to-b from-muted/40 to-background border-b border-border/30", className)}>
      <div className="container max-w-5xl px-4">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-5"
        >
          <h3 className="text-sm font-semibold text-foreground mb-1">
            🇨🇭 Integriert in Schweizer Infrastruktur
          </h3>
          <p className="text-xs text-muted-foreground">
            Kompatibel mit offiziellen Behörden- und Logistikprozessen
          </p>
        </motion.div>

        {/* Infrastructure Partners Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5"
        >
          {infrastructurePartners.map((partner, index) => (
            <motion.a
              key={partner.id}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * index }}
              className="relative flex flex-col items-center p-4 rounded-xl 
                         bg-primary/5 border border-primary/20
                         hover:shadow-md transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center mb-2
                              group-hover:scale-110 transition-transform shadow-sm">
                <partner.icon className="w-5 h-5 text-primary" />
              </div>
              
              <span className="text-sm font-semibold text-primary text-center">
                {partner.name}
              </span>
              <span className="text-[10px] text-muted-foreground text-center leading-tight mt-0.5">
                {partner.description}
              </span>
              
              <ExternalLink className="absolute top-2 right-2 w-3 h-3 text-muted-foreground 
                                       opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.a>
          ))}
        </motion.div>

        {/* Quality Promises Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-border/30"
        >
          <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>Alle Partner versichert</span>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Handelsregister verifiziert</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
});
