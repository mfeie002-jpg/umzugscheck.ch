/**
 * Services Dropdown V17
 * "Der Upsell" - Warenkorb-Wert erhöhen
 */

import { 
  Sparkles, 
  Warehouse, 
  Wrench, 
  Trash2, 
  Package, 
  ParkingCircle, 
  ShoppingBag,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { Link } from "react-router-dom";
import { DropdownWrapper } from "@/components/navigation/DropdownWrapper";
import { DropdownLink } from "@/components/navigation/DropdownLink";
import { DropdownSection } from "@/components/navigation/DropdownSection";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ServicesV17Dropdown = ({ isOpen, onClose }: DropdownProps) => {
  return (
    <DropdownWrapper isOpen={isOpen} onClose={onClose}>
      <div className="container mx-auto px-4 lg:px-6 py-6 lg:py-8">
        <div className="grid grid-cols-12 gap-6 lg:gap-8">
          
          {/* Left Column: Zusatzleistungen */}
          <div className="col-span-12 md:col-span-5">
            <DropdownSection title="Zusatzleistungen" subtitle="Rundum-Sorglos-Paket">
              <div className="space-y-1">
                <DropdownLink
                  to="/reinigungsofferten"
                  icon={Sparkles}
                  title="Endreinigung mit Abnahmegarantie"
                  description="Garantiert saubere Wohnungsübergabe."
                  onClick={onClose}
                  featured
                  badge="Beliebt"
                />
                <DropdownLink
                  to="/lagerung"
                  icon={Warehouse}
                  title="Lagerung & Storage"
                  description="Flexible Zwischenlagerung Ihrer Möbel."
                  onClick={onClose}
                />
                <DropdownLink
                  to="/services/moebelmontage"
                  icon={Wrench}
                  title="Möbelmontage"
                  description="Professioneller Auf- und Abbau."
                  onClick={onClose}
                />
                <DropdownLink
                  to="/entsorgungsofferten"
                  icon={Trash2}
                  title="Entsorgung"
                  description="Fachgerechte Entsorgung von Altmöbeln."
                  onClick={onClose}
                />
              </div>
            </DropdownSection>
          </div>

          {/* Middle Column: Shop */}
          <div className="col-span-12 md:col-span-4">
            <DropdownSection title="Shop" subtitle="Material & Services">
              <div className="space-y-1">
                <DropdownLink
                  to="/umzugsmaterial"
                  icon={Package}
                  title="Umzugskartons kaufen"
                  description="Profi-Material günstig bestellen."
                  onClick={onClose}
                />
                <DropdownLink
                  to="/halteverbotszone"
                  icon={ParkingCircle}
                  title="Halteverbotszone"
                  description="Parkplatz für den Zügeltag reservieren."
                  onClick={onClose}
                />
              </div>
            </DropdownSection>
            
            {/* Bundle Hint */}
            <motion.div 
              className="mt-6 p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/25">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground mb-1">Kombi-Rabatt</h4>
                  <p className="text-xs text-muted-foreground">
                    Buchen Sie Umzug + Reinigung zusammen und sparen Sie 15%.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Premium Services */}
          <div className="col-span-12 md:col-span-3">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/[0.08] via-primary/[0.05] to-transparent border border-primary/15">
              <Badge className="mb-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0">
                <Sparkles className="w-3 h-3 mr-1" />
                Premium
              </Badge>
              
              <h4 className="font-bold text-foreground mb-2">Alles aus einer Hand</h4>
              <p className="text-xs text-muted-foreground mb-4">
                Umzug, Reinigung, Entsorgung – wir koordinieren alles für Sie.
              </p>
              
              <ul className="space-y-2 mb-4">
                {["Ein Ansprechpartner", "Garantierte Termine", "Fixpreis-Angebot"].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
              
              <Link 
                to="/umzugsofferten" 
                onClick={onClose}
                className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                Kombi-Offerte anfragen
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </DropdownWrapper>
  );
};
