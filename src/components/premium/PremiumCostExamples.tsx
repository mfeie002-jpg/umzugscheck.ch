import { ArrowRight, TrendingDown, Calculator, ChevronLeft, ChevronRight } from "lucide-react";
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

// SVG Apartment Floor Plans for each size
const FloorPlanStudio = () => (
  <svg viewBox="0 0 100 80" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="5" y="5" width="90" height="70" rx="2" className="fill-primary/5" />
    <rect x="10" y="10" width="35" height="30" rx="1" strokeDasharray="3 2" /> {/* Living/Bedroom */}
    <rect x="50" y="10" width="40" height="20" rx="1" strokeDasharray="3 2" /> {/* Kitchen */}
    <rect x="50" y="35" width="20" height="15" rx="1" strokeDasharray="3 2" /> {/* Bath */}
    <circle cx="27" cy="25" r="3" className="fill-primary/20" /> {/* Bed indicator */}
    <rect x="55" y="15" width="8" height="5" rx="0.5" className="fill-primary/20" /> {/* Kitchen counter */}
  </svg>
);

const FloorPlan1_5 = () => (
  <svg viewBox="0 0 100 80" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="5" y="5" width="90" height="70" rx="2" className="fill-primary/5" />
    <rect x="10" y="10" width="40" height="35" rx="1" strokeDasharray="3 2" /> {/* Living */}
    <rect x="55" y="10" width="35" height="25" rx="1" strokeDasharray="3 2" /> {/* Kitchen */}
    <rect x="55" y="40" width="20" height="15" rx="1" strokeDasharray="3 2" /> {/* Bath */}
    <rect x="10" y="50" width="25" height="20" rx="1" strokeDasharray="3 2" /> {/* Small room */}
    <circle cx="22" cy="60" r="3" className="fill-primary/20" />
    <rect x="60" y="15" width="10" height="6" rx="0.5" className="fill-primary/20" />
  </svg>
);

const FloorPlan2_5 = () => (
  <svg viewBox="0 0 100 80" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="5" y="5" width="90" height="70" rx="2" className="fill-primary/5" />
    <rect x="10" y="10" width="35" height="30" rx="1" strokeDasharray="3 2" /> {/* Living */}
    <rect x="50" y="10" width="40" height="25" rx="1" strokeDasharray="3 2" /> {/* Kitchen/Dining */}
    <rect x="10" y="45" width="25" height="25" rx="1" strokeDasharray="3 2" /> {/* Bedroom 1 */}
    <rect x="40" y="45" width="25" height="25" rx="1" strokeDasharray="3 2" /> {/* Bedroom 2 */}
    <rect x="70" y="40" width="20" height="15" rx="1" strokeDasharray="3 2" /> {/* Bath */}
    <circle cx="22" cy="57" r="3" className="fill-primary/20" />
    <circle cx="52" cy="57" r="3" className="fill-primary/20" />
  </svg>
);

const FloorPlan3_5 = () => (
  <svg viewBox="0 0 100 80" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="5" y="5" width="90" height="70" rx="2" className="fill-primary/5" />
    <rect x="10" y="10" width="40" height="28" rx="1" strokeDasharray="3 2" /> {/* Living */}
    <rect x="55" y="10" width="35" height="20" rx="1" strokeDasharray="3 2" /> {/* Kitchen */}
    <rect x="10" y="43" width="22" height="27" rx="1" strokeDasharray="3 2" /> {/* Bedroom 1 */}
    <rect x="37" y="43" width="22" height="27" rx="1" strokeDasharray="3 2" /> {/* Bedroom 2 */}
    <rect x="64" y="43" width="22" height="27" rx="1" strokeDasharray="3 2" /> {/* Bedroom 3 */}
    <rect x="55" y="33" width="15" height="12" rx="1" strokeDasharray="3 2" /> {/* Bath */}
    <circle cx="21" cy="56" r="2.5" className="fill-primary/20" />
    <circle cx="48" cy="56" r="2.5" className="fill-primary/20" />
    <circle cx="75" cy="56" r="2.5" className="fill-primary/20" />
  </svg>
);

