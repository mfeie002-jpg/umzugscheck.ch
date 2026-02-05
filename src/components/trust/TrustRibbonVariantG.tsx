/**
 * TrustRibbon VARIANT G - Swiss Infrastructure
 * 
 * VERSION 8: Real logos instead of icons
 * - eUmzugCH (Official state platform)
 * - Die Post (Mail forwarding)
 * - ASTAG (Industry association)
 * - Swiss Made Software
 */

import { memo, useState } from "react";
import { motion } from "framer-motion";
import { 
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
    logo: "/logos/eumzugch.png",
    url: "https://www.eumzug.swiss",
  },
  {
    id: "post",
    name: "Die Post",
    description: "Nachsendeauftrag & Adressänderung",
    logo: "/logos/post-logo.png",
    url: "https://www.post.ch/de/briefe-versenden/nachsendeauftrag",
  },
  {
    id: "astag",
    name: "ASTAG",
    description: "Schweizerischer Nutzfahrzeugverband",
    logo: "/logos/astag-logo.png",
    url: "https://www.astag.ch",
  },
  {
    id: "swissmade",
    name: "Swiss Made",
    description: "Entwickelt in der Schweiz",
    logo: "/logos/swiss-made.png",
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
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  
  const handleImgError = (id: string) => {
    setImgErrors(prev => ({ ...prev, [id]: true }));
  };
  
  if (variant === "compact") {
    return (
      <div className={cn("py-3 bg-muted/30 border-b border-border/50", className)}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            <span className="text-xs text-muted-foreground">🇨🇭 Schweizer Standard:</span>
            {infrastructurePartners.slice(0, 3).map((p) => (
              <div key={p.id} className="flex items-center gap-1.5 text-sm font-medium text-foreground/70">
                <img 
                  src={p.logo} 
                  alt={p.name} 
                  className="w-4 h-4 object-contain"
                  onError={() => handleImgError(p.id)}
                />
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

        {/* Infrastructure Partners Grid - Now with REAL logos */}
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
                         bg-card border border-border/60
                         hover:shadow-md hover:border-primary/30 transition-all duration-300 group"
            >
              {/* Logo Container - Bigger logos */}
              <div className="w-20 h-14 flex items-center justify-center mb-2">
                {!imgErrors[partner.id] ? (
                  <img 
                    src={partner.logo} 
                    alt={partner.name}
                    className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all"
                    onError={() => handleImgError(partner.id)}
                  />
                ) : (
                  <span className="text-xs font-bold text-primary">
                    {partner.name.charAt(0)}
                  </span>
                )}
              </div>
              
              <span className="text-sm font-semibold text-foreground text-center">
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
