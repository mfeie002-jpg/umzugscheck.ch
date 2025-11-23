import { useState, useEffect } from "react";
import { Star, Quote, CheckCircle2, TrendingDown, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface Review {
  id: string;
  rating: number;
  title: string;
  comment: string;
  created_at: string;
  verified: boolean;
  profiles: {
    full_name: string;
  } | null;
  companies: {
    name: string;
  } | null;
}

interface TestimonialData {
  id: string;
  name: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  title: string;
  highlight: string;
  highlightIcon: any;
  verified: boolean;
}

const getHighlightForRating = (rating: number): { text: string; icon: any } => {
  if (rating >= 5) return { text: "5 Sterne Service", icon: Star };
  if (rating >= 4.5) return { text: "Top bewertet", icon: Star };
  return { text: "Empfohlen", icon: CheckCircle2 };
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Heute";
  if (diffDays === 1) return "Vor 1 Tag";
  if (diffDays < 7) return `Vor ${diffDays} Tagen`;
  if (diffDays < 14) return "Vor 1 Woche";
  if (diffDays < 30) return `Vor ${Math.floor(diffDays / 7)} Wochen`;
  if (diffDays < 60) return "Vor 1 Monat";
  return `Vor ${Math.floor(diffDays / 30)} Monaten`;
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select(`
            id,
            rating,
            title,
            comment,
            created_at,
            verified,
            profiles:user_id (
              full_name
            ),
            companies:company_id (
              name
            )
          `)
          .eq("verified", true)
          .gte("rating", 4.5)
          .order("created_at", { ascending: false })
          .limit(6);

        if (error) throw error;

        const formattedTestimonials: TestimonialData[] = (data || []).map((review: any) => {
          const highlight = getHighlightForRating(review.rating);
          const fullName = review.profiles?.full_name || "Anonymer Kunde";
          const companyName = review.companies?.name || "Schweizweit";
          
          return {
            id: review.id,
            name: fullName,
            location: companyName,
            rating: Math.round(review.rating),
            date: formatDate(review.created_at),
            comment: review.comment,
            title: review.title,
            highlight: highlight.text,
            highlightIcon: highlight.icon,
            verified: review.verified,
          };
        });

        setTestimonials(formattedTestimonials.slice(0, 3));
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        // Keep empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-12">
            <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verifizierte Kundenbewertungen</span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
              Das sagen unsere zufriedenen Kunden
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Über 12'000 Kunden haben bereits erfolgreich verglichen und gespart
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-border">
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <div className="flex items-center gap-3 pt-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <CheckCircle2 className="w-4 h-4" />
            <span>Verifizierte Kundenbewertungen</span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
            Das sagen unsere zufriedenen Kunden
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Echte Bewertungen von verifizierten Kunden
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id} 
              className="group hover:shadow-strong transition-all duration-300 hover:-translate-y-1 border-border animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 space-y-4">
                {/* Quote Icon */}
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Quote className="w-5 h-5 text-accent" />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>

                {/* Title */}
                <h4 className="font-semibold text-foreground">
                  {testimonial.title}
                </h4>

                {/* Comment */}
                <p className="text-muted-foreground leading-relaxed text-sm">
                  "{testimonial.comment}"
                </p>

                {/* Highlight Badge */}
                <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-success/10 to-success/5 border border-success/20">
                  <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                    <testimonial.highlightIcon className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-sm font-semibold text-success">
                    {testimonial.highlight}
                  </span>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3 pt-4 border-t">
                  <Avatar className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20">
                    <AvatarFallback className="bg-transparent text-foreground font-semibold">
                      {getInitials(testimonial.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      {testimonial.verified && (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.date}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-4 rounded-xl bg-white border border-border">
            <div className="text-3xl font-bold text-primary mb-1">4.8/5</div>
            <div className="text-sm text-muted-foreground">Ø Bewertung</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-white border border-border">
            <div className="text-3xl font-bold text-primary mb-1">12'000+</div>
            <div className="text-sm text-muted-foreground">Zufriedene Kunden</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-white border border-border">
            <div className="text-3xl font-bold text-primary mb-1">98%</div>
            <div className="text-sm text-muted-foreground">Weiterempfehlung</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-white border border-border">
            <div className="text-3xl font-bold text-primary mb-1">CHF 700</div>
            <div className="text-sm text-muted-foreground">Ø Ersparnis</div>
          </div>
        </div>
      </div>
    </section>
  );
};
