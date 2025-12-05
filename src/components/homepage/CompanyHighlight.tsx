import { motion } from "framer-motion";
import { Star, Shield, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const featuredCompany = {
  name: "Swiss Move Pro AG",
  logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop",
  rating: 4.9,
  reviews: 342,
  description: "Ihr Premium-Partner für stressfreie Umzüge in der ganzen Schweiz.",
  badges: ["Top bewertet", "Express verfügbar"],
  responseTime: "< 2h",
  priceRange: "ab CHF 590"
};

export const CompanyHighlight = () => {
  return (
    <section className="py-12 bg-gradient-to-br from-primary/5 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-lg"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-yellow-500/10 text-yellow-600 text-xs font-medium rounded-full">
              ⭐ Firma des Monats
            </span>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <img
              src={featuredCompany.logo}
              alt={featuredCompany.name}
              className="w-20 h-20 rounded-xl object-cover"
            />
            
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground mb-2">{featuredCompany.name}</h3>
              <p className="text-muted-foreground mb-4">{featuredCompany.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {featuredCompany.badges.map((badge) => (
                  <span
                    key={badge}
                    className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium">{featuredCompany.rating}</span>
                  <span className="text-xs text-muted-foreground">({featuredCompany.reviews})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{featuredCompany.responseTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Versichert</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3 w-full md:w-auto">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Preis</p>
                <p className="text-xl font-bold text-foreground">{featuredCompany.priceRange}</p>
              </div>
              <Link to="/umzugsofferten">
                <Button className="gap-2 w-full md:w-auto">
                  Offerte anfragen
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
