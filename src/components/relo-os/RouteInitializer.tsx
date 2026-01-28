/**
 * Phase 1: Route Initializer
 * 
 * Captures origin/destination addresses and move date to initialize the move project.
 * First step in the "Invisible Move" journey.
 */

import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Calendar, 
  ArrowRight, 
  Home, 
  Building2,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { AddressDetails, MoveProject } from '@/lib/move-project';

export interface RouteInitializerProps {
  onComplete: (data: {
    origin: AddressDetails;
    destination: AddressDetails;
    moveDate: string;
    flexibility: MoveProject['flexibility'];
  }) => void;
  initialOrigin?: Partial<AddressDetails>;
  initialDestination?: Partial<AddressDetails>;
  isLoading?: boolean;
  className?: string;
}

const SWISS_CANTONS = [
  'ZH', 'BE', 'LU', 'UR', 'SZ', 'OW', 'NW', 'GL', 'ZG', 'FR',
  'SO', 'BS', 'BL', 'SH', 'AR', 'AI', 'SG', 'GR', 'AG', 'TG',
  'TI', 'VD', 'VS', 'NE', 'GE', 'JU'
];

export const RouteInitializer = memo(function RouteInitializer({
  onComplete,
  initialOrigin,
  initialDestination,
  isLoading = false,
  className,
}: RouteInitializerProps) {
  const [origin, setOrigin] = useState<AddressDetails>({
    street: initialOrigin?.street || '',
    streetNumber: initialOrigin?.streetNumber || '',
    postalCode: initialOrigin?.postalCode || '',
    city: initialOrigin?.city || '',
    canton: initialOrigin?.canton || 'ZH',
    floor: initialOrigin?.floor,
    hasElevator: initialOrigin?.hasElevator ?? false,
  });

  const [destination, setDestination] = useState<AddressDetails>({
    street: initialDestination?.street || '',
    streetNumber: initialDestination?.streetNumber || '',
    postalCode: initialDestination?.postalCode || '',
    city: initialDestination?.city || '',
    canton: initialDestination?.canton || 'ZH',
    floor: initialDestination?.floor,
    hasElevator: initialDestination?.hasElevator ?? false,
  });

  const [moveDate, setMoveDate] = useState('');
  const [flexibility, setFlexibility] = useState<MoveProject['flexibility']>('exact');
  const [showFloorDetails, setShowFloorDetails] = useState(false);

  const isValid = Boolean(
    origin.street &&
    origin.postalCode &&
    origin.city &&
    destination.street &&
    destination.postalCode &&
    destination.city &&
    moveDate
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onComplete({ origin, destination, moveDate, flexibility });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="border-2">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Phase 1: Route definieren
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              Invisible Move
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Von wo nach wo ziehen Sie um?
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Origin Address */}
            <AddressInput
              label="Auszugsadresse"
              icon={<Home className="h-4 w-4" />}
              address={origin}
              onChange={setOrigin}
              showFloorDetails={showFloorDetails}
            />

            {/* Arrow Divider */}
            <div className="flex justify-center">
              <div className="p-2 rounded-full bg-primary/10">
                <ArrowRight className="h-5 w-5 text-primary" />
              </div>
            </div>

            {/* Destination Address */}
            <AddressInput
              label="Einzugsadresse"
              icon={<Building2 className="h-4 w-4" />}
              address={destination}
              onChange={setDestination}
              showFloorDetails={showFloorDetails}
            />

            {/* Floor Details Toggle */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <Label htmlFor="floor-details" className="text-sm cursor-pointer">
                Stockwerk & Lift-Details angeben
              </Label>
              <Switch
                id="floor-details"
                checked={showFloorDetails}
                onCheckedChange={setShowFloorDetails}
              />
            </div>

            {/* Move Date */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Umzugsdatum
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="date"
                  value={moveDate}
                  onChange={(e) => setMoveDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="h-10"
                />
                <Select value={flexibility} onValueChange={(v: any) => setFlexibility(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exact">Genaues Datum</SelectItem>
                    <SelectItem value="flexible_week">± 1 Woche flexibel</SelectItem>
                    <SelectItem value="flexible_month">± 1 Monat flexibel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={!isValid || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Wird initialisiert...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Weiter zum Inventar
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
});

// Helper Component for Address Input
interface AddressInputProps {
  label: string;
  icon: React.ReactNode;
  address: AddressDetails;
  onChange: (address: AddressDetails) => void;
  showFloorDetails: boolean;
}

const AddressInput = memo(function AddressInput({
  label,
  icon,
  address,
  onChange,
  showFloorDetails,
}: AddressInputProps) {
  return (
    <div className="space-y-3 p-4 border rounded-lg bg-card">
      <Label className="flex items-center gap-2 text-base font-medium">
        {icon}
        {label}
      </Label>
      
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2">
          <Input
            placeholder="Strasse"
            value={address.street}
            onChange={(e) => onChange({ ...address, street: e.target.value })}
            className="h-9"
          />
        </div>
        <Input
          placeholder="Nr."
          value={address.streetNumber || ''}
          onChange={(e) => onChange({ ...address, streetNumber: e.target.value })}
          className="h-9"
        />
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <Input
          placeholder="PLZ"
          value={address.postalCode}
          onChange={(e) => onChange({ ...address, postalCode: e.target.value })}
          className="h-9"
          maxLength={4}
        />
        <Input
          placeholder="Ort"
          value={address.city}
          onChange={(e) => onChange({ ...address, city: e.target.value })}
          className="h-9 col-span-2"
        />
      </div>

      {showFloorDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="grid grid-cols-2 gap-2 pt-2"
        >
          <div>
            <Label className="text-xs text-muted-foreground">Stockwerk</Label>
            <Select
              value={address.floor?.toString() || '0'}
              onValueChange={(v) => onChange({ ...address, floor: parseInt(v) })}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((f) => (
                  <SelectItem key={f} value={f.toString()}>
                    {f === 0 ? 'EG' : `${f}. OG`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end gap-2 pb-1">
            <Switch
              checked={address.hasElevator ?? false}
              onCheckedChange={(v) => onChange({ ...address, hasElevator: v })}
            />
            <Label className="text-xs">Lift vorhanden</Label>
          </div>
        </motion.div>
      )}
    </div>
  );
});

export default RouteInitializer;
