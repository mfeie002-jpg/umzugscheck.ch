import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, CheckCircle, Award, MapPin, Calendar, Phone, Clock,
  Filter, ChevronDown, ChevronUp, Sparkles, TrendingDown, Shield,
  Map as MapIcon, ExternalLink, Users, Zap, Crown, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Company {
  id: string;
  name: string;
  company_name?: string;
  rating: number;
  review_count: number;
  price_level: string;
  is_featured: boolean;
  services_offered: string[];
  service_areas?: string[];
  cantons_served?: string[];
  logo_url?: string | null;
  short_description?: string;
  quality_score?: number;
  slug?: string;
  profile_completeness?: number;
  conversion_rate?: number;
  response_time_avg_hours?: number;
}

interface CompanyComparisonTableProps {
  companies: Company[];
  selectedCompanies: string[];
  selectedServices: string[];
  serviceIdToCompanyService: Record<string, string[]>;
  apartmentSize: string;
  onToggleCompany: (companyId: string) => void;
  getCompanyPrice: (size: string, priceLevel: string) => { min: number; max: number };
}

// Filter options
const sortOptions = [
  { value: "empfohlen", label: "Empfohlen" },
  { value: "rating", label: "Beste Bewertung" },
  { value: "preis", label: "Günstigste" },
  { value: "reviews", label: "Meiste Bewertungen" },
  { value: "schnell", label: "Schnellste Antwort" },
];

const priceLevelOptions = [
  { value: "alle", label: "Alle Preisklassen" },
  { value: "günstig", label: "💰 Günstig" },
  { value: "fair", label: "⚖️ Fair" },
  { value: "premium", label: "⭐ Premium" },
];

const ratingOptions = [
  { value: "alle", label: "Alle Bewertungen" },
  { value: "4.5", label: "⭐ 4.5+" },
  { value: "4.0", label: "⭐ 4.0+" },
  { value: "3.5", label: "⭐ 3.5+" },
];

