import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, ChevronLeft, ChevronRight, Check, X, Clock, Users, Settings, Plus } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isBefore, addDays } from 'date-fns';
import { de } from 'date-fns/locale';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  leadName?: string;
}

interface DayAvailability {
  date: Date;
  available: boolean;
  slotsTotal: number;
  slotsBooked: number;
  timeSlots: TimeSlot[];
  notes?: string;
}

interface Props {
  providerId: string;
}

export const AvailabilityCalendarEnhanced = ({ providerId }: Props) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState<Map<string, DayAvailability>>(new Map());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [defaultSlots, setDefaultSlots] = useState(3);
  const [workingHours, setWorkingHours] = useState({ start: '08:00', end: '18:00' });

  useEffect(() => {
    loadAvailability();
  }, [providerId, currentMonth]);

  const loadAvailability = async () => {
    setLoading(true);
    try {
      const start = startOfMonth(currentMonth);
      const end = endOfMonth(addMonths(currentMonth, 2));
      
      const { data, error } = await supabase
        .from('provider_availability')
        .select('*')
        .eq('provider_id', providerId)
        .gte('date', format(start, 'yyyy-MM-dd'))
        .lte('date', format(end, 'yyyy-MM-dd'));

      const map = new Map<string, DayAvailability>();
      const days = eachDayOfInterval({ start, end });

      days.forEach(day => {
        const key = format(day, 'yyyy-MM-dd');
        const dbRecord = data?.find(d => d.date === key);
        const isWeekend = day.getDay() === 0 || day.getDay() === 6;

        if (dbRecord) {
          map.set(key, {
            date: day,
            available: dbRecord.is_available ?? true,
            slotsTotal: dbRecord.slots_available ?? defaultSlots,
            slotsBooked: dbRecord.slots_booked ?? 0,
            timeSlots: generateTimeSlots(dbRecord.slots_available ?? defaultSlots, dbRecord.slots_booked ?? 0),
          });
        } else {
          map.set(key, {
            date: day,
            available: !isWeekend,
            slotsTotal: isWeekend ? 0 : defaultSlots,
            slotsBooked: 0,
            timeSlots: isWeekend ? [] : generateTimeSlots(defaultSlots, 0),
          });
        }
      });

      setAvailability(map);
    } catch (error) {
      console.error('Error loading availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSlots = (total: number, booked: number): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startHour = parseInt(workingHours.start.split(':')[0]);
    const hoursPerSlot = Math.floor(10 / total);

    for (let i = 0; i < total; i++) {
      const slotStart = startHour + (i * hoursPerSlot);
      slots.push({
        id: `slot-${i}`,
        startTime: `${slotStart.toString().padStart(2, '0')}:00`,
        endTime: `${(slotStart + hoursPerSlot).toString().padStart(2, '0')}:00`,
        isBooked: i < booked,
      });
    }
    return slots;
  };

  const toggleAvailability = async (date: Date) => {
    if (isBefore(date, new Date()) && !isToday(date)) return;

    const key = format(date, 'yyyy-MM-dd');
    const current = availability.get(key);

    if (current) {
      const newAvailable = !current.available;
      
      try {
        const { error } = await supabase
          .from('provider_availability')
          .upsert({
            provider_id: providerId,
            date: key,
            is_available: newAvailable,
            slots_available: newAvailable ? defaultSlots : 0,
            slots_booked: current.slotsBooked,
          });

        if (error) throw error;

        setAvailability(prev => {
          const newMap = new Map(prev);
          newMap.set(key, {
            ...current,
            available: newAvailable,
            slotsTotal: newAvailable ? defaultSlots : 0,
            timeSlots: newAvailable ? generateTimeSlots(defaultSlots, current.slotsBooked) : [],
          });
          return newMap;
        });

        toast.success(newAvailable ? 'Tag als verfügbar markiert' : 'Tag blockiert');
      } catch (error) {
        toast.error('Fehler beim Speichern');
      }
    }
  };

  const updateSlots = async (date: Date, slots: number) => {
    const key = format(date, 'yyyy-MM-dd');
    const current = availability.get(key);

    if (current) {
      try {
        const { error } = await supabase
          .from('provider_availability')
          .upsert({
            provider_id: providerId,
            date: key,
            is_available: true,
            slots_available: slots,
            slots_booked: Math.min(current.slotsBooked, slots),
          });

        if (error) throw error;

        setAvailability(prev => {
          const newMap = new Map(prev);
          newMap.set(key, {
            ...current,
            slotsTotal: slots,
            slotsBooked: Math.min(current.slotsBooked, slots),
            timeSlots: generateTimeSlots(slots, Math.min(current.slotsBooked, slots)),
          });
          return newMap;
        });

        toast.success('Kapazität aktualisiert');
      } catch (error) {
        toast.error('Fehler beim Speichern');
      }
    }
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = monthStart.getDay();
  const adjustedStartDay = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
  const weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  const selectedDayData = selectedDay ? availability.get(format(selectedDay, 'yyyy-MM-dd')) : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Verfügbarkeitskalender
            </CardTitle>
            <CardDescription>Verwalten Sie Ihre Kapazitäten und Buchungen</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Einstellungen
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Kalender-Einstellungen</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Standard-Kapazität pro Tag</Label>
                    <Select value={defaultSlots.toString()} onValueChange={v => setDefaultSlots(parseInt(v))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map(n => (
                          <SelectItem key={n} value={n.toString()}>{n} Aufträge</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Arbeitsbeginn</Label>
                      <Input 
                        type="time" 
                        value={workingHours.start}
                        onChange={e => setWorkingHours(prev => ({...prev, start: e.target.value}))}
                      />
                    </div>
                    <div>
                      <Label>Arbeitsende</Label>
                      <Input 
                        type="time" 
                        value={workingHours.end}
                        onChange={e => setWorkingHours(prev => ({...prev, end: e.target.value}))}
                      />
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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
        {/* Legend */}
        <div className="mb-4 flex items-center gap-4 text-sm flex-wrap">
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
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-100 border border-orange-300" />
            <span>Ausgebucht</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-7 gap-1">
              {weekDays.map(day => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}

              {Array.from({ length: adjustedStartDay }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {monthDays.map(day => {
                const key = format(day, 'yyyy-MM-dd');
                const dayData = availability.get(key);
                const isPast = isBefore(day, new Date()) && !isToday(day);
                const hasBookings = dayData && dayData.slotsBooked > 0;
                const isFullyBooked = dayData && dayData.slotsBooked >= dayData.slotsTotal && dayData.slotsTotal > 0;
                const isSelected = selectedDay && format(selectedDay, 'yyyy-MM-dd') === key;

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
                    onClick={() => setSelectedDay(day)}
                    disabled={isPast}
                    className={`aspect-square rounded-lg border p-1 text-center transition-colors ${bgColor} ${
                      isPast ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80 cursor-pointer'
                    } ${isToday(day) ? 'ring-2 ring-primary' : ''} ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    <div className="text-sm font-medium">{format(day, 'd')}</div>
                    {dayData && dayData.available && !isPast && (
                      <div className="text-xs text-muted-foreground">
                        {dayData.slotsTotal - dayData.slotsBooked}/{dayData.slotsTotal}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Schnellaktionen</h4>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    const newMap = new Map(availability);
                    for (const day of monthDays) {
                      if (!isBefore(day, new Date())) {
                        const key = format(day, 'yyyy-MM-dd');
                        const current = newMap.get(key);
                        if (current) {
                          await supabase.from('provider_availability').upsert({
                            provider_id: providerId,
                            date: key,
                            is_available: true,
                            slots_available: defaultSlots,
                            slots_booked: current.slotsBooked,
                          });
                          newMap.set(key, { ...current, available: true, slotsTotal: defaultSlots });
                        }
                      }
                    }
                    setAvailability(newMap);
                    toast.success('Alle Tage als verfügbar markiert');
                  }}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Alle verfügbar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    const newMap = new Map(availability);
                    for (const day of monthDays) {
                      const dayOfWeek = day.getDay();
                      if ((dayOfWeek === 0 || dayOfWeek === 6) && !isBefore(day, new Date())) {
                        const key = format(day, 'yyyy-MM-dd');
                        const current = newMap.get(key);
                        if (current) {
                          await supabase.from('provider_availability').upsert({
                            provider_id: providerId,
                            date: key,
                            is_available: false,
                            slots_available: 0,
                            slots_booked: current.slotsBooked,
                          });
                          newMap.set(key, { ...current, available: false, slotsTotal: 0 });
                        }
                      }
                    }
                    setAvailability(newMap);
                    toast.success('Wochenenden blockiert');
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Wochenenden blockieren
                </Button>
              </div>
            </div>
          </div>

          {/* Day Details */}
          <div>
            {selectedDay && selectedDayData ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {format(selectedDay, 'EEEE, d. MMMM', { locale: de })}
                  </CardTitle>
                  <CardDescription>
                    {selectedDayData.available 
                      ? `${selectedDayData.slotsTotal - selectedDayData.slotsBooked} von ${selectedDayData.slotsTotal} Slots frei`
                      : 'Nicht verfügbar'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      variant={selectedDayData.available ? 'destructive' : 'default'}
                      size="sm"
                      className="flex-1"
                      onClick={() => toggleAvailability(selectedDay)}
                    >
                      {selectedDayData.available ? 'Blockieren' : 'Freigeben'}
                    </Button>
                  </div>

                  {selectedDayData.available && (
                    <>
                      <div>
                        <Label>Kapazität</Label>
                        <Select 
                          value={selectedDayData.slotsTotal.toString()}
                          onValueChange={v => updateSlots(selectedDay, parseInt(v))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6].map(n => (
                              <SelectItem key={n} value={n.toString()}>{n} Aufträge</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="mb-2 block">Zeitslots</Label>
                        <div className="space-y-2">
                          {selectedDayData.timeSlots.map(slot => (
                            <div 
                              key={slot.id}
                              className={`p-3 rounded-lg border ${
                                slot.isBooked ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">
                                    {slot.startTime} - {slot.endTime}
                                  </span>
                                </div>
                                <Badge variant={slot.isBooked ? 'secondary' : 'outline'}>
                                  {slot.isBooked ? 'Gebucht' : 'Frei'}
                                </Badge>
                              </div>
                              {slot.isBooked && slot.leadName && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {slot.leadName}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Wählen Sie einen Tag aus</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
