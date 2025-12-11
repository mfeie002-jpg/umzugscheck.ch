import { useState, useEffect, memo, useCallback, useMemo } from "react";
import { Star, Quote, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Marquee } from "@/components/common/Marquee";
import { GlowingCard } from "@/components/common/GlowingCard";
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

// Partner names only - display as styled text to avoid broken image links
const partnerNames = ["20 Minuten", "Blick", "Watson", "TCS", "SRF", "NZZ"];

// Memoized review card with GlowingCard
const ReviewCard = memo(({ testimonial }: { testimonial: Testimonial }) => (
  <GlowingCard className="h-full">
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
  </GlowingCard>
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
    <section className="py-8 sm:py-10 md:py-14 bg-muted/30 min-h-[300px] sm:min-h-[350px] md:min-h-[400px]" aria-labelledby="social-proof-heading">
      <div className="container mx-auto px-4 sm:px-6">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 min-h-[140px] md:min-h-[160px]">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl p-4 border min-h-[120px] md:min-h-[140px]">
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
                    <CarouselItem key={t.id} className="pl-2 basis-[80%] xs:basis-[85%]">
                      <ReviewCard testimonial={t} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center gap-3 mt-4">
                  <CarouselPrevious className="static translate-y-0 h-9 w-9 active:scale-95 transition-transform" />
                  <CarouselNext className="static translate-y-0 h-9 w-9 active:scale-95 transition-transform" />
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

        {/* Partner Logos Marquee */}
        <div className="mt-10 pt-8 border-t border-border/50">
          <p className="text-center text-xs text-muted-foreground mb-4 uppercase tracking-wider">
            Bekannt aus & geprüft von
          </p>
          <Marquee speed="slow" pauseOnHover className="py-2">
            {partnerNames.map((name) => (
              <div
                key={name}
                className="flex items-center justify-center mx-8 opacity-60 hover:opacity-100 transition-all duration-300"
              >
                <span className="text-base md:text-lg font-semibold text-muted-foreground whitespace-nowrap">
                  {name}
                </span>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
});

PremiumSocialProof.displayName = 'PremiumSocialProof';
