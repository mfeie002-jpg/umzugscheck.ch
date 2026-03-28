/**
 * MediaLogosSection VARIANT L - "Swiss Standards Bar"
 * 
 * VERSION 12: "Der Schweizer Standard" headline with official process links
 * Based on feedback: Official resources strip with eUmzug process integration
 * 
 * Features:
 * - Clean headline: "Der Schweizer Standard für Ihren Umzug"
 * - Links to official resources (not claiming partnership)
 * - Meldepflicht/Fristen info
 * - Gemeindeprozess integration
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { 
  Building2,
  Mail,
  FileText,
  Clock,
  MapPin,
  ExternalLink,
  Shield,
  Star,
  CheckCircle2
} from "lucide-react";
import { TRUST } from "@/content/trust";

const officialResources = [
  {
    id: "meldepflicht",
    icon: Clock,
    title: "14 Tage Frist",
    description: "Anmeldefrist nach Umzug",
    detail: "Gesetzliche Meldepflicht in der Schweiz",
  },
  {
    id: "eumzug",
    icon: Building2,
    title: "eUmzugCH",
    description: "Online Ummeldung",
    url: "https://www.eumzug.swiss",
    detail: "Je nach Gemeinde verfügbar",
  },
  {
    id: "post",
    icon: Mail,
    title: "Nachsendeauftrag",
    description: "Post weiterleiten",
    url: "https://www.post.ch/de/briefe-versenden/nachsendeauftrag",
    detail: "6-12 Monate empfohlen",
  },
  {
    id: "gemeinde",
    icon: MapPin,
    title: "Gemeindeschalter",
    description: "Persönlich anmelden",
    detail: "Alternativ zum Online-Prozess",
  },
];

const qualitySignals = [
  { icon: Shield, text: "Versicherte Partner" },
  { icon: FileText, text: "UID-Register verifiziert" },
  { icon: CheckCircle2, text: "Fixpreis-Offerten" },
];

export const MediaLogosSectionVariantL = memo(function MediaLogosSectionVariantL() {
  return (
    <section className="py-6 md:py-8 bg-gradient-to-b from-primary/5 to-background border-b border-border/30">
      <div className="container max-w-5xl px-4">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-5"
        >
          <h3 className="text-base md:text-lg font-bold text-primary mb-1">
            🇨🇭 Der Schweizer Standard für Ihren Umzug
          </h3>
          <p className="text-xs text-muted-foreground">
            Alles für einen reibungslosen Wohnungswechsel in der Schweiz
          </p>
        </motion.div>

        {/* Official Resources Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5"
        >
          {officialResources.map((resource, index) => {
            const Wrapper = resource.url ? 'a' : 'div';
            const wrapperProps = resource.url 
              ? { href: resource.url, target: "_blank", rel: "noopener noreferrer" }
              : {};
            
            return (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * index }}
              >
                <Wrapper
                  {...wrapperProps}
                  className={`flex flex-col items-center p-3 rounded-xl bg-card border border-border
                             hover:border-primary/30 hover:shadow-sm transition-all h-full
                             ${resource.url ? 'cursor-pointer group' : ''}`}
                >
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <resource.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-foreground text-center flex items-center gap-1">
                    {resource.title}
                    {resource.url && (
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </span>
                  <span className="text-[10px] text-muted-foreground text-center mt-0.5">
                    {resource.description}
                  </span>
                  <span className="text-[9px] text-muted-foreground/70 text-center mt-1 hidden md:block">
                    {resource.detail}
                  </span>
                </Wrapper>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Quality + Rating Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 md:gap-6 pt-4 border-t border-border/30"
        >
          {/* Quality signals */}
          {qualitySignals.map((signal, idx) => (
            <div 
              key={idx}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <signal.icon className="w-3.5 h-3.5 text-emerald-500" />
              <span>{signal.text}</span>
            </div>
          ))}
          
          {/* Separator */}
          <div className="hidden md:block w-px h-5 bg-border" />
          
          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-bold">{TRUST.ratingDisplay}</span>
            <span className="text-xs text-muted-foreground">
              ({TRUST.ratingCount.toLocaleString()})
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

export default MediaLogosSectionVariantL;
