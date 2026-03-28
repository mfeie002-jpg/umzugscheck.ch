import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Home, Building2, Briefcase } from "lucide-react";

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

export const CostExamplesCompact = () => {
  return (
    <section className="py-12 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="text-2xl md:text-5xl font-bold mb-3 md:mb-4 text-foreground">
            Was kostet ein Umzug in der Schweiz?
          </h2>
          <p className="text-sm md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Transparente Preisübersicht für alle Wohnungsgrössen
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-6 md:mt-12"
        >
          <p className="text-xs md:text-base text-muted-foreground text-center max-w-lg mx-auto italic">
            Richtwerte für lokale Umzüge. Exakte Preise mit Ihrer persönlichen Offerte.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
