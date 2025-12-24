import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle, Info } from "lucide-react";

export interface ServiceOption {
  id: string;
  label: string;
  description: string;
  priceRange: string;
  details: string;
  benefits: string[];
  icon: React.ReactNode;
  popular?: boolean;
}

interface ExpandableServiceCardProps {
  service: ServiceOption;
  isSelected: boolean;
  onToggle: () => void;
}

export const ExpandableServiceCard = memo(function ExpandableServiceCard({
  service,
  isSelected,
  onToggle,
}: ExpandableServiceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`rounded-xl border-2 transition-all duration-200 ${
        isSelected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border hover:border-primary/30"
      }`}
    >
      {/* Main Row - Clickable to select */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-3 text-left"
      >
        {/* Checkbox */}
        <div
          className={`w-5 h-5 rounded-md flex items-center justify-center border-2 transition-colors shrink-0 ${
            isSelected
              ? "bg-primary border-primary"
              : "border-border"
          }`}
        >
          {isSelected && (
            <CheckCircle className="w-3.5 h-3.5 text-primary-foreground" />
          )}
        </div>

        {/* Icon */}
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
            isSelected ? "bg-primary/20" : "bg-muted"
          }`}
        >
          {service.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold truncate">{service.label}</p>
            {service.popular && (
              <span className="text-[9px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded-full font-medium shrink-0">
                Beliebt
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {service.description}
          </p>
        </div>

        {/* Price + Expand */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-medium text-primary">
            {service.priceRange}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-1 rounded-full hover:bg-muted transition-colors"
            aria-label="Mehr Infos"
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          </button>
        </div>
      </button>

      {/* Expandable Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 pt-1 border-t border-border/50 mx-3">
              <div className="flex items-start gap-2 mb-2 mt-2">
                <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {service.details}
                </p>
              </div>
              
              {service.benefits.length > 0 && (
                <div className="space-y-1.5 mt-3">
                  <p className="text-xs font-medium text-foreground">Vorteile:</p>
                  <ul className="space-y-1">
                    {service.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle className="w-3 h-3 text-green-500 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
