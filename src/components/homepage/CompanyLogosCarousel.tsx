import { motion } from "framer-motion";
import { Star, Shield, Building2 } from "lucide-react";
import { useCompanies } from "@/hooks/useCompanies";
import { Link } from "react-router-dom";

const fallbackCompanies = [
  { id: "1", name: "Müller Umzüge", rating: 4.9, review_count: 234, verified: true, logo: null },
  { id: "2", name: "Swiss Move AG", rating: 4.8, review_count: 189, verified: true, logo: null },
  { id: "3", name: "Helvetia Transport", rating: 4.7, review_count: 156, verified: true, logo: null },
  { id: "4", name: "Alpen Umzug", rating: 4.9, review_count: 312, verified: true, logo: null },
  { id: "5", name: "City Mover Zürich", rating: 4.6, review_count: 98, verified: true, logo: null },
  { id: "6", name: "Express Umzüge", rating: 4.8, review_count: 267, verified: true, logo: null },
  { id: "7", name: "ProMove Basel", rating: 4.7, review_count: 145, verified: true, logo: null },
  { id: "8", name: "Bern Umzugsprofis", rating: 4.9, review_count: 203, verified: true, logo: null },
];

export const CompanyLogosCarousel = () => {
  const { data: companies, isLoading } = useCompanies(12);
  
  const displayCompanies = companies && companies.length > 0 ? companies : fallbackCompanies;

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
          {[...displayCompanies, ...displayCompanies].map((company, index) => (
            <Link
              key={`${company.id}-${index}`}
              to={`/firmen/${company.id}`}
              className="flex-shrink-0 bg-card rounded-xl p-4 border border-border shadow-soft min-w-[220px] hover:border-primary/30 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                {company.logo ? (
                  <img src={company.logo} alt={company.name} className="w-10 h-10 rounded-lg object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div>
                  <div className="font-medium text-sm truncate max-w-[140px]">
                    {company.name}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-swiss-gold text-swiss-gold" />
                    <span className="text-xs font-medium">{company.rating?.toFixed(1) || "N/A"}</span>
                    <span className="text-xs text-muted-foreground">
                      ({company.review_count || 0})
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
            </Link>
          ))}
        </motion.div>
        
        {/* Fade edges */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-muted/20 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-muted/20 to-transparent pointer-events-none" />
      </div>
    </section>
  );
};
