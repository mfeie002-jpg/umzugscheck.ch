import { useState } from "react";
import { Star, ThumbsUp, CheckCircle2, ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ReviewCardProps {
  id: string;
  userName: string;
  userInitials: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  helpfulCount: number;
  photos: string[];
  createdAt: string;
  serviceRatings?: {
    punctuality?: number;
    professionalism?: number;
    careOfItems?: number;
    communication?: number;
    value?: number;
  };
  userHasVoted?: boolean;
  onVoteChange?: () => void;
}

export const ReviewCard = ({
  id,
  userName,
  userInitials,
  rating,
  title,
  comment,
  verified,
  helpfulCount,
  photos,
  createdAt,
  serviceRatings,
  userHasVoted = false,
  onVoteChange,
}: ReviewCardProps) => {
  const { toast } = useToast();
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(userHasVoted);
  const [voteCount, setVoteCount] = useState(helpfulCount);

  const handleVote = async () => {
    setIsVoting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Anmeldung erforderlich",
          description: "Bitte melden Sie sich an, um Bewertungen als hilfreich zu markieren.",
          variant: "destructive",
        });
        return;
      }

      if (hasVoted) {
        // Remove vote
        const { error } = await supabase
          .from("review_votes")
          .delete()
          .eq("review_id", id)
          .eq("user_id", user.id);

        if (error) throw error;

        setHasVoted(false);
        setVoteCount((prev) => prev - 1);

        // Update helpful count
        await supabase
          .from("reviews")
          .update({ helpful_count: voteCount - 1 })
          .eq("id", id);
      } else {
        // Add vote
        const { error } = await supabase
          .from("review_votes")
          .insert({ review_id: id, user_id: user.id });

        if (error) throw error;

        setHasVoted(true);
        setVoteCount((prev) => prev + 1);

        // Update helpful count
        await supabase
          .from("reviews")
          .update({ helpful_count: voteCount + 1 })
          .eq("id", id);
      }

      onVoteChange?.();
    } catch (error) {
      console.error("Error voting:", error);
      toast({
        title: "Fehler",
        description: "Abstimmung konnte nicht verarbeitet werden.",
        variant: "destructive",
      });
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex gap-4">
          <Avatar className="w-12 h-12 flex-shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {userInitials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{userName}</span>
                  {verified && (
                    <Badge variant="secondary" className="text-xs bg-success/10 text-success">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Verifiziert
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(createdAt).toLocaleDateString("de-CH")}
                  </span>
                </div>
              </div>
            </div>

            {/* Title */}
            <h4 className="font-semibold text-lg">{title}</h4>

            {/* Comment */}
            <p className="text-muted-foreground leading-relaxed">{comment}</p>

            {/* Service Ratings */}
            {serviceRatings && Object.keys(serviceRatings).length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {Object.entries(serviceRatings).map(([key, value]) => {
                  if (!value) return null;
                  const labels = {
                    punctuality: "Pünktlichkeit",
                    professionalism: "Professionalität",
                    careOfItems: "Sorgfalt",
                    communication: "Kommunikation",
                    value: "Preis-Leistung",
                  };
                  return (
                    <Badge key={key} variant="outline" className="text-xs">
                      {labels[key as keyof typeof labels]}: {value}/5
                    </Badge>
                  );
                })}
              </div>
            )}

            {/* Photos */}
            {photos && photos.length > 0 && (
              <div className="flex gap-2 pt-2">
                {photos.map((photo, index) => (
                  <Dialog key={index}>
                    <DialogTrigger asChild>
                      <button className="relative w-20 h-20 rounded-lg overflow-hidden border border-border hover:opacity-80 transition-opacity group">
                        <img
                          src={photo}
                          alt={`Review photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <img
                        src={photo}
                        alt={`Review photo ${index + 1}`}
                        className="w-full h-auto"
                      />
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleVote}
                disabled={isVoting}
                className={hasVoted ? "text-primary" : ""}
              >
                <ThumbsUp className={`w-4 h-4 mr-2 ${hasVoted ? "fill-current" : ""}`} />
                Hilfreich ({voteCount})
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
