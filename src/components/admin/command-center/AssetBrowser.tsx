/**
 * ARCHETYP COMMAND CENTER - Asset Browser
 * 
 * Left panel: Browse all Flows + Landing Pages in one unified tree.
 * Click to select, see details on the right.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Layers, 
  MapPin, 
  ChevronRight, 
  ChevronDown,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import type { Asset, AssetType } from './types';

interface AssetBrowserProps {
  onSelectAsset: (asset: Asset) => void;
  selectedAsset: Asset | null;
  searchQuery: string;
}

interface AssetGroup {
  type: AssetType;
  label: string;
  icon: typeof Layers;
  items: Asset[];
}

export function AssetBrowser({ 
  onSelectAsset, 
  selectedAsset, 
  searchQuery 
}: AssetBrowserProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [flows, setFlows] = useState<Asset[]>([]);
  const [pages, setPages] = useState<Asset[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<AssetType>>(new Set(['flow', 'landing-page']));

  // Load assets on mount
  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    setIsLoading(true);
    
    try {
      // Load flows from flow_analysis_runs (distinct flow_ids)
      const { data: flowData } = await supabase
        .from('flow_analysis_runs')
        .select('flow_id, overall_score, created_at')
        .eq('status', 'completed')
        .order('created_at', { ascending: false });
      
      // Group by flow_id, take latest
      const flowMap = new Map<string, Asset>();
      flowData?.forEach(row => {
        if (!flowMap.has(row.flow_id)) {
          flowMap.set(row.flow_id, {
            id: row.flow_id,
            type: 'flow',
            name: row.flow_id.replace('umzugsofferten-', '').toUpperCase(),
            path: `/umzugsofferten/${row.flow_id}`,
            score: row.overall_score,
            lastUpdated: row.created_at,
            versionCount: 1,
            hasFeedback: false,
          });
        }
      });
      setFlows(Array.from(flowMap.values()));

      // Load landing pages
      const { data: pageData } = await supabase
        .from('landing_pages')
        .select(`
          id, 
          display_name, 
          url_path, 
          updated_at,
          landing_page_versions (id, ai_feedback),
          landing_page_analyses (overall_score)
        `)
        .eq('is_active', true)
        .order('priority', { ascending: false });

      const pageAssets: Asset[] = (pageData || []).map(page => ({
        id: page.id,
        type: 'landing-page' as AssetType,
        name: page.display_name,
        path: page.url_path,
        score: page.landing_page_analyses?.[0]?.overall_score || null,
        lastUpdated: page.updated_at,
        versionCount: page.landing_page_versions?.length || 0,
        hasFeedback: page.landing_page_versions?.some((v: any) => v.ai_feedback) || false,
      }));
      setPages(pageAssets);

    } catch (err) {
      console.error('Failed to load assets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter by search
  const filteredFlows = useMemo(() => {
    if (!searchQuery) return flows;
    const q = searchQuery.toLowerCase();
    return flows.filter(f => 
      f.name.toLowerCase().includes(q) || 
      f.path.toLowerCase().includes(q)
    );
  }, [flows, searchQuery]);

  const filteredPages = useMemo(() => {
    if (!searchQuery) return pages;
    const q = searchQuery.toLowerCase();
    return pages.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.path.toLowerCase().includes(q)
    );
  }, [pages, searchQuery]);

  const groups: AssetGroup[] = [
    { type: 'flow', label: 'Flows', icon: Layers, items: filteredFlows },
    { type: 'landing-page', label: 'Landing Pages', icon: MapPin, items: filteredPages },
  ];

  const toggleGroup = (type: AssetType) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(type)) {
      newExpanded.delete(type);
    } else {
      newExpanded.add(type);
    }
    setExpandedGroups(newExpanded);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-2">
        {groups.map((group) => (
          <div key={group.type} className="mb-2">
            {/* Group Header */}
            <button
              onClick={() => toggleGroup(group.type)}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted/50 transition-colors"
            >
              {expandedGroups.has(group.type) ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
              <group.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{group.label}</span>
              <Badge variant="secondary" className="ml-auto text-xs">
                {group.items.length}
              </Badge>
            </button>

            {/* Group Items */}
            {expandedGroups.has(group.type) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="ml-4 mt-1 space-y-0.5"
              >
                {group.items.length === 0 ? (
                  <div className="px-2 py-3 text-xs text-muted-foreground text-center">
                    Keine {group.label} gefunden
                  </div>
                ) : (
                  group.items.map((item) => (
                    <AssetItem
                      key={item.id}
                      asset={item}
                      isSelected={selectedAsset?.id === item.id}
                      onClick={() => onSelectAsset(item)}
                    />
                  ))
                )}
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

function AssetItem({ 
  asset, 
  isSelected, 
  onClick 
}: { 
  asset: Asset; 
  isSelected: boolean; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors',
        isSelected 
          ? 'bg-primary/10 border border-primary/20' 
          : 'hover:bg-muted/50'
      )}
    >
      {/* Score indicator */}
      <div className={cn(
        'w-2 h-2 rounded-full flex-shrink-0',
        asset.score === null ? 'bg-muted-foreground/30' :
        asset.score >= 80 ? 'bg-green-500' :
        asset.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
      )} />
      
      {/* Name */}
      <span className="flex-1 text-sm truncate">
        {asset.name}
      </span>
      
      {/* Indicators */}
      <div className="flex items-center gap-1">
        {asset.hasFeedback && (
          <CheckCircle className="h-3 w-3 text-green-500" />
        )}
        {asset.score !== null && (
          <span className={cn(
            'text-xs font-medium',
            asset.score >= 80 ? 'text-green-600' :
            asset.score >= 60 ? 'text-yellow-600' : 'text-red-600'
          )}>
            {asset.score}
          </span>
        )}
      </div>
    </button>
  );
}
