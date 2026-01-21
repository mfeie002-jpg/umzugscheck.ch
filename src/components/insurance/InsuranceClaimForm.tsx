/**
 * Insurance Claim Form Component
 * For filing damage claims with photo evidence
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Camera, 
  Upload, 
  AlertTriangle,
  FileText,
  Plus,
  Trash2,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ClaimItem, InsuredItem, ITEM_CATEGORY_LABELS, estimateClaimProcessingDays } from '@/lib/micro-insurance';

interface InsuranceClaimFormProps {
  policyId: string;
  insuredItems: InsuredItem[];
  onSubmit?: (claim: {
    items: Omit<ClaimItem, 'approvedAmountCHF'>[];
    description: string;
    evidencePhotos: File[];
  }) => void;
}

interface ClaimItemForm {
  insuredItemId: string;
  damageType: ClaimItem['damageType'];
  damageDescription: string;
  claimedAmountCHF: number;
}

export function InsuranceClaimForm({ policyId, insuredItems, onSubmit }: InsuranceClaimFormProps) {
  const [claimItems, setClaimItems] = useState<ClaimItemForm[]>([]);
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const addClaimItem = () => {
    setClaimItems(prev => [...prev, {
      insuredItemId: '',
      damageType: 'broken',
      damageDescription: '',
      claimedAmountCHF: 0
    }]);
  };

  const updateClaimItem = (index: number, updates: Partial<ClaimItemForm>) => {
    setClaimItems(prev => prev.map((item, i) => 
      i === index ? { ...item, ...updates } : item
    ));
  };

  const removeClaimItem = (index: number) => {
    setClaimItems(prev => prev.filter((_, i) => i !== index));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const totalClaimAmount = claimItems.reduce((sum, item) => sum + item.claimedAmountCHF, 0);
  
  const estimatedDays = estimateClaimProcessingDays({
    hasVideoEvidence: true, // We have inventory video
    hasBeforePhotos: true,
    itemCount: claimItems.length,
    totalAmount: totalClaimAmount
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onSubmit?.({
        items: claimItems.map(item => ({
          insuredItemId: item.insuredItemId,
          itemName: insuredItems.find(i => i.id === item.insuredItemId)?.name || '',
          damageType: item.damageType,
          damageDescription: item.damageDescription,
          claimedAmountCHF: item.claimedAmountCHF
        })),
        description,
        evidencePhotos: photos
      });
      
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="border-emerald-200 bg-emerald-50">
        <CardContent className="p-8 text-center">
          <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-emerald-800">Schaden gemeldet!</h3>
          <p className="text-emerald-700 mt-2">
            Ihre Schadensmeldung wurde eingereicht. Wir melden uns innerhalb von {estimatedDays} Werktagen.
          </p>
          <Badge variant="outline" className="mt-4">
            Geschätzte Bearbeitungszeit: {estimatedDays} Tage
          </Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-100">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <CardTitle>Schaden melden</CardTitle>
            <CardDescription>
              Police #{policyId.slice(0, 8)}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Damaged Items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Beschädigte Gegenstände</Label>
            <Button variant="outline" size="sm" onClick={addClaimItem}>
              <Plus className="h-4 w-4 mr-1" />
              Hinzufügen
            </Button>
          </div>

          {claimItems.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Fügen Sie beschädigte Gegenstände hinzu
              </p>
              <Button variant="link" size="sm" onClick={addClaimItem}>
                Ersten Gegenstand hinzufügen
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {claimItems.map((item, index) => (
                <Card key={index} className="p-4">
                  <div className="grid gap-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs">Gegenstand</Label>
                          <Select
                            value={item.insuredItemId}
                            onValueChange={(v) => updateClaimItem(index, { insuredItemId: v })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Wählen..." />
                            </SelectTrigger>
                            <SelectContent>
                              {insuredItems.map(insuredItem => (
                                <SelectItem key={insuredItem.id} value={insuredItem.id}>
                                  {insuredItem.name} ({ITEM_CATEGORY_LABELS[insuredItem.category]})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label className="text-xs">Schadensart</Label>
                          <Select
                            value={item.damageType}
                            onValueChange={(v) => updateClaimItem(index, { damageType: v as ClaimItem['damageType'] })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="scratched">Verkratzt</SelectItem>
                              <SelectItem value="broken">Zerbrochen</SelectItem>
                              <SelectItem value="lost">Verloren</SelectItem>
                              <SelectItem value="water_damage">Wasserschaden</SelectItem>
                              <SelectItem value="other">Sonstiges</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-destructive"
                        onClick={() => removeClaimItem(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div>
                      <Label className="text-xs">Beschreibung des Schadens</Label>
                      <Textarea
                        value={item.damageDescription}
                        onChange={(e) => updateClaimItem(index, { damageDescription: e.target.value })}
                        placeholder="Beschreiben Sie den Schaden..."
                        rows={2}
                      />
                    </div>
                    
                    <div className="w-40">
                      <Label className="text-xs">Schadensbetrag (CHF)</Label>
                      <Input
                        type="number"
                        value={item.claimedAmountCHF || ''}
                        onChange={(e) => updateClaimItem(index, { claimedAmountCHF: Number(e.target.value) })}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Photo Evidence */}
        <div className="space-y-2">
          <Label>Foto-Beweise</Label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {photos.map((photo, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                <img 
                  src={URL.createObjectURL(photo)} 
                  alt={`Evidence ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6"
                  onClick={() => removePhoto(index)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
            
            <label className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
              <Camera className="h-6 w-6 text-muted-foreground" />
              <span className="text-xs text-muted-foreground mt-1">Foto</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </label>
          </div>
          <p className="text-xs text-muted-foreground">
            💡 Tipp: Wir vergleichen mit Ihrem Inventar-Video für schnellere Bearbeitung
          </p>
        </div>

        {/* General Description */}
        <div className="space-y-2">
          <Label>Allgemeine Beschreibung</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Beschreiben Sie, was passiert ist..."
            rows={3}
          />
        </div>

        {/* Summary */}
        {claimItems.length > 0 && (
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-muted-foreground">Gesamtbetrag</div>
                  <div className="text-2xl font-bold">CHF {totalClaimAmount.toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Geschätzte Bearbeitung</div>
                  <Badge variant="outline">{estimatedDays} Werktage</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit */}
        <Button 
          className="w-full" 
          size="lg"
          disabled={claimItems.length === 0 || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Wird eingereicht...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Schaden melden
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

export default InsuranceClaimForm;
