/**
 * Phase 6: Swiss Handover Protocol
 * 
 * Swiss-standard apartment handover with room-specific photo documentation,
 * digital signatures, Lebensdauer damage calculation, and status tracking.
 * Aligned with Swiss rental law requirements for "Wohnungsabgabe".
 */

import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardCheck,
  Camera,
  CheckCircle2,
  Circle,
  AlertCircle,
  PenTool,
  Home,
  Key,
  Droplets,
  Zap,
  Trash2,
  ThermometerSun,
  Upload,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Award,
  Calculator,
  Plus,
  Minus,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { LebensdauerCalculator } from './LebensdauerCalculator';
import type { DamageAssessment } from '@/lib/relo-os/swiss-integration/lebensdauer';

export interface HandoverRoom {
  id: string;
  name: string;
  type: 'room' | 'bathroom' | 'kitchen' | 'storage' | 'balcony' | 'other';
  status: 'pending' | 'in_progress' | 'approved' | 'issues';
  photos: string[];
  notes: string;
  checklistItems: {
    id: string;
    label: string;
    checked: boolean;
  }[];
}

export interface HandoverCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'pending' | 'approved' | 'issues';
  items: {
    id: string;
    label: string;
    checked: boolean;
    required: boolean;
    notes?: string;
  }[];
}

export interface HandoverProtocolProps {
  moveProjectId: string;
  propertyAddress: string;
  landlordName?: string;
  tenantName: string;
  handoverDate: string;
  rooms: HandoverRoom[];
  categories: HandoverCategory[];
  signatures: {
    tenant?: string;
    landlord?: string;
    provider?: string;
  };
  onUpdateRoom: (roomId: string, updates: Partial<HandoverRoom>) => void;
  onUpdateCategory: (categoryId: string, itemId: string, checked: boolean) => void;
  onSign: (party: 'tenant' | 'landlord' | 'provider') => void;
  onComplete: () => void;
  className?: string;
}

const DEFAULT_CATEGORIES: Omit<HandoverCategory, 'status'>[] = [
  {
    id: 'cleaning',
    name: 'Reinigung',
    icon: Droplets,
    items: [
      { id: 'c1', label: 'Böden gereinigt', checked: false, required: true },
      { id: 'c2', label: 'Fenster geputzt', checked: false, required: true },
      { id: 'c3', label: 'Küche entfettet', checked: false, required: true },
      { id: 'c4', label: 'Badezimmer desinfiziert', checked: false, required: true },
      { id: 'c5', label: 'Schränke innen gereinigt', checked: false, required: false },
    ],
  },
  {
    id: 'keys',
    name: 'Schlüssel',
    icon: Key,
    items: [
      { id: 'k1', label: 'Wohnungsschlüssel (Anzahl)', checked: false, required: true },
      { id: 'k2', label: 'Briefkastenschlüssel', checked: false, required: true },
      { id: 'k3', label: 'Kellerschlüssel', checked: false, required: false },
      { id: 'k4', label: 'Garagenschlüssel/-badge', checked: false, required: false },
    ],
  },
  {
    id: 'utilities',
    name: 'Zähler & Anschlüsse',
    icon: Zap,
    items: [
      { id: 'u1', label: 'Stromzählerstand notiert', checked: false, required: true },
      { id: 'u2', label: 'Wasserzählerstand notiert', checked: false, required: false },
      { id: 'u3', label: 'Heizungszählerstand notiert', checked: false, required: false },
      { id: 'u4', label: 'Internet-Router retourniert', checked: false, required: false },
    ],
  },
  {
    id: 'repairs',
    name: 'Zustand & Mängel',
    icon: Home,
    items: [
      { id: 'r1', label: 'Wände ohne Schäden', checked: false, required: true },
      { id: 'r2', label: 'Böden ohne Schäden', checked: false, required: true },
      { id: 'r3', label: 'Fenster/Türen funktionsfähig', checked: false, required: true },
      { id: 'r4', label: 'Sanitäranlagen funktionsfähig', checked: false, required: true },
      { id: 'r5', label: 'Elektrogeräte funktionsfähig', checked: false, required: false },
    ],
  },
];

