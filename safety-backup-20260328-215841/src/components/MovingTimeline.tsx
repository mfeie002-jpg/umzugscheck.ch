import { useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Package, 
  Truck, 
  Home, 
  FileText,
  Phone,
  Mail,
  Key,
  Lightbulb,
  ShoppingBag
} from "lucide-react";
import { differenceInDays, format, subDays } from "date-fns";
import { de, fr, it, enUS } from "date-fns/locale";
import { useLanguage } from "@/contexts/LanguageContext";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";

interface MovingTimelineProps {
  movingDate: Date | undefined;
  hasPacking: boolean;
  hasAssembly: boolean;
  hasStorage: boolean;
}

interface Task {
  id: string;
  titleKey: string;
  descriptionKey: string;
  daysBeforeMove: number;
  icon: React.ElementType;
  category: "planning" | "packing" | "admin" | "moving";
}

const baseTasks: Task[] = [
  { id: "quotes", titleKey: "timeline.quotes", descriptionKey: "timeline.quotesDesc", daysBeforeMove: 60, icon: FileText, category: "planning" },
  { id: "declutter", titleKey: "timeline.declutter", descriptionKey: "timeline.declutterDesc", daysBeforeMove: 45, icon: ShoppingBag, category: "planning" },
  { id: "utilities", titleKey: "timeline.utilities", descriptionKey: "timeline.utilitiesDesc", daysBeforeMove: 30, icon: Lightbulb, category: "admin" },
  { id: "address", titleKey: "timeline.address", descriptionKey: "timeline.addressDesc", daysBeforeMove: 28, icon: Mail, category: "admin" },
  { id: "insurance", titleKey: "timeline.insurance", descriptionKey: "timeline.insuranceDesc", daysBeforeMove: 21, icon: FileText, category: "admin" },
  { id: "packing-supplies", titleKey: "timeline.packingSupplies", descriptionKey: "timeline.packingSuppliesDesc", daysBeforeMove: 21, icon: Package, category: "packing" },
  { id: "start-packing", titleKey: "timeline.startPacking", descriptionKey: "timeline.startPackingDesc", daysBeforeMove: 14, icon: Package, category: "packing" },
  { id: "confirm-movers", titleKey: "timeline.confirmMovers", descriptionKey: "timeline.confirmMoversDesc", daysBeforeMove: 7, icon: Phone, category: "planning" },
  { id: "essentials-box", titleKey: "timeline.essentialsBox", descriptionKey: "timeline.essentialsBoxDesc", daysBeforeMove: 3, icon: Package, category: "packing" },
  { id: "final-walkthrough", titleKey: "timeline.finalWalkthrough", descriptionKey: "timeline.finalWalkthroughDesc", daysBeforeMove: 1, icon: Home, category: "moving" },
  { id: "moving-day", titleKey: "timeline.movingDay", descriptionKey: "timeline.movingDayDesc", daysBeforeMove: 0, icon: Truck, category: "moving" },
  { id: "key-handover", titleKey: "timeline.keyHandover", descriptionKey: "timeline.keyHandoverDesc", daysBeforeMove: -1, icon: Key, category: "admin" },
];

