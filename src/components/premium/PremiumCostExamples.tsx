import { Home, Building2, Briefcase, ArrowRight, Info, TrendingDown, Calculator } from "lucide-react";
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

const costExamples = [
  {
    icon: Home,
    title: "Studio",
    price: "ab CHF 450",
    details: ["1-2 Umzugshelfer", "Kleintransporter", "2-3 Stunden"]
  },
  {
    icon: Home,
    title: "1.5-Zimmer",
    price: "ab CHF 680",
    details: ["2 Umzugshelfer", "Kleintransporter", "3-4 Stunden"]
  },
  {
    icon: Home,
    title: "2.5-Zimmer",
    price: "ab CHF 980",
    details: ["2-3 Umzugshelfer", "Umzugswagen", "4-5 Stunden"]
  },
  {
    icon: Building2,
    title: "3.5-Zimmer",
    price: "ab CHF 1'350",
    details: ["3 Umzugshelfer", "Umzugswagen", "5-7 Stunden"]
  },
  {
    icon: Building2,
    title: "4.5-Zimmer",
    price: "ab CHF 1'650",
    details: ["3-4 Umzugshelfer", "LKW 3.5t", "6-8 Stunden"]
  },
  {
    icon: Building2,
    title: "5.5-Zimmer",
    price: "ab CHF 2'200",
    details: ["4-5 Umzugshelfer", "LKW 7.5t", "8-10 Stunden"]
  },
  {
    icon: Briefcase,
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
        <div className="max-w-6xl mx-auto mb-12">
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
                        <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <example.icon className="h-7 w-7 text-primary" />
                          </div>
                        </div>
                        <div className="p-4 md:p-6 flex-1 flex flex-col">
                          <h3 className="text-sm md:text-lg font-bold mb-2 text-foreground">
                            {example.title}
                          </h3>
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
            <CarouselPrevious className="hidden md:flex -left-12" />
            <CarouselNext className="hidden md:flex -right-12" />
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
