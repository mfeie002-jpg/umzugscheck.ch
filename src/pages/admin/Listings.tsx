import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { 
  Gavel, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MapPin, 
  Calendar,
  TrendingDown,
  Users,
  Search,
  RefreshCw,
  Package,
  AlertTriangle,
  Award,
  Sparkles
} from "lucide-react";
import { CalculatorFlowReview } from "@/components/admin/CalculatorFlowReview";

interface Listing {
  id: string;
  from_city: string;
  from_postal: string;
  to_city: string;
  to_postal: string;
  move_date: string;
  apartment_size: string;
  services_requested: string[];
  status: string;
  visibility: string;
  budget_min: number | null;
  budget_max: number | null;
  starting_price: number | null;
  current_lowest_bid: number | null;
  bid_count: number | null;
  view_count: number | null;
  is_urgent: boolean | null;
  created_at: string;
  expires_at: string;
  lead_id: string | null;
}

interface Bid {
  id: string;
  listing_id: string;
  provider_id: string;
  bid_amount: number;
  message: string | null;
  includes_services: string[];
  available_date: string | null;
  estimated_duration_hours: number | null;
  status: string;
  created_at: string;
  viewed_at: string | null;
  provider?: {
    company_name: string;
    city: string;
    verification_status: string;
  };
}

