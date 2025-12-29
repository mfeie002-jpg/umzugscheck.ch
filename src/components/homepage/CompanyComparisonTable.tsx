import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, CheckCircle, Award, MapPin, Calendar, Phone, Clock,
  Filter, ChevronDown, ChevronUp, Sparkles, TrendingDown, Shield,
  Map as MapIcon, ExternalLink, Users, Zap, Crown
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
    <div className="space-y-3">
      {/* Enhanced Filter Bar - larger touch targets */}
      <div className="bg-muted/50 rounded-xl p-3 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            // Enhanced: h-10 for 44px touch target
            className="h-10 text-sm gap-2 px-3 touch-manipulation"
          >
            <Filter className="w-4 h-4" />
            Filter
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant={showMap ? "default" : "outline"}
              size="sm"
              onClick={() => setShowMap(!showMap)}
              // Enhanced: h-10 for 44px touch target
              className="h-10 text-sm gap-2 px-3 touch-manipulation"
            >
              <MapIcon className="w-4 h-4" />
              <span className="hidden xs:inline">Karte</span>
            </Button>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              {/* Enhanced: h-10 for 44px touch target */}
              <SelectTrigger className="h-10 w-[120px] sm:w-[150px] text-sm">
                <SelectValue placeholder="Sortieren" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-sm py-2">
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
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                <Select value={priceFilter} onValueChange={setPriceFilter}>
                  {/* Enhanced: h-10 for 44px touch target */}
                  <SelectTrigger className="h-10 text-sm">
                    <SelectValue placeholder="Preisklasse" />
                  </SelectTrigger>
                  <SelectContent>
                    {priceLevelOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-sm py-2">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                  {/* Enhanced: h-10 for 44px touch target */}
                  <SelectTrigger className="h-10 text-sm">
                    <SelectValue placeholder="Bewertung" />
                  </SelectTrigger>
                  <SelectContent>
                    {ratingOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-sm py-2">
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

      {/* Map Placeholder */}
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
                <p className="text-xs">Interaktive Karte</p>
                <p className="text-[10px]">Zeigt Standorte der Firmen</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Selection Counter - larger text, more prominent */}
      <div
        className={`p-3 rounded-xl text-center text-sm font-semibold transition-all ${
          selectedCompanies.length >= 3
            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
            : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
        }`}
      >
        {selectedCompanies.length < 3 ? (
          <span className="flex items-center justify-center gap-2">
            <span className="text-lg">👆</span>
            Noch {3 - selectedCompanies.length} Firma{3 - selectedCompanies.length > 1 ? "en" : ""}{" "}
            auswählen für optimalen Vergleich
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {selectedCompanies.length} Firmen ausgewählt – Vergleich bereit!
          </span>
        )}
      </div>

      {/* Promoted Companies */}
      {promotedCompanies.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
              Premium Partner
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

      {/* Organic Companies */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
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
      {/* Promoted Badge */}
      {isPromoted && (
        <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-amber-900 text-center py-1 text-[10px] font-bold flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3" />
          Gesponsert · Premium Partner
        </div>
      )}
      
      {/* ChatGPT #9: "Empfohlen"-Badge for recommended companies */}
      {!isPromoted && isSelected && (
        <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-center py-1 text-[10px] font-bold flex items-center justify-center gap-1">
          <Award className="w-3 h-3" />
          Empfohlen
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

            {/* Stats Row - Enhanced */}
            <div className="flex items-center gap-2 flex-wrap mb-2">
              {/* Match - Enhanced */}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold">
                <Zap className="w-3 h-3" />
                {matchPercent}% Match
              </span>

              {/* Price Level - Enhanced */}
              <span className="text-xs font-medium text-muted-foreground">
                {company.price_level === "günstig" && "💰 Günstig"}
                {company.price_level === "fair" && "⚖️ Fair"}
                {company.price_level === "premium" && "⭐ Premium"}
              </span>

              {/* Price Estimate - Enhanced */}
              <span className="text-xs font-bold text-primary">
                CHF {priceEstimate.min.toLocaleString()}–{priceEstimate.max.toLocaleString()}
              </span>

              {/* Response Time - Enhanced */}
              {company.response_time_avg_hours && company.response_time_avg_hours <= 4 && (
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

        {/* Expand Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onExpand();
          }}
          className="w-full h-6 mt-2 text-[10px] text-muted-foreground hover:text-foreground"
        >
          {isExpanded ? "Weniger Details" : "Mehr Details"}
          {isExpanded ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
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

              {/* Action Buttons */}
              <div className="flex gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8 text-[10px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`/firma/${company.slug || company.id}`, "_blank");
                  }}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Profil ansehen
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-[10px] gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Phone className="w-3 h-3" />
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
