import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Check, Crown, Zap, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";

interface SubscriptionPlan {
  id: string;
  name: string;
  price_monthly: number;
  price_yearly: number | null;
  max_leads_per_month: number | null;
  tier_name: string | null;
  priority_level: number;
  advanced_analytics: boolean;
  auto_bidding: boolean;
  competitor_insights: boolean;
  display_order: number;
  is_active: boolean;
}

export default function Subscriptions() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .order('display_order');

    if (error) {
      console.error('Error loading plans:', error);
      toast.error('Fehler beim Laden der Pläne');
    } else {
      setPlans(data || []);
    }
    setLoading(false);
  };

  const handleSave = async (plan: SubscriptionPlan) => {
    const { error } = await supabase
      .from('subscription_plans')
      .update({
        name: plan.name,
        price_monthly: plan.price_monthly,
        price_yearly: plan.price_yearly,
        max_leads_per_month: plan.max_leads_per_month,
        tier_name: plan.tier_name,
        priority_level: plan.priority_level,
        advanced_analytics: plan.advanced_analytics,
        auto_bidding: plan.auto_bidding,
        competitor_insights: plan.competitor_insights,
        display_order: plan.display_order,
        is_active: plan.is_active,
      })
      .eq('id', plan.id);

    if (error) {
      toast.error('Fehler beim Speichern');
    } else {
      toast.success('Plan erfolgreich gespeichert');
      setEditingPlan(null);
      loadPlans();
    }
  };

  const getTierIcon = (tierName: string | null) => {
    switch (tierName) {
      case 'Enterprise':
        return <Crown className="h-5 w-5 text-purple-500" />;
      case 'Pro':
        return <Zap className="h-5 w-5 text-blue-500" />;
      case 'Basic':
        return <Star className="h-5 w-5 text-gray-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <p>Lädt...</p>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Abonnement-Pläne</h1>
          <p className="text-muted-foreground">
            Verwalte Subscription-Tiers für Anbieter
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Neuer Plan
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={
              editingPlan?.id === plan.id ? "border-primary shadow-lg" : ""
            }
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getTierIcon(plan.tier_name)}
                  <CardTitle>{plan.name}</CardTitle>
                </div>
                <Badge variant={plan.is_active ? "default" : "secondary"}>
                  {plan.is_active ? "Aktiv" : "Inaktiv"}
                </Badge>
              </div>
              <CardDescription>
                {plan.tier_name || "Subscription Plan"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {editingPlan?.id === plan.id ? (
                <div className="space-y-4">
                  <div>
                    <Label>Plan Name</Label>
                    <Input
                      value={editingPlan.name}
                      onChange={(e) =>
                        setEditingPlan({ ...editingPlan, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Preis/Monat (CHF)</Label>
                      <Input
                        type="number"
                        value={editingPlan.price_monthly}
                        onChange={(e) =>
                          setEditingPlan({
                            ...editingPlan,
                            price_monthly: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Preis/Jahr (CHF)</Label>
                      <Input
                        type="number"
                        value={editingPlan.price_yearly || ""}
                        onChange={(e) =>
                          setEditingPlan({
                            ...editingPlan,
                            price_yearly: e.target.value
                              ? Number(e.target.value)
                              : null,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Max Leads/Monat</Label>
                    <Input
                      type="number"
                      value={editingPlan.max_leads_per_month || ""}
                      placeholder="Unbegrenzt"
                      onChange={(e) =>
                        setEditingPlan({
                          ...editingPlan,
                          max_leads_per_month: e.target.value
                            ? Number(e.target.value)
                            : null,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Advanced Analytics</Label>
                      <Switch
                        checked={editingPlan.advanced_analytics}
                        onCheckedChange={(checked) =>
                          setEditingPlan({
                            ...editingPlan,
                            advanced_analytics: checked,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Auto-Bidding</Label>
                      <Switch
                        checked={editingPlan.auto_bidding}
                        onCheckedChange={(checked) =>
                          setEditingPlan({
                            ...editingPlan,
                            auto_bidding: checked,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Konkurrenz-Insights</Label>
                      <Switch
                        checked={editingPlan.competitor_insights}
                        onCheckedChange={(checked) =>
                          setEditingPlan({
                            ...editingPlan,
                            competitor_insights: checked,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Aktiv</Label>
                      <Switch
                        checked={editingPlan.is_active}
                        onCheckedChange={(checked) =>
                          setEditingPlan({
                            ...editingPlan,
                            is_active: checked,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => handleSave(editingPlan)}
                      className="flex-1"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Speichern
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditingPlan(null)}
                    >
                      Abbrechen
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-3xl font-bold">
                      CHF {plan.price_monthly}
                      <span className="text-sm text-muted-foreground">
                        /Monat
                      </span>
                    </p>
                    {plan.price_yearly && (
                      <p className="text-sm text-muted-foreground">
                        CHF {plan.price_yearly}/Jahr (spare{" "}
                        {Math.round(
                          ((plan.price_monthly * 12 - plan.price_yearly) /
                            (plan.price_monthly * 12)) *
                            100
                        )}
                        %)
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>
                        {plan.max_leads_per_month || "Unbegrenzt"} Leads/Monat
                      </span>
                    </div>
                    {plan.advanced_analytics && (
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Advanced Analytics</span>
                      </div>
                    )}
                    {plan.auto_bidding && (
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Auto-Bidding</span>
                      </div>
                    )}
                    {plan.competitor_insights && (
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Konkurrenz-Insights</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Priorität {plan.priority_level}</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setEditingPlan(plan)}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Bearbeiten
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      </div>
    </AdminLayout>
  );
}
