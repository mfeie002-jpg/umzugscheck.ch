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
    <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-border/50 max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
          {/* From Address */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            <Input
              placeholder="Von (PLZ oder Ort)"
              value={fromAddress}
              onChange={(e) => setFromAddress(e.target.value)}
              className="pl-9 sm:pl-10 h-11 sm:h-12 border-border/50 focus:border-primary text-sm sm:text-base"
            />
          </div>

          {/* To Address */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            <Input
              placeholder="Nach (PLZ oder Ort)"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              className="pl-9 sm:pl-10 h-11 sm:h-12 border-border/50 focus:border-primary text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full h-11 sm:h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md hover:shadow-lg transition-all group text-sm sm:text-base"
        >
          Jetzt vergleichen
          <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>

      <p className="text-center text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-4">
        100% kostenlos & unverbindlich
      </p>
    </div>
  );
};
