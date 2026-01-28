/**
 * Weekly Operating Ritual Checklist
 */

import { useState } from 'react';
import { CheckSquare, Square, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ChecklistItem {
  id: string;
  text: string;
  frequency: 'weekly' | 'monthly';
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: '1', text: 'Top 3 Partner mit höchsten Disputes reviewen', frequency: 'weekly' },
  { id: '2', text: 'Bottom 3 Partner mit tiefster Akzeptanz reviewen', frequency: 'weekly' },
  { id: '3', text: 'Low-Quality Partner schnell entfernen (Schutz der Bewertungen)', frequency: 'weekly' },
  { id: '4', text: 'Scarcity pro Kanton prüfen (max Partner-Limits)', frequency: 'weekly' },
  { id: '5', text: 'Mystery Shop Ergebnisse prüfen', frequency: 'weekly' },
  { id: '6', text: 'Top Partner für ROI-Review anrufen', frequency: 'monthly' },
  { id: '7', text: 'Partner ROI Ziel prüfen: 6x–8x Minimum', frequency: 'monthly' },
  { id: '8', text: 'Fill Rate und Margin Trends analysieren', frequency: 'weekly' },
];

export function WeeklyChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  
  const toggleItem = (id: string) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };
  
  const completedCount = Object.values(checked).filter(Boolean).length;
  const weeklyItems = CHECKLIST_ITEMS.filter(i => i.frequency === 'weekly');
  const monthlyItems = CHECKLIST_ITEMS.filter(i => i.frequency === 'monthly');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Weekly Operating Ritual
        </CardTitle>
        <CardDescription>
          {completedCount}/{CHECKLIST_ITEMS.length} erledigt
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Weekly tasks */}
        <div>
          <h4 className="text-sm font-medium mb-2 text-muted-foreground">Wöchentlich</h4>
          <ul className="space-y-2">
            {weeklyItems.map(item => (
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
                <span className={checked[item.id] ? 'line-through' : ''}>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Monthly tasks */}
        <div>
          <h4 className="text-sm font-medium mb-2 text-muted-foreground">Monatlich</h4>
          <ul className="space-y-2">
            {monthlyItems.map(item => (
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
                <span className={checked[item.id] ? 'line-through' : ''}>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
          <strong>Ziel:</strong> Qualität durchsetzen und Unit Economics schützen. 
          Partner-ROI Target: <span className="font-mono">6x–8x</span> Minimum.
        </div>
      </CardContent>
    </Card>
  );
}
