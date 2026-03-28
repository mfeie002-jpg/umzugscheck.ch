import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building2, Users, TrendingUp } from "lucide-react";

const districts = [
  { id: 1, name: "Kreis 1 (Altstadt)", companies: 8, popularity: "Sehr hoch", x: 50, y: 45 },
  { id: 2, name: "Kreis 2 (Enge)", companies: 5, popularity: "Hoch", x: 45, y: 60 },
  { id: 3, name: "Kreis 3 (Wiedikon)", companies: 6, popularity: "Hoch", x: 40, y: 55 },
  { id: 4, name: "Kreis 4 (Aussersihl)", companies: 7, popularity: "Mittel", x: 48, y: 40 },
  { id: 5, name: "Kreis 5 (Industriequartier)", companies: 4, popularity: "Mittel", x: 52, y: 35 },
  { id: 6, name: "Kreis 6 (Oberstrass)", companies: 5, popularity: "Hoch", x: 55, y: 30 },
  { id: 7, name: "Kreis 7 (Fluntern)", companies: 4, popularity: "Mittel", x: 60, y: 35 },
  { id: 8, name: "Kreis 8 (Riesbach)", companies: 3, popularity: "Mittel", x: 58, y: 50 },
  { id: 9, name: "Kreis 9 (Altstetten)", companies: 6, popularity: "Hoch", x: 30, y: 45 },
  { id: 10, name: "Kreis 10 (Höngg)", companies: 4, popularity: "Mittel", x: 35, y: 30 },
  { id: 11, name: "Kreis 11 (Oerlikon)", companies: 7, popularity: "Sehr hoch", x: 55, y: 20 },
  { id: 12, name: "Kreis 12 (Schwamendingen)", companies: 3, popularity: "Mittel", x: 65, y: 25 },
];

export const ZuerichInteractiveMap = () => {
  const [activeDistrict, setActiveDistrict] = useState<typeof districts[0] | null>(null);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Umzugsfirmen nach Stadtkreis</h2>
          <p className="text-muted-foreground">Klicken Sie auf einen Kreis für Details</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
          <Card className="relative aspect-square bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden">
            <CardContent className="p-4 h-full relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full max-w-[300px] opacity-20">
                  <circle cx="50" cy="45" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  <circle cx="50" cy="45" r="25" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  <circle cx="50" cy="45" r="15" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </svg>
              </div>

              {districts.map((district) => (
                <motion.button
                  key={district.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                    ${activeDistrict?.id === district.id ? "bg-primary text-primary-foreground scale-125 z-10" : "bg-card border border-border hover:border-primary hover:scale-110"}`}
                  style={{ left: `${district.x}%`, top: `${district.y}%` }}
                  onClick={() => setActiveDistrict(district)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {district.id}
                </motion.button>
              ))}
            </CardContent>
          </Card>

          <div>
            {activeDistrict ? (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <Card className="border-2 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <span className="text-xl font-bold text-primary">{activeDistrict.id}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{activeDistrict.name}</h3>
                        <Badge variant="outline">{activeDistrict.popularity}</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/50 rounded-lg p-3 text-center">
                        <Building2 className="h-5 w-5 mx-auto mb-1 text-primary" />
                        <p className="text-2xl font-bold">{activeDistrict.companies}</p>
                        <p className="text-xs text-muted-foreground">Umzugsfirmen</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3 text-center">
                        <TrendingUp className="h-5 w-5 mx-auto mb-1 text-success" />
                        <p className="text-2xl font-bold">{activeDistrict.popularity}</p>
                        <p className="text-xs text-muted-foreground">Nachfrage</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <div className="text-center text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>Wählen Sie einen Stadtkreis aus</p>
              </div>
            )}

            <div className="mt-6 grid grid-cols-3 gap-2">
              {districts.slice(0, 6).map((d) => (
                <button
                  key={d.id}
                  onClick={() => setActiveDistrict(d)}
                  className={`p-2 rounded-lg text-xs text-left transition-all ${activeDistrict?.id === d.id ? "bg-primary/10 border border-primary" : "bg-muted/50 hover:bg-muted"}`}
                >
                  <span className="font-medium">Kreis {d.id}</span>
                  <span className="block text-muted-foreground">{d.companies} Firmen</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
