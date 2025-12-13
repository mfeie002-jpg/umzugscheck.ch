import { Star, MapPin, Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useRef } from "react";
import { useSwipeable } from "react-swipeable";

const companies = [
  {
    name: "Züri Umzüge AG",
    rating: 4.9,
    reviews: 324,
    location: "Zürich",
    price: "Ab CHF 450",
    badges: ["Top bewertet", "Express"],
    image: "https://images.unsplash.com/photo-1556745753-b2904692b3cd?w=400&q=80&auto=format&fit=crop"
  },
  {
    name: "Berner Umzugsprofi",
    rating: 4.8,
    reviews: 256,
    location: "Bern",
    price: "Ab CHF 420",
    badges: ["Günstig", "Versichert"],
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80&auto=format&fit=crop"
  },
  {
    name: "Basel Move Services",
    rating: 4.7,
    reviews: 198,
    location: "Basel",
    price: "Ab CHF 480",
    badges: ["Beliebt", "24/7"],
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80&auto=format&fit=crop"
  }
];

const filters = [
  { label: "Alle", value: "all" },
  { label: "Top bewertet", value: "top" },
  { label: "Günstigste", value: "cheap" },
  { label: "Express", value: "express" }
];

export const FeaturedCompanies = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft += 300;
      }
    },
    onSwipedRight: () => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft -= 300;
      }
    },
  });

  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Top Umzugsfirmen
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Geprüfte und versicherte Partner für Ihren stressfreien Umzug
          </p>
        </motion.div>

        {/* Filter Bar */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                activeFilter === filter.value
                  ? 'bg-primary text-white shadow-medium'
                  : 'bg-card text-foreground border border-border hover:border-primary'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 max-w-7xl mx-auto mb-8">
          {companies.map((company, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-strong transition-all border border-border/50"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={company.image} 
                  alt={company.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  {company.badges.map((badge, i) => (
                    <Badge key={i} className="bg-primary/90 text-white backdrop-blur-sm">
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{company.name}</h3>
                
                <div className="flex items-center gap-4 mb-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-semibold">{company.rating}</span>
                    <span className="text-muted-foreground">({company.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{company.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-primary font-bold text-lg">{company.price}</div>
                  <Shield className="h-5 w-5 text-success" />
                </div>

                <Link to="/umzugsofferten">
                  <Button className="w-full" size="lg">
                    Offerte anfragen
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile: Slider */}
        <div 
          {...handlers}
          ref={scrollRef}
          className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-hide mb-8"
          style={{ scrollBehavior: 'smooth' }}
        >
          {companies.map((company, index) => (
            <div key={index} className="flex-shrink-0 w-[300px] snap-start">
              <div className="bg-card rounded-2xl overflow-hidden shadow-soft border border-border/50 h-full">
                <div className="relative h-48">
                  <img 
                    src={company.image} 
                    alt={company.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 flex gap-2 flex-wrap">
                    {company.badges.map((badge, i) => (
                      <Badge key={i} className="bg-primary/90 text-white backdrop-blur-sm text-xs">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{company.name}</h3>
                  
                  <div className="flex items-center gap-3 mb-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="font-semibold">{company.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{company.location}</span>
                    </div>
                  </div>

                  <div className="text-primary font-bold text-lg mb-4">{company.price}</div>

                  <Link to="/umzugsofferten">
                    <Button className="w-full">
                      Offerte anfragen
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center">
          <Link to="/umzugsfirmen">
            <Button variant="outline" size="lg" className="px-8">
              Alle Firmen anzeigen
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
