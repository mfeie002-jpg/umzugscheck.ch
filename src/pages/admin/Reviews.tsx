import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Star,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  Search,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Filter,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ReviewCard } from "@/components/reviews/ReviewCard";

interface ReviewWithCompany {
  id: string;
  company_id: string;
  user_id: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  helpful_count: number;
  photos: string[];
  created_at: string;
  service_ratings: any;
  companies: {
    name: string;
    logo: string;
  };
  profiles?: {
    full_name: string;
  } | null;
  response?: {
    id: string;
    response: string;
    created_at: string;
  } | null;
}

const AdminReviews = () => {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<ReviewWithCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCompany, setFilterCompany] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"recent" | "rating" | "helpful">("recent");
  const [companies, setCompanies] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchCompanies();
      fetchReviews();
    }
  }, [isAdmin, sortBy]);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Zugriff verweigert",
        description: "Sie müssen als Administrator angemeldet sein.",
        variant: "destructive",
      });
      return;
    }

    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    setIsAdmin(!!data);

    if (!data) {
      toast({
        title: "Zugriff verweigert",
        description: "Sie haben keine Administrator-Rechte.",
        variant: "destructive",
      });
    }
  };

  const fetchCompanies = async () => {
    const { data } = await supabase
      .from("companies")
      .select("id, name")
      .order("name");

    if (data) {
      setCompanies(data);
    }
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("reviews")
        .select("*, companies!inner(name, logo)")
        .order("created_at", { ascending: false });

      if (sortBy === "rating") {
        query = query.order("rating", { ascending: false });
      } else if (sortBy === "helpful") {
        query = query.order("helpful_count", { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        const reviewsWithData = await Promise.all(
          data.map(async (review) => {
            const { data: profile } = await supabase
              .from("profiles")
              .select("full_name")
              .eq("id", review.user_id)
              .single();

            const { data: response } = await supabase
              .from("review_responses")
              .select("id, response, created_at")
              .eq("review_id", review.id)
              .single();

            return {
              ...review,
              profiles: profile,
              response: response,
            };
          })
        );
        setReviews(reviewsWithData);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast({
        title: "Fehler",
        description: "Bewertungen konnten nicht geladen werden.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const total = reviews.length;
    const withResponse = reviews.filter((r) => r.response).length;
    const needsResponse = total - withResponse;
    const averageRating =
      total > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / total : 0;
    const responseRate = total > 0 ? (withResponse / total) * 100 : 0;

    return {
      total,
      withResponse,
      needsResponse,
      averageRating,
      responseRate,
    };
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      searchQuery === "" ||
      review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.companies.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCompany =
      filterCompany === "all" || review.company_id === filterCompany;

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "responded" && review.response) ||
      (filterStatus === "pending" && !review.response);

    return matchesSearch && matchesCompany && matchesStatus;
  });

  const stats = calculateStats();

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Sie haben keine Berechtigung, diese Seite anzuzeigen.
            </AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Link to="/admin">
                <Button variant="ghost" className="mb-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Zurück zum Dashboard
                </Button>
              </Link>
              <h1 className="text-3xl font-bold mb-2">Bewertungsverwaltung</h1>
              <p className="text-muted-foreground">
                Verwalten Sie alle Bewertungen und Antworten an einem Ort
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Gesamt Bewertungen
                  </CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Durchschnitt
                  </CardTitle>
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.averageRating.toFixed(1)}
                  </div>
                  <p className="text-xs text-muted-foreground">von 5.0</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Antwortrate
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.responseRate.toFixed(0)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats.withResponse} von {stats.total}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Ausstehend
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.needsResponse}</div>
                  <p className="text-xs text-muted-foreground">
                    Warten auf Antwort
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Suchen..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={filterCompany} onValueChange={setFilterCompany}>
                    <SelectTrigger>
                      <SelectValue placeholder="Firma wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Firmen</SelectItem>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Status</SelectItem>
                      <SelectItem value="pending">Ausstehend</SelectItem>
                      <SelectItem value="responded">Beantwortet</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sortieren" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Neueste zuerst</SelectItem>
                      <SelectItem value="rating">Beste Bewertung</SelectItem>
                      <SelectItem value="helpful">Hilfreichste</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList>
                <TabsTrigger value="all">
                  Alle ({filteredReviews.length})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Ausstehend (
                  {filteredReviews.filter((r) => !r.response).length})
                </TabsTrigger>
                <TabsTrigger value="responded">
                  Beantwortet (
                  {filteredReviews.filter((r) => r.response).length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : filteredReviews.length > 0 ? (
                  filteredReviews.map((review) => (
                    <div key={review.id} className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-lg">
                          {review.companies.logo}
                        </div>
                        <span className="font-semibold">{review.companies.name}</span>
                        {!review.response && (
                          <Badge variant="secondary" className="bg-yellow-400/10 text-yellow-600">
                            <Clock className="w-3 h-3 mr-1" />
                            Ausstehend
                          </Badge>
                        )}
                        {review.response && (
                          <Badge variant="secondary" className="bg-success/10 text-success">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Beantwortet
                          </Badge>
                        )}
                      </div>
                      <ReviewCard
                        id={review.id}
                        companyId={review.company_id}
                        userName={review.profiles?.full_name || "Anonymer Nutzer"}
                        userInitials={getUserInitials(
                          review.profiles?.full_name || "AN"
                        )}
                        rating={review.rating}
                        title={review.title}
                        comment={review.comment}
                        verified={review.verified}
                        helpfulCount={review.helpful_count}
                        photos={review.photos || []}
                        createdAt={review.created_at}
                        serviceRatings={review.service_ratings}
                        onVoteChange={fetchReviews}
                        response={review.response}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      Keine Bewertungen gefunden.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="pending" className="space-y-4">
                {filteredReviews
                  .filter((r) => !r.response)
                  .map((review) => (
                    <div key={review.id} className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-lg">
                          {review.companies.logo}
                        </div>
                        <span className="font-semibold">{review.companies.name}</span>
                        <Badge variant="secondary" className="bg-yellow-400/10 text-yellow-600">
                          <Clock className="w-3 h-3 mr-1" />
                          Ausstehend
                        </Badge>
                      </div>
                      <ReviewCard
                        id={review.id}
                        companyId={review.company_id}
                        userName={review.profiles?.full_name || "Anonymer Nutzer"}
                        userInitials={getUserInitials(
                          review.profiles?.full_name || "AN"
                        )}
                        rating={review.rating}
                        title={review.title}
                        comment={review.comment}
                        verified={review.verified}
                        helpfulCount={review.helpful_count}
                        photos={review.photos || []}
                        createdAt={review.created_at}
                        serviceRatings={review.service_ratings}
                        onVoteChange={fetchReviews}
                        response={review.response}
                      />
                    </div>
                  ))}
              </TabsContent>

              <TabsContent value="responded" className="space-y-4">
                {filteredReviews
                  .filter((r) => r.response)
                  .map((review) => (
                    <div key={review.id} className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-lg">
                          {review.companies.logo}
                        </div>
                        <span className="font-semibold">{review.companies.name}</span>
                        <Badge variant="secondary" className="bg-success/10 text-success">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Beantwortet
                        </Badge>
                      </div>
                      <ReviewCard
                        id={review.id}
                        companyId={review.company_id}
                        userName={review.profiles?.full_name || "Anonymer Nutzer"}
                        userInitials={getUserInitials(
                          review.profiles?.full_name || "AN"
                        )}
                        rating={review.rating}
                        title={review.title}
                        comment={review.comment}
                        verified={review.verified}
                        helpfulCount={review.helpful_count}
                        photos={review.photos || []}
                        createdAt={review.created_at}
                        serviceRatings={review.service_ratings}
                        onVoteChange={fetchReviews}
                        response={review.response}
                      />
                    </div>
                  ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminReviews;
