/**
 * Mobile Menu for Navigation Variant #13: Mobile-First Optimiert
 * 
 * Struktur nach UX-Feedback:
 * - 4 Hauptpunkte: Plane deinen Umzug, Offerten vergleichen, So funktioniert's, Hilfe & Kontakt
 * - Du-Form für Vertrauensaufbau
 * - Benefit-orientierte Microcopy
 * - Offerten-Submenu mit 5 Optionen
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  X, 
  ClipboardList,
  Search,
  Info,
  HelpCircle,
  ArrowRight,
  Phone,
  Star,
  CheckCircle2,
  Clock,
  ChevronRight,
  Home,
  Building2,
  Sparkles,
  Globe,
  Package,
  Users,
  FileText
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

interface MobileMenuV13Props {
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

export const MobileMenuV13 = ({ isOpen, onClose }: MobileMenuV13Props) => {
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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] lg:hidden"
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div className={cn(
        "fixed inset-y-0 right-0 w-full max-w-sm",
        "bg-background z-[10005] lg:hidden flex flex-col",
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
            <Button asChild className="flex-1 font-semibold bg-green-600 hover:bg-green-700">
              <Link to="/offerten" onClick={onClose}>
                Gratis Offerten holen
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
              <Clock className="w-3 h-3" /> Offerten in 24h
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-amber-500/10 text-amber-700 font-medium">
              Bis {TRUST_STATS.savings} sparen
            </span>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            
            {/* Accordion for main sections */}
            <Accordion 
              type="single" 
              collapsible 
              value={openAccordion}
              onValueChange={setOpenAccordion}
              className="space-y-2"
            >
              {/* 1. Plane deinen Umzug */}
              <AccordionItem value="planen" className="border rounded-xl overflow-hidden bg-accent/30">
                <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-accent/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ClipboardList className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <span className="font-semibold block">Plane deinen Umzug</span>
                      <span className="text-xs text-muted-foreground">Tools, Checklisten & Tipps</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2">
                  <p className="text-xs text-muted-foreground mb-3 italic">
                    Damit du stressfrei an alles denkst.
                  </p>
                  <div className="space-y-1">
                    <MenuLink 
                      to="/umzug-planen/checkliste" 
                      icon={FileText} 
                      title="Umzugs-Checkliste" 
                      subtitle="PDF Download"
                      badge="Beliebt"
                      featured
                      onClick={onClose} 
                    />
                    <MenuLink 
                      to="/umzugsrechner" 
                      icon={Search} 
                      title="Kostenrechner" 
                      subtitle="In 2 Min zum Richtpreis"
                      onClick={onClose} 
                    />
                    <MenuLink 
                      to="/ratgeber/tipps" 
                      icon={CheckCircle2} 
                      title="Spartipps" 
                      onClick={onClose} 
                    />
                    <MenuLink 
                      to="/ratgeber/wohnungsabgabe" 
                      icon={Home} 
                      title="Wohnungsübergabe" 
                      onClick={onClose} 
                    />
                  </div>
                  <Link
                    to="/umzug-planen"
                    onClick={onClose}
                    className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-primary"
                  >
                    Alle Planungs-Tools <ArrowRight className="w-4 h-4" />
                  </Link>
                </AccordionContent>
              </AccordionItem>

              {/* 2. Offerten vergleichen (Core Funnel) */}
              <AccordionItem value="offerten" className="border-2 border-primary/30 rounded-xl overflow-hidden bg-primary/5">
                <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-primary/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                      <Search className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">Offerten vergleichen</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-500 text-white font-bold">
                          GRATIS
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">Finde das beste Angebot</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2">
                  <p className="text-xs text-muted-foreground mb-3 italic">
                    Hol dir gratis Offerten von geprüften Umzugsfirmen.
                  </p>
                  <div className="space-y-1">
                    <MenuLink 
                      to="/privatumzug" 
                      icon={Home} 
                      title="Privatumzug" 
                      subtitle="Wohnungs- oder Hausumzug"
                      featured
                      onClick={onClose} 
                    />
                    <MenuLink 
                      to="/firmenumzug" 
                      icon={Building2} 
                      title="Büro & Firmenumzug" 
                      subtitle="Geschäftsumzüge"
                      onClick={onClose} 
                    />
                    <MenuLink 
                      to="/umzug-mit-reinigung" 
                      icon={Sparkles} 
                      title="Umzug + Reinigung" 
                      subtitle="Alles in einem"
                      badge="Beliebt"
                      onClick={onClose} 
                    />
                    <MenuLink 
                      to="/international" 
                      icon={Globe} 
                      title="Internationaler Umzug" 
                      subtitle="Auslandsumzüge"
                      onClick={onClose} 
                    />
                    <MenuLink 
                      to="/lagerung-entsorgung" 
                      icon={Package} 
                      title="Lagerung & Entsorgung" 
                      subtitle="Zwischenlagerung & Räumung"
                      onClick={onClose} 
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 3. So funktioniert's */}
              <AccordionItem value="funktioniert" className="border rounded-xl overflow-hidden bg-accent/30">
                <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-accent/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Info className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <span className="font-semibold block">So funktioniert's</span>
                      <span className="text-xs text-muted-foreground">In 3 Schritten zum Umzug</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2">
                  <p className="text-xs text-muted-foreground mb-3 italic">
                    Transparent, sicher und einfach erklärt.
                  </p>
                  
                  {/* Steps */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center flex-shrink-0">
                        1
                      </div>
                      <div>
                        <p className="font-medium text-sm">Anfrage stellen</p>
                        <p className="text-xs text-muted-foreground">In 2 Minuten deine Details eingeben</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center flex-shrink-0">
                        2
                      </div>
                      <div>
                        <p className="font-medium text-sm">Offerten erhalten</p>
                        <p className="text-xs text-muted-foreground">3–5 passende Angebote in 24–48h</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center flex-shrink-0">
                        3
                      </div>
                      <div>
                        <p className="font-medium text-sm">Vergleichen & buchen</p>
                        <p className="text-xs text-muted-foreground">Bestes Angebot wählen</p>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/so-funktioniert"
                    onClick={onClose}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary"
                  >
                    Mehr erfahren <ArrowRight className="w-4 h-4" />
                  </Link>
                </AccordionContent>
              </AccordionItem>

              {/* 4. Hilfe & Kontakt */}
              <AccordionItem value="hilfe" className="border rounded-xl overflow-hidden bg-accent/30">
                <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-accent/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <HelpCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <span className="font-semibold block">Hilfe & Kontakt</span>
                      <span className="text-xs text-muted-foreground">FAQ & persönlicher Support</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2">
                  <p className="text-xs text-muted-foreground mb-3 italic">
                    Wir sind für dich da – bei allen Umzugsfragen.
                  </p>
                  <div className="space-y-1">
                    <MenuLink 
                      to="/hilfe/faq" 
                      icon={HelpCircle} 
                      title="Häufige Fragen (FAQ)" 
                      onClick={onClose} 
                    />
                    <MenuLink 
                      to="/kontakt" 
                      icon={Phone} 
                      title="Kontakt" 
                      onClick={onClose} 
                    />
                  </div>
                  
                  {/* Phone CTA */}
                  <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Lieber telefonieren?</p>
                      <p className="text-xs text-muted-foreground">Mo–Fr 8–18 Uhr</p>
                    </div>
                    <Button asChild size="sm" variant="outline">
                      <a href="tel:+41445001234">
                        <Phone className="w-3 h-3 mr-1" />
                        Anrufen
                      </a>
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Für Anbieter - Separated visually */}
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
  subtitle,
  badge,
  featured,
  onClick 
}: { 
  to: string; 
  icon: React.ElementType; 
  title: string;
  subtitle?: string;
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
    <div className="flex-1 min-w-0">
      <span className="text-sm block">{title}</span>
      {subtitle && (
        <span className="text-[10px] text-muted-foreground block">{subtitle}</span>
      )}
    </div>
    {badge && (
      <span className={cn(
        "text-[9px] px-1.5 py-0.5 rounded font-bold flex-shrink-0",
        badge === "Beliebt" ? "bg-primary text-primary-foreground" :
        "bg-muted text-muted-foreground"
      )}>
        {badge}
      </span>
    )}
  </Link>
);

export default MobileMenuV13;
