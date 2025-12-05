import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  ClipboardList, 
  Package, 
  Truck, 
  Home, 
  CheckCircle,
  ChevronRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface TimelineStep {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  tasks: string[];
  daysBeforeMove: string;
}

const timelineSteps: TimelineStep[] = [
  {
    id: 1,
    icon: <Calendar className="h-6 w-6" />,
    title: "Planung starten",
    description: "8-12 Wochen vorher",
    daysBeforeMove: "8-12 Wochen",
    tasks: [
      "Umzugstermin festlegen",
      "Budget erstellen",
      "Offerten einholen",
      "Alte Wohnung kündigen"
    ]
  },
  {
    id: 2,
    icon: <ClipboardList className="h-6 w-6" />,
    title: "Organisation",
    description: "4-8 Wochen vorher",
    daysBeforeMove: "4-8 Wochen",
    tasks: [
      "Umzugsfirma buchen",
      "Adressänderungen melden",
      "Versicherungen prüfen",
      "Entrümpeln beginnen"
    ]
  },
  {
    id: 3,
    icon: <Package className="h-6 w-6" />,
    title: "Packen",
    description: "2-4 Wochen vorher",
    daysBeforeMove: "2-4 Wochen",
    tasks: [
      "Umzugskartons besorgen",
      "Zimmer für Zimmer packen",
      "Inventarliste erstellen",
      "Wertgegenstände sichern"
    ]
  },
  {
    id: 4,
    icon: <Truck className="h-6 w-6" />,
    title: "Umzugstag",
    description: "Der grosse Tag",
    daysBeforeMove: "Tag X",
    tasks: [
      "Zählerstände ablesen",
      "Umzugsgut übergeben",
      "Alte Wohnung reinigen",
      "Schlüsselübergabe"
    ]
  },
  {
    id: 5,
    icon: <Home className="h-6 w-6" />,
    title: "Einrichten",
    description: "1-2 Wochen danach",
    daysBeforeMove: "Nach dem Umzug",
    tasks: [
      "Kartons auspacken",
      "Möbel aufbauen",
      "Ämter informieren",
      "Nachbarn begrüssen"
    ]
  }
];

export const InteractiveTimeline = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [completedTasks, setCompletedTasks] = useState<Record<number, string[]>>({});

  const toggleTask = (stepId: number, task: string) => {
    setCompletedTasks(prev => {
      const stepTasks = prev[stepId] || [];
      if (stepTasks.includes(task)) {
        return { ...prev, [stepId]: stepTasks.filter(t => t !== task) };
      }
      return { ...prev, [stepId]: [...stepTasks, task] };
    });
  };

  const getStepProgress = (stepId: number) => {
    const step = timelineSteps.find(s => s.id === stepId);
    if (!step) return 0;
    const completed = completedTasks[stepId]?.length || 0;
    return (completed / step.tasks.length) * 100;
  };

  const totalProgress = timelineSteps.reduce((acc, step) => {
    return acc + getStepProgress(step.id);
  }, 0) / timelineSteps.length;

  return (
    <div className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Interaktive Umzugs-Timeline</h2>
        <p className="text-muted-foreground mb-4">
          Planen Sie Ihren Umzug Schritt für Schritt
        </p>
        <div className="max-w-md mx-auto">
          <div className="flex justify-between text-sm mb-2">
            <span>Gesamtfortschritt</span>
            <span>{Math.round(totalProgress)}%</span>
          </div>
          <Progress value={totalProgress} className="h-2" />
        </div>
      </div>

      {/* Timeline Navigation */}
      <div className="relative mb-8">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted -translate-y-1/2" />
        <div className="flex justify-between relative">
          {timelineSteps.map((step) => (
            <motion.button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`relative z-10 p-3 rounded-full transition-all ${
                activeStep === step.id
                  ? 'bg-primary text-primary-foreground shadow-lg scale-110'
                  : getStepProgress(step.id) === 100
                  ? 'bg-green-500 text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {getStepProgress(step.id) === 100 ? (
                <CheckCircle className="h-6 w-6" />
              ) : (
                step.icon
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Active Step Details */}
      <motion.div
        key={activeStep}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6">
            {timelineSteps.filter(s => s.id === activeStep).map((step) => (
              <div key={step.id}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground">{step.daysBeforeMove}</p>
                  </div>
                  <div className="ml-auto">
                    <Progress value={getStepProgress(step.id)} className="w-20 h-2" />
                  </div>
                </div>

                <div className="space-y-3">
                  {step.tasks.map((task, index) => {
                    const isCompleted = completedTasks[step.id]?.includes(task);
                    return (
                      <motion.button
                        key={index}
                        onClick={() => toggleTask(step.id, task)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                          isCompleted
                            ? 'bg-green-500/10 text-green-700'
                            : 'bg-muted/50 hover:bg-muted'
                        }`}
                        whileHover={{ x: 5 }}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isCompleted
                            ? 'border-green-500 bg-green-500'
                            : 'border-muted-foreground'
                        }`}>
                          {isCompleted && <CheckCircle className="h-3 w-3 text-white" />}
                        </div>
                        <span className={isCompleted ? 'line-through' : ''}>{task}</span>
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