const MovingTimeline = ({ movingDate, hasPacking, hasAssembly, hasStorage }: MovingTimelineProps) => {
  const { language } = useLanguage();
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('moving-timeline-completed');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const dateLocale = language === 'fr' ? fr : language === 'it' ? it : language === 'en' ? enUS : de;

  useEffect(() => {
    localStorage.setItem('moving-timeline-completed', JSON.stringify([...completedTasks]));
  }, [completedTasks]);

  const translations: Record<string, Record<string, string>> = {
    de: {
      title: "Umzugs-Zeitplan",
      noDate: "Wählen Sie ein Umzugsdatum für Ihren persönlichen Zeitplan",
      daysLeft: "Tage bis zum Umzug",
      today: "Heute",
      completed: "erledigt",
      "timeline.quotes": "Umzugsofferten einholen",
      "timeline.quotesDesc": "Vergleichen Sie mindestens 3 Angebote",
      "timeline.declutter": "Ausmisten & Entrümpeln",
      "timeline.declutterDesc": "Verkaufen oder spenden Sie nicht benötigte Gegenstände",
      "timeline.utilities": "Versorgungsunternehmen informieren",
      "timeline.utilitiesDesc": "Strom, Gas, Internet ummelden",
      "timeline.address": "Adressänderung mitteilen",
      "timeline.addressDesc": "Post, Bank, Versicherungen informieren",
      "timeline.insurance": "Umzugsversicherung abschliessen",
      "timeline.insuranceDesc": "Transportschutz für Wertgegenstände",
      "timeline.packingSupplies": "Packmaterial besorgen",
      "timeline.packingSuppliesDesc": "Kartons, Klebeband, Polstermaterial",
      "timeline.startPacking": "Mit dem Packen beginnen",
      "timeline.startPackingDesc": "Starten Sie mit selten genutzten Räumen",
      "timeline.confirmMovers": "Umzugsfirma bestätigen",
      "timeline.confirmMoversDesc": "Letzte Details und Zeitplan klären",
      "timeline.essentialsBox": "Notfall-Kiste packen",
      "timeline.essentialsBoxDesc": "Wichtige Dinge für die ersten Tage",
      "timeline.finalWalkthrough": "Letzte Kontrolle",
      "timeline.finalWalkthroughDesc": "Alle Räume prüfen, Zählerstände notieren",
      "timeline.movingDay": "Umzugstag!",
      "timeline.movingDayDesc": "Der grosse Tag ist da",
      "timeline.keyHandover": "Schlüsselübergabe",
      "timeline.keyHandoverDesc": "Alte Wohnung übergeben, Protokoll unterschreiben",
      "timeline.proPackingIncluded": "✓ Packservice inklusive",
      "timeline.assemblyIncluded": "✓ Möbelmontage inklusive",
      "timeline.storageIncluded": "✓ Zwischenlagerung inklusive",
    },
    fr: {
      title: "Calendrier de déménagement",
      noDate: "Sélectionnez une date pour votre calendrier personnalisé",
      daysLeft: "jours avant le déménagement",
      today: "Aujourd'hui",
      completed: "terminé",
      "timeline.quotes": "Obtenir des devis",
      "timeline.quotesDesc": "Comparez au moins 3 offres",
      "timeline.declutter": "Désencombrer",
      "timeline.declutterDesc": "Vendez ou donnez les objets inutilisés",
      "timeline.utilities": "Informer les fournisseurs",
      "timeline.utilitiesDesc": "Électricité, gaz, internet",
      "timeline.address": "Changement d'adresse",
      "timeline.addressDesc": "Poste, banque, assurances",
      "timeline.insurance": "Assurance déménagement",
      "timeline.insuranceDesc": "Protection pour objets de valeur",
      "timeline.packingSupplies": "Matériel d'emballage",
      "timeline.packingSuppliesDesc": "Cartons, ruban adhésif, protection",
      "timeline.startPacking": "Commencer l'emballage",
      "timeline.startPackingDesc": "Commencez par les pièces peu utilisées",
      "timeline.confirmMovers": "Confirmer déménageurs",
      "timeline.confirmMoversDesc": "Détails finaux et horaires",
      "timeline.essentialsBox": "Boîte d'essentiels",
      "timeline.essentialsBoxDesc": "Objets importants pour les premiers jours",
      "timeline.finalWalkthrough": "Dernière vérification",
      "timeline.finalWalkthroughDesc": "Vérifier toutes les pièces",
      "timeline.movingDay": "Jour du déménagement!",
      "timeline.movingDayDesc": "Le grand jour est arrivé",
      "timeline.keyHandover": "Remise des clés",
      "timeline.keyHandoverDesc": "Remettre l'ancien logement",
      "timeline.proPackingIncluded": "✓ Service d'emballage inclus",
      "timeline.assemblyIncluded": "✓ Montage de meubles inclus",
      "timeline.storageIncluded": "✓ Stockage inclus",
    },
    it: {
      title: "Calendario trasloco",
      noDate: "Seleziona una data per il tuo calendario personalizzato",
      daysLeft: "giorni al trasloco",
      today: "Oggi",
      completed: "completato",
      "timeline.quotes": "Richiedere preventivi",
      "timeline.quotesDesc": "Confronta almeno 3 offerte",
      "timeline.declutter": "Decluttering",
      "timeline.declutterDesc": "Vendi o dona oggetti inutilizzati",
      "timeline.utilities": "Informare fornitori",
      "timeline.utilitiesDesc": "Elettricità, gas, internet",
      "timeline.address": "Cambio indirizzo",
      "timeline.addressDesc": "Posta, banca, assicurazioni",
      "timeline.insurance": "Assicurazione trasloco",
      "timeline.insuranceDesc": "Protezione per oggetti di valore",
      "timeline.packingSupplies": "Materiale imballaggio",
      "timeline.packingSuppliesDesc": "Scatole, nastro, protezioni",
      "timeline.startPacking": "Iniziare imballaggio",
      "timeline.startPackingDesc": "Inizia dalle stanze poco usate",
      "timeline.confirmMovers": "Conferma traslocatori",
      "timeline.confirmMoversDesc": "Dettagli finali e orari",
      "timeline.essentialsBox": "Scatola essenziali",
      "timeline.essentialsBoxDesc": "Oggetti importanti per i primi giorni",
      "timeline.finalWalkthrough": "Controllo finale",
      "timeline.finalWalkthroughDesc": "Verificare tutte le stanze",
      "timeline.movingDay": "Giorno del trasloco!",
      "timeline.movingDayDesc": "Il grande giorno è arrivato",
      "timeline.keyHandover": "Consegna chiavi",
      "timeline.keyHandoverDesc": "Consegnare il vecchio appartamento",
      "timeline.proPackingIncluded": "✓ Servizio imballaggio incluso",
      "timeline.assemblyIncluded": "✓ Montaggio mobili incluso",
      "timeline.storageIncluded": "✓ Deposito incluso",
    },
    en: {
      title: "Moving Timeline",
      noDate: "Select a moving date for your personalized timeline",
      daysLeft: "days until moving",
      today: "Today",
      completed: "completed",
      "timeline.quotes": "Get moving quotes",
      "timeline.quotesDesc": "Compare at least 3 offers",
      "timeline.declutter": "Declutter & sort",
      "timeline.declutterDesc": "Sell or donate unused items",
      "timeline.utilities": "Notify utilities",
      "timeline.utilitiesDesc": "Electricity, gas, internet",
      "timeline.address": "Change of address",
      "timeline.addressDesc": "Post, bank, insurance",
      "timeline.insurance": "Moving insurance",
      "timeline.insuranceDesc": "Protection for valuables",
      "timeline.packingSupplies": "Get packing supplies",
      "timeline.packingSuppliesDesc": "Boxes, tape, padding",
      "timeline.startPacking": "Start packing",
      "timeline.startPackingDesc": "Start with rarely used rooms",
      "timeline.confirmMovers": "Confirm movers",
      "timeline.confirmMoversDesc": "Final details and schedule",
      "timeline.essentialsBox": "Pack essentials box",
      "timeline.essentialsBoxDesc": "Important items for first days",
      "timeline.finalWalkthrough": "Final walkthrough",
      "timeline.finalWalkthroughDesc": "Check all rooms, note meter readings",
      "timeline.movingDay": "Moving day!",
      "timeline.movingDayDesc": "The big day is here",
      "timeline.keyHandover": "Key handover",
      "timeline.keyHandoverDesc": "Hand over old apartment",
      "timeline.proPackingIncluded": "✓ Packing service included",
      "timeline.assemblyIncluded": "✓ Furniture assembly included",
      "timeline.storageIncluded": "✓ Storage included",
    },
  };

  const t = translations[language] || translations.de;

  const tasks = useMemo(() => {
    let filteredTasks = [...baseTasks];
    
    // Remove packing-related tasks if packing service is included
    if (hasPacking) {
      filteredTasks = filteredTasks.filter(task => 
        task.id !== "packing-supplies" && task.id !== "start-packing"
      );
    }
    
    return filteredTasks;
  }, [hasPacking]);

  const daysUntilMove = useMemo(() => {
    if (!movingDate) return null;
    return differenceInDays(movingDate, new Date());
  }, [movingDate]);

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  const completionPercentage = useMemo(() => {
    return Math.round((completedTasks.size / tasks.length) * 100);
  }, [completedTasks, tasks]);

  if (!movingDate) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">{t.noDate}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-alpine" />
          <h3 className="font-semibold">{t.title}</h3>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-alpine">{daysUntilMove}</div>
          <div className="text-xs text-muted-foreground">{t.daysLeft}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">{completedTasks.size}/{tasks.length} {t.completed}</span>
          <span className="font-medium">{completionPercentage}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-alpine to-alpine/70"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Included Services Notice */}
      {(hasPacking || hasAssembly || hasStorage) && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg space-y-1">
          {hasPacking && <p className="text-xs text-green-700 dark:text-green-300">{t["timeline.proPackingIncluded"]}</p>}
          {hasAssembly && <p className="text-xs text-green-700 dark:text-green-300">{t["timeline.assemblyIncluded"]}</p>}
          {hasStorage && <p className="text-xs text-green-700 dark:text-green-300">{t["timeline.storageIncluded"]}</p>}
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
        {tasks.map((task, index) => {
          const taskDate = subDays(movingDate, task.daysBeforeMove);
          const isPast = differenceInDays(new Date(), taskDate) > 0;
          const isCompleted = completedTasks.has(task.id);
          const isToday = differenceInDays(taskDate, new Date()) === 0;
          const Icon = task.icon;

          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                isCompleted 
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" 
                  : isToday 
                    ? "bg-alpine/10 border-alpine" 
                    : isPast 
                      ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" 
                      : "bg-background border-border hover:border-alpine/30"
              }`}
            >
              <Checkbox
                checked={isCompleted}
                onCheckedChange={() => toggleTask(task.id)}
                className="mt-0.5"
              />
              <div className={`p-1.5 rounded-lg ${isCompleted ? "bg-green-500 text-white" : "bg-muted"}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-medium text-sm ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
                    {t[task.titleKey] || task.titleKey}
                  </span>
                  {isToday && (
                    <span className="text-xs bg-alpine text-white px-2 py-0.5 rounded-full">
                      {t.today}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{t[task.descriptionKey] || task.descriptionKey}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  <Clock className="h-3 w-3 inline mr-1" />
                  {format(taskDate, "dd. MMM yyyy", { locale: dateLocale })}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MovingTimeline;
