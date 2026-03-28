/**
 * MediaLogosSection VARIANT F - "Verifiable Trust" (Swiss State-Backed)
 * 
 * VERSION 6: High-trust, verifiable signals only
 * Based on research: No "logo soup" - only signals that are:
 * (a) Relevant to moving
 * (b) Independently verifiable  
 * (c) Don't imply endorsements you don't have
 * 
 * Three Trust Pillars:
 * 1. Institutional (state-verifiable): ZEFIX, UID, Swiss Hosting
 * 2. Process (risk removal): Insurance verified, Escrow, Fixed-price
 * 3. Social (real reviews): Actual rating with verified booking proof
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { 
  Building2, 
  FileCheck, 
  Shield, 
  Scale, 
  Lock, 
  Star,
  ExternalLink,
  BadgeCheck,
  FileText
} from "lucide-react";
import { TRUST } from "@/content/trust";

// Verifiable trust badges - each with proof mechanism
const verifiableTrustBadges = [
  // Institutional (State-Verifiable)
  {
    id: "zefix",
    category: "institutional",
    icon: Building2,
    title: "Handelsregister",
    subtitle: "ZEFIX geprüft",
    tooltip: "Alle Partnerfirmen im Schweizer Handelsregister verifiziert",
    link: "https://www.zefix.ch",
    linkLabel: "Prüfen",
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
  },
  {
    id: "uid",
    category: "institutional", 
    icon: FileCheck,
    title: "UID verifiziert",
    subtitle: "Unternehmens-ID",
    tooltip: "Eindeutige Unternehmens-Identifikation beim BFS",
    link: "https://www.uid.admin.ch",
    linkLabel: "Register",
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
  },
  // Process (Risk Removal)
  {
    id: "versicherung",
    category: "process",
    icon: Shield,
    title: "Versicherung",
    subtitle: "Haftpflicht geprüft",
    tooltip: "Transportversicherung & Haftpflicht vor Listung verifiziert",
    color: "text-[#E2001A]",
    bgColor: "bg-[#E2001A]/10",
    borderColor: "border-[#E2001A]/20",
  },
  {
    id: "escrow",
    category: "process",
    icon: Scale,
    title: "Treuhand",
    subtitle: "Zahlungsschutz",
    tooltip: "Optionale Treuhand-Zahlung für maximale Sicherheit",
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
  // Digital Sovereignty
  {
    id: "datenschutz",
    category: "institutional",
    icon: Lock,
    title: "Schweizer Hosting",
    subtitle: "nDSG konform",
    tooltip: "Daten bleiben in der Schweiz, neues Datenschutzgesetz",
    color: "text-emerald-600",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
  // Social Proof (Real, Verifiable)
  {
    id: "rating",
    category: "social",
    icon: Star,
    title: TRUST.ratingDisplay,
    subtitle: `${TRUST.ratingCount.toLocaleString('de-CH')} Bewertungen`,
    tooltip: "Echte Bewertungen von verifizierten Buchungen",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    isRating: true,
  },
];

// Official resources (not "partners" - just helpful links)
const officialResources = [
  {
    id: "eumzug",
    label: "eUmzugCH",
    description: "Offizielle Umzugsmeldung",
    url: "https://www.eumzug.swiss",
  },
  {
    id: "post",
    label: "Post Nachsendeauftrag",
    description: "Adressänderung",
    url: "https://www.post.ch/de/briefe-versenden/nachsendeauftrag",
  },
];

export const MediaLogosSectionVariantF = memo(function MediaLogosSectionVariantF() {
  return (
    <section className="py-6 md:py-8 bg-gradient-to-b from-muted/30 to-background border-b border-border/30">
      <div className="container max-w-5xl px-4">
        
        {/* Header - Verifiable claim */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-5"
        >
          <h3 className="text-sm font-semibold text-foreground mb-1">
            Geprüft. Versichert. Verifizierbar.
          </h3>
          <p className="text-xs text-muted-foreground">
            Keine Marketing-Logos — nur staatlich verifizierbare Qualität
          </p>
        </motion.div>

        {/* Trust Badges Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6"
        >
          {verifiableTrustBadges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * index }}
              className={`relative flex flex-col items-center p-3 rounded-xl 
                         ${badge.bgColor} border ${badge.borderColor}
                         hover:shadow-md transition-all duration-300 group cursor-default`}
              title={badge.tooltip}
            >
              {/* Icon */}
              <div className={`w-8 h-8 rounded-full bg-card flex items-center justify-center mb-2
                              group-hover:scale-110 transition-transform`}>
                {badge.isRating ? (
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-2.5 h-2.5 ${i < Math.floor(TRUST.ratingValue) ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} 
                      />
                    ))}
                  </div>
                ) : (
                  <badge.icon className={`w-4 h-4 ${badge.color}`} />
                )}
              </div>
              
              {/* Text */}
              <span className={`text-xs font-semibold ${badge.color} text-center leading-tight`}>
                {badge.title}
              </span>
              <span className="text-[10px] text-muted-foreground text-center">
                {badge.subtitle}
              </span>
              
              {/* External link for verifiable items */}
              {badge.link && (
                <a 
                  href={badge.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 
                             transition-opacity text-muted-foreground hover:text-primary"
                  title={`${badge.linkLabel}: ${badge.link}`}
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Official Resources Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-border/30"
        >
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Offizielle Ressourcen:
          </span>
          {officialResources.map((resource) => (
            <a
              key={resource.id}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full 
                         bg-card border border-border/50 text-xs text-muted-foreground
                         hover:border-primary/30 hover:text-primary transition-all group"
            >
              <FileText className="w-3 h-3" />
              <span className="font-medium">{resource.label}</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-50 group-hover:opacity-100" />
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
});

export default MediaLogosSectionVariantF;
