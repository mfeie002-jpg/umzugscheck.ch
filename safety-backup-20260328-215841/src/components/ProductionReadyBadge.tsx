/**
 * Production Ready Badge Component
 * Shows production readiness indicators in admin dashboard
 */

import { memo } from 'react';
import { 
  CheckCircle, 
  Shield, 
  Zap, 
  Search, 
  Smartphone, 
  Lock,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReadinessItem {
  label: string;
  status: 'complete' | 'warning' | 'pending';
  icon: React.ReactNode;
}

const readinessItems: ReadinessItem[] = [
  { label: 'Security (RLS)', status: 'complete', icon: <Shield className="w-4 h-4" /> },
  { label: 'Performance', status: 'complete', icon: <Zap className="w-4 h-4" /> },
  { label: 'SEO', status: 'complete', icon: <Search className="w-4 h-4" /> },
  { label: 'Mobile', status: 'complete', icon: <Smartphone className="w-4 h-4" /> },
  { label: 'GDPR/DSG', status: 'complete', icon: <Lock className="w-4 h-4" /> },
  { label: 'PWA', status: 'complete', icon: <Globe className="w-4 h-4" /> },
];

interface ProductionReadyBadgeProps {
  className?: string;
  variant?: 'compact' | 'full';
}

export const ProductionReadyBadge = memo(({ 
  className,
  variant = 'compact' 
}: ProductionReadyBadgeProps) => {
  const completeCount = readinessItems.filter(i => i.status === 'complete').length;
  const totalCount = readinessItems.length;
  const isReady = completeCount === totalCount;

  if (variant === 'compact') {
    return (
      <div className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
        isReady 
          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        className
      )}>
        <CheckCircle className="w-4 h-4" />
        <span>Production Ready</span>
        <span className="text-xs opacity-70">{completeCount}/{totalCount}</span>
      </div>
    );
  }

  return (
    <div className={cn(
      "p-4 rounded-xl border bg-card",
      isReady ? "border-green-200 dark:border-green-800" : "border-yellow-200 dark:border-yellow-800",
      className
    )}>
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle className={cn(
          "w-5 h-5",
          isReady ? "text-green-600" : "text-yellow-600"
        )} />
        <h3 className="font-semibold">Production Readiness</h3>
        <span className={cn(
          "ml-auto text-sm font-medium px-2 py-0.5 rounded-full",
          isReady 
            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
        )}>
          {completeCount}/{totalCount}
        </span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {readinessItems.map((item) => (
          <div 
            key={item.label}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm",
              item.status === 'complete' && "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400",
              item.status === 'warning' && "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
              item.status === 'pending' && "bg-muted text-muted-foreground"
            )}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.status === 'complete' && <CheckCircle className="w-3 h-3 ml-auto" />}
          </div>
        ))}
      </div>
    </div>
  );
});

ProductionReadyBadge.displayName = 'ProductionReadyBadge';
