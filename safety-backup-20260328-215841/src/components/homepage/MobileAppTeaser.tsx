import { memo } from "react";
import { motion } from "framer-motion";
import { Smartphone, Bell, FileText, MessageSquare } from "lucide-react";

const features = [
  { icon: Bell, text: "Push-Benachrichtigungen" },
  { icon: FileText, text: "Alle Offerten im Blick" },
  { icon: MessageSquare, text: "Direkter Chat" },
];

export const MobileAppTeaser = memo(function MobileAppTeaser() {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
              <Smartphone className="w-3.5 h-3.5" />
              Bald verfügbar
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Umzugscheck.ch App
            </h2>
            <p className="text-muted-foreground mb-6">
              Verwalten Sie Ihren Umzug bequem von unterwegs. Erhalten Sie 
              Benachrichtigungen, vergleichen Sie Offerten und kommunizieren 
              Sie direkt mit Umzugsfirmen.
            </p>
            <div className="space-y-3">
              {features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feat.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{feat.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative flex justify-center"
          >
            <div className="w-48 h-80 bg-card rounded-3xl border-4 border-border shadow-premium flex items-center justify-center">
              <div className="text-center">
                <Smartphone className="w-12 h-12 text-muted-foreground/50 mx-auto mb-2" />
                <span className="text-xs text-muted-foreground">Coming Soon</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});
