import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Gavel, 
  Clock, 
  TrendingUp, 
  MapPin, 
  Package, 
  Calendar,
  Zap,
  Trophy,
  AlertCircle,
  CheckCircle2,
  Timer
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

interface BiddableLead {
  id: string;
  from_city: string;
  to_city: string;
  move_date: string;
  starting_bid: number;
  current_highest_bid: number | null;
  bid_count: number;
  bidding_closes_at: string;
  calculator_output: any;
  quality_score?: number;
}

interface LeadBiddingPanelProps {
  providerId: string;
  token: string;
}

export function LeadBiddingPanel({ providerId, token }: LeadBiddingPanelProps) {
  const [leads, setLeads] = useState<BiddableLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [bidAmounts, setBidAmounts] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [myBids, setMyBids] = useState<Record<string, number>>({});

  // Fetch biddable leads
  const fetchBiddableLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('bidding_enabled', true)
        .gt('bidding_closes_at', new Date().toISOString())
        .order('bidding_closes_at', { ascending: true });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching biddable leads:', error);
      toast.error('Fehler beim Laden der Gebote');
    } finally {
      setLoading(false);
    }
  };

  // Place a bid
  const placeBid = async (leadId: string) => {
    const bidAmount = bidAmounts[leadId];
    if (!bidAmount) {
      toast.error('Bitte geben Sie einen Gebotsbetrag ein');
      return;
    }

    setSubmitting(leadId);
    try {
      const { data, error } = await supabase.functions.invoke('place-bid', {
        headers: { Authorization: `Bearer ${token}` },
        body: { providerId, leadId, bidAmount }
      });

      if (error) throw error;

      toast.success('Gebot erfolgreich abgegeben!');
      setMyBids(prev => ({ ...prev, [leadId]: bidAmount }));
      fetchBiddableLeads();
    } catch (error: any) {
      toast.error(error.message || 'Fehler beim Bieten');
    } finally {
      setSubmitting(null);
    }
  };

  // Calculate time remaining
  const getTimeRemaining = (closesAt: string) => {
    const now = new Date();
    const closes = new Date(closesAt);
    const diff = closes.getTime() - now.getTime();
    
    if (diff <= 0) return { text: 'Abgelaufen', urgent: true };
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours < 1) return { text: `${minutes} Min`, urgent: true };
    if (hours < 6) return { text: `${hours}h ${minutes}m`, urgent: true };
    return { text: formatDistanceToNow(closes, { locale: de, addSuffix: false }), urgent: false };
  };

  // Get quality badge
  const getQualityBadge = (score?: number) => {
    if (!score) return null;
    if (score >= 80) return { label: 'Premium', color: 'bg-emerald-500' };
    if (score >= 60) return { label: 'Gut', color: 'bg-blue-500' };
    if (score >= 40) return { label: 'Standard', color: 'bg-amber-500' };
    return { label: 'Basis', color: 'bg-gray-500' };
  };

  // Get minimum bid
  const getMinBid = (lead: BiddableLead) => {
    return (lead.current_highest_bid || lead.starting_bid || 10) + 1;
  };

  useState(() => {
    fetchBiddableLeads();
  });

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Gavel className="h-5 w-5" />
              Lead Bidding Marktplatz
            </CardTitle>
            <CardDescription>
              Bieten Sie auf neue Leads und gewinnen Sie Aufträge
            </CardDescription>
          </div>
          <Badge variant="outline" className="gap-1">
            <Zap className="h-3 w-3" />
            {leads.length} aktive Auktionen
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Aktive Auktionen</TabsTrigger>
            <TabsTrigger value="my-bids">Meine Gebote</TabsTrigger>
            <TabsTrigger value="won">Gewonnen</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {leads.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Gavel className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Keine aktiven Auktionen verfügbar</p>
                <p className="text-sm">Neue Leads werden bald verfügbar sein</p>
              </div>
            ) : (
              <div className="grid gap-4">
                <AnimatePresence>
                  {leads.map((lead, index) => {
                    const timeRemaining = getTimeRemaining(lead.bidding_closes_at);
                    const qualityBadge = getQualityBadge(lead.quality_score);
                    const minBid = getMinBid(lead);
                    const myBid = myBids[lead.id];

                    return (
                      <motion.div
                        key={lead.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className={cn(
                          "overflow-hidden transition-all",
                          timeRemaining.urgent && "border-amber-500/50 bg-amber-50/30 dark:bg-amber-950/10"
                        )}>
                          {/* Quality indicator bar */}
                          {qualityBadge && (
                            <div className={cn("h-1", qualityBadge.color)} />
                          )}
                          
                          <CardContent className="p-4">
                            <div className="grid md:grid-cols-[1fr,auto] gap-4">
                              {/* Lead Info */}
                              <div className="space-y-3">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <MapPin className="h-4 w-4 text-muted-foreground" />
                                      <span className="font-semibold">
                                        {lead.from_city} → {lead.to_city}
                                      </span>
                                      {qualityBadge && (
                                        <Badge className={cn("text-xs", qualityBadge.color)}>
                                          {qualityBadge.label}
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      Lead #{lead.id.slice(0, 8)}
                                    </p>
                                  </div>
                                  
                                  <div className={cn(
                                    "flex items-center gap-1 text-sm font-medium",
                                    timeRemaining.urgent ? "text-amber-600" : "text-muted-foreground"
                                  )}>
                                    <Timer className="h-4 w-4" />
                                    {timeRemaining.text}
                                  </div>
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    <span>
                                      {new Date(lead.move_date).toLocaleDateString('de-CH', {
                                        day: 'numeric',
                                        month: 'short'
                                      })}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <Package className="h-3 w-3" />
                                    <span>{lead.calculator_output?.volume || '~30'} m³</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <TrendingUp className="h-3 w-3" />
                                    <span>{lead.bid_count || 0} Gebote</span>
                                  </div>
                                </div>

                                {/* Bid Progress */}
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Startgebot</span>
                                    <span className="font-medium">
                                      CHF {lead.current_highest_bid || lead.starting_bid || 10}
                                    </span>
                                  </div>
                                  <Progress 
                                    value={Math.min(100, ((lead.current_highest_bid || lead.starting_bid || 10) / 100) * 100)} 
                                    className="h-1.5"
                                  />
                                </div>
                              </div>

                              {/* Bidding Section */}
                              <div className="flex flex-col justify-between gap-3 min-w-[200px]">
                                {myBid ? (
                                  <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
                                    <CheckCircle2 className="h-5 w-5 text-primary" />
                                    <div>
                                      <p className="text-sm font-medium">Ihr Gebot</p>
                                      <p className="text-lg font-bold">CHF {myBid}</p>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="space-y-2">
                                      <label className="text-xs text-muted-foreground">
                                        Ihr Gebot (min. CHF {minBid})
                                      </label>
                                      <div className="flex gap-2">
                                        <Input
                                          type="number"
                                          min={minBid}
                                          placeholder={`${minBid}`}
                                          value={bidAmounts[lead.id] || ''}
                                          onChange={(e) => setBidAmounts(prev => ({
                                            ...prev,
                                            [lead.id]: parseInt(e.target.value) || 0
                                          }))}
                                          className="w-24"
                                        />
                                        <Button
                                          onClick={() => placeBid(lead.id)}
                                          disabled={submitting === lead.id || !bidAmounts[lead.id] || bidAmounts[lead.id] < minBid}
                                          className="flex-1"
                                        >
                                          {submitting === lead.id ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                          ) : (
                                            <>
                                              <Gavel className="h-4 w-4 mr-1" />
                                              Bieten
                                            </>
                                          )}
                                        </Button>
                                      </div>
                                    </div>
                                    
                                    {/* Quick bid buttons */}
                                    <div className="flex gap-1">
                                      {[minBid, minBid + 5, minBid + 10].map((amount) => (
                                        <Button
                                          key={amount}
                                          variant="outline"
                                          size="sm"
                                          className="flex-1 text-xs"
                                          onClick={() => setBidAmounts(prev => ({
                                            ...prev,
                                            [lead.id]: amount
                                          }))}
                                        >
                                          CHF {amount}
                                        </Button>
                                      ))}
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-bids">
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Ihre aktiven Gebote werden hier angezeigt</p>
            </div>
          </TabsContent>

          <TabsContent value="won">
            <div className="text-center py-12 text-muted-foreground">
              <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Gewonnene Auktionen werden hier angezeigt</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
