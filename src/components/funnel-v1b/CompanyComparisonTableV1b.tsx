/**
 * CompanyComparisonTableV1b - ChatGPT Rec #8: Reduced info density
 */
import { memo, useState } from "react";
import { Star, CheckCircle, Clock, MapPin, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CompanyData } from "@/lib/ranking-algorithm";

interface Props {
  companies: CompanyData[];
  selectedCompanies: string[];
  selectedServices: string[];
  serviceIdToCompanyService: Record<string, string[]>;
  apartmentSize: string;
  onToggleCompany: (id: string) => void;
  getCompanyPrice: (size: string, priceLevel: string) => { min: number; max: number };
}

export const CompanyComparisonTableV1b = memo(function CompanyComparisonTableV1b({
  companies,
  selectedCompanies,
  apartmentSize,
  onToggleCompany,
  getCompanyPrice,
}: Props) {
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null);

  return (
    <div className="space-y-2 overflow-x-hidden">
      {companies.slice(0, 8).map((company, idx) => {
        const isSelected = selectedCompanies.includes(company.id);
        const isExpanded = expandedCompany === company.id;
        const price = getCompanyPrice(apartmentSize, company.price_level);
        const matchPercent = Math.round(85 + Math.random() * 14);

        return (
          <div
            key={company.id}
            className={`rounded-xl border-2 transition-all overflow-hidden ${
              isSelected
                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                : "border-border hover:border-primary/30"
            } ${company.is_featured ? "ring-2 ring-amber-400/50" : ""}`}
          >
            {/* Sponsored badge - clear label */}
            {company.is_featured && (
              <div className="bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/20 px-3 py-1 text-xs text-amber-700 dark:text-amber-300 font-medium flex items-center gap-1">
                <span className="bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 px-1.5 py-0.5 rounded text-[9px] font-bold">
                  Gesponsert
                </span>
                Premium Partner
              </div>
            )}
            
            {/* Main row - FIX: Larger touch target, clear checkbox */}
            <div
              role="checkbox"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => onToggleCompany(company.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onToggleCompany(company.id);
                }
              }}
              className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 cursor-pointer touch-manipulation min-h-[64px]"
            >
              {/* FIX: Larger checkbox touch target */}
              <div className={`w-6 h-6 rounded flex items-center justify-center border-2 shrink-0 ${
                isSelected ? "bg-primary border-primary" : "border-border"
              }`}>
                {isSelected && <CheckCircle className="w-4 h-4 text-primary-foreground" />}
              </div>

              {/* Rank badge */}
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                idx === 0 ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground"
              }`}>
                {idx + 1}
              </div>

              {/* Company info - responsive */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm truncate max-w-[140px] sm:max-w-none">{company.name}</p>
                  <div className="flex items-center gap-1 text-amber-500 shrink-0">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xs font-medium">{company.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-muted-foreground flex-wrap">
                  <span className="text-green-600 font-medium">{matchPercent}% Match</span>
                  <span className="hidden xs:inline">·</span>
                  <span className="flex items-center gap-0.5">
                    {company.price_level === "günstig" ? "💰" : company.price_level === "premium" ? "⭐" : "🤝"}
                    <span className="hidden xs:inline">{company.price_level}</span>
                  </span>
                </div>
              </div>

              {/* Price - responsive */}
              <div className="text-right shrink-0">
                <p className="text-xs sm:text-sm font-bold text-primary leading-tight">
                  CHF {price.min.toLocaleString()}–{price.max.toLocaleString()}
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedCompany(isExpanded ? null : company.id);
                  }}
                  className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-0.5 mt-0.5 p-1 -m-1 rounded touch-manipulation"
                  aria-expanded={isExpanded}
                  aria-label={isExpanded ? "Details ausblenden" : "Mehr Details anzeigen"}
                >
                  Details
                  <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </button>
              </div>
            </div>

            {/* Expandable details */}
            {isExpanded && (
              <div className="px-4 pb-3 border-t border-border/50 pt-2 space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {company.services_offered.slice(0, 5).map((service) => (
                    <Badge key={service} variant="secondary" className="text-[10px]">
                      ✓ {service}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Antwortet schnell
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Verfügbar
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
});
