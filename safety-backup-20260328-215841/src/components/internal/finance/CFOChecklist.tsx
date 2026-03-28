/**
 * Weekly CFO Checklist
 */

import { useState } from 'react';
import { CheckSquare, Square, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ChecklistItem {
  id: string;
  text: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: '1', text: 'Review CM2 per job — Ziel: >25%' },
  { id: '2', text: 'Review claims & damages — Ziel: <2% of revenue' },
  { id: '3', text: 'Review ad efficiency (CPL vs Close Rate)' },
  { id: '4', text: 'Review utilization calendar — Ziel: >70%' },
  { id: '5', text: 'Review marketplace net contribution' },
  { id: '6', text: 'Decide: SCALE / HOLD / CUT' },
];

export function CFOChecklist() {
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
          Weekly CFO Review
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
