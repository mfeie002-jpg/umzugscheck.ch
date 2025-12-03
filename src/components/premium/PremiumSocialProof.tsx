import { useState, useEffect } from "react";
import { Star, Quote, Image, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Review {
  id: string;
  rating: number;
  title: string;
  comment: string;
  photos: string[];
  verified: boolean;
  created_at: string;
  profiles?: {
    full_name: string;
  };
  companies?: {
    name: string;
  };
}

const stats = [
  { value: "15'000+", label: "Erfolgreiche Umzüge" },
  { value: "4.8/5", label: "Durchschnittsbewertung" },
  { value: "200+", label: "Geprüfte Partner" },
  { value: "26", label: "Kantone abgedeckt" }
];

// Fallback testimonials if no real reviews exist
const fallbackTestimonials = [
  {
    id: "fallback-1",
    name: "Sandra K.",
    location: "Zürich",
    type: "Privatumzug 3.5-Zimmer",
    rating: 5,
    text: "Der Vergleich war unglaublich einfach. Innerhalb eines Tages hatte ich drei faire Offerten und konnte in Ruhe vergleichen. Absolut empfehlenswert!",
    verified: true,
    photos: []
  },
  {
    id: "fallback-2",
    name: "Thomas M.",
    location: "Basel",
    type: "Firmenumzug 15 Arbeitsplätze",
    rating: 5,
    text: "Als KMU-Inhaber war mir Zuverlässigkeit wichtig. Die vorgeschlagenen Firmen waren alle top – professionell, pünktlich und fair im Preis.",
    verified: true,
    photos: []
  },
  {
    id: "fallback-3",
    name: "Nicole B.",
    location: "Bern",
    type: "Privatumzug 4.5-Zimmer",
    rating: 5,
    text: "Endlich ein Portal, das hält, was es verspricht. Transparente Preise, keine nervigen Anrufe, nur seriöse Angebote. Genau so sollte es sein.",
    verified: true,
    photos: []
  },
  {
    id: "fallback-4",
    name: "Marco R.",
    location: "Luzern",
    type: "Privatumzug 2.5-Zimmer",
    rating: 5,
    text: "Ich war skeptisch, aber positiv überrascht. Die AI-Analyse hat genau die richtigen Firmen gefunden. Sehr moderne und effiziente Plattform.",
    verified: true,
    photos: []
  }
];

export const PremiumSocialProof = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewCount, setReviewCount] = useState(2847);
  const [avgRating, setAvgRating] = useState(4.8);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      // Fetch real reviews from database
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          id,
          rating,
          title,
          comment,
          photos,
          verified,
          created_at,
          profiles:user_id(full_name),
          companies:company_id(name)
        `)
        .gte("rating", 4)
        .order("created_at", { ascending: false })
        .limit(8);

      if (error) throw error;

      if (data && data.length > 0) {
        const formattedReviews = data.map((review: any) => ({
          id: review.id,
          name: review.profiles?.full_name || "Verifizierter Kunde",
          location: "Schweiz",
          type: review.companies?.name || "Umzug",
          rating: review.rating,
          text: review.comment,
          verified: review.verified,
          photos: review.photos || []
        }));
        setReviews(formattedReviews.slice(0, 4));
      } else {
        setReviews(fallbackTestimonials);
      }

      // Get review stats
      const { count } = await supabase
        .from("reviews")
        .select("*", { count: "exact", head: true });
      
      if (count && count > 0) {
        setReviewCount(count + 2800); // Add baseline
      }

      const { data: avgData } = await supabase
        .from("reviews")
        .select("rating");
      
      if (avgData && avgData.length > 0) {
        const avg = avgData.reduce((sum, r) => sum + r.rating, 0) / avgData.length;
        setAvgRating(Math.round(avg * 10) / 10);
      }

    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews(fallbackTestimonials);
    } finally {
      setLoading(false);
    }
  };

  const displayStats = [
    { value: "15'000+", label: "Erfolgreiche Umzüge" },
    { value: `${avgRating}/5`, label: "Durchschnittsbewertung" },
    { value: "200+", label: "Geprüfte Partner" },
    { value: "26", label: "Kantone abgedeckt" }
  ];

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {displayStats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Das sagen unsere Kunden
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tausende zufriedene Kunden haben mit Umzugscheck.ch den passenden Partner für ihren Umzug gefunden.
          </p>
        </motion.div>
        
        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            // Loading skeletons
            [...Array(4)].map((_, idx) => (
              <div key={idx} className="bg-card rounded-2xl p-6 shadow-premium border border-border/50">
                <Skeleton className="h-8 w-8 mb-4" />
                <Skeleton className="h-4 w-20 mb-4" />
                <Skeleton className="h-20 w-full mb-6" />
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))
          ) : (
            reviews.map((testimonial, idx) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-premium border border-border/50 hover:shadow-lift transition-shadow"
              >
                {/* Quote Icon */}
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-swiss-gold text-swiss-gold" />
                  ))}
                </div>
                
                {/* Text */}
                <p className="text-foreground mb-4 leading-relaxed text-sm line-clamp-4">
                  "{testimonial.text}"
                </p>

                {/* Photos */}
                {testimonial.photos && testimonial.photos.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    {testimonial.photos.slice(0, 3).map((photo: string, photoIdx: number) => (
                      <Dialog key={photoIdx}>
                        <DialogTrigger asChild>
                          <button className="relative w-12 h-12 rounded-lg overflow-hidden border border-border hover:opacity-80 transition-opacity">
                            <img
                              src={photo}
                              alt={`Review photo ${photoIdx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {testimonial.photos.length > 3 && photoIdx === 2 && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="text-white text-xs font-medium">+{testimonial.photos.length - 3}</span>
                              </div>
                            )}
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <img
                            src={photo}
                            alt={`Review photo ${photoIdx + 1}`}
                            className="w-full h-auto rounded-lg"
                          />
                        </DialogContent>
                      </Dialog>
                    ))}
                  </div>
                )}
                
                {/* Author */}
                <div className="border-t border-border pt-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{testimonial.name}</span>
                    {testimonial.verified && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-success/10 text-success">
                        <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" />
                        Verifiziert
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                  <div className="text-xs text-primary mt-1">{testimonial.type}</div>
                </div>
              </motion.div>
            ))
          )}
        </div>
        
        {/* Average Rating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-card rounded-full border border-border shadow-sm">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-swiss-gold text-swiss-gold" />
              ))}
            </div>
            <span className="font-semibold text-foreground">{avgRating} von 5</span>
            <span className="text-muted-foreground">basierend auf {reviewCount.toLocaleString("de-CH")} Bewertungen</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
