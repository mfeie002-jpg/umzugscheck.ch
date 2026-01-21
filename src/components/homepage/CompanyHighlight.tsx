import { motion } from "framer-motion";
import { Star, Shield, Clock, ArrowRight, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useFeaturedProviders, getDisplayRating, getResponseTimeString, getEstimatedReviewCount } from "@/hooks/usePublicProviders";

export const CompanyHighlight = () => {
  const { data: featuredProviders, isLoading } = useFeaturedProviders(1);
  
  const provider = featuredProviders?.[0];

  // Show loading state or fallback
  if (isLoading || !provider) {
    return (
      <section className="py-12 bg-gradient-to-br from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-lg animate-pulse">
            <div className="h-6 w-32 bg-muted rounded mb-4" />
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-20 h-20 rounded-xl bg-muted" />
              <div className="flex-1 space-y-3">
                <div className="h-6 w-48 bg-muted rounded" />
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-3/4 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const rating = getDisplayRating(provider.quality_score);
  const reviewCount = getEstimatedReviewCount(provider.quality_score);
  const responseTime = getResponseTimeString(provider.response_time_minutes);

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
            {provider.verification_status === "approved" && (
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 text-xs font-medium rounded-full">
                ✓ Verifiziert
              </span>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            {provider.logo_url ? (
              <img
                src={provider.logo_url}
                alt={provider.company_name}
                className="w-20 h-20 rounded-xl object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 className="h-10 w-10 text-primary" />
              </div>
            )}
            
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground mb-2">{provider.company_name}</h3>
              <p className="text-muted-foreground mb-4">
                {provider.short_description || `Ihr zuverlässiger Umzugspartner in ${provider.city || 'der Schweiz'}.`}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {(provider.services_offered || []).slice(0, 3).map((service) => (
                  <span
                    key={service}
                    className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
                  >
                    {service}
                  </span>
                ))}
                {provider.certifications?.slice(0, 2).map((cert) => (
                  <span
                    key={cert}
                    className="px-2 py-1 bg-emerald-500/10 text-emerald-600 text-xs font-medium rounded-full"
                  >
                    {cert}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium">{rating.toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground">({reviewCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{responseTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Versichert</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3 w-full md:w-auto">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Preislevel</p>
                <p className="text-xl font-bold text-foreground capitalize">{provider.price_level || "Fair"}</p>
              </div>
              <div className="flex gap-2">
                <Link to={`/firmen/${provider.id}`}>
                  <Button variant="outline" className="gap-2">
                    Profil ansehen
                  </Button>
                </Link>
                <Link to="/umzugsofferten">
                  <Button className="gap-2">
                    Offerte anfragen
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
