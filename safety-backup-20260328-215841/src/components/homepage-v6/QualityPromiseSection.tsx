/**
 * Quality Promise Section V6 - Visual trust elements
 * Addresses: "Visualisiertes Qualitätsversprechen"
 */
import { memo } from 'react';
import { motion } from 'framer-motion';
import { Award, Lock, Smile, Clock, Shield, CheckCircle2 } from 'lucide-react';

interface QualityPromise {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}

const QUALITY_PROMISES: QualityPromise[] = [
  {
    id: 'qualified',
    icon: Award,
    title: 'Qualifizierte Umzugsfirmen',
    description: 'Nur geprüfte & versicherte Partner',
    color: 'text-blue-600',
  },
  {
    id: 'secure',
    icon: Lock,
    title: 'Sichere Datenübertragung',
    description: '256-bit SSL Verschlüsselung',
    color: 'text-green-600',
  },
  {
    id: 'satisfaction',
    icon: Smile,
    title: 'Zufriedenheitsgarantie',
    description: '98% Weiterempfehlungsrate',
    color: 'text-amber-600',
  },
  {
    id: 'fast',
    icon: Clock,
    title: 'Schnelle Offerten',
    description: 'Innert 24-48 Stunden',
    color: 'text-purple-600',
  },
];

export const QualityPromiseSection = memo(function QualityPromiseSection() {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {QUALITY_PROMISES.map((promise, index) => {
            const Icon = promise.icon;
            
            return (
              <motion.div
                key={promise.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center text-center p-4"
              >
                <div className={`w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-3`}>
                  <Icon className={`w-6 h-6 ${promise.color}`} />
                </div>
                <h3 className="font-semibold text-sm md:text-base mb-1">
                  {promise.title}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {promise.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Trust Line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-muted-foreground">
            <Shield className="w-4 h-4 inline-block mr-1 text-primary" />
            Unser Service ist <strong>100% kostenlos</strong> – keine Verpflichtungen, keine versteckten Kosten
          </p>
        </motion.div>
      </div>
    </section>
  );
});
