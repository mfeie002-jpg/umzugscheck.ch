import { ArrowRight, TrendingDown, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";

// Simple SVG floor plan illustrations for each apartment size
const FloorPlanStudio = () => (
  <svg viewBox="0 0 80 60" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="5" y="5" width="70" height="50" rx="2" className="fill-primary/5" />
    <rect x="10" y="10" width="25" height="20" rx="1" strokeDasharray="2 2" /> {/* Wohnbereich */}
    <rect x="40" y="10" width="15" height="15" rx="1" /> {/* Bad */}
    <rect x="10" y="35" width="20" height="15" rx="1" strokeDasharray="2 2" /> {/* Küche */}
    <text x="22" y="22" fontSize="5" fill="currentColor" className="opacity-50">1</text>
  </svg>
);

const FloorPlan1_5 = () => (
  <svg viewBox="0 0 80 60" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="5" y="5" width="70" height="50" rx="2" className="fill-primary/5" />
    <rect x="10" y="10" width="28" height="22" rx="1" strokeDasharray="2 2" /> {/* Wohnzimmer */}
    <rect x="42" y="10" width="18" height="18" rx="1" /> {/* Schlafnische */}
    <rect x="42" y="32" width="18" height="18" rx="1" /> {/* Bad */}
    <rect x="10" y="36" width="28" height="14" rx="1" strokeDasharray="2 2" /> {/* Küche */}
    <text x="24" y="24" fontSize="5" fill="currentColor" className="opacity-50">1.5</text>
  </svg>
);

const FloorPlan2_5 = () => (
  <svg viewBox="0 0 100 70" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="5" y="5" width="90" height="60" rx="2" className="fill-primary/5" />
    <rect x="10" y="10" width="35" height="25" rx="1" strokeDasharray="2 2" /> {/* Wohnzimmer */}
    <rect x="50" y="10" width="22" height="22" rx="1" /> {/* Schlafzimmer */}
    <rect x="76" y="10" width="14" height="22" rx="1" /> {/* Bad */}
    <rect x="10" y="40" width="25" height="20" rx="1" strokeDasharray="2 2" /> {/* Küche */}
    <rect x="40" y="40" width="20" height="20" rx="1" /> {/* Flur */}
    <text x="30" y="24" fontSize="6" fill="currentColor" className="opacity-50">2.5</text>
  </svg>
);

const FloorPlan3_5 = () => (
  <svg viewBox="0 0 110 80" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="5" y="5" width="100" height="70" rx="2" className="fill-primary/5" />
    <rect x="10" y="10" width="38" height="28" rx="1" strokeDasharray="2 2" /> {/* Wohnzimmer */}
    <rect x="52" y="10" width="24" height="24" rx="1" /> {/* Schlafzimmer 1 */}
    <rect x="80" y="10" width="20" height="24" rx="1" /> {/* Schlafzimmer 2 */}
    <rect x="80" y="38" width="20" height="16" rx="1" /> {/* Bad */}
    <rect x="10" y="42" width="28" height="28" rx="1" strokeDasharray="2 2" /> {/* Küche */}
    <rect x="42" y="42" width="34" height="28" rx="1" /> {/* Essbereich */}
    <text x="28" y="26" fontSize="6" fill="currentColor" className="opacity-50">3.5</text>
  </svg>
);

const FloorPlan4_5 = () => (
  <svg viewBox="0 0 120 90" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="5" y="5" width="110" height="80" rx="2" className="fill-primary/5" />
    <rect x="10" y="10" width="42" height="32" rx="1" strokeDasharray="2 2" /> {/* Wohnzimmer */}
    <rect x="56" y="10" width="26" height="26" rx="1" /> {/* Schlafzimmer 1 */}
    <rect x="86" y="10" width="24" height="26" rx="1" /> {/* Schlafzimmer 2 */}
    <rect x="56" y="40" width="26" height="22" rx="1" /> {/* Schlafzimmer 3 */}
    <rect x="86" y="40" width="24" height="22" rx="1" /> {/* Bad 1 */}
    <rect x="10" y="46" width="28" height="34" rx="1" strokeDasharray="2 2" /> {/* Küche */}
    <rect x="42" y="66" width="34" height="14" rx="1" /> {/* Bad 2 */}
    <text x="28" y="28" fontSize="7" fill="currentColor" className="opacity-50">4.5</text>
  </svg>
);

const FloorPlan5_5 = () => (
  <svg viewBox="0 0 130 100" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="5" y="5" width="120" height="90" rx="2" className="fill-primary/5" />
    <rect x="10" y="10" width="48" height="36" rx="1" strokeDasharray="2 2" /> {/* Wohnzimmer */}
    <rect x="62" y="10" width="28" height="28" rx="1" /> {/* Schlafzimmer 1 */}
    <rect x="94" y="10" width="26" height="28" rx="1" /> {/* Schlafzimmer 2 */}
    <rect x="62" y="42" width="28" height="24" rx="1" /> {/* Schlafzimmer 3 */}
    <rect x="94" y="42" width="26" height="24" rx="1" /> {/* Schlafzimmer 4 */}
    <rect x="10" y="50" width="30" height="40" rx="1" strokeDasharray="2 2" /> {/* Küche */}
    <rect x="44" y="70" width="28" height="20" rx="1" /> {/* Bad 1 */}
    <rect x="76" y="70" width="22" height="20" rx="1" /> {/* Bad 2 */}
    <rect x="102" y="70" width="18" height="20" rx="1" /> {/* WC */}
    <text x="30" y="32" fontSize="8" fill="currentColor" className="opacity-50">5.5</text>
  </svg>
);

const FloorPlanOffice = () => (
  <svg viewBox="0 0 140 100" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="5" y="5" width="130" height="90" rx="2" className="fill-primary/5" />
    {/* Grossraumbüro */}
    <rect x="10" y="10" width="80" height="50" rx="1" strokeDasharray="2 2" />
    {/* Schreibtische */}
    <rect x="15" y="15" width="12" height="8" rx="0.5" />
    <rect x="32" y="15" width="12" height="8" rx="0.5" />
    <rect x="49" y="15" width="12" height="8" rx="0.5" />
    <rect x="66" y="15" width="12" height="8" rx="0.5" />
    <rect x="15" y="32" width="12" height="8" rx="0.5" />
    <rect x="32" y="32" width="12" height="8" rx="0.5" />
    <rect x="49" y="32" width="12" height="8" rx="0.5" />
    <rect x="66" y="32" width="12" height="8" rx="0.5" />
    {/* Besprechungsraum */}
    <rect x="94" y="10" width="36" height="30" rx="1" />
    <rect x="100" y="18" width="24" height="14" rx="0.5" strokeDasharray="1 1" />
    {/* Küche/Pause */}
    <rect x="94" y="44" width="36" height="22" rx="1" />
    {/* WC */}
    <rect x="94" y="70" width="18" height="20" rx="1" />
    <rect x="116" y="70" width="14" height="20" rx="1" />
    {/* Server/Lager */}
    <rect x="10" y="64" width="40" height="26" rx="1" />
    <text x="45" y="38" fontSize="8" fill="currentColor" className="opacity-50">KMU</text>
  </svg>
);

const costExamples = [
  {
    FloorPlan: FloorPlanStudio,
    title: "Studio",
    price: "ab CHF 450",
    details: ["1-2 Umzugshelfer", "Kleintransporter", "2-3 Stunden"]
  },
  {
    FloorPlan: FloorPlan1_5,
    title: "1.5-Zimmer",
    price: "ab CHF 680",
    details: ["2 Umzugshelfer", "Kleintransporter", "3-4 Stunden"]
  },
  {
    FloorPlan: FloorPlan2_5,
    title: "2.5-Zimmer",
    price: "ab CHF 980",
    details: ["2-3 Umzugshelfer", "Umzugswagen", "4-5 Stunden"]
  },
  {
    FloorPlan: FloorPlan3_5,
    title: "3.5-Zimmer",
    price: "ab CHF 1'350",
    details: ["3 Umzugshelfer", "Umzugswagen", "5-7 Stunden"]
  },
  {
    FloorPlan: FloorPlan4_5,
    title: "4.5-Zimmer",
    price: "ab CHF 1'650",
    details: ["3-4 Umzugshelfer", "LKW 3.5t", "6-8 Stunden"]
  },
  {
    FloorPlan: FloorPlan5_5,
    title: "5.5-Zimmer",
    price: "ab CHF 2'200",
    details: ["4-5 Umzugshelfer", "LKW 7.5t", "8-10 Stunden"]
  },
  {
    FloorPlan: FloorPlanOffice,
    title: "KMU-Büroumzug",
    price: "ab CHF 2'800",
    details: ["4-6 Umzugshelfer", "LKW + Möbellift", "1-2 Tage"]
  }
];

export const PremiumCostExamples = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 rounded-full text-success font-semibold text-sm uppercase tracking-wider mb-4"
          >
            <TrendingDown className="h-4 w-4" />
            Preistransparenz
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Was kostet ein Umzug in der Schweiz?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transparente Preisübersicht für alle Wohnungsgrössen
          </p>
        </motion.div>
        
        {/* Carousel */}
        <div className="max-w-6xl mx-auto mb-12 px-12 md:px-16">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-3 md:-ml-4">
              {costExamples.map((example, index) => (
                <CarouselItem key={index} className="pl-3 md:pl-4 basis-[80%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="h-full"
                  >
                    <Card className="h-full text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border bg-card overflow-hidden group">
                      <CardContent className="p-0 h-full flex flex-col">
                        {/* Floor Plan Illustration */}
                        <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-4 flex items-center justify-center h-32 md:h-36">
                          <div className="w-full h-full text-primary/70 group-hover:text-primary transition-colors duration-300 group-hover:scale-105 transition-transform">
                            <example.FloorPlan />
                          </div>
                        </div>
                        <div className="p-4 md:p-5 flex-1 flex flex-col">
                          <h3 className="text-base md:text-lg font-bold mb-2 text-foreground">
                            {example.title}
                          </h3>
                          <p className="text-xl md:text-2xl font-bold text-primary mb-4">
                            {example.price}
                          </p>
                          <ul className="space-y-1.5 text-left mt-auto">
                            {example.details.map((detail, i) => (
                              <li key={i} className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0" />
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* Always visible arrows */}
            <CarouselPrevious className="-left-4 md:-left-6 h-10 w-10 md:h-12 md:w-12 border-2 border-primary/20 bg-card hover:bg-primary hover:text-primary-foreground shadow-md" />
            <CarouselNext className="-right-4 md:-right-6 h-10 w-10 md:h-12 md:w-12 border-2 border-primary/20 bg-card hover:bg-primary hover:text-primary-foreground shadow-md" />
          </Carousel>
        </div>
        
        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mb-12"
        >
          <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto italic">
            Richtwerte für lokale Umzüge. Exakte Preise mit Ihrer persönlichen Offerte.
          </p>
        </motion.div>
        
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <Link to="/umzugsrechner">
            <Button size="lg" className="h-12 sm:h-14 px-5 sm:px-10 text-sm sm:text-lg font-semibold shadow-copper hover:shadow-lift transition-all group">
              <Calculator className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Meine Umzugskosten berechnen</span>
              <span className="sm:hidden">Kosten berechnen</span>
              <ArrowRight className="ml-1.5 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            Kostenlos & unverbindlich in 2 Minuten
          </p>
        </motion.div>
      </div>
    </section>
  );
};
