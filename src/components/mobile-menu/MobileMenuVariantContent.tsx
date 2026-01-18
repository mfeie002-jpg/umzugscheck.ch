/**
 * Mobile Menu Variant Content
 * 
 * Dynamic menu content based on navigation variant.
 * Each variant has different menu structure and items.
 */

import { Link } from "react-router-dom";
import { 
  Calculator, CheckSquare, Clock, Lightbulb, FileDown, Search, MapPin, 
  Building2, Home, Globe, Sparkles, Wrench, Package, Trash2, Box, 
  Truck, ParkingCircle, FileText, DollarSign, Calendar, Baby, 
  Briefcase, LogIn, Star, ArrowRight, Heart
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { NavConfig } from "@/lib/navigation-variants";
import { CANTONS_MAP, CITIES_MAP } from "@/data/locations";

// Beliebte Städte & Kantone
const POPULAR_CITIES = ['zuerich', 'bern', 'basel', 'genf', 'lausanne', 'luzern'];
const POPULAR_CANTONS = ['zuerich', 'bern', 'aargau', 'st-gallen', 'luzern', 'basel-stadt'];
const popularCitiesData = POPULAR_CITIES.map(slug => CITIES_MAP[slug]).filter(Boolean);

interface MenuContentProps {
  onClose: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

// ============================================
// Mobile Menu Item Components
// ============================================
interface MobileMenuItemProps {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  badge?: string;
  emoji?: string;
  description?: string;
  onClick: () => void;
}

export const MobileMenuItem = ({ to, icon: Icon, title, badge, emoji, description, onClick }: MobileMenuItemProps) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-3 py-3 px-3 rounded-xl hover:bg-primary/5 transition-all touch-manipulation min-h-[56px] group"
  >
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-muted/60 to-muted flex items-center justify-center flex-shrink-0 group-hover:from-primary/15 group-hover:to-primary/5 transition-all">
      <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        {emoji && <span className="text-base">{emoji}</span>}
        <span className="font-semibold text-sm text-foreground">{title}</span>
        {badge && (
          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
            {badge}
          </span>
        )}
      </div>
      {description && (
        <span className="text-xs text-muted-foreground line-clamp-1">{description}</span>
      )}
    </div>
    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
  </Link>
);

interface MobileMenuItemCompactProps {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  emoji?: string;
  onClick: () => void;
}

export const MobileMenuItemCompact = ({ to, icon: Icon, title, emoji, onClick }: MobileMenuItemCompactProps) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-2 py-2.5 px-3 rounded-xl bg-muted/30 hover:bg-primary/10 transition-all touch-manipulation min-h-[44px]"
  >
    <Icon className="w-4 h-4 text-muted-foreground" />
    {emoji && <span className="text-sm">{emoji}</span>}
    <span className="font-medium text-xs text-foreground truncate">{title}</span>
  </Link>
);

