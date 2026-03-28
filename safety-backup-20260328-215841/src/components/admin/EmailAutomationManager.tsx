import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Mail, Clock, Users, Star, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface EmailAutomation {
  id: string;
  name: string;
  description: string;
  trigger: string;
  enabled: boolean;
  lastSent?: string;
  totalSent: number;
}

export const EmailAutomationManager = () => {
  const [automations, setAutomations] = useState<EmailAutomation[]>([
    {
      id: "1",
      name: "Anbieter Willkommens-Email",
      description: "Automatische Willkommens-Email bei Registrierung neuer Anbieter",
      trigger: "provider_signup",
      enabled: true,
      lastSent: "2024-01-15",
      totalSent: 45
    },
    {
      id: "2",
      name: "Lead Benachrichtigung",
      description: "Benachrichtigung an Anbieter bei neuen zugewiesenen Leads",
      trigger: "lead_assigned",
      enabled: true,
      lastSent: "2024-01-16",
      totalSent: 234
    },
    {
      id: "3",
      name: "Bewertungs-Anfrage",
      description: "Automatische Review-Anfrage 7 Tage nach abgeschlossenem Umzug",
      trigger: "job_completed",
      enabled: true,
      lastSent: "2024-01-14",
      totalSent: 67
    },
    {
      id: "4",
      name: "Performance Report",
      description: "Wöchentlicher Performance-Report für Anbieter",
      trigger: "weekly_schedule",
      enabled: false,
      totalSent: 12
    },
    {
      id: "5",
      name: "Preis-Alarm",
      description: "Benachrichtigung bei Preisänderungen in gewählten Regionen",
      trigger: "price_change",
      enabled: true,
      lastSent: "2024-01-16",
      totalSent: 89
    }
  ]);

  const handleToggle = (id: string) => {
    setAutomations(automations.map(auto => 
      auto.id === id ? { ...auto, enabled: !auto.enabled } : auto
    ));
    toast.success("Automation aktualisiert");
  };

  const getIcon = (trigger: string) => {
    switch (trigger) {
      case "provider_signup": return <Users className="h-5 w-5 text-blue-500" />;
      case "lead_assigned": return <Mail className="h-5 w-5 text-green-500" />;
      case "job_completed": return <Star className="h-5 w-5 text-yellow-500" />;
      case "weekly_schedule": return <Clock className="h-5 w-5 text-purple-500" />;
      case "price_change": return <TrendingUp className="h-5 w-5 text-orange-500" />;
      default: return <Mail className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Email Automation Verwaltung
          </CardTitle>
          <CardDescription>
            Automatische Email-Workflows für Anbieter und Kunden
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {automations.map((automation) => (
              <div
                key={automation.id}
                className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/5 transition-colors"
              >
                <div className="p-2 rounded-lg bg-accent/10">
                  {getIcon(automation.trigger)}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{automation.name}</h4>
                    <Badge variant={automation.enabled ? "default" : "secondary"}>
                      {automation.enabled ? "Aktiv" : "Inaktiv"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {automation.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                    <span>Gesamt gesendet: {automation.totalSent}</span>
                    {automation.lastSent && (
                      <span>Zuletzt: {new Date(automation.lastSent).toLocaleDateString('de-CH')}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Label htmlFor={`automation-${automation.id}`} className="sr-only">
                    {automation.name} aktivieren/deaktivieren
                  </Label>
                  <Switch
                    id={`automation-${automation.id}`}
                    checked={automation.enabled}
                    onCheckedChange={() => handleToggle(automation.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
