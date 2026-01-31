/**
 * React hooks for Lebensdauertabelle data access
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { FixtureCategory, FixtureLifespan } from './index';

/**
 * Fetch all fixture lifespans from database
 */
export function useFixtureLifespans() {
  return useQuery({
    queryKey: ['fixture-lifespans'],
    queryFn: async (): Promise<FixtureLifespan[]> => {
      const { data, error } = await supabase
        .from('fixture_lifespans')
        .select('*')
        .eq('is_active', true)
        .order('category')
        .order('item_de');

      if (error) {
        console.error('Error fetching fixture lifespans:', error);
        throw error;
      }

      return (data || []) as FixtureLifespan[];
    },
    staleTime: 1000 * 60 * 60, // 1 hour - this data rarely changes
  });
}

/**
 * Fetch fixtures by category
 */
export function useFixturesByCategory(category: FixtureCategory) {
  return useQuery({
    queryKey: ['fixture-lifespans', 'category', category],
    queryFn: async (): Promise<FixtureLifespan[]> => {
      const { data, error } = await supabase
        .from('fixture_lifespans')
        .select('*')
        .eq('is_active', true)
        .eq('category', category)
        .order('item_de');

      if (error) {
        console.error('Error fetching fixtures by category:', error);
        throw error;
      }

      return (data || []) as FixtureLifespan[];
    },
    staleTime: 1000 * 60 * 60,
  });
}

/**
 * Search fixtures by name
 */
export function useSearchFixtures(searchTerm: string) {
  return useQuery({
    queryKey: ['fixture-lifespans', 'search', searchTerm],
    queryFn: async (): Promise<FixtureLifespan[]> => {
      if (!searchTerm || searchTerm.length < 2) {
        return [];
      }

      const { data, error } = await supabase
        .from('fixture_lifespans')
        .select('*')
        .eq('is_active', true)
        .or(`item_de.ilike.%${searchTerm}%,item_fr.ilike.%${searchTerm}%`)
        .order('category')
        .order('item_de')
        .limit(20);

      if (error) {
        console.error('Error searching fixtures:', error);
        throw error;
      }

      return (data || []) as FixtureLifespan[];
    },
    enabled: searchTerm.length >= 2,
    staleTime: 1000 * 60 * 5, // 5 minutes for search
  });
}

/**
 * Get categories with item counts
 */
export function useFixtureCategories() {
  const { data: allFixtures, ...rest } = useFixtureLifespans();

  const categories = allFixtures
    ? Object.entries(
        allFixtures.reduce((acc, fixture) => {
          acc[fixture.category] = (acc[fixture.category] || 0) + 1;
          return acc;
        }, {} as Record<FixtureCategory, number>)
      ).map(([category, count]) => ({ category: category as FixtureCategory, count }))
    : [];

  return {
    ...rest,
    data: categories,
  };
}
