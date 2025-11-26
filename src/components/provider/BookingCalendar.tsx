import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Calendar as CalendarIcon, CheckCircle, XCircle } from 'lucide-react';
import { format, addMonths, startOfMonth, endOfMonth } from 'date-fns';
import { de } from 'date-fns/locale';

interface AvailabilitySlot {
  date: Date;
  slotsAvailable: number;
  slotsBooked: number;
  isAvailable: boolean;
}

export const BookingCalendar = ({ providerId }: { providerId: string }) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAvailability();
  }, [providerId]);

  const fetchAvailability = async () => {
    try {
      const start = startOfMonth(new Date());
      const end = endOfMonth(addMonths(new Date(), 2));

      const { data, error } = await supabase
        .from('provider_availability')
        .select('*')
        .eq('provider_id', providerId)
        .gte('date', start.toISOString().split('T')[0])
        .lte('date', end.toISOString().split('T')[0]);

      if (error) throw error;

      setAvailability((data || []).map(slot => ({
        date: new Date(slot.date),
        slotsAvailable: slot.slots_available || 0,
        slotsBooked: slot.slots_booked || 0,
        isAvailable: slot.is_available
      })));
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityForDate = (date: Date) => {
    return availability.find(slot => 
      format(slot.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const selectedSlot = selectedDate ? getAvailabilityForDate(selectedDate) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Verfügbarkeit & Buchung
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={de}
              className="rounded-md border"
              modifiers={{
                available: (date) => {
                  const slot = getAvailabilityForDate(date);
                  return slot?.isAvailable && (slot.slotsAvailable - slot.slotsBooked) > 0;
                },
                booked: (date) => {
                  const slot = getAvailabilityForDate(date);
                  return slot?.isAvailable === false || 
                         (slot?.slotsAvailable === slot?.slotsBooked);
                }
              }}
              modifiersStyles={{
                available: { 
                  backgroundColor: 'hsl(var(--success) / 0.1)', 
                  color: 'hsl(var(--success))',
                  fontWeight: 'bold'
                },
                booked: { 
                  backgroundColor: 'hsl(var(--destructive) / 0.1)', 
                  color: 'hsl(var(--muted-foreground))',
                  textDecoration: 'line-through'
                }
              }}
            />

            {selectedSlot && (
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {format(selectedDate!, 'dd. MMMM yyyy', { locale: de })}
                  </span>
                  {selectedSlot.isAvailable && (selectedSlot.slotsAvailable - selectedSlot.slotsBooked) > 0 ? (
                    <Badge className="bg-success text-success-foreground">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verfügbar
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <XCircle className="h-3 w-3 mr-1" />
                      Ausgebucht
                    </Badge>
                  )}
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>Freie Slots: {selectedSlot.slotsAvailable - selectedSlot.slotsBooked} von {selectedSlot.slotsAvailable}</p>
                </div>

                {selectedSlot.isAvailable && (selectedSlot.slotsAvailable - selectedSlot.slotsBooked) > 0 && (
                  <Button className="w-full">
                    Termin für diesen Tag anfragen
                  </Button>
                )}
              </div>
            )}

            <div className="flex items-center gap-4 text-sm pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-success/10 border border-success"></div>
                <span className="text-muted-foreground">Verfügbar</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-destructive/10 border border-muted"></div>
                <span className="text-muted-foreground">Ausgebucht</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
