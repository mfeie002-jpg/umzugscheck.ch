/**
 * Partner Onboarding Form
 */

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Partner } from './types';

interface PartnerOnboardingProps {
  onSave: (partner: Omit<Partner, 'id' | 'createdAt' | 'acceptanceRate' | 'avgResponseMinutes' | 'closeRateEstimate' | 'disputeRate' | 'avgRevenuePerLead' | 'partnerROI'>) => void;
}

const CANTONS = [
  'Zürich', 'Bern', 'Luzern', 'Uri', 'Schwyz', 'Obwalden', 'Nidwalden',
  'Glarus', 'Zug', 'Freiburg', 'Solothurn', 'Basel-Stadt', 'Basel-Landschaft',
  'Schaffhausen', 'Appenzell AR', 'Appenzell IR', 'St. Gallen', 'Graubünden',
  'Aargau', 'Thurgau', 'Tessin', 'Waadt', 'Wallis', 'Neuenburg', 'Genf', 'Jura'
];

const SERVICES = [
  { id: 'moving', label: 'Umzug' },
  { id: 'packing', label: 'Verpackung' },
  { id: 'cleaning', label: 'Reinigung' },
  { id: 'storage', label: 'Lagerung' },
] as const;

export function PartnerOnboarding({ onSave }: PartnerOnboardingProps) {
  const [formData, setFormData] = useState({
    name: '',
    canton: '',
    services: [] as string[],
    priceTier: 'standard' as Partner['priceTier'],
    contractModel: 'cpl' as Partner['contractModel'],
    cplPrice: 40,
    commissionPercent: 15,
    maxLeadsPerWeek: 20,
    minRoomRequirement: 2,
    notes: '',
  });
  
  const handleServiceToggle = (serviceId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      services: checked 
        ? [...prev.services, serviceId]
        : prev.services.filter(s => s !== serviceId)
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSave({
      name: formData.name,
      canton: formData.canton,
      capacityStatus: 'open',
      services: formData.services as Partner['services'],
      priceTier: formData.priceTier,
      contractModel: formData.contractModel,
      cplPrice: formData.contractModel !== 'commission' ? formData.cplPrice : null,
      commissionPercent: formData.contractModel !== 'cpl' ? formData.commissionPercent : null,
      maxLeadsPerWeek: formData.maxLeadsPerWeek,
      minRoomRequirement: formData.minRoomRequirement,
      status: 'active',
      notes: formData.notes,
    });
    
    // Reset form
    setFormData({
      name: '',
      canton: '',
      services: [],
      priceTier: 'standard',
      contractModel: 'cpl',
      cplPrice: 40,
      commissionPercent: 15,
      maxLeadsPerWeek: 20,
      minRoomRequirement: 2,
      notes: '',
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Partner hinzufügen
        </CardTitle>
        <CardDescription>Neuen Partner ins Netzwerk aufnehmen</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Firmenname</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="canton">Kanton</Label>
              <Select
                value={formData.canton}
                onValueChange={(value) => setFormData(prev => ({ ...prev, canton: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kanton wählen" />
                </SelectTrigger>
                <SelectContent>
                  {CANTONS.map(canton => (
                    <SelectItem key={canton} value={canton}>{canton}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label className="mb-2 block">Services</Label>
            <div className="flex flex-wrap gap-4">
              {SERVICES.map(service => (
                <div key={service.id} className="flex items-center gap-2">
                  <Checkbox
                    id={service.id}
                    checked={formData.services.includes(service.id)}
                    onCheckedChange={(checked) => handleServiceToggle(service.id, !!checked)}
                  />
                  <Label htmlFor={service.id} className="font-normal">{service.label}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-2 block">Preis-Tier</Label>
              <RadioGroup
                value={formData.priceTier}
                onValueChange={(value) => setFormData(prev => ({ ...prev, priceTier: value as Partner['priceTier'] }))}
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="budget" id="budget" />
                  <Label htmlFor="budget" className="font-normal">Budget</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard" className="font-normal">Standard</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="premium" id="premium" />
                  <Label htmlFor="premium" className="font-normal">Premium</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label className="mb-2 block">Vertragsmodell</Label>
              <RadioGroup
                value={formData.contractModel}
                onValueChange={(value) => setFormData(prev => ({ ...prev, contractModel: value as Partner['contractModel'] }))}
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="cpl" id="cpl" />
                  <Label htmlFor="cpl" className="font-normal">CPL</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="commission" id="commission" />
                  <Label htmlFor="commission" className="font-normal">Kommission</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="hybrid" id="hybrid" />
                  <Label htmlFor="hybrid" className="font-normal">Hybrid</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4">
            {formData.contractModel !== 'commission' && (
              <div>
                <Label htmlFor="cplPrice">CPL Preis (CHF)</Label>
                <Input
                  id="cplPrice"
                  type="number"
                  value={formData.cplPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, cplPrice: parseInt(e.target.value) || 0 }))}
                />
              </div>
            )}
            {formData.contractModel !== 'cpl' && (
              <div>
                <Label htmlFor="commissionPercent">Kommission (%)</Label>
                <Input
                  id="commissionPercent"
                  type="number"
                  value={formData.commissionPercent}
                  onChange={(e) => setFormData(prev => ({ ...prev, commissionPercent: parseInt(e.target.value) || 0 }))}
                />
              </div>
            )}
            <div>
              <Label htmlFor="maxLeads">Max Leads/Woche</Label>
              <Input
                id="maxLeads"
                type="number"
                value={formData.maxLeadsPerWeek}
                onChange={(e) => setFormData(prev => ({ ...prev, maxLeadsPerWeek: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div>
              <Label htmlFor="minRooms">Min. Zimmer</Label>
              <Input
                id="minRooms"
                type="number"
                step="0.5"
                value={formData.minRoomRequirement}
                onChange={(e) => setFormData(prev => ({ ...prev, minRoomRequirement: parseFloat(e.target.value) || 0 }))}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="notes">Notizen</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Besondere Vereinbarungen, Kontaktperson, etc."
            />
          </div>
          
          <Button type="submit" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Partner hinzufügen
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
