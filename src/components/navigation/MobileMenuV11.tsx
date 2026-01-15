/**
 * Mobile Menu for Navigation Variant #11: Simpel & Clean
 * 
 * Fokus auf Klarheit, Trust Signals, und schnelle Conversion
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  X, 
  Home, 
  Sparkles, 
  Package, 
  BookOpen, 
  HelpCircle,
  ArrowRight,
  Phone,
  Star,
  Shield,
  CheckCircle2,
  Clock,
  Users,
  ChevronRight,
  Trash2,
  Box,
  Wrench,
  Truck,
  Building2,
  FileDown
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

interface MobileMenuV11Props {
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

export const MobileMenuV11 = ({ isOpen, onClose }: MobileMenuV11Props) => {
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
                Gratis Offerten
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-shrink-0">
              <a href="tel:+41445001234">
                <Phone className="w-4 h-4" />
              </a>
            </Button>
          </div>
          
          {/* Trust Pills */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-green-500/10 text-green-700 font-medium">
              <CheckCircle2 className="w-3 h-3" /> Kostenlos
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-blue-500/10 text-blue-700 font-medium">
              <Clock className="w-3 h-3" /> 2 Min
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-purple-500/10 text-purple-700 font-medium">
              <Shield className="w-3 h-3" /> Geprüft
            </span>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            
            {/* 1. Umzug - Direct Link (Featured) */}
            <Link
              to="/dienstleistungen/privatumzug"
              onClick={onClose}
              className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Home className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <span className="font-semibold block">Umzug</span>
                  <span className="text-xs text-muted-foreground">Stressfreier Wohnungswechsel</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-primary" />
            </Link>

            {/* 2. Umzugsreinigung - Direct Link (Featured) */}
            <Link
              to="/dienstleistungen/reinigung"
              onClick={onClose}
              className="flex items-center justify-between p-4 rounded-xl bg-accent/50 border border-border hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <span className="font-semibold block">Umzugsreinigung</span>
                  <span className="text-xs text-muted-foreground">Mit Abgabegarantie</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>

            {/* Accordion for dropdowns */}
            <Accordion 
              type="single" 
              collapsible 
              value={openAccordion}
              onValueChange={setOpenAccordion}
              className="space-y-2"
            >
              {/* 3. Weitere Services */}
              <AccordionItem value="services" className="border rounded-xl overflow-hidden bg-accent/30">
                <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-accent/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <span className="font-semibold block">Weitere Services</span>
                      <span className="text-xs text-muted-foreground">Entsorgung, Lagerung, Montage</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2">
                  <div className="space-y-1">
                    <ServiceLink to="/dienstleistungen/entsorgung" icon={Trash2} title="Entsorgung & Räumung" onClick={onClose} />
                    <ServiceLink to="/dienstleistungen/einlagerung" icon={Box} title="Lagerung" onClick={onClose} />
                    <ServiceLink to="/moebelmontage" icon={Wrench} title="Möbelmontage" onClick={onClose} />
                    <ServiceLink to="/dienstleistungen/firmenumzug" icon={Building2} title="Firmenumzug" onClick={onClose} />
                    <ServiceLink to="/dienstleistungen/moebellift" icon={Truck} title="Möbellift" onClick={onClose} />
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

              {/* 4. Ratgeber */}
              <AccordionItem value="ratgeber" className="border rounded-xl overflow-hidden bg-accent/30">
                <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-accent/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <span className="font-semibold block">Ratgeber</span>
                      <span className="text-xs text-muted-foreground">Checklisten, Tipps & Tricks</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2">
                  <div className="space-y-1">
                    <ServiceLink 
                      to="/ratgeber/umzugscheckliste-download" 
                      icon={FileDown} 
                      title="Umzugs-Checkliste (PDF)" 
                      onClick={onClose}
                      featured 
                    />
                    <ServiceLink to="/ratgeber/tipps" icon={BookOpen} title="Tipps & Tricks" onClick={onClose} />
                    <ServiceLink to="/ratgeber/kosten" icon={BookOpen} title="Kosten & Preise" onClick={onClose} />
                    <ServiceLink to="/ratgeber/wohnungsabgabe" icon={BookOpen} title="Wohnungsübergabe" onClick={onClose} />
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

            {/* 5. So funktioniert's - Direct Link */}
            <Link
              to="/so-funktionierts"
              onClick={onClose}
              className="flex items-center justify-between p-4 rounded-xl bg-accent/30 border border-border hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <span className="font-semibold block">So funktioniert's</span>
                  <span className="text-xs text-muted-foreground">Transparent erklärt</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>

            {/* Quick Links - SEO wichtig */}
            <div className="pt-4 border-t border-border mt-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">
                Schnellzugriff
              </p>
              <div className="grid grid-cols-2 gap-2">
                <QuickLink to="/beste-umzugsfirma" label="Beste Firmen" onClick={onClose} />
                <QuickLink to="/guenstige-umzugsfirma" label="Günstige Firmen" onClick={onClose} />
                <QuickLink to="/umzugsfirmen" label="Alle Firmen" onClick={onClose} />
                <QuickLink to="/regionen" label="Nach Region" onClick={onClose} />
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer Stats */}
        <div className="px-4 py-3 border-t border-border bg-accent/30">
          <div className="flex items-center justify-around text-center">
            <div>
              <p className="text-lg font-bold text-primary">{TRUST_STATS.companies}</p>
              <p className="text-[10px] text-muted-foreground">Firmen</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="text-lg font-bold text-primary">Bis {TRUST_STATS.savings}</p>
              <p className="text-[10px] text-muted-foreground">Ersparnis</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="text-lg font-bold text-primary">{TRUST_STATS.reviews}</p>
              <p className="text-[10px] text-muted-foreground">Bewertung</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Helper Components
const ServiceLink = ({ 
  to, 
  icon: Icon, 
  title, 
  onClick,
  featured 
}: { 
  to: string; 
  icon: React.ElementType; 
  title: string; 
  onClick: () => void;
  featured?: boolean;
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
    <Icon className="w-4 h-4 text-primary" />
    <span className="text-sm">{title}</span>
  </Link>
);

const QuickLink = ({ to, label, onClick }: { to: string; label: string; onClick: () => void }) => (
  <Link
    to={to}
    onClick={onClick}
    className="px-3 py-2 rounded-lg bg-background border border-border text-sm font-medium text-center hover:bg-accent transition-colors"
  >
    {label}
  </Link>
);

export default MobileMenuV11;