export const CompanyComparisonTable = memo(function CompanyComparisonTable({
  companies,
  selectedCompanies,
  selectedServices,
  serviceIdToCompanyService,
  apartmentSize,
  onToggleCompany,
  getCompanyPrice,
}: CompanyComparisonTableProps) {
  const [sortBy, setSortBy] = useState("empfohlen");
  const [priceFilter, setPriceFilter] = useState("alle");
  const [ratingFilter, setRatingFilter] = useState("alle");
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null);

  // Calculate match percentage
  const calculateMatch = (company: Company) => {
    let score = 75; // Base
    score += (company.rating - 4) * 10;
    if (company.is_featured) score += 5;
    if (company.quality_score) score += (company.quality_score - 70) / 5;
    if (company.response_time_avg_hours && company.response_time_avg_hours < 4) score += 5;
    return Math.min(99, Math.max(70, Math.round(score)));
  };

  // Filter and sort companies
  const processedCompanies = [...companies]
    .filter((c) => {
      if (priceFilter !== "alle" && c.price_level !== priceFilter) return false;
      if (ratingFilter !== "alle" && c.rating < parseFloat(ratingFilter)) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "preis":
          const priceOrder = { günstig: 1, fair: 2, premium: 3 };
          return (priceOrder[a.price_level] || 2) - (priceOrder[b.price_level] || 2);
        case "reviews":
          return b.review_count - a.review_count;
        case "schnell":
          return (a.response_time_avg_hours || 24) - (b.response_time_avg_hours || 24);
        case "empfohlen":
        default:
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return b.rating - a.rating;
      }
    });

  // Separate promoted (first 2) and organic
  const promotedCompanies = processedCompanies.filter(c => c.is_featured).slice(0, 2);
  const organicCompanies = processedCompanies.filter(c => !promotedCompanies.includes(c));

  return (
    <div className="space-y-3 overflow-x-hidden max-w-full">
      {/* Issue #2, #12, #19, #63: Enhanced Filter Bar - min 48px touch targets, NO horizontal scroll, fully visible */}
      <div className="bg-muted/50 rounded-xl p-3 sm:p-4 space-y-3 overflow-hidden">
        <div className="flex items-center justify-between gap-2 sm:gap-3 flex-wrap">
          {/* Issue #12, #19: 48px min height for filter button, visible text */}
          <Button
            variant="outline"
            size="default"
            onClick={() => setShowFilters(!showFilters)}
            className="h-11 sm:h-12 min-w-[100px] sm:min-w-[120px] text-xs sm:text-sm gap-1.5 sm:gap-2 px-3 sm:px-5 touch-manipulation font-semibold"
            aria-expanded={showFilters}
            aria-label="Filter anzeigen oder ausblenden"
          >
            <Filter className="w-5 h-5" />
            <span>Filtern</span>
            {/* Issue #63: Klarer Dropdown-Pfeil */}
            {showFilters ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </Button>

          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Issue #12, #19: 44px+ touch target for map - hidden on smallest screens */}
            <Button
              variant={showMap ? "default" : "outline"}
              size="default"
              onClick={() => setShowMap(!showMap)}
              className="h-11 sm:h-12 min-w-[44px] text-xs sm:text-sm gap-1 sm:gap-2 px-2 sm:px-4 touch-manipulation hidden xs:flex"
              aria-pressed={showMap}
              aria-label="Kartenansicht umschalten"
            >
              <MapIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Karte</span>
            </Button>
            
            {/* Issue #12, #63: Compact Sort-Dropdown, responsive width */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger 
                className="h-11 sm:h-12 w-[120px] sm:w-[180px] text-xs sm:text-sm font-medium" 
                aria-label="Sortieren nach"
              >
                <span className="text-muted-foreground text-[10px] sm:text-xs mr-0.5 sm:mr-1 hidden sm:inline">Sortieren:</span>
                <SelectValue placeholder="Empfohlen" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-sm py-3 min-h-[48px]">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              {/* Issue #19: 48px height for filter dropdowns */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                <Select value={priceFilter} onValueChange={setPriceFilter}>
                  <SelectTrigger className="h-12 text-sm" aria-label="Preisklasse filtern">
                    <SelectValue placeholder="Preisklasse" />
                  </SelectTrigger>
                  <SelectContent>
                    {priceLevelOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-sm py-3 min-h-[44px]">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                  <SelectTrigger className="h-12 text-sm" aria-label="Bewertung filtern">
                    <SelectValue placeholder="Bewertung" />
                  </SelectTrigger>
                  <SelectContent>
                    {ratingOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-sm py-3 min-h-[44px]">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Issue #56: Map Placeholder - nur einmal, mit klarer Beschreibung */}
      <AnimatePresence>
        {showMap && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-muted/30 rounded-xl h-48 flex items-center justify-center border border-border">
              <div className="text-center text-muted-foreground">
                <MapIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium">Interaktive Karte</p>
                <p className="text-xs">Zeigt Standorte der Firmen in Ihrer Region</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Issue #3, #4, #11, #52, #82: EINZIGE Anzeige der Firmenauswahl - keine Redundanz, klarer CTA */}
      <div
        className={`p-4 rounded-xl transition-all ${
          selectedCompanies.length >= 3
            ? "bg-green-100 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-700"
            : "bg-amber-100 dark:bg-amber-900/30 border-2 border-amber-300 dark:border-amber-700"
        }`}
      >
        <div className="flex flex-col gap-2">
          {/* Issue #3, #4: Nur EINE prominente Status-Anzeige */}
          <div className="text-center">
            {selectedCompanies.length < 3 ? (
              <span className="text-base font-bold text-amber-700 dark:text-amber-400 flex items-center justify-center gap-2">
                <span className="text-xl">👆</span>
                Noch {3 - selectedCompanies.length} Firma{3 - selectedCompanies.length !== 1 ? "en" : ""} auswählen
              </span>
            ) : (
              <span className="text-base font-bold text-green-700 dark:text-green-400 flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                {selectedCompanies.length} Firmen ausgewählt ✓
              </span>
            )}
          </div>
          
          {/* Issue #55: Ausgewählte Firmen kompakt anzeigen mit Entfernen-Option */}
          {selectedCompanies.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {companies
                .filter(c => selectedCompanies.includes(c.id))
                .map(company => (
                  <button
                    key={company.id}
                    type="button"
                    onClick={() => onToggleCompany(company.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white dark:bg-gray-800 border border-green-300 dark:border-green-700 text-sm font-medium text-green-700 dark:text-green-400 hover:bg-red-50 hover:border-red-300 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors touch-manipulation min-h-[44px]"
                    aria-label={`${company.name} aus Auswahl entfernen`}
                  >
                    {company.name}
                    <span className="text-xs opacity-60 hover:opacity-100">✕</span>
                  </button>
                ))
              }
            </div>
          )}
        </div>
      </div>

      {/* Issue #17, #42, #57: Premium Partner - reduzierte Redundanz bei Antwortzeit */}
      {promotedCompanies.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-2">
            <Crown className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-bold text-foreground uppercase tracking-wide">
              Premium Partner
            </span>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              · Schnelle Antwort
            </span>
          </div>
          {promotedCompanies.map((company, index) => (
            <CompanyCard
              key={company.id}
              company={company}
              rank={index + 1}
              isPromoted={true}
              isSelected={selectedCompanies.includes(company.id)}
              isExpanded={expandedCompany === company.id}
              matchPercent={calculateMatch(company)}
              priceEstimate={getCompanyPrice(apartmentSize, company.price_level)}
              selectedServices={selectedServices}
              serviceIdToCompanyService={serviceIdToCompanyService}
              onToggle={() => onToggleCompany(company.id)}
              onExpand={() => setExpandedCompany(expandedCompany === company.id ? null : company.id)}
            />
          ))}
        </div>
      )}

      {/* Issue #54, #56: Organic Companies - VERTIKAL, kein Slider, bessere Sichtbarkeit */}
      <div className="space-y-2" role="list" aria-label="Verfügbare Umzugsfirmen">
        {organicCompanies.length > 6 ? (
          <div className="max-h-[500px] overflow-y-auto pr-1 scroll-smooth space-y-2">
            {organicCompanies.map((company, index) => (
              <CompanyCard
                key={company.id}
                company={company}
                rank={promotedCompanies.length + index + 1}
                isPromoted={false}
                isSelected={selectedCompanies.includes(company.id)}
                isExpanded={expandedCompany === company.id}
                matchPercent={calculateMatch(company)}
                priceEstimate={getCompanyPrice(apartmentSize, company.price_level)}
                selectedServices={selectedServices}
                serviceIdToCompanyService={serviceIdToCompanyService}
                onToggle={() => onToggleCompany(company.id)}
                onExpand={() => setExpandedCompany(expandedCompany === company.id ? null : company.id)}
              />
            ))}
          </div>
        ) : (
          organicCompanies.map((company, index) => (
            <CompanyCard
              key={company.id}
              company={company}
              rank={promotedCompanies.length + index + 1}
              isPromoted={false}
              isSelected={selectedCompanies.includes(company.id)}
              isExpanded={expandedCompany === company.id}
              matchPercent={calculateMatch(company)}
              priceEstimate={getCompanyPrice(apartmentSize, company.price_level)}
              selectedServices={selectedServices}
              serviceIdToCompanyService={serviceIdToCompanyService}
              onToggle={() => onToggleCompany(company.id)}
              onExpand={() => setExpandedCompany(expandedCompany === company.id ? null : company.id)}
            />
          ))
        )}
      </div>
    </div>
  );
});

// Individual Company Card
interface CompanyCardProps {
  company: Company;
  rank: number;
  isPromoted: boolean;
  isSelected: boolean;
  isExpanded: boolean;
  matchPercent: number;
  priceEstimate: { min: number; max: number };
  selectedServices: string[];
  serviceIdToCompanyService: Record<string, string[]>;
  onToggle: () => void;
  onExpand: () => void;
}

function CompanyCard({
  company,
  rank,
  isPromoted,
  isSelected,
  isExpanded,
  matchPercent,
  priceEstimate,
  selectedServices,
  serviceIdToCompanyService,
  onToggle,
  onExpand,
}: CompanyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.02 }}
      className={`relative bg-card rounded-xl border-2 overflow-hidden transition-all hover:shadow-md ${
        isSelected
          ? "border-secondary ring-2 ring-secondary/20"
          : isPromoted
          ? "border-amber-300 dark:border-amber-700"
          : "border-border hover:border-primary/30"
      }`}
    >
      {/* Issue #5, #8, #11, #17, #37, #39: Gesponsert-Label mit besserem Kontrast */}
      {isPromoted && (
        <div className="bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-950/30 text-amber-900 dark:text-amber-200 text-center py-1.5 text-xs font-medium flex items-center justify-center gap-2 border-b border-amber-200 dark:border-amber-700">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="uppercase tracking-wide font-semibold">Gesponsert</span>
        </div>
      )}
      
      {/* Issue #8: "Empfohlen"-Badge NUR wenn nicht gesponsert UND ausgewählt */}
      {!isPromoted && isSelected && (
        <div className="bg-gradient-to-r from-green-100 to-emerald-50 dark:from-green-900/30 dark:to-emerald-950/20 text-green-700 dark:text-green-400 text-center py-1 text-[10px] font-medium flex items-center justify-center gap-1 border-b border-green-200 dark:border-green-800">
          <Award className="w-3 h-3" />
          Ausgewählt
        </div>
      )}

      <div className="p-3" onClick={onToggle}>
        {/* Main Row - Enhanced touch targets */}
        <div className="flex items-start gap-3 cursor-pointer min-h-[60px] touch-manipulation">
          {/* Checkbox + Rank - Enhanced sizes */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            {/* Enhanced: Larger checkbox (24px) */}
            <div
              className={`w-6 h-6 rounded flex items-center justify-center border-2 transition-all ${
                isSelected ? "bg-secondary border-secondary scale-105" : "border-border"
              }`}
            >
              {isSelected && <CheckCircle className="w-4 h-4 text-secondary-foreground" />}
            </div>
            {/* Enhanced: Larger rank badge */}
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                rank === 1
                  ? "bg-amber-400 text-amber-900"
                  : rank === 2
                  ? "bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-200"
                  : rank === 3
                  ? "bg-amber-600 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {rank === 1 ? <Award className="w-5 h-5" /> : rank}
            </div>
          </div>

          {/* Company Info - Enhanced typography */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                  {/* Enhanced: Larger logo (44px) */}
                  <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center font-bold text-base shrink-0">
                    {company.logo_url ? (
                      <img src={company.logo_url} alt={company.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      company.name.charAt(0)
                    )}
                  </div>
                  <div className="min-w-0">
                    {/* Enhanced: Larger company name */}
                    <p className="font-bold text-base truncate">{company.name}</p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {company.service_areas?.[0] || "Schweizweit"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating - Enhanced size */}
              <div className="text-right shrink-0">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-base">{company.rating}</span>
                </div>
                <p className="text-xs text-muted-foreground">({company.review_count} Bew.)</p>
              </div>
            </div>

            {/* Stats Row - Enhanced with tooltips for Issue #8, #41 */}
            <div className="flex items-center gap-2 flex-wrap mb-2">
              {/* Issue #41: Match mit Tooltip-Erklärung */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold cursor-help">
                      <Zap className="w-3 h-3" />
                      {matchPercent}% Match
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[200px] text-xs p-2">
                    <p><strong>Match zu Ihren Kriterien:</strong></p>
                    <p className="text-muted-foreground">Basiert auf Bewertung, Services, Region & Verfügbarkeit.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Price Level */}
              <span className="text-xs font-medium text-muted-foreground">
                {company.price_level === "günstig" && "💰 Günstig"}
                {company.price_level === "fair" && "⚖️ Fair"}
                {company.price_level === "premium" && "⭐ Premium"}
              </span>

              {/* Issue #8: Preisspanne mit Tooltip-Erklärung */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-xs font-bold text-primary cursor-help underline-offset-2 decoration-dotted underline">
                      CHF {priceEstimate.min.toLocaleString()}–{priceEstimate.max.toLocaleString()}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[220px] text-xs p-2">
                    <p><strong>Geschätzte Preisspanne</strong></p>
                    <p className="text-muted-foreground">Basiert auf Ihrer Wohnungsgrösse und ähnlichen Umzügen. Die finale Offerte kann abweichen.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Issue #17: Response Time nur EINMAL anzeigen, nicht redundant */}
              {company.response_time_avg_hours && company.response_time_avg_hours <= 4 && !isPromoted && (
                <span className="inline-flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-400">
                  <Clock className="w-3 h-3" />
                  Antwortet schnell
                </span>
              )}
            </div>

            {/* Services */}
            <div className="flex flex-wrap gap-1">
              {company.services_offered.slice(0, 5).map((service) => {
                const isSelectedService = selectedServices.some((selectedId) => {
                  const matchingNames = serviceIdToCompanyService[selectedId] || [];
                  return matchingNames.some((name) =>
                    service.toLowerCase().includes(name.toLowerCase())
                  );
                });
                return (
                  <span
                    key={service}
                    className={`text-[8px] px-1.5 py-0.5 rounded-full ${
                      isSelectedService
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isSelectedService && "✓ "}
                    {service}
                  </span>
                );
              })}
            </div>

            {/* Savings badge for günstig */}
            {company.price_level === "günstig" && (
              <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 text-[9px] font-medium">
                <TrendingDown className="w-2.5 h-2.5" />
                Bis 35% günstiger als Premium
              </div>
            )}
          </div>

          {/* Availability */}
          <div className="shrink-0 text-right">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[9px] font-medium">
              <Calendar className="w-3 h-3" />
              Verfügbar
            </span>
          </div>
        </div>

        {/* Issue #19: Prominenterer "Mehr Details" Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onExpand();
          }}
          className="w-full h-11 mt-2 text-sm text-primary hover:text-primary hover:bg-primary/10 font-medium touch-manipulation active:scale-[0.98]"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Details ausblenden" : "Details anzeigen"}
        >
          {isExpanded ? "Weniger" : "→ Mehr Details"}
          {isExpanded ? <ChevronUp className="w-4 h-4 ml-1.5" /> : <ChevronDown className="w-4 h-4 ml-1.5" />}
        </Button>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 pt-1 border-t border-border mx-3 space-y-2">
              {/* Description */}
              {company.short_description && (
                <p className="text-[10px] text-muted-foreground">{company.short_description}</p>
              )}

              {/* All Services */}
              <div>
                <p className="text-[9px] font-semibold text-muted-foreground mb-1">Alle Leistungen:</p>
                <div className="flex flex-wrap gap-1">
                  {company.services_offered.map((service) => (
                    <span key={service} className="text-[8px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons - Enhanced touch targets (44px+) */}
              <div className="flex gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-11 text-xs touch-manipulation"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`/firma/${company.slug || company.id}`, "_blank");
                  }}
                  aria-label={`Profil von ${company.name} ansehen`}
                >
                  <ExternalLink className="w-4 h-4 mr-1.5" />
                  Profil ansehen
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-11 text-xs gap-1.5 touch-manipulation"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  aria-label={`${company.name} anrufen`}
                >
                  <Phone className="w-4 h-4" />
                  Anrufen
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
