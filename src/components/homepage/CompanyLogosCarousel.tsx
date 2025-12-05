import { motion } from "framer-motion";
import { Star, CheckCircle, Shield } from "lucide-react";

const companies = [
  { name: "Müller Umzüge", rating: 4.9, reviews: 234, verified: true },
  { name: "Swiss Move AG", rating: 4.8, reviews: 189, verified: true },
  { name: "Helvetia Transport", rating: 4.7, reviews: 156, verified: true },
  { name: "Alpen Umzug", rating: 4.9, reviews: 312, verified: true },
  { name: "City Mover Zürich", rating: 4.6, reviews: 98, verified: true },
  { name: "Express Umzüge", rating: 4.8, reviews: 267, verified: true },
  { name: "ProMove Basel", rating: 4.7, reviews: 145, verified: true },
  { name: "Bern Umzugsprofis", rating: 4.9, reviews: 203, verified: true },
];

export const CompanyLogosCarousel = () => {
  return (
    <section className="py-12 md:py-16 border-y border-border bg-muted/20 overflow-hidden">
      <div className="container mb-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground font-medium mb-1">
            Über 200+ geprüfte Partner
          </p>
          <h3 className="text-lg font-semibold">Unsere Top-Umzugsfirmen</h3>
        </div>
      </div>
      
      {/* Infinite Scroll Carousel */}
      <div className="relative">
        <motion.div
          className="flex gap-6"
          animate={{ x: [0, -1200] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {[...companies, ...companies].map((company, index) => (
            <div
              key={`${company.name}-${index}`}
              className="flex-shrink-0 bg-card rounded-xl p-4 border border-border shadow-soft min-w-[220px]"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <span className="text-lg font-bold text-secondary">
                    {company.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-sm truncate max-w-[140px]">
                    {company.name}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-swiss-gold text-swiss-gold" />
                    <span className="text-xs font-medium">{company.rating}</span>
                    <span className="text-xs text-muted-foreground">
                      ({company.reviews})
                    </span>
                  </div>
                </div>
              </div>
              {company.verified && (
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <Shield className="w-3 h-3" />
                  Geprüft & versichert
                </div>
              )}
            </div>
          ))}
        </motion.div>
        
        {/* Fade edges */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-muted/20 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-muted/20 to-transparent pointer-events-none" />
      </div>
    </section>
  );
};
