/**
 * Mini Offer Form for Navigation Dropdown
 * Compact form with Von/Nach fields + CTA
 * Used in Umzugsfirmen MegaMenu
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface MiniOfferFormProps {
  onClose?: () => void;
  selectedRegion?: { name: string; slug: string; type: 'canton' | 'city' } | null;
  className?: string;
}

export const MiniOfferForm = ({ onClose, selectedRegion, className }: MiniOfferFormProps) => {
  const navigate = useNavigate();
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState(selectedRegion?.name || "");
  const [error, setError] = useState<string | null>(null);

  // Update toLocation when selectedRegion changes
  if (selectedRegion?.name && toLocation !== selectedRegion.name) {
    setToLocation(selectedRegion.name);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fromLocation.trim() || !toLocation.trim()) {
      setError("Bitte Von und Nach ausfüllen");
      return;
    }

    // Navigate to offer flow with query params
    const params = new URLSearchParams({
      from: fromLocation.trim(),
      to: toLocation.trim(),
      source: 'nav',
      menu: 'umzugsfirmen'
    });

    onClose?.();
    navigate(`/umzugsofferten?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-3", className)}>
      <div className="space-y-2">
        <Label htmlFor="nav-from" className="text-xs font-medium text-muted-foreground">
          Von (PLZ oder Ort)
        </Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="nav-from"
            placeholder="z.B. Zürich, 8001"
            value={fromLocation}
            onChange={(e) => setFromLocation(e.target.value)}
            className="pl-9 h-10 text-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="nav-to" className="text-xs font-medium text-muted-foreground">
          Nach (PLZ oder Ort)
        </Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
          <Input
            id="nav-to"
            placeholder="z.B. Zug, 6300"
            value={toLocation}
            onChange={(e) => setToLocation(e.target.value)}
            className="pl-9 h-10 text-sm"
          />
        </div>
      </div>

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}

      <Button 
        type="submit" 
        className="w-full h-11 font-bold gradient-cta text-white shadow-strong"
      >
        Gratis Offerten erhalten
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>

      <p className="text-[10px] text-center text-muted-foreground">
        ✓ 100% kostenlos · ✓ Unverbindlich · ✓ In 2 Minuten
      </p>
    </form>
  );
};
