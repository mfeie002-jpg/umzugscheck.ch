/**
 * InteractiveChecklist - Step 7.1
 * Personalized moving checklist with progress tracking
 */
import { memo, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Circle,
  ChevronDown,
  ChevronUp,
  Calendar,
  Clock,
  Trophy,
  Sparkles,
  Download,
  Share2,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  daysBeforeMove: number;
  priority: 'high' | 'medium' | 'low';
  estimatedMinutes?: number;
}

interface ChecklistCategory {
  id: string;
  title: string;
  icon: string;
  color: string;
  items: ChecklistItem[];
}

const CHECKLIST_DATA: ChecklistCategory[] = [
  {
    id: 'preparation',
    title: '3 Monate vorher',
    icon: '📋',
    color: 'from-blue-500 to-indigo-500',
    items: [
      { id: 'p1', title: 'Wohnung kündigen', description: 'Kündigungsfrist beachten (meist 3 Monate)', category: 'preparation', daysBeforeMove: 90, priority: 'high', estimatedMinutes: 30 },
      { id: 'p2', title: 'Neue Wohnung suchen & mieten', category: 'preparation', daysBeforeMove: 90, priority: 'high', estimatedMinutes: 0 },
      { id: 'p3', title: 'Umzugstermin festlegen', category: 'preparation', daysBeforeMove: 85, priority: 'high', estimatedMinutes: 15 },
      { id: 'p4', title: 'Umzugsofferten einholen', description: 'Mind. 3-5 Offerten vergleichen', category: 'preparation', daysBeforeMove: 80, priority: 'high', estimatedMinutes: 20 },
      { id: 'p5', title: 'Urlaub für Umzugstag beantragen', category: 'preparation', daysBeforeMove: 75, priority: 'medium', estimatedMinutes: 5 },
      { id: 'p6', title: 'Inventar erstellen', description: 'Was wird mitgenommen, verkauft, entsorgt?', category: 'preparation', daysBeforeMove: 70, priority: 'medium', estimatedMinutes: 60 },
    ],
  },
  {
    id: 'oneMonthBefore',
    title: '1 Monat vorher',
    icon: '📦',
    color: 'from-orange-500 to-amber-500',
    items: [
      { id: 'm1', title: 'Umzugsfirma buchen', category: 'oneMonthBefore', daysBeforeMove: 30, priority: 'high', estimatedMinutes: 30 },
      { id: 'm2', title: 'Adressänderungen vorbereiten', description: 'Post, Bank, Versicherungen, Ämter', category: 'oneMonthBefore', daysBeforeMove: 28, priority: 'high', estimatedMinutes: 60 },
      { id: 'm3', title: 'Halteverbot beantragen', description: 'Bei Gemeindeverwaltung anfragen', category: 'oneMonthBefore', daysBeforeMove: 25, priority: 'medium', estimatedMinutes: 30 },
      { id: 'm4', title: 'Packmaterial besorgen', description: 'Kartons, Klebeband, Packpapier', category: 'oneMonthBefore', daysBeforeMove: 20, priority: 'medium', estimatedMinutes: 45 },
      { id: 'm5', title: 'Mit Packen beginnen', description: 'Selten genutzte Sachen zuerst', category: 'oneMonthBefore', daysBeforeMove: 20, priority: 'medium', estimatedMinutes: 0 },
      { id: 'm6', title: 'Möbel-Abbau planen', category: 'oneMonthBefore', daysBeforeMove: 14, priority: 'low', estimatedMinutes: 20 },
    ],
  },
  {
    id: 'oneWeekBefore',
    title: '1 Woche vorher',
    icon: '🏠',
    color: 'from-green-500 to-emerald-500',
    items: [
      { id: 'w1', title: 'Restliches Packen abschliessen', category: 'oneWeekBefore', daysBeforeMove: 7, priority: 'high', estimatedMinutes: 0 },
      { id: 'w2', title: 'Wertgegenstände sichern', description: 'Separat transportieren', category: 'oneWeekBefore', daysBeforeMove: 7, priority: 'high', estimatedMinutes: 30 },
      { id: 'w3', title: 'Kühlschrank abtauen', category: 'oneWeekBefore', daysBeforeMove: 3, priority: 'medium', estimatedMinutes: 15 },
      { id: 'w4', title: 'Notfall-Box packen', description: 'Erste Nacht in neuer Wohnung', category: 'oneWeekBefore', daysBeforeMove: 2, priority: 'medium', estimatedMinutes: 30 },
      { id: 'w5', title: 'Schlüsselübergabe organisieren', category: 'oneWeekBefore', daysBeforeMove: 1, priority: 'high', estimatedMinutes: 15 },
    ],
  },
  {
    id: 'movingDay',
    title: 'Am Umzugstag',
    icon: '🚚',
    color: 'from-red-500 to-rose-500',
    items: [
      { id: 'd1', title: 'Zählerstände notieren', description: 'Strom, Wasser, Gas', category: 'movingDay', daysBeforeMove: 0, priority: 'high', estimatedMinutes: 10 },
      { id: 'd2', title: 'Wohnung fotografieren', description: 'Für Übergabeprotokoll', category: 'movingDay', daysBeforeMove: 0, priority: 'high', estimatedMinutes: 15 },
      { id: 'd3', title: 'Übergabeprotokoll unterschreiben', category: 'movingDay', daysBeforeMove: 0, priority: 'high', estimatedMinutes: 20 },
      { id: 'd4', title: 'Schlüssel übergeben', category: 'movingDay', daysBeforeMove: 0, priority: 'high', estimatedMinutes: 5 },
      { id: 'd5', title: 'Neue Wohnung: Zähler notieren', category: 'movingDay', daysBeforeMove: 0, priority: 'high', estimatedMinutes: 10 },
    ],
  },
  {
    id: 'afterMove',
    title: 'Nach dem Umzug',
    icon: '✅',
    color: 'from-purple-500 to-violet-500',
    items: [
      { id: 'a1', title: 'Einwohneramt: Ummeldung', description: 'Innert 14 Tagen', category: 'afterMove', daysBeforeMove: -7, priority: 'high', estimatedMinutes: 45 },
      { id: 'a2', title: 'Nachsendeauftrag Post', category: 'afterMove', daysBeforeMove: -7, priority: 'high', estimatedMinutes: 15 },
      { id: 'a3', title: 'Versicherungen aktualisieren', category: 'afterMove', daysBeforeMove: -14, priority: 'medium', estimatedMinutes: 30 },
      { id: 'a4', title: 'Fahrzeug ummelden', category: 'afterMove', daysBeforeMove: -14, priority: 'medium', estimatedMinutes: 60 },
      { id: 'a5', title: 'Nachbarn kennenlernen', category: 'afterMove', daysBeforeMove: -30, priority: 'low', estimatedMinutes: 0 },
    ],
  },
];

