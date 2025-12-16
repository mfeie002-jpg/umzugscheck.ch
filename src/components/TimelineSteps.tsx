import { CheckCircle, Clock, Mail, Phone, FileText, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineStep {
  icon: React.ElementType;
  title: string;
  description: string;
  time: string;
  completed?: boolean;
  current?: boolean;
}

const defaultSteps: TimelineStep[] = [
  {
    icon: CheckCircle,
    title: "Anfrage erhalten",
    description: "Ihre Daten wurden erfolgreich übermittelt",
    time: "Jetzt",
    completed: true,
  },
  {
    icon: Mail,
    title: "Firmen benachrichtigt",
    description: "Die ausgewählten Firmen erhalten Ihre Anfrage",
    time: "In wenigen Minuten",
    current: true,
  },
  {
    icon: Phone,
    title: "Kontaktaufnahme",
    description: "Die Firmen werden Sie kontaktieren",
    time: "Innerhalb 24 Stunden",
  },
  {
    icon: FileText,
    title: "Offerten erhalten",
    description: "Sie erhalten detaillierte Angebote per E-Mail",
    time: "1-2 Werktage",
  },
  {
    icon: ThumbsUp,
    title: "Entscheidung treffen",
    description: "Vergleichen Sie und wählen Sie Ihren Favoriten",
    time: "In Ihrer Zeit",
  },
];

interface TimelineStepsProps {
  steps?: TimelineStep[];
  className?: string;
}

export const TimelineSteps = ({ steps = defaultSteps, className }: TimelineStepsProps) => {
  return (
    <div className={cn("space-y-0", className)}>
      <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
        <Clock className="h-5 w-5 text-primary" />
        Was passiert als Nächstes?
      </h3>
      <div className="relative">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === steps.length - 1;
          
          return (
            <div key={index} className="flex gap-4 pb-6 last:pb-0">
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                    step.completed
                      ? "bg-green-100 text-green-600"
                      : step.current
                      ? "bg-primary text-primary-foreground animate-pulse"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      "w-0.5 flex-1 min-h-[40px] mt-2",
                      step.completed ? "bg-green-200" : "bg-border"
                    )}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-2">
                <div className="flex items-center justify-between mb-1">
                  <h4
                    className={cn(
                      "font-semibold",
                      step.completed
                        ? "text-green-700"
                        : step.current
                        ? "text-primary"
                        : "text-foreground"
                    )}
                  >
                    {step.title}
                  </h4>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    {step.time}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
