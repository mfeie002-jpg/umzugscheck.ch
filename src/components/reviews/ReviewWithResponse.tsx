import { useState } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Star, MessageSquare, Edit2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReviewResponseForm } from "./ReviewResponseForm";

interface Review {
  id: string;
  rating: number;
  title: string;
  comment: string;
  created_at: string;
  user_id: string;
  profiles?: {
    full_name: string | null;
  };
}

interface ReviewResponse {
  id: string;
  response: string;
  created_at: string;
}

interface ReviewWithResponseProps {
  review: Review;
  companyId: string;
  existingResponse?: ReviewResponse;
  canRespond?: boolean;
  onResponseUpdated?: () => void;
}

export const ReviewWithResponse = ({
  review,
  companyId,
  existingResponse,
  canRespond = false,
  onResponseUpdated,
}: ReviewWithResponseProps) => {
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleResponseSuccess = () => {
    setShowResponseForm(false);
    setIsEditing(false);
    onResponseUpdated?.();
  };

  return (
    <Card className="border border-border/50">
      <CardContent className="p-4 space-y-4">
        {/* Review Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{review.rating}/5</span>
            </div>
            <h4 className="font-semibold">{review.title}</h4>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <p>{review.profiles?.full_name || "Anonym"}</p>
            <p>{format(new Date(review.created_at), "dd. MMM yyyy", { locale: de })}</p>
          </div>
        </div>

        {/* Review Comment */}
        <p className="text-muted-foreground">{review.comment}</p>

        {/* Existing Response */}
        {existingResponse && !isEditing && (
          <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-primary">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <MessageSquare className="w-4 h-4" />
                Antwort des Unternehmens
              </div>
              {canRespond && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  Bearbeiten
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{existingResponse.response}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {format(new Date(existingResponse.created_at), "dd. MMM yyyy", { locale: de })}
            </p>
          </div>
        )}

        {/* Response Form */}
        {(showResponseForm || isEditing) && (
          <div className="border-t pt-4">
            <ReviewResponseForm
              reviewId={review.id}
              companyId={companyId}
              existingResponse={isEditing ? existingResponse : undefined}
              onSuccess={handleResponseSuccess}
              onCancel={() => {
                setShowResponseForm(false);
                setIsEditing(false);
              }}
            />
          </div>
        )}

        {/* Respond Button */}
        {canRespond && !existingResponse && !showResponseForm && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowResponseForm(true)}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Auf Bewertung antworten
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
