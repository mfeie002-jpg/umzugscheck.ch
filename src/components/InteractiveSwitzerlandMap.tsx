import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Building2, TrendingUp, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CantonData {
  code: string;
  name: string;
  slug: string;
  path: string;
  labelX: number;
  labelY: number;
  companies: number;
  avgPrice: string;
}

const cantonPaths: CantonData[] = [
  { code: "ZH", name: "Zürich", slug: "zuerich", path: "M280,105 L325,90 L365,105 L355,145 L310,155 L275,140 Z", labelX: 315, labelY: 122, companies: 42, avgPrice: "CHF 1'200" },
  { code: "BE", name: "Bern", slug: "bern", path: "M145,165 L220,145 L265,185 L250,270 L165,290 L115,240 L125,180 Z", labelX: 190, labelY: 215, companies: 35, avgPrice: "CHF 1'100" },
  { code: "LU", name: "Luzern", slug: "luzern", path: "M235,155 L280,145 L305,175 L285,220 L240,210 L225,180 Z", labelX: 262, labelY: 182, companies: 28, avgPrice: "CHF 1'050" },
  { code: "UR", name: "Uri", slug: "uri", path: "M285,215 L318,205 L330,260 L298,305 L270,270 Z", labelX: 300, labelY: 255, companies: 12, avgPrice: "CHF 950" },
  { code: "SZ", name: "Schwyz", slug: "schwyz", path: "M305,165 L345,155 L358,198 L325,220 L292,200 Z", labelX: 325, labelY: 188, companies: 18, avgPrice: "CHF 1'000" },
  { code: "OW", name: "Obwalden", slug: "obwalden", path: "M238,205 L270,195 L283,240 L250,262 L228,242 Z", labelX: 255, labelY: 230, companies: 10, avgPrice: "CHF 900" },
  { code: "NW", name: "Nidwalden", slug: "nidwalden", path: "M270,195 L302,185 L315,218 L283,240 L262,218 Z", labelX: 288, labelY: 212, companies: 11, avgPrice: "CHF 920" },
  { code: "GL", name: "Glarus", slug: "glarus", path: "M358,185 L392,175 L405,218 L372,242 L348,220 Z", labelX: 375, labelY: 208, companies: 9, avgPrice: "CHF 880" },
  { code: "ZG", name: "Zug", slug: "zug", path: "M292,155 L325,150 L332,182 L305,188 L288,172 Z", labelX: 310, labelY: 170, companies: 22, avgPrice: "CHF 1'300" },
  { code: "FR", name: "Freiburg", slug: "freiburg", path: "M115,205 L168,185 L192,238 L160,290 L95,268 Z", labelX: 145, labelY: 238, companies: 26, avgPrice: "CHF 1'000" },
  { code: "SO", name: "Solothurn", slug: "solothurn", path: "M175,125 L232,115 L255,148 L222,168 L168,158 Z", labelX: 212, labelY: 142, companies: 24, avgPrice: "CHF 980" },
  { code: "BS", name: "Basel-Stadt", slug: "basel-stadt", path: "M138,68 L162,62 L168,82 L145,90 Z", labelX: 153, labelY: 76, companies: 30, avgPrice: "CHF 1'150" },
  { code: "BL", name: "Basel-Land", slug: "basel-landschaft", path: "M128,82 L175,72 L192,108 L162,130 L118,115 Z", labelX: 155, labelY: 100, companies: 28, avgPrice: "CHF 1'080" },
  { code: "SH", name: "Schaffhausen", slug: "schaffhausen", path: "M262,48 L305,38 L318,68 L285,85 L252,72 Z", labelX: 285, labelY: 62, companies: 15, avgPrice: "CHF 950" },
  { code: "AR", name: "App. A.Rh.", slug: "appenzell-ausserrhoden", path: "M408,118 L440,112 L448,140 L420,148 Z", labelX: 428, labelY: 130, companies: 12, avgPrice: "CHF 900" },
  { code: "AI", name: "App. I.Rh.", slug: "appenzell-innerrhoden", path: "M420,142 L442,135 L450,158 L428,165 Z", labelX: 435, labelY: 150, companies: 8, avgPrice: "CHF 880" },
  { code: "SG", name: "St. Gallen", slug: "st-gallen", path: "M365,88 L428,78 L452,128 L410,172 L358,152 Z", labelX: 405, labelY: 125, companies: 32, avgPrice: "CHF 1'050" },
  { code: "GR", name: "Graubünden", slug: "graubuenden", path: "M358,232 L462,192 L515,275 L472,360 L388,340 L348,285 Z", labelX: 430, labelY: 275, companies: 20, avgPrice: "CHF 1'100" },
  { code: "AG", name: "Aargau", slug: "aargau", path: "M198,98 L262,88 L285,128 L255,158 L188,148 Z", labelX: 238, labelY: 125, companies: 38, avgPrice: "CHF 1'020" },
  { code: "TG", name: "Thurgau", slug: "thurgau", path: "M325,68 L388,58 L410,90 L378,122 L318,110 Z", labelX: 362, labelY: 90, companies: 25, avgPrice: "CHF 980" },
  { code: "TI", name: "Tessin", slug: "tessin", path: "M285,335 L348,305 L392,358 L358,425 L295,412 L262,368 Z", labelX: 328, labelY: 365, companies: 27, avgPrice: "CHF 1'150" },
  { code: "VD", name: "Waadt", slug: "waadt", path: "M35,252 L118,222 L152,292 L98,368 L25,338 Z", labelX: 88, labelY: 295, companies: 36, avgPrice: "CHF 1'180" },
  { code: "VS", name: "Wallis", slug: "wallis", path: "M98,315 L205,282 L288,335 L225,402 L78,378 Z", labelX: 182, labelY: 345, companies: 29, avgPrice: "CHF 1'050" },
  { code: "NE", name: "Neuenburg", slug: "neuenburg", path: "M78,188 L130,168 L152,210 L110,242 L68,220 Z", labelX: 108, labelY: 205, companies: 19, avgPrice: "CHF 1'000" },
  { code: "GE", name: "Genf", slug: "genf", path: "M18,318 L60,298 L82,342 L50,375 L8,352 Z", labelX: 45, labelY: 338, companies: 34, avgPrice: "CHF 1'250" },
  { code: "JU", name: "Jura", slug: "jura", path: "M78,108 L132,88 L155,130 L122,162 L68,142 Z", labelX: 112, labelY: 125, companies: 13, avgPrice: "CHF 920" },
];

