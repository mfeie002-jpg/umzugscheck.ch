import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Star, Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(5, "Titel muss mindestens 5 Zeichen lang sein"),
  comment: z.string().min(20, "Kommentar muss mindestens 20 Zeichen lang sein"),
  punctuality: z.number().min(1).max(5).optional(),
  professionalism: z.number().min(1).max(5).optional(),
  careOfItems: z.number().min(1).max(5).optional(),
  communication: z.number().min(1).max(5).optional(),
  value: z.number().min(1).max(5).optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  companyId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ReviewForm = ({ companyId, onSuccess, onCancel }: ReviewFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
      punctuality: 5,
      professionalism: 5,
      careOfItems: 5,
      communication: 5,
      value: 5,
    },
  });

  const rating = watch("rating");

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > 5) {
      toast({
        title: "Zu viele Fotos",
        description: "Sie können maximal 5 Fotos hochladen.",
        variant: "destructive",
      });
      return;
    }

    setPhotos((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreviewUrls((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Anmeldung erforderlich",
          description: "Bitte melden Sie sich an, um eine Bewertung abzugeben.",
          variant: "destructive",
        });
        return;
      }

      // Upload photos if any
      const photoUrls: string[] = [];
      if (photos.length > 0) {
        for (const photo of photos) {
          const fileExt = photo.name.split(".").pop();
          const fileName = `${user.id}/${Date.now()}.${fileExt}`;
          
          const { error: uploadError, data: uploadData } = await supabase.storage
            .from("review-photos")
            .upload(fileName, photo);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from("review-photos")
            .getPublicUrl(fileName);

          photoUrls.push(publicUrl);
        }
      }

      // Create review
      const { error: insertError } = await supabase.from("reviews").insert({
        company_id: companyId,
        user_id: user.id,
        rating: data.rating,
        title: data.title,
        comment: data.comment,
        service_ratings: {
          punctuality: data.punctuality,
          professionalism: data.professionalism,
          careOfItems: data.careOfItems,
          communication: data.communication,
          value: data.value,
        },
        photos: photoUrls,
      });

      if (insertError) throw insertError;

      toast({
        title: "Bewertung erfolgreich",
        description: "Ihre Bewertung wurde veröffentlicht.",
      });

      onSuccess?.();
    } catch (error) {
      logger.error("Error submitting review", error, { companyId });
      toast({
        title: "Fehler",
        description: "Bewertung konnte nicht gespeichert werden.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bewertung schreiben</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Overall Rating */}
          <div className="space-y-2">
            <Label>Gesamtbewertung *</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setValue("rating", value)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      value <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 font-semibold">{rating}/5</span>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Titel *</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Zusammenfassung Ihrer Erfahrung"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Ihre Erfahrung *</Label>
            <Textarea
              id="comment"
              {...register("comment")}
              placeholder="Erzählen Sie uns von Ihrer Erfahrung mit diesem Umzugsunternehmen..."
              rows={5}
            />
            {errors.comment && (
              <p className="text-sm text-destructive">{errors.comment.message}</p>
            )}
          </div>

          {/* Service Ratings */}
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold text-sm">Detailbewertungen (optional)</h4>
            
            {[
              { key: "punctuality", label: "Pünktlichkeit" },
              { key: "professionalism", label: "Professionalität" },
              { key: "careOfItems", label: "Sorgfalt mit Gegenständen" },
              { key: "communication", label: "Kommunikation" },
              { key: "value", label: "Preis-Leistung" },
            ].map(({ key, label }) => {
              const value = watch(key as keyof ReviewFormData) as number;
              return (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-normal">{label}</Label>
                    <span className="text-sm font-semibold">{value}/5</span>
                  </div>
                  <Slider
                    value={[value]}
                    onValueChange={(vals) =>
                      setValue(key as keyof ReviewFormData, vals[0] as any)
                    }
                    min={1}
                    max={5}
                    step={1}
                    className="w-full"
                  />
                </div>
              );
            })}
          </div>

          {/* Photo Upload */}
          <div className="space-y-3">
            <Label>Fotos hinzufügen (max. 5)</Label>
            <div className="flex flex-wrap gap-3">
              {photoPreviewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-lg border border-border"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {photos.length < 5 && (
                <label className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                  <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                  <span className="text-xs text-muted-foreground">Hochladen</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Abbrechen
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Bewertung veröffentlichen
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
