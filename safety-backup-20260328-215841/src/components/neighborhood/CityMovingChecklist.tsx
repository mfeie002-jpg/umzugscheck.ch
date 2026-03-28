/**
 * CityMovingChecklist - Sprint 3 Component
 * Interactive checklist with localStorage persistence for city pages
 */
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  RotateCcw,
  MapPin,
  FileText,
  Key,
  Truck,
  Phone,
  Package,
  Home,
  ClipboardList
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ChecklistItem {
  id: string;
  text: string;
  tip: string;
  priority: 'high' | 'medium' | 'low';
  icon: any;
}

interface CityChecklistConfig {
  citySpecificItems: ChecklistItem[];
  parkingPermitInfo?: string;
  localTip?: string;
}

// Default checklist items (Swiss standard)
const DEFAULT_ITEMS: ChecklistItem[] = [
  { id: 'date', text: 'Umzugstermin festlegen', tip: '3+ Monate vorher', priority: 'high', icon: Clock },
  { id: 'parking', text: 'Parkbewilligung beantragen', tip: '2 Wochen vorher', priority: 'high', icon: FileText },
  { id: 'cancel', text: 'Alte Wohnung kündigen', tip: '3 Monate Frist', priority: 'high', icon: Key },
  { id: 'boxes', text: 'Umzugskartons besorgen', tip: 'Ca. 30 pro Zimmer', priority: 'medium', icon: Package },
  { id: 'address', text: 'Adressänderungen melden', tip: 'Post, Versicherungen, Bank', priority: 'medium', icon: Phone },
  { id: 'company', text: 'Umzugsfirma buchen', tip: 'Früh reservieren!', priority: 'high', icon: Truck },
  { id: 'cleaning', text: 'Endreinigung organisieren', tip: 'Mit Abnahmegarantie', priority: 'medium', icon: Home },
  { id: 'keys', text: 'Schlüsselübergabe planen', tip: 'Protokoll vorbereiten', priority: 'high', icon: Key },
];

// City-specific configurations
const CITY_CONFIGS: Record<string, CityChecklistConfig> = {
  zug: {
    parkingPermitInfo: 'Tiefbauamt Stadt Zug',
    localTip: 'In der Altstadt ist eine Halteverbotszone fast immer nötig!',
    citySpecificItems: [
      { id: 'crypto', text: 'Crypto Valley: Expat-Services prüfen', tip: 'Mehrsprachige Teams verfügbar', priority: 'low', icon: MapPin },
    ],
  },
  zuerich: {
    parkingPermitInfo: 'Tiefbauamt Zürich (je Stadtkreis)',
    localTip: 'Parkbewilligung 2-3 Wochen im Voraus beantragen!',
    citySpecificItems: [
      { id: 'kreis', text: 'Stadtkreis-spezifische Regeln prüfen', tip: 'Altstadt hat Sonderzeiten', priority: 'medium', icon: MapPin },
    ],
  },
  bern: {
    parkingPermitInfo: 'Tiefbauamt Stadt Bern',
    localTip: 'Altstadt: Enge Gassen erfordern Spezialequipment',
    citySpecificItems: [
      { id: 'oldtown', text: 'Altstadt-Zufahrt klären', tip: 'Zeitfenster beachten', priority: 'medium', icon: MapPin },
    ],
  },
  basel: {
    parkingPermitInfo: 'Bau- und Verkehrsdepartement Basel',
    localTip: 'Grenzüberschreitend? Zollformalitäten beachten!',
    citySpecificItems: [
      { id: 'border', text: 'Bei Grenzumzug: Zoll prüfen', tip: 'DE/FR Grenzregion', priority: 'medium', icon: MapPin },
    ],
  },
};

interface CityMovingChecklistProps {
  citySlug: string;
  cityName: string;
  className?: string;
  variant?: 'full' | 'compact';
}

