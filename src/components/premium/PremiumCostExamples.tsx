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
import { useState } from "react";

// Import AI-generated apartment images
import studioApartment from "@/assets/apartments/studio-apartment.jpg";
import apartment1_5 from "@/assets/apartments/1-5-room-apartment.jpg";
import apartment2_5 from "@/assets/apartments/2-5-room-apartment.jpg";
import apartment3_5 from "@/assets/apartments/3-5-room-apartment.jpg";
import apartment4_5 from "@/assets/apartments/4-5-room-apartment.jpg";
import apartment5_5 from "@/assets/apartments/5-5-room-apartment.jpg";
import officeSpace from "@/assets/apartments/office-space.jpg";

// Interactive Floor Plan with Hover Effects
interface FurnitureItem {
  id: string;
  name: string;
  path: string;
  fill: string;
  hoverFill: string;
}

const InteractiveFloorPlan = ({ items, viewBox = "0 0 120 100" }: { items: FurnitureItem[], viewBox?: string }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <svg viewBox={viewBox} className="w-full h-full drop-shadow-sm">
      <defs>
        <linearGradient id="floorGradInteractive" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary) / 0.08)" />
          <stop offset="100%" stopColor="hsl(var(--primary) / 0.15)" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Floor */}
      <rect x="8" y="15" width="104" height="78" rx="4" fill="url(#floorGradInteractive)" />
      
      {/* Walls */}
      <path d="M8 15 L8 93 L112 93 L112 15" fill="none" stroke="hsl(var(--primary) / 0.25)" strokeWidth="2.5" />
      <path d="M8 15 L18 5 L102 5 L112 15" fill="hsl(var(--primary) / 0.05)" stroke="hsl(var(--primary) / 0.2)" strokeWidth="1.5" />
      
      {/* Window */}
      <rect x="40" y="7" width="35" height="6" rx="1" fill="hsl(220 90% 88%)" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1" />
      
      {/* Interactive furniture items */}
      {items.map((item) => (
        <motion.path
          key={item.id}
          d={item.path}
          fill={hoveredItem === item.id ? item.hoverFill : item.fill}
          onMouseEnter={() => setHoveredItem(item.id)}
          onMouseLeave={() => setHoveredItem(null)}
          style={{ cursor: 'pointer' }}
          filter={hoveredItem === item.id ? "url(#glow)" : undefined}
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        />
      ))}
      
      {/* Tooltip */}
      {hoveredItem && (
        <g>
          <rect x="35" y="85" width="50" height="12" rx="3" fill="hsl(var(--primary))" />
          <text x="60" y="93" textAnchor="middle" fill="white" fontSize="6" fontWeight="500">
            {items.find(i => i.id === hoveredItem)?.name}
          </text>
        </g>
      )}
    </svg>
  );
};

// Floor plan furniture configurations
const studioFurniture: FurnitureItem[] = [
  { id: "bed", name: "Bett", path: "M15 35 L48 35 L48 70 L15 70 Z", fill: "hsl(var(--primary) / 0.4)", hoverFill: "hsl(var(--primary) / 0.7)" },
  { id: "desk", name: "Schreibtisch", path: "M55 55 L75 55 L75 68 L55 68 Z", fill: "hsl(var(--primary) / 0.3)", hoverFill: "hsl(var(--primary) / 0.6)" },
  { id: "kitchen", name: "Küche", path: "M80 25 L105 25 L105 42 L80 42 Z", fill: "hsl(var(--primary) / 0.35)", hoverFill: "hsl(var(--primary) / 0.65)" },
  { id: "bath", name: "Bad", path: "M80 50 L105 50 L105 80 L80 80 Z", fill: "hsl(var(--primary) / 0.25)", hoverFill: "hsl(var(--primary) / 0.55)" },
];

const apartment1_5Furniture: FurnitureItem[] = [
  { id: "sofa", name: "Sofa", path: "M15 25 L45 25 L45 42 L15 42 Z", fill: "hsl(var(--primary) / 0.4)", hoverFill: "hsl(var(--primary) / 0.7)" },
  { id: "bed", name: "Schlafzimmer", path: "M15 55 L45 55 L45 85 L15 85 Z", fill: "hsl(var(--primary) / 0.35)", hoverFill: "hsl(var(--primary) / 0.65)" },
  { id: "kitchen", name: "Küche", path: "M55 25 L105 25 L105 50 L55 50 Z", fill: "hsl(var(--primary) / 0.3)", hoverFill: "hsl(var(--primary) / 0.6)" },
  { id: "bath", name: "Bad", path: "M55 55 L80 55 L80 85 L55 85 Z", fill: "hsl(var(--primary) / 0.25)", hoverFill: "hsl(var(--primary) / 0.55)" },
];

