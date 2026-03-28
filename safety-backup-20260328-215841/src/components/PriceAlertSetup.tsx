import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Bell, BellRing, TrendingDown, Mail, Smartphone, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface PriceAlert {
  id: string;
  maxPrice: number;
  canton: string;
  email: string;
  phone?: string;
  isActive: boolean;
  createdAt: Date;
}

export const PriceAlertSetup = () => {
  const [maxPrice, setMaxPrice] = useState("");
  const [canton, setCanton] = useState("Zürich");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailNotify, setEmailNotify] = useState(true);
  const [smsNotify, setSmsNotify] = useState(false);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cantons = [
    "Zürich", "Bern", "Luzern", "Uri", "Schwyz", "Obwalden", "Nidwalden",
    "Glarus", "Zug", "Freiburg", "Solothurn", "Basel-Stadt", "Basel-Landschaft",
    "Schaffhausen", "Appenzell Ausserrhoden", "Appenzell Innerrhoden", "St. Gallen",
    "Graubünden", "Aargau", "Thurgau", "Tessin", "Waadt", "Wallis", "Neuenburg", "Genf", "Jura"
  ];

  const handleSubmit = async () => {
    if (!maxPrice || !email) {
      toast.error("Bitte füllen Sie alle Pflichtfelder aus");
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newAlert: PriceAlert = {
      id: Date.now().toString(),
      maxPrice: parseFloat(maxPrice),
      canton,
      email,
      phone: smsNotify ? phone : undefined,
      isActive: true,
      createdAt: new Date()
    };

    setAlerts([...alerts, newAlert]);
    setMaxPrice("");
    setEmail("");
    setPhone("");
    setIsSubmitting(false);
    toast.success("Preisalarm erfolgreich eingerichtet!");
  };

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map(a => 
      a.id === id ? { ...a, isActive: !a.isActive } : a
    ));
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
    toast.success("Preisalarm gelöscht");
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Preisalarm einrichten
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Werden Sie benachrichtigt, sobald Umzugspreise unter Ihren Wunschpreis fallen.
        </p>

        <div className="grid gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxPrice">Maximaler Preis (CHF)</Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="z.B. 1500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="canton">Region</Label>
              <select
                id="canton"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={canton}
                onChange={(e) => setCanton(e.target.value)}
              >
                {cantons.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-Mail für Benachrichtigung</Label>
            <Input
              id="email"
              type="email"
              placeholder="ihre@email.ch"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">E-Mail Benachrichtigung</span>
            </div>
            <Switch checked={emailNotify} onCheckedChange={setEmailNotify} />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">SMS Benachrichtigung</span>
            </div>
            <Switch checked={smsNotify} onCheckedChange={setSmsNotify} />
          </div>

          {smsNotify && (
            <div className="space-y-2">
              <Label htmlFor="phone">Telefonnummer</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+41 79 123 45 67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          )}

          <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full gap-2">
            <BellRing className="h-4 w-4" />
            {isSubmitting ? "Wird eingerichtet..." : "Preisalarm aktivieren"}
          </Button>
        </div>

        {alerts.length > 0 && (
          <div className="pt-4 border-t space-y-3">
            <h4 className="font-medium text-sm">Aktive Alarme</h4>
            {alerts.map(alert => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${alert.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {alert.isActive ? (
                      <BellRing className="h-4 w-4 text-green-600" />
                    ) : (
                      <Bell className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-sm">
                      Max. CHF {alert.maxPrice.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {alert.canton} • {alert.email}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={alert.isActive}
                    onCheckedChange={() => toggleAlert(alert.id)}
                  />
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deleteAlert(alert.id)}
                  >
                    ×
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

export default PriceAlertSetup;
