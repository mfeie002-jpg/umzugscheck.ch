import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings, 
  Plus, 
  Trash2, 
  MapPin, 
  Building, 
  DollarSign,
  Clock,
  Filter,
  ArrowRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AssignmentRule {
  id: string;
  name: string;
  enabled: boolean;
  priority: number;
  conditions: {
    type: 'region' | 'rooms' | 'value' | 'service' | 'time';
    operator: 'equals' | 'contains' | 'greater' | 'less' | 'between';
    value: string | number | [number, number];
  }[];
  action: {
    type: 'assign' | 'notify' | 'auto_bid' | 'reject';
    params?: any;
  };
}

const defaultRules: AssignmentRule[] = [
  {
    id: '1',
    name: 'Lokale Leads Zürich',
    enabled: true,
    priority: 1,
    conditions: [
      { type: 'region', operator: 'equals', value: 'ZH' },
    ],
    action: { type: 'auto_bid', params: { amount: 35 } },
  },
  {
    id: '2',
    name: 'Premium Leads',
    enabled: true,
    priority: 2,
    conditions: [
      { type: 'rooms', operator: 'greater', value: 4 },
      { type: 'value', operator: 'greater', value: 2000 },
    ],
    action: { type: 'notify', params: { urgent: true } },
  },
  {
    id: '3',
    name: 'Expressanfragen',
    enabled: false,
    priority: 3,
    conditions: [
      { type: 'time', operator: 'less', value: 7 },
    ],
    action: { type: 'assign' },
  },
];

export const LeadAssignmentRules = () => {
  const { toast } = useToast();
  const [rules, setRules] = useState<AssignmentRule[]>(defaultRules);
  const [isAddingRule, setIsAddingRule] = useState(false);

  const toggleRule = (ruleId: string) => {
    setRules(prev =>
      prev.map(rule =>
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
  };

  const deleteRule = (ruleId: string) => {
    setRules(prev => prev.filter(rule => rule.id !== ruleId));
    toast({
      title: 'Regel gelöscht',
      description: 'Die Zuweisungsregel wurde entfernt.',
    });
  };

  const getConditionIcon = (type: string) => {
    switch (type) {
      case 'region': return <MapPin className="h-4 w-4" />;
      case 'rooms': return <Building className="h-4 w-4" />;
      case 'value': return <DollarSign className="h-4 w-4" />;
      case 'time': return <Clock className="h-4 w-4" />;
      default: return <Filter className="h-4 w-4" />;
    }
  };

  const getConditionText = (condition: AssignmentRule['conditions'][0]) => {
    const operators: Record<string, string> = {
      equals: '=',
      contains: 'enthält',
      greater: '>',
      less: '<',
      between: 'zwischen',
    };

    const types: Record<string, string> = {
      region: 'Region',
      rooms: 'Zimmer',
      value: 'Wert (CHF)',
      service: 'Service',
      time: 'Tage bis Umzug',
    };

    return `${types[condition.type]} ${operators[condition.operator]} ${condition.value}`;
  };

  const getActionBadge = (action: AssignmentRule['action']) => {
    switch (action.type) {
      case 'assign':
        return <Badge className="bg-blue-100 text-blue-800">Auto-Zuweisung</Badge>;
      case 'notify':
        return <Badge className="bg-yellow-100 text-yellow-800">Benachrichtigung</Badge>;
      case 'auto_bid':
        return <Badge className="bg-green-100 text-green-800">Auto-Gebot: CHF {action.params?.amount}</Badge>;
      case 'reject':
        return <Badge variant="destructive">Ablehnen</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Lead-Zuweisungsregeln
            </div>
            <Button onClick={() => setIsAddingRule(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Neue Regel
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {rules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Keine Regeln definiert</p>
              <p className="text-sm">Erstellen Sie Regeln um Leads automatisch zu verarbeiten</p>
            </div>
          ) : (
            rules.map((rule, index) => (
              <div
                key={rule.id}
                className={`p-4 border rounded-lg ${rule.enabled ? 'bg-card' : 'bg-muted/50'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={() => toggleRule(rule.id)}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${!rule.enabled && 'text-muted-foreground'}`}>
                          {rule.name}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          Priorität {rule.priority}
                        </Badge>
                      </div>

                      {/* Conditions */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {rule.conditions.map((condition, condIndex) => (
                          <div key={condIndex} className="flex items-center gap-1">
                            {condIndex > 0 && (
                              <span className="text-xs text-muted-foreground mx-1">UND</span>
                            )}
                            <Badge variant="secondary" className="gap-1">
                              {getConditionIcon(condition.type)}
                              {getConditionText(condition)}
                            </Badge>
                          </div>
                        ))}
                      </div>

                      {/* Action */}
                      <div className="flex items-center gap-2 mt-3">
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        {getActionBadge(rule.action)}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteRule(rule.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Rule Builder (simplified) */}
      {isAddingRule && (
        <Card>
          <CardHeader>
            <CardTitle>Neue Regel erstellen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Regelname</Label>
              <Input placeholder="z.B. Premium Kunden" />
            </div>

            <div className="space-y-2">
              <Label>Bedingung</Label>
              <div className="flex gap-2">
                <Select defaultValue="region">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="region">Region</SelectItem>
                    <SelectItem value="rooms">Zimmer</SelectItem>
                    <SelectItem value="value">Wert</SelectItem>
                    <SelectItem value="time">Zeit</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="equals">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equals">ist gleich</SelectItem>
                    <SelectItem value="greater">größer als</SelectItem>
                    <SelectItem value="less">kleiner als</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Wert" className="flex-1" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Aktion</Label>
              <Select defaultValue="notify">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="assign">Automatisch zuweisen</SelectItem>
                  <SelectItem value="notify">Benachrichtigung senden</SelectItem>
                  <SelectItem value="auto_bid">Automatisch bieten</SelectItem>
                  <SelectItem value="reject">Ablehnen</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsAddingRule(false)} className="flex-1">
                Abbrechen
              </Button>
              <Button
                onClick={() => {
                  toast({ title: 'Regel erstellt' });
                  setIsAddingRule(false);
                }}
                className="flex-1"
              >
                Regel speichern
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card>
        <CardContent className="pt-6">
          <h4 className="font-medium mb-2">💡 Tipps für effektive Regeln</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Regeln werden nach Priorität ausgeführt (1 = höchste)</li>
            <li>• Kombinieren Sie mehrere Bedingungen für präzisere Filterung</li>
            <li>• Nutzen Sie Auto-Gebote für Regionen mit hoher Konversionsrate</li>
            <li>• Aktivieren Sie Benachrichtigungen für Premium-Leads</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
