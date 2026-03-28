import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MapPin, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface InstantCalculatorProps {
  cityName?: string;
  activityMessage?: string;
}

export const InstantCalculator = ({ cityName, activityMessage }: InstantCalculatorProps = {}) => {
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
    <div className="max-w-2xl mx-auto">
      {activityMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 text-sm bg-success/10 text-success px-4 py-2 rounded-full border border-success/20">
            <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
            {activityMessage}
          </div>
        </motion.div>
      )}

      <Card className="shadow-strong border-border/50 overflow-hidden">
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-6 md:p-8">
          <div className="space-y-4">

            <div>
              <label className="text-sm font-semibold mb-2 block text-foreground">Startadresse</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder={cityName ? `z.B. Bahnhofstrasse 1, ${cityName}` : "z.B. Zürich Hauptbahnhof"}
                  value={fromAddress}
                  onChange={(e) => setFromAddress(e.target.value)}
                  className="h-12 pl-11 text-base border-2 focus:border-primary"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-semibold mb-2 block text-foreground">Zieladresse</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Neue Adresse eingeben"
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                  className="h-12 pl-11 text-base border-2 focus:border-primary"
                />
              </div>
            </div>
            
            <Button 
              onClick={handleStart}
              className="w-full h-14 text-lg font-bold bg-gradient-accent hover:opacity-90 transition-opacity shadow-accent"
            >
              Jetzt vergleichen
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
