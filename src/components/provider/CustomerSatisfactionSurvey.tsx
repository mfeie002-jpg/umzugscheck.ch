import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, Star, ThumbsUp, ThumbsDown, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SurveyQuestion {
  id: string;
  question: string;
  type: 'rating' | 'yesno' | 'text';
}

const surveyQuestions: SurveyQuestion[] = [
  { id: 'q1', question: 'Wie zufrieden waren Sie mit der Pünktlichkeit?', type: 'rating' },
  { id: 'q2', question: 'Wie bewerten Sie die Freundlichkeit unseres Teams?', type: 'rating' },
  { id: 'q3', question: 'War der Umzug wie vereinbart?', type: 'yesno' },
  { id: 'q4', question: 'Würden Sie uns weiterempfehlen?', type: 'yesno' },
  { id: 'q5', question: 'Was können wir verbessern?', type: 'text' },
];

interface CustomerSatisfactionSurveyProps {
  customerName?: string;
  leadId?: string;
  onSubmit?: (responses: Record<string, any>) => void;
}

export const CustomerSatisfactionSurvey = ({
  customerName = 'Kunde',
  leadId,
  onSubmit,
}: CustomerSatisfactionSurveyProps) => {
  const { toast } = useToast();
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingChange = (questionId: string, rating: number) => {
    setResponses(prev => ({ ...prev, [questionId]: rating }));
  };

  const handleYesNoChange = (questionId: string, value: string) => {
    setResponses(prev => ({ ...prev, [questionId]: value === 'yes' }));
  };

  const handleTextChange = (questionId: string, text: string) => {
    setResponses(prev => ({ ...prev, [questionId]: text }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: 'Umfrage gesendet',
      description: 'Vielen Dank für Ihr Feedback!',
    });

    onSubmit?.(responses);
    setIsSubmitting(false);
  };

  const renderQuestion = (question: SurveyQuestion) => {
    switch (question.type) {
      case 'rating':
        return (
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(rating => (
              <button
                key={rating}
                onClick={() => handleRatingChange(question.id, rating)}
                className={`p-2 rounded-full transition-colors ${
                  responses[question.id] >= rating
                    ? 'text-yellow-500'
                    : 'text-muted-foreground hover:text-yellow-400'
                }`}
              >
                <Star
                  className={`h-6 w-6 ${responses[question.id] >= rating ? 'fill-current' : ''}`}
                />
              </button>
            ))}
          </div>
        );
      case 'yesno':
        return (
          <RadioGroup
            value={responses[question.id] === true ? 'yes' : responses[question.id] === false ? 'no' : ''}
            onValueChange={(value) => handleYesNoChange(question.id, value)}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id={`${question.id}-yes`} />
              <Label htmlFor={`${question.id}-yes`} className="flex items-center gap-1 cursor-pointer">
                <ThumbsUp className="h-4 w-4 text-green-600" />
                Ja
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id={`${question.id}-no`} />
              <Label htmlFor={`${question.id}-no`} className="flex items-center gap-1 cursor-pointer">
                <ThumbsDown className="h-4 w-4 text-red-600" />
                Nein
              </Label>
            </div>
          </RadioGroup>
        );
      case 'text':
        return (
          <Textarea
            value={responses[question.id] || ''}
            onChange={(e) => handleTextChange(question.id, e.target.value)}
            placeholder="Ihre Antwort..."
            rows={3}
          />
        );
      default:
        return null;
    }
  };

  const answeredCount = Object.keys(responses).filter(key => responses[key] !== undefined && responses[key] !== '').length;
  const progress = (answeredCount / surveyQuestions.length) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Kundenzufriedenheits-Umfrage
          </div>
          <Badge variant="secondary">
            {answeredCount}/{surveyQuestions.length} beantwortet
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-sm text-muted-foreground">
          Umfrage für: <span className="font-medium text-foreground">{customerName}</span>
        </div>

        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="space-y-6">
          {surveyQuestions.map((question, index) => (
            <div key={question.id} className="space-y-3">
              <Label className="text-base">
                {index + 1}. {question.question}
              </Label>
              {renderQuestion(question)}
            </div>
          ))}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || answeredCount < surveyQuestions.length - 1}
          className="w-full"
        >
          <Send className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Senden...' : 'Umfrage absenden'}
        </Button>
      </CardContent>
    </Card>
  );
};
