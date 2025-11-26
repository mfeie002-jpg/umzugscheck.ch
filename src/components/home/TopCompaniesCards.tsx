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
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Top Umzugsfirmen
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Geprüfte und versicherte Umzugsunternehmen
          </p>

          {/* Filter Chips */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {filterOptions.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                  activeFilter === filter.value
                    ? "bg-primary text-white shadow-medium"
                    : "bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Companies Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {topCompanies.map((company, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-strong transition-all group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={company.image}
                    alt={company.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-white/95 text-foreground backdrop-blur-sm">
                      {company.priceLevel}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{company.name}</h3>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="font-semibold">{company.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({company.reviewCount} Bewertungen)
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {company.badges.slice(0, 2).map((badge, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {badge === "Geprüft" && <CheckCircle className="h-3 w-3 mr-1" />}
                        {badge === "Versichert" && <Shield className="h-3 w-3 mr-1" />}
                        {badge.includes("Seit") && <Calendar className="h-3 w-3 mr-1" />}
                        {badge}
                      </Badge>
                    ))}
                  </div>

                  <Button className="w-full" size="lg">
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
          className="text-center mt-8"
        >
          <Link to="/firmen">
            <Button variant="outline" size="lg" className="px-8">
              Alle 20 Umzugsfirmen anzeigen
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
