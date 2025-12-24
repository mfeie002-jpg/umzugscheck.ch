import { memo, useState } from "react";
import { motion } from "framer-motion";
import { 
  Star, Shield, Clock, MapPin, CheckCircle, TrendingDown, 
  Award, ArrowRight, Phone, ChevronDown, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DEMO_COMPANIES, getCompaniesByRegion } from "@/data/companies";
import type { CompanyData } from "@/lib/ranking-algorithm";

interface CompanyRankingResultsProps {
  fromLocation: string;
  toLocation: string;
  apartmentSize: string;
  selectedServices: string[];
  onSelectCompany: (companyId: string) => void;
  onRequestQuotes: () => void;
}

// Price estimation based on apartment size
const getPriceEstimate = (size: string, priceLevel: string) => {
  const basePrices: Record<string, { min: number; max: number }> = {
    "studio": { min: 480, max: 680 },
    "1-1.5": { min: 580, max: 850 },
    "2-2.5": { min: 780, max: 1200 },
    "3-3.5": { min: 980, max: 1600 },
    "4-4.5": { min: 1400, max: 2200 },
    "5+": { min: 1800, max: 3200 },
    "office": { min: 2500, max: 5000 },
  };
  
  const base = basePrices[size] || { min: 800, max: 1500 };
  
  // Adjust based on price level
  const multiplier = priceLevel === "günstig" ? 0.85 : priceLevel === "premium" ? 1.25 : 1;
  
  return {
    min: Math.round(base.min * multiplier),
    max: Math.round(base.max * multiplier),
  };
};

export const CompanyRankingResults = memo(function CompanyRankingResults({
  fromLocation,
  toLocation,
  apartmentSize,
  selectedServices,
  onSelectCompany,
  onRequestQuotes,
}: CompanyRankingResultsProps) {
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);

  // Get companies filtered by region (if detectable from fromLocation)
  const region = fromLocation.split(" ").pop() || "";
  let companies = getCompaniesByRegion(region);
  
  // If no region match, show all
  if (companies.length < 5) {
    companies = DEMO_COMPANIES;
  }

  // Filter by services if possible
  const filteredCompanies = companies.filter((company) => {
    // Check if company offers at least one of the selected services
    if (selectedServices.length === 0) return true;
    return selectedServices.some((service) =>
      company.services_offered.some((s) =>
        s.toLowerCase().includes(service.toLowerCase())
      )
    );
  });

  // Sort: Featured first, then by rating
  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;
    return b.rating - a.rating;
  });

  const displayedCompanies = showAll ? sortedCompanies : sortedCompanies.slice(0, 5);

  const toggleCompany = (companyId: string) => {
    setSelectedCompanies((prev) =>
      prev.includes(companyId)
        ? prev.filter((id) => id !== companyId)
        : [...prev, companyId]
    );
  };

  const handleRequestQuotes = () => {
    onRequestQuotes();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-lg font-bold">
          {sortedCompanies.length} passende Firmen gefunden
        </h3>
        <p className="text-sm text-muted-foreground">
          Von {fromLocation} nach {toLocation}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl border border-green-200 dark:border-green-800">
        <div className="text-center">
          <p className="text-lg font-bold text-green-700 dark:text-green-400">
            bis 40%
          </p>
          <p className="text-[10px] text-green-600/80 dark:text-green-400/80">
            Sparpotenzial
          </p>
        </div>
        <div className="text-center border-x border-green-200 dark:border-green-700">
          <p className="text-lg font-bold text-green-700 dark:text-green-400">
            24-48h
          </p>
          <p className="text-[10px] text-green-600/80 dark:text-green-400/80">
            Offerten
          </p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-green-700 dark:text-green-400">
            100%
          </p>
          <p className="text-[10px] text-green-600/80 dark:text-green-400/80">
            Gratis
          </p>
        </div>
      </div>

      {/* Company List */}
      <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
        {displayedCompanies.map((company, index) => {
          const priceEst = getPriceEstimate(apartmentSize, company.price_level);
          const isSelected = selectedCompanies.includes(company.id);

          return (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <button
                type="button"
                onClick={() => toggleCompany(company.id)}
                className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border-2 shrink-0 mt-0.5 ${
                      isSelected
                        ? "bg-primary border-primary"
                        : "border-border"
                    }`}
                  >
                    {isSelected && (
                      <CheckCircle className="w-3.5 h-3.5 text-primary-foreground" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm truncate">
                        {company.name}
                      </span>
                      {company.is_featured && (
                        <Badge
                          variant="secondary"
                          className="text-[9px] px-1.5 py-0 h-4 bg-primary/10 text-primary"
                        >
                          <Award className="w-2.5 h-2.5 mr-0.5" />
                          Top
                        </Badge>
                      )}
                    </div>

                    {/* Rating & Reviews */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{company.rating}</span>
                      </div>
                      <span>({company.review_count} Bewertungen)</span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-3 h-3" />
                        &lt;{Math.round(company.response_time_avg_hours || 2)}h
                      </span>
                    </div>

                    {/* Services Tags */}
                    <div className="flex flex-wrap gap-1">
                      {company.services_offered.slice(0, 3).map((service) => (
                        <span
                          key={service}
                          className="text-[10px] bg-muted px-1.5 py-0.5 rounded"
                        >
                          {service}
                        </span>
                      ))}
                      {company.services_offered.length > 3 && (
                        <span className="text-[10px] text-muted-foreground">
                          +{company.services_offered.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price Estimate */}
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-primary">
                      CHF {priceEst.min.toLocaleString()}–{priceEst.max.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {company.price_level === "günstig"
                        ? "Günstig"
                        : company.price_level === "premium"
                        ? "Premium"
                        : "Fair"}
                    </p>
                  </div>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Show More */}
      {sortedCompanies.length > 5 && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="w-full flex items-center justify-center gap-1 py-2 text-sm text-primary hover:underline"
        >
          {showAll
            ? "Weniger anzeigen"
            : `${sortedCompanies.length - 5} weitere anzeigen`}
          <ChevronDown
            className={`w-4 h-4 transition-transform ${showAll ? "rotate-180" : ""}`}
          />
        </button>
      )}

      {/* CTA */}
      <div className="space-y-2 pt-2">
        <Button
          onClick={handleRequestQuotes}
          disabled={selectedCompanies.length === 0}
          className="w-full h-12 bg-secondary hover:bg-secondary/90 font-bold text-base shadow-cta"
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          {selectedCompanies.length > 0
            ? `Offerten von ${selectedCompanies.length} Firma${selectedCompanies.length > 1 ? "en" : ""} anfordern`
            : "Firmen auswählen für Offerten"}
        </Button>
        
        <p className="text-center text-[10px] text-muted-foreground flex items-center justify-center gap-1">
          <Shield className="w-3 h-3" />
          Kostenlos & unverbindlich • Keine Werbeanrufe
        </p>
      </div>
    </div>
  );
});