const apartment2_5Furniture: FurnitureItem[] = [
  { id: "living", name: "Wohnzimmer", path: "M12 22 L55 22 L55 50 L12 50 Z", fill: "hsl(var(--primary) / 0.35)", hoverFill: "hsl(var(--primary) / 0.65)" },
  { id: "kitchen", name: "Küche", path: "M60 22 L108 22 L108 48 L60 48 Z", fill: "hsl(var(--primary) / 0.3)", hoverFill: "hsl(var(--primary) / 0.6)" },
  { id: "bedroom1", name: "Schlafzimmer 1", path: "M12 55 L45 55 L45 88 L12 88 Z", fill: "hsl(var(--primary) / 0.4)", hoverFill: "hsl(var(--primary) / 0.7)" },
  { id: "bedroom2", name: "Schlafzimmer 2", path: "M50 55 L80 55 L80 88 L50 88 Z", fill: "hsl(var(--primary) / 0.38)", hoverFill: "hsl(var(--primary) / 0.68)" },
  { id: "bath", name: "Bad", path: "M85 55 L108 55 L108 88 L85 88 Z", fill: "hsl(var(--primary) / 0.25)", hoverFill: "hsl(var(--primary) / 0.55)" },
];

const apartment3_5Furniture: FurnitureItem[] = [
  { id: "living", name: "Wohnzimmer", path: "M12 20 L60 20 L60 48 L12 48 Z", fill: "hsl(var(--primary) / 0.35)", hoverFill: "hsl(var(--primary) / 0.65)" },
  { id: "kitchen", name: "Küche", path: "M65 20 L108 20 L108 42 L65 42 Z", fill: "hsl(var(--primary) / 0.3)", hoverFill: "hsl(var(--primary) / 0.6)" },
  { id: "bedroom1", name: "Elternzimmer", path: "M12 53 L40 53 L40 88 L12 88 Z", fill: "hsl(var(--primary) / 0.4)", hoverFill: "hsl(var(--primary) / 0.7)" },
  { id: "bedroom2", name: "Kinderzimmer", path: "M45 53 L70 53 L70 88 L45 88 Z", fill: "hsl(var(--primary) / 0.38)", hoverFill: "hsl(var(--primary) / 0.68)" },
  { id: "bedroom3", name: "Büro", path: "M75 53 L95 53 L95 75 L75 75 Z", fill: "hsl(var(--primary) / 0.32)", hoverFill: "hsl(var(--primary) / 0.62)" },
  { id: "bath", name: "Bad", path: "M75 78 L108 78 L108 88 L75 88 Z", fill: "hsl(var(--primary) / 0.25)", hoverFill: "hsl(var(--primary) / 0.55)" },
];

const apartment4_5Furniture: FurnitureItem[] = [
  { id: "living", name: "Wohnbereich", path: "M10 18 L65 18 L65 45 L10 45 Z", fill: "hsl(var(--primary) / 0.33)", hoverFill: "hsl(var(--primary) / 0.63)" },
  { id: "kitchen", name: "Küche", path: "M70 18 L110 18 L110 38 L70 38 Z", fill: "hsl(var(--primary) / 0.3)", hoverFill: "hsl(var(--primary) / 0.6)" },
  { id: "master", name: "Master-Suite", path: "M10 50 L38 50 L38 88 L10 88 Z", fill: "hsl(var(--primary) / 0.4)", hoverFill: "hsl(var(--primary) / 0.7)" },
  { id: "bedroom2", name: "Schlafzimmer 2", path: "M42 50 L68 50 L68 88 L42 88 Z", fill: "hsl(var(--primary) / 0.38)", hoverFill: "hsl(var(--primary) / 0.68)" },
  { id: "bedroom3", name: "Schlafzimmer 3", path: "M72 50 L95 50 L95 75 L72 75 Z", fill: "hsl(var(--primary) / 0.35)", hoverFill: "hsl(var(--primary) / 0.65)" },
  { id: "office", name: "Büro", path: "M98 50 L110 50 L110 88 L98 88 Z", fill: "hsl(var(--primary) / 0.28)", hoverFill: "hsl(var(--primary) / 0.58)" },
  { id: "bath", name: "Bäder", path: "M72 78 L95 78 L95 88 L72 88 Z", fill: "hsl(var(--primary) / 0.22)", hoverFill: "hsl(var(--primary) / 0.52)" },
];

