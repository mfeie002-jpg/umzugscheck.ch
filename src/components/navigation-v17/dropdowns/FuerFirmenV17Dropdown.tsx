/**
 * Für Firmen Dropdown V17
 * "B2B / Partner" - Supply-Side Management
 */

import { 
  Users, 
  LogIn, 
  Building2, 
  Truck, 
  ArrowRight, 
  CheckCircle2,
  TrendingUp,
  BadgePercent,
  Sparkles,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownWrapper } from "@/components/navigation/DropdownWrapper";
import { DropdownLink } from "@/components/navigation/DropdownLink";
import { DropdownSection } from "@/components/navigation/DropdownSection";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const PARTNER_BENEFITS = [
  "Qualifizierte Leads täglich",
  "Keine Fixkosten",
  "Flexible Bezahlung pro Lead",
  "Eigenes Dashboard",
];

export const FuerFirmenV17Dropdown = ({ isOpen, onClose }: DropdownProps) => {
  return (
    <DropdownWrapper isOpen={isOpen} onClose={onClose}>
      <div className="container mx-auto px-4 lg:px-6 py-6 lg:py-8">
        <div className="grid grid-cols-12 gap-6 lg:gap-8">
          
          {/* Left Column: Für Umzugsfirmen */}
          <div className="col-span-12 md:col-span-5">
            <DropdownSection title="Für Umzugsfirmen" subtitle="Wachsen Sie mit uns">
              <div className="space-y-1">
                <DropdownLink
                  to="/fuer-firmen"
                  icon={Users}
                  title="Partner werden"
                  description="Erhalten Sie täglich qualifizierte Leads."
                  onClick={onClose}
                  featured
                />
                <DropdownLink
                  to="/anbieter-login"
                  icon={LogIn}
                  title="Anbieter Login"
                  description="Zugang zu Ihrem Partner-Dashboard."
                  onClick={onClose}
                />
              </div>
              
              {/* Stats */}
              <motion.div 
                className="mt-5 grid grid-cols-2 gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/15">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-bold text-emerald-600">500+</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Leads pro Monat</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/15">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-bold text-amber-600">4.8★</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Partner-Bewertung</p>
                </div>
              </motion.div>
            </DropdownSection>
          </div>

          {/* Middle Column: Für Büros */}
          <div className="col-span-12 md:col-span-3">
            <DropdownSection title="Für Büros" subtitle="B2B Umzüge">
              <div className="space-y-1">
                <DropdownLink
                  to="/firmenumzug"
                  icon={Building2}
                  title="Firmenumzug anfragen"
                  description="Relocation Service für Unternehmen."
                  onClick={onClose}
                />
                <DropdownLink
                  to="/firmenumzug-rechner"
                  icon={Truck}
                  title="Firmenumzug-Rechner"
                  description="Kosten für Büroumzug kalkulieren."
                  onClick={onClose}
                />
              </div>
            </DropdownSection>
          </div>

          {/* Right Column: Partner CTA */}
          <div className="col-span-12 md:col-span-4">
            <motion.div
              className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-primary/[0.12] via-primary/[0.08] to-emerald-500/[0.05] border border-primary/20 shadow-lg shadow-primary/10"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {/* Decorative */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-primary/30 to-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative">
                <Badge className="mb-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0">
                  <BadgePercent className="w-3 h-3 mr-1" />
                  Kostenlos starten
                </Badge>
                
                <h4 className="font-bold text-lg text-foreground mb-2">Partner werden</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Schliessen Sie sich 200+ Umzugsfirmen an und wachsen Sie mit uns.
                </p>
                
                {/* Benefits */}
                <ul className="space-y-2 mb-5">
                  {PARTNER_BENEFITS.map((benefit, idx) => (
                    <motion.li
                      key={idx}
                      className="flex items-center gap-2 text-xs"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + idx * 0.05 }}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-foreground/80">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
                
                <Button 
                  asChild 
                  className="group w-full h-12 bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary text-primary-foreground font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
                >
                  <Link to="/fuer-firmen" onClick={onClose}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Jetzt registrieren
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </DropdownWrapper>
  );
};
