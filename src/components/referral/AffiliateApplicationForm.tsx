import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, Send, Check, Briefcase, Home, Shield, Landmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const partnerTypes = [
  { value: 'realtor', label: 'Immobilienmakler', icon: Home, description: 'Makler & Immobilienvermittler' },
  { value: 'property_manager', label: 'Hausverwaltung', icon: Building2, description: 'Liegenschaftsverwaltungen' },
  { value: 'insurance', label: 'Versicherung', icon: Shield, description: 'Versicherungsberater' },
  { value: 'bank', label: 'Bank/Finanz', icon: Landmark, description: 'Hypothekar- & Finanzberater' },
  { value: 'other', label: 'Andere', icon: Briefcase, description: 'Sonstige Partner' },
];

export function AffiliateApplicationForm() {
  const [formData, setFormData] = useState({
    company_name: '',
    contact_name: '',
    email: '',
    phone: '',
    partner_type: 'realtor',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.company_name || !formData.email) {
      toast({ title: 'Bitte alle Pflichtfelder ausfüllen', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      // Generate affiliate code
      const affiliateCode = `AFF-${formData.company_name.substring(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      const { error } = await supabase.from('affiliate_partners').insert({
        company_name: formData.company_name,
        contact_name: formData.contact_name || null,
        email: formData.email,
        phone: formData.phone || null,
        partner_type: formData.partner_type,
        affiliate_code: affiliateCode,
        status: 'pending',
      });

      if (error) {
        if (error.code === '23505') {
          toast({ title: 'Diese E-Mail ist bereits registriert', variant: 'destructive' });
          return;
        }
        throw error;
      }

      setIsSubmitted(true);
      toast({ title: 'Bewerbung erfolgreich eingereicht! 🎉' });
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({ title: 'Fehler beim Einreichen', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6"
            >
              <Check className="h-10 w-10" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-3">Bewerbung eingereicht!</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Vielen Dank für Ihr Interesse. Wir prüfen Ihre Bewerbung und melden uns 
              innerhalb von 2 Werktagen bei Ihnen.
            </p>
            <div className="bg-muted/50 rounded-lg p-4 inline-block">
              <p className="text-sm text-muted-foreground">Nächste Schritte:</p>
              <ul className="text-sm text-left mt-2 space-y-1">
                <li>✅ Bewerbung erhalten</li>
                <li>⏳ Prüfung durch unser Team</li>
                <li>📧 E-Mail mit Vertrag & Zugangsdaten</li>
              </ul>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Users className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Partner werden</CardTitle>
        <CardDescription>
          Verdienen Sie bis zu 10% Provision für jeden vermittelten Kunden
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Partner Type Selection */}
          <div className="space-y-3">
            <Label>Art des Unternehmens *</Label>
            <RadioGroup
              value={formData.partner_type}
              onValueChange={(value) => setFormData({ ...formData, partner_type: value })}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3"
            >
              {partnerTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Label
                    key={type.value}
                    htmlFor={type.value}
                    className={`
                      flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer
                      transition-all hover:border-primary/50
                      ${formData.partner_type === type.value 
                        ? 'border-primary bg-primary/5' 
                        : 'border-muted'}
                    `}
                  >
                    <RadioGroupItem value={type.value} id={type.value} className="sr-only" />
                    <Icon className={`h-6 w-6 mb-2 ${formData.partner_type === type.value ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-sm font-medium text-center">{type.label}</span>
                  </Label>
                );
              })}
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">Firmenname *</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                placeholder="Muster AG"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_name">Ansprechperson</Label>
              <Input
                id="contact_name"
                value={formData.contact_name}
                onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                placeholder="Max Muster"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="partner@firma.ch"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+41 44 123 45 67"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Nachricht (optional)</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Erzählen Sie uns mehr über Ihr Unternehmen und wie Sie sich die Zusammenarbeit vorstellen..."
              rows={4}
            />
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Ihre Vorteile als Partner:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ Bis zu 10% Provision pro vermitteltem Kunden</li>
              <li>✓ Persönlicher Affiliate-Link & Dashboard</li>
              <li>✓ Monatliche Auszahlungen</li>
              <li>✓ Marketing-Materialien & Support</li>
            </ul>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? (
              'Wird eingereicht...'
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Bewerbung einreichen
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Mit dem Einreichen akzeptieren Sie unsere Partner-AGB und Datenschutzbestimmungen.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
