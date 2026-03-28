import { Shield, Clock, Award, CheckCircle2, Users } from "lucide-react";

const signals = [
  {
    icon: Shield,
    text: "SSL-verschlüsselt",
    color: "text-success"
  },
  {
    icon: Clock,
    text: "24h Antwortzeit",
    color: "text-primary"
  },
  {
    icon: Award,
    text: "Geprüfte Anbieter",
    color: "text-accent"
  },
  {
    icon: CheckCircle2,
    text: "100% kostenlos",
    color: "text-success"
  },
  {
    icon: Users,
    text: "12'000+ zufriedene Kunden",
    color: "text-primary"
  }
];

export const TrustMicroSignals = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 py-4">
      {signals.map((signal, index) => (
        <div 
          key={index} 
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <signal.icon className={`w-4 h-4 ${signal.color}`} />
          <span>{signal.text}</span>
        </div>
      ))}
    </div>
  );
};
