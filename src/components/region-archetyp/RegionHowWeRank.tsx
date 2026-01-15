/**
 * GOLD STANDARD - "How We Rank" Credibility Box
 * ChatGPT recommendation: Answers "Why these companies?" to build trust
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Shield, Star, Clock, Scale, FileCheck, Info } from "lucide-react";

interface RegionHowWeRankProps {
  regionName: string;
  variant?: 'canton' | 'city';
}

const RANKING_CRITERIA = [
  {
    icon: FileCheck,
    title: "Geprüft",
    description: "Dokumente, Versicherung & Handelsregister verifiziert",
    color: "text-green-600"
  },
  {
    icon: Star,
    title: "Bewertungen",
    description: "Durchschnittliche Kundenbewertung & Anzahl Reviews",
    color: "text-yellow-600"
  },
  {
    icon: Clock,
    title: "Verfügbarkeit",
    description: "Aktuelle Kapazität & Reaktionszeit auf Anfragen",
    color: "text-blue-600"
  },
  {
    icon: Scale,
    title: "Preis-Leistung",
    description: "Verhältnis von Preis zu angebotenem Service",
    color: "text-purple-600"
  }
];

export const RegionHowWeRank = memo(({ regionName, variant = 'canton' }: RegionHowWeRankProps) => {
  const locationPrefix = variant === 'canton' ? 'im Kanton' : 'in';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-muted/50 rounded-xl p-4 border border-border/50"
    >
      <div className="flex items-center gap-2 mb-3">
        <Info className="w-4 h-4 text-primary" />
        <h4 className="font-semibold text-sm">So ranken wir Firmen {locationPrefix} {regionName}</h4>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {RANKING_CRITERIA.map((criterion, index) => (
          <div key={index} className="flex items-start gap-2">
            <criterion.icon className={`w-4 h-4 ${criterion.color} shrink-0 mt-0.5`} />
            <div>
              <p className="text-xs font-medium">{criterion.title}</p>
              <p className="text-[10px] text-muted-foreground leading-tight">{criterion.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <p className="text-[10px] text-muted-foreground mt-3 pt-2 border-t border-border/50">
        <Shield className="w-3 h-3 inline mr-1" />
        Alle Partnerfirmen sind versichert und unterliegen regelmässiger Qualitätskontrolle.
      </p>
    </motion.div>
  );
});

RegionHowWeRank.displayName = 'RegionHowWeRank';
