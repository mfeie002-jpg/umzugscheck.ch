/**
 * PersonalizedTimeline - Step 7.2
 * Moving timeline based on user's move date
 */
import { memo, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Home,
  Truck,
  Package,
  FileText,
  Phone,
  MapPin,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format, differenceInDays, addDays, isBefore, isToday } from 'date-fns';
import { de } from 'date-fns/locale';

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  daysFromMove: number; // negative = before, positive = after
  icon: React.ElementType;
  category: 'preparation' | 'packing' | 'admin' | 'moving' | 'after';
  isOptional?: boolean;
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  { id: 't1', title: 'Wohnung kündigen', description: 'Kündigungsfrist beachten', daysFromMove: -90, icon: FileText, category: 'admin' },
  { id: 't2', title: 'Umzugsofferten einholen', description: 'Preise vergleichen', daysFromMove: -75, icon: Phone, category: 'preparation' },
  { id: 't3', title: 'Umzugsfirma buchen', description: 'Termin bestätigen lassen', daysFromMove: -60, icon: Truck, category: 'preparation' },
  { id: 't4', title: 'Adressänderungen vorbereiten', description: 'Liste aller Stellen erstellen', daysFromMove: -45, icon: FileText, category: 'admin' },
  { id: 't5', title: 'Halteverbot beantragen', description: 'Bei der Gemeinde anfragen', daysFromMove: -30, icon: MapPin, category: 'admin', isOptional: true },
  { id: 't6', title: 'Packmaterial besorgen', description: 'Kartons, Klebeband, Polster', daysFromMove: -21, icon: Package, category: 'packing' },
  { id: 't7', title: 'Mit Packen beginnen', description: 'Selten genutzte Sachen zuerst', daysFromMove: -14, icon: Package, category: 'packing' },
  { id: 't8', title: 'Möbel abbauen', description: 'Anleitungen bereithalten', daysFromMove: -3, icon: Home, category: 'packing' },
  { id: 't9', title: 'Kühlschrank abtauen', description: 'Mindestens 24h vorher', daysFromMove: -2, icon: Home, category: 'packing' },
  { id: 't10', title: 'Notfall-Box packen', description: 'Für die erste Nacht', daysFromMove: -1, icon: Package, category: 'packing' },
  { id: 't11', title: '🚚 UMZUGSTAG', description: 'Zähler ablesen, Übergabe alte Wohnung', daysFromMove: 0, icon: Truck, category: 'moving' },
  { id: 't12', title: 'Einrichten beginnen', description: 'Wichtige Räume zuerst', daysFromMove: 1, icon: Home, category: 'after' },
  { id: 't13', title: 'Ummeldung Einwohneramt', description: 'Innert 14 Tagen', daysFromMove: 7, icon: FileText, category: 'admin' },
  { id: 't14', title: 'Nachsendeauftrag Post', description: 'Online oder in Filiale', daysFromMove: 7, icon: FileText, category: 'admin' },
  { id: 't15', title: 'Versicherungen aktualisieren', description: 'Hausrat, Haftpflicht', daysFromMove: 14, icon: FileText, category: 'admin' },
];

const CATEGORY_COLORS = {
  preparation: 'bg-blue-500',
  packing: 'bg-orange-500',
  admin: 'bg-purple-500',
  moving: 'bg-red-500',
  after: 'bg-green-500',
};

interface TimelineEventWithDate extends TimelineEvent {
  actualDate: Date;
  isPast: boolean;
  isToday: boolean;
}

interface PersonalizedTimelineProps {
  className?: string;
  moveDate?: Date | null;
  onMoveDateChange?: (date: Date) => void;
  variant?: 'full' | 'compact' | 'horizontal';
}

