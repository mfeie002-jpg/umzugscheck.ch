import { LucideIcon } from "lucide-react";

interface ProcessStepProps {
  step: number;
  title: string;
  description: string;
  icon?: LucideIcon;
  isLast?: boolean;
  className?: string;
}

const ProcessStep = ({ 
  step, 
  title, 
  description, 
  icon: Icon,
  isLast = false,
  className = "" 
}: ProcessStepProps) => {
  return (
    <div className={`relative ${className}`}>
      {/* Connector line */}
      {!isLast && (
        <div className="hidden lg:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-alpine/30 to-alpine/10" />
      )}
      
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Step number circle */}
        <div className="relative mb-5">
          <div className="w-20 h-20 rounded-full bg-gradient-hero flex items-center justify-center shadow-medium">
            {Icon ? (
              <Icon className="h-8 w-8 text-primary-foreground" />
            ) : (
              <span className="text-2xl font-bold text-primary-foreground font-display">
                {String(step).padStart(2, '0')}
              </span>
            )}
          </div>
          {/* Pulse effect */}
          <div className="absolute inset-0 rounded-full bg-alpine/20 animate-ping" style={{ animationDuration: '3s' }} />
        </div>

        <h3 className="text-xl font-bold mb-3 font-display">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">{description}</p>
      </div>
    </div>
  );
};

export default ProcessStep;