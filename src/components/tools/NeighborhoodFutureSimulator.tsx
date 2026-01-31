/**
 * Neighborhood Future Simulator
 * 
 * Interactive 5-10 year projection for Swiss neighborhoods
 * based on BFS scenarios and development data.
 */

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Users, 
  Building2,
  Train,
  TreePine,
  Banknote,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// BFS Scenario types
type Scenario = 'high' | 'medium' | 'low';

interface NeighborhoodProjection {
  id: string;
  city_name: string;
  canton_code: string;
  population: number | null;
  population_growth_percent: number | null;
  avg_age: number | null;
  avg_rent_3room: number | null;
  avg_rent_4room: number | null;
  infrastructure_outlook: string | null;
  development_projects: unknown;
  bfs_scenario_high: unknown;
  bfs_scenario_medium: unknown;
  bfs_scenario_low: unknown;
}

interface BfsScenario {
  pop_2030?: number;
  pop_2035?: number;
  avg_age_2030?: number;
  rent_growth_percent?: number;
}

interface DevelopmentProject {
  name: string;
  type: string;
  completion_year: number;
}

// Helper to safely parse JSONB fields
const parseScenario = (data: unknown): BfsScenario | null => {
  if (!data || typeof data !== 'object') return null;
  return data as BfsScenario;
};

const parseProjects = (data: unknown): DevelopmentProject[] => {
  if (!Array.isArray(data)) return [];
  return data as DevelopmentProject[];
};

// Canton options
const CANTONS = [
  { code: 'ZH', name: 'Zürich' },
  { code: 'BE', name: 'Bern' },
  { code: 'LU', name: 'Luzern' },
  { code: 'AG', name: 'Aargau' },
  { code: 'SG', name: 'St. Gallen' },
  { code: 'BS', name: 'Basel-Stadt' },
  { code: 'BL', name: 'Basel-Land' },
  { code: 'ZG', name: 'Zug' },
  { code: 'GE', name: 'Genf' },
  { code: 'VD', name: 'Waadt' },
];

// Default scenario data generator (when DB data is missing)
const generateScenarioData = (base: number, growthRate: number, scenario: Scenario) => {
  const multipliers = { high: 1.5, medium: 1.0, low: 0.5 };
  const m = multipliers[scenario];
  
  return [
    { year: 2025, value: base },
    { year: 2027, value: Math.round(base * (1 + growthRate * m * 0.02)) },
    { year: 2030, value: Math.round(base * (1 + growthRate * m * 0.05)) },
    { year: 2035, value: Math.round(base * (1 + growthRate * m * 0.10)) },
  ];
};

