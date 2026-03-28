import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { CalendarDays, Clock, Check } from "lucide-react";
import { format, addDays, isSameDay, isWeekend } from "date-fns";
import { de } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

const timeSlots = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
];

const bookedSlots: Record<string, string[]> = {
  // Simulated booked slots
};

export default function AppointmentScheduler() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today || isWeekend(date);
  };

  const getAvailableSlots = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const booked = bookedSlots[dateKey] || [];
    return timeSlots.filter((slot) => !booked.includes(slot));
  };

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) return;
    
    setConfirmed(true);
    toast.success("Termin erfolgreich gebucht!", {
      description: `${format(selectedDate, "EEEE, d. MMMM yyyy", { locale: de })} um ${selectedTime} Uhr`,
    });
  };

  const handleReset = () => {
    setSelectedDate(undefined);
    setSelectedTime(null);
    setConfirmed(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5" />
          Besichtigungstermin vereinbaren
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {confirmed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Termin bestätigt!</h3>
              <p className="text-muted-foreground mb-4">
                {selectedDate && format(selectedDate, "EEEE, d. MMMM yyyy", { locale: de })}
                <br />
                um {selectedTime} Uhr
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Sie erhalten eine Bestätigung per E-Mail.
              </p>
              <Button variant="outline" onClick={handleReset}>
                Neuen Termin buchen
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 gap-6"
            >
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  Datum wählen
                </h4>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setSelectedTime(null);
                  }}
                  disabled={isDateDisabled}
                  locale={de}
                  className="rounded-lg border"
                />
              </div>

              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Uhrzeit wählen
                </h4>
                {selectedDate ? (
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-2">
                      {getAvailableSlots(selectedDate).map((slot) => (
                        <Button
                          key={slot}
                          variant={selectedTime === slot ? "default" : "outline"}
                          className="w-full justify-start"
                          onClick={() => setSelectedTime(slot)}
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          {slot} Uhr
                        </Button>
                      ))}
                      {getAvailableSlots(selectedDate).length === 0 && (
                        <p className="text-center text-muted-foreground py-4">
                          Keine verfügbaren Zeiten
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Bitte wählen Sie zuerst ein Datum
                  </div>
                )}
              </div>

              {selectedDate && selectedTime && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="md:col-span-2"
                >
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 mb-4">
                    <p className="text-sm">
                      <strong>Gewählter Termin:</strong>{" "}
                      {format(selectedDate, "EEEE, d. MMMM yyyy", { locale: de })} um{" "}
                      {selectedTime} Uhr
                    </p>
                  </div>
                  <Button onClick={handleConfirm} className="w-full">
                    Termin bestätigen
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}