import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, Clock, CheckCircle2, ArrowRight, Users, Truck } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface TimeSlot {
  time: string;
  available: boolean;
  crew: number;
  trucks: number;
}

interface BookingCalendarIntegrationProps {
  companyName: string;
  companyId: string;
  onClose?: () => void;
}

const generateTimeSlots = (date: Date): TimeSlot[] => {
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  const slots: TimeSlot[] = [
    { time: "07:00 - 09:00", available: !isWeekend && Math.random() > 0.3, crew: 3, trucks: 1 },
    { time: "09:00 - 11:00", available: Math.random() > 0.4, crew: 4, trucks: 2 },
    { time: "11:00 - 13:00", available: Math.random() > 0.5, crew: 3, trucks: 1 },
    { time: "13:00 - 15:00", available: Math.random() > 0.3, crew: 4, trucks: 2 },
    { time: "15:00 - 17:00", available: Math.random() > 0.4, crew: 3, trucks: 1 },
    { time: "17:00 - 19:00", available: !isWeekend && Math.random() > 0.6, crew: 2, trucks: 1 },
  ];
  
  return slots;
};

const BookingCalendarIntegration = ({ companyName, companyId, onClose }: BookingCalendarIntegrationProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<string | undefined>(undefined);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedSlot(undefined);
    if (date) {
      setTimeSlots(generateTimeSlots(date));
    }
  };

  const handleSlotSelect = (slot: string) => {
    setSelectedSlot(slot);
    toast.success(`Zeitfenster ${slot} ausgewählt`);
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + 3); // Minimum 3 days advance booking
    return date < minDate;
  };

  const availableCount = timeSlots.filter(s => s.available).length;

  return (
    <Card className="border-2 bg-white shadow-soft">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarDays className="w-5 h-5 text-primary" />
            Termin buchen
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Verfügbare Termine bei {companyName}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Calendar */}
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            locale={de}
            className="rounded-md border"
          />
        </div>

        {/* Time Slots */}
        {selectedDate && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm">
                {format(selectedDate, "EEEE, d. MMMM", { locale: de })}
              </p>
              <Badge variant="outline">
                {availableCount} Slots frei
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => slot.available && handleSlotSelect(slot.time)}
                  disabled={!slot.available}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedSlot === slot.time
                      ? "border-primary bg-primary/10"
                      : slot.available
                      ? "border-border hover:border-primary/50 bg-white"
                      : "border-border bg-muted/50 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{slot.time}</span>
                    {slot.available ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <span className="text-xs text-muted-foreground">Belegt</span>
                    )}
                  </div>
                  {slot.available && (
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {slot.crew} Helfer
                      </span>
                      <span className="flex items-center gap-1">
                        <Truck className="w-3 h-3" />
                        {slot.trucks} LKW
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Booking Summary & CTA */}
        {selectedDate && selectedSlot && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200 space-y-3">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">Ihre Auswahl</span>
            </div>
            <div className="text-sm text-green-700">
              <p>{format(selectedDate, "EEEE, d. MMMM yyyy", { locale: de })}</p>
              <p>{selectedSlot}</p>
            </div>
            <Link 
              to={`/umzugsofferten?company=${companyId}&date=${selectedDate.toISOString()}&slot=${encodeURIComponent(selectedSlot)}`}
            >
              <Button className="w-full bg-primary hover:bg-primary-dark">
                Termin anfragen
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}

        {/* No date selected hint */}
        {!selectedDate && (
          <div className="text-center py-4 text-muted-foreground text-sm">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
            Wählen Sie ein Datum, um verfügbare Zeitfenster zu sehen
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingCalendarIntegration;
