/**
 * Mobile Menu for Navigation Variant #12: Best-of-Breed
 * 
 * Optimiert nach ChatGPT UX Audit:
 * - Hero: "Preise berechnen" mit Badge
 * - Benefit-orientierte Sublines
 * - Visuelle Trennung für "Für Anbieter"
 * - Gefüllte Icons für wichtigste Punkte
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  X, 
  Calculator,
  Search,
  Sparkles,
  BookOpen,
  Building2,
  ArrowRight,
  Phone,
  Star,
  Shield,
  CheckCircle2,
  Clock,
  ChevronRight,
  Trash2,
  Box,
  Wrench,
  Truck,
  FileText,
  Award,
  TrendingDown,
  Users,
  Briefcase,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface MobileMenuV12Props {
  isOpen: boolean;
  onClose: () => void;
}

// Trust Stats
const TRUST_STATS = {
  reviews: "4.8",
  reviewCount: "2'847",
  companies: "380+",
  savings: "40%",
};

export const MobileMenuV12 = ({ isOpen, onClose }: MobileMenuV12Props) => {
  const location = useLocation();
  const [openAccordion, setOpenAccordion] = useState<string | undefined>(undefined);

  // Reset on open
  useEffect(() => {
    if (isOpen) setOpenAccordion(undefined);
  }, [isOpen]);

  // Close on route change
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div className={cn(
        "fixed inset-y-0 right-0 w-full max-w-sm",
        "bg-background z-50 lg:hidden flex flex-col",
        "transform transition-transform duration-300",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        
        {/* Header with Trust Badge */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-semibold">{TRUST_STATS.reviews}</span>
            <span className="text-xs text-muted-foreground">({TRUST_STATS.reviewCount})</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-10 w-10">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Top CTAs - Always visible */}
        <div className="px-4 py-3 border-b border-border bg-accent/30">
          <div className="flex gap-2">
            <Button asChild className="flex-1 font-semibold">
              <Link to="/umzugsofferten" onClick={onClose}>
                Offerten vergleichen
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-shrink-0">
              <a href="tel:+41445001234">
                <Phone className="w-4 h-4" />
              </a>
            </Button>
          </div>
          
          {/* Benefit Pills */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-green-500/10 text-green-700 font-medium">
              <CheckCircle2 className="w-3 h-3" /> 100% Gratis
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-blue-500/10 text-blue-700 font-medium">
              <Clock className="w-3 h-3" /> 2 Min
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-amber-500/10 text-amber-700 font-medium">
              Bis {TRUST_STATS.savings} sparen
            </span>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            
            {/* 1. HERO: Preise berechnen - Featured with solid icon */}
            <Link
              to="/umzugsrechner"
              onClick={onClose}
              className="flex items-center justify-between p-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
                  <Calculator className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold block">Preise berechnen</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/30 font-bold">
                      GRATIS
                    </span>
                  </div>
                  <span className="text-xs opacity-90">In 2 Minuten zum Richtpreis</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 opacity-80" />
            </Link>

            {/* Accordion for main sections */}
            <Accordion 
              type="single" 
              collapsible 
              value={openAccordion}
              onValueChange={setOpenAccordion}
              className="space-y-2"
            >
              {/* 2. Umzugsfirma finden */}
              <AccordionItem value="firmen" className="border rounded-xl overflow-hidden bg-accent/30">
                <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-accent/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Search className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <span className="font-semibold block">Umzugsfirma finden</span>
                      <span className="text-xs text-muted-foreground">Bis zu {TRUST_STATS.savings} sparen</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2">
                  <div className="space-y-1">
                    <MenuLink 
                      to="/beste-umzugsfirma" 
                      icon={Award} 
                      title="Beste Umzugsfirmen" 
                      badge="TOP"
                      onClick={onClose} 
                    />
                    <MenuLink 
                      to="/guenstige-umzugsfirma" 
                      icon={TrendingDown} 
                      title="Günstigste Firmen" 
                      onClick={onClose} 
                    />
                    <MenuLink 
                      to="/umzugsfirmen" 
                      icon={Building2} 
                      title="Alle Firmen" 
                      onClick={onClose} 
                    />
                    <MenuLink 
                      to="/regionen" 
                      icon={Building2} 
                      title="Nach Region" 
                      onClick={onClose} 
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 3. Reinigung & Services */}
              <AccordionItem value="reinigung" className="border rounded-xl overflow-hidden bg-accent/30">
                <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-accent/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold">Reinigung & Services</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-500 text-white font-bold">
                          GARANTIE
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">Mit Abnahmegarantie</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2">
                  <div className="space-y-1">
                    <MenuLink 
                      to="/dienstleistungen/reinigung" 
                      icon={Sparkles} 
                      title="Umzugsreinigung" 
                      badge="Garantie"
                      featured
                      onClick={onClose} 
                    />
                    <MenuLink to="/dienstleistungen/entsorgung" icon={Trash2} title="Entsorgung & Räumung" onClick={onClose} />
                    <MenuLink to="/dienstleistungen/einlagerung" icon={Box} title="Lagerung" onClick={onClose} />
                    <MenuLink to="/moebelmontage" icon={Wrench} title="Möbelmontage" onClick={onClose} />
                    <MenuLink to="/dienstleistungen/moebellift" icon={Truck} title="Möbellift" onClick={onClose} />
                    <MenuLink to="/services/packservice" icon={Package} title="Packservice" onClick={onClose} />
                  </div>
                  <Link
                    to="/dienstleistungen"
                    onClick={onClose}
                    className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-primary"
                  >
                    Alle Services <ArrowRight className="w-4 h-4" />
                  </Link>
                </AccordionContent>
              </AccordionItem>

              {/* 4. Checklisten & Ratgeber */}
              <AccordionItem value="ratgeber" className="border rounded-xl overflow-hidden bg-accent/30">
                <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-accent/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <span className="font-semibold block">Checklisten & Ratgeber</span>
                      <span className="text-xs text-muted-foreground">Zeitpläne, Spartipps & Downloads</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2">
                  <div className="space-y-1">
                    <MenuLink 
                      to="/ratgeber/umzugscheckliste-download" 
                      icon={FileText} 
                      title="Umzugs-Checkliste (PDF)" 
                      badge="Beliebt"
                      featured
                      onClick={onClose} 
                    />
                    <MenuLink to="/ratgeber/kosten" icon={Calculator} title="Kosten & Preise" onClick={onClose} />
                    <MenuLink to="/ratgeber/tipps" icon={BookOpen} title="Tipps & Tricks" onClick={onClose} />
                    <MenuLink to="/ratgeber/wohnungsabgabe" icon={FileText} title="Wohnungsübergabe" onClick={onClose} />
                  </div>
                  <Link
                    to="/ratgeber"
                    onClick={onClose}
                    className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-primary"
                  >
                    Alle Ratgeber <ArrowRight className="w-4 h-4" />
                  </Link>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* 5. Firmenumzug - Separated visually */}
            <div className="pt-4 border-t border-border mt-4">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-2">
                Geschäftskunden
              </p>
              <Link
                to="/dienstleistungen/firmenumzug"
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-xl bg-accent/50 border border-border hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium block text-sm">Firmenumzug</span>
                    <span className="text-[11px] text-muted-foreground">Büro- & Projektumzüge</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            </div>

            {/* 6. Für Anbieter - Very separated, secondary */}
            <div className="pt-4 border-t border-dashed border-border mt-4">
              <Link
                to="/anbieter"
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <Users className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Für Anbieter</span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">Partner werden →</span>
              </Link>
            </div>
          </div>
        </ScrollArea>

        {/* Footer Stats */}
        <div className="px-4 py-3 border-t border-border bg-accent/30">
          <div className="flex items-center justify-around text-center">
            <div>
              <p className="text-lg font-bold text-primary">{TRUST_STATS.companies}</p>
              <p className="text-[10px] text-muted-foreground">Geprüfte Firmen</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="text-lg font-bold text-primary">Bis {TRUST_STATS.savings}</p>
              <p className="text-[10px] text-muted-foreground">Ersparnis</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="text-lg font-bold text-primary">{TRUST_STATS.reviews}/5</p>
              <p className="text-[10px] text-muted-foreground">Bewertung</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Helper Component
const MenuLink = ({ 
  to, 
  icon: Icon, 
  title, 
  badge,
  featured,
  onClick 
}: { 
  to: string; 
  icon: React.ElementType; 
  title: string;
  badge?: string;
  featured?: boolean;
  onClick: () => void;
}) => (
  <Link
    to={to}
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
      featured 
        ? "bg-primary/10 text-primary font-medium" 
        : "text-foreground hover:bg-accent"
    )}
  >
    <Icon className="w-4 h-4 text-primary flex-shrink-0" />
    <span className="text-sm flex-1">{title}</span>
    {badge && (
      <span className={cn(
        "text-[9px] px-1.5 py-0.5 rounded font-bold",
        badge === "TOP" ? "bg-amber-500 text-white" :
        badge === "Garantie" ? "bg-green-500 text-white" :
        badge === "Beliebt" ? "bg-primary text-primary-foreground" :
        "bg-muted text-muted-foreground"
      )}>
        {badge}
      </span>
    )}
  </Link>
);

export default MobileMenuV12;
