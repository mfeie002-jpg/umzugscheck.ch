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
    <section className="py-20 md:py-28 bg-slate-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
            Top bewertete Umzugsfirmen
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Geprüfte und versicherte Partner
          </p>

          {/* Filter Chips */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {filterOptions.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-6 py-3 rounded-full font-bold text-sm transition-all shadow-md ${
                  activeFilter === filter.value
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg scale-105"
                    : "bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Companies Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {topCompanies.map((company, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all group border-slate-200 bg-white">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={company.image}
                    alt={company.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/95 text-slate-900 backdrop-blur-sm font-bold shadow-md px-3 py-1">
                      {company.priceLevel}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-slate-900">{company.name}</h3>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-lg text-slate-900">{company.rating}</span>
                    </div>
                    <span className="text-sm text-slate-600">
                      ({company.reviewCount} Bewertungen)
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {company.badges.slice(0, 2).map((badge, i) => (
                      <Badge key={i} variant="outline" className="text-xs font-semibold border-slate-300">
                        {badge === "Geprüft" && <CheckCircle className="h-3 w-3 mr-1 text-green-600" />}
                        {badge === "Versichert" && <Shield className="h-3 w-3 mr-1 text-blue-600" />}
                        {badge.includes("Seit") && <Calendar className="h-3 w-3 mr-1 text-slate-600" />}
                        {badge}
                      </Badge>
                    ))}
                  </div>

                  <Button className="w-full h-12 font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-md hover:shadow-lg transition-all">
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
          className="text-center mt-12"
        >
          <Link to="/umzugsfirmen-schweiz">
            <Button variant="outline" size="lg" className="px-10 h-14 text-lg font-bold border-2 border-slate-300 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600">
              Alle Umzugsfirmen anzeigen
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