// ============================================
// PREISRECHNER / KOSTEN CONTENT
// ============================================
export const PreisrechnerContent = ({ onClose, variant }: { onClose: () => void; variant: NavConfig }) => {
  // Variant-specific content
  const isKostenPlanung = variant.id === 'variant-d' || variant.id === 'variant-e' || variant.id === 'variant-f' || variant.id === 'variant-17';
  const isOffertenFirst = variant.id === 'variant-c';
  
  if (isOffertenFirst) {
    // Variant C: "Offerten vergleichen" first - show companies/regions
    return (
      <>
        <p className="text-xs font-bold text-muted-foreground mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" /> 
          <span>Offerten nach Region</span>
        </p>
        <div className="space-y-1">
          <MobileMenuItem to="/umzugsofferten" icon={Search} title="Offerten vergleichen" badge="🔥 Gratis" emoji="🔍" description="Bis zu 40% sparen" onClick={onClose} />
          <MobileMenuItem to="/umzugsfirmen-schweiz" icon={MapPin} title="Alle Kantone" emoji="🗺️" description="500+ geprüfte Firmen" onClick={onClose} />
          <MobileMenuItem to="/beste-umzugsfirma" icon={Star} title="Beste Umzugsfirmen" emoji="⭐" description="Top-bewertete Anbieter" onClick={onClose} />
          <MobileMenuItem to="/guenstige-umzugsfirma" icon={DollarSign} title="Günstige Firmen" emoji="💰" description="Preis-Leistung" onClick={onClose} />
        </div>
      </>
    );
  }
  
  if (isKostenPlanung) {
    // Variant D, E, F, 17: "Kosten & Planung" - show planning tools
    return (
      <>
        <div className="space-y-1">
          <MobileMenuItem to="/vergleich" icon={Calculator} title="Umzugskosten berechnen" badge="🔥 Gratis" emoji="💰" description="In 2 Min. Preis erfahren" onClick={onClose} />
          <MobileMenuItem to="/ratgeber/umzugscheckliste-download" icon={CheckSquare} title="Umzugscheckliste" emoji="✅" description="PDF Download" onClick={onClose} />
          <MobileMenuItem to="/ratgeber/zeitplan" icon={Clock} title="Zeitplan erstellen" emoji="📅" description="3 Monate vor Umzug starten" onClick={onClose} />
          <MobileMenuItem to="/ratgeber/kosten" icon={DollarSign} title="Kostenübersicht" emoji="💵" description="Was kostet ein Umzug?" onClick={onClose} />
        </div>
        <div className="mt-4 pt-3 border-t border-primary/10">
          <p className="text-xs font-bold text-muted-foreground mb-3 flex items-center gap-2">
            <FileDown className="w-4 h-4 text-primary" /> 
            <span>Gratis Downloads</span>
          </p>
          <div className="flex flex-wrap gap-2">
            <Link to="/ratgeber/umzugscheckliste-download" onClick={onClose} className="text-xs px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary/15 to-primary/5 text-primary font-bold hover:from-primary/25 hover:to-primary/15 transition-all touch-manipulation min-h-[44px] flex items-center gap-2 border border-primary/20">
              📄 Checkliste PDF
            </Link>
            <Link to="/ratgeber/kuendigung" onClick={onClose} className="text-xs px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary/15 to-primary/5 text-primary font-bold hover:from-primary/25 hover:to-primary/15 transition-all touch-manipulation min-h-[44px] flex items-center gap-2 border border-primary/20">
              📝 Kündigungsvorlage
            </Link>
          </div>
        </div>
      </>
    );
  }
  
  // Default: "Preisrechner" - calculator focus
  return (
    <>
      <div className="space-y-1">
        <MobileMenuItem to="/vergleich" icon={Calculator} title="Umzugskosten berechnen" badge="🔥 Gratis" emoji="💰" description="In 2 Min. Preis erfahren" onClick={onClose} />
        <MobileMenuItem to="/ratgeber/umzugscheckliste-download" icon={CheckSquare} title="Umzugscheckliste" emoji="✅" description="Nichts vergessen" onClick={onClose} />
        <MobileMenuItem to="/ratgeber/zeitplan" icon={Clock} title="Zeitplan & Ablauf" emoji="📅" description="Perfekt organisiert" onClick={onClose} />
        <MobileMenuItem to="/ratgeber/tipps" icon={Lightbulb} title="Umzugstipps" emoji="💡" description="Spart Zeit & Geld" onClick={onClose} />
      </div>
      <div className="mt-4 pt-3 border-t border-primary/10">
        <p className="text-xs font-bold text-muted-foreground mb-3 flex items-center gap-2">
          <FileDown className="w-4 h-4 text-primary" /> 
          <span>Gratis Downloads</span>
          <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">PDF</span>
        </p>
        <div className="flex flex-wrap gap-2">
          <Link to="/ratgeber/umzugscheckliste-download" onClick={onClose} className="text-xs px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary/15 to-primary/5 text-primary font-bold hover:from-primary/25 hover:to-primary/15 transition-all touch-manipulation min-h-[44px] flex items-center gap-2 border border-primary/20">
            📄 Checkliste PDF
          </Link>
          <Link to="/ratgeber/kuendigung" onClick={onClose} className="text-xs px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary/15 to-primary/5 text-primary font-bold hover:from-primary/25 hover:to-primary/15 transition-all touch-manipulation min-h-[44px] flex items-center gap-2 border border-primary/20">
            📝 Kündigungsvorlage
          </Link>
        </div>
      </div>
    </>
  );
};