export const InteractiveSwitzerlandMap = () => {
  const navigate = useNavigate();
  const [hoveredCanton, setHoveredCanton] = useState<string | null>(null);
  const [selectedCanton, setSelectedCanton] = useState<CantonData | null>(null);

  const getCantonColor = (code: string) => {
    const canton = cantonPaths.find(c => c.code === code);
    const count = canton?.companies || 0;
    
    if (hoveredCanton === code) return "hsl(var(--primary))";
    if (selectedCanton?.code === code) return "hsl(var(--primary))";
    if (count >= 30) return "hsl(var(--primary) / 0.8)";
    if (count >= 20) return "hsl(var(--primary) / 0.6)";
    if (count >= 10) return "hsl(var(--primary) / 0.4)";
    return "hsl(var(--primary) / 0.25)";
  };

  const handleCantonClick = (canton: CantonData) => {
    setSelectedCanton(canton);
  };

  const handleNavigate = () => {
    if (selectedCanton) {
      navigate(`/umzugsfirmen/${selectedCanton.slug}`);
    }
  };

  const totalCompanies = cantonPaths.reduce((sum, c) => sum + c.companies, 0);

  return (
    <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-xl">Interaktive Schweizer Karte</h3>
              <p className="text-sm text-muted-foreground">Klicken Sie auf einen Kanton</p>
            </div>
          </div>
          <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
            <Building2 className="h-4 w-4" />
            <span className="font-bold">{totalCompanies}+ Firmen</span>
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-0">
        {/* Map */}
        <div className="lg:col-span-2 p-6 relative">
          <svg
            viewBox="0 0 530 450"
            className="w-full h-auto max-h-[500px]"
            aria-label="Interaktive Schweizer Karte"
          >
            {/* Background */}
            <rect width="530" height="450" fill="hsl(var(--background))" rx="8" />
            
            {/* Grid pattern */}
            <defs>
              <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="530" height="450" fill="url(#grid)" />
            
            {/* Canton paths */}
            {cantonPaths.map((canton) => (
              <motion.g key={canton.code} whileHover={{ scale: 1.02 }} style={{ transformOrigin: "center" }}>
                <motion.path
                  d={canton.path}
                  fill={getCantonColor(canton.code)}
                  stroke={hoveredCanton === canton.code || selectedCanton?.code === canton.code ? "hsl(var(--primary))" : "hsl(var(--border))"}
                  strokeWidth={hoveredCanton === canton.code || selectedCanton?.code === canton.code ? "2.5" : "1.5"}
                  className="cursor-pointer transition-colors duration-200"
                  onMouseEnter={() => setHoveredCanton(canton.code)}
                  onMouseLeave={() => setHoveredCanton(null)}
                  onClick={() => handleCantonClick(canton)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: cantonPaths.indexOf(canton) * 0.02 }}
                />
                <text
                  x={canton.labelX}
                  y={canton.labelY}
                  className="text-[9px] font-bold pointer-events-none select-none"
                  fill={hoveredCanton === canton.code || selectedCanton?.code === canton.code ? "white" : "hsl(var(--foreground))"}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {canton.code}
                </text>
              </motion.g>
            ))}

            {/* Hover tooltip on map */}
            {hoveredCanton && !selectedCanton && (
              <g>
                <rect x="380" y="15" width="140" height="60" rx="8" fill="hsl(var(--card))" stroke="hsl(var(--border))" />
                <text x="450" y="35" textAnchor="middle" className="text-xs font-bold" fill="hsl(var(--foreground))">
                  {cantonPaths.find(c => c.code === hoveredCanton)?.name}
                </text>
                <text x="450" y="55" textAnchor="middle" className="text-[10px]" fill="hsl(var(--muted-foreground))">
                  {cantonPaths.find(c => c.code === hoveredCanton)?.companies} Umzugsfirmen
                </text>
              </g>
            )}
          </svg>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4 justify-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ background: "hsl(var(--primary) / 0.25)" }} />
              <span className="text-muted-foreground">1-9 Firmen</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ background: "hsl(var(--primary) / 0.4)" }} />
              <span className="text-muted-foreground">10-19 Firmen</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ background: "hsl(var(--primary) / 0.6)" }} />
              <span className="text-muted-foreground">20-29 Firmen</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ background: "hsl(var(--primary) / 0.8)" }} />
              <span className="text-muted-foreground">30+ Firmen</span>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="border-l border-border bg-muted/30 p-6 flex flex-col">
          {selectedCanton ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-xl gradient-hero flex items-center justify-center">
                  <MapPin className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-2xl">{selectedCanton.name}</h3>
                  <p className="text-muted-foreground">Kanton {selectedCanton.code}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">Umzugsfirmen</span>
                  </div>
                  <span className="font-bold text-lg">{selectedCanton.companies}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-accent" />
                    <span className="text-muted-foreground">Ø Preis</span>
                  </div>
                  <span className="font-bold text-lg">{selectedCanton.avgPrice}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="text-muted-foreground">Bewertung</span>
                  </div>
                  <span className="font-bold text-lg">4.7/5</span>
                </div>
              </div>

              <div className="mt-auto space-y-3">
                <button
                  onClick={handleNavigate}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Building2 className="h-5 w-5" />
                  Firmen in {selectedCanton.name} ansehen
                </button>
                <button
                  onClick={() => setSelectedCanton(null)}
                  className="w-full h-10 border border-border hover:bg-muted rounded-lg transition-colors text-muted-foreground"
                >
                  Andere Region wählen
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <MapPin className="h-8 w-8 text-muted-foreground" />
              </div>
              <h4 className="font-semibold text-lg mb-2">Kanton auswählen</h4>
              <p className="text-muted-foreground text-sm max-w-[200px]">
                Klicken Sie auf einen Kanton, um Details zu den verfügbaren Umzugsfirmen zu sehen
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
