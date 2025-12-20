import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Mail, User, Loader2, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AnalysisFormProps {
  onSuccess?: (token: string) => void;
  className?: string;
  variant?: 'default' | 'hero' | 'compact';
}

export function AnalysisRequestForm({ onSuccess, className, variant = 'default' }: AnalysisFormProps) {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    website_url: '',
    email: '',
    name: '',
    consent: false,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // URL validation
    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
    if (!formData.website_url || !urlPattern.test(formData.website_url)) {
      newErrors.website_url = 'Bitte gib eine gültige Website-URL ein';
    }
    
    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailPattern.test(formData.email)) {
      newErrors.email = 'Bitte gib eine gültige E-Mail-Adresse ein';
    }
    
    // Name validation
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Bitte gib deinen Namen ein';
    }
    
    // Consent validation
    if (!formData.consent) {
      newErrors.consent = 'Bitte stimme den Bedingungen zu';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsGenerating(true);
    
    try {
      // Format URL if needed
      let websiteUrl = formData.website_url.trim();
      if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
        websiteUrl = `https://${websiteUrl}`;
      }
      
      toast.info('KI analysiert deine Website...', {
        description: 'Dies kann 20-30 Sekunden dauern.',
        duration: 30000,
      });

      const { data, error } = await supabase.functions.invoke('generate-analysis-report', {
        body: { 
          websiteUrl,
          // We could add leadId here if we create a lead first
        }
      });
      
      if (error) {
        console.error('Generation error:', error);
        throw new Error(error.message || 'Analyse fehlgeschlagen');
      }
      
      if (data?.error) {
        if (data.error.includes('Rate limit')) {
          toast.error('Zu viele Anfragen', {
            description: 'Bitte versuche es in ein paar Minuten erneut.',
          });
        } else if (data.error.includes('credits')) {
          toast.error('Service vorübergehend nicht verfügbar', {
            description: 'Bitte versuche es später erneut.',
          });
        } else {
          throw new Error(data.error);
        }
        return;
      }
      
      if (data?.success && data?.token) {
        toast.success('Analyse abgeschlossen!');
        setSubmitted(true);
        onSuccess?.(data.token);
        
        // Navigate to report
        setTimeout(() => {
          navigate(`/analyse/${data.token}`);
        }, 500);
      } else {
        throw new Error('Keine Analyse-Daten erhalten');
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Analyse fehlgeschlagen', {
        description: err instanceof Error ? err.message : 'Bitte versuche es erneut',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (submitted) {
    return (
      <Card className={cn("text-center", className)}>
        <CardContent className="pt-6 space-y-4">
          <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
          <h3 className="text-xl font-semibold">Analyse wird geladen...</h3>
          <p className="text-muted-foreground">
            Du wirst gleich zum Report weitergeleitet.
          </p>
          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
        </CardContent>
      </Card>
    );
  }

  const isHero = variant === 'hero';
  const isCompact = variant === 'compact';

  return (
    <Card className={cn(
      "overflow-hidden",
      isHero && "border-primary/20 shadow-xl",
      className
    )}>
      {!isCompact && (
        <CardHeader className={cn(
          "text-center",
          isHero && "bg-gradient-to-r from-primary/10 to-primary/5"
        )}>
          <Badge className="w-fit mx-auto mb-2 bg-green-500">
            <Sparkles className="h-3 w-3 mr-1" />
            100% Kostenlos
          </Badge>
          <CardTitle className="text-2xl">
            Starte deine Gratis-Analyse
          </CardTitle>
          <CardDescription>
            KI-gestützte Website-Analyse in 30 Sekunden
          </CardDescription>
        </CardHeader>
      )}
      
      <CardContent className={cn("pt-6", isCompact && "pt-4")}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Website URL */}
          <div className="space-y-2">
            <Label htmlFor="website_url">
              Deine Website-URL
            </Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="website_url"
                type="text"
                placeholder="https://deine-website.ch"
                value={formData.website_url}
                onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                className={cn(
                  "pl-10",
                  errors.website_url && "border-destructive"
                )}
                disabled={isGenerating}
              />
            </div>
            {errors.website_url && (
              <p className="text-sm text-destructive">{errors.website_url}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              E-Mail-Adresse
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="deine@email.ch"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={cn(
                  "pl-10",
                  errors.email && "border-destructive"
                )}
                disabled={isGenerating}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Dein Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="Max Mustermann"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={cn(
                  "pl-10",
                  errors.name && "border-destructive"
                )}
                disabled={isGenerating}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Consent */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="consent"
              checked={formData.consent}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, consent: !!checked }))}
              className={cn(
                errors.consent && "border-destructive"
              )}
              disabled={isGenerating}
            />
            <label
              htmlFor="consent"
              className="text-sm text-muted-foreground leading-tight cursor-pointer"
            >
              Ich stimme zu, die Analyse-Ergebnisse zu erhalten und akzeptiere die Datenschutzrichtlinien.
            </label>
          </div>
          {errors.consent && (
            <p className="text-sm text-destructive">{errors.consent}</p>
          )}

          {/* Submit */}
          <Button 
            type="submit" 
            size="lg" 
            className="w-full" 
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                KI analysiert...
              </>
            ) : (
              <>
                Gratis-Analyse starten
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground pt-2">
            <span className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              Keine Kreditkarte nötig
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              Sofortiges Ergebnis
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              Powered by AI
            </span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default AnalysisRequestForm;
