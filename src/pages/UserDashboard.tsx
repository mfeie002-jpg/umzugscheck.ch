import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, Search, FileText, Clock, Building2, Calculator, 
  CheckCircle, ArrowRight, Trash2, Bell, Star, MapPin,
  TrendingUp, Calendar, Package, Truck
} from "lucide-react";
import { useFavorites } from "@/components/FavoriteCompanies";
import MoveProgressTracker from "@/components/MoveProgressTracker";
import MovingChecklist from "@/components/MovingChecklist";
import QuoteComparisonTable from "@/components/QuoteComparisonTable";
import SavedSearches from "@/components/SavedSearches";

interface QuoteRequest {
  id: string;
  companyName: string;
  status: "pending" | "received" | "accepted" | "declined";
  requestDate: Date;
  responseDate?: Date;
  estimatedPrice?: string;
}

const UserDashboard = () => {
  const { favorites, toggleFavorite } = useFavorites();
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  // Load mock quote requests
  useEffect(() => {
    const mockRequests: QuoteRequest[] = [
      {
        id: "1",
        companyName: "Züri Umzüge AG",
        status: "received",
        requestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        responseDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        estimatedPrice: "CHF 1'450 - 1'800"
      },
      {
        id: "2",
        companyName: "Express Moving GmbH",
        status: "pending",
        requestDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        id: "3",
        companyName: "Swiss Relocation",
        status: "received",
        requestDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        responseDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        estimatedPrice: "CHF 1'200 - 1'500"
      }
    ];
    setQuoteRequests(mockRequests);
  }, []);

  const getStatusBadge = (status: QuoteRequest["status"]) => {
    const config = {
      pending: { label: "Ausstehend", variant: "secondary" as const, icon: Clock },
      received: { label: "Erhalten", variant: "default" as const, icon: CheckCircle },
      accepted: { label: "Angenommen", variant: "default" as const, icon: CheckCircle },
      declined: { label: "Abgelehnt", variant: "destructive" as const, icon: Trash2 },
    };
    const { label, variant, icon: Icon } = config[status];
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  const stats = {
    favorites: favorites.length,
    pendingQuotes: quoteRequests.filter(q => q.status === "pending").length,
    receivedQuotes: quoteRequests.filter(q => q.status === "received").length,
    savedSearches: 3,
  };

  return (
    <>
      <OptimizedSEO
        title="Mein Dashboard | Umzugscheck.ch"
        description="Verwalten Sie Ihre Umzugsanfragen, Favoriten und Fortschritt an einem Ort."
        keywords="umzug dashboard, umzugsanfragen, favoriten"
        canonicalUrl="https://umzugscheck.ch/dashboard"
      />

      <div className="min-h-screen bg-background pb-20 md:pb-0">
        {/* Hero Section */}
        <section className="gradient-light py-8 md:py-12">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Mein Umzugs-Dashboard</h1>
                <p className="text-muted-foreground">
                  Alle Ihre Umzugsaktivitäten an einem Ort
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Stats Overview */}
        <section className="py-6 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="text-center">
                  <CardContent className="pt-4">
                    <Heart className="h-6 w-6 mx-auto mb-2 text-red-500" />
                    <div className="text-2xl font-bold">{stats.favorites}</div>
                    <div className="text-xs text-muted-foreground">Favoriten</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-4">
                    <Clock className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                    <div className="text-2xl font-bold">{stats.pendingQuotes}</div>
                    <div className="text-xs text-muted-foreground">Ausstehend</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-4">
                    <FileText className="h-6 w-6 mx-auto mb-2 text-green-500" />
                    <div className="text-2xl font-bold">{stats.receivedQuotes}</div>
                    <div className="text-xs text-muted-foreground">Offerten</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-4">
                    <Search className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                    <div className="text-2xl font-bold">{stats.savedSearches}</div>
                    <div className="text-xs text-muted-foreground">Suchen</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-5 mb-6">
                  <TabsTrigger value="overview" className="text-xs md:text-sm">Übersicht</TabsTrigger>
                  <TabsTrigger value="quotes" className="text-xs md:text-sm">Offerten</TabsTrigger>
                  <TabsTrigger value="favorites" className="text-xs md:text-sm">Favoriten</TabsTrigger>
                  <TabsTrigger value="progress" className="text-xs md:text-sm">Fortschritt</TabsTrigger>
                  <TabsTrigger value="searches" className="text-xs md:text-sm">Suchen</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  {/* Quick Actions */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <Link to="/umzugsofferten">
                      <Card className="hover:border-primary transition-colors cursor-pointer h-full">
                        <CardContent className="pt-6 text-center">
                          <Calculator className="h-8 w-8 mx-auto mb-3 text-primary" />
                          <h3 className="font-semibold mb-1">Neuer Kostenvoranschlag</h3>
                          <p className="text-xs text-muted-foreground">Berechnen Sie Ihre Umzugskosten</p>
                        </CardContent>
                      </Card>
                    </Link>
                    <Link to="/firmen">
                      <Card className="hover:border-primary transition-colors cursor-pointer h-full">
                        <CardContent className="pt-6 text-center">
                          <Building2 className="h-8 w-8 mx-auto mb-3 text-primary" />
                          <h3 className="font-semibold mb-1">Firmen finden</h3>
                          <p className="text-xs text-muted-foreground">Durchsuchen Sie über 200 Firmen</p>
                        </CardContent>
                      </Card>
                    </Link>
                    <Link to="/tools">
                      <Card className="hover:border-primary transition-colors cursor-pointer h-full">
                        <CardContent className="pt-6 text-center">
                          <Package className="h-8 w-8 mx-auto mb-3 text-primary" />
                          <h3 className="font-semibold mb-1">Umzugs-Tools</h3>
                          <p className="text-xs text-muted-foreground">Checklisten, Planer & mehr</p>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>

                  {/* Recent Quotes */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Aktuelle Offerten
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {quoteRequests.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p>Noch keine Offerten angefragt</p>
                          <Link to="/umzugsofferten">
                            <Button className="mt-4">Offerten anfragen</Button>
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {quoteRequests.slice(0, 3).map((request) => (
                            <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <h4 className="font-medium">{request.companyName}</h4>
                                <p className="text-xs text-muted-foreground">
                                  Angefragt: {request.requestDate.toLocaleDateString('de-CH')}
                                </p>
                                {request.estimatedPrice && (
                                  <p className="text-sm font-medium text-primary mt-1">{request.estimatedPrice}</p>
                                )}
                              </div>
                              {getStatusBadge(request.status)}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Mini Progress */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Umzugs-Fortschritt
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <MoveProgressTracker />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Quotes Tab */}
                <TabsContent value="quotes" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Meine Offerten</CardTitle>
                      <CardDescription>Verwalten Sie Ihre angefragten Offerten</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <QuoteComparisonTable />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Favorites Tab */}
                <TabsContent value="favorites" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-red-500" />
                        Meine Favoriten
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {favorites.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Heart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p>Noch keine Favoriten gespeichert</p>
                          <Link to="/firmen">
                            <Button className="mt-4">Firmen entdecken</Button>
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {favorites.map((company) => (
                            <div key={company.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                  <Building2 className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <h4 className="font-medium">{company.name}</h4>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                    {company.rating}
                                    <span>•</span>
                                    <span>{company.price_level}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Link to={`/umzugsfirmen/${company.id}`}>
                                  <Button size="sm" variant="outline">
                                    Ansehen
                                  </Button>
                                </Link>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => toggleFavorite(company)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Progress Tab */}
                <TabsContent value="progress" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Umzugs-Checkliste</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <MovingChecklist />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Searches Tab */}
                <TabsContent value="searches" className="space-y-6">
                  <SavedSearches />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default UserDashboard;
