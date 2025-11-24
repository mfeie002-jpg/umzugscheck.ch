import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bell, BellOff, Plus, Trash2, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PriceAlert {
  id: string;
  canton_code: string;
  max_price: number;
  alert_frequency: string;
  is_active: boolean;
}

const cantons = [
  { code: "ZH", name: "Zürich" },
  { code: "BE", name: "Bern" },
  { code: "VD", name: "Waadt" },
  { code: "AG", name: "Aargau" },
  { code: "GE", name: "Genf" },
  { code: "LU", name: "Luzern" },
];

export const PriceAlerts = () => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [email, setEmail] = useState("");
  const [canton, setCanton] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    if (!email) return;
    const { data } = await supabase
      .from("price_alerts")
      .select("*")
      .eq("user_email", email)
      .order("created_at", { ascending: false });
    
    if (data) setAlerts(data);
  };

  const createAlert = async () => {
    if (!email || !canton || !maxPrice) {
      toast({
        title: "Fehlende Angaben",
        description: "Bitte füllen Sie alle Felder aus",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("price_alerts").insert({
      user_email: email,
      canton_code: canton,
      max_price: parseFloat(maxPrice),
      alert_frequency: frequency,
    });

    if (error) {
      toast({
        title: "Fehler",
        description: "Alarm konnte nicht erstellt werden",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Alarm erstellt",
        description: "Sie erhalten eine Benachrichtigung wenn der Preis sinkt",
      });
      setMaxPrice("");
      setCanton("");
      loadAlerts();
    }
    setLoading(false);
  };

  const toggleAlert = async (id: string, isActive: boolean) => {
    await supabase
      .from("price_alerts")
      .update({ is_active: !isActive })
      .eq("id", id);
    loadAlerts();
  };

  const deleteAlert = async (id: string) => {
    await supabase.from("price_alerts").delete().eq("id", id);
    toast({
      title: "Alarm gelöscht",
      description: "Der Preisalarm wurde entfernt",
    });
    loadAlerts();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Preisalarme
        </CardTitle>
        <CardDescription>
          Werden Sie benachrichtigt wenn Preise unter Ihr Limit fallen
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Create Alert Form */}
        <div className="p-4 bg-primary/5 rounded-lg border space-y-4">
          <h4 className="font-semibold text-sm">Neuer Preisalarm</h4>
          
          <div className="space-y-2">
            <Label htmlFor="alert-email">E-Mail</Label>
            <Input
              id="alert-email"
              type="email"
              placeholder="ihre.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="alert-canton">Kanton</Label>
              <Select value={canton} onValueChange={setCanton}>
                <SelectTrigger id="alert-canton">
                  <SelectValue placeholder="Wählen..." />
                </SelectTrigger>
                <SelectContent>
                  {cantons.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="alert-price">Max. Preis (CHF)</Label>
              <Input
                id="alert-price"
                type="number"
                placeholder="z.B. 1000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="alert-frequency">Benachrichtigungsfrequenz</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger id="alert-frequency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instant">Sofort</SelectItem>
                <SelectItem value="daily">Täglich</SelectItem>
                <SelectItem value="weekly">Wöchentlich</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={createAlert} disabled={loading} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Alarm erstellen
          </Button>
        </div>

        {/* Active Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground">Aktive Alarme</h4>
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-2 h-2 rounded-full ${alert.is_active ? "bg-green-500" : "bg-gray-300"}`} />
                  <div className="flex-1">
                    <div className="font-semibold">
                      {cantons.find(c => c.code === alert.canton_code)?.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Max. CHF {alert.max_price} • {alert.alert_frequency}
                    </div>
                  </div>
                  <Badge variant={alert.is_active ? "default" : "secondary"}>
                    {alert.is_active ? "Aktiv" : "Pausiert"}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleAlert(alert.id, alert.is_active)}
                  >
                    {alert.is_active ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteAlert(alert.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
