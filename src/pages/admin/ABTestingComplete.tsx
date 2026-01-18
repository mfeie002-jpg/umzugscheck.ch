/**
 * Complete A/B Testing Admin Page
 * Includes Flow Variants, Navigation Variants, Homepage Sections, and Company Ranking Tests
 */

import { AdminLayout } from "@/components/admin/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlowVariantManager } from "@/components/admin/FlowVariantManager";
import { NavigationVariantManager } from "@/components/admin/NavigationVariantManager";
import { HomepageSectionManager } from "@/components/admin/HomepageSectionManager";
import { ABTestManager } from "@/components/admin/ABTestManager";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FlaskConical, Navigation2, Building2, LayoutGrid } from "lucide-react";

export default function ABTestingComplete() {
  const [currentFeatured, setCurrentFeatured] = useState<any[]>([]);
  const [currentOrganic, setCurrentOrganic] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentRankings();
  }, []);

  const fetchCurrentRankings = async () => {
    try {
      const { data: featured } = await supabase
        .from('service_providers')
        .select('*')
        .eq('is_featured', true)
        .order('featured_position', { ascending: true });

      const { data: organic } = await supabase
        .from('service_providers')
        .select('*')
        .eq('is_featured', false)
        .order('ranking_position', { ascending: true });

      setCurrentFeatured(featured || []);
      setCurrentOrganic(organic || []);
    } catch (error) {
      console.error('Error fetching rankings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FlaskConical className="h-8 w-8 text-primary" />
            A/B Testing Center
          </h1>
          <p className="text-muted-foreground mt-2">
            Verwalten Sie alle A/B Tests: Flow-Varianten, Navigation, Homepage-Sektionen und Firmen-Rankings
          </p>
        </div>

        <Tabs defaultValue="flows" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="flows" className="flex items-center gap-2">
              <FlaskConical className="h-4 w-4" />
              Flow Varianten
            </TabsTrigger>
            <TabsTrigger value="navigation" className="flex items-center gap-2">
              <Navigation2 className="h-4 w-4" />
              Navigation
            </TabsTrigger>
            <TabsTrigger value="sections" className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" />
              Homepage Sections
            </TabsTrigger>
            <TabsTrigger value="rankings" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Firmen-Rankings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="flows">
            <FlowVariantManager />
          </TabsContent>

          <TabsContent value="navigation">
            <NavigationVariantManager />
          </TabsContent>

          <TabsContent value="sections">
            <HomepageSectionManager />
          </TabsContent>

          <TabsContent value="rankings">
            {loading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <ABTestManager 
                currentFeatured={currentFeatured} 
                currentOrganic={currentOrganic} 
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
