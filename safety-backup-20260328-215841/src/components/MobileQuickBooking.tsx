import { useState } from 'react';
import { Calendar, MapPin, Package, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BottomSheet from './BottomSheet';
import { useNavigate } from 'react-router-dom';

interface MobileQuickBookingProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileQuickBooking({ isOpen, onClose }: MobileQuickBookingProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    serviceType: '',
    rooms: '',
    from: '',
    to: '',
  });

  const handleContinue = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Navigate to full booking with prefilled data
      navigate('/booking', { state: formData });
      onClose();
    }
  };

  const canContinue = () => {
    if (step === 1) return formData.serviceType !== '';
    if (step === 2) return formData.rooms !== '';
    if (step === 3) return formData.from !== '' && formData.to !== '';
    return true;
  };

  return (
    <BottomSheet 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Schnell-Buchung"
      snapPoints={[0.6, 0.85]}
    >
      <div className="p-4">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                s < step ? 'bg-alpine text-white' :
                s === step ? 'bg-primary text-primary-foreground' : 
                'bg-muted text-muted-foreground'
              }`}>
                {s < step ? <Check className="h-4 w-4" /> : s}
              </div>
              {s < 3 && (
                <div className={`w-16 h-1 mx-2 rounded ${s < step ? 'bg-alpine' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Service Type */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <Package className="h-10 w-10 mx-auto text-primary mb-2" />
              <h3 className="font-semibold">Welchen Service benötigen Sie?</h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {['Privatumzug', 'Büroumzug', 'Spezialumzug'].map((service) => (
                <Button
                  key={service}
                  variant={formData.serviceType === service ? 'default' : 'outline'}
                  className="h-14 justify-start px-4"
                  onClick={() => setFormData({ ...formData, serviceType: service })}
                >
                  {service}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Rooms */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <Calendar className="h-10 w-10 mx-auto text-primary mb-2" />
              <h3 className="font-semibold">Wie viele Zimmer?</h3>
            </div>
            <Select value={formData.rooms} onValueChange={(v) => setFormData({ ...formData, rooms: v })}>
              <SelectTrigger className="h-14">
                <SelectValue placeholder="Zimmeranzahl wählen" />
              </SelectTrigger>
              <SelectContent>
                {['1 Zimmer (Studio)', '2 Zimmer', '3 Zimmer', '4 Zimmer', '5 Zimmer', '6+ Zimmer'].map((r, i) => (
                  <SelectItem key={i} value={String(i + 1)}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Step 3: Addresses */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <MapPin className="h-10 w-10 mx-auto text-primary mb-2" />
              <h3 className="font-semibold">Von wo nach wo?</h3>
            </div>
            <div>
              <Label className="text-xs">Auszugsadresse</Label>
              <Input
                value={formData.from}
                onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                placeholder="z.B. 8001 Zürich"
                className="mt-1 h-12"
              />
            </div>
            <div>
              <Label className="text-xs">Einzugsadresse</Label>
              <Input
                value={formData.to}
                onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                placeholder="z.B. 4051 Basel"
                className="mt-1 h-12"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1 h-12">
              Zurück
            </Button>
          )}
          <Button 
            onClick={handleContinue} 
            disabled={!canContinue()}
            className="flex-1 h-12"
          >
            {step === 3 ? 'Zur Buchung' : 'Weiter'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}