const STORAGE_KEY = 'umzugscheck_checklist_progress';

interface ChecklistProgress {
  completedItems: string[];
  moveDate: string | null;
  lastUpdated: string;
}

interface InteractiveChecklistProps {
  className?: string;
  variant?: 'full' | 'compact' | 'widget';
}

export const InteractiveChecklist = memo(function InteractiveChecklist({
  className,
  variant = 'full',
}: InteractiveChecklistProps) {
  const [progress, setProgress] = useState<ChecklistProgress>({
    completedItems: [],
    moveDate: null,
    lastUpdated: new Date().toISOString(),
  });
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['preparation']);
  const [moveDate, setMoveDate] = useState<string>('');

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProgress(parsed);
        if (parsed.moveDate) {
          setMoveDate(parsed.moveDate);
        }
      } catch (e) {
        console.error('Failed to load checklist progress:', e);
      }
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = useCallback((newProgress: ChecklistProgress) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
    setProgress(newProgress);
  }, []);

  const toggleItem = (itemId: string) => {
    const newCompleted = progress.completedItems.includes(itemId)
      ? progress.completedItems.filter((id) => id !== itemId)
      : [...progress.completedItems, itemId];

    saveProgress({
      ...progress,
      completedItems: newCompleted,
      lastUpdated: new Date().toISOString(),
    });

    if (!progress.completedItems.includes(itemId)) {
      toast.success('Erledigt! ✓');
    }
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleMoveDateChange = (date: string) => {
    setMoveDate(date);
    saveProgress({
      ...progress,
      moveDate: date,
      lastUpdated: new Date().toISOString(),
    });
  };

  const resetProgress = () => {
    if (confirm('Möchten Sie den Fortschritt wirklich zurücksetzen?')) {
      saveProgress({
        completedItems: [],
        moveDate: null,
        lastUpdated: new Date().toISOString(),
      });
      setMoveDate('');
      toast.success('Checkliste zurückgesetzt');
    }
  };

  const totalItems = CHECKLIST_DATA.reduce((acc, cat) => acc + cat.items.length, 0);
  const completedCount = progress.completedItems.length;
  const progressPercent = Math.round((completedCount / totalItems) * 100);

  const getItemStatus = (item: ChecklistItem) => {
    if (!moveDate) return 'pending';
    const moveDateObj = new Date(moveDate);
    const itemDueDate = new Date(moveDateObj);
    itemDueDate.setDate(moveDateObj.getDate() - item.daysBeforeMove);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (progress.completedItems.includes(item.id)) return 'completed';
    if (itemDueDate < today) return 'overdue';
    if (itemDueDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)) return 'upcoming';
    return 'pending';
  };

  // Widget variant - minimal display
  if (variant === 'widget') {
    return (
      <Card className={cn('', className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Umzugs-Checkliste</span>
            <Badge variant="secondary">{completedCount}/{totalItems}</Badge>
          </div>
          <Progress value={progressPercent} className="h-2 mb-2" />
          <p className="text-xs text-muted-foreground">
            {progressPercent}% erledigt
          </p>
        </CardContent>
      </Card>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <Card className={cn('', className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-swiss-gold" />
            Dein Umzugs-Fortschritt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <Progress value={progressPercent} className="h-3" />
            </div>
            <span className="text-lg font-bold text-secondary">{progressPercent}%</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {CHECKLIST_DATA.map((cat) => {
              const catCompleted = cat.items.filter((i) =>
                progress.completedItems.includes(i.id)
              ).length;
              return (
                <Badge
                  key={cat.id}
                  variant={catCompleted === cat.items.length ? 'default' : 'outline'}
                  className="gap-1"
                >
                  {cat.icon} {catCompleted}/{cat.items.length}
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full variant
  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-swiss-gold" />
                Deine Umzugs-Checkliste
              </h2>
              <p className="text-muted-foreground">
                {completedCount} von {totalItems} Aufgaben erledigt
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={resetProgress}>
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                PDF
              </Button>
            </div>
          </div>

          {/* Move Date Picker */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 bg-muted/50 rounded-xl mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-secondary" />
              <span className="font-medium">Dein Umzugstermin:</span>
            </div>
            <input
              type="date"
              value={moveDate}
              onChange={(e) => handleMoveDateChange(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-background"
            />
            {moveDate && (
              <span className="text-sm text-muted-foreground">
                Noch {Math.max(0, Math.ceil((new Date(moveDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} Tage
              </span>
            )}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Fortschritt</span>
              <span className="font-bold text-secondary">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-4" />
            {progressPercent === 100 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-green-600 dark:text-green-400"
              >
                <Trophy className="w-5 h-5" />
                <span className="font-medium">Alles erledigt! Du bist bereit für deinen Umzug!</span>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <div className="space-y-4">
        {CHECKLIST_DATA.map((category) => {
          const isExpanded = expandedCategories.includes(category.id);
          const catCompleted = category.items.filter((i) =>
            progress.completedItems.includes(i.id)
          ).length;
          const catProgress = Math.round((catCompleted / category.items.length) * 100);

          return (
            <Card key={category.id} className="overflow-hidden">
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center text-xl',
                      `bg-gradient-to-br ${category.color} text-white`
                    )}
                  >
                    {category.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold">{category.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {catCompleted}/{category.items.length} erledigt
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={catProgress} className="w-24 h-2 hidden sm:block" />
                  {catProgress === 100 ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-2">
                      {category.items.map((item) => {
                        const isCompleted = progress.completedItems.includes(item.id);
                        const status = getItemStatus(item);

                        return (
                          <motion.button
                            key={item.id}
                            onClick={() => toggleItem(item.id)}
                            className={cn(
                              'w-full p-3 rounded-lg flex items-start gap-3 text-left transition-all',
                              isCompleted
                                ? 'bg-green-50 dark:bg-green-950/20'
                                : status === 'overdue'
                                ? 'bg-red-50 dark:bg-red-950/20'
                                : status === 'upcoming'
                                ? 'bg-amber-50 dark:bg-amber-950/20'
                                : 'bg-muted/50 hover:bg-muted'
                            )}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div
                              className={cn(
                                'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                                isCompleted
                                  ? 'bg-green-500 text-white'
                                  : 'border-2 border-muted-foreground'
                              )}
                            >
                              {isCompleted && <Check className="w-3 h-3" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span
                                  className={cn(
                                    'font-medium',
                                    isCompleted && 'line-through text-muted-foreground'
                                  )}
                                >
                                  {item.title}
                                </span>
                                {item.priority === 'high' && !isCompleted && (
                                  <Badge variant="destructive" className="text-xs py-0">
                                    Wichtig
                                  </Badge>
                                )}
                                {status === 'overdue' && !isCompleted && (
                                  <Badge variant="destructive" className="text-xs py-0">
                                    Überfällig
                                  </Badge>
                                )}
                              </div>
                              {item.description && (
                                <p className="text-sm text-muted-foreground">
                                  {item.description}
                                </p>
                              )}
                              {item.estimatedMinutes !== undefined && item.estimatedMinutes > 0 && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                  <Clock className="w-3 h-3" />
                                  ca. {item.estimatedMinutes} Min.
                                </span>
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
      </div>
    </div>
  );
});
