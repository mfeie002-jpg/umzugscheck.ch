import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Zap, Clock, FileText, Send, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuoteTemplate {
  id: string;
  name: string;
  priceFormula: string;
  message: string;
  validDays: number;
}

const defaultTemplates: QuoteTemplate[] = [
  {
    id: '1',
    name: 'Standard Umzug',
    priceFormula: 'base + (rooms * 150) + (distance * 2)',
    message: 'Vielen Dank für Ihre Anfrage! Basierend auf Ihren Angaben können wir Ihnen folgendes Angebot unterbreiten:\n\n{price} CHF inkl. MwSt.\n\nInbegriffen:\n- Professionelles Umzugsteam\n- Umzugsfahrzeug\n- Verpackungsmaterial\n- Versicherung\n\nDas Angebot ist {validDays} Tage gültig.',
    validDays: 14,
  },
  {
    id: '2',
    name: 'Express Umzug',
    priceFormula: 'base * 1.3 + (rooms * 200) + (distance * 3)',
    message: 'Express-Angebot für Ihren kurzfristigen Umzug:\n\n{price} CHF inkl. MwSt.\n\nUnser Express-Service beinhaltet:\n- Bevorzugte Terminplanung\n- Erweitertes Team für schnellere Abwicklung\n- Premium Verpackungsmaterial\n- Vollkasko-Versicherung\n\nGültigkeit: {validDays} Tage',
    validDays: 7,
  },
  {
    id: '3',
    name: 'Budget Umzug',
    priceFormula: 'base * 0.8 + (rooms * 100) + (distance * 1.5)',
    message: 'Unser Budget-Angebot für Ihren Umzug:\n\n{price} CHF inkl. MwSt.\n\nLeistungen:\n- Erfahrenes Umzugsteam\n- Umzugsfahrzeug\n- Basis-Versicherung\n\nSelbstbeteiligung bei Verpackung möglich für weitere Ersparnis.\n\nAngebot gültig: {validDays} Tage',
    validDays: 21,
  },
];

interface QuickQuoteResponseProps {
  leadId?: string;
  customerName?: string;
  rooms?: number;
  distance?: number;
  onQuoteSent?: (quote: { price: number; message: string }) => void;
}

export const QuickQuoteResponse = ({
  leadId,
  customerName = 'Kunde',
  rooms = 3,
  distance = 20,
  onQuoteSent,
}: QuickQuoteResponseProps) => {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customPrice, setCustomPrice] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [validDays, setValidDays] = useState<number>(14);
  const [isSending, setIsSending] = useState(false);

  const calculatePrice = (template: QuoteTemplate): number => {
    const base = 500;
    // Simple formula evaluation
    let price = base + (rooms * 150) + (distance * 2);
    
    if (template.id === '2') {
      price = base * 1.3 + (rooms * 200) + (distance * 3);
    } else if (template.id === '3') {
      price = base * 0.8 + (rooms * 100) + (distance * 1.5);
    }
    
    return Math.round(price);
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = defaultTemplates.find(t => t.id === templateId);
    if (template) {
      const price = calculatePrice(template);
      setCustomPrice(price.toString());
      setCustomMessage(
        template.message
          .replace('{price}', price.toString())
          .replace('{validDays}', template.validDays.toString())
      );
      setValidDays(template.validDays);
    }
  };

  const handleSendQuote = async () => {
    if (!customPrice || !customMessage) {
      toast({
        title: 'Fehler',
        description: 'Bitte füllen Sie alle Felder aus.',
        variant: 'destructive',
      });
      return;
    }

    setIsSending(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: 'Angebot gesendet',
      description: `Ihr Angebot wurde erfolgreich an ${customerName} gesendet.`,
    });

    onQuoteSent?.({ price: parseFloat(customPrice), message: customMessage });
    setIsSending(false);
  };

  const handleSaveAsTemplate = () => {
    toast({
      title: 'Vorlage gespeichert',
      description: 'Ihre benutzerdefinierte Vorlage wurde gespeichert.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          Schnellangebot erstellen
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Zimmer</p>
            <p className="text-2xl font-bold">{rooms}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Distanz</p>
            <p className="text-2xl font-bold">{distance} km</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Kunde</p>
            <p className="text-lg font-medium truncate">{customerName}</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Vorlage wählen</Label>
          <div className="grid grid-cols-3 gap-2">
            {defaultTemplates.map(template => (
              <Button
                key={template.id}
                variant={selectedTemplate === template.id ? 'default' : 'outline'}
                className="h-auto py-3 flex flex-col"
                onClick={() => handleTemplateSelect(template.id)}
              >
                <span className="font-medium">{template.name}</span>
                <Badge variant="secondary" className="mt-1">
                  ~{calculatePrice(template)} CHF
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Preis (CHF)</Label>
            <Input
              id="price"
              type="number"
              value={customPrice}
              onChange={(e) => setCustomPrice(e.target.value)}
              placeholder="z.B. 1200"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="validDays">Gültigkeit (Tage)</Label>
            <Select value={validDays.toString()} onValueChange={(v) => setValidDays(parseInt(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 Tage</SelectItem>
                <SelectItem value="14">14 Tage</SelectItem>
                <SelectItem value="21">21 Tage</SelectItem>
                <SelectItem value="30">30 Tage</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Angebotsnachricht</Label>
          <Textarea
            id="message"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            rows={8}
            placeholder="Ihre Angebotsnachricht..."
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveAsTemplate} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            Als Vorlage speichern
          </Button>
          <Button onClick={handleSendQuote} disabled={isSending} className="flex-1">
            <Send className="h-4 w-4 mr-2" />
            {isSending ? 'Senden...' : 'Angebot senden'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
