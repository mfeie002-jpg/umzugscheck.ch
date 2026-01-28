import { Link } from "react-router-dom";
import { ArrowRight, Home, Building2, Globe, Heart, Crown, Music, Package, Warehouse, Trash2, Sparkles } from "lucide-react";
import { Card } from "./ui/card";
import AnimatedSection from "./AnimatedSection";
import type { LucideIcon } from "lucide-react";

interface ServiceItem {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  highlight?: boolean;
}

const services: ServiceItem[] = [
  {
    title: "Privatumzüge",
    description: "Kompletter Umzugsservice für Familien und Einzelpersonen",
    href: "/plan/private",
    icon: Home,
    highlight: true,
  },
  {
    title: "Büroumzüge",
    description: "Minimale Ausfallzeit für Ihr Unternehmen",
    href: "/plan/office",
    icon: Building2,
  },
  {
    title: "Internationale Umzüge",
    description: "Weltweit zuverlässig und kompetent",
    href: "/plan/international",
    icon: Globe,
  },
  {
    title: "Seniorenumzüge",
    description: "Einfühlsam und mit extra Fürsorge",
    href: "/plan/senior",
    icon: Heart,
  },
  {
    title: "VIP Service",
    description: "Premium-Service für höchste Ansprüche",
    href: "/plan/vip",
    icon: Crown,
    highlight: true,
  },
  {
    title: "Klaviertransport",
    description: "Spezialisten für Instrumente",
    href: "/plan/piano",
    icon: Music,
  },
  {
    title: "Einpackservice",
    description: "Professionelle Verpackung Ihrer Güter",
    href: "/option/packing",
    icon: Package,
  },
  {
    title: "Lagerung",
    description: "Sichere Zwischenlagerung",
    href: "/option/storage",
    icon: Warehouse,
  },
  {
    title: "Entsorgung",
    description: "Entrümpelung & Recycling",
    href: "/plan/disposal",
    icon: Trash2,
  },
  {
    title: "Reinigung",
    description: "Übergabereinigung",
    href: "/plan/cleaning",
    icon: Sparkles,
  },
];

interface ServicesGridProps {
  showAll?: boolean;
  maxItems?: number;
  title?: string;
  subtitle?: string;
}

export default function ServicesGrid({
  showAll = false,
  maxItems = 6,
  title = "Unsere Leistungen",
  subtitle = "Von der Planung bis zum Einzug – alles aus einer Hand"
}: ServicesGridProps) {
  const displayedServices = showAll ? services : services.slice(0, maxItems);

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-alpine bg-alpine/10 rounded-full mb-4">
            Services
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 font-display">{title}</h2>
          <p className="text-lg text-muted-foreground">{subtitle}</p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedServices.map((service, index) => (
            <AnimatedSection key={index} delay={index * 0.05}>
              <Link to={service.href}>
                <Card className={`p-6 h-full hover-lift group relative overflow-hidden ${service.highlight ? 'border-alpine/30 bg-alpine/5' : ''}`}>
                  {service.highlight && (
                    <span className="absolute top-4 right-4 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-alpine text-alpine-foreground rounded">
                      Beliebt
                    </span>
                  )}
                  <div className="w-12 h-12 rounded-xl bg-alpine/10 flex items-center justify-center mb-4 group-hover:bg-alpine/20 transition-colors">
                    <service.icon className="w-6 h-6 text-alpine" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-alpine transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {service.description}
                  </p>
                  <span className="inline-flex items-center text-sm text-alpine font-medium">
                    Mehr erfahren
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Card>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        {!showAll && (
          <AnimatedSection delay={0.3} className="text-center mt-10">
            <Link to="/plan" className="inline-flex items-center text-alpine font-medium hover:underline">
              Alle Leistungen ansehen
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
}