const apartment5_5Furniture: FurnitureItem[] = [
  { id: "living", name: "Wohnzimmer", path: "M8 18 L62 18 L62 42 L8 42 Z", fill: "hsl(var(--primary) / 0.32)", hoverFill: "hsl(var(--primary) / 0.62)" },
  { id: "kitchen", name: "Küche", path: "M66 18 L112 18 L112 35 L66 35 Z", fill: "hsl(var(--primary) / 0.28)", hoverFill: "hsl(var(--primary) / 0.58)" },
  { id: "master", name: "Master-Suite", path: "M8 46 L35 46 L35 88 L8 88 Z", fill: "hsl(var(--primary) / 0.4)", hoverFill: "hsl(var(--primary) / 0.7)" },
  { id: "bedroom2", name: "Zimmer 2", path: "M38 46 L60 46 L60 66 L38 66 Z", fill: "hsl(var(--primary) / 0.36)", hoverFill: "hsl(var(--primary) / 0.66)" },
  { id: "bedroom3", name: "Zimmer 3", path: "M38 69 L60 69 L60 88 L38 88 Z", fill: "hsl(var(--primary) / 0.34)", hoverFill: "hsl(var(--primary) / 0.64)" },
  { id: "bedroom4", name: "Zimmer 4", path: "M64 46 L88 46 L88 70 L64 70 Z", fill: "hsl(var(--primary) / 0.32)", hoverFill: "hsl(var(--primary) / 0.62)" },
  { id: "office", name: "Büro", path: "M92 46 L112 46 L112 88 L92 88 Z", fill: "hsl(var(--primary) / 0.28)", hoverFill: "hsl(var(--primary) / 0.58)" },
  { id: "bath", name: "Bäder", path: "M66 38 L112 38 L112 44 L66 44 Z", fill: "hsl(var(--primary) / 0.22)", hoverFill: "hsl(var(--primary) / 0.52)" },
];

const officeFurniture: FurnitureItem[] = [
  { id: "openoffice", name: "Grossraumbüro", path: "M10 20 L75 20 L75 60 L10 60 Z", fill: "hsl(var(--primary) / 0.3)", hoverFill: "hsl(var(--primary) / 0.6)" },
  { id: "meeting", name: "Sitzungszimmer", path: "M80 20 L110 20 L110 42 L80 42 Z", fill: "hsl(var(--primary) / 0.35)", hoverFill: "hsl(var(--primary) / 0.65)" },
  { id: "manager", name: "Chefbüro", path: "M80 46 L110 46 L110 65 L80 65 Z", fill: "hsl(var(--primary) / 0.38)", hoverFill: "hsl(var(--primary) / 0.68)" },
  { id: "kitchen", name: "Pausenraum", path: "M10 65 L40 65 L40 88 L10 88 Z", fill: "hsl(var(--primary) / 0.25)", hoverFill: "hsl(var(--primary) / 0.55)" },
  { id: "reception", name: "Empfang", path: "M80 70 L110 70 L110 88 L80 88 Z", fill: "hsl(var(--primary) / 0.28)", hoverFill: "hsl(var(--primary) / 0.58)" },
  { id: "wc", name: "WC", path: "M45 65 L60 65 L60 88 L45 88 Z", fill: "hsl(var(--primary) / 0.2)", hoverFill: "hsl(var(--primary) / 0.5)" },
];

const costExamples = [
  {
    furniture: studioFurniture,
    image: studioApartment,
    title: "Studio",
    subtitle: "ca. 25-35 m²",
    price: "ab CHF 450",
    details: ["1-2 Umzugshelfer", "Kleintransporter", "2-3 Stunden"],
    rooms: "1",
    ctaText: "Studio berechnen"
  },
  {
    furniture: apartment1_5Furniture,
    image: apartment1_5,
    title: "1.5-Zimmer",
    subtitle: "ca. 35-45 m²",
    price: "ab CHF 680",
    details: ["2 Umzugshelfer", "Kleintransporter", "3-4 Stunden"],
    rooms: "1.5",
    ctaText: "1.5-Zi. berechnen"
  },
  {
    furniture: apartment2_5Furniture,
    image: apartment2_5,
    title: "2.5-Zimmer",
    subtitle: "ca. 50-65 m²",
    price: "ab CHF 980",
    details: ["2-3 Umzugshelfer", "Umzugswagen", "4-5 Stunden"],
    rooms: "2.5",
    ctaText: "2.5-Zi. berechnen"
  },
  {
    furniture: apartment3_5Furniture,
    image: apartment3_5,
    title: "3.5-Zimmer",
    subtitle: "ca. 70-85 m²",
    price: "ab CHF 1'350",
    details: ["3 Umzugshelfer", "Umzugswagen", "5-7 Stunden"],
    rooms: "3.5",
    ctaText: "3.5-Zi. berechnen"
  },
  {
    furniture: apartment4_5Furniture,
    image: apartment4_5,
    title: "4.5-Zimmer",
    subtitle: "ca. 90-110 m²",
    price: "ab CHF 1'650",
    details: ["3-4 Umzugshelfer", "LKW 3.5t", "6-8 Stunden"],
    rooms: "4.5",
    ctaText: "4.5-Zi. berechnen"
  },
  {
    furniture: apartment5_5Furniture,
    image: apartment5_5,
    title: "5.5-Zimmer",
    subtitle: "ca. 120-150 m²",
    price: "ab CHF 2'200",
    details: ["4-5 Umzugshelfer", "LKW 7.5t", "8-10 Stunden"],
    rooms: "5.5",
    ctaText: "5.5-Zi. berechnen"
  },
  {
    furniture: officeFurniture,
    image: officeSpace,
    title: "KMU-Büroumzug",
    subtitle: "ca. 100-200 m²",
    price: "ab CHF 2'800",
    details: ["4-6 Umzugshelfer", "LKW + Möbellift", "1-2 Tage"],
    rooms: "office",
    ctaText: "Büroumzug berechnen"
  }
];

