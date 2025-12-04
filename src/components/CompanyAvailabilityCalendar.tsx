import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { ChevronLeft, ChevronRight, Clock, Users, Truck } from "lucide-react";
import { format, addMonths, subMonths, isSameDay, isToday, isBefore, startOfDay } from "date-fns";
import { de } from "date-fns/locale";

interface AvailabilitySlot {
  date: Date;
  status: 'available' | 'limited' | 'booked';
  slots: number;
  price?: number;
}

interface CompanyAvailabilityCalendarProps {
  companyId: string;
  companyName: string;
  onDateSelect?: (date: Date) => void;
}

export const CompanyAvailabilityCalendar = ({
  companyId,
  companyName,
  onDateSelect
}: CompanyAvailabilityCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // Generate mock availability data
  const availability = useMemo(() => {
    const slots: AvailabilitySlot[] = [];
    const today = startOfDay(new Date());
    
    for (let i = 0; i < 60; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      const dayOfWeek = date.getDay();
      const random = Math.random();
      
      let status: 'available' | 'limited' | 'booked';
      let slotsCount: number;
      
      if (dayOfWeek === 0) {
        status = 'booked';
        slotsCount = 0;
      } else if (random < 0.3) {
        status = 'booked';
        slotsCount = 0;
      } else if (random < 0.6) {
        status = 'limited';
        slotsCount = Math.floor(Math.random() * 2) + 1;
      } else {
        status = 'available';
        slotsCount = Math.floor(Math.random() * 3) + 3;
      }
      
      slots.push({
        date,
        status,
        slots: slotsCount,
        price: 800 + Math.floor(Math.random() * 400)
      });
    }
    
    return slots;
  }, []);

  const getDateStatus = (date: Date) => {
    return availability.find(a => isSameDay(a.date, date));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    const status = getDateStatus(date);
    if (status?.status !== 'booked') {
      setSelectedDate(date);
      onDateSelect?.(date);
    }
  };

  const selectedSlot = selectedDate ? getDateStatus(selectedDate) : null;

  const modifiers = {
    available: availability.filter(a => a.status === 'available').map(a => a.date),
    limited: availability.filter(a => a.status === 'limited').map(a => a.date),
    booked: availability.filter(a => a.status === 'booked').map(a => a.date),
  };

  const modifiersStyles = {
    available: { backgroundColor: 'hsl(var(--primary) / 0.1)', color: 'hsl(var(--primary))' },
    limited: { backgroundColor: 'hsl(45 93% 47% / 0.2)', color: 'hsl(45 93% 37%)' },
    booked: { backgroundColor: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))', textDecoration: 'line-through' },
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Verfügbarkeit von {companyName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Legend */}
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary/20" />
            <span>Verfügbar</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500/30" />
            <span>Begrenzt</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted" />
            <span>Ausgebucht</span>
          </div>
        </div>

        {/* Calendar */}
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          locale={de}
          disabled={(date) => isBefore(date, startOfDay(new Date()))}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          className="rounded-md border"
        />

        {/* Selected Date Info */}
        {selectedSlot && selectedDate && (
          <div className="p-4 bg-muted/50 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {format(selectedDate, "EEEE, d. MMMM yyyy", { locale: de })}
              </span>
              <Badge variant={selectedSlot.status === 'available' ? 'default' : 'secondary'}>
                {selectedSlot.status === 'available' ? 'Verfügbar' : 'Begrenzt'}
              </Badge>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{selectedSlot.slots} Slots frei</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <span>Teams verfügbar</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-primary">
                  ab CHF {selectedSlot.price}
                </span>
              </div>
            </div>
            
            <Button className="w-full">
              Für diesen Tag anfragen
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanyAvailabilityCalendar;
