/**
 * Partner Offering Workflow
 */

import { useState } from 'react';
import { Send, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { IncomingLead, OfferConfig } from './types';

interface PartnerOfferingProps {
  selectedLead: IncomingLead | null;
  onSendOffer: (config: OfferConfig) => void;
}

type OfferStep = 'offered' | 'pending' | 'accepted' | 'rejected' | 'sold';

const STEP_CONFIG: Record<OfferStep, { label: string; icon: React.ReactNode; className: string }> = {
  offered: { label: 'Angeboten', icon: <Send className="h-4 w-4" />, className: 'text-blue-600' },
  pending: { label: 'Pending', icon: <Clock className="h-4 w-4" />, className: 'text-yellow-600' },
  accepted: { label: 'Akzeptiert', icon: <CheckCircle className="h-4 w-4" />, className: 'text-green-600' },
  rejected: { label: 'Abgelehnt', icon: <XCircle className="h-4 w-4" />, className: 'text-red-600' },
  sold: { label: 'Verkauft', icon: <CheckCircle className="h-4 w-4" />, className: 'text-emerald-600' },
};

export function PartnerOffering({ selectedLead, onSendOffer }: PartnerOfferingProps) {
  const [maxPartners, setMaxPartners] = useState(3);
  const [selectionLogic, setSelectionLogic] = useState<'same_canton' | 'neighboring_canton' | 'national'>('same_canton');
  const [slaMinutes, setSlaMinutes] = useState(15);
  
  // Mock timeline for demo
  const [mockStep] = useState<OfferStep>('offered');
  
  const handleSendOffer = () => {
    if (!selectedLead) return;
    onSendOffer({
      leadId: selectedLead.id,
      maxPartners,
      selectionLogic,
      slaMinutes,
    });
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Send className="h-5 w-5" />
          Partner Offering
        </CardTitle>
        <CardDescription>Lead an Partner anbieten (Tier 2 + Overflow)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {!selectedLead ? (
          <div className="p-8 text-center text-muted-foreground">
            Wähle einen Lead aus der Inbox um fortzufahren
          </div>
        ) : (
          <>
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm">Ausgewählt:</span>
                <span className="font-mono text-sm">{selectedLead.id.slice(0, 8)}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm">Tier:</span>
                <Badge>{selectedLead.tier}</Badge>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="maxPartners">Max Partner</Label>
                <Input
                  id="maxPartners"
                  type="number"
                  min={1}
                  max={5}
                  value={maxPartners}
                  onChange={(e) => setMaxPartners(parseInt(e.target.value) || 3)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedLead.tier === 2 ? 'Standard: 3' : selectedLead.tier === 3 ? 'Budget: 1' : 'Premium: Auction'}
                </p>
              </div>
              
              <div>
                <Label htmlFor="logic">Partner-Auswahl</Label>
                <Select value={selectionLogic} onValueChange={(v) => setSelectionLogic(v as typeof selectionLogic)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="same_canton">Gleicher Kanton</SelectItem>
                    <SelectItem value="neighboring_canton">Nachbar-Kanton Fallback</SelectItem>
                    <SelectItem value="national">National Fallback</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="sla">SLA (Minuten)</Label>
                <Input
                  id="sla"
                  type="number"
                  min={5}
                  max={60}
                  value={slaMinutes}
                  onChange={(e) => setSlaMinutes(parseInt(e.target.value) || 15)}
                />
                <p className="text-xs text-muted-foreground mt-1">Standard: 15 min</p>
              </div>
            </div>
            
            {/* Offer Rules by Tier */}
            <div className="p-3 bg-muted rounded-lg text-sm">
              <strong>Tier {selectedLead.tier} Regeln:</strong>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                {selectedLead.tier === 2 && (
                  <>
                    <li>• Angebot an max {maxPartners} Partner</li>
                    <li>• Keine Antwort in SLA → nächster Partner</li>
                    <li>• Alle abgelehnt → Budget Partner oder unsold</li>
                  </>
                )}
                {selectedLead.tier === 3 && (
                  <>
                    <li>• Auto-Send an Budget Partner (CHF 15 flat)</li>
                    <li>• ODER Auto-Reject</li>
                  </>
                )}
                {selectedLead.tier === 1 && (
                  <>
                    <li>• Premium Auction modus</li>
                    <li>• Reserve Price beachten</li>
                  </>
                )}
              </ul>
            </div>
            
            {/* Timeline Status */}
            <div className="p-3 border rounded-lg">
              <Label className="text-xs text-muted-foreground">Offer Timeline</Label>
              <div className="flex items-center gap-2 mt-2">
                {(['offered', 'pending', 'accepted', 'sold'] as OfferStep[]).map((step, i) => (
                  <div key={step} className="flex items-center">
                    <div className={`flex items-center gap-1 ${
                      mockStep === step ? STEP_CONFIG[step].className + ' font-medium' : 'text-muted-foreground'
                    }`}>
                      {STEP_CONFIG[step].icon}
                      <span className="text-xs">{STEP_CONFIG[step].label}</span>
                    </div>
                    {i < 3 && <span className="mx-2 text-muted-foreground">→</span>}
                  </div>
                ))}
              </div>
            </div>
            
            <Button onClick={handleSendOffer} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Offer senden
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
