/**
 * ARCHETYP COMMAND CENTER
 * 
 * Das Vorzeigemodell. Der Maßstab. Die Referenz.
 * 
 * Struktur:
 * - Links: Asset Browser (Flows + Landing Pages)
 * - Rechts: Context Panel (Details, Versionen, Feedback)
 * 
 * Ein Klick für alles. Keine Tabs. Kein Feature-Overload.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { AdminLayout } from '@/components/admin/AdminLayout';

// Components
import { AssetBrowser } from '@/components/admin/command-center/AssetBrowser';
import { ContextPanel } from '@/components/admin/command-center/ContextPanel';
import { CommandBar } from '@/components/admin/command-center/CommandBar';
import { StatsBar } from '@/components/admin/command-center/StatsBar';

// Types
import type { Asset, AssetType } from '@/components/admin/command-center/types';

export default function CommandCenter() {
  // Core state - minimal, focused
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Stats
  const [stats, setStats] = useState({
    totalFlows: 0,
    totalPages: 0,
    avgScore: 0,
    pendingFeedback: 0,
  });

  // Load stats on mount
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Get flow count
      const { count: flowCount } = await supabase
        .from('flow_analysis_runs')
        .select('flow_id', { count: 'exact', head: true });
      
      // Get landing page count
      const { count: pageCount } = await supabase
        .from('landing_pages')
        .select('id', { count: 'exact', head: true });
      
      // Get average score
      const { data: scores } = await supabase
        .from('flow_analysis_runs')
        .select('overall_score')
        .not('overall_score', 'is', null)
        .order('created_at', { ascending: false })
        .limit(50);
      
      const avgScore = scores?.length 
        ? Math.round(scores.reduce((sum, s) => sum + (s.overall_score || 0), 0) / scores.length)
        : 0;
      
      // Get pending feedback count (versions without AI feedback)
      const { count: pendingCount } = await supabase
        .from('landing_page_versions')
        .select('id', { count: 'exact', head: true })
        .is('ai_feedback', null);
      
      setStats({
        totalFlows: flowCount || 0,
        totalPages: pageCount || 0,
        avgScore,
        pendingFeedback: pendingCount || 0,
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  // Asset selection handler
  const handleSelectAsset = useCallback((asset: Asset) => {
    setSelectedAsset(asset);
  }, []);

  // Refresh handler
  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    await loadStats();
    setIsLoading(false);
    toast.success('Daten aktualisiert');
  }, []);

  return (
    <AdminLayout>
      <div className="h-screen flex flex-col bg-background">
        {/* Command Bar - Top Actions */}
        <CommandBar 
          onRefresh={handleRefresh}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isLoading={isLoading}
        />
        
        {/* Stats Bar */}
        <StatsBar stats={stats} />
        
        {/* Main Content - Split View */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Asset Browser */}
          <div className="w-80 border-r bg-muted/20 overflow-hidden flex flex-col">
            <AssetBrowser 
              onSelectAsset={handleSelectAsset}
              selectedAsset={selectedAsset}
              searchQuery={searchQuery}
            />
          </div>
          
          {/* Right: Context Panel */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <ContextPanel 
                asset={selectedAsset}
                onAssetUpdate={handleRefresh}
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
