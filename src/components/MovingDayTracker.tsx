import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  AlertTriangle,
  Coffee,
  Truck,
  Package,
  Key,
  Camera
} from 'lucide-react';

interface Task {
  id: string;
  time: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  icon: string;
}

const defaultTasks: Task[] = [
  { id: '1', time: '06:00', title: 'Aufwachen & Frühstücken', completed: false, priority: 'medium', icon: 'coffee' },
  { id: '2', time: '07:00', title: 'Letzte Sachen packen', completed: false, priority: 'high', icon: 'package' },
  { id: '3', time: '08:00', title: 'Umzugsteam empfangen', completed: false, priority: 'high', icon: 'truck' },
  { id: '4', time: '08:30', title: 'Begehung & Briefing', completed: false, priority: 'high', icon: 'clipboard' },
  { id: '5', time: '09:00', title: 'Beladung starten', completed: false, priority: 'high', icon: 'truck' },
  { id: '6', time: '12:00', title: 'Mittagspause', completed: false, priority: 'low', icon: 'coffee' },
  { id: '7', time: '13:00', title: 'Transport zur neuen Wohnung', completed: false, priority: 'high', icon: 'truck' },
  { id: '8', time: '14:00', title: 'Entladung & Aufbau', completed: false, priority: 'high', icon: 'package' },
  { id: '9', time: '17:00', title: 'Fotos der leeren Wohnung', completed: false, priority: 'medium', icon: 'camera' },
  { id: '10', time: '18:00', title: 'Schlüsselübergabe alte Wohnung', completed: false, priority: 'high', icon: 'key' },
];

const iconMap: { [key: string]: React.ReactNode } = {
  coffee: <Coffee className="w-4 h-4" />,
  package: <Package className="w-4 h-4" />,
  truck: <Truck className="w-4 h-4" />,
  key: <Key className="w-4 h-4" />,
  camera: <Camera className="w-4 h-4" />,
  clipboard: <CheckCircle2 className="w-4 h-4" />,
};

interface MovingDayTrackerProps {
  movingDate?: Date;
}

const MovingDayTracker = ({ movingDate }: MovingDayTrackerProps) => {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = (completedCount / tasks.length) * 100;

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const addTask = () => {
    if (!newTaskTitle.trim() || !newTaskTime.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      time: newTaskTime,
      title: newTaskTitle,
      completed: false,
      priority: 'medium',
      icon: 'clipboard'
    };
    
    const updatedTasks = [...tasks, newTask].sort((a, b) => 
      a.time.localeCompare(b.time)
    );
    
    setTasks(updatedTasks);
    setNewTaskTitle('');
    setNewTaskTime('');
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/20 text-destructive';
      case 'medium': return 'bg-warning/20 text-warning';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formattedDate = movingDate 
    ? movingDate.toLocaleDateString('de-CH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : 'Datum wählen';

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5 text-primary" />
            Umzugstag-Tracker
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {completedCount}/{tasks.length} erledigt
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{formattedDate}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Fortschritt</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Add Task */}
        <div className="flex gap-2">
          <Input
            type="time"
            value={newTaskTime}
            onChange={(e) => setNewTaskTime(e.target.value)}
            className="w-24"
          />
          <Input
            placeholder="Neue Aufgabe..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            className="flex-1"
          />
          <Button size="icon" onClick={addTask} variant="outline">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Tasks Timeline */}
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          <AnimatePresence>
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer
                  ${task.completed 
                    ? 'bg-primary/5 border-primary/20 opacity-60' 
                    : 'bg-card border-border hover:border-primary/30'
                  }`}
                onClick={() => toggleTask(task.id)}
              >
                {/* Time */}
                <div className="text-sm font-mono text-muted-foreground w-12">
                  {task.time}
                </div>

                {/* Checkbox */}
                <div className="flex-shrink-0">
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>

                {/* Icon */}
                <div className={`p-1.5 rounded-md ${getPriorityColor(task.priority)}`}>
                  {iconMap[task.icon] || <Circle className="w-4 h-4" />}
                </div>

                {/* Title */}
                <span className={`flex-1 text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {task.title}
                </span>

                {/* Priority indicator */}
                {task.priority === 'high' && !task.completed && (
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                )}

                {/* Delete */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTask(task.id);
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Tips */}
        {completedCount === tasks.length && tasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-center"
          >
            <CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="font-medium text-primary">Alle Aufgaben erledigt!</p>
            <p className="text-sm text-muted-foreground">Herzlichen Glückwunsch zum erfolgreichen Umzug!</p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default MovingDayTracker;
