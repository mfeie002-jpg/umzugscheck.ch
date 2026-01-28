import { Shield, Lock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface SecurityBannerProps {
  variant?: 'minimal' | 'detailed';
  className?: string;
}

/**
 * Security trust banner to display security features
 */
export function SecurityBanner({ variant = 'minimal', className = '' }: SecurityBannerProps) {
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-2 text-xs text-muted-foreground ${className}`}>
        <Lock className="h-3 w-3" />
        <span>SSL-verschlüsselt</span>
        <span className="mx-1">•</span>
        <Shield className="h-3 w-3" />
        <span>Datenschutz garantiert</span>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-primary/5 border border-primary/10 rounded-lg p-4 ${className}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <Shield className="h-5 w-5 text-primary" />
        <h4 className="font-medium text-sm">Ihre Daten sind sicher</h4>
      </div>
      
      <ul className="space-y-2">
        <li className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
          <span>256-bit SSL-Verschlüsselung</span>
        </li>
        <li className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
          <span>DSGVO-konform</span>
        </li>
        <li className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
          <span>Keine Weitergabe an Dritte</span>
        </li>
        <li className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
          <span>Schweizer Datenschutzstandards</span>
        </li>
      </ul>
    </motion.div>
  );
}
