import { memo } from "react";
import { motion } from "framer-motion";
import { Lightbulb, AlertTriangle, CheckCircle, MapPin } from "lucide-react";

interface RegionLocalTipsProps {
  tips: string[];
  blurb: string;
  regionName: string;
}

export const RegionLocalTips = memo(({ tips, blurb, regionName }: RegionLocalTipsProps) => {
  return (
    <section className="py-10 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-4">
              <Lightbulb className="w-7 h-7 text-yellow-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Lokales Wissen für {regionName}
            </h2>
            <p className="text-muted-foreground">
              Wichtige Tipps und Besonderheiten für Ihren Umzug
            </p>
          </motion.div>

          {/* Local Tips Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-4 mb-8"
          >
            {tips.map((tip, index) => (
              <div
                key={index}
                className="flex items-start gap-3 bg-card border border-border rounded-lg p-4"
              >
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-primary" />
                </div>
                <p className="text-sm text-foreground">{tip}</p>
              </div>
            ))}
          </motion.div>

          {/* SEO Blurb */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-muted/50 rounded-xl p-6 border border-border"
          >
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Umzug in {regionName}</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {blurb}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

RegionLocalTips.displayName = 'RegionLocalTips';
