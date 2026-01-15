/**
 * SERVICES GRID
 * 
 * Display service cards with dual CTAs:
 * 1. "Offerten erhalten" -> scrolls to form
 * 2. "Mehr erfahren" -> links to service+place page
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Home, Building2, Sparkles, Wrench, Package, 
  Warehouse, Trash2, Truck, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ServiceConfig } from "@/data/archetypeConfig";
import { getServiceLink } from "@/data/archetypeConfig";

// Icon map
const ICON_MAP: Record<string, any> = {
  Home, Building2, Sparkles, Wrench, Package, Warehouse, Trash2, Truck,
};

interface ServicesGridProps {
  services: ServiceConfig[];
  placeName: string;
  placeSlug: string;
  placeKind: 'canton' | 'city';
  citySpecificServices?: ServiceConfig[];
}

export const ServicesGrid = memo(({ 
  services,
  placeName,
  placeSlug,
  placeKind,
  citySpecificServices = [],
}: ServicesGridProps) => {
  const locationPrefix = placeKind === 'canton' ? 'im Kanton' : 'in';
  
  const scrollToForm = () => {
    const el = document.getElementById('offerten');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const renderServiceCard = (service: ServiceConfig, index: number) => {
    const Icon = ICON_MAP[service.iconKey] || Package;
    const serviceLink = getServiceLink(service.slug, placeSlug, placeKind);
    
    return (
      <motion.div
        key={service.key}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05 }}
        className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow group"
      >
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base leading-tight">{service.title}</h3>
            {service.startingFrom && (
              <span className="text-xs text-green-600 font-medium">{service.startingFrom}</span>
            )}
          </div>
          {service.isPopular && (
            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full shrink-0">
              Beliebt
            </span>
          )}
        </div>
        
        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {service.shortDesc} {locationPrefix} {placeName}
        </p>
        
        {/* Dual CTAs */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            size="sm" 
            className="flex-1 h-9"
            onClick={scrollToForm}
          >
            Offerten erhalten
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1 h-9"
            asChild
          >
            <Link to={serviceLink}>
              Mehr erfahren
              <ArrowRight className="ml-1 w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </motion.div>
    );
  };

  return (
    <section id="services" className="py-16 md:py-20 scroll-mt-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Unsere Services {locationPrefix} {placeName}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Alle Dienstleistungen für Ihren Umzug – mit Deep Links zu detaillierten Infos
          </p>
        </motion.div>

        {/* Core Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {services.map((service, index) => renderServiceCard(service, index))}
        </div>

        {/* City-Specific Services */}
        {citySpecificServices.length > 0 && (
          <div className="mt-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <h3 className="text-xl font-bold mb-2">
                Spezialservices in {placeName}
              </h3>
              <p className="text-sm text-muted-foreground">
                Zusätzliche Leistungen speziell für {placeName}
              </p>
            </motion.div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {citySpecificServices.map((service, index) => (
                <motion.div
                  key={service.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-muted/50 border border-border rounded-xl p-4 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    {(() => {
                      const Icon = ICON_MAP[service.iconKey] || Package;
                      return <Icon className="w-5 h-5 text-primary" />;
                    })()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm">{service.title}</h4>
                    <p className="text-xs text-muted-foreground truncate">{service.shortDesc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
});

ServicesGrid.displayName = 'ServicesGrid';