export function NeighborhoodFutureSimulator() {
  const [selectedCanton, setSelectedCanton] = useState('ZH');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number[]>([2030]);
  const [selectedScenario, setSelectedScenario] = useState<Scenario>('medium');

  // Fetch neighborhoods for selected canton
  const { data: neighborhoods, isLoading } = useQuery({
    queryKey: ['neighborhoods-future', selectedCanton],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('neighborhood_profiles')
        .select('*')
        .eq('canton_code', selectedCanton)
        .order('population', { ascending: false, nullsFirst: false })
        .limit(20);

      if (error) throw error;
      return data as NeighborhoodProjection[];
    },
  });

  // Select first city by default
  const activeCity = useMemo(() => {
    if (selectedCity) {
      return neighborhoods?.find(n => n.city_name === selectedCity);
    }
    return neighborhoods?.[0];
  }, [neighborhoods, selectedCity]);

  // Generate projection data for charts
  const projectionData = useMemo(() => {
    if (!activeCity) return { population: [], rent: [], age: [] };

    const basePop = activeCity.population || 50000;
    const baseRent = activeCity.avg_rent_3room || 2000;
    const baseAge = activeCity.avg_age || 42;
    const growthRate = activeCity.population_growth_percent || 1;

    // Use DB scenarios if available, otherwise generate
    const getScenarioValue = (key: 'pop_2030' | 'pop_2035' | 'rent_growth_percent' | 'avg_age_2030'): number | undefined => {
      const scenarioData = {
        high: parseScenario(activeCity.bfs_scenario_high),
        medium: parseScenario(activeCity.bfs_scenario_medium),
        low: parseScenario(activeCity.bfs_scenario_low),
      };
      return scenarioData[selectedScenario]?.[key];
    };

    // Population projection
    const pop2030 = getScenarioValue('pop_2030') || Math.round(basePop * (1 + growthRate * 0.05));
    const pop2035 = getScenarioValue('pop_2035') || Math.round(basePop * (1 + growthRate * 0.10));
    
    const population = [
      { year: 2025, high: basePop, medium: basePop, low: basePop },
      { year: 2027, high: Math.round(basePop * 1.03), medium: Math.round(basePop * 1.02), low: Math.round(basePop * 1.01) },
      { year: 2030, high: Math.round(pop2030 * 1.1), medium: pop2030, low: Math.round(pop2030 * 0.9) },
      { year: 2035, high: Math.round(pop2035 * 1.15), medium: pop2035, low: Math.round(pop2035 * 0.85) },
    ];

    // Rent projection (3-5% yearly increase typically)
    const rentGrowth = getScenarioValue('rent_growth_percent') || 3;
    const rent = [
      { year: 2025, high: baseRent, medium: baseRent, low: baseRent },
      { year: 2027, high: Math.round(baseRent * 1.08), medium: Math.round(baseRent * 1.06), low: Math.round(baseRent * 1.03) },
      { year: 2030, high: Math.round(baseRent * 1.20), medium: Math.round(baseRent * 1.15), low: Math.round(baseRent * 1.08) },
      { year: 2035, high: Math.round(baseRent * 1.40), medium: Math.round(baseRent * 1.28), low: Math.round(baseRent * 1.12) },
    ];

    // Age projection
    const age2030 = getScenarioValue('avg_age_2030') || baseAge + 1;
    const age = [
      { year: 2025, value: baseAge },
      { year: 2030, value: age2030 },
      { year: 2035, value: age2030 + 1 },
    ];

    return { population, rent, age };
  }, [activeCity, selectedScenario]);

  // Get projected value for selected year
  const getProjectedValue = (data: Array<{ year: number; high?: number; medium?: number; low?: number; value?: number }>, year: number) => {
    const point = data.find(d => d.year === year);
    if (!point) return null;
    return point[selectedScenario] || point.value;
  };

  const getOutlookIcon = (outlook: string | null) => {
    switch (outlook) {
      case 'expanding': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-amber-500" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[500px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Quartier-Prognose
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Wie entwickelt sich Ihr Wunschquartier bis 2035?
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <Select value={selectedCanton} onValueChange={setSelectedCanton}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Kanton" />
                </SelectTrigger>
                <SelectContent>
                  {CANTONS.map(c => (
                    <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={selectedCity || activeCity?.city_name || ''} 
                onValueChange={setSelectedCity}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Stadt wählen" />
                </SelectTrigger>
                <SelectContent>
                  {neighborhoods?.map(n => (
                    <SelectItem key={n.id} value={n.city_name}>{n.city_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {activeCity && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Chart Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Year Slider */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Prognose-Jahr</span>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {selectedYear[0]}
                </Badge>
              </div>
              <Slider
                value={selectedYear}
                onValueChange={setSelectedYear}
                min={2025}
                max={2035}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>2025</span>
                <span>2030</span>
                <span>2035</span>
              </div>
            </Card>

            {/* Scenario Tabs */}
            <Tabs value={selectedScenario} onValueChange={(v) => setSelectedScenario(v as Scenario)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="high" className="gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Hoch
                </TabsTrigger>
                <TabsTrigger value="medium" className="gap-1">
                  <Minus className="w-4 h-4" />
                  Mittel
                </TabsTrigger>
                <TabsTrigger value="low" className="gap-1">
                  <TrendingDown className="w-4 h-4" />
                  Tief
                </TabsTrigger>
              </TabsList>

              <TabsContent value={selectedScenario} className="mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Bevölkerungsentwicklung</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={projectionData.population}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="year" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))',
                            borderColor: 'hsl(var(--border))',
                          }}
                          formatter={(value: number) => [value.toLocaleString(), 'Einwohner']}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey={selectedScenario} 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={3}
                          dot={{ fill: 'hsl(var(--primary))' }}
                          name={`Szenario ${selectedScenario === 'high' ? 'Hoch' : selectedScenario === 'medium' ? 'Mittel' : 'Tief'}`}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Rent Projection */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Banknote className="w-4 h-4" />
                  Mietpreisentwicklung (3-Zimmer)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={projectionData.rent}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="year" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                      }}
                      formatter={(value: number) => [`CHF ${value.toLocaleString()}`, 'Miete/Mt.']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey={selectedScenario} 
                      stroke="hsl(var(--chart-2))" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Prognose"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-4">
            {/* Current Stats */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{activeCity.city_name} Heute</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    Bevölkerung
                  </div>
                  <span className="font-bold">
                    {activeCity.population?.toLocaleString() || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Banknote className="w-4 h-4" />
                    Ø Miete (3-Zi.)
                  </div>
                  <span className="font-bold">
                    CHF {activeCity.avg_rent_3room?.toLocaleString() || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    Ø Alter
                  </div>
                  <span className="font-bold">
                    {activeCity.avg_age || 'N/A'} Jahre
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Projection for Selected Year */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedYear[0]}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Card className="border-primary/50 bg-primary/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      Prognose {selectedYear[0]}
                    </CardTitle>
                    <Badge variant="outline" className="w-fit">
                      Szenario: {selectedScenario === 'high' ? 'Hoch' : selectedScenario === 'medium' ? 'Referenz' : 'Tief'}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Bevölkerung</span>
                      <span className="font-bold text-primary">
                        {getProjectedValue(projectionData.population, selectedYear[0])?.toLocaleString() || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Ø Miete (3-Zi.)</span>
                      <span className="font-bold text-primary">
                        CHF {getProjectedValue(projectionData.rent, selectedYear[0])?.toLocaleString() || 'N/A'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Infrastructure Outlook */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Infrastruktur-Ausblick
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-3">
                  {getOutlookIcon(activeCity.infrastructure_outlook)}
                  <span className={cn(
                    "font-medium",
                    activeCity.infrastructure_outlook === 'expanding' && "text-green-600",
                    activeCity.infrastructure_outlook === 'declining' && "text-red-600",
                    activeCity.infrastructure_outlook === 'stable' && "text-amber-600"
                  )}>
                    {activeCity.infrastructure_outlook === 'expanding' ? 'Wachsend' :
                     activeCity.infrastructure_outlook === 'declining' ? 'Rückläufig' : 'Stabil'}
                  </span>
                </div>

                {/* Development Projects */}
                {(() => {
                  const projects = parseProjects(activeCity.development_projects);
                  if (projects.length > 0) {
                    return (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">Geplante Projekte:</p>
                        {projects.map((project, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm p-2 bg-muted/30 rounded">
                            <span>{project.name}</span>
                            <Badge variant="outline" className="text-xs">{project.completion_year}</Badge>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return (
                    <p className="text-sm text-muted-foreground">
                      Keine geplanten Grossprojekte bekannt.
                    </p>
                  );
                })()}
              </CardContent>
            </Card>

            {/* Data Source */}
            <p className="text-xs text-muted-foreground text-center">
              Datenquellen: BFS Szenarien, OpenData Swiss
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default NeighborhoodFutureSimulator;
