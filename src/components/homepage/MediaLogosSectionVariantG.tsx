/**
 * MediaLogosSection VARIANT G - "Swiss Infrastructure"
 * 
 * VERSION 7: Focus on official Swiss infrastructure partners
 * - eUmzugCH (Official state platform)
 * - Die Post (Mail forwarding)
 * - ASTAG (Industry association)
 * - Swiss Made Software
 * 
 * Based on feedback: "Infrastructure & Quality logos"
 * These are the "blue giants" that Swiss users trust implicitly.
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

const infrastructurePartners = [
  {
    id: "eumzugch",
    name: "eUmzugCH",
    description: "Offizielle Behörden-Umzugsmeldung",
    icon: Building2,
    url: "https://www.eumzug.swiss",
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    borderColor: "border-red-200 dark:border-red-800/30",
  },
  {
    id: "post",
    name: "Die Post",
    description: "Nachsendeauftrag & Adressänderung",
    icon: Mail,
    url: "https://www.post.ch/de/briefe-versenden/nachsendeauftrag",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    borderColor: "border-yellow-200 dark:border-yellow-800/30",
  },
  {
    id: "astag",
    name: "ASTAG",
    description: "Schweizerischer Nutzfahrzeugverband",
    icon: Truck,
    url: "https://www.astag.ch",
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-800/30",
  },
  {
    id: "swissmade",
    name: "Swiss Made",
    description: "Entwickelt in der Schweiz",
    icon: Code2,
    url: "https://www.swissmadesoftware.org",
    color: "text-primary",
    bgColor: "bg-primary/5",
    borderColor: "border-primary/20",
  },
];

const qualityPromises = [
  { icon: Shield, text: "Alle Partner versichert" },
  { icon: CheckCircle2, text: "Handelsregister verifiziert" },
];

export const MediaLogosSectionVariantG = memo(function MediaLogosSectionVariantG() {
  return (
    <section className="py-6 md:py-8 bg-gradient-to-b from-muted/40 to-background border-b border-border/30">
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
              className={`relative flex flex-col items-center p-4 rounded-xl 
                         ${partner.bgColor} border ${partner.borderColor}
                         hover:shadow-md transition-all duration-300 group`}
            >
              {/* Icon */}
              <div className={`w-10 h-10 rounded-full bg-card flex items-center justify-center mb-2
                              group-hover:scale-110 transition-transform shadow-sm`}>
                <partner.icon className={`w-5 h-5 ${partner.color}`} />
              </div>
              
              {/* Text */}
              <span className={`text-sm font-semibold ${partner.color} text-center`}>
                {partner.name}
              </span>
              <span className="text-[10px] text-muted-foreground text-center leading-tight mt-0.5">
                {partner.description}
              </span>
              
              {/* External link indicator */}
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
          {qualityPromises.map((promise, idx) => (
            <div 
              key={idx}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <promise.icon className="w-3.5 h-3.5 text-emerald-500" />
              <span>{promise.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
});

export default MediaLogosSectionVariantG;
