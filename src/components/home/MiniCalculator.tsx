import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, ArrowRight } from "lucide-react";

export const MiniCalculator = () => {
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromAddress && toAddress) {
      navigate("/rechner");
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Kostenloses Angebot in 3 Schritten
        </h2>
        <p className="text-muted-foreground">
          Schnell, einfach, unverbindlich
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Step 1: Von Adresse */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            1. Startadresse
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <Input
              type="text"
              placeholder="PLZ oder Ort (z.B. 8001 Zürich)"
              value={fromAddress}
              onChange={(e) => setFromAddress(e.target.value)}
              className="pl-10 h-12 bg-white border-border text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>
        </div>

        {/* Step 2: Nach Adresse */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            2. Zieladresse
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <Input
              type="text"
              placeholder="PLZ oder Ort (z.B. 3011 Bern)"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              className="pl-10 h-12 bg-white border-border text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>
        </div>

        {/* Step 3: Submit */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            3. Offerten erhalten
          </label>
          <Button 
            type="submit" 
            size="lg" 
            className="w-full h-14 gradient-cta text-white font-bold shadow-accent text-lg hover:scale-105 transition-all"
          >
            Jetzt vergleichen
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-4">
        ✓ 100% kostenlos & unverbindlich
      </p>
    </div>
  );
};
