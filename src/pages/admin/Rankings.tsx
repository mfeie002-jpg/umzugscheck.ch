import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GripVertical, Star, Crown, Save, RefreshCw } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Company {
  id: string;
  company_name: string;
  logo_url: string | null;
  verification_status: string;
  is_featured: boolean;
  ranking_position: number | null;
  featured_position: number | null;
  cantons_served: string[];
  price_level: string | null;
}

interface SortableItemProps {
  id: string;
  company: Company;
  position: number;
  isFeatured: boolean;
}

const SortableItem = ({ id, company, position, isFeatured }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-background border rounded-lg p-4 mb-2"
    >
      <div className="flex items-center gap-4">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-2 hover:bg-muted rounded"
        >
          <GripVertical className="w-5 h-5 text-muted-foreground" />
        </div>

        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
          {position}
        </div>

        {company.logo_url ? (
          <img
            src={company.logo_url}
            alt={company.company_name}
            className="w-12 h-12 object-contain rounded"
          />
        ) : (
          <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
            <Crown className="w-6 h-6 text-muted-foreground" />
          </div>
        )}

        <div className="flex-1">
          <h3 className="font-semibold flex items-center gap-2">
            {company.company_name}
            {isFeatured && (
              <Badge variant="secondary" className="bg-primary text-primary-foreground">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
            {company.verification_status === "approved" && (
              <Badge variant="outline" className="text-xs">
                Verifiziert
              </Badge>
            )}
          </h3>
          <p className="text-sm text-muted-foreground">
            {company.cantons_served.slice(0, 3).join(", ")}
            {company.price_level && ` • ${company.price_level}`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function Rankings() {
  const [organicCompanies, setOrganicCompanies] = useState<Company[]>([]);
  const [featuredCompanies, setFeaturedCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("service_providers")
        .select("*")
        .eq("verification_status", "approved")
        .order("ranking_position", { ascending: true, nullsFirst: false });

      if (error) throw error;

      if (data) {
        const featured = data
          .filter((c) => c.is_featured)
          .sort((a, b) => (a.featured_position || 999) - (b.featured_position || 999));
        
        const organic = data
          .filter((c) => !c.is_featured)
          .sort((a, b) => (a.ranking_position || 999) - (b.ranking_position || 999));

        setFeaturedCompanies(featured);
        setOrganicCompanies(organic);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast({
        title: "Fehler",
        description: "Firmen konnten nicht geladen werden",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent, isFeatured: boolean) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const companies = isFeatured ? featuredCompanies : organicCompanies;
    const setCompanies = isFeatured ? setFeaturedCompanies : setOrganicCompanies;

    const oldIndex = companies.findIndex((c) => c.id === active.id);
    const newIndex = companies.findIndex((c) => c.id === over.id);

    setCompanies(arrayMove(companies, oldIndex, newIndex));
  };

  const saveRankings = async () => {
    try {
      setSaving(true);

      // Update featured companies
      const featuredUpdates = featuredCompanies.map((company, index) => ({
        id: company.id,
        featured_position: index + 1,
        is_featured: true,
      }));

      // Update organic companies
      const organicUpdates = organicCompanies.map((company, index) => ({
        id: company.id,
        ranking_position: index + 1,
      }));

      // Batch update
      for (const update of [...featuredUpdates, ...organicUpdates]) {
        const { error } = await supabase
          .from("service_providers")
          .update(update)
          .eq("id", update.id);

        if (error) throw error;
      }

      toast({
        title: "Gespeichert",
        description: "Rankings wurden erfolgreich aktualisiert",
      });
    } catch (error) {
      console.error("Error saving rankings:", error);
      toast({
        title: "Fehler",
        description: "Rankings konnten nicht gespeichert werden",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Rankings verwalten | Admin | Umzugscheck.ch</title>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />

        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Rankings verwalten</h1>
                  <p className="text-muted-foreground">
                    Verwalten Sie die Reihenfolge der Firmen in Featured und organischen Rankings
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={fetchCompanies}
                    disabled={loading}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Neu laden
                  </Button>
                  <Button
                    onClick={saveRankings}
                    disabled={saving || loading}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? "Speichert..." : "Speichern"}
                  </Button>
                </div>
              </div>

              {loading ? (
                <Card className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Lade Firmen...</p>
                </Card>
              ) : (
                <Tabs defaultValue="featured" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="featured">
                      Featured ({featuredCompanies.length})
                    </TabsTrigger>
                    <TabsTrigger value="organic">
                      Organisch ({organicCompanies.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="featured" className="mt-6">
                    <Card className="p-6">
                      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        Featured / Gesponserte Firmen
                      </h2>
                      <p className="text-sm text-muted-foreground mb-6">
                        Diese Firmen erscheinen ganz oben in den Rankings mit "Gesponsert" Badge.
                        Ziehen Sie die Karten, um die Reihenfolge zu ändern.
                      </p>

                      {featuredCompanies.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          Keine Featured-Firmen vorhanden
                        </div>
                      ) : (
                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={(e) => handleDragEnd(e, true)}
                        >
                          <SortableContext
                            items={featuredCompanies.map((c) => c.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {featuredCompanies.map((company, index) => (
                              <SortableItem
                                key={company.id}
                                id={company.id}
                                company={company}
                                position={index + 1}
                                isFeatured={true}
                              />
                            ))}
                          </SortableContext>
                        </DndContext>
                      )}
                    </Card>
                  </TabsContent>

                  <TabsContent value="organic" className="mt-6">
                    <Card className="p-6">
                      <h2 className="text-xl font-bold mb-4">
                        Organisches Ranking
                      </h2>
                      <p className="text-sm text-muted-foreground mb-6">
                        Diese Firmen erscheinen nach den Featured-Firmen im Standard-Ranking.
                        Ziehen Sie die Karten, um die Reihenfolge zu ändern.
                      </p>

                      {organicCompanies.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          Keine Firmen im organischen Ranking
                        </div>
                      ) : (
                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={(e) => handleDragEnd(e, false)}
                        >
                          <SortableContext
                            items={organicCompanies.map((c) => c.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {organicCompanies.map((company, index) => (
                              <SortableItem
                                key={company.id}
                                id={company.id}
                                company={company}
                                position={index + featuredCompanies.length + 1}
                                isFeatured={false}
                              />
                            ))}
                          </SortableContext>
                        </DndContext>
                      )}
                    </Card>
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
