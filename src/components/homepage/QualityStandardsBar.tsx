/**
 * Quality Standards Bar - "Trust Bar 2" 
 * 
 * 11 Trust Logos in psychologisch optimierter Reihenfolge:
 * 1. Trusted Shops - E-Commerce Zertifizierung (sofortiges Vertrauen)
 * 2. Swiss Label - Qualitäts-Siegel
 * 3. Die Post - Hochvertrauter Partner
 * 4. ASTAG - Branchenverband Transport
 * 5. eUmzugCH - Offizielle Melde-Plattform
 * 6. Mieterverband - Mieter-Schutz
 * 7. Die Mobiliar - Versicherung
 * 8. Raiffeisen - Trusted Bank
 * 9. ZKB - Lokale Bank
 * 10. TWINT - Zahlungssystem (Checkout-Boost)
 * 11. Swiss Hosting - Technische Zuverlässigkeit
 * 
 * CSS: grayscale(100%) default → full color on hover
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Shield, Truck, Home, Building2, CreditCard, Server, Award, Landmark, BadgeCheck, Mail } from "lucide-react";

// 11 Trust Logos in psychologisch optimierter Reihenfolge (Risiko → Infrastruktur → Zahlung → Authority)
const trustLogos = [
  // Pos 1: Risikoreduktion - Versicherung
  {
    id: "mobiliar",
    name: "Die Mobiliar",
    subtitle: "Versicherung",
    icon: Shield,
    color: "text-[#E2001A]",
    bgColor: "bg-[#E2001A]/10",
    verifyUrl: "https://www.mobiliar.ch/",
  },
  // Pos 2-3: Schweizer Infrastruktur
  {
    id: "post",
    name: "Die Post",
    subtitle: "Nachsendeauftrag",
    icon: Mail,
    color: "text-[#FFCC00]",
    bgColor: "bg-[#FFCC00]/10",
    verifyUrl: "https://www.post.ch/",
  },
  {
    id: "eumzug",
    name: "eUmzugCH",
    subtitle: "Offizielle Meldung",
    icon: Home,
    color: "text-[#DC0018]",
    bgColor: "bg-[#DC0018]/10",
    verifyUrl: "https://www.eumzug.swiss/",
  },
  // Pos 4-6: Zahlungssicherheit
  {
    id: "twint",
    name: "TWINT",
    subtitle: "Zahlung",
    icon: CreditCard,
    color: "text-[#000000]",
    bgColor: "bg-black/10",
    verifyUrl: "https://www.twint.ch/",
  },
  {
    id: "zkb",
    name: "ZKB",
    subtitle: "Kantonalbank",
    icon: Building2,
    color: "text-[#0033A0]",
    bgColor: "bg-[#0033A0]/10",
    verifyUrl: "https://www.zkb.ch/",
  },
  {
    id: "raiffeisen",
    name: "Raiffeisen",
    subtitle: "Schweizer Bank",
    icon: Landmark,
    color: "text-[#FFD500]",
    bgColor: "bg-[#FFD500]/10",
    verifyUrl: "https://www.raiffeisen.ch/",
  },
  // Pos 7-11: Ergänzende Authority
  {
    id: "mieterverband",
    name: "Mieterverband",
    subtitle: "Mieter-Schutz",
    icon: Shield,
    color: "text-[#0066B3]",
    bgColor: "bg-[#0066B3]/10",
    verifyUrl: "https://www.mieterverband.ch/",
  },
  {
    id: "astag",
    name: "ASTAG",
    subtitle: "Branchenverband",
    icon: Truck,
    color: "text-[#003366]",
    bgColor: "bg-[#003366]/10",
    verifyUrl: "https://www.astag.ch/",
  },
  {
    id: "swiss-label",
    name: "Swiss Label",
    subtitle: "Qualitäts-Siegel",
    icon: Award,
    color: "text-[#E2001A]",
    bgColor: "bg-[#E2001A]/10",
    verifyUrl: "https://www.swisslabel.ch/",
  },
  {
    id: "trusted-shops",
    name: "Trusted Shops",
    subtitle: "Käuferschutz",
    icon: BadgeCheck,
    color: "text-[#FFDC0F]",
    bgColor: "bg-[#FFDC0F]/10",
    verifyUrl: "https://www.trustedshops.ch/",
  },
  {
    id: "swiss-hosting",
    name: "Swiss Hosting",
    subtitle: "Daten in CH",
    icon: Server,
    color: "text-emerald-600",
    bgColor: "bg-emerald-500/10",
    verifyUrl: "https://www.swissmadesoftware.org/",
  },
];

export const QualityStandardsBar = memo(function QualityStandardsBar() {
  return (
    <section className="py-5 md:py-6 bg-muted/30 border-b border-border/30">
      <div className="container max-w-6xl px-4">
        {/* Header */}
        <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest mb-4">
          Vertrauenspartner & Zertifizierungen
        </p>
        
        {/* Logo Grid - 2 rows on desktop, scrollable on mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-3 md:gap-4"
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
              transition={{ delay: index * 0.03 }}
              className="group flex items-center gap-2 px-3 py-2 rounded-lg
                         bg-card border border-border/50 
                         grayscale opacity-70
                         hover:grayscale-0 hover:opacity-100 hover:border-primary/30 hover:shadow-md
                         transition-all duration-300"
              title={`${logo.name} verifizieren`}
            >
              {/* Icon */}
              <div className={`w-7 h-7 rounded-md ${logo.bgColor} flex items-center justify-center flex-shrink-0`}>
                <logo.icon className={`w-4 h-4 ${logo.color}`} />
              </div>
              
              {/* Text */}
              <div className="flex flex-col leading-none">
                <span className="text-xs font-semibold text-foreground whitespace-nowrap">
                  {logo.name}
                </span>
                <span className="text-[9px] text-muted-foreground">
                  {logo.subtitle}
                </span>
              </div>
              
              {/* External link on hover */}
              <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
            </motion.a>
          ))}
        </motion.div>
        
        {/* Footer */}
        <p className="text-center text-[9px] text-muted-foreground mt-4 opacity-60">
          <a 
            href="/partner" 
            className="hover:text-primary transition-colors inline-flex items-center gap-1"
          >
            Alle Partner verifizierbar ↗
          </a>
        </p>
      </div>
    </section>
  );
});

export default QualityStandardsBar;
