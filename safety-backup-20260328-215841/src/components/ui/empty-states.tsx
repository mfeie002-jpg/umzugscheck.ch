/**
 * Empty States
 * 
 * Consistent empty state components for:
 * - No results found
 * - No data available
 * - Error states
 * - First-time user states
 */

import { memo } from 'react';
import { 
  Search, 
  Inbox, 
  FileQuestion, 
  AlertCircle, 
  Plus,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ElementType;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState = memo(function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center py-12 px-4",
      className
    )}>
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
      )}
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {action && (
            <Button 
              onClick={action.onClick}
              variant={action.variant || 'default'}
            >
              {action.label}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
          {secondaryAction && (
            <Button 
              onClick={secondaryAction.onClick}
              variant="outline"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
});

/**
 * No search results state
 */
export const NoSearchResults = memo(function NoSearchResults({
  query,
  onClear,
  suggestions,
  className,
}: {
  query: string;
  onClear?: () => void;
  suggestions?: string[];
  className?: string;
}) {
  return (
    <EmptyState
      icon={Search}
      title={`Keine Ergebnisse für "${query}"`}
      description="Versuchen Sie es mit anderen Suchbegriffen oder weniger Filtern."
      action={onClear ? { label: 'Suche zurücksetzen', onClick: onClear, variant: 'outline' } : undefined}
      className={className}
    />
  );
});

/**
 * No data available state
 */
export const NoDataState = memo(function NoDataState({
  title = 'Keine Daten vorhanden',
  description,
  onRefresh,
  className,
}: {
  title?: string;
  description?: string;
  onRefresh?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={FileQuestion}
      title={title}
      description={description || 'Es sind noch keine Daten verfügbar.'}
      action={onRefresh ? { label: 'Aktualisieren', onClick: onRefresh, variant: 'outline' } : undefined}
      className={className}
    />
  );
});

/**
 * Error state with retry
 */
export const ErrorState = memo(function ErrorState({
  title = 'Etwas ist schiefgelaufen',
  description,
  onRetry,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center py-12 px-4",
      className
    )}>
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-6">
        {description || 'Bitte versuchen Sie es später erneut.'}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Erneut versuchen
        </Button>
      )}
    </div>
  );
});

/**
 * First-time/onboarding state
 */
export const FirstTimeState = memo(function FirstTimeState({
  title,
  description,
  onGetStarted,
  features,
  className,
}: {
  title: string;
  description?: string;
  onGetStarted: () => void;
  features?: { icon: React.ElementType; text: string }[];
  className?: string;
}) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center py-12 px-4",
      className
    )}>
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Plus className="w-10 h-10 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground max-w-md mb-6">{description}</p>
      )}
      {features && features.length > 0 && (
        <ul className="flex flex-wrap justify-center gap-4 mb-6">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
              <feature.icon className="w-4 h-4 text-primary" />
              {feature.text}
            </li>
          ))}
        </ul>
      )}
      <Button onClick={onGetStarted} size="lg">
        Jetzt starten
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
});

/**
 * No companies found state
 */
export const NoCompaniesState = memo(function NoCompaniesState({
  region,
  service,
  onBroaden,
  className,
}: {
  region?: string;
  service?: string;
  onBroaden?: () => void;
  className?: string;
}) {
  const description = region || service
    ? `Für ${service ? service + ' ' : ''}${region ? 'in ' + region : ''} wurden keine Firmen gefunden.`
    : 'In dieser Region wurden keine passenden Firmen gefunden.';

  return (
    <EmptyState
      icon={Search}
      title="Keine Firmen gefunden"
      description={description}
      action={onBroaden ? { 
        label: 'Suche erweitern', 
        onClick: onBroaden,
        variant: 'outline'
      } : undefined}
      className={className}
    />
  );
});