export const HandoverProtocol = memo(function HandoverProtocol({
  moveProjectId,
  propertyAddress,
  landlordName,
  tenantName,
  handoverDate,
  rooms,
  categories,
  signatures,
  onUpdateRoom,
  onUpdateCategory,
  onSign,
  onComplete,
  className,
}: HandoverProtocolProps) {
  const [expandedRoom, setExpandedRoom] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [damageAssessments, setDamageAssessments] = useState<DamageAssessment[]>([]);
  const [showDamageCalculator, setShowDamageCalculator] = useState(false);

  // Handle damage assessment from Lebensdauer calculator
  const handleDamageAssessment = (assessment: DamageAssessment) => {
    setDamageAssessments(prev => [...prev, assessment]);
    setShowDamageCalculator(false);
  };

  const removeDamageAssessment = (index: number) => {
    setDamageAssessments(prev => prev.filter((_, i) => i !== index));
  };

  const totalTenantLiability = damageAssessments.reduce((sum, a) => sum + a.tenantPaysCHF, 0);
  const totalLandlordShare = damageAssessments.reduce((sum, a) => sum + a.landlordPaysCHF, 0);

  // Calculate overall progress
  const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0);
  const checkedItems = categories.reduce(
    (sum, cat) => sum + cat.items.filter(i => i.checked).length,
    0
  );
  const progressPercent = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

  const allRequiredComplete = categories.every(cat =>
    cat.items.filter(i => i.required).every(i => i.checked)
  );

  const allSigned = signatures.tenant && signatures.landlord;

  const getStatusBadge = (status: 'pending' | 'approved' | 'issues' | 'in_progress') => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-emerald-500"><CheckCircle2 className="h-3 w-3 mr-1" />OK</Badge>;
      case 'issues':
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Mängel</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500">In Arbeit</Badge>;
      default:
        return <Badge variant="outline">Ausstehend</Badge>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-primary" />
                Phase 6: Wohnungsübergabe
              </CardTitle>
              <CardDescription>
                Swiss-Standard Übergabeprotokoll
              </CardDescription>
            </div>
            <Badge variant="outline">
              {new Date(handoverDate).toLocaleDateString('de-CH')}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Property Info */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Objekt:</span>
                <p className="font-medium">{propertyAddress}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Mieter:</span>
                <p className="font-medium">{tenantName}</p>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Fortschritt</span>
              <span className="font-medium">{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Checkliste</h4>
            {categories.map((category) => {
              const Icon = category.icon;
              const isExpanded = expandedCategory === category.id;
              const completedCount = category.items.filter(i => i.checked).length;

              return (
                <div key={category.id} className="border rounded-lg overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
                    onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">{category.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {completedCount}/{category.items.length}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(category.status)}
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t"
                      >
                        <div className="p-3 space-y-2">
                          {category.items.map((item) => (
                            <label
                              key={item.id}
                              className={cn(
                                'flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors',
                                item.checked ? 'bg-emerald-500/10' : 'hover:bg-muted/50'
                              )}
                            >
                              <input
                                type="checkbox"
                                checked={item.checked}
                                onChange={(e) => onUpdateCategory(category.id, item.id, e.target.checked)}
                                className="w-4 h-4 rounded"
                              />
                              <span className={cn(
                                'flex-1 text-sm',
                                item.checked && 'text-emerald-700 line-through'
                              )}>
                                {item.label}
                              </span>
                              {item.required && !item.checked && (
                                <Badge variant="outline" className="text-xs text-red-500 border-red-300">
                                  Pflicht
                                </Badge>
                              )}
                            </label>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Room Documentation */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Raumdokumentation
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className={cn(
                    'p-3 border rounded-lg cursor-pointer transition-colors',
                    room.status === 'approved' && 'border-emerald-500 bg-emerald-500/5',
                    room.status === 'issues' && 'border-red-500 bg-red-500/5'
                  )}
                  onClick={() => setExpandedRoom(expandedRoom === room.id ? null : room.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{room.name}</span>
                    {getStatusBadge(room.status)}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Camera className="h-3 w-3" />
                    <span>{room.photos.length} Fotos</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Damage Assessment Section (Lebensdauertabelle Integration) */}
          <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Schäden & Abzüge (Lebensdauertabelle)
              </h4>
              <Dialog open={showDamageCalculator} onOpenChange={setShowDamageCalculator}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-3 w-3 mr-1" />
                    Schaden hinzufügen
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Schaden berechnen</DialogTitle>
                  </DialogHeader>
                  <LebensdauerCalculator 
                    onAssessmentComplete={handleDamageAssessment}
                    compact
                  />
                </DialogContent>
              </Dialog>
            </div>

            {damageAssessments.length === 0 ? (
              <div className="text-center py-4 text-sm text-muted-foreground">
                <Calculator className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Keine Schäden erfasst</p>
                <p className="text-xs">Nutzen Sie den Lebensdauer-Rechner für transparente Abzüge</p>
              </div>
            ) : (
              <div className="space-y-2">
                {damageAssessments.map((assessment, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-background rounded border">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{assessment.fixtureName}</div>
                      <div className="text-xs text-muted-foreground">
                        {assessment.depreciation.ageYears} Jahre alt • {assessment.depreciation.residualPercent}% Restwert
                      </div>
                    </div>
                    <div className="text-right mr-2">
                      {assessment.replacementCostCHF > 0 ? (
                        <>
                          <div className="font-semibold text-sm text-primary">
                            CHF {assessment.tenantPaysCHF}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Mieter zahlt
                          </div>
                        </>
                      ) : (
                        <Badge variant={assessment.depreciation.isFullyAmortized ? 'default' : 'secondary'}>
                          {assessment.depreciation.isFullyAmortized ? 'Kein Abzug' : `${assessment.depreciation.residualPercent}%`}
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeDamageAssessment(index)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                  </div>
                ))}

                {/* Totals */}
                {totalTenantLiability > 0 && (
                  <div className="pt-2 border-t mt-2">
                    <div className="flex justify-between text-sm font-semibold">
                      <span>Total Mieter-Abzug:</span>
                      <span className="text-primary">CHF {totalTenantLiability.toLocaleString('de-CH')}</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Vermieter trägt:</span>
                      <span>CHF {totalLandlordShare.toLocaleString('de-CH')}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Signatures */}
          <div className="space-y-3 p-4 border rounded-lg bg-card">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <PenTool className="h-4 w-4" />
              Unterschriften
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div
                className={cn(
                  'p-3 border-2 border-dashed rounded-lg text-center',
                  signatures.tenant ? 'border-emerald-500 bg-emerald-500/10' : 'border-muted'
                )}
              >
                {signatures.tenant ? (
                  <>
                    <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto mb-1" />
                    <span className="text-xs text-emerald-700">Mieter signiert</span>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSign('tenant')}
                    disabled={!allRequiredComplete}
                  >
                    Mieter unterschreiben
                  </Button>
                )}
              </div>
              <div
                className={cn(
                  'p-3 border-2 border-dashed rounded-lg text-center',
                  signatures.landlord ? 'border-emerald-500 bg-emerald-500/10' : 'border-muted'
                )}
              >
                {signatures.landlord ? (
                  <>
                    <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto mb-1" />
                    <span className="text-xs text-emerald-700">Vermieter signiert</span>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSign('landlord')}
                    disabled={!signatures.tenant}
                  >
                    Vermieter unterschreiben
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Complete Button */}
          {allSigned && (
            <Button size="lg" className="w-full" onClick={onComplete}>
              <Award className="h-4 w-4 mr-2" />
              Übergabe abschliessen & Kaution freigeben
            </Button>
          )}

          {!allRequiredComplete && (
            <p className="text-xs text-muted-foreground text-center">
              Bitte füllen Sie alle Pflichtfelder aus, bevor Sie unterschreiben können.
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
});

export default HandoverProtocol;
