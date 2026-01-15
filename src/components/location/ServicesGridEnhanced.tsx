/**
 * SERVICES GRID ENHANCED
 * 
 * Service cards with dual CTAs:
 * 1. "Offerten erhalten" -> scrolls to form
 * 2. "Mehr erfahren" -> links to service+location page
 */

import { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Home, Building2, Sparkles, Wrench, Package, 
  Warehouse, Trash2, Truck, ArrowRight, ExternalLink,
  Globe, Plane, FileCheck, MapPin, Server
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ServiceConfig {
  key: string;
  title: string;
  shortDesc: string;
  icon: string;
  slug: string;
  startingFrom?: string;
}

interface ServicesGridEnhancedProps {
  services: ServiceConfig[];
  citySpecificServices?: ServiceConfig[];
  locationName: string;
  locationSlug: string;
  variant?: 'canton' | 'city';
  className?: string;
}

const iconMap: Record<string, typeof Home> = {
  Home,
  Building2,
  Sparkles,
  Wrench,
  Package,
  Warehouse,
  Trash2,
  Truck,
  Globe,
  Plane,
  FileCheck,
  MapPin,
  Server,
};

export const ServicesGridEnhanced = memo(({
  services,
  citySpecificServices = [],
  locationName,
  locationSlug,
  variant = 'canton',
  className,
}: ServicesGridEnhancedProps) => {
  
  const scrollToOfferten = () => {
    const element = document.getElementById('offerten');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getServiceLink = (serviceSlug: string) => {
    if (variant === 'canton') {
      return `/leistungen/${serviceSlug}/kanton-${locationSlug}`;
    }
    return `/leistungen/${serviceSlug}/${locationSlug}`;
  };

  const renderServiceCard = (service: ServiceConfig, index: number) => {
    const IconComponent = iconMap[service.icon] || Home;
    
    return (
      <motion.div
        key={service.key}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05 }}
        className="bg-card rounded-xl p-5 border border-border hover:border-primary/50 hover:shadow-lg transition-all group"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
            <IconComponent className="w-6 h-6 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold mb-1">{service.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{service.shortDesc}</p>
            
            {service.startingFrom && (
              <p className="text-xs text-primary font-medium mb-3">{service.startingFrom}</p>
            )}
            
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="default"
                onClick={scrollToOfferten}
                className="h-8 text-xs"
              >
                Offerten erhalten
                <ArrowRight className="ml-1 w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                asChild
                className="h-8 text-xs"
              >
                <Link to={getServiceLink(service.slug)}>
                  Mehr erfahren
                  <ExternalLink className="ml-1 w-3 h-3" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <section id="services" className={cn("py-16 bg-muted/30 scroll-mt-20", className)}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Unsere Services
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Services {variant === 'canton' ? 'im Kanton' : 'in'} {locationName}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Alle Dienstleistungen rund um Ihren Umzug – von Verpackung bis Endreinigung.
            </p>
          </div>

          {/* Core Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {services.map((service, index) => renderServiceCard(service, index))}
          </div>

          {/* City-Specific Services */}
          {variant === 'city' && citySpecificServices.length > 0 && (
            <>
              <div className="mt-12 mb-6">
                <h3 className="text-xl font-semibold text-center mb-2">
                  Spezial-Services in {locationName}
                </h3>
                <p className="text-sm text-muted-foreground text-center">
                  Zusätzliche Leistungen speziell für Ihre Region
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {citySpecificServices.map((service, index) => renderServiceCard(service, index))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
});

ServicesGridEnhanced.displayName = 'ServicesGridEnhanced';
