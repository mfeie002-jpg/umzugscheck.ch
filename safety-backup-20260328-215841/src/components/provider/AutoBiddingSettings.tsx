import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Bot, 
  DollarSign, 
  Target, 
  Clock, 
  MapPin, 
  Building,
  Zap,
  Shield,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AutoBidRule {
  id: string;
  name: string;
  enabled: boolean;
  conditions: {
    minRooms?: number;
    maxRooms?: number;
    regions?: string[];
    services?: string[];
    minQualityScore?: number;
  };
  bidStrategy: {
    type: 'fixed' | 'percentage' | 'competitive';
    value: number;
    maxBid: number;
  };
}

export const AutoBiddingSettings = () => {
  const { toast } = useToast();
  const [isEnabled, setIsEnabled] = useState(true);
  const [dailyBudget, setDailyBudget] = useState(500);
  const [maxBidPerLead, setMaxBidPerLead] = useState(50);
  const [qualityThreshold, setQualityThreshold] = useState([60]);
  const [bidAggressiveness, setBidAggressiveness] = useState([50]);
  const [preferredRegions, setPreferredRegions] = useState<string[]>(['ZH', 'BE', 'AG']);
  const [autoIncrement, setAutoIncrement] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [rules, setRules] = useState<AutoBidRule[]>([
    {
      id: '1',
      name: 'Premium Leads',
      enabled: true,
      conditions: {
        minRooms: 4,
        minQualityScore: 80,
      },
      bidStrategy: {
        type: 'competitive',
        value: 20,
        maxBid: 75,
      },
    },
    {
      id: '2',
      name: 'Lokale Leads',
      enabled: true,
      conditions: {
        regions: ['ZH'],
      },
      bidStrategy: {
        type: 'fixed',
        value: 35,
        maxBid: 35,
      },
    },
  ]);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: 'Einstellungen gespeichert',
      description: 'Ihre Auto-Bidding Einstellungen wurden aktualisiert.',
    });
    
    setIsSaving(false);
  };

  const toggleRule = (ruleId: string) => {
    setRules(prev =>
      prev.map(rule =>
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Main Toggle */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Automatisches Bieten</h3>
                <p className="text-sm text-muted-foreground">
                  Bieten Sie automatisch auf passende Leads basierend auf Ihren Regeln
                </p>
              </div>
            </div>
            <Switch
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
            />
          </div>
        </CardContent>
      </Card>

      {isEnabled && (
        <>
          {/* Budget Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Budget & Limits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tagesbudget (CHF)</Label>
                  <Input
                    type="number"
                    value={dailyBudget}
                    onChange={(e) => setDailyBudget(parseInt(e.target.value) || 0)}
                    min={0}
                  />
                  <p className="text-xs text-muted-foreground">
                    Heute verbraucht: CHF 127 / {dailyBudget}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Max. Gebot pro Lead (CHF)</Label>
                  <Input
                    type="number"
                    value={maxBidPerLead}
                    onChange={(e) => setMaxBidPerLead(parseInt(e.target.value) || 0)}
                    min={0}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Qualitäts-Schwellenwert</Label>
                  <Badge variant="secondary">{qualityThreshold[0]}+</Badge>
                </div>
                <Slider
                  value={qualityThreshold}
                  onValueChange={setQualityThreshold}
                  max={100}
                  step={5}
                />
                <p className="text-xs text-muted-foreground">
                  Nur auf Leads mit einem Qualitäts-Score von {qualityThreshold[0]}+ bieten
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Bieter-Aggressivität</Label>
                  <Badge variant="secondary">
                    {bidAggressiveness[0] < 33 ? 'Konservativ' : bidAggressiveness[0] < 66 ? 'Ausgewogen' : 'Aggressiv'}
                  </Badge>
                </div>
                <Slider
                  value={bidAggressiveness}
                  onValueChange={setBidAggressiveness}
                  max={100}
                  step={1}
                />
              </div>
            </CardContent>
          </Card>

          {/* Smart Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Smart Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-Increment</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatisch um 5% erhöhen wenn überboten
                  </p>
                </div>
                <Switch
                  checked={autoIncrement}
                  onCheckedChange={setAutoIncrement}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Konkurrenz-Analyse</Label>
                  <p className="text-sm text-muted-foreground">
                    Gebote basierend auf Marktdaten anpassen
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Peak-Hour Boost</Label>
                  <p className="text-sm text-muted-foreground">
                    Höhere Gebote zu Stosszeiten
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Bidding Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Bidding-Regeln
                </div>
                <Button variant="outline" size="sm">
                  Regel hinzufügen
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {rules.map(rule => (
                <div
                  key={rule.id}
                  className={`p-4 border rounded-lg ${rule.enabled ? 'bg-card' : 'bg-muted/50'}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={() => toggleRule(rule.id)}
                      />
                      <span className={`font-medium ${!rule.enabled && 'text-muted-foreground'}`}>
                        {rule.name}
                      </span>
                    </div>
                    <Badge variant={rule.bidStrategy.type === 'competitive' ? 'default' : 'secondary'}>
                      {rule.bidStrategy.type === 'competitive' && <TrendingUp className="h-3 w-3 mr-1" />}
                      {rule.bidStrategy.type === 'fixed' ? 'Fest' : 
                       rule.bidStrategy.type === 'percentage' ? 'Prozentual' : 'Kompetitiv'}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2 text-sm">
                    {rule.conditions.minRooms && (
                      <Badge variant="outline">
                        <Building className="h-3 w-3 mr-1" />
                        {rule.conditions.minRooms}+ Zimmer
                      </Badge>
                    )}
                    {rule.conditions.regions?.map(region => (
                      <Badge key={region} variant="outline">
                        <MapPin className="h-3 w-3 mr-1" />
                        {region}
                      </Badge>
                    ))}
                    {rule.conditions.minQualityScore && (
                      <Badge variant="outline">
                        <Shield className="h-3 w-3 mr-1" />
                        Score {rule.conditions.minQualityScore}+
                      </Badge>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Gebotsstrategie:</span>
                    <span className="font-medium">
                      {rule.bidStrategy.type === 'fixed' 
                        ? `CHF ${rule.bidStrategy.value}` 
                        : rule.bidStrategy.type === 'competitive'
                        ? `+${rule.bidStrategy.value}% über Höchstgebot`
                        : `${rule.bidStrategy.value}% vom Leadwert`
                      }
                      {' '}(max. CHF {rule.bidStrategy.maxBid})
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Button onClick={handleSave} disabled={isSaving} className="w-full">
            {isSaving ? 'Speichern...' : 'Einstellungen speichern'}
          </Button>
        </>
      )}
    </div>
  );
};
