import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const InstantCalculator = () => {
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleStart = () => {
    if (!fromAddress || !toAddress) {
      toast({
        title: "Bitte beide Adressen eingeben",
        variant: "destructive",
      });
      return;
    }
    navigate("/rechner");
  };

  return (
    <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-2 border-white/20">
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Umzugsrechner starten
          </h3>
          <p className="text-muted-foreground">
            In 3 Schritten zur kostenlosen Offerte
          </p>
        </div>

        {/* Step 1 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">1</span>
            Startadresse eingeben
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="z.B. Zürich, Bahnhofstrasse 1"
              value={fromAddress}
              onChange={(e) => setFromAddress(e.target.value)}
              className="pl-11 h-12 text-base"
            />
          </div>
        </div>

        {/* Step 2 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">2</span>
            Zieladresse eingeben
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="z.B. Bern, Bundesplatz 3"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              className="pl-11 h-12 text-base"
            />
          </div>
        </div>

        {/* Step 3 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">3</span>
            Umzug starten
          </label>
          <Button 
            onClick={handleStart}
            className="w-full h-14 text-lg font-bold bg-accent hover:bg-accent/90 shadow-lg"
          >
            Kostenlose Offerten erhalten
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-2 justify-center pt-2">
          <div className={`h-1.5 rounded-full flex-1 transition-colors ${fromAddress ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`h-1.5 rounded-full flex-1 transition-colors ${toAddress ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`h-1.5 rounded-full flex-1 transition-colors ${fromAddress && toAddress ? 'bg-primary' : 'bg-muted'}`} />
        </div>
      </div>
    </div>
  );
};
