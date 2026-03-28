import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ServiceRatings {
  punctuality: number;
  professionalism: number;
  care: number;
  valueForMoney: number;
}

export const EnhancedReviewForm = ({ 
  companyId, 
  onSuccess 
}: { 
  companyId: string; 
  onSuccess?: () => void;
}) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [photosPreviews, setPhotosPreviews] = useState<string[]>([]);
  const [serviceRatings, setServiceRatings] = useState<ServiceRatings>({
    punctuality: 0,
    professionalism: 0,
    care: 0,
    valueForMoney: 0
  });
  const [submitting, setSubmitting] = useState(false);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > 5) {
      toast.error('Maximal 5 Fotos erlaubt');
      return;
    }

    setPhotos([...photos, ...files]);
    
    // Generate previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotosPreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
    setPhotosPreviews(photosPreviews.filter((_, i) => i !== index));
  };

  const uploadPhotos = async (reviewId: string) => {
    const uploadedUrls: string[] = [];
    
    for (const photo of photos) {
      const fileExt = photo.name.split('.').pop();
      const fileName = `${reviewId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('review-photos')
        .upload(filePath, photo);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('review-photos')
        .getPublicUrl(filePath);

      uploadedUrls.push(publicUrl);
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Bitte vergeben Sie eine Bewertung');
      return;
    }

    setSubmitting(true);
    try {
      // Create review
      const { data: review, error } = await supabase
        .from('reviews')
        .insert({
          company_id: companyId,
          user_id: '00000000-0000-0000-0000-000000000000', // Demo user
          rating,
          title,
          comment,
          service_ratings: serviceRatings as any,
          verified: true
        } as any)
        .select()
        .single();

      if (error) throw error;

      // Upload photos if any
      if (photos.length > 0) {
        const photoUrls = await uploadPhotos(review.id);
        
        // Update review with photo URLs
        await supabase
          .from('reviews')
          .update({ photos: photoUrls })
          .eq('id', review.id);
      }

      toast.success('Bewertung erfolgreich eingereicht!');
      
      // Reset form
      setRating(0);
      setTitle('');
      setComment('');
      setPhotos([]);
      setPhotosPreviews([]);
      setServiceRatings({ punctuality: 0, professionalism: 0, care: 0, valueForMoney: 0 });

      if (onSuccess) onSuccess();

    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Fehler beim Absenden der Bewertung');
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({ 
    value, 
    onChange, 
    label 
  }: { 
    value: number; 
    onChange: (val: number) => void; 
    label: string;
  }) => (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`h-6 w-6 ${
                star <= value
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bewertung abgeben</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Overall Rating */}
          <div className="space-y-2">
            <Label>Gesamtbewertung *</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-10 w-10 ${
                      star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Service Ratings */}
          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-medium">Detailbewertung</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StarRating
                value={serviceRatings.punctuality}
                onChange={(val) => setServiceRatings({...serviceRatings, punctuality: val})}
                label="Pünktlichkeit"
              />
              <StarRating
                value={serviceRatings.professionalism}
                onChange={(val) => setServiceRatings({...serviceRatings, professionalism: val})}
                label="Professionalität"
              />
              <StarRating
                value={serviceRatings.care}
                onChange={(val) => setServiceRatings({...serviceRatings, care: val})}
                label="Sorgfalt"
              />
              <StarRating
                value={serviceRatings.valueForMoney}
                onChange={(val) => setServiceRatings({...serviceRatings, valueForMoney: val})}
                label="Preis-Leistung"
              />
            </div>
          </div>

          {/* Title */}
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

          {/* Comment */}
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

          {/* Photo Upload */}
          <div className="space-y-2">
            <Label>Fotos (optional, max. 5)</Label>
            <div className="space-y-4">
              {photosPreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {photosPreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square">
                      <img 
                        src={preview} 
                        alt={`Preview ${index + 1}`} 
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {photos.length < 5 && (
                <label className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Fotos hochladen ({photos.length}/5)
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={submitting || rating === 0}
          >
            {submitting ? 'Wird gesendet...' : 'Bewertung absenden'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
