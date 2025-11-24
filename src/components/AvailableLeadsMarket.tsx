import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Package, Loader2, ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useProviderAuth } from "@/contexts/ProviderAuthContext";

interface Lead {
  id: string;
  name: string;
  from_city: string;
  from_postal: string;
  to_city: string;
  to_postal: string;
  move_date: string | null;
  calculator_type: string;
  calculator_output: any;
  created_at: string;
}

export function AvailableLeadsMarket() {
  const { provider } = useProviderAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    if (provider) {
      fetchAvailableLeads();
    }
  }, [provider]);

  const fetchAvailableLeads = async () => {
    try {
      // Fetch leads that match provider's service areas but haven't been purchased yet
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;

      // Filter out leads already purchased by this provider
      const { data: transactions } = await supabase
        .from("lead_transactions")
        .select("lead_id")
        .eq("provider_id", provider?.id);

      const purchasedLeadIds = new Set(transactions?.map(t => t.lead_id) || []);
      const availableLeads = (data || []).filter(lead => !purchasedLeadIds.has(lead.id));

      setLeads(availableLeads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast.error("Fehler beim Laden der Leads");
    } finally {
      setLoading(false);
    }
  };

  const calculateLeadPrice = (lead: Lead) => {
    const volume = lead.calculator_output?.volume || 30;
    if (volume > 80) return 45;
    if (volume > 50) return 30;
    return 15;
  };

  const handlePurchaseLead = async (leadId: string) => {
    if (!provider) {
      toast.error("Bitte melden Sie sich an");
      return;
    }

    setPurchasing(leadId);

    try {
      const { data, error } = await supabase.functions.invoke("purchase-lead", {
        body: {
          providerId: provider.id,
          leadId: leadId,
        },
      });

      if (error) throw error;

      if (data?.success) {
        toast.success("Lead erfolgreich gekauft!");
        // Remove purchased lead from list
        setLeads(leads.filter(l => l.id !== leadId));
      } else {
        throw new Error(data?.error || "Fehler beim Kauf");
      }
    } catch (error: any) {
      console.error("Error purchasing lead:", error);
      toast.error(error.message || "Fehler beim Kauf des Leads");
    } finally {
      setPurchasing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Momentan keine verfügbaren Leads</p>
        <p className="text-sm mt-2">Neue Anfragen werden hier angezeigt</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {leads.map((lead) => {
        const price = calculateLeadPrice(lead);
        const volume = lead.calculator_output?.volume || "--";
        const isPurchasing = purchasing === lead.id;

        return (
          <Card key={lead.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{lead.calculator_type}</CardTitle>
                  <CardDescription className="mt-1">
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3" />
                      {lead.from_city} → {lead.to_city}
                    </div>
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="ml-2">
                  CHF {price}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="flex-1">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Von:</span>
                  <span className="font-medium">
                    {lead.from_postal} {lead.from_city}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nach:</span>
                  <span className="font-medium">
                    {lead.to_postal} {lead.to_city}
                  </span>
                </div>
                {lead.move_date && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Umzugsdatum:</span>
                    <span className="font-medium flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(lead.move_date).toLocaleDateString("de-CH")}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Volumen:</span>
                  <span className="font-medium">{volume} m³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Eingegangen:</span>
                  <span className="font-medium">
                    {new Date(lead.created_at).toLocaleDateString("de-CH")}
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handlePurchaseLead(lead.id)}
                disabled={isPurchasing}
              >
                {isPurchasing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Kauft...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Für CHF {price} kaufen
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
