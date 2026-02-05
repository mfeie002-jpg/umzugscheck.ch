/**
 * MediaLogosSection VARIANT G - "Swiss Infrastructure"
 * 
 * VERSION 8: Real logos and authentic partner descriptions
 * - eUmzugCH (Official state platform for municipality registration)
 * - Die Post (Mail forwarding service)
 * - ASTAG (Swiss transport industry association)
 * - Swiss Label (Quality certification)
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
    tagline: "Offizielle Umzugsmeldung",
    description: "Die digitale Einwohnerkontrolle der Schweiz. Melden Sie Ihren Umzug direkt bei Ihrer Gemeinde an.",
    logo: "/logos/eumzugch.png",
    url: "https://www.eumzug.swiss",
    bgGradient: "from-red-50 to-white dark:from-red-950/30 dark:to-background",
    accentColor: "text-red-600 dark:text-red-400",
    borderColor: "border-red-200/60 dark:border-red-800/40",
  },
  {
    id: "post",
    name: "Die Schweizerische Post",
    tagline: "Nachsendeauftrag",
    description: "Ihr Briefkasten zieht mit. Automatische Weiterleitung aller Sendungen an Ihre neue Adresse.",
    logo: "/logos/post-logo.png",
    url: "https://www.post.ch/de/briefe-versenden/nachsendeauftrag",
    bgGradient: "from-yellow-50 to-white dark:from-yellow-950/30 dark:to-background",
    accentColor: "text-yellow-600 dark:text-yellow-400",
    borderColor: "border-yellow-200/60 dark:border-yellow-800/40",
  },
  {
    id: "astag",
    name: "ASTAG",
    tagline: "Branchenverband",
    description: "Schweizerischer Nutzfahrzeugverband. Nur geprüfte, versicherte Umzugsfirmen.",
    logo: "/logos/astag-logo.png",
    url: "https://www.astag.ch",
    bgGradient: "from-blue-50 to-white dark:from-blue-950/30 dark:to-background",
    accentColor: "text-blue-600 dark:text-blue-400",
    borderColor: "border-blue-200/60 dark:border-blue-800/40",
  },
  {
    id: "swisslabel",
    name: "Swiss Label",
    tagline: "Schweizer Qualität",
    description: "Gütesiegel für Schweizer Produkte und Dienstleistungen. Qualität, der Sie vertrauen können.",
    logo: "/logos/swiss-made.png",
    url: "https://www.swisslabel.ch",
    bgGradient: "from-primary/5 to-white dark:from-primary/10 dark:to-background",
    accentColor: "text-primary",
    borderColor: "border-primary/20",
  },
];

const qualityPromises = [
  { icon: Shield, text: "Alle Partner versichert" },
  { icon: CheckCircle2, text: "Handelsregister verifiziert" },
];

interface PartnerCardProps {
  partner: typeof infrastructurePartners[0];
  index: number;
}

const PartnerCard = memo(function PartnerCard({ partner, index }: PartnerCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.a
      href={partner.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.08 * index, duration: 0.4 }}
      className={cn(
        "relative flex flex-col p-4 sm:p-5 rounded-xl",
        "bg-gradient-to-br", partner.bgGradient,
        "border", partner.borderColor,
        "hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-white dark:bg-card shadow-sm flex items-center justify-center p-2 group-hover:shadow-md transition-shadow">
          {!imgError ? (
            <img
              src={partner.logo}
              alt={partner.name}
              className="w-full h-full object-contain"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className={cn("font-bold text-sm", partner.accentColor)}>
              {partner.name.charAt(0)}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={cn("font-semibold text-sm sm:text-base truncate", partner.accentColor)}>
            {partner.name}
          </h4>
          <p className="text-xs text-muted-foreground">
            {partner.tagline}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed flex-1">
        {partner.description}
      </p>

      {/* External link indicator */}
      <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
        <span>Mehr erfahren</span>
        <ExternalLink className="w-3 h-3" />
      </div>
    </motion.a>
  );
});

export const MediaLogosSectionVariantG = memo(function MediaLogosSectionVariantG() {
  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-muted/50 to-background border-b border-border/30">
      <div className="container max-w-5xl px-4">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 md:mb-8"
        >
          <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">
            🇨🇭 Integriert in Schweizer Infrastruktur
          </h3>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Nahtlose Anbindung an offizielle Behörden- und Logistikprozesse der Schweiz
          </p>
        </motion.div>

        {/* Infrastructure Partners Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {infrastructurePartners.map((partner, index) => (
            <PartnerCard key={partner.id} partner={partner} index={index} />
          ))}
        </div>

        {/* Quality Promises Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-5 border-t border-border/40"
        >
          {qualityPromises.map((promise, idx) => (
            <div 
              key={idx}
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground"
            >
              <promise.icon className="w-4 h-4 text-emerald-500" />
              <span>{promise.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
});

export default MediaLogosSectionVariantG;
