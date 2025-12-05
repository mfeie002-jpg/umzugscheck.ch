import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin } from "lucide-react";

interface CantonData {
  code: string;
  name: string;
  count: number;
  path: string;
  labelX: number;
  labelY: number;
}

const cantonPaths: Omit<CantonData, 'count'>[] = [
  { code: "ZH", name: "Zürich", path: "M280,120 L320,100 L360,120 L350,160 L300,170 L270,150 Z", labelX: 310, labelY: 135 },
  { code: "BE", name: "Bern", path: "M150,180 L220,160 L260,200 L240,280 L160,300 L120,250 Z", labelX: 190, labelY: 230 },
  { code: "LU", name: "Luzern", path: "M240,170 L280,160 L300,190 L280,230 L240,220 L230,190 Z", labelX: 260, labelY: 195 },
  { code: "UR", name: "Uri", path: "M280,230 L310,220 L320,270 L290,310 L270,280 Z", labelX: 295, labelY: 265 },
  { code: "SZ", name: "Schwyz", path: "M300,180 L340,170 L350,210 L320,230 L290,210 Z", labelX: 320, labelY: 200 },
  { code: "OW", name: "Obwalden", path: "M240,220 L270,210 L280,250 L250,270 L230,250 Z", labelX: 255, labelY: 240 },
  { code: "NW", name: "Nidwalden", path: "M270,210 L300,200 L310,230 L280,250 L260,230 Z", labelX: 285, labelY: 225 },
  { code: "GL", name: "Glarus", path: "M350,200 L380,190 L390,230 L360,250 L340,230 Z", labelX: 365, labelY: 220 },
  { code: "ZG", name: "Zug", path: "M290,170 L320,165 L325,195 L300,200 L285,185 Z", labelX: 305, labelY: 182 },
  { code: "FR", name: "Fribourg", path: "M120,220 L170,200 L190,250 L160,300 L100,280 Z", labelX: 145, labelY: 250 },
  { code: "SO", name: "Solothurn", path: "M180,140 L230,130 L250,160 L220,180 L170,170 Z", labelX: 210, labelY: 155 },
  { code: "BS", name: "Basel-Stadt", path: "M140,80 L160,75 L165,95 L145,100 Z", labelX: 152, labelY: 88 },
  { code: "BL", name: "Basel-Land", path: "M130,95 L175,85 L190,120 L160,140 L120,125 Z", labelX: 155, labelY: 112 },
  { code: "SH", name: "Schaffhausen", path: "M260,60 L300,50 L310,80 L280,95 L250,85 Z", labelX: 280, labelY: 72 },
  { code: "AR", name: "Appenzell A.Rh.", path: "M400,130 L430,125 L435,150 L410,155 Z", labelX: 417, labelY: 140 },
  { code: "AI", name: "Appenzell I.Rh.", path: "M410,150 L430,145 L435,165 L415,170 Z", labelX: 422, labelY: 158 },
  { code: "SG", name: "St. Gallen", path: "M360,100 L420,90 L440,140 L400,180 L350,160 Z", labelX: 395, labelY: 135 },
  { code: "GR", name: "Graubünden", path: "M350,240 L450,200 L500,280 L460,360 L380,340 L340,290 Z", labelX: 420, labelY: 280 },
  { code: "AG", name: "Aargau", path: "M200,110 L260,100 L280,140 L250,170 L190,160 Z", labelX: 235, labelY: 135 },
  { code: "TG", name: "Thurgau", path: "M320,80 L380,70 L400,100 L370,130 L310,120 Z", labelX: 355, labelY: 100 },
  { code: "TI", name: "Tessin", path: "M280,340 L340,310 L380,360 L350,420 L290,410 L260,370 Z", labelX: 320, labelY: 365 },
  { code: "VD", name: "Waadt", path: "M40,260 L120,230 L150,300 L100,370 L30,340 Z", labelX: 90, labelY: 300 },
  { code: "VS", name: "Wallis", path: "M100,320 L200,290 L280,340 L220,400 L80,380 Z", labelX: 180, labelY: 345 },
  { code: "NE", name: "Neuenburg", path: "M80,200 L130,180 L150,220 L110,250 L70,230 Z", labelX: 110, labelY: 215 },
  { code: "GE", name: "Genf", path: "M20,320 L60,300 L80,340 L50,370 L10,350 Z", labelX: 45, labelY: 335 },
  { code: "JU", name: "Jura", path: "M80,120 L130,100 L150,140 L120,170 L70,150 Z", labelX: 110, labelY: 135 },
];

