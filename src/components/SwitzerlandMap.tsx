import { useState } from "react";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Canton {
  id: string;
  name: string;
  code: string;
  path: string;
  cx: number;
  cy: number;
}

// Simplified SVG paths for Swiss cantons
const cantons: Canton[] = [
  { id: "zh", name: "Zürich", code: "ZH", path: "M 650 350 L 750 350 L 750 450 L 650 450 Z", cx: 700, cy: 400 },
  { id: "be", name: "Bern", code: "BE", path: "M 450 400 L 550 400 L 550 500 L 450 500 Z", cx: 500, cy: 450 },
  { id: "lu", name: "Luzern", code: "LU", path: "M 550 450 L 650 450 L 650 550 L 550 550 Z", cx: 600, cy: 500 },
  { id: "ur", name: "Uri", code: "UR", path: "M 650 500 L 700 500 L 700 550 L 650 550 Z", cx: 675, cy: 525 },
  { id: "sz", name: "Schwyz", code: "SZ", path: "M 700 450 L 750 450 L 750 500 L 700 500 Z", cx: 725, cy: 475 },
  { id: "ow", name: "Obwalden", code: "OW", path: "M 600 500 L 650 500 L 650 550 L 600 550 Z", cx: 625, cy: 525 },
  { id: "nw", name: "Nidwalden", code: "NW", path: "M 650 480 L 690 480 L 690 520 L 650 520 Z", cx: 670, cy: 500 },
  { id: "gl", name: "Glarus", code: "GL", path: "M 750 500 L 800 500 L 800 550 L 750 550 Z", cx: 775, cy: 525 },
  { id: "zg", name: "Zug", code: "ZG", path: "M 650 420 L 690 420 L 690 460 L 650 460 Z", cx: 670, cy: 440 },
  { id: "fr", name: "Fribourg", code: "FR", path: "M 400 450 L 450 450 L 450 500 L 400 500 Z", cx: 425, cy: 475 },
  { id: "so", name: "Solothurn", code: "SO", path: "M 500 350 L 550 350 L 550 400 L 500 400 Z", cx: 525, cy: 375 },
  { id: "bs", name: "Basel-Stadt", code: "BS", path: "M 420 300 L 450 300 L 450 330 L 420 330 Z", cx: 435, cy: 315 },
  { id: "bl", name: "Basel-Land", code: "BL", path: "M 450 300 L 500 300 L 500 350 L 450 350 Z", cx: 475, cy: 325 },
  { id: "sh", name: "Schaffhausen", code: "SH", path: "M 750 250 L 820 250 L 820 300 L 750 300 Z", cx: 785, cy: 275 },
  { id: "ar", name: "Appenzell AR", code: "AR", path: "M 820 350 L 870 350 L 870 400 L 820 400 Z", cx: 845, cy: 375 },
  { id: "ai", name: "Appenzell IR", code: "AI", path: "M 850 360 L 880 360 L 880 390 L 850 390 Z", cx: 865, cy: 375 },
  { id: "sg", name: "St. Gallen", code: "SG", path: "M 800 350 L 900 350 L 900 450 L 800 450 Z", cx: 850, cy: 400 },
  { id: "gr", name: "Graubünden", code: "GR", path: "M 750 550 L 900 550 L 900 700 L 750 700 Z", cx: 825, cy: 625 },
  { id: "ag", name: "Aargau", code: "AG", path: "M 550 300 L 650 300 L 650 400 L 550 400 Z", cx: 600, cy: 350 },
  { id: "tg", name: "Thurgau", code: "TG", path: "M 750 300 L 820 300 L 820 350 L 750 350 Z", cx: 785, cy: 325 },
  { id: "ti", name: "Ticino", code: "TI", path: "M 650 650 L 750 650 L 750 800 L 650 800 Z", cx: 700, cy: 725 },
  { id: "vd", name: "Vaud", code: "VD", path: "M 200 450 L 350 450 L 350 550 L 200 550 Z", cx: 275, cy: 500 },
  { id: "vs", name: "Valais", code: "VS", path: "M 350 550 L 550 550 L 550 650 L 350 650 Z", cx: 450, cy: 600 },
  { id: "ne", name: "Neuchâtel", code: "NE", path: "M 350 380 L 450 380 L 450 450 L 350 450 Z", cx: 400, cy: 415 },
  { id: "ge", name: "Genève", code: "GE", path: "M 150 550 L 200 550 L 200 600 L 150 600 Z", cx: 175, cy: 575 },
  { id: "ju", name: "Jura", code: "JU", path: "M 400 300 L 450 300 L 450 350 L 400 350 Z", cx: 425, cy: 325 }
];

interface SwitzerlandMapProps {
  onCantonClick: (cantonCode: string) => void;
  companyCounts?: Record<string, number>;
  highlightedCantons?: string[];
}

export const SwitzerlandMap = ({ 
  onCantonClick, 
  companyCounts = {},
  highlightedCantons = []
}: SwitzerlandMapProps) => {
  const [hoveredCanton, setHoveredCanton] = useState<string | null>(null);

  return (
    <div className="relative w-full bg-background/50 rounded-lg border border-border p-4">
      <svg
        viewBox="0 0 1000 850"
        className="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background */}
        <rect width="1000" height="850" fill="transparent" />

        {/* Canton paths */}
        {cantons.map((canton) => {
          const isHovered = hoveredCanton === canton.code;
          const isHighlighted = highlightedCantons.includes(canton.code);
          const count = companyCounts[canton.code] || 0;

          return (
            <g key={canton.id}>
              {/* Canton area */}
              <path
                d={canton.path}
                className={cn(
                  "transition-all duration-200 cursor-pointer stroke-border",
                  isHovered && "stroke-primary stroke-2",
                  isHighlighted && "fill-primary/20",
                  !isHighlighted && "fill-muted hover:fill-primary/10"
                )}
                strokeWidth={isHovered ? 2 : 1}
                onMouseEnter={() => setHoveredCanton(canton.code)}
                onMouseLeave={() => setHoveredCanton(null)}
                onClick={() => onCantonClick(canton.code)}
              />

              {/* Canton label */}
              {(isHovered || count > 0) && (
                <g>
                  <text
                    x={canton.cx}
                    y={canton.cy - 10}
                    textAnchor="middle"
                    className="text-xs font-semibold fill-foreground pointer-events-none"
                  >
                    {canton.code}
                  </text>
                  {count > 0 && (
                    <text
                      x={canton.cx}
                      y={canton.cy + 10}
                      textAnchor="middle"
                      className="text-xs fill-muted-foreground pointer-events-none"
                    >
                      ({count})
                    </text>
                  )}
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Hover tooltip */}
      {hoveredCanton && (
        <div className="absolute top-2 left-2 bg-popover border border-border rounded-lg px-3 py-2 shadow-lg">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">
              {cantons.find(c => c.code === hoveredCanton)?.name}
            </span>
            {companyCounts[hoveredCanton] > 0 && (
              <Badge variant="secondary" className="text-xs">
                {companyCounts[hoveredCanton]} Firmen
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-muted border border-border rounded" />
          <span>Kanton</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary/10 border border-primary rounded" />
          <span>Ausgewählt</span>
        </div>
      </div>
    </div>
  );
};
