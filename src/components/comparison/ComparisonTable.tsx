/**
 * Comparison Table Component
 * 
 * Features:
 * - Mobile-responsive
 * - Sticky headers
 * - Highlight differences
 * - Export functionality
 */

import { memo, useState } from 'react';
import { Check, X, Minus, ArrowUpDown, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ComparisonItem {
  id: string;
  name: string;
  logo?: string;
  features: Record<string, string | number | boolean | null>;
}

interface ComparisonTableProps {
  items: ComparisonItem[];
  features: {
    key: string;
    label: string;
    type: 'boolean' | 'text' | 'number' | 'price';
    category?: string;
  }[];
  onRemove?: (id: string) => void;
  className?: string;
}

export const ComparisonTable = memo(function ComparisonTable({
  items,
  features,
  onRemove,
  className,
}: ComparisonTableProps) {
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Sort items
  const sortedItems = [...items].sort((a, b) => {
    if (!sortBy) return 0;
    const aVal = a.features[sortBy];
    const bVal = b.features[sortBy];
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });

  // Group features by category
  const groupedFeatures = features.reduce((acc, feature) => {
    const category = feature.category || 'Allgemein';
    if (!acc[category]) acc[category] = [];
    acc[category].push(feature);
    return acc;
  }, {} as Record<string, typeof features>);

  // Render cell value
  const renderValue = (value: string | number | boolean | null, type: string) => {
    if (value === null || value === undefined) {
      return <Minus className="w-5 h-5 text-muted-foreground mx-auto" />;
    }

    switch (type) {
      case 'boolean':
        return value ? (
          <Check className="w-5 h-5 text-green-500 mx-auto" />
        ) : (
          <X className="w-5 h-5 text-red-500 mx-auto" />
        );
      case 'price':
        return (
          <span className="font-semibold text-foreground">
            CHF {typeof value === 'number' ? value.toLocaleString('de-CH') : value}
          </span>
        );
      case 'number':
        return (
          <span className="font-medium text-foreground">
            {typeof value === 'number' ? value.toLocaleString('de-CH') : value}
          </span>
        );
      default:
        return <span className="text-foreground">{String(value)}</span>;
    }
  };

  // Handle sort
  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  };

  // Export comparison
  const handleExport = () => {
    const headers = ['Feature', ...items.map(i => i.name)];
    const rows = features.map(f => [
      f.label,
      ...items.map(i => {
        const val = i.features[f.key];
        if (typeof val === 'boolean') return val ? 'Ja' : 'Nein';
        if (val === null) return '-';
        return String(val);
      }),
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vergleich.csv';
    a.click();
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/50 rounded-lg">
        <p className="text-muted-foreground">
          Keine Firmen zum Vergleichen ausgewählt.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      {/* Actions */}
      <div className="flex justify-end mb-4">
        <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
          <Download className="w-4 h-4" />
          Als CSV exportieren
        </Button>
      </div>

      <table className="w-full border-collapse">
        {/* Header with company names */}
        <thead>
          <tr>
            <th className="sticky left-0 bg-background z-10 p-4 text-left font-medium text-muted-foreground border-b border-border">
              Vergleich
            </th>
            {sortedItems.map((item) => (
              <th key={item.id} className="p-4 border-b border-border min-w-[200px]">
                <div className="flex flex-col items-center gap-2">
                  {item.logo && (
                    <img
                      src={item.logo}
                      alt={item.name}
                      className="w-12 h-12 object-contain"
                    />
                  )}
                  <span className="font-semibold text-foreground">{item.name}</span>
                  {onRemove && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemove(item.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      Entfernen
                    </Button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => (
            <>
              {/* Category Header */}
              <tr key={category}>
                <td
                  colSpan={items.length + 1}
                  className="sticky left-0 bg-muted/50 p-3 font-semibold text-foreground"
                >
                  {category}
                </td>
              </tr>

              {/* Feature Rows */}
              {categoryFeatures.map((feature) => (
                <tr key={feature.key} className="hover:bg-muted/30 transition-colors">
                  <td className="sticky left-0 bg-background z-10 p-4 border-b border-border">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground">{feature.label}</span>
                      {feature.type === 'number' && (
                        <button
                          onClick={() => handleSort(feature.key)}
                          className="text-muted-foreground hover:text-foreground"
                          aria-label={`Sortieren nach ${feature.label}`}
                        >
                          <ArrowUpDown className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                  {sortedItems.map((item) => (
                    <td
                      key={item.id}
                      className="p-4 text-center border-b border-border"
                    >
                      {renderValue(item.features[feature.key], feature.type)}
                    </td>
                  ))}
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
});

/**
 * Compact comparison for mobile
 */
export const ComparisonCards = memo(function ComparisonCards({
  items,
  features,
  onRemove,
}: ComparisonTableProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {item.logo && (
                <img src={item.logo} alt={item.name} className="w-10 h-10 object-contain" />
              )}
              <h3 className="font-semibold text-foreground">{item.name}</h3>
            </div>
            {onRemove && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(item.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          <dl className="grid grid-cols-2 gap-3">
            {features.slice(0, 6).map((feature) => (
              <div key={feature.key}>
                <dt className="text-xs text-muted-foreground">{feature.label}</dt>
                <dd className="font-medium text-foreground">
                  {feature.type === 'boolean' ? (
                    item.features[feature.key] ? 'Ja' : 'Nein'
                  ) : feature.type === 'price' ? (
                    `CHF ${item.features[feature.key]}`
                  ) : (
                    String(item.features[feature.key] ?? '-')
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
});

/**
 * Hook for managing comparison state
 */
export function useComparison<T extends { id: string }>(maxItems = 3) {
  const [items, setItems] = useState<T[]>([]);

  const add = (item: T) => {
    if (items.length >= maxItems) return false;
    if (items.some(i => i.id === item.id)) return false;
    setItems(prev => [...prev, item]);
    return true;
  };

  const remove = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const clear = () => setItems([]);

  const isAdded = (id: string) => items.some(i => i.id === id);

  return { items, add, remove, clear, isAdded, isFull: items.length >= maxItems };
}
