/**
 * GOLD STANDARD - Enhanced Services Grid
 * SEO-optimized with dual CTAs: "Offerten erhalten" + "Mehr erfahren"
 * ChatGPT recommendation: Service hub with deep links
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { 
  Home, Building2, Sparkles, Wrench, Package, 
  Warehouse, Piano, Trash2, ArrowRight, FileText 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useFlowPath } from "@/hooks/useUnifiedAB";

interface ServiceItem {
  title: string;
  icon: React.ElementType;
  description: string;
  slug: string;
}

const SERVICES: ServiceItem[] = [
  { 
    title: "Privatumzug", 
    icon: Home, 
    description: "Kompletter Umzugsservice für Privathaushalte",
    slug: "privatumzug"
  },
  { 
    title: "Firmenumzug", 
    icon: Building2, 
    description: "Büro- & Geschäftsumzüge mit minimaler Ausfallzeit",
    slug: "firmenumzug"
  },
  { 
    title: "Endreinigung", 
    icon: Sparkles, 
    description: "Professionelle Wohnungsreinigung mit Abnahmegarantie",
    slug: "endreinigung"
  },
  { 
    title: "Möbelmontage", 
    icon: Wrench, 
    description: "Fachgerechter Auf- & Abbau Ihrer Möbel",
    slug: "moebelmontage"
  },
  { 
    title: "Ein-/Auspackservice", 
    icon: Package, 
    description: "Wir verpacken & entpacken Ihren Hausrat",
    slug: "packservice"
  },
  { 
    title: "Einlagerung", 
    icon: Warehouse, 
    description: "Sichere Lagerräume für kurz- oder langfristig",
    slug: "einlagerung"
  },
  { 
    title: "Klaviertransport", 
    icon: Piano, 
    description: "Spezialtransport für Klaviere & Flügel",
    slug: "klaviertransport"
  },
  { 
    title: "Entsorgung", 
    icon: Trash2, 
    description: "Fachgerechte Entsorgung & Räumung",
    slug: "entsorgung"
  },
];

interface RegionServicesEnhancedProps {
  regionName: string;
  regionSlug: string;
  variant?: 'canton' | 'city';
}

export const RegionServicesEnhanced = memo(({ 
  regionName, 
  regionSlug,
  variant = 'canton' 
}: RegionServicesEnhancedProps) => {
  const flowPath = useFlowPath();
  const locationPrefix = variant === 'canton' ? 'im Kanton' : 'in';
  const urlPrefix = variant === 'canton' ? `kanton-${regionSlug}` : regionSlug;
  
  return (
    <section id="services" className="py-12 md:py-16 bg-muted/30 scroll-mt-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Beliebte Services {locationPrefix} {regionName}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Alle Umzugsleistungen aus einer Hand – von Privatumzug bis Endreinigung.
            Vergleichen Sie Offerten für jeden Service.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group bg-card border border-border rounded-xl p-4 md:p-5 hover:shadow-lg hover:border-primary/40 transition-all"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                <service.icon className="w-6 h-6 text-primary" />
              </div>
              
              <h3 className="font-semibold text-sm md:text-base mb-1">
                {service.title}
              </h3>
              <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                {service.description}
              </p>
              
              {/* Dual CTA */}
              <div className="flex flex-col gap-2">
                <Button 
                  size="sm" 
                  className="w-full text-xs h-8 gradient-cta text-white"
                  asChild
                >
                  <Link to={flowPath}>
                    <FileText className="w-3 h-3 mr-1" />
                    Offerte
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-xs h-7 text-muted-foreground hover:text-primary"
                  asChild
                >
                  <Link to={`/leistungen/${service.slug}/${urlPrefix}`}>
                    Mehr erfahren
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <p className="text-sm text-muted-foreground mb-4">
            Sie benötigen mehrere Services? Kombinieren Sie und sparen Sie bis zu 20%!
          </p>
          <Button size="lg" asChild className="gradient-cta text-white">
            <Link to={flowPath}>
              Komplettpaket anfragen
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
});

RegionServicesEnhanced.displayName = 'RegionServicesEnhanced';
