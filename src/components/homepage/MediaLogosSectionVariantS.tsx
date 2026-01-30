/**
 * Social Proof Variant S (V19): Data Security Focus
 * 
 * SSL, GDPR, Swiss Made prominent - addresses "Gatekeeper Moment" anxiety:
 * "Moving requires sharing sensitive data (home address, phone, video of belongings)"
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Server, FileCheck, Eye, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
}

const SECURITY_FEATURES = [
  {
    icon: Lock,
    title: 'SSL-Verschlüsselung',
    description: '256-Bit Verschlüsselung für alle Datenübertragungen',
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900/30'
  },
  {
    icon: Server,
    title: 'Schweizer Server',
    description: 'Ihre Daten verlassen nie die Schweiz',
    color: 'text-red-600',
    bgColor: 'bg-red-100 dark:bg-red-900/30'
  },
  {
    icon: FileCheck,
    title: 'DSGVO & nDSG',
    description: 'Konform mit CH & EU Datenschutz',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30'
  },
  {
    icon: Eye,
    title: 'Keine Weitergabe',
    description: 'Nur ausgewählte Firmen erhalten Ihre Anfrage',
    color: 'text-violet-600',
    bgColor: 'bg-violet-100 dark:bg-violet-900/30'
  },
];

export const MediaLogosSectionVariantS = memo(function MediaLogosSectionVariantS({ className }: Props) {
  return (
    <section className={cn("py-10 bg-gradient-to-b from-background to-muted/30", className)}>
      <div className="container mx-auto px-4">
        {/* Header with Shield */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4"
          >
            <Shield className="w-8 h-8 text-primary" />
          </motion.div>
          <h3 className="text-xl font-bold">Ihre Sicherheit ist unsere Priorität</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            Umzugsdaten sind sensibel. Wir schützen Ihre Adresse, Telefonnummer 
            und alle Angaben nach höchsten Schweizer Standards.
          </p>
        </div>
        
        {/* Security Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {SECURITY_FEATURES.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-background rounded-xl border p-5 text-center hover:shadow-md transition-shadow"
            >
              <div className={cn(
                "w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center",
                feature.bgColor
              )}>
                <feature.icon className={cn("w-6 h-6", feature.color)} />
              </div>
              <h4 className="font-semibold text-sm mb-1">{feature.title}</h4>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
        
        {/* Bottom Trust Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 max-w-2xl mx-auto"
        >
          <div className="bg-muted/50 rounded-xl p-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {[
              'Swiss Made Software',
              'ISO 27001 Hosting',
              'Kein Spam',
              'Jederzeit löschbar',
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Data Promise */}
        <p className="text-center text-[11px] text-muted-foreground mt-6 max-w-lg mx-auto">
          <strong>Unser Versprechen:</strong> Ihre Daten werden ausschliesslich zur Offertenerstellung 
          verwendet und niemals an Dritte verkauft. Keine Werbeanrufe – versprochen.
        </p>
      </div>
    </section>
  );
});

export default MediaLogosSectionVariantS;
