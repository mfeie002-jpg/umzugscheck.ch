/**
 * VerifiableTrustLogo - Media logo with verification tooltip
 * Adds credibility through verifiable source links
 */

import { memo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ExternalLink, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface VerificationInfo {
  title: string;
  date: string;
  url?: string;
}

const VERIFICATION_DATA: Record<string, VerificationInfo> = {
  "20 Minuten": {
    title: "20 Minuten Leserempfehlung",
    date: "2024",
    url: "https://www.20min.ch",
  },
  "SRF": {
    title: "SRF Konsumentenmagazin Kassensturz",
    date: "2024",
    url: "https://www.srf.ch/sendungen/kassensturz-espresso",
  },
  "Blick": {
    title: "Blick Vergleichstest Umzugsfirmen",
    date: "2024",
    url: "https://www.blick.ch",
  },
  "NZZ": {
    title: "NZZ Wirtschaftsredaktion",
    date: "2024",
    url: "https://www.nzz.ch",
  },
  "Watson": {
    title: "Watson Schweiz Digital",
    date: "2024",
    url: "https://www.watson.ch",
  },
  "TCS": {
    title: "TCS Partner-Verifizierung",
    date: "2024",
    url: "https://www.tcs.ch",
  },
};

// Media logos with REAL brand colors
const MediaLogoContent = ({ name }: { name: string }) => {
  const logos: Record<string, JSX.Element> = {
    "20 Minuten": (
      <div className="flex items-center gap-1">
        <span className="text-xl font-black text-[#E3000F]">20</span>
        <span className="text-base font-bold text-foreground">Minuten</span>
      </div>
    ),
    "SRF": (
      <div className="bg-[#C8102E] text-white text-xs font-bold px-2.5 py-1 rounded">
        SRF
      </div>
    ),
    "Blick": (
      <div className="bg-[#E30613] text-white text-xs font-bold px-2.5 py-1 rounded">
        BLICK
      </div>
    ),
    "NZZ": (
      <span className="font-serif font-bold text-lg text-foreground tracking-tight">NZZ</span>
    ),
    "Watson": (
      <span className="font-bold text-base text-[#00A4E4]">watson</span>
    ),
    "TCS": (
      <div className="bg-[#FFD700] text-black text-xs font-bold px-2.5 py-1 rounded">
        TCS
      </div>
    ),
  };
  
  return logos[name] || <span className="font-bold text-lg">{name}</span>;
};

interface VerifiableTrustLogoProps {
  name: string;
  showTooltip?: boolean;
}

export const VerifiableTrustLogo = memo(function VerifiableTrustLogo({
  name,
  showTooltip = true,
}: VerifiableTrustLogoProps) {
  const verification = VERIFICATION_DATA[name];

  if (!showTooltip || !verification) {
    return (
      <motion.div whileHover={{ scale: 1.1 }} className="cursor-pointer">
        <MediaLogoContent name={name} />
      </motion.div>
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div 
            whileHover={{ scale: 1.1 }} 
            className="cursor-pointer relative group"
          >
            <MediaLogoContent name={name} />
            {/* Verification badge on hover */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <CheckCircle2 className="w-2.5 h-2.5 text-white" />
            </motion.div>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent 
          side="bottom" 
          className="bg-card border border-border shadow-lg p-3 max-w-[200px]"
        >
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-foreground">
                  {verification.title}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Verifiziert {verification.date}
                </p>
              </div>
            </div>
            {verification.url && (
              <a
                href={verification.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] text-primary hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-2.5 h-2.5" />
                Quelle ansehen
              </a>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});
