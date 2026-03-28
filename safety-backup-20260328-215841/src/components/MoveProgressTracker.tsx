import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  CheckCircle, 
  Circle, 
  ArrowRight,
  Calendar,
  Truck,
  Home,
  Package
} from "lucide-react";
import { motion } from "framer-motion";

interface ProgressStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  active: boolean;
}

export const useMoveProgress = () => {
  const [steps, setSteps] = useState<ProgressStep[]>(() => {
    const saved = localStorage.getItem("moveProgress");
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      { id: "1", title: "Offerten angefragt", description: "Anfrage an Umzugsfirmen gesendet", icon: <Package className="h-5 w-5" />, completed: false, active: true },
      { id: "2", title: "Firma ausgewählt", description: "Umzugsfirma gebucht", icon: <Truck className="h-5 w-5" />, completed: false, active: false },
      { id: "3", title: "Termin bestätigt", description: "Umzugsdatum festgelegt", icon: <Calendar className="h-5 w-5" />, completed: false, active: false },
      { id: "4", title: "Umzug abgeschlossen", description: "Erfolgreich umgezogen", icon: <Home className="h-5 w-5" />, completed: false, active: false },
    ];
  });

  useEffect(() => {
    localStorage.setItem("moveProgress", JSON.stringify(steps));
  }, [steps]);

  const completeStep = (id: string) => {
    setSteps(prev => {
      const index = prev.findIndex(s => s.id === id);
      return prev.map((step, i) => ({
        ...step,
        completed: i <= index,
        active: i === index + 1,
      }));
    });
  };

  const resetProgress = () => {
    setSteps(prev => prev.map((step, i) => ({
      ...step,
      completed: false,
      active: i === 0,
    })));
  };

  const completedCount = steps.filter(s => s.completed).length;
  const progress = (completedCount / steps.length) * 100;

  return { steps, completeStep, resetProgress, progress, completedCount };
};

export const MoveProgressTracker = () => {
  const { steps, completeStep, progress, completedCount } = useMoveProgress();
  const currentStep = steps.find(s => s.active) || steps[0];

  return (
    <Card className="border-border/50 shadow-sm overflow-hidden">
      <div className="h-1 bg-muted">
        <motion.div 
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Ihr Umzugs-Fortschritt
          </CardTitle>
          <Badge variant={completedCount === steps.length ? "default" : "secondary"}>
            {completedCount}/{steps.length} Schritte
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-border" />
          
          <div className="space-y-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-start gap-4 relative ${
                  step.completed ? "opacity-60" : step.active ? "" : "opacity-40"
                }`}
              >
                <div className={`
                  relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 
                  ${step.completed 
                    ? "bg-green-500 border-green-500 text-white" 
                    : step.active 
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-background border-border text-muted-foreground"
                  }
                `}>
                  {step.completed ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    step.icon
                  )}
                </div>
                
                <div className="flex-1 pt-1">
                  <p className={`font-medium ${step.active ? "text-primary" : ""}`}>
                    {step.title}
                  </p>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                  
                  {step.active && !step.completed && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={() => completeStep(step.id)}
                    >
                      Als erledigt markieren
                      <CheckCircle className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Current Action */}
        {completedCount < steps.length && (
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm font-medium">Nächster Schritt</p>
            <p className="text-sm text-muted-foreground">{currentStep?.description}</p>
          </div>
        )}

        {completedCount === steps.length && (
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="font-medium text-green-700">Herzlichen Glückwunsch!</p>
            <p className="text-sm text-muted-foreground">Ihr Umzug wurde erfolgreich abgeschlossen.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MoveProgressTracker;
