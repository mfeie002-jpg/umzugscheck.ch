import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Zap, Plus, Edit2, Trash2, Settings } from "lucide-react";
import { BiddingRule } from "@/lib/auto-bidding";

export function AutoBiddingRules() {
  const [rules, setRules] = useState<BiddingRule[]>([
    {
      id: '1',
      providerId: 'provider-1',
      name: 'Zürich Premium Leads',
      enabled: true,
      maxBidAmount: 50,
      filters: {
        minVolume: 30,
        maxVolume: 100,
        regions: ['ZH', 'ZG'],
        minScore: 70,
      },
      strategy: 'aggressive',
      createdAt: new Date(),
    },
  ]);

  const [showNewRuleForm, setShowNewRuleForm] = useState(false);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Auto-Bieten Regeln
              </CardTitle>
              <CardDescription>
                Automatisch auf passende Leads bieten basierend auf Ihren Kriterien
              </CardDescription>
            </div>
            <Button onClick={() => setShowNewRuleForm(!showNewRuleForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Neue Regel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {rules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Zap className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Keine Auto-Bieten Regeln konfiguriert</p>
              <Button variant="outline" className="mt-4" onClick={() => setShowNewRuleForm(true)}>
                Erste Regel erstellen
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className="border rounded-lg p-4 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{rule.name}</span>
                        <Badge variant={rule.enabled ? "default" : "secondary"}>
                          {rule.enabled ? 'Aktiv' : 'Inaktiv'}
                        </Badge>
                        <Badge variant="outline">
                          {rule.strategy === 'aggressive' ? 'Aggressiv' :
                           rule.strategy === 'balanced' ? 'Ausgewogen' : 'Konservativ'}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>Max. Gebot: <strong>CHF {rule.maxBidAmount}</strong></div>
                        {rule.filters.minVolume && rule.filters.maxVolume && (
                          <div>Volumen: {rule.filters.minVolume} - {rule.filters.maxVolume} m³</div>
                        )}
                        {rule.filters.regions && rule.filters.regions.length > 0 && (
                          <div>Regionen: {rule.filters.regions.join(', ')}</div>
                        )}
                        {rule.filters.minScore && (
                          <div>Min. Score: {rule.filters.minScore}/100</div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch checked={rule.enabled} />
                      <Button variant="ghost" size="icon">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Rule Form */}
      {showNewRuleForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Neue Auto-Bieten Regel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ruleName">Regelname</Label>
              <Input id="ruleName" placeholder="z.B. Zürich Premium Leads" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxBid">Maximales Gebot (CHF)</Label>
              <Input id="maxBid" type="number" placeholder="50" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="strategy">Strategie</Label>
              <Select>
                <SelectTrigger id="strategy">
                  <SelectValue placeholder="Strategie wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aggressive">Aggressiv (10-15% über aktuelles Höchstgebot)</SelectItem>
                  <SelectItem value="balanced">Ausgewogen (5-10% über aktuelles Höchstgebot)</SelectItem>
                  <SelectItem value="conservative">Konservativ (Minimal über aktuelles Höchstgebot)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minVolume">Min. Volumen (m³)</Label>
                <Input id="minVolume" type="number" placeholder="20" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxVolume">Max. Volumen (m³)</Label>
                <Input id="maxVolume" type="number" placeholder="100" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minScore">Minimaler Match-Score</Label>
              <Input id="minScore" type="number" placeholder="70" min="0" max="100" />
              <p className="text-xs text-muted-foreground">
                Nur auf Leads bieten, die mindestens diesen Match-Score erreichen
              </p>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button className="flex-1">Regel speichern</Button>
              <Button variant="outline" onClick={() => setShowNewRuleForm(false)}>
                Abbrechen
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
