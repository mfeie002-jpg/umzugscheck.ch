/**
 * HandoverChecklist - Swiss apartment handover protocol component
 */

import { memo, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  CheckCircle, 
  FileSignature, 
  Home,
  Key,
  Droplets,
  ClipboardList,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  HandoverChecklist as HandoverChecklistType,
  HandoverItem,
  calculateHandoverCompletion,
} from '@/lib/provider-booking';

// ============================================================================
// TYPES
// ============================================================================

interface HandoverChecklistProps {
  checklist: HandoverChecklistType;
  onUpdateItem: (itemId: string, checked: boolean) => void;
  onUpdateNotes: (notes: string) => void;
  onAddPhoto: (room: string, type: 'before' | 'after' | 'damage') => void;
  onSign: (type: 'customer' | 'provider') => void;
  readOnly?: boolean;
}

// ============================================================================
// CATEGORY CONFIG
// ============================================================================

const CATEGORY_CONFIG: Record<HandoverItem['category'], { 
  label: string; 
  icon: React.ReactNode;
  color: string;
}> = {
  condition: { 
    label: 'Zustand', 
    icon: <Home className="h-4 w-4" />,
    color: 'text-blue-600',
  },
  cleaning: { 
    label: 'Reinigung', 
    icon: <Sparkles className="h-4 w-4" />,
    color: 'text-green-600',
  },
  keys: { 
    label: 'Schlüssel', 
    icon: <Key className="h-4 w-4" />,
    color: 'text-amber-600',
  },
  utilities: { 
    label: 'Versorgung', 
    icon: <Droplets className="h-4 w-4" />,
    color: 'text-cyan-600',
  },
  inventory: { 
    label: 'Inventar', 
    icon: <ClipboardList className="h-4 w-4" />,
    color: 'text-purple-600',
  },
};

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

const CategorySection = memo(function CategorySection({
  category,
  items,
  onUpdateItem,
  readOnly,
}: {
  category: HandoverItem['category'];
  items: HandoverItem[];
  onUpdateItem: (itemId: string, checked: boolean) => void;
  readOnly?: boolean;
}) {
  const config = CATEGORY_CONFIG[category];
  const completedCount = items.filter(i => i.checked).length;
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={config.color}>{config.icon}</span>
          <h4 className="font-medium">{config.label}</h4>
        </div>
        <Badge variant="outline" className="text-xs">
          {completedCount}/{items.length}
        </Badge>
      </div>
      
      <div className="space-y-2 pl-6">
        {items.map((item) => (
          <label 
            key={item.id}
            className={cn(
              'flex items-center gap-3 p-2 rounded-md transition-colors',
              !readOnly && 'hover:bg-muted cursor-pointer',
              item.checked && 'bg-primary/5'
            )}
          >
            <Checkbox
              checked={item.checked}
              onCheckedChange={(checked) => onUpdateItem(item.id, !!checked)}
              disabled={readOnly}
            />
            <span className={cn(
              'text-sm',
              item.checked && 'text-muted-foreground line-through'
            )}>
              {item.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const HandoverChecklistComponent = memo(function HandoverChecklistComponent({
  checklist,
  onUpdateItem,
  onUpdateNotes,
  onAddPhoto,
  onSign,
  readOnly = false,
}: HandoverChecklistProps) {
  const completion = calculateHandoverCompletion(checklist);
  const [activePhotoRoom, setActivePhotoRoom] = useState<string | null>(null);
  
  // Group items by category
  const groupedItems = checklist.items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<HandoverItem['category'], HandoverItem[]>);
  
  const handlePhotoCapture = useCallback((room: string, type: 'before' | 'after' | 'damage') => {
    onAddPhoto(room, type);
    setActivePhotoRoom(null);
  }, [onAddPhoto]);
  
  const isComplete = completion === 100 && checklist.customerSignature && checklist.providerSignature;
  
  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                Wohnungsübergabe-Protokoll
              </CardTitle>
              <CardDescription>
                Schweizer Standard-Checkliste für die Wohnungsabgabe
              </CardDescription>
            </div>
            {isComplete && (
              <Badge variant="default">
                <CheckCircle className="h-3 w-3 mr-1" />
                Abgeschlossen
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Fortschritt</span>
              <span className="font-medium">{completion}%</span>
            </div>
            <Progress value={completion} className="h-2" />
          </div>
        </CardContent>
      </Card>
      
      {/* Checklist Sections */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          {(Object.keys(CATEGORY_CONFIG) as HandoverItem['category'][]).map((category) => (
            groupedItems[category]?.length > 0 && (
              <CategorySection
                key={category}
                category={category}
                items={groupedItems[category]}
                onUpdateItem={onUpdateItem}
                readOnly={readOnly}
              />
            )
          ))}
        </CardContent>
      </Card>
      
      {/* Photo Documentation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Foto-Dokumentation
          </CardTitle>
          <CardDescription>
            Dokumentieren Sie den Zustand aller Räume
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Wohnzimmer', 'Schlafzimmer', 'Küche', 'Bad', 'Flur', 'Balkon', 'Keller', 'Sonstige'].map((room) => {
              const roomPhotos = checklist.photos.filter(p => p.room === room);
              
              return (
                <div 
                  key={room}
                  className="border rounded-lg p-3 text-center"
                >
                  <p className="text-sm font-medium mb-2">{room}</p>
                  {roomPhotos.length > 0 ? (
                    <div className="flex justify-center gap-1">
                      <Badge variant="outline" className="text-xs">
                        {roomPhotos.length} Fotos
                      </Badge>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => handlePhotoCapture(room, 'after')}
                      disabled={readOnly}
                    >
                      <Camera className="h-3 w-3 mr-1" />
                      Foto
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bemerkungen</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={checklist.notes}
            onChange={(e) => onUpdateNotes(e.target.value)}
            placeholder="Besondere Vorkommnisse, Mängel oder Vereinbarungen..."
            rows={4}
            disabled={readOnly}
          />
        </CardContent>
      </Card>
      
      {/* Signatures */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileSignature className="h-4 w-4" />
            Unterschriften
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 text-center">
              <p className="text-sm font-medium mb-3">Mieter/Kunde</p>
              {checklist.customerSignature ? (
                <div className="space-y-2">
                  <CheckCircle className="h-8 w-8 mx-auto text-primary" />
                  <p className="text-xs text-muted-foreground">Unterschrieben</p>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => onSign('customer')}
                  disabled={readOnly}
                >
                  Jetzt unterschreiben
                </Button>
              )}
            </div>
            
            <div className="border rounded-lg p-4 text-center">
              <p className="text-sm font-medium mb-3">Umzugsfirma</p>
              {checklist.providerSignature ? (
                <div className="space-y-2">
                  <CheckCircle className="h-8 w-8 mx-auto text-primary" />
                  <p className="text-xs text-muted-foreground">Unterschrieben</p>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => onSign('provider')}
                  disabled={readOnly}
                >
                  Jetzt unterschreiben
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

export default HandoverChecklistComponent;
