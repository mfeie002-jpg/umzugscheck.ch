import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  Circle, 
  ChevronDown, 
  Calendar, 
  Download,
  Share2,
  Printer,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ChecklistItem {
  id: string;
  text: string;
  priority: 'high' | 'medium' | 'low';
}

interface ChecklistCategory {
  id: string;
  title: string;
  icon: string;
  timeframe: string;
  items: ChecklistItem[];
}

const checklistData: ChecklistCategory[] = [
  {
    id: '1',
    title: '8-12 Wochen vorher',
    icon: '📅',
    timeframe: 'Frühzeitig',
    items: [
      { id: '1-1', text: 'Umzugstermin festlegen', priority: 'high' },
      { id: '1-2', text: 'Kündigung der alten Wohnung', priority: 'high' },
      { id: '1-3', text: 'Umzugsbudget erstellen', priority: 'medium' },
      { id: '1-4', text: 'Umzugsofferten einholen', priority: 'high' },
      { id: '1-5', text: 'Urlaub für Umzug beantragen', priority: 'medium' },
      { id: '1-6', text: 'Kinder/Haustiere organisieren', priority: 'low' }
    ]
  },
  {
    id: '2',
    title: '4-6 Wochen vorher',
    icon: '📦',
    timeframe: 'Vorbereitung',
    items: [
      { id: '2-1', text: 'Umzugsfirma buchen', priority: 'high' },
      { id: '2-2', text: 'Umzugskartons besorgen', priority: 'high' },
      { id: '2-3', text: 'Entrümpeln und aussortieren', priority: 'medium' },
      { id: '2-4', text: 'Nachsendeauftrag Post einrichten', priority: 'high' },
      { id: '2-5', text: 'Versicherungen informieren', priority: 'medium' },
      { id: '2-6', text: 'Ummeldungen vorbereiten', priority: 'medium' }
    ]
  },
  {
    id: '3',
    title: '2-3 Wochen vorher',
    icon: '🏠',
    timeframe: 'Packen',
    items: [
      { id: '3-1', text: 'Zimmer für Zimmer packen', priority: 'high' },
      { id: '3-2', text: 'Kartons beschriften', priority: 'medium' },
      { id: '3-3', text: 'Wertsachen separat verpacken', priority: 'high' },
      { id: '3-4', text: 'Möbel abbauen', priority: 'medium' },
      { id: '3-5', text: 'Reinigung alte Wohnung planen', priority: 'medium' },
      { id: '3-6', text: 'Schlüsselübergabe vereinbaren', priority: 'high' }
    ]
  },
  {
    id: '4',
    title: 'Umzugswoche',
    icon: '🚚',
    timeframe: 'Endspurt',
    items: [
      { id: '4-1', text: 'Zählerstände ablesen', priority: 'high' },
      { id: '4-2', text: 'Kühlschrank abtauen', priority: 'medium' },
      { id: '4-3', text: 'Wichtige Dokumente griffbereit', priority: 'high' },
      { id: '4-4', text: 'Erste-Nacht-Box packen', priority: 'medium' },
      { id: '4-5', text: 'Verpflegung organisieren', priority: 'low' },
      { id: '4-6', text: 'Parkplatz für Umzugswagen', priority: 'high' }
    ]
  },
  {
    id: '5',
    title: 'Nach dem Umzug',
    icon: '✨',
    timeframe: 'Einleben',
    items: [
      { id: '5-1', text: 'Bei Gemeinde anmelden', priority: 'high' },
      { id: '5-2', text: 'Adressänderungen mitteilen', priority: 'medium' },
      { id: '5-3', text: 'Internet/TV einrichten', priority: 'medium' },
      { id: '5-4', text: 'Nachbarn begrüssen', priority: 'low' },
      { id: '5-5', text: 'Umzugsfirma bewerten', priority: 'low' },
      { id: '5-6', text: 'Kartons entsorgen', priority: 'low' }
    ]
  }
];

export const MovingChecklist = () => {
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set(['1']));

  const toggleItem = (itemId: string) => {
    setCompletedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const toggleCategory = (categoryId: string) => {
    setOpenCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const totalItems = checklistData.reduce((acc, cat) => acc + cat.items.length, 0);
  const completedCount = completedItems.size;
  const progressPercent = (completedCount / totalItems) * 100;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Umzugs-Checkliste
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              PDF
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-1" />
              Teilen
            </Button>
          </div>
        </div>
        
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{completedCount} von {totalItems} Aufgaben erledigt</span>
            <span className="font-bold">{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {checklistData.map((category) => {
          const categoryCompleted = category.items.filter(
            item => completedItems.has(item.id)
          ).length;
          const isOpen = openCategories.has(category.id);
          
          return (
            <Collapsible key={category.id} open={isOpen}>
              <CollapsibleTrigger
                onClick={() => toggleCategory(category.id)}
                className="w-full"
              >
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div className="text-left">
                      <div className="font-semibold">{category.title}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {category.timeframe}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">
                      {categoryCompleted}/{category.items.length}
                    </Badge>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-5 w-5" />
                    </motion.div>
                  </div>
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 space-y-1"
                  >
                    {category.items.map((item) => {
                      const isCompleted = completedItems.has(item.id);
                      
                      return (
                        <motion.button
                          key={item.id}
                          onClick={() => toggleItem(item.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                            isCompleted
                              ? 'bg-green-500/10'
                              : 'hover:bg-muted/50'
                          }`}
                          whileHover={{ x: 5 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                          ) : (
                            <Circle className={`h-5 w-5 flex-shrink-0 ${getPriorityColor(item.priority)}`} />
                          )}
                          <span className={`text-left ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                            {item.text}
                          </span>
                          {!isCompleted && item.priority === 'high' && (
                            <Badge variant="destructive" className="ml-auto text-xs">
                              Wichtig
                            </Badge>
                          )}
                        </motion.button>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </CollapsibleContent>
            </Collapsible>
          );
        })}

        {progressPercent === 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl text-center"
          >
            <div className="text-4xl mb-2">🎉</div>
            <h4 className="font-bold text-lg mb-1">Gratulation!</h4>
            <p className="text-muted-foreground">
              Sie haben alle Aufgaben erledigt. Viel Erfolg beim Umzug!
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
