/**
 * "Cherries & Chaff" Lead Routing Panel
 * Based on Gemini analysis: Hybrid Model strategy
 * 
 * Tier 1 (Cherries): High value, local -> Feierabendumzug (direct)
 * Tier 2 (Chaff): Low value, distant -> Marketplace (partners)
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  Cherry, 
  Wheat, 
  ArrowRight, 
  Building2, 
  Users,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LeadScenario {
  id: string;
  rooms: number;
  value: number;
  distance: number;
  urgency: 'low' | 'medium' | 'high';
}

const SAMPLE_LEADS: LeadScenario[] = [
  { id: '1', rooms: 4.5, value: 3200, distance: 15, urgency: 'high' },
  { id: '2', rooms: 2.0, value: 800, distance: 45, urgency: 'low' },
  { id: '3', rooms: 3.5, value: 2100, distance: 8, urgency: 'medium' },
  { id: '4', rooms: 1.5, value: 650, distance: 120, urgency: 'low' },
  { id: '5', rooms: 5.0, value: 4500, distance: 25, urgency: 'high' },
];

interface CherriesChaffRouterProps {
  onRouteChange?: (cherries: number, chaff: number) => void;
}

export function CherriesChaffRouter({ onRouteChange }: CherriesChaffRouterProps) {
  const [valueThreshold, setValueThreshold] = useState(2000);
  const [distanceThreshold, setDistanceThreshold] = useState(30);
  const [roomThreshold, setRoomThreshold] = useState(2.5);

  const classifyLead = (lead: LeadScenario): 'cherry' | 'chaff' => {
    if (
      lead.value >= valueThreshold && 
      lead.distance <= distanceThreshold && 
      lead.rooms >= roomThreshold
    ) {
      return 'cherry';
    }
    return 'chaff';
  };

  const cherries = SAMPLE_LEADS.filter(l => classifyLead(l) === 'cherry');
  const chaff = SAMPLE_LEADS.filter(l => classifyLead(l) === 'chaff');

  const cherryRevenue = cherries.reduce((sum, l) => sum + l.value, 0);
  const chaffRevenue = chaff.reduce((sum, l) => sum + l.value * 0.15, 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-mono uppercase tracking-wide text-muted-foreground flex items-center gap-2">
          <Target className="w-4 h-4" />
          Cherries & Chaff Lead Router (Gemini Strategy)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Explanation */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-green-50 border border-green-200 dark:bg-green-950/30 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <Cherry className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800 dark:text-green-200">Tier 1: Cherries</span>
            </div>
            <p className="text-xs text-green-700 dark:text-green-300">
              High value (≥ CHF {valueThreshold}), local (≤ {distanceThreshold}km), 
              komplex (≥ {roomThreshold} Zi.) → <strong>Feierabendumzug</strong>
            </p>
            <p className="text-xs text-green-600 mt-2">
              Akquiriert zu marginalen Medienkosten (CAC-Subsidierung)
            </p>
          </div>
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-800">
            <div className="flex items-center gap-2 mb-2">
              <Wheat className="w-5 h-5 text-amber-600" />
              <span className="font-semibold text-amber-800 dark:text-amber-200">Tier 2: Chaff</span>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-300">
              Low value, distant, oder Kapazität voll → <strong>Marketplace</strong> (Partner)
            </p>
            <p className="text-xs text-amber-600 mt-2">
              Monetarisiert via CPL oder 15% Commission
            </p>
          </div>
        </div>

        {/* Threshold Sliders */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Wert-Schwelle</span>
              <span className="font-mono">≥ CHF {valueThreshold}</span>
            </div>
            <Slider
              value={[valueThreshold]}
              onValueChange={(v) => setValueThreshold(v[0])}
              min={500}
              max={4000}
              step={100}
            />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Distanz-Schwelle</span>
              <span className="font-mono">≤ {distanceThreshold} km</span>
            </div>
            <Slider
              value={[distanceThreshold]}
              onValueChange={(v) => setDistanceThreshold(v[0])}
              min={10}
              max={100}
              step={5}
            />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Zimmer-Schwelle (Concierge)</span>
              <span className="font-mono">≥ {roomThreshold} Zi.</span>
            </div>
            <Slider
              value={[roomThreshold]}
              onValueChange={(v) => setRoomThreshold(v[0])}
              min={1}
              max={5}
              step={0.5}
            />
          </div>
        </div>

        {/* Lead Classification Demo */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted/50 p-3 border-b">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Live Lead Klassifikation (Demo)
            </span>
          </div>
          <div className="divide-y">
            {SAMPLE_LEADS.map((lead) => {
              const tier = classifyLead(lead);
              const isCherry = tier === 'cherry';
              return (
                <div 
                  key={lead.id} 
                  className={cn(
                    "p-3 flex items-center justify-between",
                    isCherry ? "bg-green-50/50 dark:bg-green-950/20" : "bg-amber-50/50 dark:bg-amber-950/20"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <span className="font-medium">{lead.rooms} Zi.</span>
                      <span className="text-muted-foreground mx-2">•</span>
                      <span className="font-mono">CHF {lead.value}</span>
                      <span className="text-muted-foreground mx-2">•</span>
                      <span>{lead.distance}km</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    {isCherry ? (
                      <Badge className="bg-green-600 gap-1">
                        <Building2 className="w-3 h-3" />
                        Feierabend
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-500 gap-1">
                        <Users className="w-3 h-3" />
                        Marketplace
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950/30">
            <div className="text-xs text-muted-foreground mb-1">Cherries</div>
            <div className="text-2xl font-bold text-green-600">{cherries.length}</div>
            <div className="text-xs font-mono text-green-700">
              CHF {cherryRevenue} (100%)
            </div>
          </div>
          <div className="text-center p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30">
            <div className="text-xs text-muted-foreground mb-1">Chaff</div>
            <div className="text-2xl font-bold text-amber-600">{chaff.length}</div>
            <div className="text-xs font-mono text-amber-700">
              CHF {chaffRevenue.toFixed(0)} (15%)
            </div>
          </div>
          <div className="text-center p-3 rounded-lg bg-primary/10">
            <div className="text-xs text-muted-foreground mb-1">Total Revenue</div>
            <div className="text-2xl font-bold text-primary">
              CHF {(cherryRevenue + chaffRevenue).toFixed(0)}
            </div>
            <div className="text-xs text-muted-foreground">Combined</div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Quelle: Gemini Strategic Analysis - "Privileged Marketplace" Model
        </p>
      </CardContent>
    </Card>
  );
}
