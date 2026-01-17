/**
 * PhotoReviewUpload - Step 7.7
 * Upload photos with reviews for social proof
 */
import { memo, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Upload,
  X,
  Star,
  CheckCircle,
  Image as ImageIcon,
  Loader2,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface PhotoReviewUploadProps {
  companyId?: string;
  companyName?: string;
  onSuccess?: () => void;
  className?: string;
}

const MAX_PHOTOS = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const PhotoReviewUpload = memo(function PhotoReviewUpload({
  companyId,
  companyName = 'Umzugsfirma',
  onSuccess,
  className,
}: PhotoReviewUploadProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate files
    const validFiles = files.filter((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`${file.name}: Nur JPG, PNG und WebP erlaubt`);
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name}: Max. 5MB erlaubt`);
        return false;
      }
      return true;
    });

    // Limit total photos
    const remainingSlots = MAX_PHOTOS - photos.length;
    const filesToAdd = validFiles.slice(0, remainingSlots);

    if (filesToAdd.length < validFiles.length) {
      toast.warning(`Max. ${MAX_PHOTOS} Fotos erlaubt`);
    }

    // Create previews
    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setPhotos((prev) => [...prev, ...filesToAdd]);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [photos.length]);

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Bitte geben Sie eine Bewertung ab');
      return;
    }

    if (!comment.trim()) {
      toast.error('Bitte schreiben Sie einen Kommentar');
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload photos to storage (if storage is configured)
      const photoUrls: string[] = [];
      
      for (const photo of photos) {
        const fileName = `review-${Date.now()}-${Math.random().toString(36).slice(2)}.${photo.name.split('.').pop()}`;
        
        // Try to upload to storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('review-photos')
          .upload(fileName, photo);

        if (!uploadError && uploadData) {
          const { data: urlData } = supabase.storage
            .from('review-photos')
            .getPublicUrl(fileName);
          
          if (urlData?.publicUrl) {
            photoUrls.push(urlData.publicUrl);
          }
        } else {
          console.log('Photo upload skipped (storage not configured):', uploadError);
        }
      }

      // Insert review
      const { error } = await supabase.from('reviews').insert({
        company_id: companyId || 'ffffffff-ffff-ffff-ffff-ffffffffffff',
        rating,
        title: comment.slice(0, 50),
        comment,
        photos: photoUrls,
        verified: false,
        helpful_count: 0,
      });

      if (error) throw error;

      setIsSuccess(true);
      toast.success('Vielen Dank für Ihre Bewertung!');
      onSuccess?.();

    } catch (error) {
      console.error('Failed to submit review:', error);
      toast.error('Fehler beim Speichern. Bitte versuchen Sie es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className={cn('', className)}>
        <CardContent className="py-12 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="w-8 h-8 text-green-600" />
          </motion.div>
          <h3 className="text-xl font-bold mb-2">Danke für Ihre Bewertung!</h3>
          <p className="text-muted-foreground">
            Ihre Bewertung hilft anderen bei der Entscheidung.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-swiss-gold" />
          Bewertung für {companyName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Star Rating */}
        <div>
          <Label className="mb-2 block">Ihre Bewertung *</Label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={cn(
                    'w-8 h-8 transition-colors',
                    (hoverRating || rating) >= star
                      ? 'text-swiss-gold fill-swiss-gold'
                      : 'text-muted-foreground'
                  )}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {rating === 5 && 'Ausgezeichnet!'}
              {rating === 4 && 'Sehr gut'}
              {rating === 3 && 'Gut'}
              {rating === 2 && 'Geht so'}
              {rating === 1 && 'Schlecht'}
            </p>
          )}
        </div>

        {/* Comment */}
        <div>
          <Label htmlFor="comment" className="mb-2 block">
            Ihr Erfahrungsbericht *
          </Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Beschreiben Sie Ihre Erfahrung mit dieser Umzugsfirma..."
            className="min-h-[120px]"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Min. 20 Zeichen • {comment.length} / 500
          </p>
        </div>

        {/* Photo Upload */}
        <div>
          <Label className="mb-2 block">
            <Camera className="w-4 h-4 inline mr-1" />
            Fotos hinzufügen (optional)
          </Label>
          <p className="text-xs text-muted-foreground mb-3">
            Max. {MAX_PHOTOS} Fotos, je max. 5MB (JPG, PNG, WebP)
          </p>

          {/* Photo Previews */}
          <div className="flex flex-wrap gap-3 mb-3">
            <AnimatePresence>
              {photoPreviews.map((preview, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative w-20 h-20 rounded-lg overflow-hidden group"
                >
                  <img
                    src={preview}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Add Photo Button */}
            {photos.length < MAX_PHOTOS && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-secondary hover:text-secondary transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span className="text-xs">Foto</span>
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_TYPES.join(',')}
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || rating === 0 || comment.length < 20}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Wird gesendet...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Bewertung absenden
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Mit dem Absenden stimmen Sie unseren Bewertungsrichtlinien zu.
        </p>
      </CardContent>
    </Card>
  );
});
