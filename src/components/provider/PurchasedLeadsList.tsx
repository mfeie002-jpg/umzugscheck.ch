import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useProviderAuth } from "@/contexts/ProviderAuthContext";
import { ConversionTrackingDialog } from "./ConversionTrackingDialog";
import { MapPin, Calendar, Package, CheckCircle2, XCircle, Clock, Edit, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface PurchasedLead {
  id: string;
  lead_id: string;
  amount: number;
  purchased_at: string;
  conversion_status: string;
  conversion_date?: string;
  actual_job_value?: number;
  conversion_notes?: string;
  lost_reason?: string;
  lead: {
    name: string;
    from_city: string;
    from_postal: string;
    to_city: string;
    to_postal: string;
    move_date?: string;
    calculator_type: string;
    calculator_output: any;
  };
}

export function PurchasedLeadsList() {
  const { provider } = useProviderAuth();
  const [leads, setLeads] = useState<PurchasedLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (provider) {
      fetchPurchasedLeads();
    }
  }, [provider]);

  const fetchPurchasedLeads = async () => {
    if (!provider) return;

    try {
      const { data, error } = await supabase
        .from('lead_transactions')
        .select(`
          *,
          lead:leads(*)
        `)
        .eq('provider_id', provider.id)
        .eq('status', 'completed')
        .order('purchased_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching purchased leads:', error);
      toast.error('Fehler beim Laden der gekauften Leads');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'converted':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'lost':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'converted':
        return <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">Gewonnen</Badge>;
      case 'lost':
        return <Badge variant="destructive">Verloren</Badge>;
      case 'expired':
        return <Badge variant="outline">Abgelaufen</Badge>;
      default:
        return <Badge variant="secondary">Ausstehend</Badge>;
    }
  };

  const handleUpdateConversion = (transaction: PurchasedLead) => {
    setSelectedTransaction(transaction);
    setDialogOpen(true);
  };

  const calculateROI = (lead: PurchasedLead) => {
    if (lead.conversion_status === 'converted' && lead.actual_job_value) {
      const roi = ((lead.actual_job_value - lead.amount) / lead.amount) * 100;
      return roi.toFixed(0);
    }
    return null;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gekaufte Leads</CardTitle>
          <CardDescription>Lädt...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Gekaufte Leads & Conversion Tracking</CardTitle>
          <CardDescription>
            Verwalten Sie Ihre gekauften Leads und tracken Sie Conversions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Noch keine Leads gekauft</p>
            </div>
          ) : (
            <div className="space-y-4">
              {leads.map((lead) => {
                const roi = calculateROI(lead);
                
                return (
                  <Card key={lead.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{lead.lead.calculator_type}</h4>
                            {getStatusBadge(lead.conversion_status)}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                            <MapPin className="h-3 w-3" />
                            {lead.lead.from_city} → {lead.lead.to_city}
                          </div>
                          {lead.lead.move_date && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {new Date(lead.lead.move_date).toLocaleDateString('de-CH')}
                            </div>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Lead-Kosten</div>
                          <div className="font-bold">CHF {lead.amount}</div>
                        </div>
                      </div>

                      {lead.conversion_status === 'converted' && lead.actual_job_value && (
                        <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm text-muted-foreground">Auftragswert</div>
                              <div className="font-bold text-green-700 dark:text-green-400">
                                CHF {lead.actual_job_value.toLocaleString()}
                              </div>
                            </div>
                            {roi && (
                              <div className="text-right">
                                <div className="text-sm text-muted-foreground flex items-center gap-1">
                                  <TrendingUp className="h-3 w-3" />
                                  ROI
                                </div>
                                <div className="font-bold text-green-700 dark:text-green-400">
                                  {roi}%
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {lead.conversion_status === 'lost' && lead.lost_reason && (
                        <div className="bg-muted rounded-lg p-3 mb-3">
                          <div className="text-sm text-muted-foreground mb-1">Grund:</div>
                          <div className="text-sm">{lead.lost_reason}</div>
                        </div>
                      )}

                      {lead.conversion_notes && (
                        <div className="bg-muted rounded-lg p-3 mb-3">
                          <div className="text-sm text-muted-foreground mb-1">Notizen:</div>
                          <div className="text-sm">{lead.conversion_notes}</div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
                        <div>
                          Gekauft: {new Date(lead.purchased_at).toLocaleDateString('de-CH')}
                          {lead.conversion_date && (
                            <> • Abgeschlossen: {new Date(lead.conversion_date).toLocaleDateString('de-CH')}</>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpdateConversion(lead)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Status aktualisieren
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedTransaction && (
        <ConversionTrackingDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          transaction={selectedTransaction}
          leadDetails={{
            calculator_type: selectedTransaction.lead.calculator_type,
            from_city: selectedTransaction.lead.from_city,
            to_city: selectedTransaction.lead.to_city
          }}
          onUpdate={fetchPurchasedLeads}
        />
      )}
    </>
  );
}
