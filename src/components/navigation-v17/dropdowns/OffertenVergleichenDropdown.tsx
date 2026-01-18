/**
 * Offerten vergleichen Dropdown
 * "Das Produkt / Action" - Hier verdienen wir Geld
 */

import { 
  FileText, 
  Building2, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Shield, 
  Star,
  Sparkles,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownWrapper } from "@/components/navigation/DropdownWrapper";
import { DropdownLink } from "@/components/navigation/DropdownLink";
import { DropdownSection } from "@/components/navigation/DropdownSection";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const REGIONS = [
  { name: "Zürich", slug: "zuerich" },
  { name: "Bern", slug: "bern" },
  { name: "Basel", slug: "basel" },
  { name: "Luzern", slug: "luzern" },
  { name: "St. Gallen", slug: "st-gallen" },
  { name: "Genf", slug: "genf" },
];

const TRUST_POINTS = [
  { icon: CheckCircle2, label: "Lokale Firmen" },
  { icon: Star, label: "Geprüfte Bewertungen" },
  { icon: Shield, label: "Kostenlos" },
];

export const OffertenVergleichenDropdown = ({ isOpen, onClose }: DropdownProps) => {
  return (
    <DropdownWrapper isOpen={isOpen} onClose={onClose}>
      <div className="container mx-auto px-4 lg:px-6 py-6 lg:py-8">
        <div className="grid grid-cols-12 gap-6 lg:gap-8">
          
          {/* Left Column: Direkteinstieg */}
          <div className="col-span-12 md:col-span-3">
            <DropdownSection title="Direkteinstieg" subtitle="Jetzt starten">
              <div className="space-y-1">
                <DropdownLink
                  to="/umzugsofferten"
                  icon={FileText}
                  title="Jetzt Offerten anfragen"
                  description="Starten Sie den Vergleich."
                  onClick={onClose}
                  featured
                />
                <DropdownLink
                  to="/firmen"
                  icon={Building2}
                  title="Firmenverzeichnis"
                  description="Alle Anbieter durchstöbern."
                  onClick={onClose}
                />
              </div>
            </DropdownSection>
          </div>

          {/* Middle Column: Nach Region */}
          <div className="col-span-12 md:col-span-5">
            <DropdownSection title="Nach Region" subtitle="Firmen in Ihrer Nähe">
              <div className="grid grid-cols-2 gap-2">
                {REGIONS.map((region, idx) => (
                  <motion.div
                    key={region.slug}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + idx * 0.03 }}
                  >
                    <Link
                      to={`/umzugsfirmen/kanton-${region.slug}`}
                      onClick={onClose}
                      className={cn(
                        "group flex items-center gap-2.5 p-3 rounded-xl transition-all",
                        "hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5",
                        "border border-transparent hover:border-primary/15",
                        "active:scale-[0.98]"
                      )}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/10 transition-all">
                        <MapPin className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                        {region.name}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-primary opacity-0 group-hover:opacity-100 ml-auto transition-all -translate-x-2 group-hover:translate-x-0" />
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              <Link 
                to="/regionen" 
                onClick={onClose}
                className="flex items-center gap-2 mt-4 text-sm font-semibold text-primary hover:underline"
              >
                Alle Regionen anzeigen
                <ArrowRight className="w-4 h-4" />
              </Link>
            </DropdownSection>
          </div>

          {/* Right Column: Trust & CTA */}
          <div className="col-span-12 md:col-span-4">
            <motion.div
              className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-secondary/10 via-secondary/5 to-transparent border border-secondary/20 shadow-lg shadow-secondary/5"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-secondary/20 to-rose-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative">
                <h4 className="font-bold text-lg text-foreground mb-4">Warum umzugscheck.ch?</h4>
                
                {/* Trust Points */}
                <ul className="space-y-3 mb-5">
                  {TRUST_POINTS.map((point, idx) => (
                    <motion.li
                      key={idx}
                      className="flex items-center gap-3 text-sm"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + idx * 0.05 }}
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="font-medium text-foreground/80">{point.label}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button 
                  asChild 
                  className="group w-full h-12 bg-gradient-to-r from-secondary via-secondary to-secondary/90 hover:from-secondary/90 hover:via-secondary hover:to-secondary text-secondary-foreground font-bold shadow-lg shadow-secondary/25 hover:shadow-xl hover:shadow-secondary/30 transition-all"
                >
                  <Link to="/umzugsofferten" onClick={onClose}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Offerten anfordern
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                
                {/* Micro stats */}
                <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-secondary/10">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-secondary" />
                    <span className="text-[11px] font-semibold text-muted-foreground">24h Antwort</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-[11px] font-semibold text-muted-foreground">4.8★ Bewertung</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </DropdownWrapper>
  );
};
