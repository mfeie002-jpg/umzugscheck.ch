import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { trackConversion } from '@/lib/conversionTracker';

const CallbackForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    time: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Track form start on first input
  useEffect(() => {
    if (!hasStarted && (formData.name || formData.phone)) {
      setHasStarted(true);
      trackConversion('form_start', { form: 'callback' });
    }
  }, [formData.name, formData.phone, hasStarted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.time) {
      toast({ title: 'Bitte alle Felder ausfüllen', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setIsSubmitted(true);
    
    // Track form completion
    trackConversion('form_complete', { form: 'callback' });
    
    toast({
      title: 'Rückruf angefordert!',
      description: `Wir rufen Sie ${formData.time} zurück.`
    });
  };

  if (isSubmitted) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </motion.div>
          <h3 className="font-semibold text-lg mb-2">Rückruf angefordert!</h3>
          <p className="text-sm text-muted-foreground">
            Unser Team wird Sie zum gewünschten Zeitpunkt kontaktieren.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Phone className="w-5 h-5 text-primary" />
          Rückruf anfordern
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Wir rufen Sie kostenlos zurück!
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="callback-name">Ihr Name</Label>
            <Input
              id="callback-name"
              placeholder="Max Mustermann"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="callback-phone">Telefonnummer</Label>
            <Input
              id="callback-phone"
              type="tel"
              placeholder="+41 76 568 13 02"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Gewünschte Zeit</Label>
            <Select value={formData.time} onValueChange={(v) => setFormData({ ...formData, time: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Wann sollen wir anrufen?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="so schnell wie möglich">So schnell wie möglich</SelectItem>
                <SelectItem value="heute Vormittag">Heute Vormittag</SelectItem>
                <SelectItem value="heute Nachmittag">Heute Nachmittag</SelectItem>
                <SelectItem value="morgen Vormittag">Morgen Vormittag</SelectItem>
                <SelectItem value="morgen Nachmittag">Morgen Nachmittag</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Wird gesendet...
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 mr-2" />
                Rückruf anfordern
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CallbackForm;