export const InteractiveSwissMap = () => {
  const navigate = useNavigate();
  const [cantonCounts, setCantonCounts] = useState<Record<string, number>>({});
  const [hoveredCanton, setHoveredCanton] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyCounts = async () => {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('service_areas');

        if (error) throw error;

        const counts: Record<string, number> = {};
        cantonPaths.forEach(c => counts[c.code] = 0);

        data?.forEach(company => {
          company.service_areas?.forEach((area: string) => {
            const canton = cantonPaths.find(c => 
              c.name.toLowerCase() === area.toLowerCase() ||
              c.code.toLowerCase() === area.toLowerCase()
            );
            if (canton) {
              counts[canton.code] = (counts[canton.code] || 0) + 1;
            }
          });
        });

        setCantonCounts(counts);
      } catch (error) {
        console.error('Error fetching company counts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyCounts();
  }, []);

  const getCantonColor = (code: string) => {
    const count = cantonCounts[code] || 0;
    if (hoveredCanton === code) return "hsl(var(--primary))";
    if (count === 0) return "hsl(var(--muted))";
    if (count <= 2) return "hsl(var(--primary) / 0.3)";
    if (count <= 5) return "hsl(var(--primary) / 0.5)";
    return "hsl(var(--primary) / 0.7)";
  };

  const handleCantonClick = (canton: Omit<CantonData, 'count'>) => {
    navigate(`/${canton.name.toLowerCase()}/umzugsfirmen`);
  };

  const totalCompanies = Object.values(cantonCounts).reduce((a, b) => a + b, 0);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Umzugsfirmen nach Kanton
          </CardTitle>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            {totalCompanies} Firmen
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <svg
            viewBox="0 0 520 450"
            className="w-full h-auto"
            aria-label="Interaktive Schweizer Karte"
          >
            {/* Background */}
            <rect width="520" height="450" fill="hsl(var(--background))" />
            
            {/* Canton paths */}
            {cantonPaths.map((canton) => (
              <g key={canton.code}>
                <path
                  d={canton.path}
                  fill={getCantonColor(canton.code)}
                  stroke="hsl(var(--border))"
                  strokeWidth="1"
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredCanton(canton.code)}
                  onMouseLeave={() => setHoveredCanton(null)}
                  onClick={() => handleCantonClick(canton)}
                />
                <text
                  x={canton.labelX}
                  y={canton.labelY}
                  className="text-[8px] font-medium pointer-events-none select-none"
                  fill="hsl(var(--foreground))"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {canton.code}
                </text>
              </g>
            ))}
          </svg>

          {/* Tooltip */}
          {hoveredCanton && (
            <div className="absolute top-4 right-4 bg-card border rounded-lg p-3 shadow-lg">
              <p className="font-semibold">
                {cantonPaths.find(c => c.code === hoveredCanton)?.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {cantonCounts[hoveredCanton] || 0} Umzugsfirmen
              </p>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ background: "hsl(var(--muted))" }} />
            <span>Keine</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ background: "hsl(var(--primary) / 0.3)" }} />
            <span>1-2</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ background: "hsl(var(--primary) / 0.5)" }} />
            <span>3-5</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ background: "hsl(var(--primary) / 0.7)" }} />
            <span>6+</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
