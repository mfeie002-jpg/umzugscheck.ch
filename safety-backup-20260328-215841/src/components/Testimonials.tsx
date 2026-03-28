import { useState, useEffect } from "react";
import { Star, Quote, CheckCircle2, TrendingDown, Clock, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

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
  isNew?: boolean;
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
  const { toast } = useToast();

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

    // Set up real-time subscription for new reviews
    const channel = supabase
      .channel('testimonials-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reviews',
          filter: 'verified=eq.true'
        },
        async (payload) => {
          console.log('New review received:', payload);
          
          // Fetch the full review data with joined tables
          const { data: newReview, error } = await supabase
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
            .eq("id", payload.new.id)
            .gte("rating", 4.5)
            .single();

          if (error || !newReview) {
            console.error('Error fetching new review:', error);
            return;
          }

          const highlight = getHighlightForRating(newReview.rating);
          const fullName = (newReview.profiles as any)?.full_name || "Anonymer Kunde";
          const companyName = (newReview.companies as any)?.name || "Schweizweit";

          const formattedReview: TestimonialData = {
            id: newReview.id,
            name: fullName,
            location: companyName,
            rating: Math.round(newReview.rating),
            date: formatDate(newReview.created_at),
            comment: newReview.comment,
            title: newReview.title,
            highlight: highlight.text,
            highlightIcon: highlight.icon,
            verified: newReview.verified,
            isNew: true,
          };

          // Add new review to the beginning and limit to 3
          setTestimonials((prev) => [formattedReview, ...prev].slice(0, 3));

          // Show toast notification
          toast({
            title: "Neue Bewertung! 🎉",
            description: `${fullName} hat gerade eine ${newReview.rating}-Sterne Bewertung abgegeben.`,
            duration: 5000,
          });

          // Remove "new" badge after animation completes
          setTimeout(() => {
            setTestimonials((prev) =>
              prev.map((t) => (t.id === formattedReview.id ? { ...t, isNew: false } : t))
            );
          }, 3000);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'reviews'
        },
        async (payload) => {
          console.log('Review updated:', payload);
          
          // If review was just verified and has good rating, fetch and add it
          if (payload.new.verified && payload.new.rating >= 4.5) {
            const { data: updatedReview, error } = await supabase
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
              .eq("id", payload.new.id)
              .single();

            if (error || !updatedReview) {
              console.error('Error fetching updated review:', error);
              return;
            }

            const highlight = getHighlightForRating(updatedReview.rating);
            const fullName = (updatedReview.profiles as any)?.full_name || "Anonymer Kunde";
            const companyName = (updatedReview.companies as any)?.name || "Schweizweit";

            const formattedReview: TestimonialData = {
              id: updatedReview.id,
              name: fullName,
              location: companyName,
              rating: Math.round(updatedReview.rating),
              date: formatDate(updatedReview.created_at),
              comment: updatedReview.comment,
              title: updatedReview.title,
              highlight: highlight.text,
              highlightIcon: highlight.icon,
              verified: updatedReview.verified,
              isNew: true,
            };

            // Check if review already exists in list
            setTestimonials((prev) => {
              const exists = prev.some(t => t.id === formattedReview.id);
              if (exists) {
                // Update existing review
                return prev.map(t => t.id === formattedReview.id ? formattedReview : t);
              } else {
                // Show toast for newly verified review
                toast({
                  title: "Verifizierte Bewertung! ✓",
                  description: `${fullName}'s Bewertung wurde gerade verifiziert.`,
                  duration: 5000,
                });

                // Remove "new" badge after animation
                setTimeout(() => {
                  setTestimonials((current) =>
                    current.map((t) => (t.id === formattedReview.id ? { ...t, isNew: false } : t))
                  );
                }, 3000);

                // Add new review to the beginning
                return [formattedReview, ...prev].slice(0, 3);
              }
            });
          } else if (!payload.new.verified || payload.new.rating < 4.5) {
            // Remove review if it no longer meets criteria
            setTestimonials((prev) => prev.filter(t => t.id !== payload.new.id));
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'reviews'
        },
        (payload) => {
          console.log('Review deleted:', payload);
          // Remove deleted review from the list
          setTestimonials((prev) => prev.filter(t => t.id !== payload.old.id));
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
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
              className={`group hover:shadow-strong transition-all duration-300 hover:-translate-y-1 border-border ${
                testimonial.isNew ? 'animate-[scale-in_0.5s_ease-out] ring-2 ring-accent shadow-accent' : 'animate-fade-in'
              }`}
              style={{ animationDelay: testimonial.isNew ? '0s' : `${index * 0.1}s` }}
            >
              <CardContent className="p-6 space-y-4 relative">
                {/* New Badge */}
                {testimonial.isNew && (
                  <Badge 
                    className="absolute top-4 right-4 bg-gradient-to-r from-accent to-accent/80 text-white animate-pulse"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Neu
                  </Badge>
                )}

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
