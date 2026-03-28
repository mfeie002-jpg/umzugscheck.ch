import { useState, useEffect } from 'react';
import { ABTestManager } from '@/components/admin/ABTestManager';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function ABTesting() {
  const [currentFeatured, setCurrentFeatured] = useState<any[]>([]);
  const [currentOrganic, setCurrentOrganic] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentRankings();
  }, []);

  const fetchCurrentRankings = async () => {
    try {
      // Fetch featured companies
      const { data: featured, error: featuredError } = await supabase
        .from('service_providers')
        .select('*')
        .eq('is_featured', true)
        .order('featured_position', { ascending: true });

      if (featuredError) throw featuredError;

      // Fetch organic (non-featured) companies
      const { data: organic, error: organicError } = await supabase
        .from('service_providers')
        .select('*')
        .eq('is_featured', false)
        .order('ranking_position', { ascending: true });

      if (organicError) throw organicError;

      setCurrentFeatured(featured || []);
      setCurrentOrganic(organic || []);
    } catch (error) {
      console.error('Error fetching rankings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">A/B Testing</h1>
        <ABTestManager currentFeatured={currentFeatured} currentOrganic={currentOrganic} />
      </div>
    </AdminLayout>
  );
}
