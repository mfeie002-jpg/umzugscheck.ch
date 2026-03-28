import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isBefore } from 'date-fns';
import { de } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface DayAvailability {
  date: Date;
  available: boolean;
  slotsTotal: number;
  slotsBooked: number;
}

export const ProviderAvailabilityCalendar = () => {
  const { toast } = useToast();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState<Map<string, DayAvailability>>(() => {
    const map = new Map();
    const start = startOfMonth(new Date());
    const end = endOfMonth(addMonths(new Date(), 2));
    const days = eachDayOfInterval({ start, end });
    
    days.forEach(day => {
      const key = format(day, 'yyyy-MM-dd');
      const isWeekend = day.getDay() === 0 || day.getDay() === 6;
      map.set(key, {
        date: day,
        available: !isWeekend,
        slotsTotal: isWeekend ? 0 : 3,
        slotsBooked: Math.floor(Math.random() * 2),
      });
    });
    
    return map;
  });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get day of week for first day (0 = Sunday)
  const startDayOfWeek = monthStart.getDay();
  // Adjust for Monday start (0 = Monday)
  const adjustedStartDay = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

  const toggleAvailability = (date: Date) => {
    if (isBefore(date, new Date())) return;
    
    const key = format(date, 'yyyy-MM-dd');
    const current = availability.get(key);
    
    if (current) {
      setAvailability(prev => {
        const newMap = new Map(prev);
        newMap.set(key, {
          ...current,
          available: !current.available,
          slotsTotal: !current.available ? 3 : 0,
        });
        return newMap;
      });

      toast({
        title: current.available ? 'Nicht verfügbar' : 'Verfügbar',
        description: `${format(date, 'dd. MMMM yyyy', { locale: de })} wurde aktualisiert.`,
      });
    }
  };

  const weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Verfügbarkeitskalender
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium min-w-32 text-center">
              {format(currentMonth, 'MMMM yyyy', { locale: de })}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-100 border border-green-300" />
            <span>Verfügbar</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-100 border border-red-300" />
            <span>Nicht verfügbar</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-300" />
            <span>Teilweise gebucht</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Week day headers */}
          {weekDays.map(day => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}

          {/* Empty cells for days before month start */}
          {Array.from({ length: adjustedStartDay }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Month days */}
          {monthDays.map(day => {
            const key = format(day, 'yyyy-MM-dd');
            const dayData = availability.get(key);
            const isPast = isBefore(day, new Date()) && !isToday(day);
            const hasBookings = dayData && dayData.slotsBooked > 0;
            const isFullyBooked = dayData && dayData.slotsBooked >= dayData.slotsTotal;

            let bgColor = 'bg-muted';
            if (!isPast && dayData) {
              if (!dayData.available) {
                bgColor = 'bg-red-100 border-red-300';
              } else if (isFullyBooked) {
                bgColor = 'bg-orange-100 border-orange-300';
              } else if (hasBookings) {
                bgColor = 'bg-yellow-100 border-yellow-300';
              } else {
                bgColor = 'bg-green-100 border-green-300';
              }
            }

            return (
              <button
                key={key}
                onClick={() => toggleAvailability(day)}
                disabled={isPast}
                className={`aspect-square rounded-lg border p-1 text-center transition-colors ${bgColor} ${
                  isPast ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80 cursor-pointer'
                } ${isToday(day) ? 'ring-2 ring-primary' : ''}`}
              >
                <div className="text-sm font-medium">{format(day, 'd')}</div>
                {dayData && dayData.available && !isPast && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {dayData.slotsTotal - dayData.slotsBooked}/{dayData.slotsTotal}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Schnellaktionen</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newMap = new Map(availability);
                monthDays.forEach(day => {
                  if (!isBefore(day, new Date())) {
                    const key = format(day, 'yyyy-MM-dd');
                    const current = newMap.get(key);
                    if (current) {
                      newMap.set(key, { ...current, available: true, slotsTotal: 3 });
                    }
                  }
                });
                setAvailability(newMap);
                toast({ title: 'Alle Tage als verfügbar markiert' });
              }}
            >
              <Check className="h-4 w-4 mr-1" />
              Alle verfügbar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newMap = new Map(availability);
                monthDays.forEach(day => {
                  const dayOfWeek = day.getDay();
                  if ((dayOfWeek === 0 || dayOfWeek === 6) && !isBefore(day, new Date())) {
                    const key = format(day, 'yyyy-MM-dd');
                    const current = newMap.get(key);
                    if (current) {
                      newMap.set(key, { ...current, available: false, slotsTotal: 0 });
                    }
                  }
                });
                setAvailability(newMap);
                toast({ title: 'Wochenenden blockiert' });
              }}
            >
              <X className="h-4 w-4 mr-1" />
              Wochenenden blockieren
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
