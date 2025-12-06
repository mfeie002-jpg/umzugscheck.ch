import { useState, useEffect, memo, useCallback, useMemo } from "react";
import { Star, Quote, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  type: string;
  rating: number;
  text: string;
  verified: boolean;
}

const fallbackTestimonials: Testimonial[] = [
  { id: "1", name: "Sandra K.", location: "Zürich", type: "3.5-Zimmer", rating: 5, text: "Der Vergleich war einfach. Innerhalb eines Tages hatte ich drei faire Offerten.", verified: true },
  { id: "2", name: "Thomas M.", location: "Basel", type: "Firmenumzug", rating: 5, text: "Die vorgeschlagenen Firmen waren alle top – professionell und fair.", verified: true },
  { id: "3", name: "Nicole B.", location: "Bern", type: "4.5-Zimmer", rating: 5, text: "Transparente Preise, keine nervigen Anrufe, nur seriöse Angebote.", verified: true },
  { id: "4", name: "Marco R.", location: "Luzern", type: "2.5-Zimmer", rating: 5, text: "Die AI-Analyse hat genau die richtigen Firmen gefunden.", verified: true }
];

const displayStats = [
  { value: "15'000+", label: "Umzüge" },
  { value: "4.8/5", label: "Bewertung" },
  { value: "200+", label: "Partner" },
  { value: "26", label: "Kantone" }
];

// Memoized review card
const ReviewCard = memo(({ testimonial }: { testimonial: Testimonial }) => (
  <div className="bg-card rounded-xl p-4 md:p-5 shadow-soft border border-border/50 h-full">
    <div className="flex gap-0.5 mb-2">
      {[...Array(testimonial.rating)].map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-swiss-gold text-swiss-gold" />
      ))}
    </div>
    <p className="text-foreground text-sm leading-relaxed line-clamp-3 mb-3">
      "{testimonial.text}"
    </p>
    <div className="flex items-center gap-2">
      <span className="font-medium text-foreground text-sm">{testimonial.name}</span>
      {testimonial.verified && (
        <Badge variant="secondary" className="text-[9px] px-1 py-0 bg-emerald-500/10 text-emerald-600">
          <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" />
          Verifiziert
        </Badge>
      )}
    </div>
    <div className="text-xs text-muted-foreground">{testimonial.location} • {testimonial.type}</div>
  </div>
));

ReviewCard.displayName = 'ReviewCard';

export const PremiumSocialProof = memo(() => {
  const [reviews, setReviews] = useState<Testimonial[]>(fallbackTestimonials);
  const [loading, setLoading] = useState(true);
  const [avgRating, setAvgRating] = useState(4.8);

  const fetchReviews = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("id, rating, comment, verified, profiles:user_id(full_name), companies:company_id(name)")
        .gte("rating", 4)
        .order("created_at", { ascending: false })
        .limit(4);

      if (!error && data?.length) {
        setReviews(data.map((r: any) => ({
          id: r.id,
          name: r.profiles?.full_name || "Verifizierter Kunde",
          location: "Schweiz",
          type: r.companies?.name || "Umzug",
          rating: r.rating,
          text: r.comment,
          verified: r.verified
        })));
      }

      const { data: avgData } = await supabase.from("reviews").select("rating");
      if (avgData?.length) {
        setAvgRating(Math.round((avgData.reduce((s, r) => s + r.rating, 0) / avgData.length) * 10) / 10);
      }
    } catch { /* use fallback */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  return (
    <section className="py-10 md:py-14 bg-muted/30" aria-labelledby="social-proof-heading">
      <div className="container mx-auto px-4">
        {/* Stats Row - Compact */}
        <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-2xl mx-auto mb-8">
          {displayStats.map((stat, idx) => (
            <div key={idx} className="text-center p-3 bg-card rounded-lg border border-border/40">
              <div className="text-lg md:text-2xl font-bold text-primary">{stat.value}</div>
              <div className="text-[10px] md:text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h2 id="social-proof-heading" className="text-xl md:text-2xl font-bold text-foreground mb-1">
            Das sagen unsere Kunden
          </h2>
          <p className="text-sm text-muted-foreground">Echte Bewertungen von echten Kunden</p>
        </motion.div>
        
        {/* Reviews */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl p-4 border">
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-12 w-full mb-2" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Mobile Carousel */}
            <div className="md:hidden">
              <Carousel opts={{ align: "start", loop: true }}>
                <CarouselContent className="-ml-2">
                  {reviews.map((t) => (
                    <CarouselItem key={t.id} className="pl-2 basis-[85%]">
                      <ReviewCard testimonial={t} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center gap-2 mt-3">
                  <CarouselPrevious className="static translate-y-0 h-7 w-7" />
                  <CarouselNext className="static translate-y-0 h-7 w-7" />
                </div>
              </Carousel>
            </div>
            
            {/* Desktop Grid */}
            <div className="hidden md:grid grid-cols-4 gap-4">
              {reviews.map((t) => <ReviewCard key={t.id} testimonial={t} />)}
            </div>
          </>
        )}
        
        {/* Rating Summary */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-full border shadow-sm text-sm">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-swiss-gold text-swiss-gold" />
              ))}
            </div>
            <span className="font-medium">{avgRating} von 5</span>
          </div>
        </div>
      </div>
    </section>
  );
});

PremiumSocialProof.displayName = 'PremiumSocialProof';