// ============================================
// FIRMEN / OFFERTEN CONTENT
// ============================================
export const FirmenContent = ({ onClose, searchTerm, setSearchTerm, variant }: MenuContentProps & { variant: NavConfig }) => {
  const isKostenSecond = variant.id === 'variant-c'; // Variant C has "Kosten & Planung" as second item
  
  // Search results
  const searchResults = searchTerm.trim() ? {
    cantons: Object.values(CANTONS_MAP).filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 4),
    cities: Object.values(CITIES_MAP).filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 4),
  } : { cantons: [], cities: [] };
  
  if (isKostenSecond) {
    // Variant C: Second position is "Kosten & Planung"
    return (
      <>
        <div className="space-y-1">
          <MobileMenuItem to="/vergleich" icon={Calculator} title="Preisrechner" badge="🔥 2 Min" emoji="💰" description="Kosten sofort erfahren" onClick={onClose} />
          <MobileMenuItem to="/ratgeber/umzugscheckliste-download" icon={CheckSquare} title="Umzugscheckliste" emoji="✅" description="Gratis PDF" onClick={onClose} />
          <MobileMenuItem to="/ratgeber/zeitplan" icon={Clock} title="Zeitplan erstellen" emoji="📅" description="Perfekt organisiert" onClick={onClose} />
          <MobileMenuItem to="/ratgeber/kosten" icon={DollarSign} title="Kostenübersicht" emoji="💵" description="Alle Infos" onClick={onClose} />
        </div>
      </>
    );
  }
  
  // Default: Firmen/Offerten - show search and companies
  return (
    <>
      {/* Suchfeld */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
        <Input
          type="text"
          placeholder="🔍 Stadt oder Kanton suchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 h-13 min-h-[52px] text-base rounded-xl border-2 border-emerald-200 dark:border-emerald-800 focus:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 touch-manipulation"
        />
      </div>

      {/* Suchergebnisse */}
      {searchTerm.trim() && (searchResults.cantons.length > 0 || searchResults.cities.length > 0) && (
        <div className="space-y-2 mb-4 p-4 bg-gradient-to-r from-emerald-50 to-transparent dark:from-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800">
          {searchResults.cantons.map(canton => (
            <Link
              key={canton.slug}
              to={`/umzugsfirmen/kanton-${canton.slug}`}
              onClick={onClose}
              className="flex items-center gap-3 py-3 px-3 text-sm hover:text-emerald-600 transition-colors rounded-lg hover:bg-white dark:hover:bg-emerald-900/30 touch-manipulation min-h-[52px]"
            >
              <MapPin className="w-5 h-5 text-emerald-500" />
              <span className="font-semibold">Kanton {canton.name}</span>
            </Link>
          ))}
          {searchResults.cities.map(city => (
            <Link
              key={city.slug}
              to={`/umzugsfirmen/${city.slug}`}
              onClick={onClose}
              className="flex items-center gap-3 py-3 px-3 text-sm hover:text-emerald-600 transition-colors rounded-lg hover:bg-white dark:hover:bg-emerald-900/30 touch-manipulation min-h-[52px]"
            >
              <Building2 className="w-5 h-5 text-muted-foreground" />
              <span className="font-semibold">{city.name}</span>
            </Link>
          ))}
        </div>
      )}

      {/* Beliebte Städte */}
      {!searchTerm.trim() && (
        <>
          <p className="text-xs font-bold text-muted-foreground mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" /> 
            <span>Beliebte Städte</span>
            <span className="text-[10px] bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full">Top 6</span>
          </p>
          <div className="space-y-1 mb-4">
            {popularCitiesData.map(city => (
              <MobileMenuItem
                key={city.slug}
                to={`/umzugsfirmen/${city.slug}`}
                icon={Building2}
                title={`Umzugsfirma ${city.name}`}
                emoji="🏢"
                description="Geprüfte Anbieter"
                onClick={onClose}
              />
            ))}
          </div>

          {/* Beliebte Kantone */}
          <p className="text-xs font-bold text-muted-foreground mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-500" /> 
            <span>Beliebte Kantone</span>
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {POPULAR_CANTONS.map(slug => {
              const canton = CANTONS_MAP[slug];
              if (!canton) return null;
              return (
                <Link
                  key={slug}
                  to={`/umzugsfirmen/kanton-${slug}`}
                  onClick={onClose}
                  className="text-sm px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-100 to-emerald-50 dark:from-emerald-900/50 dark:to-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-bold hover:from-emerald-200 hover:to-emerald-100 dark:hover:from-emerald-800/50 transition-all touch-manipulation min-h-[48px] flex items-center border border-emerald-200 dark:border-emerald-800"
                >
                  {canton.short}
                </Link>
              );
            })}
          </div>

          <Link
            to="/umzugsfirmen-schweiz"
            onClick={onClose}
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 py-2 touch-manipulation"
          >
            Alle Kantone & Städte
            <ArrowRight className="w-4 h-4" />
          </Link>
        </>
      )}
    </>
  );
};

