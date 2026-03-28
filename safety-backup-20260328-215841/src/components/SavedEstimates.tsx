import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { 
  Save, Trash2, Copy, Check, Calendar, Truck, 
  ChevronDown, ChevronUp, Star, StarOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export interface SavedEstimate {
  id: string;
  name: string;
  createdAt: number;
  price: number;
  rooms: number;
  distance: number;
  floor: number;
  hasLift: boolean;
  moveType: string;
  selectedDate?: Date;
  services: {
    packing: boolean;
    assembly: boolean;
    storage: boolean;
  };
  isFavorite?: boolean;
}

interface SavedEstimatesProps {
  estimates: SavedEstimate[];
  currentPrice: number;
  onSave: (name: string) => void;
  onLoad: (estimate: SavedEstimate) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

const SavedEstimates = ({ 
  estimates, 
  currentPrice, 
  onSave, 
  onLoad, 
  onDelete,
  onToggleFavorite 
}: SavedEstimatesProps) => {
  const [saveName, setSaveName] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  const handleSave = () => {
    if (!saveName.trim()) {
      toast({
        title: "Name erforderlich",
        description: "Bitte geben Sie einen Namen für die Schätzung ein.",
        variant: "destructive",
      });
      return;
    }
    onSave(saveName.trim());
    setSaveName("");
    toast({
      title: "Gespeichert",
      description: `Schätzung "${saveName}" wurde gespeichert.`,
    });
  };

  const toggleCompare = (id: string) => {
    setSelectedForCompare(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const sortedEstimates = [...estimates].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return b.createdAt - a.createdAt;
  });

  const compareEstimates = selectedForCompare
    .map(id => estimates.find(e => e.id === id))
    .filter(Boolean) as SavedEstimate[];

  return (
    <div className="space-y-4">
      {/* Save new estimate */}
      <div className="flex gap-2">
        <input
          type="text"
          value={saveName}
          onChange={(e) => setSaveName(e.target.value)}
          placeholder="Name für Schätzung..."
          className="flex-1 px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-alpine"
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
        />
        <Button onClick={handleSave} className="gap-2 bg-alpine hover:bg-alpine/90">
          <Save className="h-4 w-4" />
          Speichern
        </Button>
      </div>

      {/* Mode toggle */}
      {estimates.length > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {estimates.length} gespeicherte Schätzungen
          </span>
          <Button
            variant={compareMode ? "secondary" : "outline"}
            size="sm"
            onClick={() => {
              setCompareMode(!compareMode);
              setSelectedForCompare([]);
            }}
          >
            {compareMode ? "Vergleich beenden" : "Vergleichen"}
          </Button>
        </div>
      )}

      {/* Compare view */}
      <AnimatePresence>
        {compareMode && selectedForCompare.length >= 2 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Card className="p-4 bg-muted/50">
              <h4 className="font-semibold mb-3">Vergleich</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {compareEstimates.map(est => (
                  <div key={est.id} className="p-3 bg-background rounded-lg border">
                    <div className="font-medium text-sm truncate">{est.name}</div>
                    <div className="text-xl font-bold text-alpine mt-1">
                      CHF {est.price.toLocaleString('de-CH')}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2 space-y-1">
                      <div>{est.rooms} Zimmer • {est.distance} km</div>
                      <div>{est.moveType === 'standard' ? 'Standard' : est.moveType === 'express' ? 'Express' : 'Premium'}</div>
                    </div>
                  </div>
                ))}
              </div>
              {compareEstimates.length >= 2 && (
                <div className="mt-3 pt-3 border-t text-sm">
                  <span className="text-muted-foreground">Preisdifferenz: </span>
                  <span className="font-medium">
                    CHF {Math.abs(compareEstimates[0].price - compareEstimates[1].price).toLocaleString('de-CH')}
                  </span>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Estimates list */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {sortedEstimates.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 text-sm">
            Noch keine Schätzungen gespeichert
          </p>
        ) : (
          sortedEstimates.map((estimate) => {
            const isExpanded = expandedId === estimate.id;
            const priceDiff = estimate.price - currentPrice;
            const isSelected = selectedForCompare.includes(estimate.id);
            
            return (
              <motion.div
                key={estimate.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card 
                  className={cn(
                    "p-3 cursor-pointer transition-all hover:border-alpine/30",
                    isSelected && "border-alpine bg-alpine/5",
                    estimate.isFavorite && "border-amber-300 dark:border-amber-700"
                  )}
                  onClick={() => compareMode ? toggleCompare(estimate.id) : setExpandedId(isExpanded ? null : estimate.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {compareMode && (
                        <div className={cn(
                          "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0",
                          isSelected ? "bg-alpine border-alpine" : "border-border"
                        )}>
                          {isSelected && <Check className="h-3 w-3 text-white" />}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{estimate.name}</span>
                          {estimate.isFavorite && (
                            <Star className="h-3 w-3 text-amber-500 fill-amber-500 shrink-0" />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(estimate.createdAt, 'dd.MM.yyyy HH:mm', { locale: de })}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-bold text-alpine">
                          CHF {estimate.price.toLocaleString('de-CH')}
                        </div>
                        {priceDiff !== 0 && (
                          <div className={cn(
                            "text-xs",
                            priceDiff > 0 ? "text-green-600" : "text-red-600"
                          )}>
                            {priceDiff > 0 ? '-' : '+'}{Math.abs(priceDiff).toLocaleString('de-CH')} vs. aktuell
                          </div>
                        )}
                      </div>
                      {!compareMode && (
                        isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {isExpanded && !compareMode && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 pt-3 border-t space-y-3">
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">{estimate.rooms} Zimmer</Badge>
                            <Badge variant="secondary">{estimate.distance} km</Badge>
                            <Badge variant="secondary">{estimate.floor}. OG</Badge>
                            <Badge variant="secondary">
                              {estimate.moveType === 'standard' ? 'Standard' : estimate.moveType === 'express' ? 'Express' : 'Premium'}
                            </Badge>
                            {estimate.hasLift && <Badge variant="secondary">Mit Lift</Badge>}
                          </div>
                          
                          {(estimate.services.packing || estimate.services.assembly || estimate.services.storage) && (
                            <div className="flex flex-wrap gap-2">
                              {estimate.services.packing && <Badge className="bg-alpine/10 text-alpine">Einpacken</Badge>}
                              {estimate.services.assembly && <Badge className="bg-alpine/10 text-alpine">Montage</Badge>}
                              {estimate.services.storage && <Badge className="bg-alpine/10 text-alpine">Lagerung</Badge>}
                            </div>
                          )}
                          
                          <div className="flex gap-2 pt-2">
                            <Button 
                              size="sm" 
                              onClick={(e) => {
                                e.stopPropagation();
                                onLoad(estimate);
                              }}
                              className="flex-1 bg-alpine hover:bg-alpine/90"
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              Laden
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleFavorite(estimate.id);
                              }}
                            >
                              {estimate.isFavorite ? (
                                <StarOff className="h-3 w-3" />
                              ) : (
                                <Star className="h-3 w-3" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(estimate.id);
                              }}
                              className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SavedEstimates;
