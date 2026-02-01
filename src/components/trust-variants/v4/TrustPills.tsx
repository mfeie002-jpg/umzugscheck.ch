/**
 * TrustPills - Klickbare Trust-Chips unter CTA
 * V4 Best-Of: Psychologisch optimierte Micro-Trust-Signals
 */

import { memo, useState } from "react";
import { Shield, Building2, Users, ExternalLink, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TrustPill {
  id: string;
  icon: typeof Shield;
  label: string;
  shortLabel: string;
  description: string;
  verifyUrl?: string;
}

const TRUST_PILLS: TrustPill[] = [
  {
    id: "zefix",
    icon: Building2,
    label: "Im Handelsregister",
    shortLabel: "HR-geprüft",
    description: "Alle Partner sind im Schweizerischen Handelsregister (Zefix) eingetragen und verifizierbar.",
    verifyUrl: "https://www.zefix.ch"
  },
  {
    id: "sma",
    icon: Shield,
    label: "SMA-zertifiziert",
    shortLabel: "Zertifiziert",
    description: "Partner erfüllen die Qualitätsstandards des Schweizerischen Umzugsverbands.",
  },
  {
    id: "reviews",
    icon: Users,
    label: "4.8/5 Bewertung",
    shortLabel: "4.8★",
    description: "Durchschnittliche Kundenbewertung aus über 2'800 verifizierten Rezensionen.",
  },
];

interface TrustPillsProps {
  onPillClick?: (pillId: string) => void;
  variant?: "compact" | "full";
  className?: string;
}

export const TrustPills = memo(({ onPillClick, variant = "compact", className = "" }: TrustPillsProps) => {
  const [expandedPill, setExpandedPill] = useState<string | null>(null);

  const handlePillClick = (pillId: string) => {
    if (variant === "compact") {
      setExpandedPill(expandedPill === pillId ? null : pillId);
    }
    onPillClick?.(pillId);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Pills Row */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {TRUST_PILLS.map((pill) => (
          <motion.button
            key={pill.id}
            onClick={() => handlePillClick(pill.id)}
            className={`
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
              transition-all duration-200 cursor-pointer
              ${expandedPill === pill.id 
                ? "bg-primary text-primary-foreground shadow-md" 
                : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <pill.icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{pill.label}</span>
            <span className="sm:hidden">{pill.shortLabel}</span>
            <ChevronDown 
              className={`w-3 h-3 transition-transform ${expandedPill === pill.id ? "rotate-180" : ""}`} 
            />
          </motion.button>
        ))}
      </div>

      {/* Expanded Detail */}
      <AnimatePresence>
        {expandedPill && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {TRUST_PILLS.filter(p => p.id === expandedPill).map((pill) => (
              <div 
                key={pill.id}
                className="bg-card border border-border rounded-lg p-3 text-sm text-center"
              >
                <p className="text-muted-foreground">{pill.description}</p>
                {pill.verifyUrl && (
                  <a
                    href={pill.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline mt-2 text-xs"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Selbst verifizieren
                  </a>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

TrustPills.displayName = "TrustPills";
