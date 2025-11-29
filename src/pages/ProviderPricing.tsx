import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useProviderAuth } from "@/contexts/ProviderAuthContext";

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number | null;
  max_leads_per_month: number | null;
  features: string[];
  is_active: boolean;
}

export default function ProviderPricing() {
  const navigate = useNavigate();
  const { provider } = useProviderAuth();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .eq("is_active", true)
        .order("price_monthly", { ascending: true });

      if (error) throw error;
      setPlans((data || []).map(plan => ({
        ...plan,
        features: (plan.features as string[]) || []
      })));
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast.error("Fehler beim Laden der Tarife");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (!provider) {
      toast.error("Bitte melden Sie sich an");
      navigate("/provider-login");
      return;
    }

    toast.info("Zahlungssystem wird vorbereitet...");
    // TODO: Integrate with Stripe for actual payment processing
    // For now, this is a placeholder
  };

  const getPrice = (plan: SubscriptionPlan) => {
    return billingCycle === "yearly" && plan.price_yearly
      ? plan.price_yearly
      : plan.price_monthly;
  };

  const getSavings = (plan: SubscriptionPlan) => {
    if (!plan.price_yearly) return 0;
    const monthlyTotal = plan.price_monthly * 12;
    return monthlyTotal - plan.price_yearly;
  };

  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-1 pt-20">
        {/* Header */}
        <section className="py-12 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Preise & Abonnements
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Wählen Sie den Plan, der am besten zu Ihrem Unternehmen passt
              </p>

              {/* Billing Cycle Toggle */}
              <div className="inline-flex items-center gap-4 p-1 bg-muted rounded-lg">
                <Button
                  variant={billingCycle === "monthly" ? "default" : "ghost"}
                  onClick={() => setBillingCycle("monthly")}
                  className="rounded-md"
                >
                  Monatlich
                </Button>
                <Button
                  variant={billingCycle === "yearly" ? "default" : "ghost"}
                  onClick={() => setBillingCycle("yearly")}
                  className="rounded-md"
                >
                  Jährlich
                  <Badge variant="secondary" className="ml-2">
                    Sparen Sie bis zu 17%
                  </Badge>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center">Lädt...</div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {plans.map((plan, index) => {
                  const price = getPrice(plan);
                  const savings = getSavings(plan);
                  const isPopular = index === 1; // Professional plan

                  return (
                    <Card
                      key={plan.id}
                      className={`relative flex flex-col ${
                        isPopular ? "border-primary shadow-lg scale-105" : ""
                      }`}
                    >
                      {isPopular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                          <Badge className="bg-primary text-primary-foreground">
                            Beliebt
                          </Badge>
                        </div>
                      )}

                      <CardHeader>
                        <CardTitle className="text-2xl">{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                      </CardHeader>

                      <CardContent className="flex-1">
                        <div className="mb-6">
                          <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold">
                              CHF {price}
                            </span>
                            <span className="text-muted-foreground">
                              / {billingCycle === "yearly" ? "Jahr" : "Monat"}
                            </span>
                          </div>
                          {billingCycle === "yearly" && savings > 0 && (
                            <p className="text-sm text-green-600 mt-2">
                              Sparen Sie CHF {savings} pro Jahr
                            </p>
                          )}
                        </div>

                        <div className="space-y-3">
                          {plan.max_leads_per_month !== null ? (
                            <div className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-sm">
                                {plan.max_leads_per_month} Leads pro Monat
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-sm font-semibold">
                                Unbegrenzte Leads
                              </span>
                            </div>
                          )}

                          {plan.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>

                      <CardFooter>
                        <Button
                          className="w-full"
                          variant={isPopular ? "default" : "outline"}
                          onClick={() => handleSubscribe(plan.id)}
                        >
                          Jetzt starten
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Per-Lead Option */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    Pay-per-Lead Alternative
                  </CardTitle>
                  <CardDescription>
                    Kein Abo gewünscht? Bezahlen Sie nur für die Leads, die Sie kaufen.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-semibold text-lg">CHF 15 - 45 pro Lead</p>
                      <p className="text-sm text-muted-foreground">
                        Preis variiert je nach Umzugsvolumen und Region
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Keine monatliche Bindung</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Kaufen Sie nur Leads, die Sie interessieren</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Vollständige Kontrolle über Ihr Budget</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/provider-dashboard")}
                  >
                    Verfügbare Leads ansehen
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">
                Häufig gestellte Fragen
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">
                    Kann ich meinen Plan jederzeit ändern?
                  </h3>
                  <p className="text-muted-foreground">
                    Ja, Sie können Ihren Plan jederzeit upgraden oder downgraden.
                    Änderungen werden bei der nächsten Abrechnung wirksam.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
                    Was passiert, wenn ich mein Lead-Limit überschreite?
                  </h3>
                  <p className="text-muted-foreground">
                    Sie erhalten keine weiteren Leads bis zum nächsten Monat oder
                    können auf einen höheren Plan upgraden.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
                    Wie werden die Leads abgerechnet?
                  </h3>
                  <p className="text-muted-foreground">
                    Bei Abo-Plänen ist die Anzahl der Leads im monatlichen Preis
                    enthalten. Bei Pay-per-Lead zahlen Sie nur für die Leads, die
                    Sie tatsächlich kaufen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
