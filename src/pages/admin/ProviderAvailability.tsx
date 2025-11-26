import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarIcon, Plus, Save } from 'lucide-react';
import { format, addMonths, startOfMonth, endOfMonth } from 'date-fns';
import { de } from 'date-fns/locale';

interface Provider {
  id: string;
  company_name: string;
}

interface AvailabilitySlot {
  id?: string;
  date: Date;
  slots_available: number;
  slots_booked: number;
  is_available: boolean;
}

export default function ProviderAvailability() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [slots, setSlots] = useState<number>(4);
  const [isAvailable, setIsAvailable] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProviders();
  }, []);

  useEffect(() => {
    if (selectedProvider) {
      fetchAvailability();
    }
  }, [selectedProvider]);

  const fetchProviders = async () => {
    try {
      const { data, error } = await supabase
        .from('service_providers')
        .select('id, company_name')
        .eq('verification_status', 'approved')
        .order('company_name');

      if (error) throw error;
      setProviders(data || []);
    } catch (error) {
      console.error('Error fetching providers:', error);
    }
  };

  const fetchAvailability = async () => {
    try {
      const start = startOfMonth(new Date());
      const end = endOfMonth(addMonths(new Date(), 2));

      const { data, error } = await supabase
        .from('provider_availability')
        .select('*')
        .eq('provider_id', selectedProvider)
        .gte('date', start.toISOString().split('T')[0])
        .lte('date', end.toISOString().split('T')[0]);

      if (error) throw error;

      setAvailability((data || []).map(slot => ({
        id: slot.id,
        date: new Date(slot.date),
        slots_available: slot.slots_available || 0,
        slots_booked: slot.slots_booked || 0,
        is_available: slot.is_available
      })));
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  const saveAvailability = async () => {
    if (!selectedDate || !selectedProvider) return;

    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const existingSlot = availability.find(
        slot => format(slot.date, 'yyyy-MM-dd') === dateStr
      );

      if (existingSlot?.id) {
        const { error } = await supabase
          .from('provider_availability')
          .update({
            slots_available: slots,
            is_available: isAvailable
          })
          .eq('id', existingSlot.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('provider_availability')
          .insert({
            provider_id: selectedProvider,
            date: dateStr,
            slots_available: slots,
            slots_booked: 0,
            is_available: isAvailable
          });

        if (error) throw error;
      }

      toast({
        title: 'Gespeichert',
        description: 'Verfügbarkeit wurde aktualisiert',
      });

      fetchAvailability();
    } catch (error) {
      console.error('Error saving availability:', error);
      toast({
        title: 'Fehler',
        description: 'Verfügbarkeit konnte nicht gespeichert werden',
        variant: 'destructive',
      });
    }
  };

  const getAvailabilityForDate = (date: Date) => {
    return availability.find(slot => 
      format(slot.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Verfügbarkeits-Management</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Anbieter & Kalender
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Anbieter auswählen</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
              >
                <option value="">-- Anbieter wählen --</option>
                {providers.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.company_name}
                  </option>
                ))}
              </select>
            </div>

            {selectedProvider && (
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={de}
                className="rounded-md border"
                modifiers={{
                  available: (date) => {
                    const slot = getAvailabilityForDate(date);
                    return slot?.is_available && (slot.slots_available - slot.slots_booked) > 0;
                  },
                  booked: (date) => {
                    const slot = getAvailabilityForDate(date);
                    return slot?.is_available === false || 
                           (slot?.slots_available === slot?.slots_booked);
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
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Verfügbarkeit bearbeiten</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedDate && selectedProvider ? (
              <>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-medium mb-2">
                    {format(selectedDate, 'dd. MMMM yyyy', { locale: de })}
                  </p>
                  {(() => {
                    const slot = getAvailabilityForDate(selectedDate);
                    return slot && (
                      <p className="text-sm text-muted-foreground">
                        Aktuell: {slot.slots_available - slot.slots_booked} von {slot.slots_available} Slots verfügbar
                      </p>
                    );
                  })()}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="slots">Anzahl verfügbarer Slots</Label>
                    <Input
                      id="slots"
                      type="number"
                      min="0"
                      max="20"
                      value={slots}
                      onChange={(e) => setSlots(parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="available">Verfügbar</Label>
                    <Switch
                      id="available"
                      checked={isAvailable}
                      onCheckedChange={setIsAvailable}
                    />
                  </div>

                  <Button className="w-full" onClick={saveAvailability}>
                    <Save className="h-4 w-4 mr-2" />
                    Speichern
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Wählen Sie einen Anbieter und ein Datum aus</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
