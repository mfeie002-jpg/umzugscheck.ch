/**
 * TrustRibbon VARIANT P - Data Security Focus
 * 
 * VERSION 16: SSL, GDPR, Swiss Data Center focus
 * For privacy-conscious Swiss users
 * - Server location: Switzerland
 * - GDPR/DSG compliance
 * - No data sharing with third parties
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Server, Eye, CheckCircle2, FileCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TRUST } from '@/content/trust';

const securityFeatures = [
  {
    icon: Server,
    title: 'Schweizer Server',
    description: 'Daten nur in der Schweiz gespeichert',
  },
  {
    icon: Lock,
    title: 'SSL-Verschlüsselung',
    description: 'End-to-End verschlüsselte Übertragung',
  },
  {
    icon: Eye,
    title: 'Kein Datenverkauf',
    description: 'Keine Weitergabe an Dritte',
  },
  {
    icon: FileCheck,
    title: 'DSG-konform',
    description: 'Schweizer Datenschutzgesetz',
  },
];

interface TrustRibbonVariantPProps {
  variant?: "full" | "compact";
  className?: string;
}

export const TrustRibbonVariantP = memo(function TrustRibbonVariantP({ 
  variant = "full",
  className 
}: TrustRibbonVariantPProps) {

  if (variant === "compact") {
    return (
      <div className={cn("py-3 bg-muted/30 border-b border-border/50", className)}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4 md:gap-6">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium">DSG-konform</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Server className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">🇨🇭 Schweizer Server</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">SSL</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className={cn("py-8 bg-gradient-to-b from-muted/30 to-background", className)}>
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-3">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              Datenschutz nach Schweizer Standard
            </span>
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            Ihre Daten sind bei uns sicher
          </h3>
        </motion.div>

        {/* Security Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
        >
          {securityFeatures.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * idx }}
              className="flex flex-col items-center text-center p-4 rounded-xl bg-card border border-border"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-semibold text-foreground">{feature.title}</span>
              <span className="text-[10px] text-muted-foreground mt-0.5">{feature.description}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-border"
        >
          <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>{TRUST.companiesCount} geprüfte Partner</span>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>{TRUST.movesCount} erfolgreiche Umzüge</span>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Keine versteckten Kosten</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
});