// ============================================
// SERVICES CONTENT
// ============================================
export const ServicesContent = ({ onClose }: { onClose: () => void }) => (
  <>
    <p className="text-xs font-bold text-muted-foreground mb-3 flex items-center gap-2">
      <Home className="w-4 h-4 text-purple-500" /> 
      <span>Umzugsarten</span>
    </p>
    <div className="space-y-1 mb-4">
      <MobileMenuItem to="/dienstleistungen/privatumzug" icon={Home} title="Privatumzug" emoji="🏠" description="Wohnung & Haus" onClick={onClose} />
      <MobileMenuItem to="/dienstleistungen/firmenumzug" icon={Building2} title="Geschäftsumzug" emoji="🏢" description="Büro & Firma" onClick={onClose} />
      <MobileMenuItem to="/dienstleistungen/international" icon={Globe} title="Internationaler Umzug" emoji="🌍" description="Weltweit umziehen" onClick={onClose} />
    </div>

    <p className="text-xs font-bold text-muted-foreground mb-3 flex items-center gap-2">
      <Sparkles className="w-4 h-4 text-purple-500" /> 
      <span>Zusatzservices</span>
      <span className="text-[10px] bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">Beliebt</span>
    </p>
    <div className="grid grid-cols-2 gap-2">
      <MobileMenuItemCompact to="/dienstleistungen/reinigung" icon={Sparkles} title="Endreinigung" emoji="✨" onClick={onClose} />
      <MobileMenuItemCompact to="/moebelmontage" icon={Wrench} title="Möbelmontage" emoji="🔧" onClick={onClose} />
      <MobileMenuItemCompact to="/dienstleistungen/einlagerung" icon={Package} title="Lagerung" emoji="📦" onClick={onClose} />
      <MobileMenuItemCompact to="/dienstleistungen/entsorgung" icon={Trash2} title="Entsorgung" emoji="🗑️" onClick={onClose} />
      <MobileMenuItemCompact to="/services/packservice" icon={Box} title="Umzugskartons" emoji="📋" onClick={onClose} />
      <MobileMenuItemCompact to="/ratgeber/halteverbot" icon={ParkingCircle} title="Halteverbot" emoji="🅿️" onClick={onClose} />
      <MobileMenuItemCompact to="/dienstleistungen/moebellift" icon={Truck} title="Möbellift" emoji="🏗️" onClick={onClose} />
    </div>

    <Link
      to="/dienstleistungen"
      onClick={onClose}
      className="inline-flex items-center gap-2 mt-4 text-sm font-bold text-purple-600 hover:text-purple-700 py-2 touch-manipulation"
    >
      Alle Services ansehen
      <ArrowRight className="w-4 h-4" />
    </Link>
  </>
);

