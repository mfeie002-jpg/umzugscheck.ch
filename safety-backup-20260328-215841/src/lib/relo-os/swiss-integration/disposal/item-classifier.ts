/**
 * Item Classifier
 * 
 * Classifies items into disposal categories based on description
 */

import { MOVING_ITEMS_MAPPING } from './types';

export interface ClassificationResult {
  item: string;
  category_id: string;
  confidence: 'high' | 'medium' | 'low';
  suggestion?: string;
}

/**
 * Classify a single item into a disposal category
 */
export const classifyItem = (itemDescription: string): ClassificationResult => {
  const normalizedItem = itemDescription.toLowerCase().trim();
  
  // Direct match
  if (MOVING_ITEMS_MAPPING[normalizedItem]) {
    return {
      item: itemDescription,
      category_id: MOVING_ITEMS_MAPPING[normalizedItem],
      confidence: 'high',
    };
  }
  
  // Partial match
  for (const [keyword, category] of Object.entries(MOVING_ITEMS_MAPPING)) {
    if (normalizedItem.includes(keyword) || keyword.includes(normalizedItem)) {
      return {
        item: itemDescription,
        category_id: category,
        confidence: 'medium',
      };
    }
  }
  
  // Category-based guessing
  const categoryKeywords: Record<string, string[]> = {
    'sperrgut': ['möbel', 'gross', 'holz', 'metall', 'alt'],
    'elektro': ['stecker', 'kabel', 'gerät', 'elektronik', 'strom'],
    'textilien': ['stoff', 'gewebe', 'leder', 'wolle'],
    'papier': ['papier', 'buch', 'dokument', 'ordner'],
    'glas': ['glas', 'flasche', 'spiegel'],
    'metall': ['metall', 'eisen', 'aluminium', 'blech'],
    'chemie': ['gift', 'gefährlich', 'brennbar'],
  };
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(kw => normalizedItem.includes(kw))) {
      return {
        item: itemDescription,
        category_id: category,
        confidence: 'low',
        suggestion: `Bitte prüfen Sie, ob "${itemDescription}" wirklich zu ${category} gehört.`,
      };
    }
  }
  
  // Default to general waste
  return {
    item: itemDescription,
    category_id: 'hauskehricht',
    confidence: 'low',
    suggestion: `"${itemDescription}" wurde als Hauskehricht klassifiziert. Falls es sich um Sperrgut handelt, bitte entsprechend entsorgen.`,
  };
};

/**
 * Classify multiple items
 */
export const classifyItems = (items: string[]): ClassificationResult[] => {
  return items.map(classifyItem);
};

/**
 * Group classified items by category
 */
export const groupByCategory = (
  results: ClassificationResult[]
): Record<string, ClassificationResult[]> => {
  return results.reduce((acc, result) => {
    if (!acc[result.category_id]) {
      acc[result.category_id] = [];
    }
    acc[result.category_id].push(result);
    return acc;
  }, {} as Record<string, ClassificationResult[]>);
};

/**
 * Get common moving disposal items
 */
export const getCommonMovingItems = (): string[] => [
  'Alte Möbel',
  'Matratzen',
  'Elektrogeräte',
  'Umzugskartons',
  'Alte Kleider',
  'Bücher & Zeitschriften',
  'Verpackungsmaterial',
  'Reinigungsmittel',
  'Alte Farben & Lacke',
  'Batterien',
  'Altöl',
  'Glasflaschen',
  'Metallschrott',
  'Grünabfälle',
];
