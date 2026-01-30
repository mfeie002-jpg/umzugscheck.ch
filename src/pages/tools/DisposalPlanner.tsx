import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trash2, Recycle, MapPin, Calendar as CalendarIcon, Download, 
  ExternalLink, AlertTriangle, CheckCircle, Info, Truck,
  Newspaper, Wine, Package, Sofa, Plug, Shirt, Leaf, Droplet, Battery, ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { 
  generateDisposalPlan, 
  getDisposalCategories,
  generateDisposalCalendarICS,
  getCityFromPostalCode,
  CITY_DISPOSAL_INFO,
  getCommonMovingItems,
  classifyItems,
  groupByCategory
} from '@/lib/relo-os/swiss-integration/disposal';
import type { DisposalCategory, RecyclingCenter, DisposalRecommendation } from '@/lib/relo-os/swiss-integration/disposal/types';

const ICON_MAP: Record<string, React.ElementType> = {
  'Trash2': Trash2,
  'Newspaper': Newspaper,
  'Wine': Wine,
  'Package': Package,
  'Recycle': Recycle,
  'Plug': Plug,
  'Sofa': Sofa,
  'Shirt': Shirt,
  'Leaf': Leaf,
  'Droplet': Droplet,
  'Battery': Battery,
  'AlertTriangle': AlertTriangle,
};