const FloorPlan4_5 = () => (
  <svg viewBox="0 0 100 80" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="5" y="5" width="90" height="70" rx="2" className="fill-primary/5" />
    <rect x="10" y="10" width="45" height="25" rx="1" strokeDasharray="3 2" /> {/* Living */}
    <rect x="60" y="10" width="30" height="18" rx="1" strokeDasharray="3 2" /> {/* Kitchen */}
    <rect x="10" y="40" width="20" height="30" rx="1" strokeDasharray="3 2" /> {/* Bedroom 1 */}
    <rect x="35" y="40" width="20" height="30" rx="1" strokeDasharray="3 2" /> {/* Bedroom 2 */}
    <rect x="60" y="40" width="20" height="30" rx="1" strokeDasharray="3 2" /> {/* Bedroom 3 */}
    <rect x="60" y="30" width="15" height="12" rx="1" strokeDasharray="3 2" /> {/* Bath 1 */}
    <rect x="80" y="40" width="10" height="15" rx="1" strokeDasharray="3 2" /> {/* Bath 2 */}
    <circle cx="20" cy="55" r="2" className="fill-primary/20" />
    <circle cx="45" cy="55" r="2" className="fill-primary/20" />
    <circle cx="70" cy="55" r="2" className="fill-primary/20" />
    <rect x="82" y="60" width="6" height="8" rx="0.5" className="fill-primary/20" /> {/* Extra room */}
  </svg>
);

const FloorPlan5_5 = () => (
  <svg viewBox="0 0 100 80" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="5" y="5" width="90" height="70" rx="2" className="fill-primary/5" />
    <rect x="10" y="10" width="50" height="22" rx="1" strokeDasharray="3 2" /> {/* Living */}
    <rect x="65" y="10" width="25" height="15" rx="1" strokeDasharray="3 2" /> {/* Kitchen */}
    <rect x="10" y="37" width="18" height="33" rx="1" strokeDasharray="3 2" /> {/* Bedroom 1 */}
    <rect x="33" y="37" width="18" height="33" rx="1" strokeDasharray="3 2" /> {/* Bedroom 2 */}
    <rect x="56" y="37" width="18" height="33" rx="1" strokeDasharray="3 2" /> {/* Bedroom 3 */}
    <rect x="79" y="37" width="11" height="18" rx="1" strokeDasharray="3 2" /> {/* Bedroom 4 */}
    <rect x="65" y="27" width="12" height="12" rx="1" strokeDasharray="3 2" /> {/* Bath 1 */}
    <rect x="79" y="58" width="11" height="12" rx="1" strokeDasharray="3 2" /> {/* Bath 2 */}
    <circle cx="19" cy="53" r="2" className="fill-primary/20" />
    <circle cx="42" cy="53" r="2" className="fill-primary/20" />
    <circle cx="65" cy="53" r="2" className="fill-primary/20" />
    <circle cx="84" cy="46" r="1.5" className="fill-primary/20" />
  </svg>
);

const FloorPlanOffice = () => (
  <svg viewBox="0 0 100 80" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="5" y="5" width="90" height="70" rx="2" className="fill-primary/5" />
    <rect x="10" y="10" width="55" height="35" rx="1" strokeDasharray="3 2" /> {/* Open Office */}
    <rect x="70" y="10" width="20" height="20" rx="1" strokeDasharray="3 2" /> {/* Meeting room */}
    <rect x="70" y="35" width="20" height="15" rx="1" strokeDasharray="3 2" /> {/* Office */}
    <rect x="10" y="50" width="25" height="20" rx="1" strokeDasharray="3 2" /> {/* Kitchen */}
    <rect x="40" y="50" width="15" height="12" rx="1" strokeDasharray="3 2" /> {/* WC */}
    {/* Desks */}
    <rect x="15" y="18" width="8" height="5" rx="0.5" className="fill-primary/20" />
    <rect x="28" y="18" width="8" height="5" rx="0.5" className="fill-primary/20" />
    <rect x="41" y="18" width="8" height="5" rx="0.5" className="fill-primary/20" />
    <rect x="15" y="32" width="8" height="5" rx="0.5" className="fill-primary/20" />
    <rect x="28" y="32" width="8" height="5" rx="0.5" className="fill-primary/20" />
    <rect x="41" y="32" width="8" height="5" rx="0.5" className="fill-primary/20" />
  </svg>
);

