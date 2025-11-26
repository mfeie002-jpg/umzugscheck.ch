import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import { Info, DollarSign, MousePointer, Phone, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PricingSettingsProps {
  providerId: string;
}

export const PricingSettings = ({ providerId }: PricingSettingsProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [settings, setSettings] = useState({
    cpl_enabled: false,
    cpc_enabled: false,
    call_tracking_enabled: false,
    cpl_price_chf: 25.00,
    cpc_price_chf: 1.50,
    call_price_chf: 5.00,
    bidding_active: false,
    max_bid_chf: 0.00,
    daily_budget_chf: 100.00,
    daily_budget_remaining_chf: 100.00,
    quality_score: 0.50,
    sponsored_tier: 0,
  });

  useEffect(() => {
    fetchSettings();
  }, [providerId]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('service_providers')
        .select('cpl_enabled, cpc_enabled, call_tracking_enabled, cpl_price_chf, cpc_price_chf, call_price_chf, bidding_active, max_bid_chf, daily_budget_chf, daily_budget_remaining_chf, quality_score, sponsored_tier')
        .eq('id', providerId)
        .single();

      if (error) throw error;
      if (data) {
        setSettings({
          cpl_enabled: data.cpl_enabled || false,
          cpc_enabled: data.cpc_enabled || false,
          call_tracking_enabled: data.call_tracking_enabled || false,
          cpl_price_chf: data.cpl_price_chf || 25.00,
          cpc_price_chf: data.cpc_price_chf || 1.50,
          call_price_chf: data.call_price_chf || 5.00,
          bidding_active: data.bidding_active || false,
          max_bid_chf: data.max_bid_chf || 0.00,
          daily_budget_chf: data.daily_budget_chf || 100.00,
          daily_budget_remaining_chf: data.daily_budget_remaining_chf || 100.00,
          quality_score: data.quality_score || 0.50,
          sponsored_tier: data.sponsored_tier || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching pricing settings:', error);
      toast({
        title: "Fehler",
        description: "Preiseinstellungen konnten nicht geladen werden.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('service_providers')
        .update({
          cpl_enabled: settings.cpl_enabled,
          cpc_enabled: settings.cpc_enabled,
          call_tracking_enabled: settings.call_tracking_enabled,
          cpl_price_chf: settings.cpl_price_chf,
          cpc_price_chf: settings.cpc_price_chf,
          call_price_chf: settings.call_price_chf,
          bidding_active: settings.bidding_active,
          max_bid_chf: settings.max_bid_chf,
          daily_budget_chf: settings.daily_budget_chf,
        })
        .eq('id', providerId);

      if (error) throw error;

      toast({
        title: "Gespeichert",
        description: "Preiseinstellungen wurden erfolgreich aktualisiert.",
      });
    } catch (error) {
      console.error('Error saving pricing settings:', error);
      toast({
        title: "Fehler",
        description: "Preiseinstellungen konnten nicht gespeichert werden.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Lade Einstellungen...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Quality Score Display */}
      <Alert>
        <Info className="w-4 h-4" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <span>Ihr Qualitätsscore: <strong>{(settings.quality_score * 100).toFixed(0)}%</strong></span>
            {settings.sponsored_tier > 0 && (
              <Badge variant="secondary">Gesponsert (Stufe {settings.sponsored_tier})</Badge>
            )}
          </div>
          <p className="text-xs mt-1 text-muted-foreground">
            Basierend auf Bewertungen, Profilvollständigkeit und Leistung
          </p>
        </AlertDescription>
      </Alert>

      {/* Cost Per Lead (CPL) */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold">Cost Per Lead (CPL)</h3>
              <p className="text-sm text-muted-foreground">Bezahlen pro zugewiesenem Lead</p>
            </div>
          </div>
          <Switch
            checked={settings.cpl_enabled}
            onCheckedChange={(checked) => setSettings({ ...settings, cpl_enabled: checked })}
          />
        </div>

        {settings.cpl_enabled && (
          <div className="space-y-4 mt-4 pt-4 border-t">
            <div>
              <Label>Preis pro Lead (CHF)</Label>
              <Input
                type="number"
                step="0.50"
                min="10"
                max="100"
                value={settings.cpl_price_chf}
                onChange={(e) => setSettings({ ...settings, cpl_price_chf: parseFloat(e.target.value) })}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Empfohlen: CHF 20-40 pro Lead
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Cost Per Click (CPC) */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <MousePointer className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-bold">Cost Per Click (CPC)</h3>
              <p className="text-sm text-muted-foreground">Bezahlen pro Klick auf Ihr Profil</p>
            </div>
          </div>
          <Switch
            checked={settings.cpc_enabled}
            onCheckedChange={(checked) => setSettings({ ...settings, cpc_enabled: checked })}
          />
        </div>

        {settings.cpc_enabled && (
          <div className="space-y-4 mt-4 pt-4 border-t">
            <div>
              <Label>Preis pro Klick (CHF)</Label>
              <Input
                type="number"
                step="0.10"
                min="0.50"
                max="10"
                value={settings.cpc_price_chf}
                onChange={(e) => setSettings({ ...settings, cpc_price_chf: parseFloat(e.target.value) })}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Empfohlen: CHF 1-3 pro Klick
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Call Tracking */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
              <Phone className="w-5 h-5 text-success" />
            </div>
            <div>
              <h3 className="font-bold">Anruf-Tracking</h3>
              <p className="text-sm text-muted-foreground">Bezahlen pro Anruf</p>
            </div>
          </div>
          <Switch
            checked={settings.call_tracking_enabled}
            onCheckedChange={(checked) => setSettings({ ...settings, call_tracking_enabled: checked })}
          />
        </div>

        {settings.call_tracking_enabled && (
          <div className="space-y-4 mt-4 pt-4 border-t">
            <div>
              <Label>Preis pro Anruf (CHF)</Label>
              <Input
                type="number"
                step="0.50"
                min="2"
                max="20"
                value={settings.call_price_chf}
                onChange={(e) => setSettings({ ...settings, call_price_chf: parseFloat(e.target.value) })}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Empfohlen: CHF 3-8 pro Anruf
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Bidding / Sponsored */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h3 className="font-bold">Gesponserte Platzierung</h3>
              <p className="text-sm text-muted-foreground">Erscheinen Sie ganz oben in Rankings</p>
            </div>
          </div>
          <Switch
            checked={settings.bidding_active}
            onCheckedChange={(checked) => setSettings({ ...settings, bidding_active: checked })}
          />
        </div>

        {settings.bidding_active && (
          <div className="space-y-4 mt-4 pt-4 border-t">
            <div>
              <Label>Maximales Gebot pro Lead/Klick (CHF)</Label>
              <div className="flex items-center gap-4 mt-2">
                <Slider
                  value={[settings.max_bid_chf]}
                  onValueChange={([value]) => setSettings({ ...settings, max_bid_chf: value })}
                  min={0}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="font-bold min-w-[60px] text-right">CHF {settings.max_bid_chf.toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Höheres Gebot × Qualitätsscore = bessere Platzierung
              </p>
            </div>

            <div>
              <Label>Tagesbudget (CHF)</Label>
              <Input
                type="number"
                step="10"
                min="50"
                max="1000"
                value={settings.daily_budget_chf}
                onChange={(e) => setSettings({ ...settings, daily_budget_chf: parseFloat(e.target.value) })}
                className="mt-1"
              />
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Verbleibendes Budget heute:</span>
                <span className="font-semibold">CHF {settings.daily_budget_remaining_chf.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? "Speichern..." : "Einstellungen speichern"}
        </Button>
      </div>
    </div>
  );
};