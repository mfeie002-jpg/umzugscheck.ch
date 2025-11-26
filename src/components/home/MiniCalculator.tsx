import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, MapPin } from 'lucide-react';

export const MiniCalculator = () => {
  const [fromAddress, setFromAddress] = useState('');
  const [toAddress, setToAddress] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromAddress && toAddress) {
      navigate('/rechner');
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-border/50 max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {/* From Address */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Startadresse (PLZ oder Ort)"
              value={fromAddress}
              onChange={(e) => setFromAddress(e.target.value)}
              className="pl-10 h-12 border-border/50 focus:border-primary"
            />
          </div>

          {/* To Address */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Zieladresse (PLZ oder Ort)"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              className="pl-10 h-12 border-border/50 focus:border-primary"
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md hover:shadow-lg transition-all group"
        >
          Jetzt vergleichen
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground mt-4">
        100% kostenlos & unverbindlich • Keine versteckten Kosten
      </p>
    </div>
  );
};
