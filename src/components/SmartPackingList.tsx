import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListChecks, CheckCircle2, Circle, Package, Clock, Calendar, Download, Printer, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useLanguage } from '@/contexts/LanguageContext';
import { format, subDays, subWeeks } from 'date-fns';
import { de, enUS, fr, it } from 'date-fns/locale';

interface SmartPackingListProps {
  movingDate?: Date;
  rooms?: number;
  hasPacking?: boolean;
  hasStorage?: boolean;
}

interface PackingItem {
  id: string;
  label: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  daysBeforeMove: number;
}

const SmartPackingList = ({ 
  movingDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), 
  rooms = 3,
  hasPacking = false,
  hasStorage = false
}: SmartPackingListProps) => {
  const { language } = useLanguage();
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['documents', 'essentials']);

  const locales = { de, en: enUS, fr, it };
  const dateLocale = locales[language as keyof typeof locales] || de;

  const translations = {
    de: {
      title: 'Smarte Packliste',
      subtitle: 'Personalisierte Checkliste für Ihren Umzug',
      progress: 'Fortschritt',
      dueDate: 'Fällig',
      today: 'Heute',
      overdue: 'Überfällig',
      upcoming: 'Demnächst',
      completed: 'Erledigt',
      export: 'Exportieren',
      print: 'Drucken',
      categories: {
        documents: 'Dokumente & Verträge',
        essentials: 'Wichtige Gegenstände',
        kitchen: 'Küche',
        bedroom: 'Schlafzimmer',
        bathroom: 'Badezimmer',
        living: 'Wohnzimmer',
        office: 'Büro/Arbeitszimmer',
        special: 'Spezielle Gegenstände',
        lastDay: 'Letzter Tag'
      },
      items: {
        notifyLandlord: 'Vermieter informieren',
        cancelUtilities: 'Strom/Gas/Wasser kündigen',
        forwardMail: 'Nachsendeauftrag stellen',
        updateAddress: 'Adresse aktualisieren',
        packImportantDocs: 'Wichtige Dokumente zusammenstellen',
        backupData: 'Datensicherung machen',
        prepareFirstAidKit: 'Erste-Hilfe-Set packen',
        packMedications: 'Medikamente einpacken',
        packValuables: 'Wertsachen sichern',
        prepareToolbox: 'Werkzeugkiste vorbereiten',
        packKitchenAppliances: 'Küchengeräte einpacken',
        emptyFridge: 'Kühlschrank leeren',
        packDishes: 'Geschirr einpacken',
        packBedding: 'Bettwäsche einpacken',
        disassembleBeds: 'Betten abbauen',
        packClothes: 'Kleidung einpacken',
        packToiletries: 'Toilettenartikel einpacken',
        packTowels: 'Handtücher einpacken',
        packElectronics: 'Elektronik einpacken',
        packBooks: 'Bücher einpacken',
        packDecor: 'Dekoration einpacken',
        packOfficeSupplies: 'Büromaterial einpacken',
        disassembleDesk: 'Schreibtisch abbauen',
        packPlants: 'Pflanzen vorbereiten',
        packFragile: 'Zerbrechliches einpacken',
        prepareEssentialsBag: 'Notfalltasche packen',
        finalWalkthrough: 'Endkontrolle durchführen',
        cleanOldPlace: 'Alte Wohnung reinigen',
        returnKeys: 'Schlüssel zurückgeben'
      },
      priority: {
        high: 'Hoch',
        medium: 'Mittel',
        low: 'Niedrig'
      }
    },
    en: {
      title: 'Smart Packing List',
      subtitle: 'Personalized checklist for your move',
      progress: 'Progress',
      dueDate: 'Due',
      today: 'Today',
      overdue: 'Overdue',
      upcoming: 'Upcoming',
      completed: 'Completed',
      export: 'Export',
      print: 'Print',
      categories: {
        documents: 'Documents & Contracts',
        essentials: 'Essential Items',
        kitchen: 'Kitchen',
        bedroom: 'Bedroom',
        bathroom: 'Bathroom',
        living: 'Living Room',
        office: 'Office',
        special: 'Special Items',
        lastDay: 'Last Day'
      },
      items: {
        notifyLandlord: 'Notify landlord',
        cancelUtilities: 'Cancel utilities',
        forwardMail: 'Set up mail forwarding',
        updateAddress: 'Update address',
        packImportantDocs: 'Gather important documents',
        backupData: 'Backup data',
        prepareFirstAidKit: 'Pack first aid kit',
        packMedications: 'Pack medications',
        packValuables: 'Secure valuables',
        prepareToolbox: 'Prepare toolbox',
        packKitchenAppliances: 'Pack kitchen appliances',
        emptyFridge: 'Empty refrigerator',
        packDishes: 'Pack dishes',
        packBedding: 'Pack bedding',
        disassembleBeds: 'Disassemble beds',
        packClothes: 'Pack clothes',
        packToiletries: 'Pack toiletries',
        packTowels: 'Pack towels',
        packElectronics: 'Pack electronics',
        packBooks: 'Pack books',
        packDecor: 'Pack decorations',
        packOfficeSupplies: 'Pack office supplies',
        disassembleDesk: 'Disassemble desk',
        packPlants: 'Prepare plants',
        packFragile: 'Pack fragile items',
        prepareEssentialsBag: 'Pack essentials bag',
        finalWalkthrough: 'Final walkthrough',
        cleanOldPlace: 'Clean old place',
        returnKeys: 'Return keys'
      },
      priority: {
        high: 'High',
        medium: 'Medium',
        low: 'Low'
      }
    },
    fr: {
      title: 'Liste de déménagement',
      subtitle: 'Checklist personnalisée pour votre déménagement',
      progress: 'Progression',
      dueDate: 'Échéance',
      today: 'Aujourd\'hui',
      overdue: 'En retard',
      upcoming: 'À venir',
      completed: 'Terminé',
      export: 'Exporter',
      print: 'Imprimer',
      categories: {
        documents: 'Documents',
        essentials: 'Essentiels',
        kitchen: 'Cuisine',
        bedroom: 'Chambre',
        bathroom: 'Salle de bain',
        living: 'Salon',
        office: 'Bureau',
        special: 'Objets spéciaux',
        lastDay: 'Dernier jour'
      },
      items: {
        notifyLandlord: 'Informer le propriétaire',
        cancelUtilities: 'Résilier les services',
        forwardMail: 'Faire suivre le courrier',
        updateAddress: 'Mettre à jour l\'adresse',
        packImportantDocs: 'Rassembler les documents',
        backupData: 'Sauvegarder les données',
        prepareFirstAidKit: 'Préparer la trousse de secours',
        packMedications: 'Emballer les médicaments',
        packValuables: 'Sécuriser les objets de valeur',
        prepareToolbox: 'Préparer la boîte à outils',
        packKitchenAppliances: 'Emballer les appareils',
        emptyFridge: 'Vider le réfrigérateur',
        packDishes: 'Emballer la vaisselle',
        packBedding: 'Emballer la literie',
        disassembleBeds: 'Démonter les lits',
        packClothes: 'Emballer les vêtements',
        packToiletries: 'Emballer les articles de toilette',
        packTowels: 'Emballer les serviettes',
        packElectronics: 'Emballer l\'électronique',
        packBooks: 'Emballer les livres',
        packDecor: 'Emballer la décoration',
        packOfficeSupplies: 'Emballer le matériel de bureau',
        disassembleDesk: 'Démonter le bureau',
        packPlants: 'Préparer les plantes',
        packFragile: 'Emballer les objets fragiles',
        prepareEssentialsBag: 'Préparer le sac d\'urgence',
        finalWalkthrough: 'Inspection finale',
        cleanOldPlace: 'Nettoyer l\'ancien logement',
        returnKeys: 'Rendre les clés'
      },
      priority: {
        high: 'Haute',
        medium: 'Moyenne',
        low: 'Basse'
      }
    },
    it: {
      title: 'Lista trasloco',
      subtitle: 'Checklist personalizzata per il tuo trasloco',
      progress: 'Progresso',
      dueDate: 'Scadenza',
      today: 'Oggi',
      overdue: 'In ritardo',
      upcoming: 'In arrivo',
      completed: 'Completato',
      export: 'Esporta',
      print: 'Stampa',
      categories: {
        documents: 'Documenti',
        essentials: 'Essenziali',
        kitchen: 'Cucina',
        bedroom: 'Camera',
        bathroom: 'Bagno',
        living: 'Soggiorno',
        office: 'Ufficio',
        special: 'Oggetti speciali',
        lastDay: 'Ultimo giorno'
      },
      items: {
        notifyLandlord: 'Avvisare il proprietario',
        cancelUtilities: 'Disdire utenze',
        forwardMail: 'Reindirizzare la posta',
        updateAddress: 'Aggiornare indirizzo',
        packImportantDocs: 'Raccogliere documenti',
        backupData: 'Backup dei dati',
        prepareFirstAidKit: 'Preparare kit pronto soccorso',
        packMedications: 'Imballare medicinali',
        packValuables: 'Mettere al sicuro i valori',
        prepareToolbox: 'Preparare gli attrezzi',
        packKitchenAppliances: 'Imballare elettrodomestici',
        emptyFridge: 'Svuotare il frigorifero',
        packDishes: 'Imballare le stoviglie',
        packBedding: 'Imballare la biancheria',
        disassembleBeds: 'Smontare i letti',
        packClothes: 'Imballare i vestiti',
        packToiletries: 'Imballare articoli da bagno',
        packTowels: 'Imballare asciugamani',
        packElectronics: 'Imballare elettronica',
        packBooks: 'Imballare libri',
        packDecor: 'Imballare decorazioni',
        packOfficeSupplies: 'Imballare materiale ufficio',
        disassembleDesk: 'Smontare la scrivania',
        packPlants: 'Preparare le piante',
        packFragile: 'Imballare oggetti fragili',
        prepareEssentialsBag: 'Preparare borsa essenziale',
        finalWalkthrough: 'Controllo finale',
        cleanOldPlace: 'Pulire vecchio alloggio',
        returnKeys: 'Restituire le chiavi'
      },
      priority: {
        high: 'Alta',
        medium: 'Media',
        low: 'Bassa'
      }
    }
  };

  const t = translations[language] || translations.de;

  const packingItems: PackingItem[] = useMemo(() => {
    const baseItems: PackingItem[] = [
      { id: 'notifyLandlord', label: t.items.notifyLandlord, category: 'documents', priority: 'high', daysBeforeMove: 30 },
      { id: 'cancelUtilities', label: t.items.cancelUtilities, category: 'documents', priority: 'high', daysBeforeMove: 21 },
      { id: 'forwardMail', label: t.items.forwardMail, category: 'documents', priority: 'high', daysBeforeMove: 14 },
      { id: 'updateAddress', label: t.items.updateAddress, category: 'documents', priority: 'medium', daysBeforeMove: 14 },
      { id: 'packImportantDocs', label: t.items.packImportantDocs, category: 'essentials', priority: 'high', daysBeforeMove: 7 },
      { id: 'backupData', label: t.items.backupData, category: 'essentials', priority: 'high', daysBeforeMove: 7 },
      { id: 'prepareFirstAidKit', label: t.items.prepareFirstAidKit, category: 'essentials', priority: 'high', daysBeforeMove: 3 },
      { id: 'packMedications', label: t.items.packMedications, category: 'essentials', priority: 'high', daysBeforeMove: 1 },
      { id: 'packValuables', label: t.items.packValuables, category: 'essentials', priority: 'high', daysBeforeMove: 1 },
      { id: 'prepareToolbox', label: t.items.prepareToolbox, category: 'essentials', priority: 'medium', daysBeforeMove: 3 },
      { id: 'packKitchenAppliances', label: t.items.packKitchenAppliances, category: 'kitchen', priority: 'medium', daysBeforeMove: 5 },
      { id: 'emptyFridge', label: t.items.emptyFridge, category: 'kitchen', priority: 'high', daysBeforeMove: 2 },
      { id: 'packDishes', label: t.items.packDishes, category: 'kitchen', priority: 'medium', daysBeforeMove: 4 },
      { id: 'packBedding', label: t.items.packBedding, category: 'bedroom', priority: 'medium', daysBeforeMove: 1 },
      { id: 'disassembleBeds', label: t.items.disassembleBeds, category: 'bedroom', priority: 'high', daysBeforeMove: 1 },
      { id: 'packClothes', label: t.items.packClothes, category: 'bedroom', priority: 'medium', daysBeforeMove: 3 },
      { id: 'packToiletries', label: t.items.packToiletries, category: 'bathroom', priority: 'medium', daysBeforeMove: 1 },
      { id: 'packTowels', label: t.items.packTowels, category: 'bathroom', priority: 'low', daysBeforeMove: 2 },
      { id: 'packElectronics', label: t.items.packElectronics, category: 'living', priority: 'medium', daysBeforeMove: 2 },
      { id: 'packBooks', label: t.items.packBooks, category: 'living', priority: 'low', daysBeforeMove: 7 },
      { id: 'packDecor', label: t.items.packDecor, category: 'living', priority: 'low', daysBeforeMove: 5 },
      { id: 'packFragile', label: t.items.packFragile, category: 'special', priority: 'high', daysBeforeMove: 3 },
      { id: 'packPlants', label: t.items.packPlants, category: 'special', priority: 'medium', daysBeforeMove: 1 },
      { id: 'prepareEssentialsBag', label: t.items.prepareEssentialsBag, category: 'lastDay', priority: 'high', daysBeforeMove: 0 },
      { id: 'finalWalkthrough', label: t.items.finalWalkthrough, category: 'lastDay', priority: 'high', daysBeforeMove: 0 },
      { id: 'cleanOldPlace', label: t.items.cleanOldPlace, category: 'lastDay', priority: 'high', daysBeforeMove: 0 },
      { id: 'returnKeys', label: t.items.returnKeys, category: 'lastDay', priority: 'high', daysBeforeMove: 0 },
    ];

    // Add office items if more rooms
    if (rooms >= 3) {
      baseItems.push(
        { id: 'packOfficeSupplies', label: t.items.packOfficeSupplies, category: 'office', priority: 'medium', daysBeforeMove: 5 },
        { id: 'disassembleDesk', label: t.items.disassembleDesk, category: 'office', priority: 'medium', daysBeforeMove: 1 }
      );
    }

    return baseItems;
  }, [rooms, t]);

  const groupedItems = useMemo(() => {
    const groups: Record<string, PackingItem[]> = {};
    packingItems.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, [packingItems]);

  const progressPercent = Math.round((checkedItems.length / packingItems.length) * 100);

  const toggleItem = (id: string) => {
    setCheckedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const getDueDate = (daysBeforeMove: number) => {
    return subDays(movingDate, daysBeforeMove);
  };

  const isOverdue = (daysBeforeMove: number) => {
    const dueDate = getDueDate(daysBeforeMove);
    return dueDate < new Date() && daysBeforeMove > 0;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      default: return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    }
  };

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ListChecks className="h-5 w-5 text-primary" />
          {t.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t.progress}</span>
            <span className="text-sm font-bold text-primary">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{checkedItems.length} / {packingItems.length}</span>
            <span>{t.completed}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 gap-1">
            <Download className="h-3 w-3" />
            {t.export}
          </Button>
          <Button variant="outline" size="sm" className="flex-1 gap-1">
            <Printer className="h-3 w-3" />
            {t.print}
          </Button>
        </div>

        {/* Checklist Categories */}
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          {Object.entries(groupedItems).map(([category, items]) => {
            const categoryChecked = items.filter(item => checkedItems.includes(item.id)).length;
            const isExpanded = expandedCategories.includes(category);

            return (
              <Collapsible key={category} open={isExpanded} onOpenChange={() => toggleCategory(category)}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between h-auto py-2 px-3"
                  >
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">
                        {t.categories[category as keyof typeof t.categories] || category}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {categoryChecked}/{items.length}
                      </Badge>
                    </div>
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <AnimatePresence>
                    <div className="space-y-1 py-2 pl-4">
                      {items.map((item, index) => {
                        const isChecked = checkedItems.includes(item.id);
                        const overdue = isOverdue(item.daysBeforeMove) && !isChecked;

                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                              isChecked ? 'bg-green-50 dark:bg-green-900/20' : overdue ? 'bg-red-50 dark:bg-red-900/20' : 'hover:bg-muted/50'
                            }`}
                          >
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={() => toggleItem(item.id)}
                              className="h-4 w-4"
                            />
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm ${isChecked ? 'line-through text-muted-foreground' : ''}`}>
                                {item.label}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${getPriorityColor(item.priority)}`}>
                                  {t.priority[item.priority]}
                                </Badge>
                                <span className={`text-[10px] flex items-center gap-1 ${overdue ? 'text-red-500' : 'text-muted-foreground'}`}>
                                  <Clock className="h-2.5 w-2.5" />
                                  {item.daysBeforeMove === 0 
                                    ? t.today 
                                    : format(getDueDate(item.daysBeforeMove), 'dd.MM', { locale: dateLocale })}
                                </span>
                              </div>
                            </div>
                            {isChecked ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                            ) : overdue ? (
                              <Circle className="h-4 w-4 text-red-500 flex-shrink-0" />
                            ) : null}
                          </motion.div>
                        );
                      })}
                    </div>
                  </AnimatePresence>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartPackingList;
