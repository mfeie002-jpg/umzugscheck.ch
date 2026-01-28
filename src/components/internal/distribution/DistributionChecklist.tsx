/**
 * Weekly Operations Checklist for Distribution
 */

import { useState } from 'react';
import { CheckSquare, Square, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ChecklistItem {
  id: string;
  text: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: '1', text: 'Tier 1 Overflow Outcomes reviewen' },
  { id: '2', text: 'Reserve Price nicht zu tief? (aktuell prüfen)' },
  { id: '3', text: 'Partner mit Leakage-Versuchen entfernen' },
  { id: '4', text: 'Scarcity pro Kanton einhalten' },
  { id: '5', text: 'Fill Rate und Resale Rate Trend prüfen' },
  { id: '6', text: 'Marketplace Revenue vs. Paid Spend vergleichen' },
  { id: '7', text: 'Partner Fatigue Indikatoren prüfen' },
  { id: '8', text: 'Quality Protection Alerts bearbeiten' },
];

export function DistributionChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  
  const toggleItem = (id: string) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };
  
  const completedCount = Object.values(checked).filter(Boolean).length;
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5" />
          Weekly Distribution Review
        </CardTitle>
        <CardDescription>
          {completedCount}/{CHECKLIST_ITEMS.length} erledigt
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {CHECKLIST_ITEMS.map(item => (
            <li
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-muted ${
                checked[item.id] ? 'opacity-60' : ''
              }`}
            >
              {checked[item.id] ? (
                <CheckSquare className="h-5 w-5 text-green-500 shrink-0" />
              ) : (
                <Square className="h-5 w-5 text-muted-foreground shrink-0" />
              )}
              <span className={`text-sm ${checked[item.id] ? 'line-through' : ''}`}>
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
