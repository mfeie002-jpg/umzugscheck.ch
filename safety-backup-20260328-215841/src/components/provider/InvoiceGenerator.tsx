import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, Plus, Trash2, Download, Send, Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface InvoiceGeneratorProps {
  customerName?: string;
  customerEmail?: string;
  leadId?: string;
}

export const InvoiceGenerator = ({
  customerName = '',
  customerEmail = '',
  leadId,
}: InvoiceGeneratorProps) => {
  const { toast } = useToast();
  const [customer, setCustomer] = useState({ name: customerName, email: customerEmail });
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'Umzugsservice (3 Zimmer)', quantity: 1, unitPrice: 1200 },
    { id: '2', description: 'Verpackungsmaterial', quantity: 1, unitPrice: 150 },
  ]);
  const [notes, setNotes] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('30');
  const [isGenerating, setIsGenerating] = useState(false);

  const addItem = () => {
    setItems(prev => [
      ...prev,
      { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0 },
    ]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const vat = subtotal * 0.081; // Swiss VAT 8.1%
  const total = subtotal + vat;

  const generateInvoice = async () => {
    if (!customer.name || !customer.email) {
      toast({
        title: 'Fehler',
        description: 'Bitte füllen Sie die Kundendaten aus.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate PDF generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: 'Rechnung erstellt',
      description: 'Die Rechnung wurde erfolgreich generiert.',
    });

    setIsGenerating(false);
  };

  const sendInvoice = async () => {
    if (!customer.email) {
      toast({
        title: 'Fehler',
        description: 'Bitte geben Sie eine E-Mail-Adresse ein.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: 'Rechnung gesendet',
      description: `Die Rechnung wurde an ${customer.email} gesendet.`,
    });

    setIsGenerating(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Rechnung erstellen
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Invoice Header */}
        <div className="flex justify-between items-start p-4 bg-muted rounded-lg">
          <div>
            <h3 className="font-bold text-lg">RECHNUNG</h3>
            <p className="text-sm text-muted-foreground">
              Nr. INV-{format(new Date(), 'yyyyMMdd')}-{Math.floor(Math.random() * 1000)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm">Datum: {format(new Date(), 'dd.MM.yyyy')}</p>
            <p className="text-sm text-muted-foreground">
              Fällig: {format(new Date(Date.now() + parseInt(paymentTerms) * 24 * 60 * 60 * 1000), 'dd.MM.yyyy')}
            </p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Kundenname</Label>
            <Input
              value={customer.name}
              onChange={(e) => setCustomer(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Max Müller"
            />
          </div>
          <div className="space-y-2">
            <Label>E-Mail</Label>
            <Input
              type="email"
              value={customer.email}
              onChange={(e) => setCustomer(prev => ({ ...prev, email: e.target.value }))}
              placeholder="max@example.com"
            />
          </div>
        </div>

        <Separator />

        {/* Line Items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Positionen</Label>
            <Button variant="outline" size="sm" onClick={addItem}>
              <Plus className="h-4 w-4 mr-1" />
              Position hinzufügen
            </Button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-5">
                  <Input
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    placeholder="Beschreibung"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                    placeholder="Menge"
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                    placeholder="Preis"
                  />
                </div>
                <div className="col-span-1 text-right font-medium">
                  {(item.quantity * item.unitPrice).toFixed(2)}
                </div>
                <div className="col-span-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    disabled={items.length === 1}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Totals */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Zwischensumme</span>
            <span>CHF {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>MwSt. (8.1%)</span>
            <span>CHF {vat.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>CHF {total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Terms */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Zahlungsfrist</Label>
            <Select value={paymentTerms} onValueChange={setPaymentTerms}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 Tage</SelectItem>
                <SelectItem value="14">14 Tage</SelectItem>
                <SelectItem value="30">30 Tage</SelectItem>
                <SelectItem value="60">60 Tage</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label>Bemerkungen</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Zusätzliche Informationen..."
            rows={3}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={generateInvoice} disabled={isGenerating} className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            PDF herunterladen
          </Button>
          <Button onClick={sendInvoice} disabled={isGenerating} className="flex-1">
            <Send className="h-4 w-4 mr-2" />
            Per E-Mail senden
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
