import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { MapPin, Calendar, Package, Loader2, Gavel, Star, TrendingUp, Clock, Zap, Users, Eye, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useProviderAuth } from "@/contexts/ProviderAuthContext";
import { calculateLeadQualityScore } from "@/lib/pricing";
import { calculateLeadMatchScore, getMatchLevelColor, getMatchLevelLabel } from "@/lib/lead-matching";
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

interface Bid {
  id: string;
  bid_amount: number;
  provider_id: string;
  status: string;
  created_at: string;
}

interface LeadBiddingCardProps {
  lead: Lead;
  onBidPlaced?: () => void;
}

export function LeadBiddingCard({ lead, onBidPlaced }: LeadBiddingCardProps) {
  const { provider } = useProviderAuth();
  const [bidAmount, setBidAmount] = useState<string>("");
  const [placingBid, setPlacingBid] = useState(false);
  const [bids, setBids] = useState<Bid[]>([]);
  const [myBid, setMyBid] = useState<Bid | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [currentMonthLeadCount, setCurrentMonthLeadCount] = useState<number>(0);

  const volume = lead.calculator_output?.volume || 30;
  const qualityScore = calculateLeadQualityScore({
    volume,
    fromPostal: lead.from_postal,
    toPostal: lead.to_postal,
    calculatorType: lead.calculator_type,
    calculatorOutput: lead.calculator_output,
    estimatedValue: lead.calculator_output?.priceAvg,
    createdAt: lead.created_at
  });

  // Calculate match score
  const matchScore = provider ? calculateLeadMatchScore(provider, lead, currentMonthLeadCount) : null;

  const minimumBid = lead.current_highest_bid 
    ? lead.current_highest_bid + 1 
    : lead.starting_bid || qualityScore.finalPrice;

  useEffect(() => {
    if (!lead.bidding_enabled || !provider) return;

    // Fetch current month lead count for capacity calculation
    const fetchLeadCount = async () => {
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

    fetchLeadCount();
    fetchBids();

    // Subscribe to real-time bid updates
    const channel = supabase
      .channel(`lead-bids-${lead.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lead_bids',
          filter: `lead_id=eq.${lead.id}`
        },
        () => {
          fetchBids();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [lead.id, lead.bidding_enabled]);

  useEffect(() => {
    if (!lead.bidding_closes_at) return;

    const interval = setInterval(() => {
      const now = new Date();
      const closesAt = new Date(lead.bidding_closes_at!);
      const diff = closesAt.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining("Geschlossen");
        clearInterval(interval);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeRemaining(`${hours}h ${minutes}m verbleibend`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lead.bidding_closes_at]);

  const fetchBids = async () => {
    try {
      const { data, error } = await supabase
        .from("lead_bids")
        .select("*")
        .eq("lead_id", lead.id)
        .order("bid_amount", { ascending: false });

      if (error) throw error;

      setBids(data || []);

      // Find my bid
      const myActiveBid = data?.find(
        b => b.provider_id === provider?.id && b.status === 'active'
      );
      setMyBid(myActiveBid || null);
    } catch (error) {
      console.error("Error fetching bids:", error);
    }
  };

  const handlePlaceBid = async () => {
    if (!provider) {
      toast.error("Bitte melden Sie sich an");
      return;
    }

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount < minimumBid) {
      toast.error(`Gebot muss mindestens CHF ${minimumBid} betragen`);
      return;
    }

    setPlacingBid(true);

    try {
      const { data, error } = await supabase.functions.invoke("place-bid", {
        body: {
          providerId: provider.id,
          leadId: lead.id,
          bidAmount: amount
        }
      });

      if (error) throw error;

      if (data?.success) {
        toast.success(
          data.action === "updated" 
            ? "Gebot aktualisiert!" 
            : "Gebot abgegeben!"
        );
        setBidAmount("");
        onBidPlaced?.();
      } else {
        throw new Error(data?.error || "Fehler beim Bieten");
      }
    } catch (error: any) {
      console.error("Error placing bid:", error);
      toast.error(error.message || "Fehler beim Abgeben des Gebots");
    } finally {
      setPlacingBid(false);
    }
  };

  const getQualityBadgeVariant = (tier: string) => {
    switch (tier) {
      case 'elite': return 'default';
      case 'premium': return 'secondary';
      default: return 'outline';
    }
  };

  const isWinning = myBid && myBid.bid_amount === lead.current_highest_bid;
  const isBiddingClosed = lead.bidding_closes_at && new Date(lead.bidding_closes_at) < new Date();

  return (
    <Card className={`flex flex-col ${isWinning ? 'border-green-500 border-2' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <CardTitle className="text-lg">{lead.calculator_type}</CardTitle>
              <Badge variant={getQualityBadgeVariant(qualityScore.qualityTier)}>
                <Star className="h-3 w-3 mr-1" />
                {qualityScore.qualityTier.toUpperCase()}
              </Badge>
              <Badge variant="secondary" className="bg-purple-500/10 text-purple-700 dark:text-purple-400">
                <Gavel className="h-3 w-3 mr-1" />
                Auktion
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
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {/* Match Score (if available) */}
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

        {/* Bidding Stats */}
        <div className="bg-muted/30 rounded-lg p-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-muted-foreground text-xs">Startgebot</div>
              <div className="font-bold text-lg">CHF {lead.starting_bid || qualityScore.finalPrice}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Höchstgebot</div>
              <div className="font-bold text-lg text-primary">
                {lead.current_highest_bid ? `CHF ${lead.current_highest_bid}` : "-"}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs flex items-center gap-1">
                <Users className="h-3 w-3" />
                Gebote
              </div>
              <div className="font-semibold">{lead.bid_count || 0}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Status
              </div>
              <div className={`font-semibold text-xs ${isBiddingClosed ? 'text-red-600' : 'text-green-600'}`}>
                {timeRemaining || "Läuft"}
              </div>
            </div>
          </div>

          {isWinning && !isBiddingClosed && (
            <div className="mt-3 flex items-center gap-2 text-sm text-green-600 dark:text-green-400 font-semibold">
              <Zap className="h-4 w-4" />
              Sie führen aktuell!
            </div>
          )}
        </div>

        {/* Lead Details */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Volumen:</span>
            <span className="font-medium">{volume} m³</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Geschätzter Wert:</span>
            <span className="font-medium">CHF {qualityScore.estimatedJobValue.toLocaleString()}</span>
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
        </div>

        {/* Bidding Input */}
        {!isBiddingClosed && (
          <div className="space-y-2">
            <div className="flex gap-2">
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
            </div>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder={`Min. CHF ${minimumBid}`}
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                disabled={placingBid}
                min={minimumBid}
              />
              <Button
                onClick={handlePlaceBid}
                disabled={placingBid || !bidAmount}
                className="whitespace-nowrap"
              >
                {placingBid ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Gavel className="w-4 h-4 mr-1" />
                    Bieten
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Mindestgebot: CHF {minimumBid}
              {myBid && ` • Ihr aktuelles Gebot: CHF ${myBid.bid_amount}`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
