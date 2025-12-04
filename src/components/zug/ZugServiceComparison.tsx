/**
 * Zug Service Comparison Component
 * #16-25: Interactive service comparison table
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Check, X, HelpCircle, Truck, Sparkles, Package, 
  Building2, Warehouse, Trash2, Wrench
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ServiceFeature {
  name: string;
  description: string;
  basic: boolean | string;
  standard: boolean | string;
  premium: boolean | string;
}

const services: ServiceFeature[] = [
  {
    name: "Möbeltransport",
    description: "Transport aller Möbel inkl. Demontage/Montage",
    basic: true,
    standard: true,
    premium: true,
  },
  {
    name: "Verpackungsmaterial",
    description: "Kartons, Packpapier, Luftpolsterfolie",
    basic: "Gegen Aufpreis",
    standard: true,
    premium: true,
  },
  {
    name: "Ein- und Auspacken",
    description: "Professionelles Verpacken und Auspacken",
    basic: false,
    standard: "Teilweise",
    premium: true,
  },
  {
    name: "Möbelmontage",
    description: "Ab- und Aufbau aller Möbel",
    basic: "Einfach",
    standard: true,
    premium: true,
  },
  {
    name: "Reinigung",
    description: "Endreinigung mit Abgabegarantie",
    basic: false,
    standard: "Optional",
    premium: true,
  },
  {
    name: "Möbellift",
    description: "Externer Lift für schwierige Zugänge",
    basic: false,
    standard: "Gegen Aufpreis",
    premium: true,
  },
  {
    name: "Versicherung",
    description: "Transportversicherung für alle Güter",
    basic: "Basis",
    standard: "Erweitert",
    premium: "Vollkasko",
  },
  {
    name: "Entsorgung",
    description: "Entsorgung von Altmöbeln und Sperrgut",
    basic: false,
    standard: "Optional",
    premium: true,
  },
];

const packages = [
  {
    name: "Basic",
    icon: Package,
    price: "ab CHF 800",
    description: "Für Selbstorganisierte",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    name: "Standard",
    icon: Truck,
    price: "ab CHF 1'400",
    description: "Beliebteste Wahl",
    color: "text-primary",
    bgColor: "bg-primary/10",
    popular: true,
  },
  {
    name: "Premium",
    icon: Sparkles,
    price: "ab CHF 2'200",
    description: "Rundum-Sorglos",
    color: "text-amber-500",
    bgColor: "bg-amber-50",
  },
];

export const ZugServiceComparison = () => {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const renderValue = (value: boolean | string) => {
    if (value === true) {
      return (
        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <Check className="w-4 h-4 text-green-600" />
        </div>
      );
    }
    if (value === false) {
      return (
        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center mx-auto">
          <X className="w-4 h-4 text-muted-foreground" />
        </div>
      );
    }
    return (
      <span className="text-sm text-muted-foreground">{value}</span>
    );
  };

  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <Badge variant="outline" className="mb-4">
            <Wrench className="w-3 h-3 mr-1" />
            Leistungsvergleich
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Welches Paket passt zu dir?
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Vergleiche die Leistungen unserer Umzugspakete im Kanton Zug
          </p>
        </motion.div>

        {/* Package Headers */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-4">
          <div className="col-span-1" />
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`text-center p-3 sm:p-4 rounded-xl ${pkg.bgColor} relative`}
            >
              {pkg.popular && (
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs">
                  Beliebt
                </Badge>
              )}
              <pkg.icon className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 ${pkg.color}`} />
              <h3 className="font-bold text-sm sm:text-base">{pkg.name}</h3>
              <p className="text-xs text-muted-foreground hidden sm:block">{pkg.description}</p>
              <p className={`font-bold text-sm sm:text-lg mt-1 ${pkg.color}`}>{pkg.price}</p>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="bg-background rounded-xl border border-border overflow-hidden">
          {services.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className={`grid grid-cols-4 gap-2 sm:gap-4 p-3 sm:p-4 items-center transition-colors ${
                hoveredRow === index ? "bg-muted/50" : index % 2 === 0 ? "bg-muted/20" : ""
              }`}
              onMouseEnter={() => setHoveredRow(index)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <div className="col-span-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1 text-left">
                      <span className="text-sm font-medium">{service.name}</span>
                      <HelpCircle className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{service.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="text-center">{renderValue(service.basic)}</div>
              <div className="text-center">{renderValue(service.standard)}</div>
              <div className="text-center">{renderValue(service.premium)}</div>
            </motion.div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                variant={pkg.popular ? "default" : "outline"}
                className="w-full"
                size="lg"
              >
                {pkg.name} Offerte
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
