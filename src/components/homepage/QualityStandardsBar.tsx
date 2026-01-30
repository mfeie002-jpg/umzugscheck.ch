/**
 * Quality Standards Bar - "Trust Bar 2"
 * 
 * Purpose: Shows quality/security signals with real partner logos
 * Follows Swiss Trust Triumvirate: Institutional → Process → Social
 * 
 * Logo Order (psychological impact):
 * 1. Swiss Made Software (Technical Trust)
 * 2. eUmzugCH (State Trust)
 * 3. ASTAG (Industry Trust)
 * 4. Die Post (Logistics Trust)
 * 5. Google Reviews (Social Trust)
 * 
 * CSS: grayscale(100%) default → full color on hover
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

// Logo data with external verification links
const trustLogos = [
  {
    id: "swiss-made",
    name: "Swiss Made Software",
    subtitle: "Entwickelt in der Schweiz",
    // TODO: Replace with actual SVG from swissmadesoftware.org
    logoUrl: "/logos/swiss-made-software.svg",
    verifyUrl: "https://www.swissmadesoftware.org/",
    fallbackIcon: "🇨🇭",
  },
  {
    id: "eumzug",
    name: "eUmzugCH",
    subtitle: "Offizielle Meldung erklärt",
    // TODO: Replace with actual logo from eumzug.swiss
    logoUrl: "/logos/eumzug-ch.svg",
    verifyUrl: "https://www.eumzug.swiss/",
    fallbackIcon: "🏛️",
  },
  {
    id: "astag",
    name: "ASTAG Standards",
    subtitle: "Branchenverband",
    // TODO: Replace with actual SVG from astag.ch
    logoUrl: "/logos/astag.svg",
    verifyUrl: "https://www.astag.ch/",
    fallbackIcon: "🚛",
  },
  {
    id: "post",
    name: "Die Post",
    subtitle: "Nachsendeauftrag Partner",
    // TODO: Replace with actual logo from post.ch
    logoUrl: "/logos/die-post.svg",
    verifyUrl: "https://www.post.ch/",
    fallbackIcon: "📮",
  },
  {
    id: "google",
    name: "Google Reviews",
    subtitle: "4.8/5 Sterne",
    // TODO: Replace with Google logo
    logoUrl: "/logos/google-reviews.svg",
    verifyUrl: "https://www.google.com/search?q=umzugscheck.ch+bewertungen",
    fallbackIcon: "⭐",
  },
];

export const QualityStandardsBar = memo(function QualityStandardsBar() {
  return (
    <section className="py-5 md:py-6 bg-muted/30 border-b border-border/30">
      <div className="container max-w-5xl px-4">
        {/* Header */}
        <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest mb-4">
          Geprüfte Qualität & Schweizer Standards
        </p>
        
        {/* Logo Row - Responsive grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center flex-wrap gap-6 md:gap-8"
        >
          {trustLogos.map((logo, index) => (
            <motion.a
              key={logo.id}
              href={logo.verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group flex flex-col items-center gap-1.5 
                         hover:scale-105 transition-transform duration-300"
              title={`${logo.name} verifizieren`}
            >
              {/* Logo Container with grayscale effect */}
              <div className="relative h-10 w-auto max-w-[140px] flex items-center justify-center">
                {/* Fallback: Emoji + Text (until real SVGs are added) */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg 
                               bg-card border border-border/50
                               grayscale opacity-60 
                               group-hover:grayscale-0 group-hover:opacity-100
                               transition-all duration-300">
                  <span className="text-xl">{logo.fallbackIcon}</span>
                  <span className="text-xs font-medium text-foreground whitespace-nowrap">
                    {logo.name}
                  </span>
                </div>
                
                {/* External link indicator on hover */}
                <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 
                               transition-opacity">
                  <ExternalLink className="w-3 h-3 text-primary" />
                </div>
              </div>
              
              {/* Subtitle - visible on hover */}
              <span className="text-[9px] text-muted-foreground opacity-0 
                              group-hover:opacity-100 transition-opacity">
                {logo.subtitle}
              </span>
            </motion.a>
          ))}
        </motion.div>
        
        {/* Footer note */}
        <p className="text-center text-[9px] text-muted-foreground mt-4 opacity-70">
          Klicken Sie auf ein Logo zur Verifizierung
        </p>
      </div>
    </section>
  );
});

export default QualityStandardsBar;
