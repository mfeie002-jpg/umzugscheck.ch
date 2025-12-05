import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingDown, TrendingUp, AlertTriangle, Bell, DollarSign, ArrowDown, ArrowUp } from "lucide-react";
import { toast } from "sonner";

interface PriceAlert {
  id: string;
  competitorName: string;
  service: string;
  previousPrice: number;
  currentPrice: number;
  changePercent: number;
  direction: "up" | "down";
  detectedAt: Date;
  region: string;
}

interface CompetitorPriceAlertsProps {
  providerId: string;
}

export function CompetitorPriceAlerts({ providerId }: CompetitorPriceAlertsProps) {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [priceThreshold, setPriceThreshold] = useState(10);
  const [emailNotifications, setEmailNotifications] = useState(true);

  useEffect(() => {
    // Simulated price alerts data
    setAlerts([
      {
        id: "1",
        competitorName: "SwissMove AG",
        service: "Privatumzug",
        previousPrice: 1200,
        currentPrice: 1080,
        changePercent: -10,
        direction: "down",
        detectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        region: "Zürich"
      },
      {
        id: "2",
        competitorName: "Berner Umzüge",
        service: "Firmenumzug",
        previousPrice: 2500,
        currentPrice: 2750,
        changePercent: 10,
        direction: "up",
        detectedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        region: "Bern"
      },
      {
        id: "3",
        competitorName: "Express Zügelservice",
        service: "Reinigung",
        previousPrice: 450,
        currentPrice: 380,
        changePercent: -15.5,
        direction: "down",
        detectedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        region: "Basel"
      }
    ]);
  }, [providerId]);

  const handleSaveSettings = () => {
    toast.success("Preisalarm-Einstellungen gespeichert");
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(alerts.filter(a => a.id !== alertId));
    toast.success("Alert geschlossen");
  };

  const formatTimeAgo = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return "vor weniger als 1 Stunde";
    if (hours === 1) return "vor 1 Stunde";
    if (hours < 24) return `vor ${hours} Stunden`;
    return `vor ${Math.floor(hours / 24)} Tag(en)`;
  };

  return (
    <div className="space-y-6">
      {/* Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Preisalarm-Einstellungen
          </CardTitle>
          <CardDescription>
            Erhalten Sie Benachrichtigungen wenn Wettbewerber ihre Preise ändern
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Preisalarme aktivieren</Label>
              <p className="text-sm text-muted-foreground">
                Überwache Preisänderungen der Konkurrenz
              </p>
            </div>
            <Switch
              checked={alertsEnabled}
              onCheckedChange={setAlertsEnabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>E-Mail-Benachrichtigungen</Label>
              <p className="text-sm text-muted-foreground">
                Erhalte Alerts per E-Mail
              </p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <div className="space-y-2">
            <Label>Schwellenwert für Benachrichtigung (%)</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={priceThreshold}
                onChange={(e) => setPriceThreshold(Number(e.target.value))}
                className="w-24"
                min={1}
                max={50}
              />
              <span className="text-sm text-muted-foreground">
                Benachrichtigung bei Preisänderung ab {priceThreshold}%
              </span>
            </div>
          </div>

          <Button onClick={handleSaveSettings}>
            Einstellungen speichern
          </Button>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Aktive Preisalarme
            {alerts.length > 0 && (
              <Badge variant="secondary">{alerts.length}</Badge>
            )}
          </CardTitle>
          <CardDescription>
            Aktuelle Preisänderungen Ihrer Wettbewerber
          </CardDescription>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Keine aktuellen Preisalarme</p>
              <p className="text-sm">Sie werden benachrichtigt wenn sich Preise ändern</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border ${
                    alert.direction === "down"
                      ? "border-red-200 bg-red-50"
                      : "border-green-200 bg-green-50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${
                        alert.direction === "down"
                          ? "bg-red-100"
                          : "bg-green-100"
                      }`}>
                        {alert.direction === "down" ? (
                          <TrendingDown className="h-5 w-5 text-red-600" />
                        ) : (
                          <TrendingUp className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold">{alert.competitorName}</div>
                        <div className="text-sm text-muted-foreground">
                          {alert.service} • {alert.region}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm line-through text-muted-foreground">
                            CHF {alert.previousPrice}
                          </span>
                          {alert.direction === "down" ? (
                            <ArrowDown className="h-4 w-4 text-red-500" />
                          ) : (
                            <ArrowUp className="h-4 w-4 text-green-500" />
                          )}
                          <span className="font-semibold">
                            CHF {alert.currentPrice}
                          </span>
                          <Badge variant={alert.direction === "down" ? "destructive" : "default"}>
                            {alert.changePercent > 0 ? "+" : ""}{alert.changePercent.toFixed(1)}%
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatTimeAgo(alert.detectedAt)}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissAlert(alert.id)}
                    >
                      Schliessen
                    </Button>
                  </div>
                  
                  {alert.direction === "down" && (
                    <div className="mt-3 p-2 bg-amber-100 rounded text-sm text-amber-800">
                      <strong>Empfehlung:</strong> Überprüfen Sie Ihre Preise für {alert.service} in {alert.region}. 
                      Ein Wettbewerber hat die Preise um {Math.abs(alert.changePercent).toFixed(1)}% gesenkt.
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Market Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Marktübersicht</CardTitle>
          <CardDescription>
            Preisvergleich mit Wettbewerbern in Ihren Regionen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { service: "Privatumzug (2-Zimmer)", yourPrice: 890, avgPrice: 950, minPrice: 780, maxPrice: 1200 },
              { service: "Privatumzug (3-Zimmer)", yourPrice: 1350, avgPrice: 1400, minPrice: 1100, maxPrice: 1800 },
              { service: "Firmenumzug (klein)", yourPrice: 2200, avgPrice: 2500, minPrice: 1900, maxPrice: 3200 },
              { service: "Endreinigung", yourPrice: 380, avgPrice: 420, minPrice: 320, maxPrice: 550 }
            ].map((item, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{item.service}</span>
                  <Badge variant={item.yourPrice <= item.avgPrice ? "default" : "secondary"}>
                    {item.yourPrice <= item.avgPrice ? "Wettbewerbsfähig" : "Über Durchschnitt"}
                  </Badge>
                </div>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Ihr Preis</span>
                    <div className="font-semibold">CHF {item.yourPrice}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Durchschnitt</span>
                    <div>CHF {item.avgPrice}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Min</span>
                    <div>CHF {item.minPrice}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Max</span>
                    <div>CHF {item.maxPrice}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
