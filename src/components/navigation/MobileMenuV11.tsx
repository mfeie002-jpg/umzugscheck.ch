/**
 * Mobile Menu for Navigation Variant #11: Simpel & Clean
 * 
 * Mit verstärkten Trust Signals, Emotionen und menschlichem Touch
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useFlowPath } from "@/hooks/useUnifiedAB";
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
  Heart,
  ChevronRight,
  Trash2,
  Box,
  Wrench,
  Truck,
  Building2,
  FileDown,
  MessageCircle,
  ThumbsUp,
  Users
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

// Trust Stats - More emotional
const TRUST_STATS = {
  reviews: "4.8",
  reviewCount: "2'847",
  companies: "380+",
  savings: "40%",
  happyCustomers: "15'000+",
};

// Mini testimonials for social proof
const MINI_TESTIMONIALS = [
  { name: "Sarah M.", text: "Super schnell!", city: "Zürich" },
  { name: "Thomas B.", text: "Endlich stressfrei!", city: "Bern" },
];

export const MobileMenuV11 = ({ isOpen, onClose }: MobileMenuV11Props) => {
  const location = useLocation();
  const flowPath = useFlowPath();
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
        
        {/* Header with Emotional Trust Badge */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-gradient-to-r from-primary/5 to-accent/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-bold">{TRUST_STATS.reviews}</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span className="text-xs text-muted-foreground">{TRUST_STATS.happyCustomers} zufrieden</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-10 w-10">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Top CTAs - Always visible with more emotion */}
        <div className="px-4 py-4 border-b border-border bg-gradient-to-br from-primary/5 via-accent/30 to-background">
          <div className="flex gap-2">
            <Button asChild className="flex-1 font-semibold shadow-lg shadow-primary/25 bg-gradient-to-r from-primary to-primary/90">
              <Link to={flowPath} onClick={onClose}>
                <Sparkles className="w-4 h-4 mr-2" />
                Gratis Offerten
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-shrink-0 border-primary/30">
              <a href="tel:+41445001234">
                <Phone className="w-4 h-4" />
              </a>
            </Button>
          </div>
          
          {/* Trust Pills with more color */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1.5 rounded-full bg-emerald-500/15 text-emerald-700 font-medium border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" /> 100% Kostenlos
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1.5 rounded-full bg-blue-500/15 text-blue-700 font-medium border border-blue-500/20">
              <Clock className="w-3 h-3" /> 2 Min
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1.5 rounded-full bg-purple-500/15 text-purple-700 font-medium border border-purple-500/20">
              <Shield className="w-3 h-3" /> Geprüft
            </span>
          </div>

          {/* Mini Social Proof */}
          <div className="mt-3 p-2.5 rounded-lg bg-background/80 border border-border">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              <p className="text-xs italic text-muted-foreground truncate">"Super schnell und unkompliziert!"</p>
              <span className="text-xs font-medium text-foreground flex-shrink-0">— Sarah M.</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            
            {/* 1. Umzug - Direct Link (Featured) with emotion */}
            <Link
              to="/dienstleistungen/privatumzug"
              onClick={onClose}
              className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="font-bold text-lg block">Umzug</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                    Stressfrei umziehen
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-primary" />
            </Link>

            {/* 2. Umzugsreinigung - Direct Link (Featured) */}
            <Link
              to="/dienstleistungen/reinigung"
              onClick={onClose}
              className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-accent to-accent/50 border border-border hover:border-primary/30 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="font-bold text-lg block">Umzugsreinigung</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3 text-emerald-500" />
                    Mit Abgabegarantie
                  </span>
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
              <AccordionItem value="services" className="border rounded-2xl overflow-hidden bg-accent/30">
                <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-accent/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <span className="font-semibold block">Weitere Services</span>
                      <span className="text-xs text-muted-foreground">Entsorgung, Lagerung, Montage</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2">
                  <div className="space-y-1">
                    <ServiceLink to="/dienstleistungen/entsorgung" icon={Trash2} title="Entsorgung & Räumung" emoji="♻️" onClick={onClose} />
                    <ServiceLink to="/dienstleistungen/einlagerung" icon={Box} title="Lagerung" emoji="📦" onClick={onClose} />
                    <ServiceLink to="/moebelmontage" icon={Wrench} title="Möbelmontage" emoji="🔧" onClick={onClose} />
                    <ServiceLink to="/dienstleistungen/firmenumzug" icon={Building2} title="Firmenumzug" emoji="🏢" onClick={onClose} />
                    <ServiceLink to="/dienstleistungen/moebellift" icon={Truck} title="Möbellift" emoji="🏗️" onClick={onClose} />
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
              <AccordionItem value="ratgeber" className="border rounded-2xl overflow-hidden bg-accent/30">
                <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-accent/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white" />
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
                      emoji="📋" 
                      onClick={onClose}
                      featured 
                    />
                    <ServiceLink to="/ratgeber/tipps" icon={BookOpen} title="Tipps & Tricks" emoji="💡" onClick={onClose} />
                    <ServiceLink to="/ratgeber/kosten" icon={BookOpen} title="Kosten & Preise" emoji="💰" onClick={onClose} />
                    <ServiceLink to="/ratgeber/wohnungsabgabe" icon={BookOpen} title="Wohnungsübergabe" emoji="🔑" onClick={onClose} />
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
              className="flex items-center justify-between p-4 rounded-2xl bg-accent/30 border border-border hover:bg-accent/50 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-semibold block">So funktioniert's</span>
                  <span className="text-xs text-muted-foreground">Transparent erklärt</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>

            {/* Personal Contact CTA */}
            <a
              href="tel:+41445001234"
              className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-rose-500/10 to-rose-500/5 border border-rose-500/20 hover:border-rose-500/40 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-semibold block text-rose-700">Persönliche Beratung</span>
                  <span className="text-xs text-rose-600/80">Wir helfen dir gerne!</span>
                </div>
              </div>
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            </a>

            {/* Quick Links - SEO wichtig */}
            <div className="pt-4 border-t border-border mt-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                <Star className="w-3.5 h-3.5 text-yellow-500" />
                Schnellzugriff
              </p>
              <div className="grid grid-cols-2 gap-2">
                <QuickLink to="/beste-umzugsfirma" label="⭐ Beste Firmen" onClick={onClose} />
                <QuickLink to="/guenstige-umzugsfirma" label="💰 Günstige Firmen" onClick={onClose} />
                <QuickLink to="/umzugsfirmen" label="🏢 Alle Firmen" onClick={onClose} />
                <QuickLink to="/regionen" label="📍 Nach Region" onClick={onClose} />
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer Stats with more visual appeal */}
        <div className="px-4 py-4 border-t border-border bg-gradient-to-r from-accent via-accent/50 to-background">
          <div className="flex items-center justify-around text-center">
            <div>
              <div className="flex items-center justify-center gap-1">
                <Users className="w-4 h-4 text-primary" />
                <p className="text-lg font-bold text-primary">{TRUST_STATS.companies}</p>
              </div>
              <p className="text-[10px] text-muted-foreground">Geprüfte Firmen</p>
            </div>
            <div className="h-10 w-px bg-border" />
            <div>
              <div className="flex items-center justify-center gap-1">
                <ThumbsUp className="w-4 h-4 text-emerald-500" />
                <p className="text-lg font-bold text-emerald-600">Bis {TRUST_STATS.savings}</p>
              </div>
              <p className="text-[10px] text-muted-foreground">Ersparnis</p>
            </div>
            <div className="h-10 w-px bg-border" />
            <div>
              <div className="flex items-center justify-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <p className="text-lg font-bold text-amber-600">{TRUST_STATS.reviews}</p>
              </div>
              <p className="text-[10px] text-muted-foreground">Bewertung</p>
            </div>
          </div>
          
          {/* Happy customers indicator */}
          <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-border/50">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-background flex items-center justify-center text-[10px] text-white font-bold">S</div>
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 border-2 border-background flex items-center justify-center text-[10px] text-white font-bold">T</div>
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-background flex items-center justify-center text-[10px] text-white font-bold">L</div>
            </div>
            <p className="text-xs text-muted-foreground">
              <Heart className="w-3 h-3 inline text-rose-500 fill-rose-500 mr-1" />
              <span className="font-semibold text-foreground">{TRUST_STATS.happyCustomers}</span> zufriedene Kunden
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

// Helper Components with emojis
const ServiceLink = ({ 
  to, 
  icon: Icon, 
  title, 
  emoji,
  onClick,
  featured 
}: { 
  to: string; 
  icon: React.ElementType; 
  title: string;
  emoji?: string; 
  onClick: () => void;
  featured?: boolean;
}) => (
  <Link
    to={to}
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
      featured 
        ? "bg-gradient-to-r from-primary/15 to-primary/5 text-primary font-medium border border-primary/20" 
        : "text-foreground hover:bg-accent border border-transparent hover:border-border"
    )}
  >
    {emoji && <span className="text-base">{emoji}</span>}
    <span className="text-sm">{title}</span>
  </Link>
);

const QuickLink = ({ to, label, onClick }: { to: string; label: string; onClick: () => void }) => (
  <Link
    to={to}
    onClick={onClick}
    className="px-3 py-2.5 rounded-xl bg-background border border-border text-sm font-medium text-center hover:bg-accent hover:border-primary/30 transition-all duration-200"
  >
    {label}
  </Link>
);

export default MobileMenuV11;
