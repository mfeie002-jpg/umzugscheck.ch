import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowRight, Shield, CheckCircle, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

const topCompanies = [
  {
    id: "1",
    name: "Züri Umzüge AG",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80&auto=format&fit=crop",
    rating: 4.9,
    reviewCount: 234,
    priceLevel: "Fair",
    badges: ["Geprüft", "Versichert", "Seit 12 Jahren"],
    location: "Zürich"
  },
  {
    id: "2",
    name: "Swiss Move Pro",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80&auto=format&fit=crop",
    rating: 4.8,
    reviewCount: 189,
    priceLevel: "Günstig",
    badges: ["Geprüft", "Versichert", "Seit 8 Jahren"],
    location: "Bern"
  },
  {
    id: "3",
    name: "Basel Express Umzug",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&q=80&auto=format&fit=crop",
    rating: 4.9,
    reviewCount: 156,
    priceLevel: "Premium",
    badges: ["Geprüft", "Versichert", "Seit 15 Jahren"],
    location: "Basel"
  },
];

const filterOptions = [
  { label: "Beste Qualität", value: "quality" },
  { label: "Günstigste", value: "price" },
  { label: "Premium", value: "premium" }
];

export const TopCompaniesCards = () => {
  const [activeFilter, setActiveFilter] = useState("quality");

  return (
    <section className="py-12 md:py-28 bg-gradient-elegant">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-2xl md:text-5xl font-bold mb-3 md:mb-4 text-foreground heading-premium">
            Top bewertete Umzugsfirmen
          </h2>
          <p className="text-sm md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 md:mb-8 body-premium">
            Geprüfte und versicherte Schweizer Partner
          </p>

          {/* Filter Chips */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-12">
            {filterOptions.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
              className={`px-4 md:px-6 py-2 md:py-3 rounded-full font-bold text-xs md:text-sm transition-all duration-300 ${
                activeFilter === filter.value
                  ? "bg-primary text-primary-foreground shadow-medium scale-105"
                  : "bg-card text-foreground hover:bg-muted shadow-soft hover:shadow-medium"
              }`}
            >
                {filter.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-6xl mx-auto">
          {topCompanies.map((company, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="elevated" className="overflow-hidden hover:shadow-strong hover:-translate-y-2 transition-all duration-300 group border-0 bg-white">
                <div className="relative h-40 md:h-56 overflow-hidden">
                  <img
                    src={company.image}
                    alt={company.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-3 md:top-4 right-3 md:right-4">
                    <Badge className="bg-white/95 text-slate-900 backdrop-blur-sm font-bold shadow-medium px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm">
                      {company.priceLevel}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <CardContent className="p-4 md:p-6">
                  <h3 className="text-base md:text-xl font-bold mb-2 md:mb-3 text-foreground group-hover:text-primary transition-colors">{company.name}</h3>
                  
                  <div className="flex items-center gap-2 mb-3 md:mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 md:h-5 md:w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-base md:text-lg text-foreground">{company.rating}</span>
                    </div>
                    <span className="text-xs md:text-sm text-muted-foreground">
                      ({company.reviewCount} Bewertungen)
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4 md:mb-5">
                    {company.badges.slice(0, 2).map((badge, i) => (
                      <Badge key={i} variant="outline" className="text-[10px] md:text-xs font-semibold border-border bg-muted px-1.5 md:px-2 py-0.5">
                        {badge === "Geprüft" && <CheckCircle className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1 text-green-600" />}
                        {badge === "Versichert" && <Shield className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1 text-primary" />}
                        {badge.includes("Seit") && <Calendar className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1 text-muted-foreground" />}
                        {badge}
                      </Badge>
                    ))}
                  </div>

                  <Button className="w-full h-10 md:h-12 font-bold text-sm md:text-base bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-cta hover:shadow-lift transition-all">
                    Offerte anfragen
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8 md:mt-12"
        >
          <Link to="/umzugsfirmen-schweiz">
            <Button variant="outline" size="lg" className="px-6 md:px-10 h-12 md:h-14 text-sm md:text-lg font-bold border-2 border-border hover:border-primary hover:bg-accent hover:text-primary shadow-soft hover:shadow-medium">
              Alle Umzugsfirmen anzeigen
              <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
