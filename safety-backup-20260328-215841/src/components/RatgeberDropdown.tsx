/**
 * Ratgeber Dropdown - Enhanced & Lively
 * Warm, trustworthy design with emotional signals
 */

import { FileText, DollarSign, CheckSquare, Lightbulb, BookOpen, Star, Heart, Shield, Zap, ArrowRight } from "lucide-react";
import { DropdownWrapper } from "./navigation/DropdownWrapper";
import { DropdownLink } from "./navigation/DropdownLink";
import { DropdownSection } from "./navigation/DropdownSection";
import { DropdownCTACard } from "./navigation/DropdownCTACard";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface RatgeberDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const ratgeberItems = [
  {
    icon: DollarSign,
    title: "Kosten & Preise",
    description: "Was kostet ein Umzug in der Schweiz?",
    href: "/ratgeber/kosten",
    featured: true,
    badge: "Beliebt",
  },
  {
    icon: CheckSquare,
    title: "Umzugscheckliste",
    description: "Schritt für Schritt zum perfekten Umzug",
    href: "/ratgeber/checklisten",
    featured: true,
    badge: "Top",
  },
  {
    icon: Lightbulb,
    title: "Umzugstipps",
    description: "Praktische Tipps von Experten",
    href: "/ratgeber/umzugstipps",
  },
  {
    icon: BookOpen,
    title: "Alle Ratgeber",
    description: "Komplette Sammlung aller Artikel",
    href: "/ratgeber",
  },
];

const quickLinks = [
  { title: "Kosten sparen", href: "/ratgeber/kosten-sparen", icon: DollarSign },
  { title: "Wohnungsübergabe", href: "/ratgeber/wohnungsabgabe", icon: FileText },
  { title: "Packen & Vorbereiten", href: "/ratgeber/packtipps", icon: CheckSquare },
];

export const RatgeberDropdown = ({ isOpen, onClose }: RatgeberDropdownProps) => {
  return (
    <DropdownWrapper isOpen={isOpen} onClose={onClose}>
      <div className="container mx-auto px-4 lg:px-6 py-6">
        <div className="grid lg:grid-cols-[1fr_220px_280px] gap-6 lg:gap-8">
          
          {/* Column 1: Hauptnavigation */}
          <div>
            <DropdownSection 
              title="Ratgeber & Tipps" 
              subtitle="💡 Expertenwissen für deinen Umzug"
            >
              <div className="space-y-1">
                {ratgeberItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <DropdownLink
                      to={item.href}
                      icon={item.icon}
                      title={item.title}
                      description={item.description}
                      onClick={onClose}
                      featured={item.featured}
                      badge={item.badge}
                    />
                  </motion.div>
                ))}
              </div>
            </DropdownSection>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:border-l lg:border-border lg:pl-6">
            <DropdownSection title="Schnell-Zugriff">
              <div className="space-y-1">
                {quickLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.04 }}
                  >
                    <Link
                      to={link.href}
                      onClick={onClose}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-transparent transition-all group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center group-hover:from-primary/25 group-hover:to-primary/10 transition-all">
                        <link.icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="group-hover:text-primary transition-colors">{link.title}</span>
                      <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-primary" />
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Trust Badge */}
              <motion.div
                className="mt-5 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200/50 dark:border-emerald-800/30"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 }}
              >
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="font-semibold text-foreground">500+ Artikel</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Von Umzugsexperten verfasst</p>
              </motion.div>
            </DropdownSection>
          </div>

          {/* Column 3: CTA Card */}
          <div className="lg:border-l lg:border-border lg:pl-6">
            <DropdownCTACard
              title="Bereit für den nächsten Schritt?"
              description="Starte jetzt und erhalte kostenlose Offerten von geprüften Umzugsfirmen."
              icon={Zap}
              bullets={[
                "Preisvergleich in 2 Min",
                "3–5 Angebote in 24–48h",
                "100% kostenlos & unverbindlich"
              ]}
              buttonText="Gratis Offerten holen"
              buttonHref="/umzugsofferten"
              onClose={onClose}
            />
          </div>
        </div>
      </div>
    </DropdownWrapper>
  );
};