export const PersonalizedTimeline = memo(function PersonalizedTimeline({
  className,
  moveDate: externalMoveDate,
  onMoveDateChange,
  variant = 'full',
}: PersonalizedTimelineProps) {
  const [internalMoveDate, setInternalMoveDate] = useState<Date | null>(null);
  const moveDate = externalMoveDate ?? internalMoveDate;

  const handleDateChange = (dateStr: string) => {
    const date = new Date(dateStr);
    setInternalMoveDate(date);
    onMoveDateChange?.(date);
  };

  const daysUntilMove = useMemo(() => {
    if (!moveDate) return null;
    return differenceInDays(moveDate, new Date());
  }, [moveDate]);

  const timelineWithDates = useMemo((): TimelineEventWithDate[] => {
    if (!moveDate) {
      return TIMELINE_EVENTS.map((event) => ({
        ...event,
        actualDate: new Date(),
        isPast: false,
        isToday: false,
      }));
    }
    return TIMELINE_EVENTS.map((event) => ({
      ...event,
      actualDate: addDays(moveDate, event.daysFromMove),
      isPast: isBefore(addDays(moveDate, event.daysFromMove), new Date()),
      isToday: isToday(addDays(moveDate, event.daysFromMove)),
    }));
  }, [moveDate]);

  const upcomingEvents = useMemo(() => {
    return timelineWithDates
      .filter((e) => !e.isPast || e.isToday)
      .slice(0, 3);
  }, [timelineWithDates]);

  // Compact variant - just upcoming events
  if (variant === 'compact') {
    return (
      <Card className={cn('', className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-secondary" />
            Nächste Schritte
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!moveDate ? (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-3">
                Wähle deinen Umzugstermin für eine personalisierte Timeline
              </p>
              <input
                type="date"
                onChange={(e) => handleDateChange(e.target.value)}
                className="px-3 py-2 border rounded-lg bg-background text-sm"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                {daysUntilMove !== null && daysUntilMove >= 0 ? (
                  <span>Noch <strong className="text-foreground">{daysUntilMove} Tage</strong> bis zum Umzug</span>
                ) : (
                  <span>Umzug war vor {Math.abs(daysUntilMove!)} Tagen</span>
                )}
              </div>
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className={cn(
                    'flex items-center gap-3 p-2 rounded-lg',
                    event.isToday ? 'bg-secondary/10' : 'bg-muted/50'
                  )}
                >
                  <div className={cn('w-2 h-2 rounded-full', CATEGORY_COLORS[event.category])} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(event.actualDate!, 'd. MMM', { locale: de })}
                    </p>
                  </div>
                  {event.isToday && (
                    <Badge variant="secondary" className="text-xs">Heute</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Horizontal variant - scrollable timeline
  if (variant === 'horizontal') {
    return (
      <div className={cn('', className)}>
        {!moveDate ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Wann ist dein Umzug?</h3>
              <input
                type="date"
                onChange={(e) => handleDateChange(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-background"
              />
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max">
              {timelineWithDates.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    'w-48 shrink-0 p-4 rounded-xl border',
                    event.isPast && !event.isToday ? 'opacity-50 bg-muted/50' : 'bg-card',
                    event.isToday && 'ring-2 ring-secondary'
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={cn('w-3 h-3 rounded-full', CATEGORY_COLORS[event.category])} />
                    <span className="text-xs text-muted-foreground">
                      {format(event.actualDate!, 'd. MMM', { locale: de })}
                    </span>
                    {event.isToday && <Badge className="text-xs">Heute</Badge>}
                  </div>
                  <h4 className="font-medium text-sm mb-1">{event.title}</h4>
                  <p className="text-xs text-muted-foreground">{event.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full variant - vertical timeline
  return (
    <div className={cn('space-y-6', className)}>
      {/* Date Picker */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold">Dein Umzugstermin</h3>
                <p className="text-sm text-muted-foreground">
                  Für eine personalisierte Timeline
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <input
                type="date"
                value={moveDate ? format(moveDate, 'yyyy-MM-dd') : ''}
                onChange={(e) => handleDateChange(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-background"
              />
              {daysUntilMove !== null && daysUntilMove >= 0 && (
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {daysUntilMove} Tage
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      {moveDate && (
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-4">
            {timelineWithDates.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'relative pl-16',
                  event.isPast && !event.isToday && 'opacity-60'
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    'absolute left-0 w-12 h-12 rounded-full flex items-center justify-center',
                    event.daysFromMove === 0
                      ? 'bg-red-500 text-white ring-4 ring-red-200 dark:ring-red-900'
                      : event.isPast
                      ? 'bg-muted text-muted-foreground'
                      : event.isToday
                      ? 'bg-secondary text-secondary-foreground ring-4 ring-secondary/20'
                      : 'bg-card border-2 border-border text-foreground'
                  )}
                >
                  {event.isPast && !event.isToday ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <event.icon className="w-5 h-5" />
                  )}
                </div>

                {/* Content */}
                <Card className={cn(
                  event.isToday && 'ring-2 ring-secondary',
                  event.daysFromMove === 0 && 'bg-red-50 dark:bg-red-950/20'
                )}>
                  <CardContent className="py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{event.title}</h4>
                          {event.isOptional && (
                            <Badge variant="outline" className="text-xs">Optional</Badge>
                          )}
                          {event.isToday && (
                            <Badge variant="secondary">Heute</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {event.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {format(event.actualDate!, 'EEEE, d. MMMM', { locale: de })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {event.daysFromMove === 0
                            ? 'Umzugstag'
                            : event.daysFromMove < 0
                            ? `${Math.abs(event.daysFromMove)} Tage vorher`
                            : `${event.daysFromMove} Tage danach`}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
