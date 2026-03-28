/**
 * Process Timeline Component
 * 
 * Shows what happens after form submission for transparency
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Send, Clock, FileText, CheckCircle2 } from "lucide-react";

interface ProcessTimelineProps {
  className?: string;
}

export const ProcessTimeline = memo(function ProcessTimeline({ className = "" }: ProcessTimelineProps) {
  const steps = [
    {
      icon: <Send className="w-4 h-4" />,
      title: "Anfrage versenden",
      description: "Ihre Daten gehen an die gewählten Firmen",
      time: "Jetzt",
    },
    {
      icon: <Clock className="w-4 h-4" />,
      title: "Offerten erhalten",
      description: "Per E-Mail direkt in Ihr Postfach",
      time: "Innerhalb 24h",
    },
    {
      icon: <FileText className="w-4 h-4" />,
      title: "Vergleichen & wählen",
      description: "In Ruhe die beste Offerte auswählen",
      time: "Nach Erhalt",
    },
    {
      icon: <CheckCircle2 className="w-4 h-4" />,
      title: "Umzug beauftragen",
      description: "Direkt mit der Firma Ihrer Wahl",
      time: "Wenn Sie bereit sind",
    },
  ];

  return (
    <div className={`p-4 rounded-xl bg-muted/30 border border-border ${className}`}>
      <p className="text-xs font-semibold mb-3 text-center">Was passiert nach dem Absenden?</p>
      
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex-1 relative"
          >
            {/* Connector line (not on last item) */}
            {index < steps.length - 1 && (
              <div className="hidden sm:block absolute top-4 left-1/2 w-full h-0.5 bg-border" />
            )}
            
            <div className="flex sm:flex-col items-start sm:items-center gap-2 sm:gap-1 relative">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 z-10">
                {step.icon}
              </div>
              <div className="sm:text-center">
                <p className="text-[11px] font-medium">{step.title}</p>
                <p className="text-[10px] text-muted-foreground hidden sm:block">{step.description}</p>
                <span className="text-[9px] text-primary font-medium">{step.time}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});
