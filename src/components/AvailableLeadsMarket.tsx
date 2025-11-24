import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar, Package, Loader2, ShoppingCart, Star, TrendingUp, Clock, Zap, Gavel, Eye, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useProviderAuth } from "@/contexts/ProviderAuthContext";
import { calculateLeadQuality, getQualityColor, getQualityBadgeVariant } from "@/lib/lead-quality";
import { calculateLeadMatchScore, getMatchLevelColor, getMatchLevelLabel } from "@/lib/lead-matching";
import { LeadBiddingCard } from "./LeadBiddingCard";
import { LeadPreviewDialog } from "./LeadPreviewDialog";

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
  bidding_enabled: boolean;
  bidding_closes_at: string | null;
  starting_bid: number | null;
  current_highest_bid: number | null;
  bid_count: number;
}

export function AvailableLeadsMarket() {
  const { provider } = useProviderAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [currentMonthLeadCount, setCurrentMonthLeadCount] = useState<number>(0);

  useEffect(() => {
    if (provider) {
      fetchAvailableLeads();
      fetchCurrentMonthLeadCount();
    }
  }, [provider]);

  const fetchCurrentMonthLeadCount = async () => {
    if (!provider) return;
    
    try {
      const { count } = await supabase
        .from("lead_transactions")
        .select("*", { count: 'exact', head: true })
        .eq("provider_id", provider.id)
        .gte("created_at", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());
      
      setCurrentMonthLeadCount(count || 0);
    } catch (error) {
      console.error("Error fetching lead count:", error);
    }
  };

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

  const getQualityBadgeVariant = (tier: string) => {
    switch (tier) {
      case 'elite': return 'default';
      case 'premium': return 'secondary';
      default: return 'outline';
    }
  };

  const getQualityLabel = (tier: string) => {
    switch (tier) {
      case 'elite': return 'Elite';
      case 'premium': return 'Premium';
      default: return 'Standard';
    }
  };

  const getUrgencyBadge = (urgencyLevel: string, discount: number) => {
    switch (urgencyLevel) {
      case 'expiring':
        return (
          <Badge variant="destructive" className="animate-pulse">
            <Zap className="h-3 w-3 mr-1" />
            {discount}% Rabatt
          </Badge>
        );
      case 'urgent':
        return (
          <Badge variant="secondary" className="bg-orange-500/10 text-orange-700 dark:text-orange-400">
            <Clock className="h-3 w-3 mr-1" />
            {discount}% Rabatt
          </Badge>
        );
      default:
        return null;
    }
  };

  const getTimeRemaining = (hoursOld: number) => {
    if (hoursOld >= 48) {
      return "Läuft in Kürze ab";
    } else if (hoursOld >= 24) {
      const hoursUntilNextDiscount = 48 - hoursOld;
      return `${hoursUntilNextDiscount}h bis 30% Rabatt`;
    } else {
      const hoursUntilDiscount = 24 - hoursOld;
      return `${hoursUntilDiscount}h bis 15% Rabatt`;
    }
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

  const biddingLeads = leads.filter(l => l.bidding_enabled);
  const directLeads = leads.filter(l => !l.bidding_enabled);

  const renderDirectPurchaseLead = (lead: Lead) => {
    const volume = lead.calculator_output?.volume || 30;
    const qualityScore = calculateLeadQuality(lead, provider ? {
      cantons_served: provider.cantons_served,
      preferred_regions: provider.preferred_regions,
      min_job_value: provider.min_job_value,
      price_level: provider.price_level,
      services_offered: provider.services_offered
    } : undefined);

    // Calculate match score
    const matchScore = provider ? calculateLeadMatchScore(provider, lead, currentMonthLeadCount) : null;
    
    const isPurchasing = purchasing === lead.id;

    return (
      <Card key={lead.id} className="flex flex-col">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <CardTitle className="text-lg">{lead.calculator_type}</CardTitle>
                <Badge variant={getQualityBadgeVariant(qualityScore.qualityLevel) as any} className={getQualityColor(qualityScore.grade)}>
                  <Star className="h-3 w-3 mr-1" />
                  {qualityScore.grade}
                </Badge>
                  {matchScore && (
                    <Badge variant="outline" className={getMatchLevelColor(matchScore.matchLevel)}>
                      <Target className="h-3 w-3 mr-1" />
                      {matchScore.matchPercentage}%
                    </Badge>
                  )}
                </div>
              <CardDescription className="mt-1">
                <div className="flex items-center gap-1 text-sm">
                  <MapPin className="h-3 w-3" />
                  {lead.from_city} → {lead.to_city}
                </div>
              </CardDescription>
            </div>
            <div className="ml-2 text-right">
              <div className="flex flex-col items-end gap-1">
                <Badge variant="secondary" className="text-base font-bold">
                  CHF {Math.round(qualityScore.estimatedValue * 0.02)}
                </Badge>
                <div className="text-xs text-muted-foreground">
                  Score: {qualityScore.totalScore}/100
                </div>
                <div className="text-xs text-primary">
                  {qualityScore.conversionProbability.toFixed(0)}% Conversion
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1">
          <div className="space-y-3">
            {/* Match Score */}
            {matchScore && (
              <div className={`p-3 rounded-lg border ${getMatchLevelColor(matchScore.matchLevel)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Target className="h-4 w-4" />
                    Match-Score
                  </div>
                  <span className="font-bold">{matchScore.matchPercentage}%</span>
                </div>
                <Progress value={matchScore.matchPercentage} className="h-1.5" />
                <div className="text-xs text-muted-foreground mt-2">
                  {getMatchLevelLabel(matchScore.matchLevel)} - {matchScore.details.servesBothCantons ? 'In Ihrem Gebiet' : 'Außerhalb'}
                </div>
              </div>
            )}

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
                <span className="text-muted-foreground">Geschätzter Wert:</span>
                <span className="font-medium">CHF {qualityScore.estimatedValue.toLocaleString()}</span>
              </div>
            </div>

            {/* Quality Insights */}
            {qualityScore.insights.length > 0 && (
              <div className="border-t pt-3">
                <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground mb-2">
                  <TrendingUp className="h-3 w-3" />
                  Qualitäts-Insights
                </div>
                <div className="space-y-1 text-xs">
                  {qualityScore.insights.map((insight, i) => (
                    <div key={i} className="text-muted-foreground">• {insight}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex gap-2">
          <LeadPreviewDialog 
            lead={lead}
            provider={provider}
            currentMonthLeadCount={currentMonthLeadCount}
          >
            <Button variant="outline" className="flex-1">
              <Eye className="w-4 h-4 mr-2" />
              Vorschau
            </Button>
          </LeadPreviewDialog>
          <Button
            className="flex-1"
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
                CHF {Math.round(qualityScore.estimatedValue * 0.02)}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="all">
          Alle Leads ({leads.length})
        </TabsTrigger>
        <TabsTrigger value="auction">
          <Gavel className="h-4 w-4 mr-2" />
          Auktionen ({biddingLeads.length})
        </TabsTrigger>
        <TabsTrigger value="direct">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Direktkauf ({directLeads.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="grid md:grid-cols-2 gap-4">
        {biddingLeads.map((lead) => (
          <LeadBiddingCard key={lead.id} lead={lead} onBidPlaced={fetchAvailableLeads} />
        ))}
        {directLeads.map((lead) => renderDirectPurchaseLead(lead))}
      </TabsContent>

      <TabsContent value="auction" className="grid md:grid-cols-2 gap-4">
        {biddingLeads.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-muted-foreground">
            <Gavel className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Keine Auktionen verfügbar</p>
          </div>
        ) : (
          biddingLeads.map((lead) => (
            <LeadBiddingCard key={lead.id} lead={lead} onBidPlaced={fetchAvailableLeads} />
          ))
        )}
      </TabsContent>

      <TabsContent value="direct" className="grid md:grid-cols-2 gap-4">
        {directLeads.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-muted-foreground">
            <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Keine Direktkauf-Leads verfügbar</p>
          </div>
        ) : (
          directLeads.map((lead) => renderDirectPurchaseLead(lead))
        )}
      </TabsContent>
    </Tabs>
  );
}
