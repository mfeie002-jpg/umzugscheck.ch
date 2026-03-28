import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, ThumbsUp, MessageSquare, CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import RatingStars from '@/components/RatingStars';

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  verified: boolean;
}

const existingReviews: Review[] = [
  { id: '1', name: 'Maria S.', rating: 5, comment: 'Absolut professionell! Das Team war pünktlich, freundlich und hat alles mit grösster Sorgfalt behandelt.', date: '2024-11-15', helpful: 12, verified: true },
  { id: '2', name: 'Thomas K.', rating: 5, comment: 'Bester Umzugsservice in Zürich. Faire Preise und erstklassige Arbeit.', date: '2024-11-10', helpful: 8, verified: true },
  { id: '3', name: 'Sandra B.', rating: 4, comment: 'Sehr zufrieden mit dem Service. Kleine Verzögerung, aber sonst perfekt.', date: '2024-11-05', helpful: 5, verified: true },
  { id: '4', name: 'Peter M.', rating: 5, comment: 'Zum dritten Mal bei diesem Unternehmen - immer wieder begeistert!', date: '2024-10-28', helpful: 15, verified: true },
];

const CustomerReviewSystem = () => {
  const [reviews, setReviews] = useState<Review[]>(existingReviews);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  const handleSubmit = () => {
    if (!name || !comment || rating === 0) {
      toast({ title: 'Bitte alle Felder ausfüllen', variant: 'destructive' });
      return;
    }

    const newReview: Review = {
      id: Date.now().toString(),
      name,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
      helpful: 0,
      verified: false
    };

    setReviews([newReview, ...reviews]);
    setSubmitted(true);
    setShowForm(false);
    setName('');
    setComment('');
    setRating(0);
    
    toast({ title: 'Vielen Dank!', description: 'Ihre Bewertung wurde eingereicht.' });
  };

  const markHelpful = (id: string) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, helpful: r.helpful + 1 } : r));
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Kundenbewertungen
          </CardTitle>
          <Button onClick={() => setShowForm(!showForm)} variant="outline" size="sm">
            Bewertung schreiben
          </Button>
        </div>
        
        {/* Rating Summary */}
        <div className="flex items-center gap-4 pt-2">
          <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
          <div>
            <RatingStars rating={Math.round(averageRating)} readonly size="md" />
            <p className="text-sm text-muted-foreground mt-1">{reviews.length} Bewertungen</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Review Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 rounded-lg border bg-muted/30 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Ihre Bewertung</label>
                  <RatingStars rating={rating} onChange={setRating} size="lg" />
                </div>
                <Input
                  placeholder="Ihr Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Textarea
                  placeholder="Ihre Erfahrung mit Feierabend Umzüge..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                />
                <Button onClick={handleSubmit} className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Bewertung absenden
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reviews List */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-lg border bg-card"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{review.name}</span>
                    {review.verified && (
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Verifiziert
                      </Badge>
                    )}
                  </div>
                  <RatingStars rating={review.rating} readonly size="sm" className="mt-1" />
                </div>
                <span className="text-xs text-muted-foreground">{review.date}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
              <button
                onClick={() => markHelpful(review.id)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <ThumbsUp className="w-3 h-3" />
                Hilfreich ({review.helpful})
              </button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerReviewSystem;
