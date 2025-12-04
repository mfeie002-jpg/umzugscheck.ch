/**
 * Zug Interactive Map Component
 * #69-78: SVG map with location highlighting
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Users, Star, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LocationData {
  id: string;
  name: string;
  companies: number;
  avgRating: number;
  popularity: number;
  path: string;
  labelX: number;
  labelY: number;
}

const zugLocations: LocationData[] = [
  { id: "zug", name: "Zug", companies: 8, avgRating: 4.7, popularity: 95, path: "M150,120 L200,100 L220,140 L190,170 L150,160 Z", labelX: 175, labelY: 135 },
  { id: "baar", name: "Baar", companies: 6, avgRating: 4.6, popularity: 85, path: "M100,80 L150,70 L170,100 L150,130 L100,120 Z", labelX: 130, labelY: 100 },
  { id: "cham", name: "Cham", companies: 5, avgRating: 4.5, popularity: 75, path: "M60,100 L100,90 L110,130 L80,150 L50,130 Z", labelX: 80, labelY: 120 },
  { id: "steinhausen", name: "Steinhausen", companies: 3, avgRating: 4.4, popularity: 55, path: "M100,140 L140,130 L150,160 L120,180 L90,170 Z", labelX: 120, labelY: 155 },
  { id: "huenenberg", name: "Hünenberg", companies: 3, avgRating: 4.5, popularity: 50, path: "M50,130 L90,120 L100,150 L70,180 L40,160 Z", labelX: 70, labelY: 150 },
  { id: "rotkreuz", name: "Rotkreuz", companies: 4, avgRating: 4.6, popularity: 65, path: "M40,160 L70,150 L80,180 L50,200 L30,185 Z", labelX: 55, labelY: 175 },
  { id: "walchwil", name: "Walchwil", companies: 2, avgRating: 4.3, popularity: 35, path: "M200,150 L230,140 L240,180 L210,200 L190,180 Z", labelX: 215, labelY: 170 },
  { id: "oberaegeri", name: "Oberägeri", companies: 2, avgRating: 4.4, popularity: 40, path: "M240,100 L280,90 L290,130 L260,150 L230,130 Z", labelX: 260, labelY: 120 },
  { id: "unteraegeri", name: "Unterägeri", companies: 2, avgRating: 4.3, popularity: 38, path: "M220,130 L260,120 L270,160 L240,180 L210,160 Z", labelX: 240, labelY: 150 },
  { id: "menzingen", name: "Menzingen", companies: 1, avgRating: 4.2, popularity: 25, path: "M270,60 L310,50 L320,90 L290,110 L260,90 Z", labelX: 290, labelY: 80 },
  { id: "neuheim", name: "Neuheim", companies: 1, avgRating: 4.2, popularity: 20, path: "M130,50 L170,40 L180,70 L150,90 L120,75 Z", labelX: 150, labelY: 65 },
];

export const ZugInteractiveMap = () => {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>("zug");

  const selectedData = zugLocations.find(loc => loc.id === selectedLocation);

  const getLocationColor = (location: LocationData) => {
    if (location.id === selectedLocation) return "fill-primary";
    if (location.id === hoveredLocation) return "fill-primary/60";
    
    // Color based on popularity
    if (location.popularity >= 80) return "fill-primary/40";
    if (location.popularity >= 60) return "fill-primary/30";
    if (location.popularity >= 40) return "fill-primary/20";
    return "fill-primary/10";
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="grid md:grid-cols-2">
          {/* Map */}
          <div className="bg-gradient-to-br from-background to-secondary/10 p-6 relative min-h-[300px]">
            <svg
              viewBox="0 0 350 230"
              className="w-full h-full"
            >
              {/* Zugersee */}
              <ellipse
                cx="180"
                cy="140"
                rx="30"
                ry="50"
                className="fill-blue-200/50 stroke-blue-300"
                strokeWidth="1"
              />
              <text x="180" y="145" textAnchor="middle" className="text-[8px] fill-blue-500">
                Zugersee
              </text>

              {/* Location areas */}
              {zugLocations.map((location) => (
                <motion.g
                  key={location.id}
                  onMouseEnter={() => setHoveredLocation(location.id)}
                  onMouseLeave={() => setHoveredLocation(null)}
                  onClick={() => setSelectedLocation(location.id)}
                  className="cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  style={{ transformOrigin: `${location.labelX}px ${location.labelY}px` }}
                >
                  <motion.path
                    d={location.path}
                    className={`${getLocationColor(location)} stroke-border transition-colors`}
                    strokeWidth="1.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: zugLocations.indexOf(location) * 0.05 }}
                  />
                  <text
                    x={location.labelX}
                    y={location.labelY}
                    textAnchor="middle"
                    className={`text-[9px] font-medium pointer-events-none ${
                      location.id === selectedLocation ? "fill-primary-foreground" : "fill-foreground"
                    }`}
                  >
                    {location.name}
                  </text>
                  
                  {/* Company count indicator */}
                  <circle
                    cx={location.labelX + 20}
                    cy={location.labelY - 8}
                    r="8"
                    className="fill-background stroke-border"
                    strokeWidth="1"
                  />
                  <text
                    x={location.labelX + 20}
                    y={location.labelY - 5}
                    textAnchor="middle"
                    className="text-[7px] font-bold fill-primary"
                  >
                    {location.companies}
                  </text>
                </motion.g>
              ))}
            </svg>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-primary/40" />
                <span>Hohe Nachfrage</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-primary/20" />
                <span>Niedrig</span>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="p-6 bg-muted/30">
            {selectedData ? (
              <motion.div
                key={selectedData.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-bold">{selectedData.name}</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background rounded-lg p-3">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">Umzugsfirmen</span>
                    </div>
                    <p className="text-2xl font-bold">{selectedData.companies}</p>
                  </div>

                  <div className="bg-background rounded-lg p-3">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Star className="w-4 h-4" />
                      <span className="text-sm">Ø Bewertung</span>
                    </div>
                    <p className="text-2xl font-bold">{selectedData.avgRating}</p>
                  </div>
                </div>

                <div className="bg-background rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm">Nachfrage</span>
                    </div>
                    <Badge variant={selectedData.popularity >= 70 ? "default" : "secondary"}>
                      {selectedData.popularity >= 80 ? "Sehr hoch" :
                       selectedData.popularity >= 60 ? "Hoch" :
                       selectedData.popularity >= 40 ? "Mittel" : "Normal"}
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <motion.div
                      className="bg-primary h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedData.popularity}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  Klicke auf einen Ort in der Karte, um Details zu sehen. 
                  Die Zahl zeigt die Anzahl verfügbarer Umzugsfirmen.
                </p>
              </motion.div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <MapPin className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>Wähle einen Ort auf der Karte</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
