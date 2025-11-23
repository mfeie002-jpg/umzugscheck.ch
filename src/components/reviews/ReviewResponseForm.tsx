import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

const responseSchema = z.object({
  response: z.string().min(10, "Antwort muss mindestens 10 Zeichen lang sein").max(1000, "Antwort darf maximal 1000 Zeichen lang sein"),
});

type ResponseFormData = z.infer<typeof responseSchema>;

interface ReviewResponseFormProps {
  reviewId: string;
  companyId: string;
  existingResponse?: {
    id: string;
    response: string;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ReviewResponseForm = ({
  reviewId,
  companyId,
  existingResponse,
  onSuccess,
  onCancel,
}: ReviewResponseFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResponseFormData>({
    resolver: zodResolver(responseSchema),
    defaultValues: {
      response: existingResponse?.response || "",
    },
  });

  const onSubmit = async (data: ResponseFormData) => {
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Anmeldung erforderlich",
          description: "Bitte melden Sie sich an, um zu antworten.",
          variant: "destructive",
        });
        return;
      }

      if (existingResponse) {
        // Update existing response
        const { error } = await supabase
          .from("review_responses")
          .update({
            response: data.response,
          })
          .eq("id", existingResponse.id);

        if (error) throw error;

        toast({
          title: "Antwort aktualisiert",
          description: "Ihre Antwort wurde erfolgreich aktualisiert.",
        });
      } else {
        // Create new response
        const { error } = await supabase
          .from("review_responses")
          .insert({
            review_id: reviewId,
            company_id: companyId,
            user_id: user.id,
            response: data.response,
          });

        if (error) throw error;

        toast({
          title: "Antwort veröffentlicht",
          description: "Ihre Antwort wurde erfolgreich veröffentlicht.",
        });
      }

      onSuccess?.();
    } catch (error) {
      logger.error("Error submitting response", error, { reviewId, companyId });
      toast({
        title: "Fehler",
        description: "Antwort konnte nicht gespeichert werden.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="response">Antwort des Unternehmens</Label>
        <Textarea
          id="response"
          {...register("response")}
          placeholder="Antworten Sie auf diese Bewertung..."
          rows={4}
          className="resize-none"
        />
        {errors.response && (
          <p className="text-sm text-destructive">{errors.response.message}</p>
        )}
      </div>

      <div className="flex gap-3 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Abbrechen
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {existingResponse ? "Aktualisieren" : "Antworten"}
        </Button>
      </div>
    </form>
  );
};
