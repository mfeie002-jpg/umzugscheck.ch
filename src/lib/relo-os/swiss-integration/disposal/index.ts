/**
 * Disposal Module
 * 
 * Swiss waste disposal and recycling planning
 */

export * from './types';
export * from './city-calendars';
export * from './item-classifier';

import { supabase } from '@/integrations/supabase/client';
import type { DisposalCategory, RecyclingCenter, DisposalPlanResult, DisposalRecommendation } from './types';
import { getCityFromPostalCode, calculateDisposalSchedule, CITY_DISPOSAL_INFO } from './city-calendars';
import { classifyItems, groupByCategory, getCommonMovingItems } from './item-classifier';

/**
 * Fetch all disposal categories from database
 */
export const getDisposalCategories = async (): Promise<DisposalCategory[]> => {
  const { data, error } = await supabase
    .from('disposal_categories')
    .select('*')
    .order('disposal_type');
  
  if (error) {
    console.error('Error fetching disposal categories:', error);
    return [];
  }
  
  return data as DisposalCategory[];
};

/**
 * Fetch recycling centers for a city
 */
export const getRecyclingCenters = async (citySlug: string): Promise<RecyclingCenter[]> => {
  const { data, error } = await supabase
    .from('recycling_centers')
    .select('*')
    .eq('city_slug', citySlug)
    .eq('is_active', true);
  
  if (error) {
    console.error('Error fetching recycling centers:', error);
    return [];
  }
  
  return data as RecyclingCenter[];
};

/**
 * Generate a complete disposal plan for a move
 */
export const generateDisposalPlan = async (
  postalCode: string,
  moveDate: Date,
  itemDescriptions?: string[]
): Promise<DisposalPlanResult> => {
  const citySlug = getCityFromPostalCode(postalCode);
  
  // Get categories and recycling centers in parallel
  const [categories, recyclingCenters] = await Promise.all([
    getDisposalCategories(),
    citySlug ? getRecyclingCenters(citySlug) : Promise.resolve([]),
  ]);
  
  // Classify items if provided, otherwise use common moving items
  const itemsToClassify = itemDescriptions || getCommonMovingItems();
  const classifiedItems = classifyItems(itemsToClassify);
  const groupedItems = groupByCategory(classifiedItems);
  
  // Calculate disposal schedules
  const relevantCategories = Object.keys(groupedItems);
  const schedules = calculateDisposalSchedule(moveDate, relevantCategories);
  
  // Generate recommendations
  const recommendations: DisposalRecommendation[] = [];
  const daysUntilMove = Math.ceil(
    (moveDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // Add urgency-based recommendations
  if (relevantCategories.includes('sperrgut')) {
    recommendations.push({
      category_id: 'sperrgut',
      recommendation: daysUntilMove <= 14 
        ? 'Sperrgut-Abholung JETZT anmelden - Vorlaufzeit beachten!'
        : 'Sperrgut-Abholung rechtzeitig planen (ca. 2 Wochen vorher)',
      urgency: daysUntilMove <= 14 ? 'high' : 'medium',
      deadline: new Date(moveDate.getTime() - 14 * 24 * 60 * 60 * 1000),
    });
  }
  
  if (relevantCategories.includes('elektro')) {
    recommendations.push({
      category_id: 'elektro',
      recommendation: 'Elektrogeräte können kostenlos im Fachhandel oder am Recyclinghof abgegeben werden',
      urgency: 'medium',
    });
  }
  
  if (relevantCategories.includes('chemie')) {
    recommendations.push({
      category_id: 'chemie',
      recommendation: 'Chemikalien und Sonderabfall nur bei offiziellen Sammelstellen abgeben!',
      urgency: 'high',
    });
  }
  
  // Add city-specific notes
  if (citySlug && CITY_DISPOSAL_INFO[citySlug]?.specialNotes) {
    recommendations.push({
      category_id: 'hauskehricht',
      recommendation: CITY_DISPOSAL_INFO[citySlug].specialNotes!,
      urgency: 'low',
    });
  }
  
  return {
    categories,
    nearbyRecyclingCenters: recyclingCenters,
    schedules,
    recommendations,
  };
};