export default function AdminListings() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [showBidsDialog, setShowBidsDialog] = useState(false);

  // Fetch listings
  const { data: listings, isLoading: listingsLoading, refetch } = useQuery({
    queryKey: ["admin-listings", statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("public_move_listings")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Listing[];
    },
  });

  // Fetch bids for selected listing
  const { data: bids, isLoading: bidsLoading } = useQuery({
    queryKey: ["admin-listing-bids", selectedListing?.id],
    queryFn: async () => {
      if (!selectedListing) return [];
      
      const { data, error } = await supabase
        .from("listing_bids")
        .select(`
          *,
          provider:service_providers(company_name, city, verification_status)
        `)
        .eq("listing_id", selectedListing.id)
        .order("bid_amount", { ascending: true });

      if (error) throw error;
      return data as Bid[];
    },
    enabled: !!selectedListing,
  });

  // Update listing status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("public_move_listings")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-listings"] });
      toast.success("Status aktualisiert");
    },
    onError: () => {
      toast.error("Fehler beim Aktualisieren");
    },
  });

  // Award bid to provider
  const awardBidMutation = useMutation({
    mutationFn: async ({ bidId, listingId }: { bidId: string; listingId: string }) => {
      // Update bid status to accepted
      const { error: bidError } = await supabase
        .from("listing_bids")
        .update({ status: "accepted" })
        .eq("id", bidId);
      if (bidError) throw bidError;

      // Update other bids to rejected
      const { error: rejectError } = await supabase
        .from("listing_bids")
        .update({ status: "rejected" })
        .eq("listing_id", listingId)
        .neq("id", bidId);
      if (rejectError) throw rejectError;

      // Update listing to awarded
      const { error: listingError } = await supabase
        .from("public_move_listings")
        .update({ 
          status: "awarded",
          awarded_at: new Date().toISOString()
        })
        .eq("id", listingId);
      if (listingError) throw listingError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-listings"] });
      queryClient.invalidateQueries({ queryKey: ["admin-listing-bids"] });
      setShowBidsDialog(false);
      toast.success("Auftrag vergeben!");
    },
    onError: () => {
      toast.error("Fehler beim Vergeben");
    },
  });

  // Statistics
  const stats = {
    total: listings?.length || 0,
    active: listings?.filter(l => l.status === "active").length || 0,
    awarded: listings?.filter(l => l.status === "awarded").length || 0,
    expired: listings?.filter(l => l.status === "expired").length || 0,
    totalBids: listings?.reduce((sum, l) => sum + (l.bid_count || 0), 0) || 0,
  };

  const filteredListings = listings?.filter(listing => {
    const searchLower = searchTerm.toLowerCase();
    return (
      listing.from_city.toLowerCase().includes(searchLower) ||
      listing.to_city.toLowerCase().includes(searchLower) ||
      listing.from_postal.includes(searchTerm) ||
      listing.to_postal.includes(searchTerm)
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Aktiv</Badge>;
      case "awarded":
        return <Badge className="bg-blue-500">Vergeben</Badge>;
      case "expired":
        return <Badge variant="secondary">Abgelaufen</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Abgebrochen</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getBidStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Ausstehend</Badge>;
      case "accepted":
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Angenommen</Badge>;
      case "rejected":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Abgelehnt</Badge>;
      case "withdrawn":
        return <Badge variant="secondary">Zurückgezogen</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Gavel className="h-8 w-8 text-primary" />
              Bieter-Aufträge
            </h1>
            <p className="text-muted-foreground mt-1">
              Verwaltung aller öffentlichen Umzugsausschreibungen
            </p>
          </div>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Aktualisieren
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="listings" className="space-y-4">
          <TabsList>
            <TabsTrigger value="listings" className="flex items-center gap-2">
              <Gavel className="h-4 w-4" />
              Ausschreibungen
            </TabsTrigger>
            <TabsTrigger value="ai-review" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Review
            </TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Gesamt</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.active}</p>
                  <p className="text-xs text-muted-foreground">Aktiv</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.awarded}</p>
                  <p className="text-xs text-muted-foreground">Vergeben</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.expired}</p>
                  <p className="text-xs text-muted-foreground">Abgelaufen</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Gavel className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalBids}</p>
                  <p className="text-xs text-muted-foreground">Gebote</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Suche nach Stadt oder PLZ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Status</SelectItem>
                  <SelectItem value="active">Aktiv</SelectItem>
                  <SelectItem value="awarded">Vergeben</SelectItem>
                  <SelectItem value="expired">Abgelaufen</SelectItem>
                  <SelectItem value="cancelled">Abgebrochen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Listings Table */}
        <Card>
          <CardHeader>
            <CardTitle>Ausschreibungen ({filteredListings?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {listingsLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Route</TableHead>
                    <TableHead>Umzugsdatum</TableHead>
                    <TableHead>Grösse</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Gebote</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Erstellt</TableHead>
                    <TableHead>Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredListings?.map((listing) => (
                    <TableRow key={listing.id}>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{listing.from_postal} {listing.from_city}</span>
                          <span className="text-muted-foreground">→</span>
                          <span>{listing.to_postal} {listing.to_city}</span>
                        </div>
                        {listing.is_urgent && (
                          <Badge variant="destructive" className="mt-1 text-xs">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Dringend
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {format(new Date(listing.move_date), "dd.MM.yyyy", { locale: de })}
                        </div>
                      </TableCell>
                      <TableCell>{listing.apartment_size}</TableCell>
                      <TableCell>
                        {listing.budget_min && listing.budget_max ? (
                          <span>CHF {listing.budget_min} - {listing.budget_max}</span>
                        ) : listing.starting_price ? (
                          <span>ab CHF {listing.starting_price}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                        {listing.current_lowest_bid && (
                          <div className="flex items-center gap-1 text-green-600 text-sm">
                            <TrendingDown className="h-3 w-3" />
                            CHF {listing.current_lowest_bid}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{listing.bid_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Eye className="h-3 w-3" />
                          {listing.view_count || 0} Ansichten
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(listing.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(listing.created_at), "dd.MM.yy HH:mm", { locale: de })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedListing(listing);
                              setShowBidsDialog(true);
                            }}
                          >
                            <Gavel className="w-4 h-4 mr-1" />
                            Gebote ({listing.bid_count || 0})
                          </Button>
                          {listing.status === "active" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateStatusMutation.mutate({ id: listing.id, status: "expired" })}
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Bids Dialog */}
        <Dialog open={showBidsDialog} onOpenChange={setShowBidsDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5" />
                Gebote für Ausschreibung
              </DialogTitle>
            </DialogHeader>

            {selectedListing && (
              <div className="space-y-4">
                {/* Listing Summary */}
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Route</p>
                        <p className="font-medium">
                          {selectedListing.from_postal} {selectedListing.from_city} → {selectedListing.to_postal} {selectedListing.to_city}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Umzugsdatum</p>
                        <p className="font-medium">
                          {format(new Date(selectedListing.move_date), "dd.MM.yyyy", { locale: de })}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Wohnungsgrösse</p>
                        <p className="font-medium">{selectedListing.apartment_size}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Leistungen</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedListing.services_requested.map((service, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Bids List */}
                {bidsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : bids && bids.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Firma</TableHead>
                        <TableHead>Gebot</TableHead>
                        <TableHead>Leistungen</TableHead>
                        <TableHead>Verfügbar</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Eingereicht</TableHead>
                        <TableHead>Aktionen</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bids.map((bid, index) => (
                        <TableRow key={bid.id} className={index === 0 ? "bg-green-50 dark:bg-green-950/20" : ""}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{bid.provider?.company_name || "Unbekannt"}</p>
                              <p className="text-xs text-muted-foreground">{bid.provider?.city}</p>
                              {bid.provider?.verification_status === "approved" && (
                                <Badge variant="outline" className="text-xs mt-1">
                                  <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                                  Verifiziert
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <span className="text-lg font-bold text-primary">CHF {bid.bid_amount}</span>
                              {index === 0 && (
                                <Badge className="bg-green-500 text-xs">Niedrigstes</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {bid.includes_services.map((service, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {service}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            {bid.available_date ? (
                              format(new Date(bid.available_date), "dd.MM.yyyy", { locale: de })
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                            {bid.estimated_duration_hours && (
                              <p className="text-xs text-muted-foreground">
                                ~{bid.estimated_duration_hours}h Dauer
                              </p>
                            )}
                          </TableCell>
                          <TableCell>{getBidStatusBadge(bid.status)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {format(new Date(bid.created_at), "dd.MM.yy HH:mm", { locale: de })}
                          </TableCell>
                          <TableCell>
                            {bid.status === "pending" && selectedListing.status === "active" && (
                              <Button
                                size="sm"
                                onClick={() => awardBidMutation.mutate({ 
                                  bidId: bid.id, 
                                  listingId: selectedListing.id 
                                })}
                                disabled={awardBidMutation.isPending}
                              >
                                <Award className="w-4 h-4 mr-1" />
                                Vergeben
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Gavel className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>Noch keine Gebote eingegangen</p>
                  </div>
                )}

                {/* Bid Message Preview */}
                {bids && bids.length > 0 && bids.some(b => b.message) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Nachrichten der Bieter</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {bids.filter(b => b.message).map((bid) => (
                        <div key={bid.id} className="p-3 bg-muted rounded-lg">
                          <p className="font-medium text-sm">{bid.provider?.company_name}</p>
                          <p className="text-sm text-muted-foreground mt-1">{bid.message}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
          </TabsContent>

          <TabsContent value="ai-review">
            <CalculatorFlowReview />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
