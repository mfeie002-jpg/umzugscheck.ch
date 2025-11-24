import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export const AdvancedMicroInteractions = () => {
  const features = [
    {
      title: "Blitz-schnell",
      emoji: "⚡",
      description: "Offerte in unter 60 Sekunden",
    },
    {
      title: "100% Transparent",
      emoji: "🔍",
      description: "Keine versteckten Kosten",
    },
    {
      title: "Geprüft & Sicher",
      emoji: "🛡️",
      description: "Alle Firmen verifiziert",
    },
    {
      title: "Schweizer Qualität",
      emoji: "🇨🇭",
      description: "Made in Switzerland",
    },
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-background to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                rotateX: 5,
              }}
              className="relative group cursor-pointer"
              style={{ perspective: 1000 }}
            >
              {/* Ripple effect on hover */}
              <motion.div
                className="absolute inset-0 bg-primary/10 rounded-2xl"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ 
                  scale: [0, 1.2, 1],
                  opacity: [0, 0.5, 0],
                }}
                transition={{ duration: 0.6 }}
              />

              {/* Card */}
              <div className="relative p-6 bg-card border-2 border-border rounded-2xl hover:border-primary transition-all shadow-lg hover:shadow-xl overflow-hidden">
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />

                {/* Content */}
                <div className="relative text-center">
                  <motion.div
                    className="text-4xl mb-3"
                    whileHover={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {feature.emoji}
                  </motion.div>
                  <h4 className="font-bold text-foreground mb-1 text-sm">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {feature.description}
                  </p>
                </div>

                {/* Glow effect on hover */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: "radial-gradient(circle at center, hsl(var(--primary) / 0.2), transparent 70%)",
                  }}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