export const PremiumCostExamples = () => {
  const [activeView, setActiveView] = useState<'photo' | 'plan'>('photo');

  return (
    <section className="py-10 sm:py-14 md:py-20 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12"
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
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4">
            Was kostet ein Umzug?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Transparente Preisübersicht für alle Wohnungsgrössen
          </p>
          
          {/* View Toggle */}
          <div className="inline-flex items-center gap-1 p-1 bg-muted rounded-lg">
            <button
              onClick={() => setActiveView('photo')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeView === 'photo' 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              📸 Fotos
            </button>
            <button
              onClick={() => setActiveView('plan')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeView === 'plan' 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              📐 Grundrisse
            </button>
          </div>
        </motion.div>
        
        {/* Carousel with visible arrows */}
        <div className="max-w-6xl mx-auto mb-8 sm:mb-12 relative px-8 sm:px-12 md:px-16">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {costExamples.map((example, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-[75%] xs:basis-[80%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="h-full"
                  >
                    <Card className="h-full text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-500 border bg-card overflow-hidden group">
                      <CardContent className="p-0 h-full flex flex-col">
                        {/* Image or Floor Plan Visual */}
                        <div className="relative overflow-hidden min-h-[140px] sm:min-h-[160px]">
                          {activeView === 'photo' ? (
                            <motion.div
                              className="w-full h-[140px] sm:h-[160px] relative"
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.4 }}
                            >
                              <img 
                                src={example.image} 
                                alt={example.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                                <span className="text-white text-xs font-medium bg-black/30 backdrop-blur-sm px-2 py-1 rounded">
                                  {example.subtitle}
                                </span>
                              </div>
                            </motion.div>
                          ) : (
                            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-4 flex items-center justify-center h-[140px] sm:h-[160px]">
                              <div className="w-full max-w-[180px] h-[120px] text-primary">
                                <InteractiveFloorPlan items={example.furniture} />
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="p-4 md:p-5 flex-1 flex flex-col">
                          <h3 className="text-base md:text-lg font-bold mb-0.5 text-foreground">
                            {example.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mb-3">
                            {example.subtitle}
                          </p>
                          <motion.p 
                            className="text-2xl md:text-3xl font-bold text-primary mb-4"
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                          >
                            {example.price}
                          </motion.p>
                          <ul className="space-y-1.5 text-left mb-4">
                            {example.details.map((detail, i) => (
                              <li key={i} className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0" />
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                          
                          {/* Per-card CTA */}
                          <Link 
                            to={`/umzugsrechner?rooms=${example.rooms}`}
                            className="mt-auto"
                          >
                            <Button 
                              size="sm" 
                              className="w-full h-9 text-xs font-semibold group/btn"
                            >
                              {example.ctaText}
                              <ArrowRight className="ml-1.5 h-3 w-3 group-hover/btn:translate-x-0.5 transition-transform" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Always visible arrow buttons */}
            <CarouselPrevious className="absolute -left-1 sm:-left-2 md:-left-4 top-1/2 -translate-y-1/2 h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 border-2 border-primary/20 bg-background hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-md active:scale-95 transition-transform" />
            <CarouselNext className="absolute -right-1 sm:-right-2 md:-right-4 top-1/2 -translate-y-1/2 h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 border-2 border-primary/20 bg-background hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-md active:scale-95 transition-transform" />
          </Carousel>
          
          {/* Swipe hint for mobile */}
          <p className="text-center text-xs text-muted-foreground mt-4 md:hidden flex items-center justify-center gap-1">
            <ChevronLeft className="h-3 w-3" />
            Wischen zum Durchblättern
            <ChevronRight className="h-3 w-3" />
          </p>
          
          {/* Interactive hint for floor plans */}
          {activeView === 'plan' && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-primary/50 animate-pulse" />
              Bewegen Sie die Maus über die Räume, um Details zu sehen
            </motion.p>
          )}
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