const costExamples = [
  {
    FloorPlan: FloorPlanStudio,
    title: "Studio",
    subtitle: "ca. 25-35 m²",
    price: "ab CHF 450",
    details: ["1-2 Umzugshelfer", "Kleintransporter", "2-3 Stunden"]
  },
  {
    FloorPlan: FloorPlan1_5,
    title: "1.5-Zimmer",
    subtitle: "ca. 35-45 m²",
    price: "ab CHF 680",
    details: ["2 Umzugshelfer", "Kleintransporter", "3-4 Stunden"]
  },
  {
    FloorPlan: FloorPlan2_5,
    title: "2.5-Zimmer",
    subtitle: "ca. 50-65 m²",
    price: "ab CHF 980",
    details: ["2-3 Umzugshelfer", "Umzugswagen", "4-5 Stunden"]
  },
  {
    FloorPlan: FloorPlan3_5,
    title: "3.5-Zimmer",
    subtitle: "ca. 70-85 m²",
    price: "ab CHF 1'350",
    details: ["3 Umzugshelfer", "Umzugswagen", "5-7 Stunden"]
  },
  {
    FloorPlan: FloorPlan4_5,
    title: "4.5-Zimmer",
    subtitle: "ca. 90-110 m²",
    price: "ab CHF 1'650",
    details: ["3-4 Umzugshelfer", "LKW 3.5t", "6-8 Stunden"]
  },
  {
    FloorPlan: FloorPlan5_5,
    title: "5.5-Zimmer",
    subtitle: "ca. 120-150 m²",
    price: "ab CHF 2'200",
    details: ["4-5 Umzugshelfer", "LKW 7.5t", "8-10 Stunden"]
  },
  {
    FloorPlan: FloorPlanOffice,
    title: "KMU-Büroumzug",
    subtitle: "ca. 100-200 m²",
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
        
        {/* Carousel with visible arrows */}
        <div className="max-w-6xl mx-auto mb-12 relative px-12 md:px-16">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {costExamples.map((example, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="h-full"
                  >
                    <Card className="h-full text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border bg-card overflow-hidden group">
                      <CardContent className="p-0 h-full flex flex-col">
                        {/* Floor Plan Visual */}
                        <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 flex items-center justify-center">
                          <div className="w-24 h-20 text-primary group-hover:scale-105 transition-transform duration-300">
                            <example.FloorPlan />
                          </div>
                        </div>
                        <div className="p-4 md:p-5 flex-1 flex flex-col">
                          <h3 className="text-base md:text-lg font-bold mb-0.5 text-foreground">
                            {example.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mb-3">
                            {example.subtitle}
                          </p>
                          <p className="text-2xl md:text-3xl font-bold text-primary mb-4">
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
            
            {/* Always visible arrow buttons */}
            <CarouselPrevious className="absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 border-2 border-primary/20 bg-background hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-md" />
            <CarouselNext className="absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 border-2 border-primary/20 bg-background hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-md" />
          </Carousel>
          
          {/* Swipe hint for mobile */}
          <p className="text-center text-xs text-muted-foreground mt-4 md:hidden flex items-center justify-center gap-1">
            <ChevronLeft className="h-3 w-3" />
            Wischen zum Durchblättern
            <ChevronRight className="h-3 w-3" />
          </p>
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