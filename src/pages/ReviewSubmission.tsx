import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function ReviewSubmission() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Bitte vergeben Sie eine Bewertung");
      return;
    }

    setSubmitting(true);
    try {
      // Get review request details
      const { data: reviewRequest } = await supabase
        .from('review_requests')
        .select('*, leads(*)')
        .eq('id', requestId)
        .single();

      if (!reviewRequest) {
        toast.error("Review-Anfrage nicht gefunden");
        return;
      }

      // Create review (requires auth - simplified for demo)
      const { data: review, error } = await supabase
        .from('reviews')
        .insert({
          company_id: reviewRequest.provider_id,
          user_id: '00000000-0000-0000-0000-000000000000', // Demo user
          lead_id: reviewRequest.lead_id,
          rating,
          title,
          comment,
          verified: true
        })
        .select()
        .single();

      if (error) throw error;

      // Update review request
      await supabase
        .from('review_requests')
        .update({
          review_submitted: true,
          review_id: review.id
        })
        .eq('id', requestId);

      setSubmitted(true);
      toast.success("Vielen Dank für Ihre Bewertung!");

      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error("Fehler beim Absenden der Bewertung");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Vielen Dank!</h2>
              <p className="text-muted-foreground">
                Ihre Bewertung wurde erfolgreich übermittelt.
              </p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 bg-gradient-light py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Umzugsbewertung abgeben</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label>Gesamtbewertung *</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-10 w-10 ${
                            value <= rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Titel *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="z.B. Sehr professioneller Service"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comment">Ihre Erfahrung *</Label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Beschreiben Sie Ihre Erfahrung mit dem Umzugsunternehmen..."
                    rows={6}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={submitting || rating === 0}
                >
                  {submitting ? "Wird gesendet..." : "Bewertung absenden"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
