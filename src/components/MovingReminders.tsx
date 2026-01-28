import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Bell, Check, Clock, Truck, Star, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Reminder {
  id: string;
  title: string;
  message: string;
  daysBeforeMove: number;
  icon: 'bell' | 'truck' | 'star' | 'calendar';
  completed: boolean;
}

const defaultReminders: Reminder[] = [
  { id: '1', title: 'Umzugskartons bestellen', message: 'Bestellen Sie rechtzeitig Umzugskartons und Verpackungsmaterial.', daysBeforeMove: 30, icon: 'bell', completed: false },
  { id: '2', title: 'Adressänderungen', message: 'Informieren Sie Bank, Versicherungen und Behörden über Ihre neue Adresse.', daysBeforeMove: 21, icon: 'star', completed: false },
  { id: '3', title: 'Strom & Internet', message: 'Kündigen Sie Verträge am alten Standort und melden Sie am neuen an.', daysBeforeMove: 14, icon: 'calendar', completed: false },
  { id: '4', title: 'Wertgegenstände packen', message: 'Packen Sie Schmuck, Dokumente und Wertsachen separat.', daysBeforeMove: 7, icon: 'bell', completed: false },
  { id: '5', title: 'Kühlschrank leeren', message: 'Leeren und reinigen Sie den Kühlschrank einen Tag vorher.', daysBeforeMove: 1, icon: 'truck', completed: false },
];

interface MovingRemindersProps {
  movingDate?: Date;
  onClose?: () => void;
}

const MovingReminders = ({ movingDate, onClose }: MovingRemindersProps) => {
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('moving-reminders');
    return saved ? JSON.parse(saved) : defaultReminders;
  });
  const [showNotification, setShowNotification] = useState(false);
  const [activeReminder, setActiveReminder] = useState<Reminder | null>(null);

  useEffect(() => {
    localStorage.setItem('moving-reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    if (!movingDate) return;

    const daysUntilMove = Math.ceil((movingDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    const dueReminder = reminders.find(r => !r.completed && r.daysBeforeMove >= daysUntilMove);
    if (dueReminder) {
      setActiveReminder(dueReminder);
      setShowNotification(true);
    }
  }, [movingDate, reminders]);

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, completed: !r.completed } : r
    ));
    toast({ title: 'Erinnerung aktualisiert' });
  };

  const dismissNotification = () => {
    setShowNotification(false);
    setActiveReminder(null);
  };

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'truck': return Truck;
      case 'star': return Star;
      case 'calendar': return Calendar;
      default: return Bell;
    }
  };

  const completedCount = reminders.filter(r => r.completed).length;

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Fortschritt</span>
        <span className="font-medium">{completedCount}/{reminders.length} erledigt</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${(completedCount / reminders.length) * 100}%` }}
        />
      </div>

      {/* Reminders List */}
      <div className="space-y-2">
        {reminders.map((reminder) => {
          const Icon = getIcon(reminder.icon);
          return (
            <motion.div
              key={reminder.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                reminder.completed 
                  ? 'bg-muted/50 opacity-60' 
                  : 'bg-card hover:border-primary/30'
              }`}
              onClick={() => toggleReminder(reminder.id)}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                reminder.completed ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                {reminder.completed ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm ${reminder.completed ? 'line-through' : ''}`}>
                  {reminder.title}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-1">{reminder.message}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {reminder.daysBeforeMove} Tage vor Umzug
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Notification Popup */}
      <AnimatePresence>
        {showNotification && activeReminder && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 right-4 z-50 max-w-sm bg-card border rounded-xl shadow-xl p-4"
          >
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2 h-6 w-6"
              onClick={dismissNotification}
            >
              <X className="w-4 h-4" />
            </Button>
            <div className="flex items-start gap-3 pr-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Erinnerung</h4>
                <p className="text-sm text-muted-foreground">{activeReminder.title}</p>
                <Button 
                  size="sm" 
                  className="mt-2"
                  onClick={() => {
                    toggleReminder(activeReminder.id);
                    dismissNotification();
                  }}
                >
                  <Check className="w-3 h-3 mr-1" />
                  Erledigt
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MovingReminders;
