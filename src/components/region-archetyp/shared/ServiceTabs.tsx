import { memo } from "react";
import { SERVICES } from "@/data/regions-database";

interface ServiceTabsProps {
  activeService: string;
  onServiceChange: (service: string) => void;
}

export const ServiceTabs = memo(({ activeService, onServiceChange }: ServiceTabsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {SERVICES.map(service => (
        <button
          key={service.id}
          onClick={() => !service.disabled && onServiceChange(service.id)}
          disabled={service.disabled}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeService === service.id
              ? 'bg-primary text-primary-foreground'
              : service.disabled
              ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-60'
              : 'bg-muted hover:bg-muted/80 text-foreground'
          }`}
        >
          {service.label}
          {service.disabled && <span className="ml-1 text-xs">(bald)</span>}
        </button>
      ))}
    </div>
  );
});

ServiceTabs.displayName = 'ServiceTabs';
