import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReviewCard } from "./ReviewCard";
import { ReviewStats } from "./ReviewStats";
import { ReviewForm } from "./ReviewForm";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, PenSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: string;
  user_id: string;
  company_id: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  helpful_count: number;
  photos: string[];
  created_at: string;
  service_ratings: any;
  profiles?: {
    full_name: string;
  } | null;
  response?: {
    id: string;
    response: string;
    created_at: string;
  } | null;
}

interface ReviewListProps {
  companyId: string;
}

export const ReviewList = ({ companyId }: ReviewListProps) => {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [sortBy, setSortBy] = useState<"recent" | "helpful" | "rating">("recent");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set());

  useEffect(() => {
    checkUser();
    fetchReviews();
  }, [companyId, sortBy]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);

    if (user) {
      // Fetch user's votes
      const { data: votes } = await supabase
        .from("review_votes")
        .select("review_id")
        .eq("user_id", user.id);

      if (votes) {
        setUserVotes(new Set(votes.map((v) => v.review_id)));
      }
    }
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("reviews")
        .select("*")
        .eq("company_id", companyId);

      // Apply sorting
      if (sortBy === "recent") {
        query = query.order("created_at", { ascending: false });
      } else if (sortBy === "helpful") {
        query = query.order("helpful_count", { ascending: false });
      } else if (sortBy === "rating") {
        query = query.order("rating", { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Fetch profiles and responses separately for each review
      if (data) {
        const reviewsWithData = await Promise.all(
          data.map(async (review) => {
            const { data: profile } = await supabase
              .from("profiles")
              .select("full_name")
              .eq("id", review.user_id)
              .single();
            
            const { data: response } = await supabase
              .from("review_responses")
              .select("id, response, created_at")
              .eq("review_id", review.id)
              .single();
            
            return {
              ...review,
              profiles: profile,
              response: response,
            };
          })
        );
        setReviews(reviewsWithData);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast({
        title: "Fehler",
        description: "Bewertungen konnten nicht geladen werden.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: [
          { rating: 5, count: 0 },
          { rating: 4, count: 0 },
          { rating: 3, count: 0 },
          { rating: 2, count: 0 },
          { rating: 1, count: 0 },
        ],
        serviceRatings: {},
      };
    }

    const totalReviews = reviews.length;
    const averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

    const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
      rating,
      count: reviews.filter((r) => Math.round(r.rating) === rating).length,
    }));

    // Calculate average service ratings
    const serviceRatings: any = {};
    const serviceKeys = ["punctuality", "professionalism", "careOfItems", "communication", "value"];
    
    serviceKeys.forEach((key) => {
      const ratings = reviews
        .map((r) => r.service_ratings?.[key])
        .filter((v) => v !== undefined && v !== null);
      
      if (ratings.length > 0) {
        serviceRatings[key] = ratings.reduce((sum, v) => sum + v, 0) / ratings.length;
      }
    });

    return {
      averageRating,
      totalReviews,
      ratingDistribution,
      serviceRatings,
    };
  };

  const stats = calculateStats();

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats */}
      {reviews.length > 0 && (
        <div className="p-6 bg-muted/30 rounded-lg">
          <ReviewStats {...stats} />
        </div>
      )}

      {/* Write Review Button */}
      {currentUser && !showForm && (
        <div className="flex justify-end">
          <Button onClick={() => setShowForm(true)}>
            <PenSquare className="w-4 h-4 mr-2" />
            Bewertung schreiben
          </Button>
        </div>
      )}

      {/* Review Form */}
      {showForm && (
        <ReviewForm
          companyId={companyId}
          onSuccess={() => {
            setShowForm(false);
            fetchReviews();
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div className="space-y-4">
          {/* Sort Options */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {reviews.length} Bewertung{reviews.length !== 1 ? "en" : ""}
            </h3>
            <Select
              value={sortBy}
              onValueChange={(value: any) => setSortBy(value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Neueste zuerst</SelectItem>
                <SelectItem value="helpful">Hilfreichste zuerst</SelectItem>
                <SelectItem value="rating">Beste Bewertung zuerst</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reviews */}
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                id={review.id}
                companyId={review.company_id}
                userName={review.profiles?.full_name || "Anonymer Nutzer"}
                userInitials={getUserInitials(review.profiles?.full_name || "AN")}
                rating={review.rating}
                title={review.title}
                comment={review.comment}
                verified={review.verified}
                helpfulCount={review.helpful_count}
                photos={review.photos || []}
                createdAt={review.created_at}
                serviceRatings={review.service_ratings}
                userHasVoted={userVotes.has(review.id)}
                onVoteChange={fetchReviews}
                response={review.response}
              />
            ))}
          </div>
        </div>
      )}

      {reviews.length === 0 && !showForm && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            Noch keine Bewertungen vorhanden.
          </p>
          {currentUser && (
            <Button onClick={() => setShowForm(true)}>
              Erste Bewertung schreiben
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
