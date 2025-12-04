import { useState } from "react";
import { ChevronLeft, ChevronRight, Package, PackageOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

const pricingData = [
  {
    id: 1,
    title: "1–1.5-Zimmer-Wohnung",
    size: "ca. 25–40 m²",
    description: "Ideal für Singles oder Studierende mit wenig Hausrat.",
    popular: false,
    withoutPacking: {
      price: "CHF 450 – 900",
      description: "Transport, Beladung/Entladung, Standardversicherung. Sie packen Kartons und Kleinteile selbst.",
    },
    withPacking: {
      price: "CHF 650 – 1'200",
      description: "Professionelles Einpacken von Kartons und empfindlichen Gegenständen inklusive.",
    },
    savings: "bis zu CHF 300",
  },
  {
    id: 2,
    title: "2–2.5-Zimmer-Wohnung",
    size: "ca. 45–65 m²",
    description: "Ideal für Singles oder Paare mit normalem Hausrat.",
    popular: false,
    withoutPacking: {
      price: "CHF 800 – 1'500",
      description: "Standard-Umzug inkl. Transport und Be-/Entladung.",
    },
    withPacking: {
      price: "CHF 1'100 – 1'900",
      description: "Komfortpaket mit professionellem Verpackungsservice.",
    },
    savings: "bis zu CHF 500",
  },
  {
    id: 3,
    title: "3–3.5-Zimmer-Wohnung",
    size: "ca. 70–85 m²",
    description: "Typischer Haushalt: kleines bis mittleres Familienvolumen mit normalem Mobiliar.",
    popular: true,
    withoutPacking: {
      price: "CHF 1'200 – 2'100",
      description: "Standard-Umzug für kleine Familien.",
    },
    withPacking: {
      price: "CHF 1'500 – 2'600",
      description: "Komfortpaket: weniger Stress und schnellere Abwicklung.",
    },
    savings: "bis zu CHF 700",
  },
  {
    id: 4,
    title: "4–4.5-Zimmer-Wohnung",
    size: "ca. 90–110 m²",
    description: "Für grössere Familien mit umfangreichem Mobiliar.",
    popular: false,
    withoutPacking: {
      price: "CHF 1'600 – 2'800",
      description: "Umfassender Transport mit erfahrenem Team.",
    },
    withPacking: {
      price: "CHF 2'000 – 3'400",
      description: "Rundum-Sorglos-Paket inkl. Verpackung.",
    },
    savings: "bis zu CHF 900",
  },
  {
    id: 5,
    title: "5.5-Zimmer & grösser / Haus",
    size: "ab 120 m²",
    description: "Grosse Haushalte oder Einfamilienhäuser mit viel Stauraum.",
    popular: false,
    withoutPacking: {
      price: "CHF 2'200 – 3'800",
      description: "Grossumzug mit mehreren Fachkräften.",
    },
    withPacking: {
      price: "CHF 2'700 – 4'500",
      description: "Premium-Service für stressfreien Umzug.",
    },
    savings: "bis zu CHF 1'000",
  },
];

const OffertenPricing = () => {
  const [currentIndex, setCurrentIndex] = useState(2); // Start with popular item
  const [packingOption, setPackingOption] = useState<"without" | "with">("without");

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % pricingData.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + pricingData.length) % pricingData.length);
  };

  const currentItem = pricingData[currentIndex];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-muted/50 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-manrope text-3xl md:text-4xl font-bold text-foreground mb-4">
            Was kostet ein Umzug in der Schweiz?
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Hier sehen Sie Richtwerte für typische Wohnungsgrössen. Die effektiven Kosten hängen von Distanz, 
            Volumen und Zusatzleistungen ab – mit mehreren Offerten behalten Sie die Kontrolle.
          </p>
        </motion.div>

        {/* Packing Toggle */}
        <div className="flex justify-center mb-8">
          <Tabs value={packingOption} onValueChange={(v) => setPackingOption(v as "without" | "with")}>
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="without" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Ohne Verpackungsservice
              </TabsTrigger>
              <TabsTrigger value="with" className="flex items-center gap-2">
                <PackageOpen className="w-4 h-4" />
                Mit Verpackungsservice
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentIndex}-${packingOption}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <PricingCard 
                item={currentItem} 
                packingOption={packingOption} 
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="rounded-full"
              aria-label="Vorherige Preiskategorie"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex gap-2">
              {pricingData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    index === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                  aria-label={`Gehe zu Preiskategorie ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="rounded-full"
              aria-label="Nächste Preiskategorie"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-4">
          {pricingData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <PricingCard item={item} packingOption={packingOption} compact />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button asChild size="lg" className="h-14 px-8 text-lg rounded-xl">
            <Link to="/rechner">
              Jetzt kostenlose Offerten vergleichen
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

interface PricingCardProps {
  item: typeof pricingData[0];
  packingOption: "without" | "with";
  compact?: boolean;
}

const PricingCard = ({ item, packingOption, compact = false }: PricingCardProps) => {
  const pricing = packingOption === "without" ? item.withoutPacking : item.withPacking;

  return (
    <Card className={`relative h-full ${item.popular ? "border-primary shadow-lg shadow-primary/10" : "border-border/50"}`}>
      {item.popular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
          Beliebt
        </Badge>
      )}
      <CardContent className={compact ? "p-4" : "p-6"}>
        {/* Floor Plan Illustration */}
        <div className="aspect-[4/3] bg-muted/50 rounded-xl mb-4 flex items-center justify-center border border-border/50">
          <div className="text-center">
            <div className="text-4xl mb-2">🏠</div>
            <span className="text-xs text-muted-foreground">{item.size}</span>
          </div>
        </div>

        <h3 className={`font-manrope font-semibold text-foreground mb-1 ${compact ? "text-sm" : "text-lg"}`}>
          {item.title}
        </h3>
        <p className="text-xs text-muted-foreground mb-4">{item.size}</p>
        
        {!compact && (
          <p className="text-sm text-muted-foreground mb-4">
            {item.description}
          </p>
        )}

        <div className="space-y-3">
          <p className={`font-manrope font-bold text-primary ${compact ? "text-xl" : "text-2xl"}`}>
            {pricing.price}
          </p>
          {!compact && (
            <p className="text-sm text-muted-foreground">
              {pricing.description}
            </p>
          )}
          
          <div className="pt-3 border-t border-border">
            <p className="text-sm text-emerald-600 font-medium">
              Mögliche Ersparnis: {item.savings}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OffertenPricing;