// ============================================
// RATGEBER CONTENT
// ============================================
export const RatgeberContent = ({ onClose }: { onClose: () => void }) => (
  <>
    <p className="text-xs font-bold text-muted-foreground mb-3 flex items-center gap-2">
      <Star className="w-4 h-4 text-amber-500" /> 
      <span>Top Ratgeber</span>
      <span className="text-[10px] bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full">Hilfreich</span>
    </p>
    <div className="space-y-1 mb-4">
      <MobileMenuItem to="/ratgeber/umzugscheckliste-download" icon={CheckSquare} title="Umzug Checkliste (PDF)" badge="🔥 Top" emoji="✅" description="Gratis herunterladen" onClick={onClose} />
      <MobileMenuItem to="/ratgeber/wohnungsabgabe" icon={Home} title="Wohnungsübergabe" emoji="🏠" description="Tipps für Abnahme" onClick={onClose} />
      <MobileMenuItem to="/ratgeber/kuendigung" icon={FileText} title="Kündigung & Ummeldung" emoji="📝" description="Vorlagen inklusive" onClick={onClose} />
      <MobileMenuItem to="/ratgeber/kosten" icon={DollarSign} title="Spartipps" emoji="💰" description="Bis 40% sparen" onClick={onClose} />
    </div>

    <p className="text-xs font-bold text-muted-foreground mb-3 flex items-center gap-2">
      <Lightbulb className="w-4 h-4 text-amber-500" /> 
      <span>Weitere Themen</span>
    </p>
    <div className="grid grid-cols-2 gap-2">
      <MobileMenuItemCompact to="/ratgeber/zeitplan" icon={Calendar} title="Zeitplan" emoji="📅" onClick={onClose} />
      <MobileMenuItemCompact to="/ratgeber/halteverbot" icon={MapPin} title="Halteverbot" emoji="🅿️" onClick={onClose} />
      <MobileMenuItemCompact to="/ratgeber/umzug-mit-kindern" icon={Baby} title="Mit Kindern" emoji="👶" onClick={onClose} />
      <MobileMenuItemCompact to="/ratgeber/packtipps" icon={Box} title="Packtipps" emoji="📦" onClick={onClose} />
    </div>

    <Link
      to="/ratgeber"
      onClick={onClose}
      className="inline-flex items-center gap-2 mt-4 text-sm font-bold text-amber-600 hover:text-amber-700 py-2 touch-manipulation"
    >
      Alle Ratgeber lesen
      <ArrowRight className="w-4 h-4" />
    </Link>
  </>
);

// ============================================
// FÜR FIRMEN CONTENT
// ============================================
export const FuerFirmenContent = ({ onClose }: { onClose: () => void }) => (
  <>
    <div className="space-y-1">
      <MobileMenuItem to="/anbieter" icon={Briefcase} title="Partner werden" badge="🤝 Willkommen" emoji="💼" description="Mehr Kunden gewinnen" onClick={onClose} />
      <MobileMenuItem to="/fuer-umzugsfirmen/preise" icon={DollarSign} title="Preise & Modelle" emoji="💰" description="Transparent & fair" onClick={onClose} />
      <MobileMenuItem to="/auth" icon={LogIn} title="Login / Dashboard" emoji="🔐" description="Firmen-Bereich" onClick={onClose} />
    </div>
    <div className="mt-4 pt-3 border-t border-blue-200 dark:border-blue-800">
      <p className="text-xs font-bold text-muted-foreground mb-3 flex items-center gap-2">
        <Building2 className="w-4 h-4 text-blue-500" /> 
        <span>B2B Umzüge</span>
      </p>
      <div className="space-y-1">
        <MobileMenuItem to="/dienstleistungen/firmenumzug" icon={Building2} title="Firmenumzug" emoji="🏢" description="Büro & Gewerbe" onClick={onClose} />
        <MobileMenuItem to="/dienstleistungen/praxisumzug" icon={Heart} title="Praxisumzug" emoji="🏥" description="Arztpraxen & Kliniken" onClick={onClose} />
      </div>
    </div>
  </>
);
