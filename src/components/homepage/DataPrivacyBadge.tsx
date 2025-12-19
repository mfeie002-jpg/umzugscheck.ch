import { memo } from "react";
import { Lock, Shield, Server, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface DataPrivacyBadgeProps {
  variant?: "inline" | "card" | "minimal";
  className?: string;
}

export const DataPrivacyBadge = memo(function DataPrivacyBadge({
  variant = "inline",
  className = ""
}: DataPrivacyBadgeProps) {
  
  if (variant === "minimal") {
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs text-muted-foreground ${className}`}>
        <Lock className="w-3 h-3" />
        Daten bleiben in der Schweiz
      </span>
    );
  }

  if (variant === "card") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-primary/5 border border-primary/20 rounded-xl p-4 ${className}`}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-foreground">
              Ihre Daten sind sicher
            </h4>
            
            <ul className="space-y-1.5">
              {[
                { icon: Server, text: "Server in der Schweiz" },
                { icon: Lock, text: "SSL-Verschlüsselung" },
                { icon: CheckCircle2, text: "Keine Werbeanrufe. Versprochen." },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <item.icon className="w-3.5 h-3.5 text-primary" />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    );
  }

  // Default: inline variant
  return (
    <div className={`flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground ${className}`}>
      <span className="inline-flex items-center gap-1.5">
        <Shield className="w-3.5 h-3.5 text-primary" />
        Server in der Schweiz
      </span>
      <span className="text-border">•</span>
      <span className="inline-flex items-center gap-1.5">
        <Lock className="w-3.5 h-3.5 text-primary" />
        SSL-verschlüsselt
      </span>
      <span className="text-border">•</span>
      <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
        Keine Werbeanrufe
      </span>
    </div>
  );
});
