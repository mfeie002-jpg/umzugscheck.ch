/**
 * Related Services Component
 * 
 * Internal linking component for service pages
 * Displays related services to improve navigation and SEO
 */

import { Link } from "react-router-dom";
import { memo } from "react";
import { ArrowRight, Truck, Home, Briefcase, Sparkles, Trash2, Package, Sofa, Piano, Globe, Shield, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ServiceLink {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
  priceHint?: string;
}

const ALL_SERVICES: ServiceLink[] = [
  { slug: "privatumzug", name: "Privatumzug", description: "Kompletter Umzugsservice für Ihr Zuhause", icon: Home, priceHint: "ab CHF 400" },
  { slug: "firmenumzug", name: "Firmenumzug", description: "Professionelle Büroumzüge", icon: Briefcase, priceHint: "ab CHF 1'500" },
  { slug: "reinigung", name: "Endreinigung", description: "Abgabereinigung & Garantie", icon: Sparkles, priceHint: "ab CHF 250" },
  { slug: "entsorgung", name: "Entsorgung", description: "Entrümpelung & Räumung", icon: Trash2, priceHint: "ab CHF 200" },
  { slug: "lagerung", name: "Einlagerung", description: "Sichere Möbellagerung", icon: Package, priceHint: "ab CHF 50/m³" },
  { slug: "moebelmontage", name: "Möbelmontage", description: "Auf- & Abbau Service", icon: Sofa, priceHint: "ab CHF 80/h" },
  { slug: "klaviertransport", name: "Klaviertransport", description: "Spezialtransport für Klaviere", icon: Piano, priceHint: "ab CHF 350" },
  { slug: "international", name: "Auslandsumzug", description: "Internationale Umzüge", icon: Globe, priceHint: "auf Anfrage" },
  { slug: "tresortransport", name: "Tresortransport", description: "Sichere Tresortransporte", icon: Shield, priceHint: "ab CHF 300" },
  { slug: "umzugshelfer", name: "Umzugshelfer", description: "Zusätzliche Helfer buchen", icon: Users, priceHint: "ab CHF 35/h" },
];

interface RelatedServicesProps {
  currentService?: string;
  maxItems?: number;
  variant?: 'cards' | 'list' | 'compact';
  title?: string;
  className?: string;
}

export const RelatedServices = memo(function RelatedServices({
  currentService,
  maxItems = 4,
  variant = 'cards',
  title = "Weitere Dienstleistungen",
  className
}: RelatedServicesProps) {
  // Filter out current service and limit items
  const services = ALL_SERVICES
    .filter(s => s.slug !== currentService)
    .slice(0, maxItems);

  if (variant === 'compact') {
    return (
      <div className={cn("space-y-3", className)}>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {title}
        </h3>
        <div className="flex flex-wrap gap-2">
          {services.map((service) => (
            <Link
              key={service.slug}
              to={`/${service.slug}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-full text-sm font-medium text-foreground transition-colors"
            >
              <service.icon className="w-3.5 h-3.5 text-secondary" />
              {service.name}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={cn("space-y-4", className)}>
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        <ul className="space-y-2">
          {services.map((service) => (
            <li key={service.slug}>
              <Link
                to={`/${service.slug}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <service.icon className="w-5 h-5 text-secondary" />
                  <div>
                    <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {service.name}
                    </span>
                    {service.priceHint && (
                      <span className="ml-2 text-sm text-muted-foreground">
                        {service.priceHint}
                      </span>
                    )}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Default: cards variant
  return (
    <section className={cn("py-12", className)}>
      <div className="container">
        <h2 className="text-2xl font-bold text-foreground mb-6">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service) => (
            <Link
              key={service.slug}
              to={`/${service.slug}`}
              className="group p-5 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 rounded-lg bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
                  <service.icon className="w-5 h-5 text-secondary" />
                </div>
              </div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                {service.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {service.description}
              </p>
              {service.priceHint && (
                <span className="text-xs font-medium text-primary">
                  {service.priceHint}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
});

export default RelatedServices;