export const CityMovingChecklist = ({ 
  citySlug, 
  cityName, 
  className,
  variant = 'compact'
}: CityMovingChecklistProps) => {
  const storageKey = `umzugscheck_city_checklist_${citySlug}`;
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  const cityConfig = CITY_CONFIGS[citySlug];
  const allItems = [
    ...DEFAULT_ITEMS,
    ...(cityConfig?.citySpecificItems || []),
  ];

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCompleted(new Set(parsed.completed || []));
      } catch (e) {
        console.error('Failed to load checklist:', e);
      }
    }
    setIsLoaded(true);
  }, [storageKey]);

  // Save to localStorage
  const saveProgress = useCallback((newCompleted: Set<string>) => {
    localStorage.setItem(storageKey, JSON.stringify({
      completed: Array.from(newCompleted),
      lastUpdated: new Date().toISOString(),
      citySlug,
    }));
  }, [storageKey, citySlug]);

  const toggleItem = (itemId: string) => {
    const newCompleted = new Set(completed);
    if (newCompleted.has(itemId)) {
      newCompleted.delete(itemId);
    } else {
      newCompleted.add(itemId);
      toast.success('Erledigt! ✓', { duration: 1500 });
    }
    setCompleted(newCompleted);
    saveProgress(newCompleted);
  };

  const resetProgress = () => {
    if (confirm('Checkliste zurücksetzen?')) {
      setCompleted(new Set());
      saveProgress(new Set());
      toast.success('Checkliste zurückgesetzt');
    }
  };

  const progressPercent = Math.round((completed.size / allItems.length) * 100);
  const highPriorityRemaining = allItems.filter(
    item => item.priority === 'high' && !completed.has(item.id)
  ).length;

  if (!isLoaded) return null;

  // Compact variant for sidebar
  if (variant === 'compact') {
    return (
      <Card className={cn("", className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-secondary" />
            Umzugs-Checkliste {cityName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Progress */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Fortschritt</span>
              <span className="font-semibold">{completed.size}/{allItems.length}</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>

          {/* High priority warning */}
          {highPriorityRemaining > 0 && (
            <div className="flex items-center gap-2 text-xs text-destructive">
              <AlertCircle className="w-3 h-3" />
              <span>{highPriorityRemaining} wichtige Aufgaben offen</span>
            </div>
          )}

          {/* Local tip */}
          {cityConfig?.localTip && (
            <div className="p-2 rounded-lg bg-secondary/10 text-xs">
              <span className="font-medium">💡 Lokaler Tipp:</span> {cityConfig.localTip}
            </div>
          )}

          {/* Items list */}
          <div className="space-y-1.5 max-h-64 overflow-y-auto">
            {allItems.map((item) => {
              const isCompleted = completed.has(item.id);
              const Icon = item.icon;
              return (
                <motion.label
                  key={item.id}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors text-sm",
                    isCompleted 
                      ? "bg-success/10 text-muted-foreground" 
                      : item.priority === 'high' 
                        ? "bg-destructive/5 hover:bg-destructive/10" 
                        : "hover:bg-muted/50"
                  )}
                  whileTap={{ scale: 0.98 }}
                >
                  <Checkbox
                    checked={isCompleted}
                    onCheckedChange={() => toggleItem(item.id)}
                    className="shrink-0"
                  />
                  <Icon className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                  <span className={cn("flex-1", isCompleted && "line-through")}>
                    {item.text}
                  </span>
                  {!isCompleted && item.priority === 'high' && (
                    <Badge variant="destructive" className="text-[10px] px-1 py-0">
                      Wichtig
                    </Badge>
                  )}
                </motion.label>
              );
            })}
          </div>

          {/* Reset button */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetProgress}
            className="w-full text-xs"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Zurücksetzen
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Full variant
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-secondary" />
            Umzugs-Checkliste {cityName}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={resetProgress}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Progress */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-sm">
            <span>Fortschritt</span>
            <span className="font-bold">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-3" />
          {progressPercent === 100 && (
            <p className="text-sm text-success font-medium">
              ✓ Alles erledigt! Bereit für den Umzug.
            </p>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* City-specific info */}
        {cityConfig?.parkingPermitInfo && (
          <div className="p-3 rounded-lg bg-muted/50 text-sm">
            <span className="font-medium">📋 Parkbewilligung:</span>{' '}
            {cityConfig.parkingPermitInfo}
          </div>
        )}

        {/* Items */}
        <div className="space-y-2">
          {allItems.map((item) => {
            const isCompleted = completed.has(item.id);
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                className={cn(
                  "p-3 rounded-lg border transition-all",
                  isCompleted 
                    ? "bg-success/10 border-success/20" 
                    : item.priority === 'high'
                      ? "bg-destructive/5 border-destructive/20"
                      : "bg-background"
                )}
                whileTap={{ scale: 0.98 }}
              >
                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    checked={isCompleted}
                    onCheckedChange={() => toggleItem(item.id)}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <span className={cn(
                        "font-medium",
                        isCompleted && "line-through text-muted-foreground"
                      )}>
                        {item.text}
                      </span>
                      {!isCompleted && item.priority === 'high' && (
                        <Badge variant="destructive" className="text-xs">
                          Wichtig
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 ml-6">
                      {item.tip}
                    </p>
                  </div>
                  {isCompleted && (
                    <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                  )}
                </label>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CityMovingChecklist;