export default function DisposalPlanner() {
  const [postalCode, setPostalCode] = useState('');
  const [moveDate, setMoveDate] = useState<Date>();
  const [categories, setCategories] = useState<DisposalCategory[]>([]);
  const [recyclingCenters, setRecyclingCenters] = useState<RecyclingCenter[]>([]);
  const [recommendations, setRecommendations] = useState<DisposalRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [cityInfo, setCityInfo] = useState<{ name: string; calendarUrl?: string } | null>(null);

  useEffect(() => {
    // Load categories on mount
    getDisposalCategories().then(setCategories);
  }, []);

  const handleGeneratePlan = async () => {
    if (!postalCode || !moveDate) return;
    
    setIsLoading(true);
    try {
      const plan = await generateDisposalPlan(postalCode, moveDate);
      setCategories(plan.categories);
      setRecyclingCenters(plan.nearbyRecyclingCenters);
      setRecommendations(plan.recommendations);
      
      const citySlug = getCityFromPostalCode(postalCode);
      if (citySlug && CITY_DISPOSAL_INFO[citySlug]) {
        setCityInfo({
          name: citySlug.charAt(0).toUpperCase() + citySlug.slice(1),
          calendarUrl: CITY_DISPOSAL_INFO[citySlug].calendarUrl,
        });
      }
      
      setHasResult(true);
    } catch (error) {
      console.error('Error generating disposal plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCalendar = () => {
    if (!moveDate) return;
    
    const schedules = recommendations.map(r => ({
      category_id: r.category_id,
      next_collection: r.deadline,
    }));
    
    const icsContent = generateDisposalCalendarICS(schedules, moveDate);
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'entsorgungsplan.ics';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  // Classify common moving items for display
  const classifiedItems = classifyItems(getCommonMovingItems());
  const groupedItems = groupByCategory(classifiedItems);

  return (
    <>
      <Helmet>
        <title>Entsorgungs- & Sperrgut Planer | Umzugscheck.ch</title>
        <meta name="description" content="Planen Sie die Entsorgung beim Umzug: Sperrgut, Elektroschrott, Recycling. Finden Sie Sammeltermine und Recyclinghöfe in Ihrer Nähe." />
        <link rel="canonical" href="https://umzugscheck.ch/entsorgungsplaner" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "Umzug Entsorgung planen",
            "description": "Schritt-für-Schritt Anleitung zur Entsorgung beim Umzug in der Schweiz",
            "step": [
              { "@type": "HowToStep", "name": "PLZ eingeben", "text": "Geben Sie Ihre Postleitzahl ein" },
              { "@type": "HowToStep", "name": "Umzugsdatum wählen", "text": "Wählen Sie Ihr Umzugsdatum" },
              { "@type": "HowToStep", "name": "Plan generieren", "text": "Erhalten Sie Ihren personalisierten Entsorgungsplan" }
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-12 md:py-20">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 mb-4">
                <Recycle className="h-4 w-4" />
                <span className="text-sm font-medium">Kostenloses Tool</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Entsorgungs- & Sperrgut Planer
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Planen Sie die Entsorgung beim Umzug: Sperrgut, Elektroschrott, Recycling. 
                Finden Sie Sammeltermine und Recyclinghöfe in Ihrer Nähe.
              </p>
            </div>

            {/* Input Form */}
            <Card className="max-w-xl mx-auto">
              <CardContent className="p-6">
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Postleitzahl</label>
                    <Input
                      type="text"
                      placeholder="z.B. 8001"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      maxLength={4}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Umzugsdatum</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !moveDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {moveDate ? format(moveDate, "PPP", { locale: de }) : "Datum wählen"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={moveDate}
                          onSelect={setMoveDate}
                          locale={de}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <Button 
                    onClick={handleGeneratePlan}
                    disabled={!postalCode || postalCode.length !== 4 || !moveDate || isLoading}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? 'Wird geladen...' : 'Entsorgungsplan erstellen'}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Results Section */}
        {hasResult && (
          <section className="py-12">
            <div className="container max-w-6xl mx-auto px-4">
              {/* City Info & Actions */}
              {cityInfo && (
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Entsorgungsplan für {cityInfo.name}
                    </h2>
                    <p className="text-muted-foreground">
                      Umzug am {moveDate && format(moveDate, "PPP", { locale: de })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleDownloadCalendar}>
                      <Download className="h-4 w-4 mr-2" />
                      Kalender (.ics)
                    </Button>
                    {cityInfo.calendarUrl && (
                      <Button variant="outline" asChild>
                        <a href={cityInfo.calendarUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Offizieller Kalender
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Recommendations Alert */}
              {recommendations.filter(r => r.urgency === 'high').length > 0 && (
                <Card className="mb-8 border-destructive/50 bg-destructive/5">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-destructive mb-2">Wichtige Hinweise</h3>
                        <ul className="space-y-1 text-sm">
                          {recommendations.filter(r => r.urgency === 'high').map((rec, i) => (
                            <li key={i}>{rec.recommendation}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Tabs defaultValue="categories" className="space-y-6">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                  <TabsTrigger value="categories">Kategorien</TabsTrigger>
                  <TabsTrigger value="centers">Recyclinghöfe</TabsTrigger>
                  <TabsTrigger value="items">Artikel-Guide</TabsTrigger>
                </TabsList>

                {/* Categories Tab */}
                <TabsContent value="categories" className="space-y-4">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => {
                      const IconComponent = ICON_MAP[category.icon] || Trash2;
                      return (
                        <Card key={category.id}>
                          <CardHeader className="pb-2">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-primary/10">
                                <IconComponent className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <CardTitle className="text-base">{category.name_de}</CardTitle>
                                <Badge variant="outline" className="text-xs mt-1">
                                  {category.disposal_type === 'collection' ? 'Abholung' : 
                                   category.disposal_type === 'drop_off' ? 'Sammelstelle' : 'Sonderabfall'}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-2">
                              {category.description_de}
                            </p>
                            {category.tips_de && (
                              <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                                <Info className="h-3 w-3 mt-0.5 shrink-0" />
                                {category.tips_de}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>

                {/* Recycling Centers Tab */}
                <TabsContent value="centers" className="space-y-4">
                  {recyclingCenters.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      {recyclingCenters.map((center) => (
                        <Card key={center.id}>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <MapPin className="h-5 w-5 text-primary" />
                              {center.name}
                            </CardTitle>
                            <CardDescription>{center.address}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {center.opening_hours && (
                              <div className="text-sm">
                                <span className="font-medium">Öffnungszeiten:</span>
                                <ul className="mt-1 space-y-0.5 text-muted-foreground">
                                  {Object.entries(center.opening_hours).map(([day, hours]) => (
                                    <li key={day} className="flex justify-between">
                                      <span className="uppercase">{day}</span>
                                      <span>{hours}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            <div className="flex flex-wrap gap-1">
                              {center.accepted_categories.slice(0, 5).map(cat => (
                                <Badge key={cat} variant="secondary" className="text-xs">
                                  {cat}
                                </Badge>
                              ))}
                              {center.accepted_categories.length > 5 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{center.accepted_categories.length - 5}
                                </Badge>
                              )}
                            </div>

                            {center.website_url && (
                              <Button variant="outline" size="sm" asChild className="w-full">
                                <a href={center.website_url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Website
                                </a>
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-semibold mb-2">Keine Recyclinghöfe gefunden</h3>
                        <p className="text-muted-foreground">
                          Für diese Region sind noch keine Recyclinghöfe in unserer Datenbank.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Items Guide Tab */}
                <TabsContent value="items" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Typische Umzugsartikel & Entsorgung</CardTitle>
                      <CardDescription>
                        So entsorgen Sie häufige Gegenstände beim Umzug richtig
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {Object.entries(groupedItems).map(([categoryId, items]) => {
                          const category = categories.find(c => c.id === categoryId);
                          const IconComponent = category?.icon ? ICON_MAP[category.icon] : Trash2;
                          
                          return (
                            <div key={categoryId}>
                              <div className="flex items-center gap-2 mb-3">
                                <IconComponent className="h-5 w-5 text-primary" />
                                <h4 className="font-semibold">{category?.name_de || categoryId}</h4>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {items.map((item, i) => (
                                  <Badge 
                                    key={i} 
                                    variant={item.confidence === 'high' ? 'default' : 'outline'}
                                    className="text-sm"
                                  >
                                    {item.item}
                                    {item.confidence !== 'high' && (
                                      <Info className="h-3 w-3 ml-1" />
                                    )}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Empfehlungen für Ihren Umzug
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Badge className={cn("shrink-0 mt-0.5", getUrgencyColor(rec.urgency))}>
                            {rec.urgency === 'high' ? 'Dringend' : rec.urgency === 'medium' ? 'Wichtig' : 'Tipp'}
                          </Badge>
                          <div>
                            <p className="text-sm">{rec.recommendation}</p>
                            {rec.deadline && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Bis: {format(rec.deadline, "PPP", { locale: de })}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>
        )}

        {/* Info Section (always visible) */}
        {!hasResult && (
          <section className="py-12 bg-muted/30">
            <div className="container max-w-4xl mx-auto px-4">
              <h2 className="text-2xl font-bold text-center mb-8">
                So funktioniert die Entsorgung beim Umzug
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Sofa className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Sperrgut</h3>
                    <p className="text-sm text-muted-foreground">
                      Möbel, Matratzen und grosse Gegenstände müssen vorab angemeldet werden.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Plug className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Elektroschrott</h3>
                    <p className="text-sm text-muted-foreground">
                      Elektrogeräte können kostenlos im Fachhandel oder am Recyclinghof abgegeben werden.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Recycle className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Recycling</h3>
                    <p className="text-sm text-muted-foreground">
                      Glas, Papier, Karton und PET werden separat gesammelt - nutzen Sie die Sammelstellen.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
