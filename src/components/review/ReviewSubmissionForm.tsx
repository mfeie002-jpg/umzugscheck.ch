import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ReviewSubmissionFormProps {
  companyId: string;
  companyName: string;
  onSuccess?: () => void;
}

export const ReviewSubmissionForm = ({ companyId, companyName, onSuccess }: ReviewSubmissionFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error("Bitte vergeben Sie eine Bewertung");
      return;
    }

    if (!title.trim() || !comment.trim()) {
      toast.error("Bitte füllen Sie alle Felder aus");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          company_id: companyId,
          user_id: '00000000-0000-0000-0000-000000000000', // Demo user ID
          rating,
          title: title.trim(),
          comment: comment.trim(),
          verified: false
        });

      if (error) throw error;

      toast.success("Vielen Dank für Ihre Bewertung!");
      setRating(0);
      setTitle("");
      setComment("");
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error("Fehler beim Absenden der Bewertung");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Bewertung für {companyName} abgeben</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Rating */}
          <div className="space-y-2">
            <Label>Gesamtbewertung *</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoverRating(value)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary rounded"
                >
                  <Star
                    className={`h-8 w-8 ${
                      value <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {rating === 0 && "Klicken Sie auf die Sterne"}
              {rating === 1 && "Sehr schlecht"}
              {rating === 2 && "Schlecht"}
              {rating === 3 && "Okay"}
              {rating === 4 && "Gut"}
              {rating === 5 && "Ausgezeichnet"}
            </p>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="review-title">Titel Ihrer Bewertung *</Label>
            <Input
              id="review-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="z.B. Sehr professioneller und pünktlicher Service"
              maxLength={100}
            />
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="review-comment">Ihre Erfahrung *</Label>
            <Textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Beschreiben Sie Ihre Erfahrung mit dem Umzugsunternehmen. Was hat Ihnen gefallen? Was könnte verbessert werden?"
              rows={5}
              maxLength={2000}
            />
            <p className="text-xs text-muted-foreground text-right">
              {comment.length}/2000 Zeichen
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={submitting || rating === 0}
          >
            {submitting ? "Wird gesendet..." : "Bewertung absenden"}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Mit dem Absenden bestätigen Sie, dass Sie einen Umzug mit diesem Unternehmen durchgeführt haben.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
