/**
 * Provider Availability Manager
 * Allows providers to set their availability for upcoming dates
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useProviderAuth } from '@/contexts/ProviderAuthContext';
import { Calendar as CalendarIcon, Save, CheckCircle, XCircle } from 'lucide-react';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { de } from 'date-fns/locale';
import { toast } from 'sonner';

interface AvailabilitySlot {
  id?: string;
  date: Date;
  isAvailable: boolean;
  slotsAvailable: number;
  slotsBooked: number;
  priceModifier: number;
}

export const ProviderAvailabilityManager = () => {
  const { provider } = useProviderAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availability, setAvailability] = useState<Map<string, AvailabilitySlot>>(new Map());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Current slot being edited
  const [currentSlot, setCurrentSlot] = useState<AvailabilitySlot>({
    date: new Date(),
    isAvailable: true,
    slotsAvailable: 3,
    slotsBooked: 0,
    priceModifier: 1.0,
  });

  useEffect(() => {
    if (provider?.id) {
      fetchAvailability();
    }
  }, [provider?.id]);

  useEffect(() => {
    if (selectedDate) {
      const dateKey = format(selectedDate, 'yyyy-MM-dd');
      const existing = availability.get(dateKey);
      setCurrentSlot(existing || {
        date: selectedDate,
        isAvailable: true,
        slotsAvailable: 3,
        slotsBooked: 0,
        priceModifier: 1.0,
      });
    }
  }, [selectedDate, availability]);

  const fetchAvailability = async () => {
    if (!provider?.id) return;

    try {
      setLoading(true);
      const start = startOfMonth(new Date());
      const end = endOfMonth(addDays(new Date(), 90));

      const { data, error } = await supabase
        .from('provider_availability')
        .select('*')
        .eq('provider_id', provider.id)
        .gte('date', format(start, 'yyyy-MM-dd'))
        .lte('date', format(end, 'yyyy-MM-dd'));

      if (error) throw error;

      const availMap = new Map<string, AvailabilitySlot>();
      data?.forEach(slot => {
        availMap.set(slot.date, {
          id: slot.id,
          date: new Date(slot.date),
          isAvailable: slot.is_available,
          slotsAvailable: slot.slots_available || 3,
          slotsBooked: slot.slots_booked || 0,
          priceModifier: 1.0, // Default price modifier
        });
      });

      setAvailability(availMap);
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSlot = async () => {
    if (!provider?.id || !selectedDate) return;

    try {
      setSaving(true);
      const dateKey = format(selectedDate, 'yyyy-MM-dd');
      const existing = availability.get(dateKey);

      if (existing?.id) {
        // Update existing
        const { error } = await supabase
          .from('provider_availability')
          .update({
            is_available: currentSlot.isAvailable,
            slots_available: currentSlot.slotsAvailable,
            price_modifier: currentSlot.priceModifier,
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from('provider_availability')
          .insert({
            provider_id: provider.id,
            date: dateKey,
            is_available: currentSlot.isAvailable,
            slots_available: currentSlot.slotsAvailable,
            slots_booked: 0,
            price_modifier: currentSlot.priceModifier,
          });

        if (error) throw error;
      }

      // Update local state
      setAvailability(prev => {
        const next = new Map(prev);
        next.set(dateKey, { ...currentSlot, date: selectedDate });
        return next;
      });

      toast.success('Verfügbarkeit gespeichert');
    } catch (error) {
      console.error('Error saving availability:', error);
      toast.error('Fehler beim Speichern');
    } finally {
      setSaving(false);
    }
  };

  const handleBulkSetAvailable = async (days: number, available: boolean) => {
    if (!provider?.id) return;

    try {
      setSaving(true);
      const startDate = new Date();
      const dates = eachDayOfInterval({
        start: startDate,
        end: addDays(startDate, days - 1),
      });

      const records = dates.map(date => ({
        provider_id: provider.id,
        date: format(date, 'yyyy-MM-dd'),
        is_available: available,
        slots_available: 3,
        slots_booked: 0,
        price_modifier: 1.0,
      }));

      const { error } = await supabase
        .from('provider_availability')
        .upsert(records, { onConflict: 'provider_id,date' });

      if (error) throw error;

      await fetchAvailability();
      toast.success(`${days} Tage ${available ? 'verfügbar' : 'blockiert'} gesetzt`);
    } catch (error) {
      console.error('Error bulk setting availability:', error);
      toast.error('Fehler beim Setzen der Verfügbarkeit');
    } finally {
      setSaving(false);
    }
  };

  const getDateModifiers = () => {
    const available: Date[] = [];
    const unavailable: Date[] = [];
    const partial: Date[] = [];

    availability.forEach((slot, dateKey) => {
      const date = new Date(dateKey);
      if (!slot.isAvailable) {
        unavailable.push(date);
      } else if (slot.slotsBooked >= slot.slotsAvailable) {
        unavailable.push(date);
      } else if (slot.slotsBooked > 0) {
        partial.push(date);
      } else {
        available.push(date);
      }
    });

    return { available, unavailable, partial };
  };

  const modifiers = getDateModifiers();

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Verfügbarkeit verwalten
        </CardTitle>
        <CardDescription>
          Definieren Sie Ihre verfügbaren Tage und Kapazitäten
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleBulkSetAvailable(7, true)}
            disabled={saving}
          >
            Nächste 7 Tage verfügbar
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleBulkSetAvailable(30, true)}
            disabled={saving}
          >
            Nächste 30 Tage verfügbar
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleBulkSetAvailable(7, false)}
            disabled={saving}
          >
            Nächste Woche blockieren
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Calendar */}
          <div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={de}
              className="rounded-md border"
              modifiers={{
                available: modifiers.available,
                unavailable: modifiers.unavailable,
                partial: modifiers.partial,
              }}
              modifiersStyles={{
                available: {
                  backgroundColor: 'hsl(var(--success) / 0.15)',
                  color: 'hsl(var(--success))',
                  fontWeight: 'bold',
                },
                unavailable: {
                  backgroundColor: 'hsl(var(--destructive) / 0.15)',
                  color: 'hsl(var(--muted-foreground))',
                  textDecoration: 'line-through',
                },
                partial: {
                  backgroundColor: 'hsl(var(--warning) / 0.15)',
                  color: 'hsl(var(--warning))',
                },
              }}
              disabled={(date) => date < new Date()}
            />

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-success/15 border border-success" />
                <span>Verfügbar</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-warning/15 border border-warning" />
                <span>Teilweise gebucht</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-destructive/15 border border-muted" />
                <span>Nicht verfügbar</span>
              </div>
            </div>
          </div>

          {/* Slot Editor */}
          {selectedDate && (
            <div className="space-y-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">
                  {format(selectedDate, 'EEEE, dd. MMMM yyyy', { locale: de })}
                </h3>
                {currentSlot.isAvailable ? (
                  <Badge className="bg-success/15 text-success">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verfügbar
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <XCircle className="h-3 w-3 mr-1" />
                    Blockiert
                  </Badge>
                )}
              </div>

              <div className="space-y-4">
                {/* Available Toggle */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="available">Verfügbar für Buchungen</Label>
                  <Switch
                    id="available"
                    checked={currentSlot.isAvailable}
                    onCheckedChange={(checked) =>
                      setCurrentSlot(prev => ({ ...prev, isAvailable: checked }))
                    }
                  />
                </div>

                {currentSlot.isAvailable && (
                  <>
                    {/* Slots Available */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Kapazität (Aufträge)</Label>
                        <span className="font-medium">{currentSlot.slotsAvailable}</span>
                      </div>
                      <Slider
                        value={[currentSlot.slotsAvailable]}
                        onValueChange={([value]) =>
                          setCurrentSlot(prev => ({ ...prev, slotsAvailable: value }))
                        }
                        min={1}
                        max={10}
                        step={1}
                      />
                      <p className="text-xs text-muted-foreground">
                        Wie viele Umzüge können Sie an diesem Tag bearbeiten?
                      </p>
                    </div>

                    {/* Price Modifier */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Preisanpassung</Label>
                        <span className="font-medium">
                          {currentSlot.priceModifier === 1 ? 'Standard' : 
                           `${((currentSlot.priceModifier - 1) * 100).toFixed(0)}%`}
                        </span>
                      </div>
                      <Slider
                        value={[currentSlot.priceModifier * 100]}
                        onValueChange={([value]) =>
                          setCurrentSlot(prev => ({ ...prev, priceModifier: value / 100 }))
                        }
                        min={80}
                        max={150}
                        step={5}
                      />
                      <p className="text-xs text-muted-foreground">
                        Preisaufschlag/-rabatt für diesen Tag (z.B. Wochenende)
                      </p>
                    </div>

                    {/* Currently Booked */}
                    {currentSlot.slotsBooked > 0 && (
                      <div className="p-3 bg-background rounded border">
                        <p className="text-sm">
                          <strong>{currentSlot.slotsBooked}</strong> von{' '}
                          <strong>{currentSlot.slotsAvailable}</strong> Slots bereits gebucht
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              <Button 
                onClick={handleSaveSlot} 
                disabled={saving}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Speichern...' : 'Speichern'}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
